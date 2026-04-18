"""Proposer tests — picks (or correctly refuses to pick) a catalog action."""

from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from pipeline.actions.proposer import propose_action
from pipeline.syslog.storage import SyslogStore


@pytest.fixture()
def store(tmp_path: Path) -> SyslogStore:
    s = SyslogStore(tmp_path / "syslog.db")
    yield s
    s.close()


def _seed_incident_with_alert(
    store: SyslogStore,
    *,
    event_code: str,
    approved: int = 1,
    device_serial: str = "CNABC12345",
) -> int:
    """Create one incident with an alert at the given approval state.
    Returns the incident id. Does the minimum work needed so the
    proposer's prerequisites are satisfiable without running the
    whole clusterer path."""
    now = datetime.now(timezone.utc)
    event_id = store.insert_event(
        received_at=now,
        event_time=now,
        source_ip="10.0.0.1",
        transport="udp",
        facility=16,
        severity=4,
        hostname="AP-1",
        app_name="stm",
        proc_id=None,
        msg_id=None,
        device_serial=device_serial,
        device_name="AP-1",
        event_code=event_code,
        message="seed",
        raw="",
        structured_data=None,
    )
    incident_id = store.upsert_incident(
        cluster_signature=f"sig-{event_code}",
        device_serial=device_serial,
        device_name="AP-1",
        event_code=event_code,
        severity=4,
        first_seen=now - timedelta(minutes=1),
        last_seen=now,
        event_ids=[event_id],
    )
    store.upsert_alert(
        incident_id=incident_id,
        summary="seed",
        troubleshooting=["step"],
        review_notes="ok",
        approved=approved,
    )
    return incident_id


def test_propose_picks_bounce_port_for_link_state(store):
    incident_id = _seed_incident_with_alert(store, event_code="SWITCH_PORT_1_LINK_DOWN")
    result = propose_action(store, incident_id)
    assert result.proposed
    assert result.action_type == "bounce_switch_port"
    # Persisted
    actions = store.list_proposed_actions(incident_id=incident_id)
    assert len(actions) == 1
    assert actions[0]["action_type"] == "bounce_switch_port"
    assert actions[0]["status"] == "pending"


def test_propose_refuses_when_no_catalog_match(store):
    """WPA_HANDSHAKE family has no catalog entry — PSK issues need a human."""
    incident_id = _seed_incident_with_alert(store, event_code="132094")
    result = propose_action(store, incident_id)
    assert not result.proposed
    assert "catalog" in (result.skipped_reason or "").lower()


def test_propose_refuses_when_alert_not_approved(store):
    incident_id = _seed_incident_with_alert(
        store, event_code="DFS_RADAR_DETECTED", approved=0,
    )
    result = propose_action(store, incident_id)
    assert not result.proposed
    assert "approved" in (result.skipped_reason or "").lower()


def test_propose_refuses_when_no_alert_exists(store):
    """Alerts-less incidents (below writer threshold) don't get actions."""
    now = datetime.now(timezone.utc)
    event_id = store.insert_event(
        received_at=now, event_time=now, source_ip="1.2.3.4", transport="udp",
        facility=16, severity=6, hostname="h", app_name="a",
        proc_id=None, msg_id=None, device_serial="SN1", device_name="h",
        event_code="DFS_RADAR_DETECTED", message="", raw="", structured_data=None,
    )
    incident_id = store.upsert_incident(
        cluster_signature="sig-only",
        device_serial="SN1",
        device_name="h",
        event_code="DFS_RADAR_DETECTED",
        severity=6,
        first_seen=now, last_seen=now,
        event_ids=[event_id],
    )
    result = propose_action(store, incident_id)
    assert not result.proposed
    assert "alert" in (result.skipped_reason or "").lower()


def test_propose_is_idempotent(store):
    incident_id = _seed_incident_with_alert(store, event_code="DFS_RADAR_DETECTED")
    first = propose_action(store, incident_id)
    second = propose_action(store, incident_id)
    assert first.proposed
    # Same action id returned on re-propose, not a new row.
    assert second.action_id == first.action_id
    assert "already" in (second.skipped_reason or "").lower()
    # Only one row persisted.
    assert len(store.list_proposed_actions(incident_id=incident_id)) == 1


def test_propose_missing_incident(store):
    result = propose_action(store, 9999)
    assert not result.proposed
    assert "not found" in (result.skipped_reason or "").lower()
