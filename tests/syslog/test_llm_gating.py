"""Phase 14a — pre-LLM gate stack.

Each test drives one gate in isolation by monkey-patching the module
constants so the rest of the clusterer behaves normally. `write_alert`
and `review_alert` are patched to `MagicMock`s so we can assert call
counts directly — no real LLM traffic.
"""

from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from pipeline.syslog.clusterer import cluster_once
from pipeline.syslog.reviewer_agent import ReviewResult
from pipeline.syslog.storage import SyslogStore
from pipeline.syslog.writer_agent import WriterOutput


def _wo(summary: str = "s", steps=None) -> WriterOutput:
    return WriterOutput(summary=summary, troubleshooting=list(steps or ["x"]),
                        provider="gemini", model="test", raw="")


@pytest.fixture()
def store(tmp_path: Path) -> SyslogStore:
    s = SyslogStore(tmp_path / "syslog.db")
    yield s
    s.close()


def _ingest(store, *, when, code="132094", serial="CNABC12345",
            hostname="AP-1", severity=3, msg="fail", source_ip="10.0.0.1"):
    return store.insert_event(
        received_at=when, event_time=when, source_ip=source_ip, transport="udp",
        facility=16, severity=severity, hostname=hostname, app_name="stm",
        proc_id=None, msg_id=None, device_serial=serial, device_name=hostname,
        event_code=code, message=msg, raw=f"<134>...{code} {msg}",
        structured_data=None,
    )


@pytest.fixture(autouse=True)
def _stub_reviewer():
    with patch(
        "pipeline.syslog.clusterer.review_alert",
        return_value=ReviewResult(approved=True, notes="ok", raw="{}"),
    ) as m:
        yield m


# ──────────────── Gate 1: min cluster size ────────────────

def test_writer_skipped_below_min_events(store):
    """Single-event 'anomaly' never hits the LLM."""
    t = datetime(2026, 4, 18, 12, 0, tzinfo=timezone.utc)
    _ingest(store, when=t)  # 1 event only

    writer = MagicMock(return_value=_wo())
    # Force anomaly threshold low so that score alone wouldn't block.
    with patch("pipeline.syslog.clusterer.write_alert", writer), \
         patch("pipeline.syslog.clusterer.WRITER_THRESHOLD", 0.0), \
         patch("pipeline.syslog.clusterer.WRITER_MIN_EVENTS", 5):
        cluster_once(store, now=t + timedelta(seconds=30))

    assert writer.call_count == 0
    metrics = store.get_llm_metrics()
    assert metrics["today"]["calls_skipped_min_size"] >= 1


# ──────────────── Gate 3: signature cache hit ────────────────

def test_writer_skipped_by_cache_on_replay(store):
    """Second tick with the same fingerprints reuses the cached summary
    instead of calling the LLM — across what would be an alert-row rebuild."""
    t = datetime(2026, 4, 18, 12, 0, tzinfo=timezone.utc)
    for i in range(10):
        _ingest(store, when=t + timedelta(seconds=i))

    writer = MagicMock(return_value=_wo("first"))
    with patch("pipeline.syslog.clusterer.write_alert", writer), \
         patch("pipeline.syslog.clusterer.WRITER_THRESHOLD", 0.0):
        cluster_once(store, now=t + timedelta(seconds=30))
    assert writer.call_count == 1

    # Simulate an alert-row wipe (but cache persists) then re-cluster.
    # The fingerprint-unchanged gate would also catch this, so clear the
    # alert's fingerprints_hash to force the cache gate specifically.
    alert = store.list_alerts()[0]
    store._conn.execute(
        "UPDATE alerts SET fingerprints_hash = NULL WHERE id = ?", (alert["id"],),
    )

    for i in range(10, 20):
        _ingest(store, when=t + timedelta(seconds=i))  # same code+msg
    with patch("pipeline.syslog.clusterer.write_alert", writer), \
         patch("pipeline.syslog.clusterer.WRITER_THRESHOLD", 0.0):
        cluster_once(store, now=t + timedelta(seconds=60))

    assert writer.call_count == 1, "cache should have prevented a 2nd call"
    metrics = store.get_llm_metrics()
    assert metrics["today"]["calls_skipped_cache"] >= 1


# ──────────────── Gate 4: per-signature cooldown ────────────────

def test_writer_skipped_by_cooldown(store):
    """Novel fingerprint within the cooldown window still skips."""
    t = datetime(2026, 4, 18, 12, 0, tzinfo=timezone.utc)
    for i in range(10):
        _ingest(store, when=t + timedelta(seconds=i), code="132094")

    writer = MagicMock(return_value=_wo("first"))
    with patch("pipeline.syslog.clusterer.write_alert", writer), \
         patch("pipeline.syslog.clusterer.WRITER_THRESHOLD", 0.0):
        cluster_once(store, now=t + timedelta(seconds=30))
    assert writer.call_count == 1

    # New code → new fingerprint, same family (WPA_HANDSHAKE) → same incident.
    for i in range(10, 20):
        _ingest(store, when=t + timedelta(seconds=i), code="520013")

    with patch("pipeline.syslog.clusterer.write_alert", writer), \
         patch("pipeline.syslog.clusterer.WRITER_THRESHOLD", 0.0), \
         patch("pipeline.syslog.clusterer.WRITER_COOLDOWN_SEC", 3600):
        cluster_once(store, now=t + timedelta(seconds=60))

    assert writer.call_count == 1, "cooldown should block the 2nd call"
    metrics = store.get_llm_metrics()
    assert metrics["today"]["calls_skipped_cooldown"] >= 1


# ──────────────── Gate 5: per-tick cap ────────────────

def test_writer_respects_tick_cap(store):
    """With a tick cap of 1 and 3 distinct incidents, only 1 LLM call fires."""
    t = datetime(2026, 4, 18, 12, 0, tzinfo=timezone.utc)
    for serial in ("CN-A", "CN-B", "CN-C"):
        for i in range(5):
            _ingest(store, when=t + timedelta(seconds=i),
                    serial=serial, hostname=f"AP-{serial}")

    writer = MagicMock(return_value=_wo())
    with patch("pipeline.syslog.clusterer.write_alert", writer), \
         patch("pipeline.syslog.clusterer.WRITER_THRESHOLD", 0.0), \
         patch("pipeline.syslog.clusterer.WRITER_MAX_CALLS_PER_TICK", 1):
        cluster_once(store, now=t + timedelta(seconds=30))

    assert writer.call_count == 1
    metrics = store.get_llm_metrics()
    assert metrics["today"]["calls_skipped_tick_cap"] >= 2


# ──────────────── Gate 6: daily cap ────────────────

def test_writer_respects_daily_cap(store):
    """Pre-bumping the day's counter to the cap blocks new LLM calls."""
    t = datetime(2026, 4, 18, 12, 0, tzinfo=timezone.utc)
    for i in range(10):
        _ingest(store, when=t + timedelta(seconds=i))

    # Simulate a prior-today usage at the cap.
    for _ in range(5):
        store.incr_llm_metric("calls_made")

    writer = MagicMock(return_value=_wo())
    with patch("pipeline.syslog.clusterer.write_alert", writer), \
         patch("pipeline.syslog.clusterer.WRITER_THRESHOLD", 0.0), \
         patch("pipeline.syslog.clusterer.WRITER_DAILY_CAP", 5):
        cluster_once(store, now=t + timedelta(seconds=30))

    assert writer.call_count == 0
    metrics = store.get_llm_metrics()
    assert metrics["today"]["calls_skipped_daily_cap"] >= 1


# ──────────────── Cache round-trip on storage ────────────────

def test_cache_stores_and_returns_troubleshooting(store):
    store.put_cached_summary(
        signature="sig-abc",
        fingerprints_hash="fp-1",
        summary="a bad day",
        troubleshooting=["step 1", "step 2"],
        review_notes="ok",
        approved=1,
    )
    hit = store.get_cached_summary("sig-abc", "fp-1")
    assert hit is not None
    assert hit["summary"] == "a bad day"
    assert hit["troubleshooting"] == ["step 1", "step 2"]
    assert hit["approved"] == 1
    # Fingerprint mismatch → cache miss.
    assert store.get_cached_summary("sig-abc", "fp-2") is None
