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
    WriterOutput,
    _build_prompt,
    _parse_output,
    fallback_summary,
    fallback_troubleshooting,
    write_alert,
)


def _wo(summary: str, steps=None) -> WriterOutput:
    """Shorthand to build a WriterOutput in tests."""
    return WriterOutput(
        summary=summary,
        troubleshooting=list(steps or []),
        provider="gemini", model="test", raw="",
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

def test_write_alert_returns_summary_and_troubleshooting():
    llm_text = (
        '{"summary": "AP-1 went down 5 times.", '
        ' "troubleshooting": ["Check AP-1 uplink.", "Review switch logs."]}'
    )
    with patch(
        "pipeline.syslog.writer_agent.generate",
        return_value=LLMResult(text=llm_text, provider="gemini", model="test"),
    ) as gen:
        result = write_alert(
            {"device_serial": "CN", "event_code": "X", "severity": 3,
             "event_count": 5, "first_seen": "a", "last_seen": "b",
             "anomaly_score": 3.0},
            [],
        )
    assert result.summary == "AP-1 went down 5 times."
    assert result.troubleshooting == ["Check AP-1 uplink.", "Review switch logs."]
    assert gen.called


def test_write_alert_falls_back_when_json_malformed():
    """LLM ignored our JSON instruction — we still surface the text as summary."""
    with patch(
        "pipeline.syslog.writer_agent.generate",
        return_value=LLMResult(text="plain text summary", provider="gemini", model="test"),
    ):
        result = write_alert({"event_count": 1}, [])
    assert result.summary == "plain text summary"
    assert result.troubleshooting == []


def test_parse_output_tolerates_json_fences():
    text = 'Sure!\n```json\n{"summary":"ok","troubleshooting":["a","b"]}\n```'
    s, ts, _ = _parse_output(text)
    assert s == "ok"
    assert ts == ["a", "b"]


def test_parse_output_strips_leading_and_trailing_fences():
    """Regression: LLM wraps the whole response in ```json...``` — previous
    parser leaked the fenced envelope into the summary column."""
    text = '```json\n{"summary": "real summary", "troubleshooting": ["x"]}\n```'
    s, ts, _ = _parse_output(text)
    assert s == "real summary"
    assert ts == ["x"]
    # Critically: the raw JSON string never appears in the summary.
    assert '"summary"' not in s
    assert not s.startswith("```")


def test_parse_output_multiline_json_with_nested_quotes():
    """Gemini often emits pretty-printed JSON with embedded quotes inside
    the summary. The first-brace / last-brace span must still parse."""
    text = (
        '{\n'
        '  "summary": "Device \\"AP-1\\" saw 12 events.",\n'
        '  "troubleshooting": ["check uplink", "inspect logs"]\n'
        '}'
    )
    s, ts, _ = _parse_output(text)
    assert 'AP-1' in s and '"' in s  # unescaped quote preserved
    assert ts == ["check uplink", "inspect logs"]


def test_parse_output_accepts_newline_delimited_troubleshooting():
    text = '{"summary":"x","troubleshooting":"- step a\\n- step b"}'
    s, ts, _ = _parse_output(text)
    assert s == "x"
    assert ts == ["step a", "step b"]


def test_fallback_troubleshooting_specializes_on_event_code():
    steps_storm = fallback_troubleshooting({"event_code": "BROADCAST_STORM"})
    assert any("loop" in s.lower() for s in steps_storm)
    steps_auth = fallback_troubleshooting({"event_code": "WPA_AUTH_FAIL"})
    assert any("radius" in s.lower() or "psk" in s.lower() for s in steps_auth)
    steps_none = fallback_troubleshooting({"event_code": None})
    assert len(steps_none) >= 3  # generic fallback still returns useful steps


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
        return_value=_wo("mocked summary", ["step A", "step B"]),
    ) as mock_writer:
        cluster_once(store, now=t + timedelta(seconds=30))

    incidents = store.list_incidents()
    assert len(incidents) == 1
    incident_id = incidents[0]["id"]
    alert = store.get_alert_by_incident(incident_id)
    assert alert is not None
    assert alert["summary"] == "mocked summary"
    # Troubleshooting survived the round trip through SQLite JSON column.
    assert alert["troubleshooting"] == ["step A", "step B"]
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
    # Fallback path also supplies troubleshooting steps so the UI isn't empty.
    assert isinstance(alert["troubleshooting"], list)
    assert len(alert["troubleshooting"]) > 0


def test_alert_is_upserted_not_duplicated(store):
    """Growing an incident with *novel* content re-summarizes and
    overwrites (single row). Uses two codes in the same WPA_HANDSHAKE
    family so clustering stays as one incident; the different codes
    produce different fingerprints so the LLM dedup doesn't skip the
    second pass."""
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    for i in range(25):
        _ingest(store, when=t + timedelta(seconds=i), code="132094")

    with patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=_wo("first", ["one"]),
    ):
        cluster_once(store, now=t + timedelta(seconds=30))

    # Different code in same family → same incident, different fingerprint.
    for i in range(25, 40):
        _ingest(store, when=t + timedelta(seconds=i), code="520013")

    # Disable the per-signature cooldown for this test so the novel-content
    # path actually re-invokes the writer. The cooldown is validated
    # independently in test_writer_skipped_by_cooldown.
    with patch("pipeline.syslog.clusterer.WRITER_COOLDOWN_SEC", 0), patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=_wo("second", ["two"]),
    ):
        cluster_once(store, now=t + timedelta(seconds=45))

    incidents = store.list_incidents()
    assert len(incidents) == 1, f"expected 1 incident (same family), got {incidents}"
    alerts = store.list_alerts()
    assert len(alerts) == 1
    assert alerts[0]["summary"] == "second"


def test_writer_skipped_when_fingerprints_unchanged(store):
    """Phase 13 dedup: if the next cluster tick brings only events with
    fingerprints already covered, the writer is NOT called — saves LLM
    quota when a bad client emits the same line thousands of times."""
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    for i in range(25):
        _ingest(store, when=t + timedelta(seconds=i), code="STORM")

    with patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=_wo("first summary", ["a"]),
    ) as first:
        cluster_once(store, now=t + timedelta(seconds=30))
    assert first.call_count == 1

    # Add more identical events — same code, same default message.
    for i in range(25, 40):
        _ingest(store, when=t + timedelta(seconds=i), code="STORM")

    with patch("pipeline.syslog.clusterer.write_alert") as second:
        cluster_once(store, now=t + timedelta(seconds=45))
    assert second.call_count == 0, "writer should be skipped when fingerprints unchanged"

    # The original summary is preserved.
    alerts = store.list_alerts()
    assert len(alerts) == 1
    assert alerts[0]["summary"] == "first summary"


# ──────────────── reviewer stub (approval flag persistence) ────────────

def test_update_alert_review_roundtrip(store):
    # Direct exercise of the reviewer-facing API: store a pending alert,
    # then flip it to approved with notes.
    t = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    for i in range(25):
        _ingest(store, when=t + timedelta(seconds=i))
    with patch(
        "pipeline.syslog.clusterer.write_alert",
        return_value=_wo("s"),
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
