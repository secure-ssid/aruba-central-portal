"""
Hard-coded knowledge base for known Aruba event families and codes.

The LLM writer injects this context into its prompt so it doesn't have to
rediscover what "312402" or "dal_lacpInfo_get_all" means from first principles.
Encoding it here keeps it deterministic, auditable, and free (no tokens spent
on facts we already know).

Adding an entry
---------------
Add to FAMILY_KNOWLEDGE or CODE_KNOWLEDGE. The dict key is the family string
(from event_families.py) or the exact event code. The value is a KnowledgeEntry.
Both dicts are checked; FAMILY_KNOWLEDGE takes precedence.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class KnowledgeEntry:
    verdict_hint: str               # "benign" | "warning" | "critical" | "context-dependent"
    plain_english: str              # one sentence: what is actually happening
    why_it_fires: list[str]         # common triggers
    benign_when: list[str]          # conditions under which this is harmless
    action_required: list[str]      # what actually needs doing (empty = nothing)
    never_do: list[str] = field(default_factory=list)   # explicit don'ts
    related_codes: list[str] = field(default_factory=list)


FAMILY_KNOWLEDGE: dict[str, KnowledgeEntry] = {

    "AP_INTERNAL": KnowledgeEntry(
        verdict_hint="benign",
        plain_english=(
            "The AP's internal telemetry subsystem (embedded Redis + LACP state collector) "
            "had a transient hiccup. This is NOT a forwarding-plane failure — client traffic "
            "continues normally."
        ),
        why_it_fires=[
            "dal_lacpInfo_get_all: AP queries LACP state defensively even with a single uplink "
            "and no LAG. Returns null/empty → Central logs a warning. Normal.",
            "Redis event package validation: Aruba APs embed Redis locally for telemetry caching. "
            "Central polled it during a brief CPU spike or process restart. Not your Redis.",
            "LLDP/PoE refresh or port renegotiation can trigger both codes together.",
            "Increased telemetry churn after SSID config changes (bridged↔tunneled, multicast, MPSK).",
        ],
        benign_when=[
            "Errors span a short window (≤5 min) then stop",
            "AP uptime is continuous — no reboot at that time",
            "Clients are not disconnecting",
            "AP CPU is not pegged",
        ],
        action_required=[],
        never_do=[
            "Do NOT attempt to 'fix' the Redis server — it is embedded in the AP, not on your network",
            "Do NOT add LACP config to the AP uplink — LACP polling is defensive, not a requirement",
            "Do NOT RMA the AP based on this code alone",
            "Do NOT roll back firmware",
        ],
        related_codes=["312402", "312404"],
    ),

    "WPA_HANDSHAKE": KnowledgeEntry(
        verdict_hint="warning",
        plain_english=(
            "A client failed the WPA2/WPA3 4-way handshake with this AP. "
            "Common causes: wrong/cached PSK, stale MPSK entry, or client roaming "
            "remnants after a security config change."
        ),
        why_it_fires=[
            "MIC failure (132094): client sent wrong Message 2 — usually a stale cached PSK.",
            "Handshake timeout (520013): client didn't respond in time — often a legacy or "
            "power-saving device.",
            "After an SSID PSK change, devices must forget and rejoin — residual failures "
            "are expected for ~10 min.",
            "MPSK: if the per-device MAC entry has the wrong key, every join attempt fails.",
        ],
        benign_when=[
            "Errors appear briefly after a PSK/MPSK change then stop",
            "Only one or two client MACs are involved",
            "Client successfully rejoins after re-entering credentials",
        ],
        action_required=[
            "Identify the client MAC from the events and check its MPSK entry in Central",
            "If PSK was recently changed, have the client 'forget' the network and rejoin",
            "If errors persist >30 min for the same MAC, the MPSK entry is likely wrong",
        ],
        never_do=[
            "Do NOT disable WPA2/WPA3 to 'fix' MIC failures",
            "Do NOT ignore persistent MIC failures from the same MAC — it will never connect",
        ],
        related_codes=["132093", "132094", "341004", "341005", "520013"],
    ),

    "CLIENT_LIFECYCLE": KnowledgeEntry(
        verdict_hint="context-dependent",
        plain_english=(
            "Normal client association/disassociation/roam events. "
            "A spike is worth investigating; a trickle is routine."
        ),
        why_it_fires=[
            "Device waking from sleep, roaming between APs, or power-cycling.",
            "802.11r/k/v roam — some clients deauth before moving to a better AP.",
            "IoT devices that reconnect on every wake cycle.",
        ],
        benign_when=[
            "Events are spread across different client MACs",
            "The same client successfully reassociates each time",
            "No auth failures accompany the disassocs",
        ],
        action_required=[
            "If one MAC is continuously deauthing and not rejoining: check PSK and MPSK",
            "If all clients on one AP are deauthing simultaneously: check AP uplink and PoE",
        ],
        related_codes=["541023", "AP_EVENT_DOT11_ASSOC", "AP_EVENT_DOT11_DISASSOC",
                       "AP_EVENT_DOT11_DEAUTH"],
    ),

    "BROADCAST_STORM": KnowledgeEntry(
        verdict_hint="critical",
        plain_english=(
            "A broadcast/multicast storm on the wired uplink is saturating the AP's "
            "forwarding table. This WILL impact client traffic."
        ),
        why_it_fires=[
            "Layer-2 loop on the wired network (missing or misconfigured STP).",
            "Edge port with BPDU-guard disabled connected to a switch.",
            "Rogue device plugged into a trunk port.",
        ],
        benign_when=[],
        action_required=[
            "Identify the port generating the storm in Central's wired topology",
            "Check STP on the upstream switch — ensure edge ports have BPDU-guard",
            "Physically inspect ports if loop source is unclear",
        ],
        never_do=[
            "Do NOT disable STP as a workaround — it will make loops worse",
        ],
    ),

    "LINK_STATE": KnowledgeEntry(
        verdict_hint="warning",
        plain_english="A wired port or AP uplink changed state (up/down/flap).",
        why_it_fires=[
            "Physical cable issue or bad SFP.",
            "PoE budget exceeded — AP lost power briefly.",
            "Upstream switch port auto-negotiation mismatch.",
            "Planned maintenance or device reboot.",
        ],
        benign_when=[
            "Single event accompanying a planned reboot or cable reconnect",
            "Link came back up immediately and stayed up",
        ],
        action_required=[
            "If flapping: check cable, SFP, and PoE budget",
            "Verify the upstream switch port speed/duplex matches the AP",
        ],
    ),

    "DHCP": KnowledgeEntry(
        verdict_hint="warning",
        plain_english="DHCP pool exhaustion or decline — clients may not get an IP address.",
        why_it_fires=[
            "Too many devices for the pool size.",
            "Lease time too long — stale leases eating addresses.",
            "DHCP server unreachable from this VLAN.",
            "Client sending DECLINE due to IP conflict detection.",
        ],
        benign_when=[
            "Single DECLINE from one client at reconnect — client will retry",
        ],
        action_required=[
            "Check pool utilization on the DHCP server",
            "Shorten lease times if the pool is large but utilization is high",
            "Verify the DHCP helper/relay is correct for this VLAN",
        ],
    ),

    "RADIUS": KnowledgeEntry(
        verdict_hint="critical",
        plain_english=(
            "The AP cannot reach the RADIUS/AAA server — all 802.1X/WPA-Enterprise "
            "authentications will fail until this is resolved."
        ),
        why_it_fires=[
            "RADIUS server down or overloaded.",
            "Firewall rule blocking UDP 1812/1813 from the AP.",
            "Wrong RADIUS server IP or shared secret in Central.",
            "Network path between AP and RADIUS server broken.",
        ],
        benign_when=[],
        action_required=[
            "Ping the RADIUS server from a device on the same VLAN as the AP",
            "Check Central's AAA config for the correct server IP and shared secret",
            "Verify firewall rules allow UDP 1812/1813 from AP subnet",
            "Check RADIUS server logs for reject/timeout entries",
        ],
    ),

    "ROGUE_AP": KnowledgeEntry(
        verdict_hint="context-dependent",
        plain_english=(
            "The AP detected a neighbor SSID it doesn't recognise. "
            "Usually a nearby consumer router or guest hotspot — rarely a real attack."
        ),
        why_it_fires=[
            "Neighbor's home router broadcasting an SSID on the same channel.",
            "Unmanaged AP plugged into the wired network.",
            "Actual rogue AP (uncommon in home/small office environments).",
        ],
        benign_when=[
            "The BSSID is a known neighbor device",
            "Signal strength is low (neighbor, not on-wire)",
            "The SSID name doesn't match any of your SSIDs",
        ],
        action_required=[
            "If the rogue is on your wired network: trace the MAC via switch CAM table",
            "If it's a neighbor: no action needed — add to ignore list in Central if noisy",
        ],
    ),

    "DFS_RADAR": KnowledgeEntry(
        verdict_hint="benign",
        plain_english=(
            "The AP detected a radar pulse on a DFS channel and moved to a different "
            "channel automatically. This is normal 5 GHz DFS behaviour."
        ),
        why_it_fires=[
            "FAA/weather radar pulse on the current DFS channel.",
            "Microwave or other interference mistaken for radar by the AP chipset.",
        ],
        benign_when=["Always — DFS channel changes are mandatory and automatic"],
        action_required=[
            "If DFS events are frequent (daily): consider pinning non-DFS channels (36–48)",
        ],
        never_do=[
            "Do NOT disable DFS — it is legally required in most regions",
        ],
    ),
}

# Code-level overrides for cases where the family context isn't specific enough.
CODE_KNOWLEDGE: dict[str, KnowledgeEntry] = {
    "312402": FAMILY_KNOWLEDGE["AP_INTERNAL"],
    "312404": FAMILY_KNOWLEDGE["AP_INTERNAL"],
    "132094": FAMILY_KNOWLEDGE["WPA_HANDSHAKE"],
    "520013": FAMILY_KNOWLEDGE["WPA_HANDSHAKE"],
}


def get_knowledge(event_code: str | None, family: str | None) -> KnowledgeEntry | None:
    """Return the best KnowledgeEntry for this code+family, or None."""
    if family and family in FAMILY_KNOWLEDGE:
        return FAMILY_KNOWLEDGE[family]
    if event_code and event_code in CODE_KNOWLEDGE:
        return CODE_KNOWLEDGE[event_code]
    return None
