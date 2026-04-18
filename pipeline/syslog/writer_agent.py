"""
Writer agent: turn one clustered incident into a short human-readable alert.

Input : `incident` row + up to N of its events.
Output: 1-2 sentence plain English summary an on-call person could skim.

Kept intentionally small:
- Only fires when the clusterer flagged an incident with a meaningful
  anomaly_score (threshold is the caller's decision), so we don't burn
  tokens on background noise.
- No tool calling, no multi-turn conversation, no function declarations.
  Just text in / text out through `pipeline.llm`.
- The reviewer agent (Phase 5) will audit this output against the raw
  events before it's marked "approved" and surfaced on the dashboard.
"""

from __future__ import annotations

import logging
from typing import Any

from pipeline.llm import LLMError, LLMResult, generate

logger = logging.getLogger(__name__)


# Severity 0-7 (RFC 5424). Human labels help the model produce appropriate
# tone; the raw number is also included for precision.
_SEVERITY_LABELS = {
    0: "emergency", 1: "alert", 2: "critical", 3: "error",
    4: "warning", 5: "notice", 6: "informational", 7: "debug",
}


_SYSTEM_PROMPT = (
    "You are a network-operations writer. You convert raw syslog incident "
    "data into a concise, factual alert for on-call engineers. "
    "Write 1-2 sentences, plain English, no markdown, no emojis, no hedging. "
    "Lead with what changed and which device(s). If the anomaly score is "
    "high, describe the spike quantitatively (e.g. '25 events in 5 minutes, "
    "well above the usual 2-3'). Never invent facts not present in the data."
)


def _build_prompt(incident: dict, events: list[Any], *, max_event_samples: int = 8) -> str:
    """Compact JSON-ish view of the incident + a few sample events."""
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
        # StoredEvent dataclass or dict — handle both.
        get = (lambda k: getattr(ev, k, None)) if not isinstance(ev, dict) else ev.get
        msg = (get("message") or "").strip().replace("\n", " ")[:240]
        hostname = get("hostname") or ""
        ts = get("event_time") or get("received_at") or ""
        lines.append(f"- [{ts}] {hostname}: {msg}")
    lines.append("")
    lines.append("Write the alert now.")
    return "\n".join(lines)


def write_alert(
    incident: dict,
    events: list[Any],
    *,
    max_event_samples: int = 8,
    max_output_tokens: int = 200,
) -> LLMResult:
    """
    Generate a human-readable summary for one incident.

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
    logger.info(
        "writer: incident=%s provider=%s model=%s chars=%d",
        incident.get("id"), result.provider, result.model, len(result.text),
    )
    return result


def fallback_summary(incident: dict) -> str:
    """Deterministic summary used when no LLM is configured or a call fails.

    The dashboard should never show a blank card, so this keeps the alerts
    stream useful even on a plane or during an outage of the LLM provider.
    """
    device = incident.get("device_serial") or "unknown device"
    code = incident.get("event_code") or "uncategorized events"
    count = incident.get("event_count", 0)
    score = incident.get("anomaly_score") or 0
    first = incident.get("first_seen", "")
    last = incident.get("last_seen", "")

    tail = ""
    if score and float(score) >= 2.0:
        tail = f" Anomaly score {float(score):.1f} — well above baseline."
    return (
        f"{device} logged {count}x {code} between {first} and {last}.{tail}"
    )


# Re-export for convenience.
__all__ = ["write_alert", "fallback_summary", "LLMError"]
