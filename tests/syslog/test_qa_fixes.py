"""Regression tests for the QA-identified correctness fixes (Phase 13c).

Each test pins a single failure mode that the audit called out — names
start with "test_qa_" so they're easy to grep later if the fix is ever
reverted.
"""

from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from pipeline.actions.executor import ExecutionError, execute_action
from pipeline.syslog.clusterer import cluster_once
from pipeline.syslog.reviewer_agent import _parse_verdict
from pipeline.syslog.storage import SyslogStore
from pipeline.syslog.writer_agent import _parse_output


@pytest.fixture()
def store(tmp_path: Path) -> SyslogStore:
    s = SyslogStore(tmp_path / "syslog.db")
    yield s
    s.close()


def _ingest(store, *, when, serial="CNABC12345", device_name="AP-1",
            code="STORM", severity=6, source_ip="10.0.0.1"):
    return store.insert_event(
        received_at=when, event_time=when, source_ip=source_ip, transport="udp",
        facility=16, severity=severity, hostname=device_name, app_name="stm",
        proc_id=None, msg_id=None, device_serial=serial, device_name=device_name,
        event_code=code, message=f"{code}", raw=f"<134>{code}", structured_data=None,
    )


# ──────────────── QA fix: sliding window no longer matches NULL devices ────────────────

def test_qa_sliding_window_requires_device_match(store):
    """Previously `device_serial IS NULL` in the SQL pulled every unnamed
    incident into the sliding-window candidate list, letting a new event
    from device A extend an incident that had no device info at all."""
    t = datetime(2026, 4, 17, 22, 4, 30, tzinfo=timezone.utc)

    # Seed one event WITHOUT a device_serial (parser failed to extract)
    _ingest(store, when=t, serial=None, device_name=None, source_ip="10.0.0.99")
    cluster_once(store, now=t + timedelta(seconds=30),
                 lookback=timedelta(days=3650))
    assert len(store.list_incidents()) == 1
    unnamed_id = store.list_incidents()[0]["id"]

    # Now an event 2 minutes later from a DIFFERENT, NAMED device.
    t2 = t + timedelta(minutes=2)
    _ingest(store, when=t2, serial="CNOTHER99", device_name="AP-OTHER",
            source_ip="10.0.0.50")
    cluster_once(store, now=t2 + timedelta(seconds=30),
                 lookback=timedelta(days=3650))

    incidents = store.list_incidents()
    # Before the fix this was 1 — the named event would silently extend
    # the unnamed incident. After the fix: two separate incidents.
    assert len(incidents) == 2
    assert any(i["id"] == unnamed_id for i in incidents)


# ──────────────── QA fix: severity None doesn't stick ────────────────

def test_qa_severity_not_stuck_at_none_when_first_event_missing(store):
    """Old code: if the first event in a group had `severity=None`, the
    group's severity was set to None and never upgraded. Fix: only
    touch severity when the event brings a real number."""
    t = datetime(2026, 4, 18, 0, 0, 30, tzinfo=timezone.utc)
    # First event has no severity
    _ingest(store, when=t, severity=None)
    # Later event (same bucket, same code) has severity=3 (error)
    _ingest(store, when=t + timedelta(seconds=10), severity=3)

    cluster_once(store, now=t + timedelta(seconds=30),
                 lookback=timedelta(days=3650))
    incidents = store.list_incidents()
    assert len(incidents) == 1
    assert incidents[0]["severity"] == 3  # not None


# ──────────────── QA fix: reviewer tolerates fenced JSON ────────────────

def test_qa_reviewer_parse_tolerates_json_fences():
    """Previously the reviewer's greedy `\\{.*\\}` with fenced JSON could
    return None because json.loads hit the trailing fence. Aligned with
    writer's parser: strip fences first, then first-brace to last-brace."""
    text = '```json\n{"approved": true, "notes": "ok"}\n```'
    approved, notes = _parse_verdict(text)
    assert approved is True
    assert notes == "ok"


def test_qa_reviewer_parse_multiline_with_escaped_quotes():
    text = (
        '{\n'
        '  "approved": false,\n'
        '  "notes": "port \\"1/0/3\\" still showing down"\n'
        '}'
    )
    approved, notes = _parse_verdict(text)
    assert approved is False
    assert '"1/0/3"' in notes


def test_qa_reviewer_parse_empty_text_returns_pending():
    approved, notes = _parse_verdict("")
    assert approved is None
    assert "empty" in notes.lower()


# ──────────────── QA fix: fallback never leaks raw JSON ────────────────

def test_qa_writer_fallback_does_not_leak_fenced_json():
    """If the LLM returns garbled JSON we can't parse, the summary must
    not contain fences or `"summary":` — operators saw that in prod."""
    text = '```json\n{"summary": "unclosed'  # malformed, no closing
    summary, steps, _ = _parse_output(text)
    assert "```" not in summary
    assert '"summary"' not in summary
    assert steps == []


def test_qa_writer_fallback_clean_text_passes_through():
    """If the LLM returns a plain sentence (no JSON at all), we still
    surface it — fallback shouldn't be *too* aggressive."""
    text = "Device AP-1 lost uplink for 30 seconds."
    summary, steps, _ = _parse_output(text)
    assert summary == "Device AP-1 lost uplink for 30 seconds."


# ──────────────── QA fix: prune no longer VACUUMs by default ────────────────

def test_qa_prune_does_not_vacuum_without_opt_in(store, monkeypatch):
    """Default behavior: DELETE rows, skip VACUUM. VACUUM takes an
    exclusive lock and blocks dashboard reads — opt-in only.

    Verification strategy: patch sqlite3.connect so we'd observe an
    extra connection being opened for the aux VACUUM. With the env
    flag unset, no extra connection should be opened.
    """
    monkeypatch.delenv("SYSLOG_VACUUM_AFTER_PRUNE", raising=False)
    _ingest(store, when=datetime.now(timezone.utc) - timedelta(days=30))

    import sqlite3
    import pipeline.syslog.storage as storage_mod
    with patch.object(storage_mod.sqlite3, "connect",
                      wraps=sqlite3.connect) as spy:
        deleted = store.prune_older_than(days=7)
    assert deleted >= 1
    assert spy.call_count == 0, \
        "prune opened a new sqlite connection — it must not VACUUM unless opted in"


def test_qa_prune_vacuums_when_opted_in(store, monkeypatch):
    """Flip the flag → auxiliary connection opens to run VACUUM."""
    monkeypatch.setenv("SYSLOG_VACUUM_AFTER_PRUNE", "true")
    _ingest(store, when=datetime.now(timezone.utc) - timedelta(days=30))

    import sqlite3
    import pipeline.syslog.storage as storage_mod
    with patch.object(storage_mod.sqlite3, "connect",
                      wraps=sqlite3.connect) as spy:
        store.prune_older_than(days=7)
    assert spy.call_count == 1


# ──────────────── QA fix: executor survives DB-lock on status write ────────────────

def test_qa_executor_survives_status_write_failure():
    """If `update_proposed_action` throws mid-cleanup (e.g. DB lock),
    `execute_action` should still raise the original ExecutionError
    and not mask it with the secondary failure."""
    store = MagicMock()
    store.get_proposed_action.return_value = {
        "id": 1,
        "action_type": "dfs_optimization",
        "status": "approved",
    }

    def boom_handler(_row, _client):
        raise RuntimeError("handler died")

    # The secondary update also fails — must not escape.
    store.update_proposed_action.side_effect = RuntimeError("db locked")

    from pipeline.actions import executor as mod
    with patch.dict(mod.HANDLERS, {"dfs_optimization": boom_handler}):
        with pytest.raises(ExecutionError) as excinfo:
            execute_action(store, 1)
    assert "handler died" in str(excinfo.value)
