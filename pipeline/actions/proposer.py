"""
Propose a remediation action for an approved alert.

Runs only for alerts the **alert reviewer** already approved — we're not
going to propose taking action on a summary we don't trust. The proposer:

1. Looks up a catalog action for the incident's event family.
2. If found, writes a `proposed_actions` row linked to the incident.
3. Returns a structured result so the caller can chain to the action
   reviewer (second-line gate).

The proposer itself makes **no API calls** — it just records intent.
The action reviewer (next module) audits the proposal against current
state; a human clicks Approve to advance to the executor.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass

from .catalog import ActionSpec, action_for_incident

logger = logging.getLogger(__name__)


@dataclass
class PropoaseResult:
    action_id: int | None
    action_type: str | None
    skipped_reason: str | None = None

    @property
    def proposed(self) -> bool:
        return self.action_id is not None


def propose_action(store, incident_id: int) -> PropoaseResult:
    """Propose a catalog action for an approved incident alert.

    Returns a result even when nothing was proposed — operators can see
    why via `skipped_reason` when they debug "why is there no button."
    """
    incident = store.get_incident(incident_id)
    if not incident:
        return PropoaseResult(None, None, "incident not found")

    alert = store.get_alert_by_incident(incident_id)
    if alert is None:
        return PropoaseResult(None, None, "no alert yet")
    if alert.get("approved") != 1:
        # Refuse to propose on unreviewed / rejected alerts — the upstream
        # reviewer's verdict gates the downstream action flow.
        return PropoaseResult(None, None, "alert not approved")

    # Don't propose twice for the same incident.
    existing = store.list_proposed_actions(incident_id=incident_id)
    if existing:
        return PropoaseResult(
            action_id=int(existing[0]["id"]),
            action_type=str(existing[0]["action_type"]),
            skipped_reason="already proposed",
        )

    spec: ActionSpec | None = action_for_incident(incident)
    if spec is None:
        return PropoaseResult(None, None, "no catalog match for this event family")

    action_id = store.insert_proposed_action(
        incident_id=incident_id,
        action_type=spec.type,
        target_device_serial=incident.get("device_serial"),
        target_device_name=incident.get("device_name"),
        params={},  # populated by catalog-specific helpers later
    )
    logger.info(
        "action proposer: incident=%s action=%s id=%s",
        incident_id, spec.type, action_id,
    )
    return PropoaseResult(action_id=action_id, action_type=spec.type)
