"""Tests for the writer agent and its clusterer integration.

These tests never call a real LLM — they monkeypatch `pipeline.llm.generate`
so CI stays offline and deterministic.
"""

from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

import pytest

from pipeline.llm import LLMError, LLMResult, LLMUnavailable
from pipeline.syslog.clusterer import cluster_once
from pipeline.syslog.reviewer_agent import ReviewResult
from pipeline.syslog.storage import SyslogStore
from pipeline.syslog.writer_agent import (
    _build_prompt,
    fallback_summary,
    write_alert,
)


@pytest.fixture(autouse=True)
def _stub_reviewer():
    """Default: reviewer approves. Individual tests override as needed."""
    with patch(
        "pipeline.syslog.clusterer.review_alert",
        return_value=ReviewResult(approved=True, notes="ok", raw="{}"),
    ) as m:
        yield m


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


# ──────────────── _build_prompt ────────────────

def test_build_prompt_includes_key_fields():
    incident = {
        "id": 7, "device_serial": "CN-X", "event_code": "LINK_DOWN",
        "severity": 3, "event_count": 5, "first_seen": "t1", "last_seen": "t2",
        "anomaly_score": 4.2,
    }
    events = [{"message": "port 1 down", "hostname": "sw-1",
               "event_time": "t1", "received_at": "t1"}]
    prompt = _build_prompt(incident, events)
    for needle in ("CN-X", "LINK_DOWN", "error", "5", "4.2", "sw-1", "port 1 down"):
        assert needle in prompt, f"prompt missing: {needle!r}"


def test_build_prompt_handles_dataclass_events(store):
    t = datetime.now(timezone.utc)
    _ingest(store, when=t)
    events = store.list_events(limit=10)
    prompt = _build_prompt(
        {"device_serial": "CN", "event_code": "STORM", "severity": 6,
         "event_count": 1, "first_seen": "a", "last_seen": "b",
         "anomaly_score": 1.0},
        events,
    )
    assert "AP-1" in prompt and "STORM" in prompt


# ──────────────── write_alert (mocked) ────────────────

def test_write_alert_returns_llm_result():
    with patch(
        "pipeline.syslog.writer_agent.generate",
        return_value=LLMResult(text="AP-1 went down 5 times.", provider="gemini", model="test"),
    ) as gen:
        result = write_alert(
            {"device_serial": "CN", "event_code": "X", "severity": 3,
             "event_count": 5, "first_seen": "a", "last_seen": "b",
             "anomaly_score": 3.0},
            [],
        )
    assert result.text == "AP-1 went down 5 times."
    assert gen.called


def test_write_alert_propagates_errors():
    with patch(
        "pipeline.syslog.writer_agent.generate",
        side_effect=LLMError("boom"),
    ), pytest.raises(LLMError):
        write_alert({"event_count": 1}, [])


# ──────────────── fallback_summary ────────────────

def test_fallback_summary_mentions_count_and_device():
    summary = fallback_summary({
        "device_serial": "CNABC12345", "event_code": "LINK_DOWN",
        "event_count": 42, "anomaly_score": 3.4,
        "first_seen": "2026-04-17T22:00:00Z", "last_seen": "2026-04-17T22:05:00Z",
    })
    assert "CNABC12345" in summary
    assert "42" in summary
    assert "LINK_DOWN" in summary
    assert "3.4" in summary  # anomaly mentioned on high scores


def test_fallback_summary_omits_anomaly_tail_when_low():
    summary = fallback_summary({
        "device_serial": "X", "event_code": "Y", "event_count": 1,
        "anomaly_score": 0.5, "first_seen": "a", "last_seen": "b",
    })
    assert "Anomaly score" not in summary


# ──────────────── clusterer integration ────────────────

def test_clusterer_writes_alert_for_anomalous_incident(store):
    # Simulate a big burst with no prior history → cold start score 5.0
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    for i in range(25):
        _ingest(store, when=t + timedelta(seconds=i))

    with patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=LLMResult(text="mocked summary", provider="gemini", model="m"),
    ) as mock_writer:
        cluster_once(store, now=t + timedelta(seconds=30))

    incidents = store.list_incidents()
    assert len(incidents) == 1
    incident_id = incidents[0]["id"]
    alert = store.get_alert_by_incident(incident_id)
    assert alert is not None
    assert alert["summary"] == "mocked summary"
    # Auto-stubbed reviewer approves → alerts.approved == 1
    assert alert["approved"] == 1
    assert mock_writer.called


def test_clusterer_skips_writer_below_threshold(store, monkeypatch):
    """A low-anomaly incident should NOT call the writer."""
    monkeypatch.setattr("pipeline.syslog.clusterer.WRITER_THRESHOLD", 999.0)
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    _ingest(store, when=t)
    with patch("pipeline.syslog.clusterer.write_alert") as mock_writer:
        cluster_once(store, now=t + timedelta(seconds=10))
    assert not mock_writer.called
    incidents = store.list_incidents()
    assert len(incidents) == 1
    assert store.get_alert_by_incident(incidents[0]["id"]) is None


def test_clusterer_uses_fallback_when_llm_unavailable(store):
    """LLMUnavailable → fallback summary is persisted, incident still flagged."""
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    for i in range(25):
        _ingest(store, when=t + timedelta(seconds=i))

    with patch(
        "pipeline.syslog.clusterer.write_alert",
        side_effect=LLMUnavailable("no provider"),
    ):
        cluster_once(store, now=t + timedelta(seconds=30))

    incidents = store.list_incidents()
    alert = store.get_alert_by_incident(incidents[0]["id"])
    assert alert is not None
    assert alert["review_notes"].startswith("fallback:")
    assert "25x" in alert["summary"]  # came from fallback_summary


def test_alert_is_upserted_not_duplicated(store):
    """Re-running the clusterer on a growing incident must overwrite, not append."""
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    for i in range(25):
        _ingest(store, when=t + timedelta(seconds=i))

    with patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=LLMResult(text="first", provider="gemini", model="m"),
    ):
        cluster_once(store, now=t + timedelta(seconds=30))

    # More events, same bucket.
    for i in range(25, 40):
        _ingest(store, when=t + timedelta(seconds=i))

    with patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=LLMResult(text="second", provider="gemini", model="m"),
    ):
        cluster_once(store, now=t + timedelta(seconds=45))

    alerts = store.list_alerts()
    assert len(alerts) == 1
    assert alerts[0]["summary"] == "second"


# ──────────────── reviewer stub (approval flag persistence) ────────────

def test_update_alert_review_roundtrip(store):
    # Direct exercise of the reviewer-facing API: store a pending alert,
    # then flip it to approved with notes.
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    for i in range(25):
        _ingest(store, when=t + timedelta(seconds=i))
    with patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=LLMResult(text="s", provider="gemini", model="m"),
    ):
        cluster_once(store, now=t + timedelta(seconds=30))

    alert = store.list_alerts()[0]
    # Auto-stubbed reviewer approved it → flip to rejected here to prove
    # the manual-override API round-trips independently of what the
    # reviewer decided.
    store.update_alert_review(alert["id"], review_notes="operator rejected", approved=-1)
    after = store.list_alerts()[0]
    assert after["approved"] == -1
    assert after["review_notes"] == "operator rejected"

    with pytest.raises(ValueError):
        store.update_alert_review(alert["id"], review_notes="x", approved=7)
