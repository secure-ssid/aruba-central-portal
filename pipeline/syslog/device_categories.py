"""
Device category recognition for the LLM writer.

Inspects hostname, device_name, event messages, and event_code to classify
what kind of device generated the incident. The category + known-normal-
behaviour hints are injected into the writer prompt so the LLM can say
"this is normal for a Roku" instead of treating every error as a crisis.

Design principles
-----------------
- Deterministic: pure string matching, no LLM call.
- Conservative: only classify when confident; fall back to UNKNOWN.
- Extensible: add a new DeviceCategory entry; nothing else needs changing.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field


@dataclass(frozen=True)
class DeviceCategory:
    name: str                          # short label shown in prompt
    description: str                   # what this device class is
    normal_behaviours: list[str]       # errors that are benign for this type
    watch_for: list[str]               # errors that DO matter for this type
    hostname_patterns: list[re.Pattern] = field(default_factory=list, compare=False, hash=False)
    message_patterns: list[re.Pattern] = field(default_factory=list, compare=False, hash=False)


def _p(*patterns: str) -> list[re.Pattern]:
    return [re.compile(p, re.IGNORECASE) for p in patterns]


CATEGORIES: list[DeviceCategory] = [
    DeviceCategory(
        name="Roku / streaming stick",
        description="Consumer streaming device (Roku, Fire TV, Chromecast, etc.)",
        normal_behaviours=[
            "Hostname updates multiple times per session or roam — normal for Roku/Fire TV",
            "IPv6 (::) to IPv4 fallback — streaming devices often try v6 first",
            "Multicast mDNS/SSDP bursts for discovery (Chromecast, AirPlay, DIAL)",
            "Repeated re-association after sleep/wake cycles",
            "mcast vlan map failed when no explicit multicast VLAN is needed",
        ],
        watch_for=[
            "Persistent auth failures (MIC, 4-way handshake) — wrong PSK or MPSK entry",
            "Client blacklisted — PSK mismatch or RADIUS reject",
            "Continuous deauth loop (>10 in 5 min) — check SSID config",
        ],
        hostname_patterns=_p(
            r"roku", r"fire.*tv", r"firetv", r"chromecast", r"androidtv",
            r"amazon.*stick", r"fireStick",
        ),
        message_patterns=_p(r"roku", r"fire.?tv", r"chromecast"),
    ),
    DeviceCategory(
        name="Apple TV / AirPlay device",
        description="Apple TV, HomePod, or other AirPlay-capable Apple device",
        normal_behaviours=[
            "Hostname updates after CloudKit / iCloud sync — normal Apple behaviour",
            "IPv6 to IPv4 fallback (:: → 192.168.x.x)",
            "mDNS/Bonjour multicast for AirPlay discovery",
            "mcast vlan map failed when bridged SSID has no multicast VLAN set",
            "Periodic re-association triggered by tvOS background tasks",
        ],
        watch_for=[
            "AirPlay discovery broken → likely multicast VLAN misconfiguration",
            "Persistent MIC failures → cached wrong PSK, needs re-provision",
            "Repeated DHCP declines → IP conflict or pool exhaustion",
        ],
        hostname_patterns=_p(
            r"appletv", r"apple.?tv", r"homepod", r"airtunes",
            r"\bAtv\b", r"apple.*airplay",
        ),
        message_patterns=_p(r"appletv", r"bonjour", r"airplay", r"airtunes"),
    ),
    DeviceCategory(
        name="Smart TV",
        description="Smart TV (Samsung, LG, Sony, Vizio, TCL, Hisense, etc.)",
        normal_behaviours=[
            "Hostname updates after firmware / app updates — all major TV brands do this",
            "IPv6 fallback (::) — common in half-baked TV IPv6 stacks",
            "mcast vlan map failed — TVs rely on mDNS/DIAL but rarely need a dedicated mcast VLAN",
            "Frequent DHCP requests after power-cycle or deep-sleep",
            "Multiple MAC addresses if the TV uses separate radios for BT vs Wi-Fi",
        ],
        watch_for=[
            "Persistent auth loop → PSK/MPSK mismatch",
            "Continuous disassoc/reassoc → 2.4 GHz congestion or roaming issue",
            "DHCP exhaustion → TV may be cycling IPs rapidly",
        ],
        hostname_patterns=_p(
            r"\d{2}[A-Z]{2,4}Series",  # e.g. 55RokuSelectSeries
            r"samsung.*tv", r"lgsmarttv", r"sony.*bravia", r"vizio",
            r"tcl.*tv", r"hisense", r"philips.*tv",
            r"[0-9]{2}.*(?:Roku|Select|Series|4K|OLED|QLED).*TV",
        ),
        message_patterns=_p(r"samsung.*tv", r"bravia", r"vizio", r"tcl.*tv"),
    ),
    DeviceCategory(
        name="Sonos / audio system",
        description="Sonos speaker or other network audio device",
        normal_behaviours=[
            "Multicast-heavy: Sonos uses mDNS + SSDP for discovery constantly",
            "mcast vlan map failed → Sonos needs mDNS reflector or same-VLAN peers",
            "Frequent re-association after Sonos update or reboot",
        ],
        watch_for=[
            "Sonos can't see other speakers → multicast VLAN or mDNS reflector misconfiguration",
            "Persistent auth failures → PSK mismatch",
        ],
        hostname_patterns=_p(r"sonos", r"sonosplayer", r"rincon"),
        message_patterns=_p(r"sonos", r"rincon"),
    ),
    DeviceCategory(
        name="IoT / smart home sensor",
        description="Smart home device, sensor, plug, bulb, thermostat, etc.",
        normal_behaviours=[
            "Simple DHCP + small bursts of traffic — these devices rarely flood",
            "May not support 5 GHz — will always associate on 2.4 GHz",
            "Hostname may be MAC-derived or vendor-default",
            "mcast vlan map failed is common for bridge-mode IoT SSIDs",
        ],
        watch_for=[
            "Auth loop → PSK mismatch or MPSK entry wrong for this device's MAC",
            "Device offline → DHCP failure or wrong VLAN",
        ],
        hostname_patterns=_p(
            r"ring", r"nest", r"ecobee", r"wemo", r"hue", r"lifx",
            r"smartthings", r"tuya", r"shelly", r"tp.?link.*tapo",
            r"wyze", r"arlo", r"eufy", r"reolink",
        ),
        message_patterns=_p(r"ring", r"nest", r"tuya", r"shelly"),
    ),
    DeviceCategory(
        name="Aruba AP",
        description="Aruba access point (LR-AP735, BY-AP763, Off_655, MB_635, etc.)",
        normal_behaviours=[
            "AP_INTERNAL codes (312402, 312404) are LACP/redis telemetry — not client-facing",
            "IDS rogue-AP scan logs are informational",
            "GW-HA cluster references in logs are status messages, not failures",
            "prefer_v6 / IP mismatch is informational unless tunnels are actually flapping",
        ],
        watch_for=[
            "Repeated client MIC failures → MPSK cache stale, PSK wrong, or roaming remnants",
            "AP goes offline → PoE budget, uplink, or config push issue",
            "Broadcast storm on wired uplink → STP/loop issue on trunk",
            "RADIUS timeout → check AAA reachability from this AP's site",
            "Multicast VLAN map failed → check SSID multicast config (bridged vs tunneled)",
        ],
        hostname_patterns=_p(
            r"LR.?AP", r"BY.?AP", r"MB.?AP", r"Off_", r"MasterBa",
            r"AP-\d", r"IAP", r"\bAP\d",
        ),
        message_patterns=_p(r"sapd", r"fpapps", r"stm", r"wpa.*key", r"mcast.*vlan"),
    ),
    DeviceCategory(
        name="Network switch / gateway",
        description="Aruba switch, gateway, or routing device",
        normal_behaviours=[
            "LACP PDU logs are normal for trunked uplinks",
            "STP topology change notifications fire on every port-up",
        ],
        watch_for=[
            "Port flapping → physical cable or SFP issue",
            "Broadcast storm → check STP and edge-port config",
            "Gateway HA failover events → investigate primary health",
        ],
        hostname_patterns=_p(r"switch", r"gateway", r"GW-", r"aruba.*cx", r"6[23][0-9]{2}"),
        message_patterns=_p(r"lacp", r"stp.*topology", r"spanning.tree"),
    ),
]

_UNKNOWN = DeviceCategory(
    name="Unknown device",
    description="Device type not identified from hostname or event content",
    normal_behaviours=[],
    watch_for=[],
)


def classify(
    *,
    hostname: str | None,
    device_name: str | None,
    messages: list[str],
) -> DeviceCategory:
    """Return the best-matching DeviceCategory, or _UNKNOWN."""
    candidates = [hostname or "", device_name or ""] + messages[:5]
    text = " ".join(candidates)

    for cat in CATEGORIES:
        for pat in cat.hostname_patterns:
            if pat.search(hostname or "") or pat.search(device_name or ""):
                return cat
        for pat in cat.message_patterns:
            if pat.search(text):
                return cat
    return _UNKNOWN
