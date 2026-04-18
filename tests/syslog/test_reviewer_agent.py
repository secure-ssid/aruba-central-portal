"""Tests for the reviewer agent and its clusterer integration.

All LLM calls are mocked — CI stays offline and deterministic.
"""

from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

import pytest

from pipeline.llm import LLMError, LLMResult
from pipeline.syslog.clusterer import cluster_once
from pipeline.syslog.reviewer_agent import (
    _parse_verdict,
    review_alert,
)
from pipeline.syslog.storage import SyslogStore


@pytest.fixture()
def store(tmp_path: Path) -> SyslogStore:
    s = SyslogStore(tmp_path / "syslog.db")
    yield s
    s.close()


def _ingest(store, *, when, code="STORM", serial="CNABC12345", hostname="AP-1",
            severity=6, source_ip="10.0.0.1"):
    return store.insert_event(
        received_at=when, event_time=when, source_ip=source_ip, transport="udp",
        facility=16, severity=severity, hostname=hostname, app_name="stm",
        proc_id=None, msg_id=None, device_serial=serial, device_name=hostname,
        event_code=code, message=f"{code} detail", raw=f"<134>...{code}",
        structured_data=None,
    )


# ──────────────── _parse_verdict ────────────────

def test_parse_verdict_clean_json():
    approved, notes = _parse_verdict('{"approved": true, "notes": "matches events"}')
    assert approved is True
    assert notes == "matches events"


def test_parse_verdict_rejects():
    approved, notes = _parse_verdict('{"approved": false, "notes": "invented port"}')
    assert approved is False
    assert notes == "invented port"


def test_parse_verdict_string_boolean():
    approved, _ = _parse_verdict('{"approved": "yes", "notes": ""}')
    assert approved is True
    approved, _ = _parse_verdict('{"approved": "no", "notes": ""}')
    assert approved is False


def test_parse_verdict_tolerates_prose_wrap():
    """LLMs often wrap JSON in fences / prose despite instructions."""
    text = 'Here is my verdict:\n```json\n{"approved": true, "notes": "ok"}\n```\n'
    approved, notes = _parse_verdict(text)
    assert approved is True and notes == "ok"


def test_parse_verdict_missing_key_pending():
    approved, notes = _parse_verdict('{"notes": "missing approved"}')
    assert approved is None
    assert "missing" in notes.lower()


def test_parse_verdict_no_json_pending():
    approved, notes = _parse_verdict("I approve this summary.")
    assert approved is None
    assert "no json" in notes.lower()


def test_parse_verdict_broken_json_pending():
    approved, notes = _parse_verdict('{"approved": true, "notes": "broken')
    assert approved is None
    assert "parse" in notes.lower() or "json" in notes.lower()


def test_parse_verdict_default_notes_when_blank():
    approved, notes = _parse_verdict('{"approved": true}')
    assert approved is True
    assert notes == "approved"


# ──────────────── review_alert (mocked LLM) ────────────────

def test_review_alert_approves():
    with patch(
        "pipeline.syslog.reviewer_agent.generate",
        return_value=LLMResult(
            text='{"approved": true, "notes": "consistent"}',
            provider="gemini", model="m",
        ),
    ):
        result = review_alert({"id": 1, "event_count": 5}, [], "AP-1 saw 5 events.")
    assert result.approved is True
    assert result.notes == "consistent"
    assert result.pending is False


def test_review_alert_rejects_hallucination():
    with patch(
        "pipeline.syslog.reviewer_agent.generate",
        return_value=LLMResult(
            text='{"approved": false, "notes": "mentions port 5 but events don\'t"}',
            provider="gemini", model="m",
        ),
    ):
        result = review_alert({"id": 1}, [], "Port 5 flapped.")
    assert result.approved is False
    assert "port 5" in result.notes.lower()


def test_review_alert_pending_on_malformed_json():
    with patch(
        "pipeline.syslog.reviewer_agent.generate",
        return_value=LLMResult(
            text="this looks fine to me", provider="gemini", model="m",
        ),
    ):
        result = review_alert({"id": 1}, [], "summary")
    assert result.pending is True
    assert result.approved is False   # pending ≠ approved
    assert "no json" in result.notes.lower()


def test_review_alert_propagates_llm_error():
    with patch(
        "pipeline.syslog.reviewer_agent.generate",
        side_effect=LLMError("network down"),
    ), pytest.raises(LLMError):
        review_alert({"id": 1}, [], "summary")


# ──────────────── clusterer integration ────────────────

def _seed_anomalous_incident(store, t):
    for i in range(25):
        _ingest(store, when=t + timedelta(seconds=i))


def test_approved_alert_lands_with_approved_flag_1(store):
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    _seed_anomalous_incident(store, t)
    with patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=LLMResult(text="summary", provider="gemini", model="m"),
    ), patch(
        "pipeline.syslog.clusterer.review_alert",
        return_value=__import__("pipeline.syslog.reviewer_agent", fromlist=["ReviewResult"])
            .ReviewResult(approved=True, notes="looks right", raw=""),
    ):
        cluster_once(store, now=t + timedelta(seconds=30))
    alert = store.list_alerts()[0]
    assert alert["approved"] == 1
    assert alert["review_notes"] == "looks right"


def test_rejected_alert_lands_with_approved_flag_minus_1(store):
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    _seed_anomalous_incident(store, t)
    from pipeline.syslog.reviewer_agent import ReviewResult
    with patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=LLMResult(text="bogus claim", provider="gemini", model="m"),
    ), patch(
        "pipeline.syslog.clusterer.review_alert",
        return_value=ReviewResult(approved=False, notes="invented port", raw=""),
    ):
        cluster_once(store, now=t + timedelta(seconds=30))
    alert = store.list_alerts()[0]
    assert alert["approved"] == -1
    assert "invented" in alert["review_notes"]


def test_pending_verdict_keeps_approved_flag_0(store):
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    _seed_anomalous_incident(store, t)
    from pipeline.syslog.reviewer_agent import ReviewResult
    with patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=LLMResult(text="s", provider="gemini", model="m"),
    ), patch(
        "pipeline.syslog.clusterer.review_alert",
        return_value=ReviewResult(
            approved=False, notes="no json", raw="blah", pending=True,
        ),
    ):
        cluster_once(store, now=t + timedelta(seconds=30))
    alert = store.list_alerts()[0]
    assert alert["approved"] == 0
    assert "pending" in alert["review_notes"].lower()


def test_reviewer_llm_error_leaves_pending(store):
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    _seed_anomalous_incident(store, t)
    with patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=LLMResult(text="s", provider="gemini", model="m"),
    ), patch(
        "pipeline.syslog.clusterer.review_alert",
        side_effect=LLMError("reviewer offline"),
    ):
        cluster_once(store, now=t + timedelta(seconds=30))
    alert = store.list_alerts()[0]
    assert alert["approved"] == 0
    assert "unavailable" in alert["review_notes"].lower()


def test_reviewer_skipped_for_fallback_summary(store):
    """If the writer failed and we used a fallback, the reviewer should NOT
    audit it — that's a deterministic summary, not an LLM output."""
    from pipeline.llm import LLMUnavailable
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    _seed_anomalous_incident(store, t)
    with patch(
        "pipeline.syslog.clusterer.write_alert",
        side_effect=LLMUnavailable("no LLM"),
    ), patch("pipeline.syslog.clusterer.review_alert") as reviewer:
        cluster_once(store, now=t + timedelta(seconds=30))
    assert not reviewer.called
    alert = store.list_alerts()[0]
    assert alert["review_notes"].startswith("fallback:")
    assert alert["approved"] == 0


def test_reviewer_env_disable(store, monkeypatch):
    """SYSLOG_REVIEWER_ENABLED=false → writer runs, reviewer skipped."""
    monkeypatch.setattr("pipeline.syslog.clusterer.REVIEWER_ENABLED", False)
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    _seed_anomalous_incident(store, t)
    with patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=LLMResult(text="s", provider="gemini", model="m"),
    ), patch("pipeline.syslog.clusterer.review_alert") as reviewer:
        cluster_once(store, now=t + timedelta(seconds=30))
    assert not reviewer.called
    alert = store.list_alerts()[0]
    assert alert["approved"] == 0   # default = pending when reviewer disabled
