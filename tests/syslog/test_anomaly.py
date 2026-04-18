"""Tests for the anomaly scorer and its integration with the clusterer."""

from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from pipeline.syslog.anomaly import score_incident
from pipeline.syslog.clusterer import cluster_once
from pipeline.syslog.storage import SyslogStore


@pytest.fixture()
def store(tmp_path: Path) -> SyslogStore:
    s = SyslogStore(tmp_path / "syslog.db")
    yield s
    s.close()


def _ingest(store: SyslogStore, *, when: datetime, serial="CNABC12345",
            hostname="AP-1", code="LINK_DOWN", severity=6, source_ip="10.0.0.1"):
    return store.insert_event(
        received_at=when,
        event_time=when,
        source_ip=source_ip,
        transport="udp",
        facility=16,
        severity=severity,
        hostname=hostname,
        app_name="stm",
        proc_id=None,
        msg_id=None,
        device_serial=serial,
        device_name=hostname,
        event_code=code,
        message=f"{code}",
        raw=f"<134>...{code}",
        structured_data=None,
    )


# ──────────────── bucketed_event_counts ────────────────

def test_bucketed_event_counts_basic(store):
    base = datetime(2026, 4, 17, 22, 0, tzinfo=timezone.utc)
    # Bucket A (22:00-22:05): 3 events
    for i in range(3):
        _ingest(store, when=base + timedelta(seconds=i * 30))
    # Bucket B (22:05-22:10): 1 event
    _ingest(store, when=base + timedelta(minutes=5, seconds=30))
    # Bucket C (22:10-22:15): current bucket, excluded from history
    _ingest(store, when=base + timedelta(minutes=11))

    counts = store.bucketed_event_counts(
        device_key="CNABC12345",
        event_code="LINK_DOWN",
        window_sec=300,
        since=base - timedelta(hours=1),
        before=base + timedelta(minutes=10),  # exclude bucket C
    )
    assert [n for _, n in counts] == [3, 1]


def test_bucketed_event_counts_nocode(store):
    # event_code=None filters to NULL rows only.
    base = datetime(2026, 4, 17, 22, 0, tzinfo=timezone.utc)
    _ingest(store, when=base, code=None)
    _ingest(store, when=base + timedelta(seconds=10), code="SOMETHING")
    counts = store.bucketed_event_counts(
        device_key="CNABC12345",
        event_code=None,
        window_sec=300,
        since=base - timedelta(hours=1),
        before=base + timedelta(minutes=5),
    )
    assert [n for _, n in counts] == [1]


# ──────────────── score_incident pure-function ────────────────

def test_cold_start_scales_by_divisor(store):
    """No history → score = current / COLD_DIVISOR, never a fake big number."""
    bucket = datetime(2026, 4, 17, 22, 0, tzinfo=timezone.utc)
    result = score_incident(
        store, device_key="NEW-DEVICE", event_code="BOOTING",
        current_count=5, bucket_start=bucket,
    )
    assert result.cold_start is True
    assert result.samples == 0
    assert result.score == 1.0  # 5 / 5 default divisor


def test_score_flat_history_zero(store):
    """Flat history of 2 events per bucket → an incident of 2 events scores 0."""
    bucket = datetime(2026, 4, 17, 22, 30, tzinfo=timezone.utc)
    # Seed 5 historical buckets each with 2 events
    for b in range(5):
        t = bucket - timedelta(minutes=5 * (b + 1))
        _ingest(store, when=t)
        _ingest(store, when=t + timedelta(seconds=30))

    result = score_incident(
        store, device_key="CNABC12345", event_code="LINK_DOWN",
        current_count=2, bucket_start=bucket,
    )
    assert result.cold_start is False
    assert result.samples == 5
    assert result.mean == 2.0
    assert result.score == 0.0  # right on the mean


def test_score_spike_above_flat_history(store):
    """Flat history of 2/bucket → suddenly 20 → large score (floored stddev 1)."""
    bucket = datetime(2026, 4, 17, 22, 30, tzinfo=timezone.utc)
    for b in range(5):
        t = bucket - timedelta(minutes=5 * (b + 1))
        _ingest(store, when=t)
        _ingest(store, when=t + timedelta(seconds=30))

    result = score_incident(
        store, device_key="CNABC12345", event_code="LINK_DOWN",
        current_count=20, bucket_start=bucket,
    )
    # mean=2, stddev=0 → floored to 1 → z = 18
    assert result.score == 18.0
    assert result.stddev == 0.0


def test_score_respects_variance(store):
    """History with real variance should not be overcalled."""
    bucket = datetime(2026, 4, 17, 22, 30, tzinfo=timezone.utc)
    # Historical counts: 1, 3, 5, 7, 9 → mean=5, stddev≈2.83
    counts_per_bucket = [1, 3, 5, 7, 9]
    for b, count in enumerate(counts_per_bucket):
        t = bucket - timedelta(minutes=5 * (b + 1))
        for i in range(count):
            _ingest(store, when=t + timedelta(seconds=i))

    result = score_incident(
        store, device_key="CNABC12345", event_code="LINK_DOWN",
        current_count=10, bucket_start=bucket,
    )
    # Expected score ≈ (10 - 5) / 2.83 ≈ 1.77 — not sigma-clipped to zero,
    # not crazy big either.
    assert result.cold_start is False
    assert 1.5 < result.score < 2.0


def test_score_below_mean_floored_to_zero(store):
    bucket = datetime(2026, 4, 17, 22, 30, tzinfo=timezone.utc)
    for b in range(5):
        t = bucket - timedelta(minutes=5 * (b + 1))
        for _ in range(10):
            _ingest(store, when=t + timedelta(seconds=_))

    result = score_incident(
        store, device_key="CNABC12345", event_code="LINK_DOWN",
        current_count=2, bucket_start=bucket,
    )
    assert result.score == 0.0  # quiet, not anomalous


def test_score_zero_count_short_circuits(store):
    bucket = datetime(2026, 4, 17, 22, 30, tzinfo=timezone.utc)
    result = score_incident(
        store, device_key="X", event_code="Y",
        current_count=0, bucket_start=bucket,
    )
    assert result.score == 0.0


# ──────────────── integration with clusterer ────────────────

def test_clusterer_persists_anomaly_score(store):
    """An incident built by cluster_once should get an anomaly_score written."""
    base = datetime.now(timezone.utc) - timedelta(minutes=2)
    for i in range(5):
        _ingest(store, when=base + timedelta(seconds=i))
    cluster_once(store)
    incidents = store.list_incidents()
    assert len(incidents) == 1
    # Cold start (no history) with 5 events / divisor 5 = score 1.0
    assert incidents[0]["anomaly_score"] == 1.0


def test_clusterer_score_increases_when_incident_grows(store):
    """A second tick with more events in the same bucket rescore the incident."""
    base = datetime.now(timezone.utc) - timedelta(minutes=1)
    _ingest(store, when=base)
    cluster_once(store)
    first = store.list_incidents()[0]["anomaly_score"]

    # Add more events to the SAME bucket (< 5 min later)
    for i in range(10):
        _ingest(store, when=base + timedelta(seconds=10 + i))
    cluster_once(store)
    second = store.list_incidents()[0]["anomaly_score"]
    assert second > first


def test_list_incidents_order_by_anomaly_score(store):
    base = datetime.now(timezone.utc) - timedelta(minutes=2)
    # Two separate (device, code) groups so we get two incidents.
    _ingest(store, when=base, serial="CN-QUIET", code="NOISE")
    for i in range(20):
        _ingest(store, when=base + timedelta(seconds=i), serial="CN-SPIKE", code="FLOOD",
                hostname="AP-SPIKE")
    cluster_once(store)

    by_anomaly = store.list_incidents(order_by="anomaly_score")
    assert by_anomaly[0]["cluster_signature"] != by_anomaly[1]["cluster_signature"]
    # The spike should be first because its score is higher.
    assert by_anomaly[0]["anomaly_score"] > by_anomaly[1]["anomaly_score"]


def test_list_incidents_anomaly_min_filter(store):
    base = datetime.now(timezone.utc) - timedelta(minutes=2)
    _ingest(store, when=base, code="QUIET")  # score ~ 0.2
    for i in range(15):
        _ingest(store, when=base + timedelta(seconds=i), code="LOUD")
    cluster_once(store)

    loud_only = store.list_incidents(anomaly_min=1.5)
    codes = {i["event_code"] for i in loud_only}
    assert "LOUD" in codes
    assert "QUIET" not in codes
