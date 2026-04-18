"""
Writer agent: turn one clustered incident into a human-readable alert
plus a short troubleshooting playbook.

Output shape
------------
`WriterOutput(summary, troubleshooting, provider, model, raw)`

- `summary`: 1-2 sentence plain-English headline. Lead with what changed
  and which device(s). This is the text an on-call reads at a glance.
- `troubleshooting`: 3-5 short bullet-style steps the engineer can try,
  tailored to the actual event_code + message content. Example for a
  broadcast storm: "check port 1/0/3 for loops; disable STP edge port
  if enabled; correlate with a recent config change; check uplink
  utilization on the upstream switch."

Returned as strict JSON so we can split the two cleanly. The reviewer
only audits the summary — troubleshooting is advisory, the reviewer
isn't in a position to verify Aruba-specific fix steps.

Kept intentionally small:
- Only fires when the clusterer flagged an incident with a meaningful
  anomaly_score; threshold is the caller's decision.
- Plain text in / JSON out through `pipeline.llm`. No tool calling.
- Malformed JSON → fall back to treating the whole LLM response as the
  summary and leaving troubleshooting empty. Caller sees a result in
  every case unless the transport itself fails (LLMError).
"""

from __future__ import annotations

import json
import logging
import re
from dataclasses import dataclass
from typing import Any

from pipeline.llm import LLMError, generate

logger = logging.getLogger(__name__)


# Severity 0-7 (RFC 5424). Human labels help the model produce appropriate
# tone; the raw number is also included for precision.
_SEVERITY_LABELS = {
    0: "emergency", 1: "alert", 2: "critical", 3: "error",
    4: "warning", 5: "notice", 6: "informational", 7: "debug",
}


_SYSTEM_PROMPT = (
    "You are a senior network-operations engineer writing a brief alert "
    "for on-call. Convert raw syslog incident data into two sections: "
    "(1) a 1-2 sentence plain-English summary of what is happening and on "
    "which device(s); (2) 3-5 concrete troubleshooting steps tailored to "
    "the actual event content — what to check, what to run, what to rule "
    "out. Steps must be specific (name the port/SSID/VLAN/client when it's "
    "in the data) and safe (never recommend destructive actions without a "
    "diagnostic first). Never invent facts not present in the data. "
    "Respond with STRICT JSON ONLY, no prose before or after, of the form: "
    '{"summary": "...", "troubleshooting": ["step 1", "step 2", ...]}'
)


_JSON_OBJECT_RE = re.compile(r"\{.*\}", re.DOTALL)


@dataclass
class WriterOutput:
    summary: str
    troubleshooting: list[str]
    provider: str
    model: str
    raw: str


def _build_prompt(incident: dict, events: list[Any], *, max_event_samples: int = 8) -> str:
    sev = incident.get("severity")
    sev_label = _SEVERITY_LABELS.get(sev, "unknown") if sev is not None else "unknown"

    lines = [
        "Incident summary data:",
        f"- device_serial: {incident.get('device_serial') or 'unknown'}",
        f"- event_code:    {incident.get('event_code') or 'NOCODE'}",
        f"- severity:      {sev_label} ({sev})",
        f"- event_count:   {incident.get('event_count')}",
        f"- first_seen:    {incident.get('first_seen')}",
        f"- last_seen:     {incident.get('last_seen')}",
        f"- anomaly_score: {incident.get('anomaly_score')}",
        "",
        f"Sample events (up to {max_event_samples}):",
    ]
    for ev in events[:max_event_samples]:
        get = (lambda k: getattr(ev, k, None)) if not isinstance(ev, dict) else ev.get
        msg = (get("message") or "").strip().replace("\n", " ")[:240]
        host = get("hostname") or ""
        ts = get("event_time") or get("received_at") or ""
        lines.append(f"- [{ts}] {host}: {msg}")
    lines += [
        "",
        "Write the JSON now.",
    ]
    return "\n".join(lines)


def _parse_output(text: str) -> tuple[str, list[str]]:
    """Pull {summary, troubleshooting} out of the LLM text.

    Falls back gracefully: malformed JSON → treat the whole response as
    the summary so the dashboard still has something useful to show.
    """
    m = _JSON_OBJECT_RE.search(text or "")
    if not m:
        return (text or "").strip(), []
    try:
        obj = json.loads(m.group(0))
    except json.JSONDecodeError:
        return (text or "").strip(), []
    if not isinstance(obj, dict):
        return (text or "").strip(), []

    summary = str(obj.get("summary", "")).strip()
    ts_raw = obj.get("troubleshooting", [])
    troubleshooting: list[str] = []
    if isinstance(ts_raw, list):
        troubleshooting = [str(s).strip() for s in ts_raw if str(s).strip()]
    elif isinstance(ts_raw, str):
        # Some models return a newline-delimited string despite instructions.
        troubleshooting = [s.strip(" -*•") for s in ts_raw.splitlines() if s.strip()]

    if not summary:
        summary = (text or "").strip()
    return summary, troubleshooting[:8]  # guardrail against runaway lists


def write_alert(
    incident: dict,
    events: list[Any],
    *,
    max_event_samples: int = 8,
    max_output_tokens: int = 400,
) -> WriterOutput:
    """Generate summary + troubleshooting for one incident.

    Raises LLMError / LLMUnavailable — caller decides whether to skip,
    retry, or fall back to a templated summary.
    """
    prompt = _build_prompt(incident, events, max_event_samples=max_event_samples)
    result = generate(
        prompt,
        system=_SYSTEM_PROMPT,
        max_output_tokens=max_output_tokens,
        temperature=0.2,
    )
    summary, troubleshooting = _parse_output(result.text)
    logger.info(
        "writer: incident=%s provider=%s model=%s summary_chars=%d steps=%d",
        incident.get("id"), result.provider, result.model,
        len(summary), len(troubleshooting),
    )
    return WriterOutput(
        summary=summary,
        troubleshooting=troubleshooting,
        provider=result.provider,
        model=result.model,
        raw=result.text,
    )


def fallback_summary(incident: dict) -> str:
    """Deterministic summary for when the LLM is unreachable.

    Prefers device_name (the human label like 'LR-AP735') over the serial,
    and only says 'unknown device' when we truly have neither. Same for
    event_code — only says 'uncategorized' as a last resort.
    """
    device = (
        incident.get("device_name")
        or incident.get("device_serial")
        or "unknown device"
    )
    code = incident.get("event_code") or "uncategorized events"
    count = incident.get("event_count", 0)
    score = incident.get("anomaly_score") or 0
    first = incident.get("first_seen", "")
    last = incident.get("last_seen", "")

    tail = ""
    if score and float(score) >= 2.0:
        tail = f" Anomaly score {float(score):.1f} — well above baseline."
    return f"{device} logged {count}x {code} between {first} and {last}.{tail}"


def fallback_troubleshooting(incident: dict) -> list[str]:
    """Generic troubleshooting when the LLM isn't available. Better than
    showing an empty section — operators still get a checklist."""
    code = incident.get("event_code") or ""
    steps = [
        "Check the device's uptime and recent reboots in Aruba Central.",
        "Look for a recent configuration push or firmware change on this device.",
        "Correlate the timing against other incidents on the same device/site.",
    ]
    up = code.upper()
    if "STORM" in up or "BROADCAST" in up:
        steps.insert(0, "Inspect the port for a loop; verify STP/BPDU-guard is on edge ports.")
    elif "LINK" in up or "PORT" in up:
        steps.insert(0, "Check physical cabling, SFP health, and the upstream neighbor port.")
    elif "AUTH" in up or "WPA" in up or "RADIUS" in up:
        steps.insert(0, "Verify RADIUS/AAA reachability and the PSK/certificate in use.")
    elif "DHCP" in up:
        steps.insert(0, "Check DHCP pool utilization and the helper-address path.")
    return steps[:5]


__all__ = [
    "write_alert", "fallback_summary", "fallback_troubleshooting",
    "WriterOutput", "LLMError",
]
