"""
Event-family map: group related event codes into one cluster key.

Problem this solves
--------------------
Aruba syslog often emits several codes for the same underlying story.
For example, a single WPA handshake failure produces both:

  132094  <WARN>  MIC failed in WPA2 Key Message 2 ...
  520013  <ERRS>  wpa key handshake fail as CLIENT_TIMEOUT

Both refer to the same client/AP/window, but the clusterer treats them
as separate incidents because its signature includes the raw code. The
operator sees two rows for one problem.

Approach
--------
Each code maps to a `family` string used in the cluster signature.
Unknown codes fall back to the raw code — so the behavior is identical
to the old clusterer until a family is added.

The family map is hand-maintained (code review friendly, deterministic)
rather than LLM-classified. There are ~30 Aruba codes that recur in
practice; an LLM for every cluster tick would be overkill.

Additions
---------
Keep the map small and high-confidence. Adding a code here merges it
with others — so only group codes that truly represent the same story.
Prefer the exact code (`132094`) over a regex when possible.
"""

from __future__ import annotations

import re

# Exact (AOS numeric code or UPPER_SNAKE string) → family.
_EXACT_FAMILY: dict[str, str] = {
    # ArubaOS 8 WPA/key handshake failures
    "132094": "WPA_HANDSHAKE",
    "520013": "WPA_HANDSHAKE",
    # Classic AOS / RFC3164 codes that tend to emit together
    "AP_EVENT_DOT11_ASSOC": "CLIENT_LIFECYCLE",
    "AP_EVENT_DOT11_DISASSOC": "CLIENT_LIFECYCLE",
    "AP_EVENT_DOT11_DEAUTH": "CLIENT_LIFECYCLE",
    # Central normalized codes — see pipeline.central_events.normalizer
    "ONBOARDING_FAILURE_KEY_EXCHANGE": "WPA_HANDSHAKE",
    "ONBOARDING_FAILURE_KEY_EXCHANGE_MIC_FAILURE": "WPA_HANDSHAKE",
    "802_11_DE_AUTHENTICATION_TO_CLIENT": "CLIENT_LIFECYCLE",
    "802_11_DE_AUTHENTICATION_FROM_CLIENT": "CLIENT_LIFECYCLE",
    "CLIENT_ROAM_SUCCESS": "CLIENT_LIFECYCLE",
    "CLIENT_ROAM_FAILURE": "CLIENT_LIFECYCLE",
}

# Regex fallback for code groups. Checked after the exact map.
# Tuples are (compiled_regex, family). First match wins.
_REGEX_FAMILY: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r".*BROADCAST.*STORM.*"), "BROADCAST_STORM"),
    (re.compile(r".*LINK.*(DOWN|UP|FLAP).*"), "LINK_STATE"),
    (re.compile(r".*PORT.*(DOWN|UP|FLAP).*"), "LINK_STATE"),
    (re.compile(r".*DHCP.*(EXHAUST|DECLIN|POOL|NAK).*"), "DHCP"),
    (re.compile(r".*RADIUS.*(DOWN|TIMEOUT|REJECT|UNREACH).*"), "RADIUS"),
    (re.compile(r".*RADAR.*"), "DFS_RADAR"),
    (re.compile(r".*(MIC.*FAIL|WPA.*HANDSHAKE|KEY.*EXCHANGE).*"), "WPA_HANDSHAKE"),
]


def family_for(event_code: str | None) -> str | None:
    """Return the family name for an event_code, or None if unknown.

    Callers pair the family with the raw code for display/debug but use
    the family (when present) inside the cluster signature so related
    codes collapse into one incident.
    """
    if not event_code:
        return None
    if event_code in _EXACT_FAMILY:
        return _EXACT_FAMILY[event_code]
    for pattern, family in _REGEX_FAMILY:
        if pattern.search(event_code):
            return family
    return None


def cluster_key_for(event_code: str | None) -> str:
    """What the clusterer should hash for this event.

    Returns the family when known, otherwise the raw code, otherwise the
    literal 'NOCODE'. Always a non-empty string so signature math is
    consistent.
    """
    family = family_for(event_code)
    if family:
        return family
    return event_code or "NOCODE"
