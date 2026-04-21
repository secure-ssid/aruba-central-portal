"""
Reporting Blueprint — data for ScheduledReportsPage and ReportingPage.

All endpoints call New Central /network-monitoring/v1alpha1/ paths confirmed
against developer.arubanetworks.com/new-central/reference (April 2026).
"""

from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify
import logging
from .helpers import (
    require_session,
    cached_get,
    cached_get_paginated,
    parallel_get,
    monitoring_list_items,
    rate_limit,
)

reporting_bp = Blueprint("reporting", __name__)
logger = logging.getLogger(__name__)

_BASE = "/network-monitoring/v1"


def _rfc3339(dt):
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def _time_range(timeframe="1d"):
    """Convert shorthand timeframe to (start_at, end_at) RFC 3339 strings."""
    now = datetime.now(timezone.utc)
    delta_map = {
        "1h": timedelta(hours=1),
        "3h": timedelta(hours=3),
        "1d": timedelta(days=1),
        "3d": timedelta(days=3),
        "1w": timedelta(weeks=1),
        "1m": timedelta(days=30),
    }
    delta = delta_map.get(timeframe, timedelta(days=1))
    return _rfc3339(now - delta), _rfc3339(now)


# ── Device Inventory ──────────────────────────────────────────────────────────

@reporting_bp.route("/api/reporting/device-inventory", methods=["GET"])
@require_session
@rate_limit(max_requests=30, window_seconds=60)
def get_device_inventory():
    """Full device inventory from /network-monitoring/v1alpha1/devices."""
    try:
        response = cached_get_paginated(
            f"{_BASE}/devices",
            params=request.args.to_dict(),
            items_key="items",
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Reporting device inventory error: {e}")
        return jsonify({"error": str(e)}), 500


# ── Wireless Health (sites-health) ────────────────────────────────────────────

@reporting_bp.route("/api/reporting/wireless-health", methods=["GET"])
@require_session
@rate_limit(max_requests=30, window_seconds=60)
def get_wireless_health():
    """Per-site health scores from /network-monitoring/v1alpha1/sites-health."""
    try:
        params = {"limit": 100}
        site_id = request.args.get("site_id")
        if site_id:
            params["filter"] = f"siteId eq '{site_id}'"
        response = cached_get(f"{_BASE}/sites-health", params=params, ttl=30)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Reporting wireless health error: {e}")
        return jsonify({"error": str(e)}), 500


# ── Top APs by Wireless Usage ─────────────────────────────────────────────────

@reporting_bp.route("/api/reporting/top-aps-by-wireless-usage", methods=["GET"])
@require_session
@rate_limit(max_requests=30, window_seconds=60)
def get_top_aps_by_wireless_usage():
    """Top APs ranked by wireless bandwidth — /network-monitoring/v1alpha1/top-aps-by-wireless-usage."""
    try:
        timeframe = request.args.get("timeframe", "1d")
        site_id = request.args.get("site_id")
        count = min(int(request.args.get("count", 10)), 25)
        start_at, end_at = _time_range(timeframe)

        params = {
            "start-at": start_at,
            "end-at": end_at,
            "limit": count,
        }
        if site_id:
            params["site-id"] = site_id

        response = cached_get(f"{_BASE}/top-aps-by-wireless-usage", params=params, ttl=300)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Reporting top APs wireless usage error: {e}")
        return jsonify({"error": str(e)}), 500


# ── Top APs by Total Usage (wireless + wired) ─────────────────────────────────

@reporting_bp.route("/api/reporting/top-aps-by-usage", methods=["GET"])
@require_session
@rate_limit(max_requests=30, window_seconds=60)
def get_top_aps_by_usage():
    """Top APs by combined wireless+wired bandwidth — /network-monitoring/v1alpha1/top-aps-by-usage."""
    try:
        timeframe = request.args.get("timeframe", "1d")
        site_id = request.args.get("site_id")
        count = min(int(request.args.get("count", 10)), 25)
        start_at, end_at = _time_range(timeframe)

        params = {
            "start-at": start_at,
            "end-at": end_at,
            "limit": count,
        }
        if site_id:
            params["site-id"] = site_id

        response = cached_get(f"{_BASE}/top-aps-by-usage", params=params, ttl=300)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Reporting top APs usage error: {e}")
        return jsonify({"error": str(e)}), 500


# ── Top APs by Client Count (via clients-trend) ───────────────────────────────

@reporting_bp.route("/api/reporting/top-aps-by-client-count", methods=["GET"])
@require_session
@rate_limit(max_requests=30, window_seconds=60)
def get_top_aps_by_client_count():
    """Top N clients by usage as proxy for AP load — /network-monitoring/v1alpha1/clients-topn-usage."""
    try:
        timeframe = request.args.get("timeframe", "1d")
        site_id = request.args.get("site_id")
        count = min(int(request.args.get("count", 10)), 100)
        start_at, end_at = _time_range(timeframe)

        params = {
            "start-at": start_at,
            "end-at": end_at,
            "limit": count,
        }
        if site_id:
            params["site-id"] = site_id

        response = cached_get(f"{_BASE}/clients-topn-usage", params=params, ttl=60)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Reporting top APs by client count error: {e}")
        return jsonify({"error": str(e)}), 500


# ── Network Usage (client trend) ──────────────────────────────────────────────

@reporting_bp.route("/api/reporting/network-usage", methods=["GET"])
@require_session
@rate_limit(max_requests=30, window_seconds=60)
def get_network_usage():
    """Client trend data as network usage overview — /network-monitoring/v1alpha1/clients-trend."""
    try:
        timeframe = request.args.get("timeframe", "1d")
        site_id = request.args.get("site_id")
        start_at, end_at = _time_range(timeframe)

        params = {
            "start-at": start_at,
            "end-at": end_at,
            "type": "ALL",
        }
        if site_id:
            params["site-id"] = site_id

        response = cached_get(f"{_BASE}/clients-trend", params=params, ttl=60)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Reporting network usage error: {e}")
        return jsonify({"error": str(e)}), 500


# ── Top SSIDs by Usage ────────────────────────────────────────────────────────

@reporting_bp.route("/api/reporting/top-ssids-by-usage", methods=["GET"])
@require_session
@rate_limit(max_requests=30, window_seconds=60)
def get_top_ssids_by_usage():
    """WLAN list with client counts as SSID usage proxy — /network-monitoring/v1alpha1/wlans."""
    try:
        params = request.args.to_dict()
        site_id = params.pop("site_id", None)
        count = int(params.pop("count", 10))

        query = {}
        if site_id:
            query["site-id"] = site_id

        response = cached_get_paginated(
            f"{_BASE}/wlans",
            params=query,
            items_key="items",
        )
        items = monitoring_list_items(response)
        # Sort by client count descending, return top N
        items.sort(key=lambda x: x.get("clientCount", x.get("client_count", 0)), reverse=True)
        return jsonify({"items": items[:count], "count": len(items[:count])})
    except Exception as e:
        logger.error(f"Reporting top SSIDs error: {e}")
        return jsonify({"error": str(e)}), 500


# ── GreenLake Devices ─────────────────────────────────────────────────────────

@reporting_bp.route("/api/reporting/devices-with-greenlake", methods=["GET"])
@require_session
@rate_limit(max_requests=20, window_seconds=60)
def get_devices_with_greenlake():
    """Device inventory enriched with GreenLake subscription status."""
    try:
        import app as _app
        aruba_client = _app.aruba_client

        # Fetch devices and GreenLake subscriptions in parallel
        data = parallel_get([
            (f"{_BASE}/devices",),
        ])
        devices_resp = data.get(f"{_BASE}/devices", {})
        devices = monitoring_list_items(devices_resp)

        # Try to get GreenLake subscription info — gracefully degrade if unavailable
        gl_serials = set()
        try:
            gl_resp = aruba_client.get("/ui-management/v1/msp/customers/devices")
            gl_items = monitoring_list_items(gl_resp)
            gl_serials = {d.get("serial") or d.get("serialNumber") for d in gl_items if d}
        except Exception:
            pass

        for device in devices:
            serial = device.get("serial") or device.get("serialNumber")
            device["greenlake_enrolled"] = serial in gl_serials if gl_serials else None

        return jsonify({"items": devices, "count": len(devices)})
    except Exception as e:
        logger.error(f"Reporting GreenLake devices error: {e}")
        return jsonify({"error": str(e)}), 500
