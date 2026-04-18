"""Tests for the rule-based clusterer."""

from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from pipeline.syslog.clusterer import _bucket_start, _signature, cluster_once
from pipeline.syslog.storage import SyslogStore


@pytest.fixture()
def store(tmp_path: Path) -> SyslogStore:
    s = SyslogStore(tmp_path / "syslog.db")
    yield s
    s.close()


def _ingest(store: SyslogStore, *, serial="CNABC12345", code="AP_LINK_UP", when: datetime, severity=6):
    return store.insert_event(
        received_at=when,
        event_time=when,
        source_ip="10.0.0.1",
        transport="udp",
        facility=16,
        severity=severity,
        hostname="AP-1",
        app_name="stm",
        proc_id=None,
        msg_id=None,
        device_serial=serial,
        device_name="AP-1",
        event_code=code,
        message=f"{code} happened",
        raw=f"<134>...{code}",
        structured_data=None,
    )


def test_bucket_start_aligns():
    ts = datetime(2026, 4, 17, 22, 13, 45, tzinfo=timezone.utc)
    bucket = _bucket_start(ts, timedelta(minutes=5))
    assert bucket == datetime(2026, 4, 17, 22, 10, 0, tzinfo=timezone.utc)


def test_signature_stable():
    bucket = datetime(2026, 4, 17, 22, 10, tzinfo=timezone.utc)
    a = _signature("CN1", "LINK_DOWN", bucket)
    b = _signature("CN1", "LINK_DOWN", bucket)
    c = _signature("CN2", "LINK_DOWN", bucket)
    assert a == b and a != c and len(a) == 16


def test_same_device_same_code_same_bucket_clusters(store):
    # Pin all events inside a single aligned 5-minute bucket so this test
    # can't flake near a bucket boundary (wall-clock-dependent otherwise).
    t0 = datetime(2026, 4, 17, 22, 12, 30, tzinfo=timezone.utc)  # inside 22:10-22:15
    for i in range(4):
        _ingest(store, when=t0 + timedelta(seconds=i * 10))
    result = cluster_once(
        store,
        lookback=timedelta(days=3650),  # wall-clock independent
        now=t0 + timedelta(seconds=45),
    )
    assert result.processed == 4
    assert result.new_incidents == 1
    incidents = store.list_incidents()
    assert len(incidents) == 1
    assert incidents[0]["event_count"] == 4


def test_different_codes_make_separate_incidents(store):
    # Use two codes in DIFFERENT families (broadcast storm vs DHCP) —
    # LINK_UP / LINK_DOWN are now in the same LINK_STATE family by
    # design (they describe the same port-flap story).
    t0 = datetime.now(timezone.utc) - timedelta(minutes=2)
    _ingest(store, code="BROADCAST_STORM_DETECTED", when=t0)
    _ingest(store, code="DHCP_POOL_EXHAUSTED", when=t0 + timedelta(seconds=10))
    result = cluster_once(store)
    assert result.new_incidents == 2


def test_different_buckets_make_separate_incidents(store):
    # Two events far apart → two incidents even with same device+code.
    t1 = datetime.now(timezone.utc) - timedelta(minutes=15)
    t2 = datetime.now(timezone.utc) - timedelta(minutes=2)
    _ingest(store, when=t1)
    _ingest(store, when=t2)
    result = cluster_once(store)
    assert result.new_incidents == 2


def test_idempotent_reruns(store):
    """Running the clusterer twice must not duplicate work."""
    t0 = datetime.now(timezone.utc) - timedelta(minutes=1)
    _ingest(store, when=t0)
    _ingest(store, when=t0 + timedelta(seconds=5))
    first = cluster_once(store)
    second = cluster_once(store)
    assert first.processed == 2 and second.processed == 0
    assert second.new_incidents == 0
    assert len(store.list_incidents()) == 1


def test_late_event_extends_existing_incident(store):
    """An event ingested after the first tick but in the same bucket
    should extend the existing incident, not create a new one."""
    t0 = datetime.now(timezone.utc) - timedelta(minutes=1)
    _ingest(store, when=t0)
    cluster_once(store)
    _ingest(store, when=t0 + timedelta(seconds=30))  # still same 5-min bucket
    result = cluster_once(store)
    assert result.new_incidents == 0
    assert result.incidents_touched == 1
    incidents = store.list_incidents()
    assert len(incidents) == 1
    assert incidents[0]["event_count"] == 2


def test_severity_is_minimum(store):
    """Most severe (lowest number) wins on the incident."""
    t0 = datetime.now(timezone.utc) - timedelta(seconds=30)
    _ingest(store, when=t0, severity=6)  # info
    _ingest(store, when=t0 + timedelta(seconds=1), severity=3)  # error
    _ingest(store, when=t0 + timedelta(seconds=2), severity=5)  # notice
    cluster_once(store)
    incidents = store.list_incidents()
    assert incidents[0]["severity"] == 3


def test_incident_events_roundtrip(store):
    t0 = datetime.now(timezone.utc) - timedelta(seconds=30)
    ids = [_ingest(store, when=t0 + timedelta(seconds=i)) for i in range(3)]
    cluster_once(store)
    incident = store.list_incidents()[0]
    events = store.incident_events(incident["id"])
    assert {e.id for e in events} == set(ids)


def test_status_transition(store):
    t0 = datetime.now(timezone.utc) - timedelta(seconds=10)
    _ingest(store, when=t0)
    cluster_once(store)
    incident = store.list_incidents()[0]
    assert incident["status"] == "open"
    assert store.update_incident_status(incident["id"], "ack")
    assert store.get_incident(incident["id"])["status"] == "ack"
    with pytest.raises(ValueError):
        store.update_incident_status(incident["id"], "bogus")


def test_missing_code_still_clusters_by_device(store):
    t0 = datetime.now(timezone.utc) - timedelta(seconds=30)
    for i in range(3):
        _ingest(store, code=None, when=t0 + timedelta(seconds=i))
    cluster_once(store)
    incidents = store.list_incidents()
    assert len(incidents) == 1
    assert incidents[0]["event_count"] == 3


def test_lookback_excludes_ancient_events(store):
    # Event outside the lookback window is ignored.
    t_old = datetime.now(timezone.utc) - timedelta(hours=5)
    _ingest(store, when=t_old)
    result = cluster_once(store, lookback=timedelta(minutes=30))
    assert result.processed == 0


# ──────────────── Phase 9: family-based + sliding-window clustering ────────

def test_related_codes_cluster_into_same_family(store):
    """AOS emits 132094 (MIC failure) and 520013 (handshake timeout) together
    for the same WPA failure. They must land in ONE incident."""
    t = datetime(2026, 4, 18, 0, 0, 30, tzinfo=timezone.utc)
    for i in range(5):
        _ingest(store, code="132094", when=t + timedelta(seconds=i))
    for i in range(5):
        _ingest(store, code="520013", when=t + timedelta(seconds=i + 10))

    cluster_once(store, now=t + timedelta(seconds=30),
                 lookback=timedelta(days=3650))
    incidents = store.list_incidents()
    assert len(incidents) == 1
    assert incidents[0]["event_count"] == 10


def test_continuous_activity_merges_across_bucket_boundary(store):
    """(device, family) events that span the 5-min bucket boundary should
    merge into ONE incident now that we have sliding-window extension."""
    # First bucket (0:00-0:05): 5 events ending at 0:04:30
    t0 = datetime(2026, 4, 18, 0, 4, 30, tzinfo=timezone.utc)
    for i in range(5):
        _ingest(store, code="132094", when=t0 + timedelta(seconds=i))
    cluster_once(store, now=t0 + timedelta(seconds=30),
                 lookback=timedelta(days=3650))
    assert len(store.list_incidents()) == 1
    first_id = store.list_incidents()[0]["id"]

    # Second bucket (0:05-0:10): 5 more events starting at 0:05:10 — within
    # 5 min of the previous last_seen, so should extend the same incident.
    t1 = datetime(2026, 4, 18, 0, 5, 10, tzinfo=timezone.utc)
    for i in range(5):
        _ingest(store, code="132094", when=t1 + timedelta(seconds=i))
    cluster_once(store, now=t1 + timedelta(seconds=30),
                 lookback=timedelta(days=3650))

    incidents = store.list_incidents()
    assert len(incidents) == 1
    assert incidents[0]["id"] == first_id
    assert incidents[0]["event_count"] == 10


def test_gap_longer_than_window_still_starts_new_incident(store):
    """If the next burst arrives > window later, it's a new incident."""
    t0 = datetime(2026, 4, 18, 0, 0, 30, tzinfo=timezone.utc)
    for i in range(3):
        _ingest(store, code="132094", when=t0 + timedelta(seconds=i))
    cluster_once(store, now=t0 + timedelta(seconds=30),
                 lookback=timedelta(days=3650))

    # 10 minutes later (window = 5 min default) → new incident
    t1 = datetime(2026, 4, 18, 0, 10, 30, tzinfo=timezone.utc)
    for i in range(3):
        _ingest(store, code="132094", when=t1 + timedelta(seconds=i))
    cluster_once(store, now=t1 + timedelta(seconds=30),
                 lookback=timedelta(days=3650))

    assert len(store.list_incidents()) == 2


def test_different_families_do_not_merge_on_same_device(store):
    """Different root causes (WPA vs broadcast storm) stay separate even
    on the same AP in the same window."""
    t = datetime(2026, 4, 18, 0, 0, 30, tzinfo=timezone.utc)
    for i in range(5):
        _ingest(store, code="132094", when=t + timedelta(seconds=i))  # WPA_HANDSHAKE
    for i in range(5):
        _ingest(store, code="BROADCAST_STORM_DETECTED", when=t + timedelta(seconds=i + 10))

    cluster_once(store, now=t + timedelta(seconds=30),
                 lookback=timedelta(days=3650))
    assert len(store.list_incidents()) == 2
