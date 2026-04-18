"""Network action review pipeline — Marvis/self-driving proposals with human gate.

Flow per action:
    incident  →  proposer picks a catalog action  →  reviewer audits safety
             →  pending human click  →  executor calls Marvis API (stub today)
"""

from .catalog import ACTION_CATALOG, ActionSpec, action_for_incident
from .executor import ExecutionError, execute_action
from .proposer import PropoaseResult, propose_action
from .reviewer import ActionReview, review_action

__all__ = [
    "ACTION_CATALOG",
    "ActionSpec",
    "action_for_incident",
    "PropoaseResult",
    "propose_action",
    "ActionReview",
    "review_action",
    "execute_action",
    "ExecutionError",
]
