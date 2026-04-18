"""
Syslog parser: RFC 3164 (BSD) and RFC 5424, with Aruba-specific extractors.

We accept both formats because Aruba APs/switches default to RFC 3164 but
newer AOS 10 gear and ArubaOS-CX can emit RFC 5424. The parser is tolerant:
unknown shapes fall back to a message-only event so nothing is dropped.

Key fields extracted beyond the RFC headers:
- device_serial: Aruba serial numbers are typically 9 alphanumerics (e.g.
  CNABC12345) often embedded in the hostname or APPNAME slot.
- device_name: hostname fallback when a recognizable AP/switch name is set.
- event_code: Aruba logs frequently carry `CODE` or `<event-type>` tokens
  near the start of the message body — we grep a conservative pattern.

This is intentionally simple regex work, not a full grammar. Aruba
doesn't publish a stable log schema; over-fitting will rot fast.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

# ── RFC 3164: <PRI>Mmm dd HH:MM:SS HOSTNAME TAG: MSG ──────────────────────
# PRI = facility*8 + severity, 0..191
_RFC3164_RE = re.compile(
    r"^<(?P<pri>\d{1,3})>"
    r"(?P<ts>[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+"
    r"(?P<host>\S+)\s+"
    r"(?P<rest>.*)$",
    re.DOTALL,
)

# ── RFC 5424: <PRI>1 TIMESTAMP HOSTNAME APP-NAME PROCID MSGID [SD] MSG ───
_RFC5424_RE = re.compile(
    r"^<(?P<pri>\d{1,3})>1\s+"
    r"(?P<ts>\S+)\s+"
    r"(?P<host>\S+)\s+"
    r"(?P<app>\S+)\s+"
    r"(?P<procid>\S+)\s+"
    r"(?P<msgid>\S+)\s+"
    r"(?P<sd>-|\[.*?\](?:\[.*?\])*)"
    r"(?:\s+(?P<msg>.*))?$",
    re.DOTALL,
)

# TAG[PID]: MSG — the RFC 3164 "rest" is typically this
_TAG_RE = re.compile(r"^(?P<tag>[^\[\s:]+)(?:\[(?P<pid>[^\]]+)\])?:\s*(?P<body>.*)$", re.DOTALL)

# Aruba serial numbers: 9-12 alphanumerics, starts with 2-4 uppercase letters,
# must contain at least one digit somewhere after the prefix. Conservative —
# rejects plain words like "ERROR" but matches CNABC12345, SG12345ABC, etc.
_ARUBA_SERIAL_RE = re.compile(
    r"\b([A-Z]{2,4}(?=[A-Z0-9]*\d)[A-Z0-9]{5,10})\b"
)

# Aruba event-code heuristics: UPPER_SNAKE tokens >= 2 parts, or "<event-type>"
_ARUBA_CODE_RE = re.compile(r"\b([A-Z][A-Z0-9]+(?:_[A-Z0-9]+){1,6})\b")

# SD-ELEMENT parser: [id k1="v1" k2="v2"]
_SD_ELEMENT_RE = re.compile(r'\[(?P<id>[^\s\]]+)(?P<params>(?:\s+[^=\s]+="[^"]*")*)\]')
_SD_PARAM_RE = re.compile(r'(?P<k>[^=\s]+)="(?P<v>[^"]*)"')


@dataclass
class ParsedEvent:
    """Structured view of a single syslog line."""
    facility: int | None = None
    severity: int | None = None
    event_time: datetime | None = None
    hostname: str | None = None
    app_name: str | None = None
    proc_id: str | None = None
    msg_id: str | None = None
    device_serial: str | None = None
    device_name: str | None = None
    event_code: str | None = None
    message: str = ""
    structured_data: dict[str, dict[str, str]] | None = None
    raw: str = ""
    format: str = "unknown"  # '3164' | '5424' | 'unknown'
    extras: dict[str, Any] = field(default_factory=dict)


def parse_syslog(data: bytes | str, *, now: datetime | None = None) -> ParsedEvent:
    """
    Parse a syslog frame. Always returns a ParsedEvent — never raises.
    Unknown shapes fall back to raw-only so the writer still persists something.
    """
    raw = data.decode("utf-8", errors="replace").rstrip("\r\n") if isinstance(data, bytes) else data.rstrip("\r\n")
    now = now or datetime.now(timezone.utc)

    # Try RFC 5424 first (has the literal `1` version token)
    m = _RFC5424_RE.match(raw)
    if m:
        return _from_5424(m, raw, now)

    m = _RFC3164_RE.match(raw)
    if m:
        return _from_3164(m, raw, now)

    # Fallback: no PRI, no known timestamp — treat as free-text
    ev = ParsedEvent(raw=raw, message=raw, format="unknown")
    _enrich_aruba(ev)
    return ev


# ───────────────────── format-specific helpers ─────────────────────


def _from_3164(m: re.Match[str], raw: str, now: datetime) -> ParsedEvent:
    pri = int(m.group("pri"))
    facility, severity = divmod(pri, 8)
    # order: (severity = pri & 7, facility = pri >> 3) — divmod is (q, r) so swap
    facility = pri >> 3
    severity = pri & 7

    ts = _parse_3164_ts(m.group("ts"), now)
    host = m.group("host")
    rest = m.group("rest")

    app_name = proc_id = None
    body = rest
    tag_m = _TAG_RE.match(rest)
    if tag_m:
        app_name = tag_m.group("tag")
        proc_id = tag_m.group("pid")
        body = tag_m.group("body")

    ev = ParsedEvent(
        facility=facility,
        severity=severity,
        event_time=ts,
        hostname=host,
        app_name=app_name,
        proc_id=proc_id,
        message=body,
        raw=raw,
        format="3164",
    )
    _enrich_aruba(ev)
    return ev


def _from_5424(m: re.Match[str], raw: str, now: datetime) -> ParsedEvent:
    pri = int(m.group("pri"))
    facility = pri >> 3
    severity = pri & 7

    ts = _parse_5424_ts(m.group("ts"))
    host = _nil(m.group("host"))
    app = _nil(m.group("app"))
    procid = _nil(m.group("procid"))
    msgid = _nil(m.group("msgid"))
    sd_raw = m.group("sd")
    msg = m.group("msg") or ""

    sd = _parse_sd(sd_raw) if sd_raw and sd_raw != "-" else None

    ev = ParsedEvent(
        facility=facility,
        severity=severity,
        event_time=ts,
        hostname=host,
        app_name=app,
        proc_id=procid,
        msg_id=msgid,
        message=msg,
        structured_data=sd,
        raw=raw,
        format="5424",
    )
    _enrich_aruba(ev)
    return ev


def _parse_3164_ts(s: str, now: datetime) -> datetime | None:
    """RFC 3164 omits the year, so we assume it's the current year (UTC)."""
    try:
        # Collapse double space between "Mmm" and single-digit day
        s = re.sub(r"\s+", " ", s.strip())
        dt = datetime.strptime(f"{now.year} {s}", "%Y %b %d %H:%M:%S")
        # If the parsed time is >12h in the future, we likely crossed a year boundary
        dt = dt.replace(tzinfo=timezone.utc)
        if (dt - now).total_seconds() > 12 * 3600:
            dt = dt.replace(year=now.year - 1)
        return dt
    except ValueError:
        return None


def _parse_5424_ts(s: str) -> datetime | None:
    if s == "-":
        return None
    try:
        # Python 3.11+ handles the 'Z' suffix natively; tolerate it for older too.
        s = s.replace("Z", "+00:00")
        dt = datetime.fromisoformat(s)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except ValueError:
        return None


def _parse_sd(sd_raw: str) -> dict[str, dict[str, str]]:
    out: dict[str, dict[str, str]] = {}
    for m in _SD_ELEMENT_RE.finditer(sd_raw):
        params = {pm.group("k"): pm.group("v") for pm in _SD_PARAM_RE.finditer(m.group("params") or "")}
        out[m.group("id")] = params
    return out


def _nil(s: str | None) -> str | None:
    return None if s in (None, "-") else s


def _enrich_aruba(ev: ParsedEvent) -> None:
    """Best-effort extraction of Aruba device serial / name / event code."""
    # Device name: always use the hostname when present — it's useful even
    # when it happens to match a serial (common on freshly-joined APs).
    if ev.hostname:
        ev.device_name = ev.hostname

    # Scan hostname, app_name, then message body for a serial number.
    for candidate in (ev.hostname, ev.app_name, ev.message):
        if not candidate:
            continue
        sm = _ARUBA_SERIAL_RE.search(candidate)
        if sm:
            ev.device_serial = sm.group(1)
            break

    # Event code: look in the first ~120 chars of the message.
    head = (ev.message or "")[:120]
    cm = _ARUBA_CODE_RE.search(head)
    if cm:
        ev.event_code = cm.group(1)
