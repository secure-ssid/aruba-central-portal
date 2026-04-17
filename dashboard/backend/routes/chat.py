"""
routes/chat.py — Webhook ingest, SSE streaming, and MSP Chatbot Backend.

Extracted from app.py lines 7597–9611.
"""

from flask import Blueprint, request, jsonify, Response, stream_with_context
import logging
import os
import time
import json
import queue
import re
import hmac
import hashlib
import collections as _collections
import httpx

from .helpers import require_session, cached_get

chat_bp = Blueprint("chat", __name__)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# centralmcp client — lazy-initialised, uses dashboard credentials
# ---------------------------------------------------------------------------
# Maps ARUBA_* env vars (dashboard) → SOURCE_* (centralmcp) so we don't need
# a separate credentials file.  Falls back gracefully if the package isn't
# installed or credentials are missing.

_mcp_client = None
_mcp_client_lock = __import__("threading").Lock()


def _get_mcp_client():
    """Return a shared MCPClient built from dashboard env vars, or None."""
    global _mcp_client
    if _mcp_client is not None:
        return _mcp_client
    with _mcp_client_lock:
        if _mcp_client is not None:
            return _mcp_client
        try:
            from pipeline.clients.central_client import CentralClient
            from pipeline.clients.token_manager import TokenManager
            from pipeline.clients.mcp_client import MCPClient

            base_url = os.environ.get("ARUBA_BASE_URL") or os.environ.get("SOURCE_BASE_URL", "")
            client_id = os.environ.get("ARUBA_CLIENT_ID") or os.environ.get("SOURCE_CLIENT_ID", "")
            client_secret = os.environ.get("ARUBA_CLIENT_SECRET") or os.environ.get("SOURCE_CLIENT_SECRET", "")

            if not all([base_url, client_id, client_secret]):
                logger.warning("centralmcp: missing credentials — MCP tools unavailable")
                return None

            tm = TokenManager(client_id=client_id, client_secret=client_secret, cache_key="chat_mcp")
            central = CentralClient(base_url=base_url, token_manager=tm)
            _mcp_client = MCPClient(central)
            logger.info("centralmcp: MCPClient initialised from dashboard credentials")
            return _mcp_client
        except ImportError:
            logger.warning("centralmcp package not installed — install from GitHub to enable MCP tools")
            return None
        except Exception as exc:
            logger.warning(f"centralmcp: init failed: {exc}")
            return None


# Shown when a field is missing in chat tables / summaries (matches portal em dash usage)
_CHAT_MISSING = "—"


def _first_present_str(d: dict, *keys: str) -> str:
    """First non-empty string among dict keys, or empty string."""
    for k in keys:
        if k not in d:
            continue
        v = d.get(k)
        if v is None:
            continue
        s = str(v).strip()
        if s:
            return s
    return ""


def _cell(val: str) -> str:
    """Table cell: use em dash when value is blank."""
    return val if val else _CHAT_MISSING


def _device_display_name(d: dict) -> str:
    """Resolve human-readable device name from typical Central / monitoring payloads."""
    return _first_present_str(
        d,
        "name",
        "hostname",
        "deviceName",
        "device_name",
        "ap_name",
        "switch_name",
        "deviceHostname",
        "label",
    )


def _device_serial(d: dict) -> str:
    return _first_present_str(d, "serialNumber", "serial", "device_serial")


def _site_display_name(s: dict) -> str:
    return _first_present_str(
        s,
        "scopeName",
        "site_name",
        "siteName",
        "site",
        "name",
    )


def _client_display_name(c: dict) -> str:
    n = _first_present_str(
        c,
        "name",
        "hostname",
        "client_name",
        "clientName",
        "description",
    )
    if n:
        return n
    return _first_present_str(c, "macaddr", "mac", "macAddress")


def _wlan_ssid(w: dict) -> str:
    essid = w.get("essid")
    if isinstance(essid, dict):
        v = _first_present_str(essid, "name", "ssid")
        if v:
            return v
    elif isinstance(essid, str) and essid.strip():
        return essid.strip()
    return _first_present_str(w, "ssid")


# ---------------------------------------------------------------------------
# Chat-specific rate limiter for destructive actions (bounce / reboot / ack)
# ---------------------------------------------------------------------------
_chat_action_tracker: dict = {}  # session_id -> deque of timestamps
_CHAT_ACTION_LIMIT = 4  # max destructive actions per window
_CHAT_ACTION_WINDOW = 60  # seconds


def _chat_action_allowed(session_id: str) -> bool:
    """Return True if the session is within the destructive-action rate limit."""
    now = time.time()
    dq = _chat_action_tracker.setdefault(session_id, _collections.deque())
    # Evict timestamps outside the rolling window
    while dq and dq[0] < now - _CHAT_ACTION_WINDOW:
        dq.popleft()
    if len(dq) >= _CHAT_ACTION_LIMIT:
        return False
    dq.append(now)
    return True


# ---------------------------------------------------------------------------
# Intent definitions
# ---------------------------------------------------------------------------
# Each intent is a dict with:
#   name        : str  – machine-readable identifier
#   description : str  – shown in help text
#   patterns    : list[re.Pattern] – any match triggers this intent
#   destructive : bool – True means _chat_action_allowed() is checked
# ---------------------------------------------------------------------------

_INTENTS = []


def _intent(name, description, patterns, destructive=False):
    _INTENTS.append(
        {
            "name": name,
            "description": description,
            "patterns": [re.compile(p, re.IGNORECASE) for p in patterns],
            "destructive": destructive,
        }
    )


# 1. AP Status / down APs
_intent(
    "ap_status",
    "Check how many APs are up/down, optionally at a specific site",
    [
        r"\bap[s]?\b.*\b(down|up|status|online|offline|health)\b",
        r"\b(down|up|status|offline|online)\b.*\bap[s]?\b",
        r"how many ap",
        r"access point.*\b(down|up|status)\b",
        r"\b(down|up|status)\b.*access point",
    ],
)

# 2. Site health
_intent(
    "site_health",
    "Get health score and device counts for one or all sites",
    [
        r"\bsite[s]?\b.*\b(health|status|score|down|up|issue)\b",
        r"\b(health|status|score)\b.*\bsite[s]?\b",
        r"which site.*problem",
        r"site.*unhealthy",
        r"unhealthy site",
    ],
)

# 3. Client lookup by SSID
_intent(
    "clients_by_ssid",
    "List clients connected to a specific SSID / WLAN",
    [
        r"\bclient[s]?\b.*\bssid\b",
        r"\bssid\b.*\bclient[s]?\b",
        r"connect.*\bssid\b",
        r"who.*connect.*wifi",
        r"client[s]?\s+on\s+\w",
        r"\bwifi\b.*client",
        r"client.*wlan",
        r"wlan.*client",
    ],
)

# 4. Client lookup by MAC
_intent(
    "client_by_mac",
    "Look up a client by MAC address",
    [
        r"\b([0-9a-f]{2}[:\-]){5}[0-9a-f]{2}\b",  # MAC address pattern
        r"\bmac\b.*\bclient\b",
        r"\bclient\b.*\bmac\b",
        r"find client.*mac",
        r"who is.*[0-9a-f]{2}:[0-9a-f]{2}",
    ],
)

# 5. Switch port errors
_intent(
    "switch_port_errors",
    "Find switch with highest port error counters",
    [
        r"\bswitch\b.*\b(error[s]?|fault|drop[s]?|crc|collision)\b",
        r"\b(error[s]?|fault|drop[s]?|crc)\b.*\bswitch\b",
        r"port error",
        r"most error",
        r"interface.*error",
        r"which switch.*error",
        r"error.*port",
    ],
)

# 6. Bounce / reboot AP
_intent(
    "bounce_ap",
    "Reboot an AP by serial number",
    [
        r"\b(bounce|reboot|restart|reset)\b.*\bap\b",
        r"\bap\b.*\b(bounce|reboot|restart|reset)\b",
        r"\b(bounce|reboot|restart)\b.*access.?point",
        r"access.?point.*reboot",
    ],
    destructive=True,
)

# 7. Bounce switch port
_intent(
    "bounce_port",
    "Bounce (shut/no-shut) a switch port",
    [
        r"\b(bounce|cycle|reset|restart)\b.*port",
        r"port.*\b(bounce|cycle|reset|restart)\b",
        r"\bpoe\b.*bounce",
        r"bounce.*poe",
        r"shut.*port",
    ],
    destructive=True,
)

# 8. Alert summary
_intent(
    "alert_summary",
    "Show recent alerts, optionally filtered by severity",
    [
        r"\balert[s]?\b",
        r"\balarm[s]?\b",
        r"critical.*event",
        r"recent.*event",
        r"event.*recent",
        r"what.*wrong",
        r"any.*issue[s]?",
    ],
)

# 9. Firmware status
_intent(
    "firmware_status",
    "Check firmware versions across the fleet",
    [
        r"\bfirmware\b",
        r"\bfirmware.*version\b",
        r"\bversion\b.*\bfirmware\b",
        r"\bupgrade[s]?\b.*\bdevice[s]?\b",
        r"\bdevice[s]?\b.*\bupgrade[s]?\b",
        r"\boutdated\b",
        r"\bneed.*updat\b",
    ],
)

# 10. WLAN / SSID list
_intent(
    "wlan_list",
    "List all configured WLANs / SSIDs",
    [
        r"\bwlan[s]?\b",
        r"\bssid[s]?\b.*list",
        r"list.*\bssid[s]?\b",
        r"show.*ssid",
        r"ssid.*config",
        r"wireless.*network",
        r"network.*wireless",
    ],
)

# 11. Top clients by bandwidth
_intent(
    "top_clients",
    "Show top bandwidth consumers",
    [
        r"\btop\b.*\bclient[s]?\b",
        r"\bclient[s]?\b.*\btop\b",
        r"bandwidth.*hog",
        r"most.*bandwidth",
        r"highest.*usage",
        r"who.*using.*most",
        r"top.*user[s]?",
        r"heaviest.*user[s]?",
    ],
)

# 12. Device inventory / count
_intent(
    "device_inventory",
    "Count or list devices in the fleet",
    [
        r"\bdevice[s]?\b.*(count|total|how many|list|inventory)",
        r"(count|total|how many|list|inventory).*\bdevice[s]?\b",
        r"fleet.*size",
        r"how many.*switch",
        r"switch.*count",
        r"inventory",
    ],
)

# 13. Acknowledge alert
_intent(
    "ack_alert",
    "Acknowledge a specific alert by ID",
    [
        r"\back(nowledge)?\b.*\balert\b",
        r"\balert\b.*\back(nowledge)?\b",
        r"dismiss.*alert",
        r"clear.*alert",
    ],
    destructive=True,
)

# 14. Help / capabilities
_intent(
    "help",
    "Show what the chatbot can do",
    [
        r"\bhelp\b",
        r"what can you do",
        r"what.*command",
        r"show.*command",
        r"list.*command",
        r"capability|capabilities",
        r"^\s*\?+\s*$",
    ],
)

# 15. Ping / connectivity test
_intent(
    "ping_test",
    "Run a ping from a switch to a destination",
    [
        r"\bping\b",
        r"connectivity.*test",
        r"reach.*\b(\d{1,3}\.){3}\d{1,3}\b",
        r"can.*reach",
        r"reachable",
    ],
)

# 16. Traceroute
_intent(
    "traceroute",
    "Run a traceroute from a CX switch to a destination",
    [
        r"\btraceroute\b",
        r"\btrace\s*route\b",
        r"\btr\b.*\b(\d{1,3}\.){3}\d{1,3}\b",
        r"hops? to",
        r"path to (\d{1,3}\.){3}\d{1,3}",
    ],
)

# 17. Device status (online/offline devices across fleet)
_intent(
    "device_status",
    "Show online/offline devices across the fleet, optionally filtered by type",
    [
        r"\bdevice[s]?\b.*\b(down|offline|up|online|status)\b",
        r"\b(down|offline|up|online)\b.*\bdevice[s]?\b",
        r"show.*device[s]?",
        r"show.*\b(switch|gateway|router)\b",
        r"list.*device[s]?",
        r"all.*device[s]?",
        r"device[s]?\s*$",
        r"^device[s]?\b",
        r"what.*device",
        r"which device.*\b(down|up|offline|online)\b",
        r"offline device",
        r"device.*offline",
    ],
)

# 18. Find client by MAC or IP
_intent(
    "find_client",
    "Find a connected client by MAC address or IP address",
    [
        r"find.*client",
        r"locate.*client",
        r"where is.*client",
        r"client.*ip\s+\d{1,3}\.\d{1,3}",
        r"who.*\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b",
        r"ip.*client",
        r"client.*locate",
    ],
)

# 19. Disconnect client
_intent(
    "disconnect_client",
    "Force-disconnect a wireless client by MAC address",
    [
        r"\bdisconnect\b.*\bclient\b",
        r"\bclient\b.*\bdisconnect\b",
        r"\bkick\b.*\bclient\b",
        r"\bdeauth\b",
        r"remove.*client.*wifi",
        r"force.*disconnect",
    ],
    destructive=True,
)

# 20. Client count / total clients
_intent(
    "client_count",
    "Show total client count and breakdown by type",
    [
        r"^clients?\s*$",
        r"how many client",
        r"client[s]?\s+count",
        r"total.*client",
        r"show.*client[s]?$",
        r"client.*status",
    ],
)

# 21. Site list
_intent(
    "site_list",
    "List all sites with device counts",
    [
        r"^sites?\s*$",
        r"show.*sites?",
        r"list.*sites?",
        r"all.*sites?",
        r"how many site",
        r"sites?.*list",
    ],
)

# 22. Top APs by bandwidth usage
_intent(
    "top_bandwidth",
    "Show top APs or clients by bandwidth usage",
    [
        r"top.*bandwidth",
        r"bandwidth.*top",
        r"top.*ap[s]?.*usage",
        r"top.*app[s]?",
        r"most.*traffic",
        r"highest.*traffic",
        r"busiest.*ap",
        r"ap.*usage",
    ],
)


# 23. Switch VLANs
_intent(
    "show_switch_vlans",
    "List VLANs configured on a switch",
    [
        r"\bvlan[s]?\b.*\bswitch\b",
        r"\bswitch\b.*\bvlan[s]?\b",
        r"show.*vlan",
        r"vlan.*list",
        r"what.*vlan[s]?\b",
        r"vlan.*\bon\b",
    ],
)

# 24. Switch port / interface list
_intent(
    "show_switch_interfaces",
    "Show ports/interfaces on a switch with status and speed",
    [
        r"\bport[s]?\b.*\bswitch\b",
        r"\bswitch\b.*\bport[s]?\b",
        r"\binterface[s]?\b.*\bswitch\b",
        r"switch.*interface",
        r"show.*port[s]?\b",
        r"port.*status",
        r"which.*port[s]?\b.*up",
        r"which.*port[s]?\b.*down",
    ],
)


# ---------------------------------------------------------------------------
# IntentClassifier
# ---------------------------------------------------------------------------


class IntentClassifier:
    """
    Keyword/regex based intent classifier.
    Returns the first matching intent or None if no intent matches.
    Order of _INTENTS list is priority order — more specific intents should
    be listed before catch-all ones.
    """

    @staticmethod
    def classify(text: str) -> dict | None:
        text = text.strip()
        for intent in _INTENTS:
            for pattern in intent["patterns"]:
                if pattern.search(text):
                    return intent
        return None

    @staticmethod
    def extract_site_name(text: str) -> str | None:
        """
        Heuristic extraction of a site name from free text.
        Looks for patterns like 'at Site-A', 'for Site-A', 'in HQ-Denver'.
        Returns the raw token found, or None.
        """
        m = re.search(
            r"\b(?:at|for|in|on|site)\s+([A-Za-z0-9][A-Za-z0-9_\-\.]{1,40})", text, re.IGNORECASE
        )
        return m.group(1) if m else None

    @staticmethod
    def extract_serial(text: str) -> str | None:
        """
        Extract a device serial number.  Aruba serials are typically 9–12
        uppercase alphanumeric characters.  Also matches lower-case input.
        """
        m = re.search(r"\b([A-Za-z0-9]{6,14})\b", text)
        # Avoid matching common English words as serials
        STOPWORDS = {
            "the",
            "and",
            "for",
            "are",
            "that",
            "with",
            "this",
            "have",
            "from",
            "they",
            "will",
            "been",
            "were",
            "said",
            "each",
            "which",
            "she",
            "there",
            "their",
            "what",
            "about",
            "would",
            "make",
        }
        if m and m.group(1).lower() not in STOPWORDS:
            return m.group(1).upper()
        return None

    @staticmethod
    def extract_mac(text: str) -> str | None:
        m = re.search(r"\b([0-9a-fA-F]{2}[:\-]){5}[0-9a-fA-F]{2}\b", text)
        return m.group(0).lower().replace("-", ":") if m else None

    @staticmethod
    def extract_ssid(text: str) -> str | None:
        """Extract SSID name — looks for quoted strings or 'ssid <name>'."""
        # Quoted SSID: "CorpWiFi" or 'CorpWiFi'
        m = re.search(r'[\'"]([^\'\"]{1,64})[\'"]', text)
        if m:
            return m.group(1)
        # Keyword-preceded: 'ssid CorpWiFi' / 'WLAN CorpWiFi'
        m = re.search(r"\b(?:ssid|wlan)\s+([A-Za-z0-9_\-\.]{1,64})", text, re.IGNORECASE)
        return m.group(1) if m else None

    @staticmethod
    def extract_port(text: str) -> str | None:
        """Extract a CX-style port identifier like 1/1/5 or 1/1/13."""
        m = re.search(r"\b(\d+/\d+/\d+)\b", text)
        return m.group(1) if m else None

    @staticmethod
    def extract_severity(text: str) -> str | None:
        for sev in ("critical", "major", "minor", "warning", "info"):
            if re.search(rf"\b{sev}\b", text, re.IGNORECASE):
                return sev
        return None

    @staticmethod
    def extract_alert_id(text: str) -> str | None:
        m = re.search(r"\b([A-Za-z0-9\-]{8,})\b", text)
        return m.group(1) if m else None


# ---------------------------------------------------------------------------
# Chat-specific poll-cache helpers  (reuse the app-level _poll_cache / TTL)
# ---------------------------------------------------------------------------
# Note: _poll_cache_get / _poll_cache_set imported lazily inside each function
# to avoid circular imports (routes package is imported during app.py startup).

_POLL_CACHE_TTL = 30  # mirrors app.py constant


def _chat_cache_get(key: str, max_age: int = _POLL_CACHE_TTL):
    import app as _app

    data, ts = _app._poll_cache_get(key)
    if data is not None and (time.time() - ts) < max_age:
        return data
    return None


# ---------------------------------------------------------------------------
# Individual intent handlers
# Each returns a tuple: (reply: str, data: dict|list|None, http_status: int)
# ---------------------------------------------------------------------------


def _handle_help(_text, _session_id):
    reply = (
        "Here's what I can do:\n\n"
        "📊 **Monitoring:** show devices, show APs down, site health, show alerts, device inventory\n"
        "👥 **Clients:** show clients, find client <ip>, clients on SSID <name>, client count\n"
        "🔧 **Actions:** ping from switch <serial>, bounce AP <serial>, bounce port <switch> <port>\n"
        "❓ **Info:** firmware status, WLAN list, top bandwidth, show sites, audit logs\n"
        "🔍 **Device Detail:** events for device <serial>, VLANs on switch <serial>, radios on AP <serial>\n"
        "💬 **General:** ask me anything — networking concepts, config tips, troubleshooting advice\n\n"
        "Tip: be specific — e.g. *'APs down at Site-A'* or *'events for switch CN12345678'*."
    )
    return reply, None, 200


def _handle_ap_status(text, _session_id):
    """Count up/down APs, optionally filtered to a site name."""
    import app as _app

    aruba_client = _app.aruba_client

    site_name = IntentClassifier.extract_site_name(text)

    # Try cache first (shares key with grafana KPI endpoint)
    cached = _chat_cache_get("kpis", max_age=30)
    if cached and not site_name:
        total = cached.get("total_aps", 0)
        up = cached.get("aps_up", 0)
        down = cached.get("aps_down", 0)
        reply = f"Fleet-wide: **{total}** APs total — " f"**{up}** up, **{down}** down."
        return reply, {"total": total, "up": up, "down": down, "source": "cache"}, 200

    want_down = any(w in text.lower() for w in ["down", "offline", "fail", "unreachable"])

    try:
        # Try MCPClient first (proven endpoints), fall back to direct API
        mcp = _get_mcp_client()
        if mcp:
            all_devices = mcp.get_devices(limit=200)
            items = [d for d in all_devices if "ap" in d.get("deviceType", "").lower()]
        else:
            try:
                r = cached_get("/network-monitoring/v1/aps", params={"limit": 100})
                items = r.get("aps", r.get("items", []))
            except Exception:
                r = cached_get("/network-monitoring/v1alpha1/aps", params={"limit": 100})
                items = r.get("items", [])

        if site_name:
            items = [
                a
                for a in items
                if site_name.lower() in (a.get("siteName", "") or a.get("site", "")).lower()
            ]

        total = len(items)
        up_statuses = {"UP", "ONLINE", "CONNECTED"}
        up = sum(1 for a in items if str(a.get("status", "")).upper().strip() in up_statuses)
        down = total - up

        # Build DataTable-ready rows filtered by what the user asked
        if want_down:
            display_items = [
                a for a in items if str(a.get("status", "")).upper().strip() not in up_statuses
            ]
        else:
            display_items = items

        table = [
            {
                "Name": _cell(_device_display_name(a)),
                "Serial": _cell(_device_serial(a)),
                "Status": _cell(_first_present_str(a, "status")),
                "Site": _cell(_first_present_str(a, "siteName", "site")),
                "IP": _cell(_first_present_str(a, "ip_address", "ipv4", "ip")),
                "Model": _cell(_first_present_str(a, "model", "platformModel")),
            }
            for a in display_items[:25]
        ]

        site_clause = f" at **{site_name}**" if site_name else ""
        if want_down:
            reply = (
                f"**{down}** AP(s){site_clause} are currently down out of **{total}** total."
                if down
                else f"All **{total}** APs{site_clause} are online!"
            )
        else:
            reply = f"APs{site_clause}: **{total}** total, **{up}** up, **{down}** down."
            if down > 0:
                down_aps = [
                    a for a in items if str(a.get("status", "")).upper().strip() not in up_statuses
                ]
                names = ", ".join(
                    f"{_cell(_device_display_name(a))} ({_cell(_device_serial(a))})"
                    for a in down_aps[:5]
                )
                reply += f"\nDown: {names}"
                if down > 5:
                    reply += f" … and {down - 5} more."

        # Warm the KPI cache
        import app as _app

        _app._poll_cache_set(
            "kpis",
            {
                **(_app._poll_cache_get("kpis")[0] or {}),
                "total_aps": total,
                "aps_up": up,
                "aps_down": down,
            },
        )
        return reply, table if table else {"total": total, "up": up, "down": down}, 200

    except Exception as e:
        logger.error(f"Chat ap_status error: {e}")
        return f"Could not retrieve AP status: {e}", None, 500


def _handle_site_health(text, _session_id):
    """Return per-site health scores."""
    import app as _app

    aruba_client = _app.aruba_client

    def _safe_int(v, default=0):
        try:
            return int(v)
        except (TypeError, ValueError):
            return default

    site_name = IntentClassifier.extract_site_name(text)

    cached = _chat_cache_get("sites-health", max_age=30)
    if cached and not site_name:
        sites = cached if isinstance(cached, list) else cached.get("items", [])
        if sites:
            worst = sorted(sites, key=lambda s: s.get("health", s.get("healthScore", 100)))[:5]
            lines = ["**Site health** (worst first):"]
            for s in worst:
                raw_score = s.get("health", s.get("healthScore", s.get("score")))
                score = raw_score if raw_score is not None and str(raw_score).strip() != "" else _CHAT_MISSING
                name = _cell(_site_display_name(s))
                lines.append(f"- {name}: {score}")
            return "\n".join(lines), sites, 200

    try:
        r = cached_get("/network-monitoring/v1/sites-health")
        sites = r.get("items", r.get("sites", []))

        if site_name:
            sites = [
                s
                for s in sites
                if site_name.lower() in (s.get("siteName", s.get("name", ""))).lower()
            ]

        if not sites:
            clause = f" matching '{site_name}'" if site_name else ""
            return f"No sites found{clause}.", [], 200

        normalized = [
            {
                "name": _cell(_site_display_name(s)),
                "health": _safe_int(s.get("health", s.get("healthScore", s.get("score", 0)))),
                "devices": _safe_int(s.get("deviceCount", s.get("total_device_count", 0))),
                "clients": _safe_int(s.get("clientCount", s.get("total_client_count", 0))),
            }
            for s in sites
        ]
        normalized.sort(key=lambda s: s["health"])

        lines = ["**Site health**:"]
        for s in normalized[:15]:
            emoji = "🔴" if s["health"] < 60 else "🟡" if s["health"] < 80 else "🟢"
            lines.append(
                f"- {emoji} {s['name']}: score {s['health']}, "
                f"{s['devices']} devices, {s['clients']} clients"
            )
        if len(normalized) > 15:
            lines.append(f"  … and {len(normalized) - 15} more sites.")

        # Warm the sites-health cache for subsequent requests
        import app as _app

        _app._poll_cache_set("sites-health", normalized)
        return "\n".join(lines), normalized, 200

    except Exception as e:
        logger.error(f"Chat site_health error: {e}")
        return f"Could not retrieve site health: {e}", None, 500


# ---------------------------------------------------------------------------
# ENHANCED HANDLERS — replacing below through _HANDLERS
# ---------------------------------------------------------------------------


def _handle_clients_by_ssid(text, _session_id):
    """List clients on a given SSID.  Requires site-id or iterates all sites."""
    ssid = IntentClassifier.extract_ssid(text)
    if not ssid:
        return (
            "Which SSID would you like to check? " "Try: *'clients on SSID CorpWiFi'*",
            None,
            200,
        )

    try:
        mcp = _get_mcp_client()
        if mcp:
            matched = mcp.get_clients(ssid=ssid, limit=100)
        else:
            import app as _app
            aruba_client = _app.aruba_client
            try:
                r = aruba_client.get("/monitoring/v1/clients")
            except Exception:
                r = aruba_client.get("/network-monitoring/v1/clients")
            all_items = r.get("items", r.get("clients", []))
            matched = [
                c
                for c in all_items
                if ssid.lower() in (c.get("ssid", c.get("essid", "")) or "").lower()
            ]

        total = len(matched)
        sample = [
            {
                "mac": _cell(_first_present_str(c, "macaddr", "mac", "macAddress")),
                "hostname": _cell(_client_display_name(c)),
                "ip": _cell(_first_present_str(c, "ip_address", "ipAddress", "ipv4", "ip")),
                "signal": _cell(_first_present_str(c, "signal_db", "rssi", "signal")),
            }
            for c in matched[:10]
        ]

        reply = f"**{total}** client(s) connected to SSID **{ssid}**."
        if sample:
            rows = "\n".join(f"  - {s['hostname']} ({s['mac']}) IP: {s['ip']}" for s in sample)
            reply += f"\n{rows}"
        if total > 10:
            reply += f"\n  … and {total - 10} more."

        return reply, {"ssid": ssid, "count": total, "sample": sample}, 200

    except Exception as e:
        logger.error(f"Chat clients_by_ssid error: {e}")
        return f"Could not retrieve clients for SSID {ssid}: {e}", None, 500


def _handle_client_by_mac(text, _session_id):
    """Look up a single client by MAC address."""
    import app as _app

    aruba_client = _app.aruba_client

    mac = IntentClassifier.extract_mac(text)
    if not mac:
        return ("Please provide a MAC address, e.g. *'find client aa:bb:cc:dd:ee:ff'*", None, 200)

    try:
        r = aruba_client.get(f"/network-monitoring/v1/clients/{mac}")
        name = _first_present_str(r, "name", "hostname", "client_name", "clientName") or mac
        ip = _cell(_first_present_str(r, "ip_address", "ipAddress", "ipv4", "ip"))
        ssid = _cell(_first_present_str(r, "ssid", "essid", "wlanName", "network"))
        site = _cell(_first_present_str(r, "site", "siteName", "scopeName"))
        ap = _cell(
            _first_present_str(
                r,
                "associated_device",
                "associated_device_name",
                "apSerial",
                "ap_serial",
            )
        )

        reply = (
            f"Client **{name}** ({mac}):\n"
            f"- IP: {ip}\n"
            f"- SSID: {ssid}\n"
            f"- Site: {site}\n"
            f"- Associated AP: {ap}"
        )
        return reply, r, 200

    except Exception as e:
        err = str(e)
        if "404" in err or "Not Found" in err:
            return f"No active client found with MAC **{mac}**.", None, 200
        logger.error(f"Chat client_by_mac error: {e}")
        return f"Error looking up client {mac}: {e}", None, 500


def _handle_switch_port_errors(text, _session_id):
    """Identify switches with elevated port error counters."""
    import app as _app

    aruba_client = _app.aruba_client

    try:
        r = cached_get("/network-monitoring/v1/devices")
        switches = [d for d in r.get("items", []) if d.get("deviceType", "").upper() == "SWITCH"]

        if not switches:
            return "No switches found in inventory.", [], 200

        # Fetch interface error stats for each switch — limit to first 10 to
        # avoid burning daily quota; the worst offender usually surfaces fast.
        # Parallelize to reduce latency.
        from concurrent.futures import ThreadPoolExecutor, as_completed

        def _fetch_switch_errors(sw):
            serial = sw.get("serial", sw.get("serialNumber", ""))
            name = _device_display_name(sw) or serial
            if not serial:
                return None
            try:
                iface_r = aruba_client.get(f"/network-monitoring/v1/switches/{serial}/interfaces")
                ifaces = iface_r.get("items", iface_r if isinstance(iface_r, list) else [])
                total_errors = sum(
                    (i.get("inputErrors", 0) or 0) + (i.get("outputErrors", 0) or 0) for i in ifaces
                )
                return {
                    "serial": serial,
                    "name": name,
                    "site": _cell(_first_present_str(sw, "siteName", "site")),
                    "total_errors": total_errors,
                    "iface_count": len(ifaces),
                }
            except Exception:
                return None

        results = []
        with ThreadPoolExecutor(max_workers=5) as pool:
            futures = {pool.submit(_fetch_switch_errors, sw): sw for sw in switches[:10]}
            for future in as_completed(futures):
                result = future.result()
                if result is not None:
                    results.append(result)

        if not results:
            return (
                "Could not retrieve interface stats for any switch. "
                "Check that the monitoring API is available.",
                [],
                200,
            )

        results.sort(key=lambda x: x["total_errors"], reverse=True)
        top = results[0]

        lines = [
            f"**Top switch by port errors**: **{top['name']}** ({top['serial']}) "
            f"at {top['site']} — **{top['total_errors']}** total interface errors "
            f"across {top['iface_count']} ports.\n",
            "**All sampled switches** (up to 10):",
        ]
        for r_ in results:
            lines.append(f"- {r_['name']} ({r_['serial']}): {r_['total_errors']} errors")

        return "\n".join(lines), results, 200

    except Exception as e:
        logger.error(f"Chat switch_port_errors error: {e}")
        return f"Could not retrieve switch error data: {e}", None, 500


def _handle_bounce_ap(text, session_id):
    """Reboot an AP by serial number."""
    import app as _app

    aruba_client = _app.aruba_client

    if not _chat_action_allowed(session_id):
        return (
            "Slow down — you've reached the limit of "
            f"{_CHAT_ACTION_LIMIT} destructive actions per minute. "
            "Please wait before trying again.",
            None,
            429,
        )

    serial = IntentClassifier.extract_serial(text)
    if not serial:
        return ("Please specify the AP serial number, " "e.g. *'reboot AP CNXXXXXX'*", None, 200)

    try:
        # Aruba Central AP reboot endpoint
        r = aruba_client.post(f"/device-management/v1/device/{serial}/action/reboot", data={})
        reply = (
            f"Reboot command sent to AP **{serial}**. "
            "The AP will be unreachable for 60-90 seconds while it restarts."
        )
        return reply, {"serial": serial, "result": r}, 200

    except Exception as e:
        err = str(e)
        # Try alternative endpoint used by some firmware versions
        try:
            r2 = aruba_client.post(f"/configuration/v1/devices/{serial}/action/reboot", data={})
            reply = f"Reboot command sent to AP **{serial}** (via alt endpoint)."
            return reply, {"serial": serial, "result": r2}, 200
        except Exception as e2:
            logger.error(f"Chat bounce_ap error: primary={e} fallback={e2}")
            return (
                f"Failed to reboot AP **{serial}**: {err}\n"
                "Verify the serial number and that you have write permissions.",
                None,
                500,
            )


def _handle_bounce_port(text, session_id):
    """Bounce a switch port (CX portBounce API)."""
    import app as _app

    aruba_client = _app.aruba_client

    if not _chat_action_allowed(session_id):
        return (
            "Rate limit: too many destructive actions. "
            f"Maximum {_CHAT_ACTION_LIMIT} per {_CHAT_ACTION_WINDOW}s.",
            None,
            429,
        )

    serial = IntentClassifier.extract_serial(text)
    port = IntentClassifier.extract_port(text)

    if not serial:
        return (
            "Please specify the switch serial and port, "
            "e.g. *'bounce port 1/1/5 on switch SWXXXXXX'*",
            None,
            200,
        )
    if not port:
        return (
            f"Which port on switch **{serial}**? " "e.g. *'bounce port 1/1/5 on switch {serial}'*",
            None,
            200,
        )

    try:
        resp = aruba_client.post(
            f"/network-troubleshooting/v1alpha1/cx/{serial}/portBounce", data={"ports": [port]}
        )
        location = resp.get("location", "")
        task_match = re.search(r"/async-operations/([a-f0-9\-]+)", location)
        task_id = task_match.group(1) if task_match else None

        reply = f"Port bounce initiated on **{serial}** port **{port}**."
        if task_id:
            reply += f" Task ID: `{task_id}`. Port will cycle in ~5 seconds."

        return reply, {"serial": serial, "port": port, "task_id": task_id}, 200

    except Exception as e:
        logger.error(f"Chat bounce_port error: {e}")
        return f"Failed to bounce port {port} on {serial}: {e}", None, 500


def _handle_alert_summary(text, _session_id):
    """Return recent alerts, optionally filtered by severity."""
    severity = IntentClassifier.extract_severity(text)
    try:
        # MCPClient uses the correct network-notifications namespace
        mcp = _get_mcp_client()
        if mcp:
            alerts = mcp.get_alerts(severity=severity, limit=20)
        else:
            import app as _app
            aruba_client = _app.aruba_client
            params = {"limit": 20}
            if severity:
                params["severity"] = severity
            alerts = []
            for ep in [
                "/network-notifications/v1/alerts",
                "/network-notifications/v1alpha1/alerts",
                "/network-monitoring/v1/alerts",
            ]:
                try:
                    r = aruba_client.get(ep, params=params)
                    alerts = r.get("alerts", r.get("items", []))
                    if alerts or r.get("count", 0) == 0:
                        break
                except Exception:
                    continue

        if not alerts:
            sev_clause = f" with severity '{severity}'" if severity else ""
            return f"No alerts found{sev_clause}.", [], 200

        lines = [f"**Recent alerts** ({len(alerts)} shown):"]
        for a in alerts[:10]:
            sev_raw = a.get("severity")
            sev = str(sev_raw).upper() if sev_raw is not None and str(sev_raw).strip() else _CHAT_MISSING
            desc = _cell(_first_present_str(a, "description", "alert_type", "message", "title"))
            atime = a.get("created_at", a.get("ts", ""))
            aid = a.get("id", a.get("alert_id", ""))
            lines.append(f"- [{sev}] {desc} (id: {aid})")

        if len(alerts) > 10:
            lines.append(f"  … and {len(alerts) - 10} more.")

        return "\n".join(lines), alerts, 200

    except Exception as e:
        logger.error(f"Chat alert_summary error: {e}")
        return f"Could not retrieve alerts: {e}", None, 500


def _handle_firmware_status(text, _session_id):
    """Summarise firmware versions across the fleet."""
    import app as _app

    aruba_client = _app.aruba_client

    try:
        r = cached_get("/network-monitoring/v1/devices")
        items = r.get("items", [])

        version_map: dict = {}
        outdated_examples = []
        for d in items:
            fw = d.get("firmwareVersion", d.get("firmware_version", "unknown"))
            version_map[fw] = version_map.get(fw, 0) + 1

        lines = [f"**Firmware summary** across {len(items)} devices:"]
        for fw, count in sorted(version_map.items(), key=lambda x: -x[1]):
            lines.append(f"- {fw}: {count} device(s)")

        return "\n".join(lines), version_map, 200

    except Exception as e:
        logger.error(f"Chat firmware_status error: {e}")
        return f"Could not retrieve firmware data: {e}", None, 500


def _handle_wlan_list(text, _session_id):
    """List configured WLANs."""
    import app as _app

    aruba_client = _app.aruba_client

    try:
        r = aruba_client.get("/network-config/v1alpha1/wlan-ssids")
        wlans = r.get("wlan-ssid", r.get("items", []))

        if not wlans:
            return "No WLANs found in the configuration.", [], 200

        lines = [f"**{len(wlans)} WLAN(s)** configured:"]
        for w in wlans[:20]:
            ssid = _cell(_wlan_ssid(w))
            enabled = w.get("enable", True)
            band = _cell(_first_present_str(w, "rf-band", "rf_band", "band"))
            status_str = "enabled" if enabled else "disabled"
            lines.append(f"- **{ssid}** ({band}, {status_str})")
        if len(wlans) > 20:
            lines.append(f"  … and {len(wlans) - 20} more.")

        return "\n".join(lines), wlans[:20], 200

    except Exception as e:
        logger.error(f"Chat wlan_list error: {e}")
        return f"Could not retrieve WLAN list: {e}", None, 500


def _handle_top_clients(text, _session_id):
    """Show top N bandwidth-consuming clients."""
    import app as _app

    aruba_client = _app.aruba_client

    try:
        r = aruba_client.get("/network-monitoring/v1/clients/usage/topn")
        clients = r.get("items", r.get("clients", []))

        if not clients:
            return "No client usage data available.", [], 200

        lines = [f"**Top {min(len(clients), 10)} clients by bandwidth**:"]
        for c in clients[:10]:
            name = _cell(_client_display_name(c))
            usage = c.get("usage", c.get("total_bytes", 0))
            ssid = _cell(_first_present_str(c, "ssid", "essid", "wlanName", "network"))
            usage_mb = round(usage / 1_000_000, 2) if isinstance(usage, (int, float)) else usage
            lines.append(f"- **{name}** on {ssid}: {usage_mb} MB")

        return "\n".join(lines), clients[:10], 200

    except Exception as e:
        logger.error(f"Chat top_clients error: {e}")
        return f"Could not retrieve top client data: {e}", None, 500


def _handle_device_inventory(text, _session_id):
    """Device inventory summary."""
    import app as _app

    aruba_client = _app.aruba_client

    cached = _chat_cache_get("kpis", max_age=60)
    if cached:
        total = cached.get("total_devices", 0)
        by_type = {d["type"]: d["count"] for d in cached.get("devices_by_type", [])}
        lines = [f"**Fleet inventory**: **{total}** total devices"]
        for dt, cnt in sorted(by_type.items()):
            lines.append(f"- {dt}: {cnt}")
        return "\n".join(lines), cached, 200

    try:
        r = cached_get("/network-monitoring/v1/devices")
        items = r.get("items", [])
        total = r.get("count", len(items))
        by_type: dict = {}
        for d in items:
            dt = d.get("deviceType", d.get("type", "Unknown"))
            by_type[dt] = by_type.get(dt, 0) + 1

        lines = [f"**Fleet inventory**: **{total}** total devices"]
        for dt, cnt in sorted(by_type.items()):
            lines.append(f"- {dt}: {cnt}")

        return "\n".join(lines), {"total": total, "by_type": by_type}, 200

    except Exception as e:
        logger.error(f"Chat device_inventory error: {e}")
        return f"Could not retrieve device inventory: {e}", None, 500


def _handle_ack_alert(text, session_id):
    """Acknowledge an alert by ID."""
    import app as _app

    aruba_client = _app.aruba_client

    if not _chat_action_allowed(session_id):
        return (f"Rate limit: max {_CHAT_ACTION_LIMIT} actions per minute.", None, 429)

    alert_id = IntentClassifier.extract_alert_id(text)
    if not alert_id:
        return ("Please provide the alert ID, " "e.g. *'acknowledge alert 12345abc'*", None, 200)

    try:
        aruba_client.post(f"/network-monitoring/v1/alerts/{alert_id}/acknowledge")
        return (
            f"Alert **{alert_id}** acknowledged.",
            {"alert_id": alert_id, "acknowledged": True},
            200,
        )
    except Exception as e:
        logger.error(f"Chat ack_alert error: {e}")
        return f"Could not acknowledge alert {alert_id}: {e}", None, 500


def _handle_ping_test(text, _session_id):
    """Run a ping test from a switch to a destination."""
    import app as _app

    aruba_client = _app.aruba_client

    serial = IntentClassifier.extract_serial(text)
    # Extract IP / hostname (simple heuristic)
    dest_m = re.search(
        r"\b((?:\d{1,3}\.){3}\d{1,3}|(?:[a-z0-9\-]+\.)+[a-z]{2,})\b", text, re.IGNORECASE
    )
    dest = dest_m.group(1) if dest_m else None

    if not serial:
        return (
            "Specify the switch serial and destination, "
            "e.g. *'ping 8.8.8.8 from switch SWXXXXXX'*",
            None,
            200,
        )
    if not dest:
        return (f"What IP/hostname should I ping from switch **{serial}**?", None, 200)

    try:
        resp = aruba_client.post(
            f"/network-troubleshooting/v1alpha1/cx/{serial}/ping", data={"destination": dest}
        )
        location = resp.get("location", "")
        task_match = re.search(r"/async-operations/([a-f0-9\-]+)", location)
        if not task_match:
            return (
                f"Ping initiated to **{dest}** from **{serial}** but could not "
                "track the task ID. Check the troubleshooting panel for results.",
                resp,
                200,
            )

        task_id = task_match.group(1)
        # Poll up to 15 seconds inline (chat users expect a quick answer)
        for _ in range(15):
            time.sleep(1)
            poll = aruba_client.get(
                f"/network-troubleshooting/v1alpha1/cx/{serial}/ping/async-operations/{task_id}"
            )
            status = poll.get("status", "")
            if status == "COMPLETED":
                output = poll.get("output", "")
                return (
                    f"Ping from **{serial}** to **{dest}** completed:\n```\n{output}\n```",
                    poll,
                    200,
                )
            elif status == "FAILED":
                return (
                    f"Ping from **{serial}** to **{dest}** failed: "
                    f"{poll.get('failReason', 'unknown reason')}",
                    poll,
                    200,
                )

        return (
            f"Ping from **{serial}** to **{dest}** still in progress "
            f"(task `{task_id}`). Check the troubleshooting panel.",
            {"task_id": task_id},
            200,
        )

    except Exception as e:
        logger.error(f"Chat ping_test error: {e}")
        return f"Could not run ping: {e}", None, 500


def _handle_device_status(text, _session_id):
    """Show all online/offline devices, optionally filtered by type or status."""
    want_down = any(w in text.lower() for w in ["down", "offline", "fail", "unreachable"])
    want_type = None
    for t in ["switch", "gateway", "ap", "access point"]:
        if t in text.lower():
            want_type = t
            break

    try:
        mcp = _get_mcp_client()
        if mcp:
            items = mcp.get_devices(limit=200)
        else:
            import app as _app
            aruba_client = _app.aruba_client
            r = aruba_client.get("/network-monitoring/v1alpha1/device-inventory", params={"limit": 200})
            items = r.get("devices", r.get("items", []))
            if not items:
                r = cached_get("/network-monitoring/v1/devices", params={"limit": 200})
                items = r.get("devices", r.get("items", []))

        if want_type:
            items = [
                d
                for d in items
                if want_type.replace(" ", "").lower()
                in (d.get("deviceType", d.get("device_type", ""))).lower()
            ]
        if want_down:
            items = [
                d
                for d in items
                if str(d.get("status", "")).upper() not in {"UP", "ONLINE", "CONNECTED"}
            ]

        total = len(items)
        table = [
            {
                "Name": _cell(_device_display_name(d)),
                "Type": _cell(_first_present_str(d, "deviceType", "device_type")),
                "Status": _cell(_first_present_str(d, "status")),
                "IP": _cell(_first_present_str(d, "ipv4", "ip_address", "ip")),
                "Serial": _cell(_device_serial(d)),
                "Site": _cell(_first_present_str(d, "siteName", "site")),
            }
            for d in items[:25]
        ]

        filter_desc = []
        if want_type:
            filter_desc.append(want_type)
        if want_down:
            filter_desc.append("offline")
        desc = " ".join(filter_desc) or "all"
        reply = (
            f"**{total}** {desc} device(s) found."
            if total
            else f"No {desc} devices found — everything looks good!"
        )
        return reply, table if table else None, 200
    except Exception as e:
        logger.error(f"Chat device_status error: {e}")
        return f"Could not retrieve device status: {e}", None, 500


def _handle_find_client(text, _session_id):
    """Find a client by IP or MAC address."""
    mac = IntentClassifier.extract_mac(text)
    # Try to extract IP
    ip_m = re.search(r"\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b", text)
    ip = ip_m.group(1) if ip_m else None

    if not mac and not ip:
        return ("Please provide a MAC or IP address, e.g. *'find client 192.168.1.50'*", None, 200)

    query = mac or ip
    try:
        mcp = _get_mcp_client()
        if mcp:
            c = mcp.find_client(query)
            if not c:
                return (f"No client found with {'MAC' if mac else 'IP'} **{query}**.", [], 200)
        else:
            import app as _app
            aruba_client = _app.aruba_client
            r = aruba_client.get("/network-monitoring/v1/clients", params={"limit": 100})
            clients = r.get("clients", r.get("items", []))
            found = []
            for client in clients:
                c_mac = (client.get("macaddr", client.get("mac", "")) or "").lower().replace("-", ":")
                c_ip = client.get("ip_address", client.get("ipv4", "")) or ""
                if (mac and mac in c_mac) or (ip and ip == c_ip):
                    found.append(client)
            if not found:
                return (f"No client found with {'MAC' if mac else 'IP'} **{query}**.", [], 200)
            c = found[0]

        logger.debug(f"find_client raw fields: {list(c.keys())}")
        details = {
            "MAC": _cell(_first_present_str(c, "macaddr", "mac", "macAddress")),
            "Hostname": _cell(_client_display_name(c)),
            "IP": _cell(_first_present_str(c, "ip_address", "ipv4", "ip")),
            "Status": _cell(_first_present_str(c, "status", "connection_status")),
            "Type": _cell(_first_present_str(c, "clientConnectionType", "client_type", "type")),
            "SSID": _cell(_first_present_str(c, "ssid", "wlanName", "network", "essid")),
            "AP": _cell(
                _first_present_str(
                    c,
                    "associated_device",
                    "associated_device_name",
                    "ap_serial",
                    "apSerial",
                )
            ),
        }
        reply = f"Client found: **{details['Hostname']}** ({details['MAC']}) — {details['Status']}"
        return reply, [details], 200
    except Exception as e:
        logger.error(f"Chat find_client error: {e}")
        return f"Could not search for client: {e}", None, 500


def _handle_disconnect_client(text, session_id):
    """Force-disconnect a client by MAC address."""
    import app as _app

    aruba_client = _app.aruba_client

    if not _chat_action_allowed(session_id):
        return (f"Rate limit: max {_CHAT_ACTION_LIMIT} actions per minute.", None, 429)

    mac = IntentClassifier.extract_mac(text)
    if not mac:
        return (
            "Please provide the client MAC address, e.g. *'disconnect client aa:bb:cc:dd:ee:ff'*",
            None,
            200,
        )

    try:
        # Aruba Central disconnect client endpoint
        aruba_client.post(f"/network-monitoring/v1/clients/{mac}/disconnect")
        return (
            f"Disconnect request sent for client **{mac}**.",
            {"mac": mac, "action": "disconnect"},
            200,
        )
    except Exception as e:
        logger.error(f"Chat disconnect_client error: {e}")
        return f"Could not disconnect client {mac}: {e}", None, 500


def _handle_traceroute(text, _session_id):
    """Run traceroute from a switch."""
    import app as _app

    aruba_client = _app.aruba_client

    serial = IntentClassifier.extract_serial(text)
    dest_m = re.search(
        r"\b((?:\d{1,3}\.){3}\d{1,3}|(?:[a-z0-9\-]+\.)+[a-z]{2,})\b", text, re.IGNORECASE
    )
    dest = dest_m.group(1) if dest_m else None

    if not serial:
        return (
            "Specify the switch serial, e.g. *'traceroute to 8.8.8.8 from switch SWXXXXXX'*",
            None,
            200,
        )
    if not dest:
        return (f"What destination should I trace from switch **{serial}**?", None, 200)

    try:
        resp = aruba_client._request(
            "POST",
            f"/network-troubleshooting/v1alpha1/cx/{serial}/traceroute",
            json={"destination": dest},
        )
        if resp.status_code == 202:
            data = resp.json()
            task_id = (data.get("location", "") or "").split("/")[-1]
            return (
                f"Traceroute from **{serial}** to **{dest}** started (task `{task_id}`). "
                "Check the Troubleshoot page for results.",
                {"serial": serial, "dest": dest, "task_id": task_id},
                200,
            )
        return (f"Traceroute request returned HTTP {resp.status_code}.", None, 200)
    except Exception as e:
        logger.error(f"Chat traceroute error: {e}")
        return f"Could not run traceroute: {e}", None, 500


def _handle_client_count(_text, _session_id):
    """Show total client count and breakdown by type."""
    try:
        mcp = _get_mcp_client()
        if mcp:
            clients = mcp.get_clients(limit=100)
        else:
            import app as _app
            aruba_client = _app.aruba_client
            r = aruba_client.get("/network-monitoring/v1/clients", params={"limit": 100})
            clients = r.get("clients", r.get("items", []))

        total = len(clients)
        if not clients:
            return "No clients currently connected.", {"total": 0}, 200

        # Count by connection type (wireless/wired)
        by_type: dict = {}
        by_status: dict = {}
        for c in clients:
            ctype = c.get("clientConnectionType", c.get("network_type", c.get("type", "Unknown")))
            cstatus = c.get("status", "Unknown")
            by_type[ctype] = by_type.get(ctype, 0) + 1
            by_status[cstatus] = by_status.get(cstatus, 0) + 1

        lines = [f"**{total}** client(s) currently connected:\n"]
        lines.append("**By type:**")
        for t, cnt in sorted(by_type.items(), key=lambda x: -x[1]):
            lines.append(f"- {t}: {cnt}")
        lines.append("\n**By status:**")
        for s, cnt in sorted(by_status.items(), key=lambda x: -x[1]):
            lines.append(f"- {s}: {cnt}")

        table = [
            {"Type": t, "Count": cnt} for t, cnt in sorted(by_type.items(), key=lambda x: -x[1])
        ]
        return "\n".join(lines), table, 200

    except Exception as e:
        logger.error(f"Chat client_count error: {e}")
        return f"Could not retrieve client count: {e}", None, 500


def _handle_site_list(_text, _session_id):
    """List all sites with device counts."""
    try:
        mcp = _get_mcp_client()
        if mcp:
            sites = mcp.get_sites(limit=200)
        else:
            import app as _app
            aruba_client = _app.aruba_client
            r = aruba_client.get("/network-config/v1/sites")
            sites = r.get("sites", r.get("items", []))

        if not sites:
            return "No sites found.", [], 200

        total = len(sites)
        table = [
            {
                "Name": _cell(_site_display_name(s)),
                "Devices": s.get("associated_device_count", s.get("deviceCount", 0)),
                "ID": _cell(_first_present_str(s, "site_id", "id", "scopeId")),
            }
            for s in sites[:30]
        ]
        table.sort(key=lambda x: x["Name"])

        lines = [f"**{total} site(s)** in your network:"]
        for row in table:
            lines.append(f"- {row['Name']} ({row['Devices']} device(s))")
        if total > 30:
            lines.append(f"  … and {total - 30} more.")

        return "\n".join(lines), table, 200

    except Exception as e:
        logger.error(f"Chat site_list error: {e}")
        return f"Could not retrieve site list: {e}", None, 500


def _handle_top_bandwidth(_text, _session_id):
    """Show top APs by bandwidth usage."""
    import app as _app

    aruba_client = _app.aruba_client

    try:
        r = aruba_client.get("/network-monitoring/v1/top-aps-by-usage", params={"limit": 5})
        aps = r.get("items", r.get("aps", r.get("data", [])))

        if not aps:
            # Fallback: try top clients by usage
            r2 = aruba_client.get("/network-monitoring/v1/clients/usage/topn", params={"limit": 5})
            clients = r2.get("items", r2.get("clients", []))
            if clients:
                table = [
                    {
                        "Client": _cell(_client_display_name(c)),
                        "SSID": _cell(_first_present_str(c, "ssid", "essid", "wlanName")),
                        "Usage MB": round(c.get("usage", c.get("total_bytes", 0)) / 1_000_000, 2),
                    }
                    for c in clients[:5]
                ]
                lines = ["**Top 5 clients by bandwidth:**"]
                for row in table:
                    lines.append(f"- {row['Client']} on {row['SSID']}: {row['Usage MB']} MB")
                return "\n".join(lines), table, 200
            return "No bandwidth usage data available.", [], 200

        table = [
            {
                "AP": _cell(_device_display_name(a)),
                "Site": _cell(_first_present_str(a, "siteName", "site")),
                "Tx MB": round(a.get("tx_bytes", a.get("txBytes", 0)) / 1_000_000, 2),
                "Rx MB": round(a.get("rx_bytes", a.get("rxBytes", 0)) / 1_000_000, 2),
            }
            for a in aps[:5]
        ]
        lines = ["**Top 5 APs by bandwidth usage:**"]
        for row in table:
            lines.append(
                f"- {row['AP']} ({row['Site']}): Tx {row['Tx MB']} MB / Rx {row['Rx MB']} MB"
            )

        return "\n".join(lines), table, 200

    except Exception as e:
        logger.error(f"Chat top_bandwidth error: {e}")
        return f"Could not retrieve bandwidth data: {e}", None, 500


def _handle_device_events(text, _session_id):
    """Show recent events for a specific device (by serial number)."""
    serial = (
        IntentClassifier.extract_serial(text)
        if hasattr(IntentClassifier, "extract_serial")
        else None
    )
    # Fall back to regex extraction
    if not serial:
        m = re.search(r"\b([A-Z0-9]{8,14})\b", text.upper())
        serial = m.group(1) if m else None
    if not serial:
        return (
            "Please provide a device serial number. Example: *'events for device ABC123456'*",
            None,
            200,
        )
    try:
        mcp = _get_mcp_client()
        if mcp:
            events = mcp.get_events(serial, hours=24)
        else:
            import app as _app
            aruba_client = _app.aruba_client
            data = aruba_client.get(
                "/network-monitoring/v1/events",
                params={"serial": serial, "limit": 20},
            )
            events = data.get("events", data.get("items", []))
        if not events:
            return f"No events found for device **{serial}**.", [], 200
        table = [
            {
                "Time": e.get("createdAt", e.get("timestamp", ""))[:19].replace("T", " "),
                "Type": e.get("eventType", e.get("type", "")),
                "Severity": e.get("severity", ""),
                "Description": e.get("description", e.get("details", ""))[:80],
            }
            for e in events[:15]
        ]
        return f"**Last {len(table)} events for {serial}:**", table, 200
    except Exception as e:
        logger.error(f"Chat device_events error: {e}")
        return f"Could not retrieve events for {serial}: {e}", None, 500


def _handle_switch_vlans(text, _session_id):
    """Show VLANs configured on a switch."""
    import app as _app

    aruba_client = _app.aruba_client

    serial = None
    m = re.search(r"\b([A-Z0-9]{8,14})\b", text.upper())
    serial = m.group(1) if m else None
    if not serial:
        return (
            "Please provide a switch serial number. Example: *'VLANs on switch ABC123'*",
            None,
            200,
        )
    try:
        data = aruba_client.get(
            f"/network-monitoring/v1/cx_switches/{serial}/vlan",
        )
        vlans = data.get("vlans", data.get("items", [data] if data and "vlanId" in data else []))
        if not vlans:
            return f"No VLAN data found for **{serial}**.", [], 200
        table = [
            {
                "VLAN ID": v.get("vlanId", v.get("id", "")),
                "Name": v.get("name", ""),
                "Status": v.get("status", ""),
                "Ports": v.get("portCount", ""),
            }
            for v in vlans[:30]
        ]
        return f"**VLANs on {serial}:**", table, 200
    except Exception as e:
        logger.error(f"Chat switch_vlans error: {e}")
        return f"Could not retrieve VLANs for {serial}: {e}", None, 500


def _handle_ap_radios(text, _session_id):
    """Show radio info for an AP."""
    import app as _app

    aruba_client = _app.aruba_client

    serial = None
    m = re.search(r"\b([A-Z0-9]{8,14})\b", text.upper())
    serial = m.group(1) if m else None
    if not serial:
        return "Please provide an AP serial number. Example: *'radios on AP ABC123'*", None, 200
    try:
        data = aruba_client.get(
            f"/network-monitoring/v1/aps/{serial}/rf",
        )
        radios = data.get("radios", data.get("items", []))
        if not radios:
            return f"No radio data found for AP **{serial}**.", [], 200
        table = [
            {
                "Radio": r.get("radioNumber", r.get("index", "")),
                "Band": r.get("radioType", r.get("band", "")),
                "Channel": r.get("channel", ""),
                "TX Power": f"{r.get('txPower', '')} dBm" if r.get("txPower") else "",
                "Clients": r.get("clientCount", ""),
                "Utilization": (
                    f"{r.get('utilization', '')}%" if r.get("utilization") is not None else ""
                ),
            }
            for r in radios
        ]
        return f"**Radios on AP {serial}:**", table, 200
    except Exception as e:
        logger.error(f"Chat ap_radios error: {e}")
        return f"Could not retrieve radio info for {serial}: {e}", None, 500


def _handle_audit_logs(_text, _session_id):
    """Show recent audit log entries (configuration changes)."""
    import app as _app

    aruba_client = _app.aruba_client

    try:
        data = aruba_client.get(
            "/platform/auditlogs/v1/logs",
            params={"limit": 20},
        )
        logs = data.get("audit_logs", data.get("items", data.get("logs", [])))
        if not logs:
            return "No recent audit log entries found.", [], 200
        table = [
            {
                "Time": l.get("ts", l.get("timestamp", ""))[:19].replace("T", " "),
                "User": l.get("user_str", l.get("username", "")),
                "Action": l.get("description", l.get("action", ""))[:60],
                "Target": l.get("target", l.get("device", "")),
                "Result": l.get("result", ""),
            }
            for l in logs[:15]
        ]
        return f"**Last {len(table)} audit log entries:**", table, 200
    except Exception as e:
        logger.error(f"Chat audit_logs error: {e}")
        return f"Could not retrieve audit logs: {e}", None, 500


def _handle_unknown(text, _session_id):
    # Try to give a smart suggestion based on words in the message
    hints = []
    msg_lower = text.lower()
    if any(w in msg_lower for w in ["device", "router", "switch", "ap", "gateway"]):
        hints.append("*'show devices down'* or *'device inventory'*")
    if any(w in msg_lower for w in ["client", "user", "connected", "phone"]):
        hints.append("*'show clients on SSID CorpWiFi'* or *'find client 192.168.1.5'*")
    if any(w in msg_lower for w in ["alert", "alarm", "problem", "issue"]):
        hints.append("*'show alerts'* or *'show critical alerts'*")
    if any(w in msg_lower for w in ["site", "location", "office"]):
        hints.append("*'site health'*")
    if not hints:
        hints = ["*'how many APs are down'*", "*'show devices down'*", "*'device inventory'*"]

    return (
        "I didn't quite catch that. Try:\n"
        + "\n".join(f"- {h}" for h in hints)
        + "\n\nType **help** to see everything I can do.",
        None,
        200,
    )


# ---------------------------------------------------------------------------
# Ollama LLM Agent — natural language understanding
# ---------------------------------------------------------------------------

_OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
_OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "qwen3.5:cloud")

_OLLAMA_SYSTEM_PROMPT = """\
You are a network assistant. Output ONLY valid JSON — no other text, no markdown.

ALWAYS choose ONE of these two formats:
  {"action":"respond","message":"your text answer here"}
  {"action":"tool","tool":"TOOLNAME","params":{}}

RULE: When in doubt, ALWAYS use "respond". Never guess a tool.

Use "tool" ONLY when the user is clearly asking for live network data matching one of:

  ap_status       — "how many APs are down" / "AP status" / "show APs"
  alert_summary   — "show alerts" / "any critical alerts" / "open alerts"
  site_health     — "site health" / "which sites are degraded"
  site_list       — "list sites" / "what sites" / "show all sites"
  client_count    — "how many clients" / "client count" / "connected users"
  find_client     — "find client 192.168.1.1" / "where is MAC aa:bb:cc"  → params: {"query":"VALUE"}
  clients_by_ssid — "clients on CorpWiFi" / "who is on SSID X"  → params: {"ssid":"NAME"}
  firmware_status — "firmware" / "outdated firmware" / "software versions"
  device_status   — "show devices down" / "switches offline"  → params: {"type":"ap"/"switch"/"gateway"/null}
  device_inventory — "inventory" / "all devices" / "device list"
  wlan_list       — "list WLANs" / "show SSIDs" / "wireless networks"
  top_bandwidth   — "top bandwidth" / "most bandwidth" / "heavy users"
  top_clients     — "top clients" / "most active clients"
  switch_port_errors — "port errors" / "interface errors" / "switch errors"
  device_events   — "events for device SERIAL" / "what happened on switch X"  → params: {"serial":"SERIAL"}
  switch_vlans    — "VLANs on switch SERIAL" / "what VLANs"  → params: {"serial":"SERIAL"}
  ap_radios       — "radios on AP SERIAL" / "AP radio info"  → params: {"serial":"SERIAL"}
  audit_logs      — "audit log" / "recent changes" / "who changed what"
  ping_test       — "ping IP from SERIAL"  → params: {"serial":"SERIAL","target":"IP"}
  traceroute      — "traceroute to IP from SERIAL"  → params: {"serial":"SERIAL","target":"IP"}
  bounce_ap       — "reboot AP SERIAL" / "restart AP"  → params: {"serial":"SERIAL"}
  help            — "help" / "what can you do"

EXAMPLES:
User: "hello"                           → {"action":"respond","message":"Hello! I can show you AP status, alerts, client info, and more. Type 'help' for a full list."}
User: "what is OSPF"                    → {"action":"respond","message":"OSPF (Open Shortest Path First) is a link-state routing protocol..."}
User: "show me APs that are down"       → {"action":"tool","tool":"ap_status","params":{"status":"down"}}
User: "how many clients are connected"  → {"action":"tool","tool":"client_count","params":{}}
User: "show alerts"                     → {"action":"tool","tool":"alert_summary","params":{}}
User: "find client 10.0.0.5"           → {"action":"tool","tool":"find_client","params":{"query":"10.0.0.5"}}
User: "what is BGP"                     → {"action":"respond","message":"BGP (Border Gateway Protocol) is the routing protocol of the internet..."}
User: "thanks"                          → {"action":"respond","message":"You're welcome! Let me know if you need anything else."}
"""


class ClaudeAgent:
    """Anthropic Claude-powered intent classifier and networking assistant.

    Uses Claude's native tool-use so intent names ARE the tool names — no JSON
    parsing guesswork.  Falls back gracefully when ANTHROPIC_API_KEY is absent.
    """

    _client = None
    _api_key_cached: str = ""

    # Claude Haiku: fast + cheap for intent routing; Sonnet for richer Q&A
    _MODEL = os.environ.get("CLAUDE_MODEL", "claude-haiku-4-5-20251001")

    @classmethod
    def is_available(cls) -> bool:
        return bool(os.environ.get("ANTHROPIC_API_KEY", ""))

    @classmethod
    def _get_client(cls):
        try:
            import anthropic
        except ImportError:
            return None
        key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not key:
            return None
        if cls._client is None or cls._api_key_cached != key:
            cls._api_key_cached = key
            cls._client = anthropic.Anthropic(api_key=key)
        return cls._client

    @classmethod
    def _build_tools(cls) -> list:
        """Build one Anthropic tool per intent so Claude picks via tool-use."""
        common_props = {
            "site":        {"type": "string", "description": "Site name if mentioned"},
            "serial":      {"type": "string", "description": "Device serial number if mentioned"},
            "mac":         {"type": "string", "description": "MAC address if mentioned"},
            "ssid":        {"type": "string", "description": "SSID / WLAN name if mentioned"},
            "severity":    {"type": "string", "description": "Alert severity (CRITICAL/MAJOR/MINOR) if mentioned"},
            "destination": {"type": "string", "description": "IP address or hostname for ping / traceroute"},
            "port":        {"type": "string", "description": "Switch port identifier if mentioned (e.g. 1/1/5)"},
            "query":       {"type": "string", "description": "Search term, IP, or MAC for client lookup"},
        }
        tools = []
        for intent in _INTENTS:
            tools.append({
                "name": intent["name"],
                "description": intent["description"],
                "input_schema": {
                    "type": "object",
                    "properties": common_props,
                },
            })
        return tools

    @classmethod
    def classify(cls, text: str, history: list = None, context: str = "") -> dict | None:
        """Classify intent using Claude tool-use.

        Returns:
            {"name": intent_name, "params": {...}, "via": "claude"}
            {"name": "__llm_response__", "message": "...", "via": "claude"}
            None on failure (caller falls back to _handle_unknown)
        """
        client = cls._get_client()
        if not client:
            return None

        system = (
            "You are a network operations assistant for an Aruba Central WiFi and switching platform. "
            "When the user asks about network status, devices, clients, alerts, VLANs, or wants to "
            "run an action (ping, reboot, bounce port), call the matching tool. "
            "When the user asks a general networking concept question (What is OSPF? How does RADIUS work?) "
            "or chats casually, answer directly in 1–3 sentences without calling any tool. "
            "Be concise and professional."
        )
        if context:
            system += f"\n\nUser is currently on page: {context}"

        messages = []
        for h in (history or [])[-8:]:
            role = h.get("role", "user")
            content = h.get("content", "")
            if isinstance(content, str) and content.strip():
                messages.append({"role": role, "content": content})
        messages.append({"role": "user", "content": text})

        try:
            resp = client.messages.create(
                model=cls._MODEL,
                max_tokens=512,
                system=system,
                tools=cls._build_tools(),
                messages=messages,
            )

            # Tool-use block → intent dispatch
            for block in resp.content:
                if block.type == "tool_use":
                    tool_name = block.name
                    params = dict(block.input or {})
                    if tool_name in _HANDLERS_KEYS:
                        logger.info(f"ClaudeAgent picked tool '{tool_name}' params={params}")
                        return {"name": tool_name, "params": params, "via": "claude"}
                    logger.warning(f"ClaudeAgent returned unknown tool '{tool_name}' — ignoring")

            # Text block → direct LLM answer (general Q&A)
            for block in resp.content:
                if block.type == "text" and block.text.strip():
                    return {"name": "__llm_response__", "message": block.text.strip(), "via": "claude"}

            return None

        except Exception as exc:
            logger.warning(f"ClaudeAgent.classify error: {exc}")
            return None


class GeminiAgent:
    """Google Gemini-powered intent classifier — free tier: 15 RPM, 1M tokens/day.

    Set GEMINI_API_KEY in .env to activate.  Uses gemini-1.5-flash by default
    (override with GEMINI_MODEL).  No extra packages required — calls the REST
    API directly with httpx.
    """

    _MODEL = os.environ.get("GEMINI_MODEL", "gemini-flash-latest")
    _API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

    @classmethod
    def is_available(cls) -> bool:
        return bool(os.environ.get("GEMINI_API_KEY", ""))

    @classmethod
    def _build_function_declarations(cls) -> list:
        common_props = {
            "site":        {"type": "STRING", "description": "Site name if mentioned"},
            "serial":      {"type": "STRING", "description": "Device serial number if mentioned"},
            "mac":         {"type": "STRING", "description": "MAC address if mentioned"},
            "ssid":        {"type": "STRING", "description": "SSID/WLAN name if mentioned"},
            "severity":    {"type": "STRING", "description": "Alert severity (CRITICAL/MAJOR/MINOR) if mentioned"},
            "destination": {"type": "STRING", "description": "IP or hostname for ping / traceroute"},
            "port":        {"type": "STRING", "description": "Switch port identifier e.g. 1/1/5"},
            "query":       {"type": "STRING", "description": "Search term, IP, or MAC for client lookup"},
        }
        return [
            {
                "name": intent["name"],
                "description": intent["description"],
                "parameters": {"type": "OBJECT", "properties": common_props},
            }
            for intent in _INTENTS
        ]

    @classmethod
    def classify(cls, text: str, history: list = None, context: str = "") -> dict | None:
        key = os.environ.get("GEMINI_API_KEY", "")
        if not key:
            return None

        system_instruction = (
            "You are a network operations assistant for an Aruba Central WiFi and switching platform. "
            "Call the appropriate function when the user asks about network status, devices, clients, "
            "alerts, VLANs, or wants to run an action (ping, reboot, bounce port). "
            "For general networking concept questions (What is OSPF? How does RADIUS work?) "
            "or casual chat, answer directly in 1–3 sentences without calling any function."
        )
        if context:
            system_instruction += f" User is currently on page: {context}"

        contents = []
        for h in (history or [])[-8:]:
            role = "user" if h.get("role") == "user" else "model"
            content = h.get("content", "").strip()
            if content:
                contents.append({"role": role, "parts": [{"text": content}]})
        contents.append({"role": "user", "parts": [{"text": text}]})

        payload = {
            "system_instruction": {"parts": [{"text": system_instruction}]},
            "contents": contents,
            "tools": [{"function_declarations": cls._build_function_declarations()}],
            "tool_config": {"function_calling_config": {"mode": "AUTO"}},
            "generation_config": {"temperature": 0.05, "max_output_tokens": 512},
        }

        try:
            url = f"{cls._API_BASE}/{cls._MODEL}:generateContent?key={key}"
            resp = httpx.post(url, json=payload, timeout=10.0)
            resp.raise_for_status()
            data = resp.json()

            parts = (data.get("candidates") or [{}])[0].get("content", {}).get("parts", [])
            for part in parts:
                if "functionCall" in part:
                    fn   = part["functionCall"]
                    name = fn.get("name", "")
                    args = fn.get("args") or {}
                    if name in _HANDLERS_KEYS:
                        logger.info(f"GeminiAgent picked '{name}' args={args}")
                        return {"name": name, "params": args, "via": "gemini"}
                    logger.warning(f"GeminiAgent returned unknown function '{name}' — ignored")

            # Text response → direct LLM answer
            for part in parts:
                if "text" in part and part["text"].strip():
                    return {"name": "__llm_response__", "message": part["text"].strip(), "via": "gemini"}

            return None

        except httpx.TimeoutException:
            logger.warning("GeminiAgent timeout — skipping")
            return None
        except Exception as exc:
            logger.warning(f"GeminiAgent.classify error: {exc}")
            return None


class OllamaAgent:
    """LLM-powered intent classifier using local Ollama."""

    @staticmethod
    def is_available() -> bool:
        try:
            r = httpx.get(f"{_OLLAMA_URL}/api/tags", timeout=2.0)
            return r.status_code == 200
        except Exception:
            return False

    @staticmethod
    def classify(text: str, history: list = None, context: str = "") -> dict | None:
        """
        Use Ollama to classify intent and extract params.
        Returns {"name": tool_name, "params": {...}, "via": "ollama"}
        or {"name": "__llm_response__", "message": "...", "via": "ollama"}
        or None on failure (fallback to regex).
        """
        system_content = _OLLAMA_SYSTEM_PROMPT
        if context:
            system_content += f"\n\nUser is currently viewing page: {context}"
        messages = [{"role": "system", "content": system_content}]

        # Last 6 turns of history for context
        for h in (history or [])[-6:]:
            role = h.get("role", "user")
            content = h.get("content", "")
            if isinstance(content, str) and content.strip():
                messages.append({"role": role, "content": content})

        messages.append({"role": "user", "content": text})

        try:
            resp = httpx.post(
                f"{_OLLAMA_URL}/api/chat",
                json={
                    "model": _OLLAMA_MODEL,
                    "messages": messages,
                    "stream": False,
                    "format": "json",
                    "think": False,
                    "options": {"temperature": 0.05, "num_predict": 512},
                },
                timeout=8.0,
            )
            resp.raise_for_status()
            content = resp.json()["message"]["content"]
            # Strip any accidental thinking/preamble before the JSON object
            json_start = content.find("{")
            if json_start > 0:
                content = content[json_start:]
            parsed = json.loads(content)

            action = parsed.get("action")
            if action == "tool":
                tool = parsed.get("tool", "")
                params = parsed.get("params") or {}
                if tool in _HANDLERS_KEYS:
                    return {"name": tool, "params": params, "via": "ollama"}
                # Ollama hallucinated a tool name — ask it to answer directly instead
                logger.warning(f"Ollama picked unknown tool '{tool}' — retrying as respond")
                retry_msgs = [
                    {
                        "role": "system",
                        "content": 'Output ONLY: {"action":"respond","message":"YOUR_ANSWER"}',
                    },
                    {"role": "user", "content": text},
                ]
                retry_resp = httpx.post(
                    f"{_OLLAMA_URL}/api/chat",
                    json={
                        "model": _OLLAMA_MODEL,
                        "messages": retry_msgs,
                        "stream": False,
                        "format": "json",
                        "think": False,
                        "options": {"temperature": 0.1, "num_predict": 512},
                    },
                    timeout=8.0,
                )
                retry_resp.raise_for_status()
                retry_content = retry_resp.json()["message"]["content"]
                json_start = retry_content.find("{")
                if json_start > 0:
                    retry_content = retry_content[json_start:]
                retry_parsed = json.loads(retry_content)
                msg = retry_parsed.get("message", "").strip()
                if msg:
                    return {"name": "__llm_response__", "message": msg, "via": "ollama"}
                return None

            if action == "respond":
                msg = parsed.get("message", "").strip()
                if msg:
                    return {"name": "__llm_response__", "message": msg, "via": "ollama"}

            return None

        except httpx.TimeoutException:
            logger.warning("Ollama timeout — falling back to regex classifier")
            return None
        except Exception as e:
            logger.warning(f"Ollama classify error: {e}")
            return None


# ---------------------------------------------------------------------------
# Intent → handler dispatch table
# ---------------------------------------------------------------------------
_HANDLERS = {
    "help": _handle_help,
    "ap_status": _handle_ap_status,
    "site_health": _handle_site_health,
    "clients_by_ssid": _handle_clients_by_ssid,
    "client_by_mac": _handle_client_by_mac,
    "switch_port_errors": _handle_switch_port_errors,
    "bounce_ap": _handle_bounce_ap,
    "bounce_port": _handle_bounce_port,
    "alert_summary": _handle_alert_summary,
    "firmware_status": _handle_firmware_status,
    "wlan_list": _handle_wlan_list,
    "top_clients": _handle_top_clients,
    "device_inventory": _handle_device_inventory,
    "ack_alert": _handle_ack_alert,
    "ping_test": _handle_ping_test,
    "device_status": _handle_device_status,
    "find_client": _handle_find_client,
    "disconnect_client": _handle_disconnect_client,
    "traceroute": _handle_traceroute,
    "client_count": _handle_client_count,
    "site_list": _handle_site_list,
    "top_bandwidth": _handle_top_bandwidth,
    # MCP-sourced tools
    "device_events": _handle_device_events,
    "switch_vlans": _handle_switch_vlans,
    "show_switch_vlans": _handle_switch_vlans,        # alias for new intent
    "ap_radios": _handle_ap_radios,
    "audit_logs": _handle_audit_logs,
    # New intents
    "show_switch_interfaces": _handle_switch_port_errors,  # reuse port-status handler
}

# Used by OllamaAgent to validate tool names (defined after _HANDLERS)
_HANDLERS_KEYS = set(_HANDLERS.keys())


# =============================================================================
# Webhook Ingest + SSE Streaming
# =============================================================================


@chat_bp.route("/api/webhooks/aruba-central", methods=["POST"])
def aruba_webhook():
    """
    Receives push events from Aruba Central (device/AP up-down, alerts, etc).
    Validates HMAC-SHA256 signature when ARUBA_WEBHOOK_SECRET is set.
    Fan-outs to all active SSE subscribers immediately (<1 s delivery).
    """
    import app as _app

    body = request.get_data()
    webhook_secret = os.environ.get("ARUBA_WEBHOOK_SECRET", "")

    if not webhook_secret:
        logger.error("Webhook: ARUBA_WEBHOOK_SECRET not configured")
        return (
            jsonify(
                {
                    "error": "Webhook secret not configured. Set ARUBA_WEBHOOK_SECRET environment variable."
                }
            ),
            403,
        )

    sig_header = request.headers.get("X-Aruba-Signature", "")
    expected = hmac.new(webhook_secret.encode(), body, hashlib.sha256).hexdigest()
    if not sig_header or not hmac.compare_digest(sig_header, expected):
        logger.warning("Webhook: invalid signature rejected")
        return "", 401

    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON"}), 400

    event = {
        "id": payload.get("nid") or payload.get("event_id"),
        "ts": payload.get("ts") or int(time.time() * 1000),
        "type": payload.get("event_type"),
        "severity": payload.get("severity", "info"),
        "device": payload.get("device_id"),
        "site": payload.get("group_name"),
        "detail": payload,
        "_ingested_at": int(time.time() * 1000),
    }

    with _app._event_store_lock:
        _app._event_store.append(event)

    _app._fan_out_event(event)
    logger.info(f"Webhook: ingested type={event['type']} device={event['device']}")
    return "", 204


@chat_bp.route("/api/stream/events")
def stream_events():
    """
    SSE endpoint — accepts either:
      - X-Grafana-API-Key header (for Grafana Infinity datasource)
      - X-Session-ID header or ?session= query param (for browser EventSource)
    """
    import app as _app

    # Auth check: allow Grafana key OR valid session
    grafana_key = os.environ.get("GRAFANA_API_KEY", "")
    provided_grafana_key = request.headers.get("X-Grafana-API-Key", "")
    session_id = request.headers.get("X-Session-ID") or request.args.get("session")

    if (
        grafana_key
        and provided_grafana_key
        and hmac.compare_digest(provided_grafana_key, grafana_key)
    ):
        pass  # Valid Grafana key
    elif session_id and session_id in _app.active_sessions:
        pass  # Valid browser session
    else:
        return jsonify({"error": "Unauthorized"}), 401

    with _app._event_store_lock:
        snapshot = list(_app._event_store)[-50:]

    def generate():
        for past in snapshot:
            yield f"data: {json.dumps(past)}\n\n"

        q: queue.Queue = queue.Queue(maxsize=200)
        with _app._sse_subscribers_lock:
            _app._sse_subscribers.add(q)
        try:
            while True:
                try:
                    event = q.get(timeout=20)
                    yield f"data: {json.dumps(event)}\n\n"
                except queue.Empty:
                    yield ": keepalive\n\n"
        except GeneratorExit:
            pass
        finally:
            with _app._sse_subscribers_lock:
                _app._sse_subscribers.discard(q)

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


# =============================================================================
# MSP Chatbot Backend routes
# =============================================================================


@chat_bp.route("/api/chat/llm-status", methods=["GET"])
def chat_llm_status():
    """Return active LLM info: Gemini → Claude → Ollama priority."""
    # Gemini free cloud
    if GeminiAgent.is_available():
        return jsonify({
            "available": True,
            "model": GeminiAgent._MODEL,
            "model_ready": True,
            "via": "gemini",
        })

    # Claude paid cloud
    if ClaudeAgent.is_available():
        return jsonify({
            "available": True,
            "model": ClaudeAgent._MODEL,
            "model_ready": True,
            "via": "claude",
        })

    # Ollama free local (any engine)
    try:
        r = httpx.get(f"{_OLLAMA_URL}/api/tags", timeout=3.0)
        if r.status_code == 200:
            tags = r.json()
            models = [m["name"] for m in tags.get("models", [])]
            model_ready = any(_OLLAMA_MODEL.split(":")[0] in m for m in models)
            return jsonify({
                "available": True,
                "model": _OLLAMA_MODEL,
                "model_ready": model_ready,
                "models": models,
                "url": _OLLAMA_URL,
                "via": "ollama",
            })
    except Exception:
        pass

    return jsonify({
        "available": False,
        "model": None,
        "model_ready": False,
        "error": "No LLM configured — set GEMINI_API_KEY, ANTHROPIC_API_KEY, or run Ollama locally",
    })


@chat_bp.route("/api/chat/intents", methods=["GET"])
@require_session
def chat_intents():
    """Return the list of supported chat intents for UI hint rendering."""
    return jsonify(
        {
            "intents": [
                {
                    "name": i["name"],
                    "description": i["description"],
                    "destructive": i["destructive"],
                }
                for i in _INTENTS
            ],
            "count": len(_INTENTS),
        }
    )


@chat_bp.route("/api/chat/message", methods=["POST"])
@require_session
def chat_message():
    """
    MSP chatbot message handler.

    Classifies the user's natural-language message into one of the known
    intents and dispatches to the appropriate handler.  Stateless: conversation
    history is carried in the request body and echoed back with this turn
    appended so the React client can maintain context without server storage.
    """
    import app as _app

    try:
        body = request.get_json(silent=True) or {}
        message = (body.get("message") or "").strip()
        history = body.get("history", [])
        ctx = body.get("context", {})

        if not message:
            return jsonify({"error": "message field is required and must not be empty"}), 400

        # Sanity bounds — prevent abuse of history length
        if len(history) > 40:
            history = history[-40:]
        if len(message) > 2000:
            return jsonify({"error": "message too long (max 2000 characters)"}), 400

        # Guard: require aruba_client (same pattern as other endpoints)
        aruba_client = _app.aruba_client
        if not aruba_client:
            return (
                jsonify(
                    {
                        "reply": "The portal is not connected to Aruba Central. "
                        "Please configure credentials and try again.",
                        "intent": None,
                        "data": None,
                        "history": history,
                        "ts": time.time(),
                    }
                ),
                503,
            )

        session_id = request.headers.get("X-Session-ID", "unknown")

        # ── Intent classification ────────────────────────────────────────────
        # 1. Try fast regex classifier first (no LLM, no latency)
        intent = IntentClassifier.classify(message)
        via = "regex"

        # 2–4. LLM fallback cascade (first available wins):
        #       Gemini free cloud → Claude paid cloud → Ollama free local
        if intent is None:
            for agent_cls, agent_via in [
                (GeminiAgent, "gemini"),
                (ClaudeAgent, "claude"),
            ]:
                if agent_cls.is_available():
                    result = agent_cls.classify(message, history, context=ctx)
                    if result:
                        intent = result
                        via = agent_via
                    break  # stop after first configured cloud agent

        # 5. Ollama local fallback (free, any engine)
        if intent is None:
            ollama_result = OllamaAgent.classify(message, history, context=ctx)
            if ollama_result:
                intent = ollama_result
                via = "ollama"

        # 6. Handle direct LLM responses (answered without calling a tool)
        if intent and intent.get("name") == "__llm_response__":
            llm_via = intent.get("via", via)
            llm_model = (
                _OLLAMA_MODEL if llm_via == "ollama"
                else GeminiAgent._MODEL if llm_via == "gemini"
                else ClaudeAgent._MODEL if llm_via == "claude"
                else "unknown"
            )
            logger.info(
                f"Chat: session={session_id[:8]}... intent=llm_response via={llm_via} "
                f"msg={message[:80]!r}"
            )
            new_history = list(history) + [
                {"role": "user", "content": message},
                {"role": "assistant", "content": intent["message"]},
            ]
            return jsonify(
                {
                    "reply": intent["message"],
                    "intent": "llm_response",
                    "via": llm_via,
                    "model": llm_model,
                    "data": None,
                    "history": new_history,
                    "ts": time.time(),
                }
            )

        logger.info(
            f"Chat: session={session_id[:8]}... "
            f"intent={intent['name'] if intent else 'unknown'} "
            f"via={via} msg={message[:80]!r}"
        )

        # Dispatch
        if intent:
            handler = _HANDLERS.get(intent["name"], _handle_unknown)
        else:
            handler = _handle_unknown

        # For find_client, inject Ollama-extracted query param into the message
        # so the handler can extract an IP/MAC it wouldn't find in bare text.
        dispatch_text = message
        if intent and intent.get("name") == "find_client":
            query = (intent.get("params") or {}).get("query", "")
            if query and query not in message:
                dispatch_text = f"{message} {query}"

        try:
            reply, data, status = handler(dispatch_text, session_id)
        except Exception as handler_err:
            logger.error(
                f"Chat handler {intent['name'] if intent else '?'} " f"raised: {handler_err}",
                exc_info=True,
            )
            reply = (
                "An internal error occurred while processing your request. "
                "Please try again or contact your administrator."
            )
            data = None
            status = 500

        # Build updated history (stateless — client owns the store)
        new_history = list(history) + [
            {"role": "user", "content": message},
            {"role": "assistant", "content": reply},
        ]

        # Rate-limit telemetry
        actions_this_min = len(_chat_action_tracker.get(session_id, _collections.deque()))
        daily_remaining = max(0, 5000 - _app.api_call_tracker.get("daily_calls", 0))

        response_body = {
            "reply": reply,
            "intent": intent["name"] if intent else None,
            "via": via,
            "model": (
                _OLLAMA_MODEL if via == "ollama"
                else GeminiAgent._MODEL if via == "gemini"
                else ClaudeAgent._MODEL if via == "claude"
                else "regex"
            ),
            "data": data,
            "destructive": bool(intent and intent.get("destructive")),
            "history": new_history,
            "ts": time.time(),
            "rate_limit": {
                "daily_calls_remaining": daily_remaining,
                "actions_this_minute": actions_this_min,
                "action_limit_per_minute": _CHAT_ACTION_LIMIT,
            },
        }

        return jsonify(response_body), status

    except Exception as e:
        logger.error(f"Chat endpoint fatal error: {e}", exc_info=True)
        return (
            jsonify(
                {
                    "error": "Internal server error",
                    "reply": "Something went wrong. Please try again.",
                }
            ),
            500,
        )
