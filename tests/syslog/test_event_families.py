"""Tests for the event-family map that powers cross-code clustering."""

from pipeline.syslog.event_families import cluster_key_for, family_for


def test_aos8_wpa_handshake_codes_share_a_family():
    # The two numeric codes the user sees together on real AOS traffic.
    assert family_for("132094") == "WPA_HANDSHAKE"
    assert family_for("520013") == "WPA_HANDSHAKE"


def test_aos10_wpa_family_covers_all_observed_codes():
    """Live AOS 10 emits all of these together for one client's failed
    4-way handshake — MIC mismatch, wrong Message 2, auth integrity
    fail, post-fail RSSI telemetry. Must share a family so operators
    see one incident per client/AP pair, not five."""
    for code in ("132093", "132094", "341004", "341005", "520013"):
        assert family_for(code) == "WPA_HANDSHAKE", f"{code} should be WPA_HANDSHAKE"


def test_aos10_ap_internal_family():
    """Telemetry / LACP / redis-event subsystems — low-actionability,
    clustered together so they don't drown out client-facing alerts."""
    assert family_for("312402") == "AP_INTERNAL"
    assert family_for("312404") == "AP_INTERNAL"


def test_aos10_rogue_ap_family():
    assert family_for("127001") == "ROGUE_AP"


def test_aos10_client_lifecycle_roam_sync():
    """del-client / roam-sync codes belong with the other CLIENT_LIFECYCLE."""
    assert family_for("541023") == "CLIENT_LIFECYCLE"


def test_central_wpa_onboarding_maps_to_same_family():
    """Central's normalized string code should cluster with the AOS
    numeric codes — that's the whole point of a family map."""
    assert family_for("ONBOARDING_FAILURE_KEY_EXCHANGE") == "WPA_HANDSHAKE"


def test_regex_family_catches_variants():
    assert family_for("AP_BROADCAST_STORM_DETECTED") == "BROADCAST_STORM"
    assert family_for("SWITCH_PORT_1_0_3_LINK_DOWN") == "LINK_STATE"
    assert family_for("DHCP_POOL_EXHAUSTED") == "DHCP"
    assert family_for("RADIUS_SERVER_UNREACHABLE") == "RADIUS"
    assert family_for("DFS_RADAR_DETECTED") == "DFS_RADAR"


def test_unknown_code_has_no_family():
    assert family_for("SOME_OBSCURE_EVENT") is None
    assert family_for(None) is None
    assert family_for("") is None


def test_cluster_key_falls_back_to_raw_code():
    # No family → the raw code is the cluster key (identical to old behavior).
    assert cluster_key_for("SOME_OBSCURE_EVENT") == "SOME_OBSCURE_EVENT"
    # Known code → family name.
    assert cluster_key_for("132094") == "WPA_HANDSHAKE"
    # Missing code → sentinel.
    assert cluster_key_for(None) == "NOCODE"
    assert cluster_key_for("") == "NOCODE"
