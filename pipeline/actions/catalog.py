"""
Catalog of network remediation actions.

Every entry describes an action a human (or, eventually, an automated
agent) can take to resolve a class of incident. The catalog is used by:

- the **proposer** to pick a candidate action given an incident family
- the **reviewer** prompt to understand what each action actually does
- the UI to render a safe, consistent button per action type

Keep this list small, explicit, and conservative. An action only lands
here after we know exactly what API call executes it and what the
rollback looks like.

The `execute` field is a callable placeholder — Phase 10a keeps all
actions as no-op stubs that just mark the row `executed`. Phase 10b
will wire the real Marvis / Aruba Central API calls once we confirm
them end-to-end.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable


@dataclass(frozen=True)
class ActionSpec:
    """One remediation action the system knows how to propose/review."""
    type: str                   # stable identifier, e.g. 'firmware_upgrade'
    label: str                  # short human label for the UI button
    description: str            # 1-2 sentence explanation shown to the reviewer
    family: str                 # which incident family this targets
    risk: str                   # 'low' | 'medium' | 'high' — affects review scrutiny
    requires_maintenance_window: bool
    preflight_checks: tuple[str, ...]  # what the reviewer should verify before approve
    rollback: str               # one-line rollback procedure shown on the card


ACTION_CATALOG: dict[str, ActionSpec] = {
    "firmware_upgrade": ActionSpec(
        type="firmware_upgrade",
        label="Upgrade AP firmware",
        description=(
            "Schedule a Marvis firmware upgrade for the target AP. Marvis "
            "only upgrades one AP per 24h window during low-usage periods."
        ),
        family="FIRMWARE_NONCOMPLIANT",
        risk="medium",
        requires_maintenance_window=True,
        preflight_checks=(
            "AP is currently serving < 5 active clients.",
            "No open high-severity incidents on this AP.",
            "Site is not in an active maintenance freeze.",
        ),
        rollback="Downgrade via Central > Firmware > Rollback. Expect 5-10 min AP reboot.",
    ),
    "dynamic_capacity_optimization": ActionSpec(
        type="dynamic_capacity_optimization",
        label="Enable DCO",
        description=(
            "Let Marvis adjust channel band and bandwidth based on observed "
            "usage and interference. Can enable dual-band and widen channels."
        ),
        family="CAPACITY_SATURATED",
        risk="low",
        requires_maintenance_window=False,
        preflight_checks=(
            "No DFS radar events on this site in the last 24h.",
            "Client roaming success rate is stable (> 90%).",
        ),
        rollback="Disable DCO in Marvis > Self-Driving. Previous channel plan restores automatically.",
    ),
    "dfs_optimization": ActionSpec(
        type="dfs_optimization",
        label="View DFS optimization",
        description=(
            "DFS Optimization is always-on; this action surfaces the "
            "7-day radar impact report for the site. Read-only."
        ),
        family="DFS_RADAR",
        risk="low",
        requires_maintenance_window=False,
        preflight_checks=(),
        rollback="N/A — read-only.",
    ),
    "reboot_ap": ActionSpec(
        type="reboot_ap",
        label="Reboot AP",
        description=(
            "Soft-reboot the AP via Central. Last-resort remediation for "
            "APs stuck in a degraded state that don't respond to config pushes."
        ),
        family="AP_STUCK",
        risk="high",
        requires_maintenance_window=True,
        preflight_checks=(
            "Confirm AP is actually degraded (ping loss, stuck client count).",
            "AP is serving < 3 clients OR it's outside business hours.",
            "Alternate coverage is available for the site.",
        ),
        rollback="None — reboot is fire-and-forget. AP returns to service in 2-4 min.",
    ),
    "bounce_switch_port": ActionSpec(
        type="bounce_switch_port",
        label="Bounce switch port",
        description=(
            "Disable then re-enable a specific switch port. Fixes a stuck "
            "port-state without rebooting the whole switch."
        ),
        family="LINK_STATE",
        risk="medium",
        requires_maintenance_window=False,
        preflight_checks=(
            "Port is currently showing error/suspended/down.",
            "Port is not the uplink to the rest of the network.",
        ),
        rollback="Re-enable the port via Central > Ports. Link should recover in seconds.",
    ),
}


def action_for_incident(incident: dict) -> ActionSpec | None:
    """Return the best catalog action for an incident, or None.

    Matching is intentionally simple — incident's event_code is mapped to
    a family by the event_families module, and we look for a catalog
    entry whose `family` field matches. Some families (WPA_HANDSHAKE,
    CLIENT_LIFECYCLE) intentionally have no auto-remediation because the
    right fix is usually operator-dependent (wrong PSK, bad client SW).
    """
    from pipeline.syslog.event_families import family_for

    event_code = incident.get("event_code")
    family = family_for(event_code) if event_code else None
    if not family:
        return None
    for spec in ACTION_CATALOG.values():
        if spec.family == family:
            return spec
    return None


__all__ = ["ActionSpec", "ACTION_CATALOG", "action_for_incident"]
