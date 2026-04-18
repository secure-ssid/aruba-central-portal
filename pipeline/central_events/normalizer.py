"""
Normalize Aruba Central events into the same shape syslog events use.

Central's `/network-troubleshooting/v1/events` returns rich JSON — we
flatten it into the `events` table columns so the downstream clusterer,
anomaly scorer, and LLM writer treat Central events exactly like syslog.

Mapping
-------
- `device_serial`  ← serial / device-id / deviceSerialNumber
- `device_name`    ← device-hostname / deviceHostname / ap-hostname
- `event_code`     ← event-type (human-readable like
                     'Client Onboarding Failure - Key Exchange')
                     We Upper_Snake_Case it to match syslog codes.
- `event_time`     ← occurred-at / timestamp / occurredOn
- `severity`       ← RFC 5424 number derived from the event category
                     (onboarding failure → 3/error, de-auth → 4/warning)
- `message`        ← description (the human-readable text Central already
                     renders in its dashboard)
- `hostname`       ← device-hostname (mirrors syslog convention)
- `msg_id`         ← event-id or a deterministic hash of the row — used
                     for dedup so re-polling overlapping windows is free

Fields we don't explicitly promote (client_mac, ssid, bssid, etc.) are
preserved in `structured_data` so the LLM writer gets the full context.
"""

from __future__ import annotations

import hashlib
import logging
import re
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger(__name__)


# Ordered (case-insensitive) keyword → severity; first match wins. The
# event_type text is what Central shows in the UI — we don't care about
# its internal taxonomy, just how alarming it sounds.
_SEVERITY_KEYWORDS: list[tuple[str, int]] = [
    ("outage", 2),
    ("down", 3),
    ("failure", 3),
    ("failed", 3),
    ("denied", 3),
    ("error", 3),
    ("deauthentication", 4),
    ("de-authentication", 4),
    ("disassoc", 4),
    ("roam", 5),
    ("onboard", 4),
    ("auth", 4),
    ("interfer", 4),
    ("radar", 4),
]


def _severity_for(event_type: str | None) -> int:
    """Best-effort map of Central event_type → RFC 5424 severity number.

    Defaults to 5 (notice) when nothing matches — safe middle ground:
    the clusterer still groups the event, but the anomaly scorer doesn't
    weight it as critical.
    """
    if not event_type:
        return 5
    haystack = event_type.lower()
    for needle, sev in _SEVERITY_KEYWORDS:
        if needle in haystack:
            return sev
    return 5


_NONWORD_RE = re.compile(r"[^A-Z0-9]+")


def _normalize_code(event_type: str | None) -> str | None:
    """Central returns nice human strings ('Client Onboarding Failure -
    Key Exchange'). For clustering we want something more code-like so
    the signature hash is stable across minor text reshuffling."""
    if not event_type:
        return None
    upper = event_type.upper()
    collapsed = _NONWORD_RE.sub("_", upper).strip("_")
    # Trim obvious noise words
    for noise in ("CLIENT_", "WIRELESS_"):
        if collapsed.startswith(noise):
            collapsed = collapsed[len(noise):]
    return collapsed or None


def _coerce_dt(value: Any) -> datetime | None:
    """Central timestamps come in a few flavors: RFC 3339 strings,
    epoch seconds, epoch milliseconds. Handle all three; return None
    for anything we can't parse."""
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)):
        # Heuristic: anything >= 10^12 is ms, else seconds.
        seconds = value / 1000.0 if value >= 1e12 else float(value)
        try:
            return datetime.fromtimestamp(seconds, tz=timezone.utc)
        except (OverflowError, ValueError, OSError):
            return None
    if isinstance(value, str):
        s = value.strip()
        if not s:
            return None
        try:
            # Tolerate 'Z' suffix and missing tz.
            normalized = s.replace("Z", "+00:00")
            dt = datetime.fromisoformat(normalized)
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        except ValueError:
            return None
    return None


def _first(d: dict, *keys: str) -> Any:
    """Return the first present, non-empty value for the given keys."""
    for k in keys:
        v = d.get(k)
        if v not in (None, "", []):
            return v
    return None


def _compute_event_id(raw: dict) -> str:
    """Deterministic ID for an event that lacks a server-provided id.

    Hash the fields we'd use to identify the row. Collisions are
    vanishingly unlikely given 4 distinct fields + ts + description.
    """
    material = "|".join(
        str(_first(raw, k) or "")
        for k in ("event-type", "eventType", "device-serial", "serial",
                  "occurred-at", "occurredAt", "timestamp", "description")
    )
    return hashlib.sha1(material.encode("utf-8")).hexdigest()[:24]


def normalize_central_event(raw: dict) -> dict:
    """Convert one Central event dict → kwargs for `SyslogStore.insert_event`.

    Returns a dict ready to splat into the insert function. Never raises
    on unexpected field shapes — unknowns become None and the clusterer
    still sees the device/code pair.
    """
    event_type = _first(raw, "event-type", "eventType", "type", "event_type")
    description = _first(raw, "description", "message", "reason") or ""
    device_serial = _first(
        raw, "serial", "device-serial", "deviceSerial",
        "deviceSerialNumber", "device-id",
    )
    device_name = _first(
        raw, "device-hostname", "deviceHostname",
        "hostname", "ap-hostname", "apHostname",
    )
    src_ip = _first(raw, "device-ip", "deviceIp", "source-ip", "sourceIp") or (
        device_serial or device_name or "central"
    )

    occurred = (
        _coerce_dt(_first(raw, "occurred-at", "occurredAt", "occurred_on",
                          "occurredOn", "timestamp", "time"))
    )

    raw_id = _first(raw, "event-id", "eventId", "id") or _compute_event_id(raw)

    # Promote all extra fields into structured_data so the LLM writer
    # sees client MAC, SSID, BSSID, channel, etc. when composing summaries.
    structured = {k: v for k, v in raw.items() if v not in (None, "", [])}

    return {
        "received_at": datetime.now(timezone.utc),
        "event_time": occurred,
        "source_ip": str(src_ip),
        "transport": "api",
        "source": "central",
        "facility": None,
        "severity": _severity_for(event_type),
        "hostname": device_name,
        "app_name": "central-events",
        "proc_id": None,
        "msg_id": str(raw_id),
        "device_serial": device_serial,
        "device_name": device_name,
        "event_code": _normalize_code(event_type),
        "message": description,
        "raw": str(raw),
        "structured_data": structured,
    }
