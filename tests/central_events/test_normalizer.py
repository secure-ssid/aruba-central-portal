"""Tests for Central event → pipeline normalizer."""

from datetime import datetime, timezone

from pipeline.central_events.normalizer import (
    _coerce_dt,
    _compute_event_id,
    _normalize_code,
    _severity_for,
    normalize_central_event,
)


# A realistic row drawn from the user's CSV export (converted to the
# API shape — hyphenated keys match the live `/v1/events` response).
_SAMPLE_EVENT = {
    "occurred-at": "2026-04-18T00:01:50.123Z",
    "device-type": "CLIENT",
    "device-hostname": "LR-AP735",
    "serial": "PHSXM52029",
    "device-mac": "48:00:20:c9:ab:0a",
    "client-mac": "60:74:f4:3e:ae:a2",
    "bssid": "48:00:20:1a:b0:a1",
    "event-type": "Client Onboarding Failure - Key Exchange",
    "label": "APs",
    "site": "SecureSSID",
    "group": "Wireless",
    "description": "Onboarding failed for client 60:74:f4:3e:ae:a2 in Key Exchange phase to BSSID 48:00:20:1a:b0:a1 on channel 1 of AP hostname LR-AP735. Reason: MIC Failure",
    "reason": "MIC Failure",
    "ssid": "aruba-home",
    "band": "2.4 GHz (G)",
    "event-id": "evt-abc123",
}


def test_severity_for_classifies_failures_as_error():
    assert _severity_for("Client Onboarding Failure - Key Exchange") == 3
    assert _severity_for("802.11 De-authentication to Client") == 4
    assert _severity_for("Client Roam Success") == 5
    assert _severity_for(None) == 5
    assert _severity_for("") == 5


def test_normalize_code_strips_whitespace_and_snake_cases():
    code = _normalize_code("Client Onboarding Failure - Key Exchange")
    assert code == "ONBOARDING_FAILURE_KEY_EXCHANGE"
    assert _normalize_code(None) is None
    assert _normalize_code("") is None


def test_coerce_dt_accepts_iso_epoch_ms_and_seconds():
    iso = _coerce_dt("2026-04-18T00:01:50.123Z")
    assert iso == datetime(2026, 4, 18, 0, 1, 50, 123_000, tzinfo=timezone.utc)

    ms = _coerce_dt(1_744_941_710_000)
    assert ms is not None and ms.tzinfo is timezone.utc

    sec = _coerce_dt(1_744_941_710)
    assert sec is not None and sec.tzinfo is timezone.utc

    assert _coerce_dt(None) is None
    assert _coerce_dt("not-a-date") is None


def test_compute_event_id_is_deterministic():
    a = _compute_event_id(_SAMPLE_EVENT)
    b = _compute_event_id(_SAMPLE_EVENT)
    assert a == b and len(a) == 24

    # Any field change perturbs the hash.
    copy = dict(_SAMPLE_EVENT)
    copy["description"] = "different"
    assert _compute_event_id(copy) != a


def test_normalize_extracts_all_the_important_bits():
    out = normalize_central_event(_SAMPLE_EVENT)

    assert out["source"] == "central"
    assert out["transport"] == "api"
    assert out["device_serial"] == "PHSXM52029"
    assert out["device_name"] == "LR-AP735"
    assert out["hostname"] == "LR-AP735"
    assert out["event_code"] == "ONBOARDING_FAILURE_KEY_EXCHANGE"
    assert out["severity"] == 3  # "Failure" → error
    assert out["msg_id"] == "evt-abc123"
    assert out["event_time"] == datetime(
        2026, 4, 18, 0, 1, 50, 123_000, tzinfo=timezone.utc,
    )
    assert "MIC Failure" in out["message"]
    # All extras preserved so the LLM writer sees client MAC / SSID / BSSID.
    assert out["structured_data"]["client-mac"] == "60:74:f4:3e:ae:a2"
    assert out["structured_data"]["ssid"] == "aruba-home"


def test_normalize_synthesizes_id_when_missing():
    raw = dict(_SAMPLE_EVENT)
    del raw["event-id"]
    out = normalize_central_event(raw)
    assert out["msg_id"] is not None
    assert len(out["msg_id"]) == 24  # deterministic hash, not empty


def test_normalize_tolerates_camelcase_keys():
    """New Central variants sometimes return camelCase; we handle both."""
    raw = {
        "eventType": "802.11 Roam Success",
        "occurredAt": "2026-04-18T00:01:50Z",
        "deviceSerial": "PHSXM52029",
        "deviceHostname": "LR-AP735",
        "description": "roamed",
        "eventId": "evt-xyz",
    }
    out = normalize_central_event(raw)
    assert out["device_serial"] == "PHSXM52029"
    assert out["device_name"] == "LR-AP735"
    assert out["event_code"] == "ROAM_SUCCESS" or out["event_code"] == "802_11_ROAM_SUCCESS"
    assert out["msg_id"] == "evt-xyz"


def test_normalize_unknown_event_gets_safe_defaults():
    out = normalize_central_event({})
    assert out["device_serial"] is None
    assert out["device_name"] is None
    assert out["event_code"] is None
    assert out["severity"] == 5  # notice (safe default)
    assert out["source"] == "central"
    assert out["msg_id"] is not None  # hash-fallback
