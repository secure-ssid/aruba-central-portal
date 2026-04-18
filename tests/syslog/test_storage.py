"""Tests for SyslogStore — insert, query, stats, prune."""

from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from pipeline.syslog.storage import SyslogStore


@pytest.fixture()
def store(tmp_path: Path) -> SyslogStore:
    s = SyslogStore(tmp_path / "syslog.db")
    yield s
    s.close()


def _insert(store: SyslogStore, *, severity=6, serial="CNABC12345", code="AP_EVENT", when=None):
    when = when or datetime.now(timezone.utc)
    return store.insert_event(
        received_at=when,
        event_time=when,
        source_ip="10.0.0.1",
        transport="udp",
        facility=16,
        severity=severity,
        hostname="AP-1",
        app_name="stm",
        proc_id="123",
        msg_id=None,
        device_serial=serial,
        device_name="AP-1",
        event_code=code,
        message=f"{code} happened",
        raw=f"<134>Apr 17 21:45:01 AP-1 stm[123]: {code}",
        structured_data=None,
    )


def test_insert_and_list_roundtrip(store: SyslogStore):
    eid = _insert(store)
    events = store.list_events(limit=10)
    assert len(events) == 1
    e = events[0]
    assert e.id == eid
    assert e.device_serial == "CNABC12345"
    assert e.event_code == "AP_EVENT"
    assert e.severity == 6


def test_filters(store: SyslogStore):
    _insert(store, severity=3, code="LINK_DOWN")
    _insert(store, severity=6, code="AP_EVENT")
    _insert(store, severity=6, code="AP_EVENT", serial="CNDEF67890")

    warn_or_worse = store.list_events(severity_max=4)
    assert len(warn_or_worse) == 1
    assert warn_or_worse[0].event_code == "LINK_DOWN"

    by_device = store.list_events(device_serial="CNDEF67890")
    assert len(by_device) == 1

    by_code = store.list_events(event_code="AP_EVENT")
    assert len(by_code) == 2


def test_stats_rollup(store: SyslogStore):
    for _ in range(3):
        _insert(store, severity=6)
    _insert(store, severity=3)

    stats = store.stats(window=timedelta(hours=1))
    assert stats["total"] == 4
    assert stats["by_severity"][6] == 3
    assert stats["by_severity"][3] == 1
    assert stats["top_devices"][0]["device_serial"] == "CNABC12345"
    assert stats["top_event_codes"][0]["event_code"] == "AP_EVENT"


def test_prune_older_than(store: SyslogStore):
    old = datetime.now(timezone.utc) - timedelta(days=10)
    fresh = datetime.now(timezone.utc) - timedelta(hours=1)
    _insert(store, when=old)
    _insert(store, when=old)
    _insert(store, when=fresh)

    deleted = store.prune_older_than(days=7)
    assert deleted == 2

    remaining = store.list_events(limit=10)
    assert len(remaining) == 1


def test_wal_mode_enabled(store: SyslogStore):
    mode = store._conn.execute("PRAGMA journal_mode").fetchone()[0]
    assert mode.lower() == "wal"
