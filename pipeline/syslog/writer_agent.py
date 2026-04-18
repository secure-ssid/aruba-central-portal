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
from dataclasses import dataclass, field
from typing import Any

from pipeline.llm import LLMError, generate
from .device_categories import classify
from .event_families import family_for
from .event_knowledge import get_knowledge

logger = logging.getLogger(__name__)


# Severity 0-7 (RFC 5424). Human labels help the model produce appropriate
# tone; the raw number is also included for precision.
_SEVERITY_LABELS = {
    0: "emergency", 1: "alert", 2: "critical", 3: "error",
    4: "warning", 5: "notice", 6: "informational", 7: "debug",
}


_SYSTEM_PROMPT = """\
You are a senior network-operations engineer writing a structured alert for
on-call staff who are NOT network experts. Your job is to separate noise from
real problems and tell them exactly what to do.

Output STRICT JSON ONLY — no prose before or after, no markdown fences.

Schema:
{
  "summary": "1-2 sentence plain-English headline. What is happening, on which device.",
  "verdict": "benign|warning|critical",
  "device_category": "detected device type label (e.g. Roku, Apple TV, Aruba AP)",
  "benign_items": [
    "Short explanation of each error that is NORMAL for this device type and needs no action"
  ],
  "real_items": [
    "Short explanation of each error that ACTUALLY matters and why"
  ],
  "troubleshooting": [
    "Concrete step 1 — be specific: name port/SSID/VLAN/client from the data",
    "Concrete step 2",
    "..."
  ]
}

Rules:
- verdict=benign → all errors are normal/expected for this device type
- verdict=warning → at least one error needs investigation but is not urgent
- verdict=critical → service impact, security issue, or data loss risk
- benign_items: explain WHY it is benign (device behaviour, not just "ignore this")
- real_items: explain the root cause, not just the symptom
- troubleshooting: 3-5 safe, specific steps. Never recommend destructive actions first.
- Never invent facts not in the provided data.
- Use the device category context to inform your assessment — what is normal for a
  Roku is not normal for a gateway.
"""


_JSON_OBJECT_RE = re.compile(r"\{.*\}", re.DOTALL)


@dataclass
class WriterOutput:
    summary: str
    troubleshooting: list[str]
    provider: str
    model: str
    raw: str
    # Phase 14b enrichments — may be None on legacy/fallback outputs.
    verdict: str | None = None          # "benign" | "warning" | "critical"
    device_category: str | None = None  # e.g. "Roku / streaming stick"
    benign_items: list[str] = field(default_factory=list)
    real_items: list[str] = field(default_factory=list)


def _build_prompt(incident: dict, events: list[Any], *, max_event_samples: int = 8) -> str:
    sev = incident.get("severity")
    sev_label = _SEVERITY_LABELS.get(sev, "unknown") if sev is not None else "unknown"

    # Collect event fields for device classification.
    ev_list = events[:max_event_samples]
    messages: list[str] = []
    hostnames: set[str] = set()
    for ev in ev_list:
        get = (lambda k: getattr(ev, k, None)) if not isinstance(ev, dict) else ev.get
        h = get("hostname") or ""
        m = get("message") or ""
        if h:
            hostnames.add(h)
        if m:
            messages.append(m.strip().replace("\n", " ")[:200])

    primary_host = next(iter(hostnames), None)
    cat = classify(
        hostname=primary_host,
        device_name=incident.get("device_name"),
        messages=messages,
    )

    event_code = incident.get("event_code")
    family = family_for(event_code)
    knowledge = get_knowledge(event_code, family)

    lines = [
        "=== DEVICE CONTEXT ===",
        f"Device category : {cat.name}",
        f"Description     : {cat.description}",
    ]
    if cat.normal_behaviours:
        lines.append("Known-normal for this device type (likely benign):")
        for b in cat.normal_behaviours:
            lines.append(f"  • {b}")
    if cat.watch_for:
        lines.append("Worth investigating for this device type:")
        for w in cat.watch_for:
            lines.append(f"  • {w}")

    if knowledge:
        lines += [
            "",
            "=== EVENT CODE KNOWLEDGE BASE ===",
            f"Event family    : {family or event_code}",
            f"Verdict hint    : {knowledge.verdict_hint}",
            f"What is happening: {knowledge.plain_english}",
        ]
        if knowledge.why_it_fires:
            lines.append("Why this fires:")
            for r in knowledge.why_it_fires:
                lines.append(f"  • {r}")
        if knowledge.benign_when:
            lines.append("Benign when:")
            for b in knowledge.benign_when:
                lines.append(f"  • {b}")
        if knowledge.action_required:
            lines.append("Action required (if any):")
            for a in knowledge.action_required:
                lines.append(f"  • {a}")
        if knowledge.never_do:
            lines.append("NEVER do:")
            for n in knowledge.never_do:
                lines.append(f"  • {n}")

    lines += [
        "",
        "=== INCIDENT DATA ===",
        f"device_serial : {incident.get('device_serial') or 'unknown'}",
        f"device_name   : {incident.get('device_name') or primary_host or 'unknown'}",
        f"event_code    : {incident.get('event_code') or 'NOCODE'}",
        f"severity      : {sev_label} ({sev})",
        f"event_count   : {incident.get('event_count')}",
        f"first_seen    : {incident.get('first_seen')}",
        f"last_seen     : {incident.get('last_seen')}",
        f"anomaly_score : {incident.get('anomaly_score')}",
        "",
        f"Sample log lines (up to {max_event_samples}):",
    ]
    for ev in ev_list:
        get = (lambda k: getattr(ev, k, None)) if not isinstance(ev, dict) else ev.get
        msg = (get("message") or "").strip().replace("\n", " ")[:240]
        host = get("hostname") or ""
        ts = get("event_time") or get("received_at") or ""
        lines.append(f"  [{ts}] {host}: {msg}")

    lines += ["", "Write the JSON now."]
    return "\n".join(lines)


def _extract_str_list(obj: dict, key: str) -> list[str]:
    raw = obj.get(key, [])
    if isinstance(raw, list):
        return [str(s).strip() for s in raw if str(s).strip()]
    if isinstance(raw, str):
        return [s.strip(" -*•") for s in raw.splitlines() if s.strip()]
    return []


def _parse_output(text: str) -> tuple[str, list[str], dict]:
    """Pull {summary, troubleshooting} out of the LLM text.

    Robust to two common LLM habits that defeated the earlier version:
    - Wrapping JSON in ```json ... ``` fences
    - Multi-line JSON where the first brace-to-last-brace span is well-formed
      but a lazy `\\{.*\\}` would also match nested fragments

    Falls back to returning the *cleaned* raw text as summary (never the
    raw JSON envelope) if we genuinely can't parse anything.
    """
    raw = (text or "").strip()
    if not raw:
        return "", [], {}

    # 1. Strip ```json ... ``` and ``` ... ``` fences wholesale.
    stripped = re.sub(r"^```(?:json)?\s*", "", raw)
    stripped = re.sub(r"\s*```$", "", stripped).strip()

    # 2. Greedy first-brace to last-brace (re.DOTALL) — works for
    #    multi-line JSON with nested quotes/escapes.
    candidate: str | None = None
    if "{" in stripped and "}" in stripped:
        candidate = stripped[stripped.index("{") : stripped.rindex("}") + 1]

    if candidate:
        try:
            obj = json.loads(candidate)
        except json.JSONDecodeError:
            obj = None
        if isinstance(obj, dict):
            summary = str(obj.get("summary", "")).strip()
            troubleshooting = _extract_str_list(obj, "troubleshooting")
            if summary:
                extras = {
                    "verdict": str(obj.get("verdict", "")).strip() or None,
                    "device_category": str(obj.get("device_category", "")).strip() or None,
                    "benign_items": _extract_str_list(obj, "benign_items"),
                    "real_items": _extract_str_list(obj, "real_items"),
                }
                return summary, troubleshooting[:8], extras

    # 3. Fallback: return a safe plain-text summary and no steps. Never
    #    leak a JSON envelope or code fences into the summary column —
    #    operators saw `\`\`\`json {"summary": ...` in the UI in prod because
    #    the previous guard only checked the leading `{` of `stripped`,
    #    which still let the raw fenced text through.
    if stripped.startswith("{") or "```" in raw or '"summary"' in raw:
        return (
            "LLM response could not be parsed. Check the review notes on "
            "this alert for the raw output."
        ), [], {}
    return stripped, [], {}


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
    summary, troubleshooting, extras = _parse_output(result.text)
    logger.info(
        "writer: incident=%s provider=%s model=%s verdict=%s category=%s summary_chars=%d steps=%d",
        incident.get("id"), result.provider, result.model,
        extras.get("verdict"), extras.get("device_category"),
        len(summary), len(troubleshooting),
    )
    return WriterOutput(
        summary=summary,
        troubleshooting=troubleshooting,
        provider=result.provider,
        model=result.model,
        raw=result.text,
        verdict=extras.get("verdict"),
        device_category=extras.get("device_category"),
        benign_items=extras.get("benign_items", []),
        real_items=extras.get("real_items", []),
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
