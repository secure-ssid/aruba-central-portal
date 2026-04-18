"""
Action reviewer — the second-line gate before a remediation runs.

The alert reviewer (phase 5) verified the *description* of an incident.
This reviewer verifies the *response*: given the proposed action and
the preflight checks from the catalog, is it safe to run right now?

Output contract (strict JSON, enforced by `_parse_verdict`):

    {
      "approved": true|false,
      "notes": "short reason (< 200 chars)",
      "preflight_results": {"check_text": "pass"|"fail"|"unknown", ...}
    }

Malformed / empty → marked pending so a human still decides.
"""

from __future__ import annotations

import json
import logging
import re
from dataclasses import dataclass, field
from typing import Any

from pipeline.llm import LLMError, generate

from .catalog import ACTION_CATALOG, ActionSpec

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = (
    "You are a strict network-operations safety reviewer. You receive "
    "(a) an incident that was already validated, (b) a proposed "
    "remediation action from our catalog with its risk level and "
    "preflight checks, and (c) any current-state evidence we can "
    "gather. Decide whether running this action RIGHT NOW is safe. "
    "Reject if any preflight check fails, the action targets the wrong "
    "device, the risk level warrants operator review, or the incident "
    "doesn't actually justify the action. Respond with STRICT JSON "
    "ONLY — no prose before or after — of the form: "
    '{"approved": true|false, '
    '"notes": "short reason", '
    '"preflight_results": {"<check text>": "pass"|"fail"|"unknown"}}'
)


@dataclass
class ActionReview:
    approved: bool
    notes: str
    preflight_results: dict[str, str] = field(default_factory=dict)
    pending: bool = False
    raw: str = ""


_JSON_OBJECT_RE = re.compile(r"\{.*\}", re.DOTALL)


def _build_prompt(incident: dict, spec: ActionSpec, state_context: dict) -> str:
    lines = [
        "Incident:",
        f"- device_serial: {incident.get('device_serial') or 'unknown'}",
        f"- device_name:   {incident.get('device_name') or 'unknown'}",
        f"- event_code:    {incident.get('event_code') or 'NOCODE'}",
        f"- severity:      {incident.get('severity')}",
        f"- event_count:   {incident.get('event_count')}",
        f"- anomaly_score: {incident.get('anomaly_score')}",
        "",
        "Proposed action:",
        f"- type:        {spec.type}",
        f"- description: {spec.description}",
        f"- risk:        {spec.risk}",
        f"- requires_maintenance_window: {spec.requires_maintenance_window}",
        "",
        "Preflight checks you must evaluate:",
    ]
    for check in spec.preflight_checks:
        lines.append(f"  - {check}")
    lines.append("")
    lines.append("Current-state evidence:")
    for k, v in state_context.items():
        lines.append(f"  - {k}: {v}")
    lines.append("")
    lines.append("Return your verdict as strict JSON now.")
    return "\n".join(lines)


def _parse_verdict(text: str) -> tuple[bool | None, str, dict[str, str]]:
    """Robust parser: strip code fences, extract first {...}. Returns
    (approved|None, notes, preflight_map). None approved = pending."""
    if not text:
        return None, "empty response", {}
    stripped = re.sub(r"^```(?:json)?\s*", "", text.strip())
    stripped = re.sub(r"\s*```$", "", stripped).strip()
    m = _JSON_OBJECT_RE.search(stripped)
    if not m:
        return None, "reviewer returned no JSON", {}
    try:
        obj = json.loads(m.group(0))
    except json.JSONDecodeError as exc:
        return None, f"reviewer JSON parse failed: {exc}", {}
    if not isinstance(obj, dict) or "approved" not in obj:
        return None, "reviewer JSON missing 'approved'", {}
    approved = obj["approved"]
    if isinstance(approved, str):
        approved = approved.strip().lower() in ("true", "yes", "1", "approve")
    approved = bool(approved)
    notes = str(obj.get("notes", "")).strip()[:500] or (
        "approved" if approved else "rejected"
    )
    pre_raw = obj.get("preflight_results", {})
    preflight: dict[str, str] = {}
    if isinstance(pre_raw, dict):
        preflight = {str(k): str(v).strip().lower() for k, v in pre_raw.items()}
    return approved, notes, preflight


def review_action(
    incident: dict,
    action_type: str,
    state_context: dict[str, Any] | None = None,
    *,
    max_output_tokens: int = 250,
) -> ActionReview:
    """Run one action-review LLM call. Never raises for malformed output."""
    spec = ACTION_CATALOG.get(action_type)
    if spec is None:
        return ActionReview(
            approved=False, notes=f"unknown action type: {action_type}",
            pending=True, raw="",
        )

    prompt = _build_prompt(incident, spec, state_context or {})
    llm = generate(prompt, system=_SYSTEM_PROMPT,
                   max_output_tokens=max_output_tokens, temperature=0.0)
    approved, notes, pre = _parse_verdict(llm.text)
    if approved is None:
        logger.warning(
            "action reviewer: could not parse verdict for action=%s (%s)",
            action_type, notes,
        )
        return ActionReview(
            approved=False, notes=notes, preflight_results=pre,
            pending=True, raw=llm.text,
        )
    logger.info(
        "action reviewer: action=%s approved=%s provider=%s",
        action_type, approved, llm.provider,
    )
    return ActionReview(
        approved=approved, notes=notes, preflight_results=pre, raw=llm.text,
    )
