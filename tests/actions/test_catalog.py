"""Catalog tests — the map from incident family → remediation action."""

from pipeline.actions.catalog import (
    ACTION_CATALOG,
    action_for_incident,
)


def test_catalog_has_expected_actions():
    expected = {
        "firmware_upgrade",
        "dynamic_capacity_optimization",
        "dfs_optimization",
        "reboot_ap",
        "bounce_switch_port",
    }
    assert expected.issubset(ACTION_CATALOG.keys())


def test_catalog_entries_are_internally_consistent():
    """Risk levels, preflight checks, and rollback notes are required."""
    for spec in ACTION_CATALOG.values():
        assert spec.type and spec.label and spec.description
        assert spec.risk in ("low", "medium", "high")
        assert spec.family  # every action targets an incident family
        assert spec.rollback  # always a rollback line, even if 'N/A'


def test_action_for_incident_uses_family_not_raw_code():
    """An AOS 8 numeric code 132094 has no catalog match by itself,
    but its family (WPA_HANDSHAKE) doesn't map to an action either —
    WPA failures are usually client/PSK config issues that no
    auto-remediation can fix. So we expect None here."""
    result = action_for_incident({"event_code": "132094"})
    assert result is None


def test_action_for_broadcast_storm_suggests_nothing_today():
    """Broadcast storm family isn't in the catalog (we don't auto-fix
    storms — a human chooses). Confirm None."""
    result = action_for_incident({"event_code": "AP_BROADCAST_STORM"})
    assert result is None


def test_action_for_link_state_suggests_bounce_port():
    result = action_for_incident({"event_code": "SWITCH_PORT_1_0_3_LINK_DOWN"})
    assert result is not None
    assert result.type == "bounce_switch_port"


def test_action_for_dfs_radar_suggests_dfs_optimization():
    result = action_for_incident({"event_code": "DFS_RADAR_DETECTED"})
    assert result is not None
    assert result.type == "dfs_optimization"


def test_action_for_unknown_code_returns_none():
    assert action_for_incident({"event_code": "WEIRD_PROPRIETARY_EVENT"}) is None
    assert action_for_incident({}) is None
    assert action_for_incident({"event_code": None}) is None
