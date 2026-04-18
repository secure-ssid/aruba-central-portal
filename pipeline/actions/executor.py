"""
Action executor — the fire button.

Phase 10a intentionally does NOT call Marvis / Central APIs. It marks
the row `executed` and records that execution was simulated. Phase 10b
will plug real API calls into the per-action handlers below once we've
confirmed endpoints and rollback paths.

This module is deliberately dumb on purpose:
- No retry loops
- No scheduling
- No partial execution

Each action is atomic: call → success or failure → write back to the DB.
Operators see the outcome on the next page refresh.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Callable

from .catalog import ACTION_CATALOG, ActionSpec

logger = logging.getLogger(__name__)


class ExecutionError(RuntimeError):
    """Raised when an action handler couldn't complete."""


# Per-action handler. Signature: (action_row, aruba_client) -> dict of
# execution metadata to persist. Raise ExecutionError to mark as failed.
ActionHandler = Callable[[dict, Any], dict[str, Any]]


def _simulated(action_row: dict, _client: Any) -> dict[str, Any]:
    """Default stub — records what *would* run without actually running."""
    return {
        "simulated": True,
        "note": (
            "Phase 10a stub. Real API call lands in Phase 10b once the "
            f"Marvis endpoint for '{action_row.get('action_type')}' is confirmed."
        ),
    }


# All handlers start stubbed. Swap these entries in Phase 10b as each
# real API call is verified — one at a time, with its own tests.
HANDLERS: dict[str, ActionHandler] = {
    key: _simulated for key in ACTION_CATALOG.keys()
}


def _safe_mark(store, action_id: int, **kwargs) -> None:
    """update_proposed_action can itself raise (DB locked, transient OS
    error). Swallow and log — the caller is already in a failure path
    and can't do anything useful with a second exception."""
    try:
        store.update_proposed_action(action_id, **kwargs)
    except Exception:  # noqa: BLE001
        logger.exception(
            "action executor: failed to mark action %s with %s — status may be stale",
            action_id, kwargs,
        )


def execute_action(store, action_id: int, aruba_client: Any = None) -> dict[str, Any]:
    """Run a proposed action. Must be in status 'approved' to fire.

    Writes the outcome back to the row and returns a summary dict suitable
    for the API response.
    """
    action = store.get_proposed_action(action_id)
    if not action:
        raise ExecutionError(f"action {action_id} not found")
    if action["status"] != "approved":
        raise ExecutionError(
            f"action {action_id} status is {action['status']!r}; must be 'approved'"
        )

    spec: ActionSpec | None = ACTION_CATALOG.get(action["action_type"])
    if spec is None:
        _safe_mark(
            store, action_id, status="failed",
            execution_error=f"unknown action type: {action['action_type']}",
        )
        raise ExecutionError(f"unknown action type: {action['action_type']}")

    handler = HANDLERS.get(spec.type, _simulated)
    try:
        meta = handler(action, aruba_client)
    except Exception as exc:  # noqa: BLE001 — record the error verbatim
        logger.exception("action executor: handler failed for %s", spec.type)
        _safe_mark(store, action_id, status="failed", execution_error=str(exc))
        raise ExecutionError(str(exc)) from exc

    _safe_mark(
        store, action_id,
        status="executed",
        executed_at=datetime.now(timezone.utc),
    )
    return {"action_id": action_id, "status": "executed", "meta": meta}


__all__ = ["execute_action", "ExecutionError", "HANDLERS"]
