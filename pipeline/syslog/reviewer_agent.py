"""
Reviewer agent: audit a writer-generated alert against the raw evidence.

Runs after the writer. Reads the proposed summary + the incident's raw
events + the incident row, and decides whether to publish. The point is
to catch the classic LLM failure modes before they hit the dashboard:

1. **Hallucinated specifics** — the writer invents a port number, VLAN,
   or cause that isn't in the events.
2. **Wrong counts / times** — the summary says "50 events" when the
   incident row says 12.
3. **Wrong device** — the summary names a different AP/switch than the
   one the events came from.
4. **Overstated severity** — the writer calls info-level noise
   "critical" or "outage."

The reviewer is a second LLM call, but deliberately cheap: smaller token
budget, low temperature, and must return *strict JSON* so we can parse
with `json.loads()`. Malformed output → we mark the alert pending
(approved=0) with a note, leaving a human the last say.

Output contract
---------------
`{"approved": bool, "notes": "<1-2 sentences explaining the decision>"}`

No extra keys, no prose outside the JSON.
"""

from __future__ import annotations

import json
import logging
import re
from dataclasses import dataclass
from typing import Any

from pipeline.llm import LLMError, generate

logger = logging.getLogger(__name__)


_SYSTEM_PROMPT = (
    "You are a strict network-operations reviewer. You receive an "
    "incident record, a sample of its raw events, and a short summary "
    "written by another model. Decide whether the summary is accurate "
    "and safe to show to on-call engineers. Reject if it (a) invents "
    "specifics not present in the events (ports, VLANs, causes), "
    "(b) misstates counts, device IDs, or time ranges, or "
    "(c) exaggerates severity. Approve if the summary is factually "
    "consistent with the data even if it could be more detailed. "
    "Respond with STRICT JSON only — no prose before or after — with "
    'this shape: {"approved": true|false, "notes": "short reason"}. '
    "Keep notes under 200 characters."
)


@dataclass
class ReviewResult:
    approved: bool
    notes: str
    raw: str            # original LLM text for debugging
    pending: bool = False  # True when we couldn't parse — caller should store approved=0


# ──────────────────────── prompt building ────────────────────────


def _build_prompt(
    incident: dict,
    events: list[Any],
    summary: str,
    *,
    max_event_samples: int = 8,
) -> str:
    lines = [
        "Incident record:",
        f"- device_serial: {incident.get('device_serial') or 'unknown'}",
        f"- event_code:    {incident.get('event_code') or 'NOCODE'}",
        f"- severity:      {incident.get('severity')}",
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
        "Proposed summary:",
        summary.strip(),
        "",
        "Return your verdict as strict JSON now.",
    ]
    return "\n".join(lines)


# ──────────────────────── JSON parsing ────────────────────────


def _parse_verdict(text: str) -> tuple[bool | None, str]:
    """Pull a {"approved": bool, "notes": "..."} object out of the LLM text.

    Robust to two common LLM habits (same approach the writer uses in
    writer_agent._parse_output, kept in sync for consistency):
    - ```json ... ``` fences wrapping the whole response
    - Multi-line JSON with escaped quotes → first-brace to last-brace

    Returns (approved, notes). `approved=None` means we couldn't parse —
    caller should treat as pending.
    """
    raw = (text or "").strip()
    if not raw:
        return None, "reviewer returned empty response"

    stripped = re.sub(r"^```(?:json)?\s*", "", raw)
    stripped = re.sub(r"\s*```$", "", stripped).strip()

    candidate: str | None = None
    if "{" in stripped and "}" in stripped:
        candidate = stripped[stripped.index("{") : stripped.rindex("}") + 1]

    if not candidate:
        return None, "reviewer returned no JSON"
    try:
        obj = json.loads(candidate)
    except json.JSONDecodeError as exc:
        return None, f"reviewer JSON parse failed: {exc}"

    if not isinstance(obj, dict):
        return None, "reviewer returned non-object JSON"
    if "approved" not in obj:
        return None, "reviewer JSON missing 'approved'"

    approved = obj.get("approved")
    if isinstance(approved, str):
        approved = approved.strip().lower() in ("true", "yes", "1")
    approved = bool(approved)

    notes = str(obj.get("notes", "")).strip()[:500] or (
        "approved" if approved else "rejected"
    )
    return approved, notes


# ──────────────────────── public entry point ────────────────────────


def review_alert(
    incident: dict,
    events: list[Any],
    summary: str,
    *,
    max_output_tokens: int = 200,
    max_event_samples: int = 8,
) -> ReviewResult:
    """Ask the LLM to audit a writer-produced summary.

    Never raises for malformed output — returns a pending ReviewResult
    so the caller can persist `approved=0` and let a human decide. Only
    a true network/SDK failure raises (LLMError).
    """
    prompt = _build_prompt(incident, events, summary, max_event_samples=max_event_samples)
    llm = generate(
        prompt,
        system=_SYSTEM_PROMPT,
        max_output_tokens=max_output_tokens,
        temperature=0.0,  # deterministic — we want the same verdict twice
    )
    approved, notes = _parse_verdict(llm.text)
    if approved is None:
        logger.warning(
            "reviewer: could not parse verdict for incident=%s — leaving pending (%s)",
            incident.get("id"), notes,
        )
        return ReviewResult(
            approved=False, notes=notes, raw=llm.text, pending=True,
        )

    logger.info(
        "reviewer: incident=%s approved=%s provider=%s model=%s",
        incident.get("id"), approved, llm.provider, llm.model,
    )
    return ReviewResult(approved=approved, notes=notes, raw=llm.text)


__all__ = ["review_alert", "ReviewResult", "LLMError"]
