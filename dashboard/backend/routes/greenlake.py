"""
GreenLake, Reporting, Alerts, Analytics, and Grafana Blueprint routes.

Extracted from app.py — covers:
  /api/alerts/
  /api/analytics/
  /api/greenlake/
  /api/reporting/
  /api/grafana/
"""

import os
import hmac
import time
import logging
from functools import wraps

from flask import Blueprint, request, jsonify

from .helpers import require_session, cached_get

greenlake_bp = Blueprint("greenlake", __name__)
logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Internal helpers
# ─────────────────────────────────────────────────────────────────────────────


def _get_greenlake_client():
    """Create a CentralAPIClient pointing to GreenLake Identity base with RBAC token manager."""
    import app as _app
    from utils.central_api_client import CentralAPIClient
    from utils.token_manager import TokenManager

    try:
        gl_client_id = os.environ.get("GL_RBAC_CLIENT_ID", "").strip()
        gl_client_secret = os.environ.get("GL_RBAC_CLIENT_SECRET", "").strip()
        gl_api_base = (
            os.environ.get("GL_API_BASE") or "https://global.api.greenlake.hpe.com"
        ).strip()
        if not gl_client_id or not gl_client_secret:
            raise ValueError("GreenLake RBAC credentials not configured")
        gl_tm = TokenManager(
            client_id=gl_client_id,
            client_secret=gl_client_secret,
            cache_file=".token_cache_greenlake.json",
        )
        return CentralAPIClient(base_url=gl_api_base, token_manager=gl_tm)
    except Exception as e:
        logger.error(f"Failed to initialize GreenLake client: {e}")
        return None


def _safe_int(v, default=0):
    """Coerce v to int safely — handles dicts, None, non-numeric strings."""
    if isinstance(v, (int, float)):
        return int(v)
    if isinstance(v, str):
        try:
            return int(v)
        except (ValueError, TypeError):
            return default
    return default


def _poll_cache_get(key: str):
    import app as _app

    with _app._poll_cache_lock:
        entry = _app._poll_cache.get(key)
        if entry:
            return entry["data"], entry["ts"]
        return None, None


def _poll_cache_set(key: str, data):
    import app as _app

    with _app._poll_cache_lock:
        _app._poll_cache[key] = {"data": data, "ts": time.time()}


def require_grafana_key(f):
    """Validate X-Grafana-API-Key OR valid session (browser dashboard access)."""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        import app as _app

        # Allow valid browser sessions (dashboard widgets)
        session_id = request.headers.get("X-Session-ID")
        if session_id and session_id in _app.active_sessions:
            return f(*args, **kwargs)
        # Allow Grafana Infinity datasource key
        expected_key = os.environ.get("GRAFANA_API_KEY", "")
        if expected_key:
            provided_key = request.headers.get("X-Grafana-API-Key", "")
            if provided_key and hmac.compare_digest(provided_key, expected_key):
                return f(*args, **kwargs)
        return jsonify({"error": "Unauthorized"}), 401

    return decorated_function


def _kpi_with_stale(cache_key: str, fetch_fn):
    """Fetch fresh data or serve stale cache + stale:true on failure (Agent B)."""
    import app as _app

    aruba_client = _app.aruba_client
    if aruba_client:
        try:
            data = fetch_fn()
            _poll_cache_set(cache_key, data)
            return jsonify(data)
        except Exception as e:
            logger.warning(f"Grafana {cache_key}: live fetch failed ({e}), trying stale cache")

    stale_data, stale_ts = _poll_cache_get(cache_key)
    if stale_data is not None:
        resp = dict(stale_data) if isinstance(stale_data, dict) else {"data": stale_data}
        resp["stale"] = True
        resp["stale_age_s"] = int(time.time() - stale_ts)
        return jsonify(resp), 200

    return jsonify({"error": "Aruba Central unavailable and no cached data"}), 503


# ─────────────────────────────────────────────────────────────────────────────
# Alerts routes  (lines ~3190–3248 in app.py)
# ─────────────────────────────────────────────────────────────────────────────


def _normalize_alert(a: dict) -> dict:
    """Map Aruba Central alert fields to consistent names for the frontend.

    network-notifications/v1/alerts returns camelCase fields:
      name        → alert type / description (e.g. "Switch Offline")
      summary     → human-readable detail sentence
      createdAt   → ISO-8601 string (e.g. "2026-04-08T01:29:57.891Z")
      status      → "Active" | "Cleared"
      severity    → "Critical" | "Major" | "Minor" | "Warning" | "Info"
      siteName    → site the device belongs to
      deviceType  → "Switch" | "AP" | etc.
      id          → alert UUID
    """
    # Description: actual field is "name"; fall back to older key names for compatibility
    description = (
        a.get("name")
        or a.get("alertType")
        or a.get("alert_type")
        or a.get("description")
        or a.get("summary")
        or a.get("message")
        or a.get("title")
    )

    # Device identifier: use siteName + deviceType as display since deviceId isn't present
    device = (
        a.get("deviceId")
        or a.get("device_id")
        or a.get("device_serial")
        or a.get("serial")
        or a.get("device_name")
        or a.get("siteName")
    )

    # Timestamp: createdAt is an ISO-8601 string — parse to unix seconds
    raw_ts = (
        a.get("createdAt")
        or a.get("raisedAt")
        or a.get("updatedAt")
        or a.get("ts")
        or a.get("created_at")
        or a.get("raise_time")
    )
    if raw_ts:
        if isinstance(raw_ts, str):
            try:
                from datetime import datetime, timezone
                dt = datetime.fromisoformat(raw_ts.replace("Z", "+00:00"))
                timestamp = int(dt.timestamp())
            except (ValueError, TypeError):
                timestamp = None
        else:
            try:
                ts_num = float(raw_ts)
                timestamp = int(ts_num / 1000) if ts_num > 1e10 else int(ts_num)
            except (TypeError, ValueError):
                timestamp = None
    else:
        timestamp = None

    # Normalise severity to lowercase so the frontend switch works
    severity = a.get("severity")
    if isinstance(severity, str):
        severity = severity.lower()

    # acknowledged flag from status field
    status = a.get("status", "")
    acknowledged = status.lower() in ("cleared", "acknowledged", "closed")

    return {
        **a,
        "description": description,
        "device": device,
        "timestamp": timestamp,
        "severity": severity,
        "acknowledged": acknowledged,
        "status": status,
    }


_ALERTS_PAGE_SIZE = 10


@greenlake_bp.route("/api/alerts", methods=["GET"])
@require_session
def get_alerts():
    """Get alerts with server-side pagination (page_size=10)."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        severity = request.args.get("severity")
        page = max(1, int(request.args.get("page", 1)))
        # Fetch enough for the requested page; API limit capped at 100
        fetch_limit = min(page * _ALERTS_PAGE_SIZE, 100)

        params = {"limit": fetch_limit}
        if severity:
            params["severity"] = severity

        last_err = None
        for ep in [
            "/network-notifications/v1/alerts",
            "/network-notifications/v1alpha1/alerts",
            "/network-monitoring/v1/alerts",
        ]:
            try:
                response = aruba_client.get(ep, params=params)
                # Aruba Central uses different list keys depending on the endpoint version
                raw_alerts = (
                    response.get("alerts")
                    or response.get("items")
                    or response.get("notifications")
                    or response.get("data")
                    or (response if isinstance(response, list) else [])
                )
                logger.info(f"Alerts response keys from {ep}: {list(response.keys()) if isinstance(response, dict) else 'list'}, raw_count={len(raw_alerts)}")
                normalized = [_normalize_alert(a) for a in raw_alerts]
                total = response.get("total", response.get("count", response.get("total_count", len(normalized))))

                # Slice to the requested page
                start = (page - 1) * _ALERTS_PAGE_SIZE
                page_alerts = normalized[start : start + _ALERTS_PAGE_SIZE]
                total_pages = max(1, -(-total // _ALERTS_PAGE_SIZE))  # ceil division

                return jsonify({
                    "alerts": page_alerts,
                    "total": total,
                    "page": page,
                    "page_size": _ALERTS_PAGE_SIZE,
                    "total_pages": total_pages,
                })
            except Exception as ep_err:
                last_err = ep_err
                if "401" in str(ep_err) or "403" in str(ep_err):
                    raise ep_err
                continue
        if last_err and ("404" in str(last_err) or "Not Found" in str(last_err)):
            logger.warning(f"Alerts endpoint not available: {last_err}")
            return jsonify({"alerts": [], "total": 0, "page": 1, "page_size": _ALERTS_PAGE_SIZE, "total_pages": 1})
        if last_err:
            raise last_err
    except Exception as e:
        logger.error(f"Error fetching alerts: {e}")
        return jsonify({"alerts": [], "total": 0, "page": 1, "page_size": _ALERTS_PAGE_SIZE, "total_pages": 1, "error": "Alerts API not available"})


@greenlake_bp.route("/api/alerts/<alert_id>", methods=["GET"])
@require_session
def get_alert_details(alert_id):
    """Get alert details by ID."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1/alerts/{alert_id}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching alert {alert_id}: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/alerts/<alert_id>/acknowledge", methods=["POST"])
@require_session
def acknowledge_alert(alert_id):
    """Acknowledge an alert."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.post(f"/network-monitoring/v1/alerts/{alert_id}/acknowledge")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error acknowledging alert {alert_id}: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/events", methods=["GET"])
@require_session
def get_events():
    """Get network events."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        event_type = request.args.get("type")
        limit = request.args.get("limit", 100)

        params = {"limit": limit}
        if event_type:
            params["type"] = event_type

        last_err = None
        for ep in ["/network-monitoring/v1/events", "/network-notifications/v1/events"]:
            try:
                response = aruba_client.get(ep, params=params)
                return jsonify(response)
            except Exception as ep_err:
                last_err = ep_err
                if "401" in str(ep_err) or "403" in str(ep_err):
                    raise ep_err
                continue
        if last_err and ("404" in str(last_err) or "Not Found" in str(last_err)):
            logger.warning(f"Events endpoint not available: {last_err}")
            return jsonify({"events": [], "count": 0, "total": 0})
        if last_err:
            raise last_err
    except Exception as e:
        logger.error(f"Error fetching events: {e}")
        return jsonify({"events": [], "count": 0, "total": 0, "error": "Events API not available"})


# ─────────────────────────────────────────────────────────────────────────────
# Analytics routes  (lines ~3342–3416 and ~9717–9754 in app.py)
# ─────────────────────────────────────────────────────────────────────────────


@greenlake_bp.route("/api/analytics/bandwidth", methods=["GET"])
@require_session
def get_bandwidth_analytics():
    """Get bandwidth usage analytics: top APs by total usage (MRT v1 API)."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        try:
            response = aruba_client.get("/network-monitoring/v1/top-aps-by-usage", params=params)
            return jsonify(response)
        except Exception as aerr:
            if (
                "404" in str(aerr)
                or "400" in str(aerr)
                or "Not Found" in str(aerr)
                or "Bad Request" in str(aerr)
            ):
                logger.warning("Bandwidth analytics not available; returning empty result")
                return jsonify({"items": [], "count": 0})
            raise aerr
    except Exception as e:
        logger.error(f"Error fetching bandwidth analytics: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/analytics/client-count", methods=["GET"])
@require_session
def get_client_count_analytics():
    """Get client count trends over time (MRT v1 API)."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        try:
            response = aruba_client.get("/network-monitoring/v1/clients-trend", params=params)
            return jsonify(response)
        except Exception as aerr:
            if (
                "404" in str(aerr)
                or "400" in str(aerr)
                or "Not Found" in str(aerr)
                or "Bad Request" in str(aerr)
            ):
                logger.warning("Client-count analytics not available; returning empty result")
                return jsonify({"items": [], "count": 0})
            raise aerr
    except Exception as e:
        logger.error(f"Error fetching client count analytics: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/analytics/device-uptime", methods=["GET"])
@require_session
def get_device_uptime():
    """Get device uptime statistics."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        try:
            response = aruba_client.get("/monitoring/v1/devices/uptime")
            return jsonify(response)
        except Exception as aerr:
            if (
                "404" in str(aerr)
                or "400" in str(aerr)
                or "Not Found" in str(aerr)
                or "Bad Request" in str(aerr)
            ):
                logger.warning("Device uptime not available; returning empty list")
                return jsonify({"items": [], "count": 0})
            raise aerr
    except Exception as e:
        logger.error(f"Error fetching device uptime: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/analytics/ap-performance", methods=["GET"])
@require_session
def get_ap_performance():
    """Get AP performance metrics."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        try:
            response = aruba_client.get("/monitoring/v1/aps/performance")
            return jsonify(response)
        except Exception as aerr:
            if (
                "404" in str(aerr)
                or "400" in str(aerr)
                or "Not Found" in str(aerr)
                or "Bad Request" in str(aerr)
            ):
                logger.warning("AP performance not available; returning empty list")
                return jsonify({"items": [], "count": 0})
            raise aerr
    except Exception as e:
        logger.error(f"Error fetching AP performance: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/analytics/top-apps", methods=["GET"])
@require_session
def get_top_apps():
    """Get top applications by bandwidth usage in a site."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        # Requires site-id, start-at, end-at query params per MRT API spec
        response = aruba_client.get("/network-monitoring/v1/applications", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching top apps: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/analytics/top-aps-wireless", methods=["GET"])
@require_session
def get_top_aps_wireless():
    """Get top APs by wireless (Wi-Fi) bandwidth usage."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        response = aruba_client.get(
            "/network-monitoring/v1/top-aps-by-wireless-usage", params=params
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching top APs by wireless usage: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/analytics/clients-trend", methods=["GET"])
@require_session
def get_clients_trend():
    """Get client count trend over time."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        response = aruba_client.get("/network-monitoring/v1/clients-trend", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching clients trend: {e}")
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────────────────────────────────────
# GreenLake Identity (RBAC) Proxy routes  (lines ~4098–4718 in app.py)
# ─────────────────────────────────────────────────────────────────────────────


@greenlake_bp.route("/api/greenlake/users", methods=["GET"])
@require_session
def greenlake_list_users():
    """List users from HPE GreenLake Identity service."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        # Map query params
        params = {}
        filter_str = request.args.get("filter")
        if filter_str:
            params["filter"] = filter_str
        offset = request.args.get("offset")
        limit = request.args.get("limit")
        if offset is not None:
            params["offset"] = offset
        if limit is not None:
            params["limit"] = limit
        data = client.get("/identity/v1/users", params=params)
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake users fetch error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/users/invite", methods=["POST"])
@require_session
def greenlake_invite_user():
    """Invite a user to the GreenLake workspace."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        data = request.get_json() or {}
        payload = {
            "email": data.get("email"),
            "sendWelcomeEmail": bool(data.get("sendWelcomeEmail", True)),
        }
        resp = client.post("/identity/v1/users", data=payload)
        return jsonify(resp), 201
    except Exception as e:
        logger.error(f"GreenLake invite user error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/users/<user_id>", methods=["GET", "PUT", "DELETE"])
@require_session
def greenlake_user_detail(user_id):
    """Get, update, or delete a GreenLake user."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        if request.method == "GET":
            data = client.get(f"/identity/v1/users/{user_id}")
            return jsonify(data)
        if request.method == "PUT":
            payload = request.get_json() or {}
            # Accept language and idleTimeout per API doc
            body = {}
            if "language" in payload:
                body["language"] = payload["language"]
            if "idleTimeout" in payload:
                body["idleTimeout"] = payload["idleTimeout"]
            data = client.put(f"/identity/v1/users/{user_id}", data=body)
            return jsonify(data)
        if request.method == "DELETE":
            data = client.delete(f"/identity/v1/users/{user_id}")
            return jsonify(data), 204
    except Exception as e:
        logger.error(f"GreenLake user detail error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/devices", methods=["GET"])
@require_session
def greenlake_list_devices():
    """List devices from HPE GreenLake Device Management."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        params = {}
        # pagination
        offset = request.args.get("offset")
        limit = request.args.get("limit")
        if offset is not None:
            params["offset"] = offset
        if limit is not None:
            params["limit"] = limit
        # v1 devices list
        data = client.get("/devices/v1/devices", params=params)
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake devices fetch error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/devices", methods=["POST", "PATCH"])
@require_session
def greenlake_modify_devices():
    """Create or update devices via GreenLake Device Management."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        payload = request.get_json() or {}
        if request.method == "POST":
            data = client.post("/devices/v1/devices", data=payload)
            return jsonify(data), 201
        if request.method == "PATCH":
            # Use PUT for device updates (GreenLake API standard)
            data = client.put("/devices/v1/devices", data=payload)
            return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake devices modify error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/tags", methods=["GET"])
@require_session
def greenlake_list_tags():
    """List tags from HPE GreenLake Tags service."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        params = {}
        data = client.get("/tags/v1/tags", params=params)
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake tags fetch error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/tags", methods=["POST"])
@require_session
def greenlake_create_tag():
    """Create a tag (if supported by Tags v1)."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        payload = request.get_json() or {}
        data = client.post("/tags/v1/tags", data=payload)
        return jsonify(data), 201
    except Exception as e:
        logger.error(f"GreenLake create tag error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/tags/<tag_id>", methods=["PATCH"])
@require_session
def greenlake_update_tag(tag_id):
    """Update a tag (if supported by Tags v1)."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        payload = request.get_json() or {}
        data = client.put(f"/tags/v1/tags/{tag_id}", data=payload)
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake update tag error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/tags/<tag_id>", methods=["DELETE"])
@require_session
def greenlake_delete_tag(tag_id):
    """Delete a tag from GreenLake."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        data = client.delete(f"/tags/v1/tags/{tag_id}")
        return jsonify({"message": "Tag deleted successfully"})
    except Exception as e:
        logger.error(f"GreenLake delete tag error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/subscriptions", methods=["GET"])
@require_session
def greenlake_list_subscriptions():
    """List subscriptions from HPE GreenLake Subscription Management."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        params = {}
        offset = request.args.get("offset")
        limit = request.args.get("limit")
        if offset is not None:
            params["offset"] = offset
        if limit is not None:
            params["limit"] = limit
        data = client.get("/subscriptions/v1/subscriptions", params=params)
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake subscriptions fetch error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/subscriptions", methods=["POST"])
@require_session
def greenlake_create_subscription():
    """Create subscription (if supported by Subscriptions v1)."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        payload = request.get_json() or {}
        data = client.post("/subscriptions/v1/subscriptions", data=payload)
        return jsonify(data), 201
    except Exception as e:
        logger.error(f"GreenLake create subscription error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/subscriptions/<sub_id>", methods=["PATCH"])
@require_session
def greenlake_update_subscription(sub_id):
    """Update subscription (if supported by Subscriptions v1)."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        payload = request.get_json() or {}
        data = client.put(f"/subscriptions/v1/subscriptions/{sub_id}", data=payload)
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake update subscription error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/workspaces", methods=["GET"])
@require_session
def greenlake_list_workspaces():
    """List MSP tenants/workspaces from HPE GreenLake Workspaces."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        params = {}
        try:
            data = client.get("/workspaces/v1/msp-tenants", params=params)
            return jsonify(data)
        except Exception as e:
            err = str(e)
            if (
                "404" in err
                or "Not Found" in err
                or "400" in err
                or "Bad Request" in err
                or "403" in err
                or "Unauthorized" in err
            ):
                return (
                    jsonify(
                        {"items": [], "count": 0, "error": "GreenLake Workspaces not available"}
                    ),
                    404,
                )
            return jsonify({"items": [], "count": 0})
    except Exception as e:
        logger.error(f"GreenLake workspaces fetch error: {e}")
        return jsonify({"items": [], "count": 0})


@greenlake_bp.route("/api/greenlake/workspaces", methods=["POST"])
@require_session
def greenlake_create_workspace():
    """Create a new workspace/tenant in GreenLake."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        payload = request.get_json() or {}
        if not payload.get("name"):
            return jsonify({"error": "Workspace name is required"}), 400
        # Call GreenLake Workspace API to create workspace
        data = client.post("/workspace/v1/workspaces", data=payload)
        return jsonify(data), 201
    except Exception as e:
        logger.error(f"GreenLake workspace create error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/workspaces/<workspace_id>", methods=["PATCH"])
@require_session
def greenlake_update_workspace(workspace_id):
    """Update a workspace/tenant in GreenLake."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        payload = request.get_json() or {}
        # Call GreenLake Workspace API to update workspace
        data = client.patch(f"/workspace/v1/workspaces/{workspace_id}", data=payload)
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake workspace update error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/workspaces/<workspace_id>", methods=["DELETE"])
@require_session
def greenlake_delete_workspace(workspace_id):
    """Delete a workspace/tenant from GreenLake."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        # Call GreenLake Workspace API to delete workspace
        data = client.delete(f"/workspace/v1/workspaces/{workspace_id}")
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake workspace delete error: {e}")
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────────────────────────────────────
# MSP Token Transfer
# ─────────────────────────────────────────────────────────────────────────────


@greenlake_bp.route("/api/greenlake/msp/token-transfer", methods=["POST"])
@require_session
def greenlake_msp_token_transfer():
    """Transfer subscription tokens between MSP customer workspaces."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400

        payload = request.get_json() or {}
        required_fields = ["sourceWorkspaceId", "targetWorkspaceId", "subscriptionId"]
        missing = [f for f in required_fields if not payload.get(f)]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

        # Build transfer request
        transfer_data = {
            "source_workspace_id": payload["sourceWorkspaceId"],
            "target_workspace_id": payload["targetWorkspaceId"],
            "subscription_id": payload["subscriptionId"],
        }

        # Optional: specific devices to transfer
        if payload.get("deviceSerials"):
            transfer_data["device_serials"] = payload["deviceSerials"]

        # Call GreenLake MSP API to transfer tokens
        data = client.post("/msp/v1/token-transfers", data=transfer_data)
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake MSP token transfer error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/locations", methods=["GET"])
@require_session
def greenlake_list_locations():
    """List locations from HPE GreenLake Locations service."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        params = {}
        offset = request.args.get("offset")
        limit = request.args.get("limit")
        if offset is not None:
            params["offset"] = offset
        if limit is not None:
            params["limit"] = limit
        try:
            data = client.get("/locations/v1/locations", params=params)
            return jsonify(data)
        except Exception as e:
            err = str(e)
            if (
                "404" in err
                or "Not Found" in err
                or "400" in err
                or "Bad Request" in err
                or "403" in err
                or "Unauthorized" in err
            ):
                return (
                    jsonify(
                        {"items": [], "count": 0, "error": "GreenLake Locations not available"}
                    ),
                    404,
                )
            return jsonify({"items": [], "count": 0})
    except Exception as e:
        logger.error(f"GreenLake locations fetch error: {e}")
        return jsonify({"items": [], "count": 0})


@greenlake_bp.route("/api/greenlake/locations", methods=["POST"])
@require_session
def greenlake_create_location():
    """Create a location (GreenLake Locations)."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        payload = request.get_json() or {}
        data = client.post("/locations/v1/locations", data=payload)
        return jsonify(data), 201
    except Exception as e:
        logger.error(f"GreenLake create location error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/locations/<location_id>", methods=["PATCH", "DELETE"])
@require_session
def greenlake_update_delete_location(location_id):
    """Update or delete a location."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        if request.method == "PATCH":
            payload = request.get_json() or {}
            data = client.put(f"/locations/v1/locations/{location_id}", data=payload)
            return jsonify(data)
        if request.method == "DELETE":
            data = client.delete(f"/locations/v1/locations/{location_id}")
            return jsonify(data), 204
    except Exception as e:
        logger.error(f"GreenLake update/delete location error: {e}")
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────────────────────────────────────
# GreenLake SCIM (Users/Groups)
# ─────────────────────────────────────────────────────────────────────────────


@greenlake_bp.route("/api/greenlake/scim/users", methods=["GET", "POST"])
@require_session
def greenlake_scim_users():
    """List or create SCIM users."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        if request.method == "GET":
            params = request.args.to_dict()
            try:
                data = client.get("/identity/v2beta1/scim/v2/Users", params=params)
                return jsonify(data)
            except Exception as e:
                err = str(e)
                if (
                    "404" in err
                    or "Not Found" in err
                    or "400" in err
                    or "Bad Request" in err
                    or "403" in err
                    or "Unauthorized" in err
                ):
                    return (
                        jsonify(
                            {
                                "Resources": [],
                                "totalResults": 0,
                                "error": "SCIM Users not available",
                            }
                        ),
                        404,
                    )
                return jsonify({"Resources": [], "totalResults": 0})
        if request.method == "POST":
            payload = request.get_json() or {}
            data = client.post("/identity/v2beta1/scim/v2/Users", data=payload)
            return jsonify(data), 201
    except Exception as e:
        logger.error(f"GreenLake SCIM users error: {e}")
        return jsonify({"Resources": [], "totalResults": 0})


@greenlake_bp.route("/api/greenlake/scim/users/<user_id>", methods=["GET", "PATCH", "DELETE"])
@require_session
def greenlake_scim_user_detail(user_id):
    """Get, update, or delete a SCIM user."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        if request.method == "GET":
            data = client.get(f"/identity/v2beta1/scim/v2/Users/{user_id}")
            return jsonify(data)
        if request.method == "PATCH":
            payload = request.get_json() or {}
            data = client.put(f"/identity/v2beta1/scim/v2/Users/{user_id}", data=payload)
            return jsonify(data)
        if request.method == "DELETE":
            data = client.delete(f"/identity/v2beta1/scim/v2/Users/{user_id}")
            return jsonify(data), 204
    except Exception as e:
        logger.error(f"GreenLake SCIM user detail error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/scim/groups", methods=["GET", "POST"])
@require_session
def greenlake_scim_groups():
    """List or create SCIM groups."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        if request.method == "GET":
            params = request.args.to_dict()
            try:
                data = client.get("/identity/v2beta1/scim/v2/Groups", params=params)
                return jsonify(data)
            except Exception as e:
                err = str(e)
                if (
                    "404" in err
                    or "Not Found" in err
                    or "400" in err
                    or "Bad Request" in err
                    or "403" in err
                    or "Unauthorized" in err
                ):
                    return (
                        jsonify(
                            {
                                "Resources": [],
                                "totalResults": 0,
                                "error": "SCIM Groups not available",
                            }
                        ),
                        404,
                    )
                return jsonify({"Resources": [], "totalResults": 0})
        if request.method == "POST":
            payload = request.get_json() or {}
            data = client.post("/identity/v2beta1/scim/v2/Groups", data=payload)
            return jsonify(data), 201
    except Exception as e:
        logger.error(f"GreenLake SCIM groups error: {e}")
        return jsonify({"Resources": [], "totalResults": 0})


@greenlake_bp.route("/api/greenlake/scim/groups/<group_id>", methods=["GET", "PATCH", "DELETE"])
@require_session
def greenlake_scim_group_detail(group_id):
    """Get, update, or delete a SCIM group."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        if request.method == "GET":
            data = client.get(f"/identity/v2beta1/scim/v2/Groups/{group_id}")
            return jsonify(data)
        if request.method == "PATCH":
            payload = request.get_json() or {}
            data = client.put(f"/identity/v2beta1/scim/v2/Groups/{group_id}", data=payload)
            return jsonify(data)
        if request.method == "DELETE":
            data = client.delete(f"/identity/v2beta1/scim/v2/Groups/{group_id}")
            return jsonify(data), 204
    except Exception as e:
        logger.error(f"GreenLake SCIM group detail error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/scim/users/<user_id>/groups", methods=["GET"])
@require_session
def greenlake_scim_user_groups(user_id):
    """List groups for a user (SCIM extensions)."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        data = client.get(f"/identity/v2beta1/scim/v2/extensions/Users/{user_id}/groups")
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake SCIM user groups error: {e}")
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────────────────────────────────────
# GreenLake Role Management (Platform Roles)
# ─────────────────────────────────────────────────────────────────────────────


@greenlake_bp.route("/api/greenlake/role-assignments", methods=["GET"])
@require_session
def greenlake_list_role_assignments():
    """List all platform role assignments."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"assignments": []}), 200
        # Call GreenLake Authorization API to get role assignments
        data = client.get("/authorization/v1/role-assignments")
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake role assignments list error: {e}")
        # Graceful fallback
        return jsonify({"assignments": []}), 200


@greenlake_bp.route("/api/greenlake/role-assignments", methods=["POST"])
@require_session
def greenlake_assign_role():
    """Assign a platform role to a user."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        payload = request.get_json()
        if not payload or "userId" not in payload or "roleId" not in payload:
            return jsonify({"error": "userId and roleId required"}), 400
        # Call GreenLake Authorization API to assign role
        data = client.post("/authorization/v1/role-assignments", data=payload)
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake role assignment error: {e}")
        return jsonify({"error": str(e)}), 500


@greenlake_bp.route("/api/greenlake/role-assignments/<assignment_id>", methods=["DELETE"])
@require_session
def greenlake_unassign_role(assignment_id):
    """Remove a platform role assignment."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        # Call GreenLake Authorization API to delete role assignment
        data = client.delete(f"/authorization/v1/role-assignments/{assignment_id}")
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake role unassignment error: {e}")
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────────────────────────────────────
# GreenLake Permissions Management
# ─────────────────────────────────────────────────────────────────────────────


@greenlake_bp.route("/api/greenlake/permissions", methods=["GET"])
@require_session
def greenlake_list_permissions():
    """List all available permissions in GreenLake."""
    try:
        client = _get_greenlake_client()
        if not client:
            # Return default permission set if GreenLake not configured
            return (
                jsonify(
                    {
                        "permissions": [
                            "workspace.view",
                            "workspace.create",
                            "workspace.update",
                            "workspace.delete",
                            "users.view",
                            "users.invite",
                            "users.update",
                            "users.delete",
                            "roles.view",
                            "roles.assign",
                            "roles.create",
                            "roles.update",
                            "roles.delete",
                            "devices.view",
                            "devices.add",
                            "devices.update",
                            "devices.delete",
                            "devices.subscribe",
                            "subscriptions.view",
                            "subscriptions.create",
                            "subscriptions.update",
                            "subscriptions.transfer",
                        ]
                    }
                ),
                200,
            )
        # Call GreenLake Authorization API to get permissions
        data = client.get("/authorization/v1/permissions")
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake permissions list error: {e}")
        # Graceful fallback
        return jsonify({"permissions": []}), 200


@greenlake_bp.route("/api/greenlake/role-permissions", methods=["GET"])
@require_session
def greenlake_role_permissions_map():
    """Get mapping of roles to their permissions."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({}), 200
        # Call GreenLake Authorization API to get role-permission mappings
        data = client.get("/authorization/v1/role-permissions")
        return jsonify(data)
    except Exception as e:
        logger.error(f"GreenLake role-permissions map error: {e}")
        return jsonify({}), 200


@greenlake_bp.route("/api/greenlake/custom-roles", methods=["POST"])
@require_session
def greenlake_create_custom_role():
    """Create a custom role with specific permissions."""
    try:
        client = _get_greenlake_client()
        if not client:
            return jsonify({"error": "GreenLake RBAC not configured"}), 400
        payload = request.get_json() or {}
        if not payload.get("name") or not payload.get("permissions"):
            return jsonify({"error": "Role name and permissions are required"}), 400
        # Call GreenLake Authorization API to create custom role
        data = client.post("/authorization/v1/custom-roles", data=payload)
        return jsonify(data), 201
    except Exception as e:
        logger.error(f"GreenLake custom role create error: {e}")
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────────────────────────────────────
# Reporting routes  (lines ~4720–5079 in app.py)
# ─────────────────────────────────────────────────────────────────────────────


@greenlake_bp.route("/api/reporting/top-aps-by-wireless-usage", methods=["GET"])
@require_session
def get_top_aps_by_wireless_usage():
    """Get top access points by wireless bandwidth usage."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        site_id = request.args.get("site_id", request.args.get("site-id"))
        count = request.args.get("count", 10)
        from_timestamp = request.args.get("from_timestamp")
        to_timestamp = request.args.get("to_timestamp")
        timeframe = request.args.get("timeframe", "1d")

        # Auto-select first site if not provided
        if not site_id:
            try:
                sites = cached_get("/central/v2/sites")
                if isinstance(sites, dict) and sites.get("sites"):
                    site_id = sites["sites"][0].get("site_id") or sites["sites"][0].get("id")
            except Exception as _:
                pass

        params = {"count": count, "timeframe": timeframe}
        if site_id:
            params["site-id"] = site_id
        if from_timestamp:
            params["from_timestamp"] = from_timestamp
        if to_timestamp:
            params["to_timestamp"] = to_timestamp

        try:
            response = aruba_client.get(
                "/network-monitoring/v1/top-aps-by-wireless-usage", params=params
            )
            return jsonify(response)
        except Exception:
            try:
                response = aruba_client.get(
                    "/reporting/v1/top-aps-by-wireless-usage", params=params
                )
                return jsonify(response)
            except Exception:
                return jsonify({"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching top APs by wireless usage: {e}")
        return jsonify({"items": [], "count": 0})


@greenlake_bp.route("/api/reporting/top-aps-by-client-count", methods=["GET"])
@require_session
def get_top_aps_by_client_count():
    """Get top access points by connected client count."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        site_id = request.args.get("site_id", request.args.get("site-id"))
        count = request.args.get("count", 10)
        timeframe = request.args.get("timeframe", "1d")

        # Auto-select first site if not provided
        if not site_id:
            try:
                sites = cached_get("/central/v2/sites")
                if isinstance(sites, dict) and sites.get("sites"):
                    site_id = sites["sites"][0].get("site_id") or sites["sites"][0].get("id")
            except Exception as _:
                pass

        params = {"count": count, "timeframe": timeframe}
        if site_id:
            params["site-id"] = site_id

        try:
            response = aruba_client.get(
                "/network-monitoring/v1/top-aps-by-client-count", params=params
            )
            return jsonify(response)
        except Exception:
            try:
                response = aruba_client.get("/reporting/v1/top-aps-by-client-count", params=params)
                return jsonify(response)
            except Exception:
                return jsonify({"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching top APs by client count: {e}")
        return jsonify({"items": [], "count": 0})


@greenlake_bp.route("/api/reporting/network-usage", methods=["GET"])
@require_session
def get_network_usage_report():
    """Get network usage report."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        site_id = request.args.get("site_id", request.args.get("site-id"))
        timeframe = request.args.get("timeframe", "1d")

        # Auto-select first site if not provided
        if not site_id:
            try:
                sites = cached_get("/central/v2/sites")
                if isinstance(sites, dict) and sites.get("sites"):
                    site_id = sites["sites"][0].get("site_id") or sites["sites"][0].get("id")
            except Exception as _:
                pass

        params = {"timeframe": timeframe}
        if site_id:
            params["site-id"] = site_id

        try:
            response = aruba_client.get("/network-monitoring/v1/network-usage", params=params)
            return jsonify(response)
        except Exception:
            try:
                response = aruba_client.get("/reporting/v1/network-usage", params=params)
                return jsonify(response)
            except Exception:
                return jsonify({"series": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching network usage report: {e}")
        return jsonify({"series": [], "count": 0})


@greenlake_bp.route("/api/reporting/device-inventory", methods=["GET"])
@require_session
def get_device_inventory_report():
    """Get device inventory report with detailed statistics."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        # Get all devices
        try:
            devices_response = cached_get("/network-monitoring/v1/devices")
        except Exception:
            try:
                devices_response = aruba_client.get("/reporting/v1/device-inventory")
            except Exception:
                return jsonify({"devices": [], "count": 0})

        if "items" not in devices_response:
            return jsonify({"devices": [], "count": 0})

        devices = devices_response["items"]

        # Aggregate statistics
        inventory = {
            "total_devices": len(devices),
            "by_type": {},
            "by_status": {},
            "by_site": {},
            "by_model": {},
            "devices": devices,
        }

        for device in devices:
            device_type = device.get("deviceType", "Unknown")
            status = device.get("status", "Unknown")
            site = device.get("siteName", "Unassigned")
            model = device.get("model", "Unknown")

            inventory["by_type"][device_type] = inventory["by_type"].get(device_type, 0) + 1
            inventory["by_status"][status] = inventory["by_status"].get(status, 0) + 1
            inventory["by_site"][site] = inventory["by_site"].get(site, 0) + 1
            inventory["by_model"][model] = inventory["by_model"].get(model, 0) + 1

        return jsonify(inventory)
    except Exception as e:
        logger.error(f"Error generating device inventory report: {e}")
        return jsonify({"devices": [], "count": 0})


@greenlake_bp.route("/api/reporting/wireless-health", methods=["GET"])
@require_session
def get_wireless_health_report():
    """Get wireless network health report."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        site_id = request.args.get("site_id", request.args.get("site-id"))

        params = {}
        if site_id:
            params["site-id"] = site_id

        try:
            response = aruba_client.get("/network-monitoring/v1/wireless-health", params=params)
            return jsonify(response)
        except Exception:
            try:
                response = aruba_client.get("/reporting/v1/wireless-health", params=params)
                return jsonify(response)
            except Exception:
                return jsonify({"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching wireless health report: {e}")
        return jsonify({"items": [], "count": 0})


@greenlake_bp.route("/api/reporting/top-ssids-by-usage", methods=["GET"])
@require_session
def get_top_ssids_by_usage():
    """Get top SSIDs by usage."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        site_id = request.args.get("site_id", request.args.get("site-id"))
        count = request.args.get("count", 10)

        params = {"count": count}
        if site_id:
            params["site-id"] = site_id

        try:
            response = aruba_client.get("/network-monitoring/v1/top-ssids-by-usage", params=params)
            return jsonify(response)
        except Exception:
            try:
                response = aruba_client.get("/reporting/v1/top-ssids-by-usage", params=params)
                return jsonify(response)
            except Exception:
                return jsonify({"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching top SSIDs by usage: {e}")
        return jsonify({"items": [], "count": 0})


@greenlake_bp.route("/api/reporting/devices-with-greenlake", methods=["GET"])
@require_session
def get_devices_with_greenlake():
    """Get All Devices enriched with GreenLake device data.

    Fetches devices from Aruba Central monitoring API and enriches with
    additional fields from GreenLake Device Management API by matching
    on serial number. Includes all device types: APs, switches, gateways, etc.

    Returns:
        JSON object with:
        - items: List of device objects with gl_* prefixed GreenLake fields
        - count: Total number of devices
        - gl_matched_count: Number of devices with GreenLake data
        - gl_available: Boolean indicating if GreenLake data was fetched
        - gl_error: Error message if GreenLake enrichment failed (optional)
        - warnings: List of warnings about fallback behavior (optional)

    Notes:
        - Requires active session (X-Session-ID header)
        - Gracefully handles API failures with fallback endpoints
        - Each device has gl_matched boolean indicating GreenLake match status
    """
    import app as _app

    aruba_client = _app.aruba_client
    from requests.exceptions import HTTPError, ConnectionError, Timeout

    try:
        warnings = []

        # Fetch all devices from Aruba Central monitoring API
        # Primary: network-monitoring/v1alpha1/devices, fallback: monitoring/v1/devices
        devices = []
        try:
            # Try network-monitoring v1alpha1 first (preferred)
            devices_response = cached_get("/network-monitoring/v1/devices")
            devices = devices_response.get("items", devices_response.get("devices", []))
            if devices:
                logger.info(
                    f"Fetched {len(devices)} devices from network-monitoring/v1alpha1/devices"
                )
        except (HTTPError, ConnectionError, Timeout) as e:
            logger.warning(f"Primary device API failed, attempting fallback: {e}")
            warnings.append("Primary device API unavailable, using fallback endpoint")
            # Fallback to monitoring/v1 API
            try:
                devices_response = aruba_client.get("/monitoring/v1/devices")
                devices = devices_response.get("items", devices_response.get("devices", []))
                if devices:
                    logger.info(
                        f"Fetched {len(devices)} devices from monitoring/v1/devices (fallback)"
                    )
            except (HTTPError, ConnectionError, Timeout) as e2:
                logger.error(f"Both device APIs failed: primary={e}, fallback={e2}")
                return (
                    jsonify(
                        {
                            "error": "Unable to fetch device inventory from any available API",
                            "details": str(e2),
                            "items": [],
                            "count": 0,
                        }
                    ),
                    503,
                )

        if not devices:
            logger.warning("No devices found from any API endpoint")
            return jsonify({"items": [], "count": 0, "message": "No devices found"})

        # Try to fetch GreenLake devices for enrichment
        gl_devices = {}
        gl_error = None
        try:
            gl_client = _get_greenlake_client()
            if gl_client:
                gl_response = gl_client.get("/devices/v1/devices")
                gl_items = gl_response.get("items", [])
                # Index by serial number for fast lookup
                for gl_device in gl_items:
                    serial = gl_device.get("serialNumber") or gl_device.get("serial")
                    if serial:
                        gl_devices[serial.upper()] = gl_device
                logger.info(f"Fetched {len(gl_devices)} GreenLake devices for enrichment")
            else:
                gl_error = "GreenLake client not configured"
        except (HTTPError, ConnectionError, Timeout) as e:
            logger.warning(f"GreenLake devices not available for enrichment: {e}")
            gl_error = f"GreenLake API unavailable: {str(e)}"

        # Merge device data with GreenLake data
        enriched_devices = []
        gl_matched_count = 0

        for device in devices:
            # Try multiple field names for serial number
            serial = (
                device.get("serial") or device.get("serialNumber") or device.get("device_id") or ""
            )
            serial_upper = serial.upper() if serial else ""

            enriched_device = {
                # Device fields from Aruba Central
                "name": device.get("name"),
                "serial": device.get("serial"),
                "deviceType": device.get("deviceType") or device.get("device_type"),
                "macAddress": device.get("macaddr") or device.get("macAddress"),
                "model": device.get("model"),
                "status": device.get("status"),
                "ipAddress": device.get("ip_address") or device.get("ipAddress"),
                "site": device.get("site") or device.get("siteName"),
                "group": device.get("group") or device.get("groupName"),
                "firmwareVersion": device.get("firmware_version") or device.get("firmwareVersion"),
                "clientCount": device.get("client_count") or device.get("clientCount"),
                "cpuUtilization": device.get("cpu_utilization") or device.get("cpuUtilization"),
                "memoryUtilization": device.get("mem_utilization")
                or device.get("memoryUtilization"),
                "uptime": device.get("uptime"),
                "lastSeen": device.get("last_seen") or device.get("lastSeen"),
                "labels": device.get("labels", []),
            }

            # Enrich with GreenLake data if available
            if serial_upper and serial_upper in gl_devices:
                gl_matched_count += 1
                gl = gl_devices[serial_upper]
                enriched_device["gl_deviceId"] = gl.get("id") or gl.get("deviceId")
                enriched_device["gl_partNumber"] = gl.get("partNumber")
                enriched_device["gl_productId"] = gl.get("productId")
                enriched_device["gl_subscriptionKey"] = gl.get("subscriptionKey")
                enriched_device["gl_subscriptionTier"] = gl.get("subscriptionTier") or gl.get(
                    "tier"
                )
                enriched_device["gl_subscriptionExpiry"] = gl.get(
                    "subscriptionExpiresAt"
                ) or gl.get("expirationDate")
                enriched_device["gl_cloudActivationKey"] = gl.get("cloudActivationKey") or gl.get(
                    "activationKey"
                )
                enriched_device["gl_applicationId"] = gl.get("applicationId") or gl.get("appId")
                enriched_device["gl_applicationName"] = gl.get("applicationName") or gl.get(
                    "appName"
                )
                enriched_device["gl_platformCustomerId"] = gl.get("platformCustomerId")
                enriched_device["gl_createdAt"] = gl.get("createdAt")
                enriched_device["gl_updatedAt"] = gl.get("updatedAt")
                enriched_device["gl_tags"] = gl.get("tags", [])
                enriched_device["gl_matched"] = True
            else:
                enriched_device["gl_matched"] = False

            enriched_devices.append(enriched_device)

        # Sort by name
        enriched_devices.sort(key=lambda x: (x.get("name") or "").lower())

        response = {
            "items": enriched_devices,
            "count": len(enriched_devices),
            "gl_matched_count": gl_matched_count,
            "gl_available": len(gl_devices) > 0,
        }
        # Include optional fields only when relevant
        if gl_error:
            response["gl_error"] = gl_error
        if warnings:
            response["warnings"] = warnings

        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching devices with GreenLake data: {e}")
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────────────────────────────────────
# Grafana integration routes  (lines ~7502–7594 in app.py)
# ─────────────────────────────────────────────────────────────────────────────


@greenlake_bp.route("/api/grafana/health", methods=["GET"])
@require_grafana_key
def grafana_health():
    """Datasource health-check URL — configure in Infinity datasource settings (Agent B)."""
    import app as _app

    aruba_client = _app.aruba_client
    if aruba_client:
        return jsonify({"status": "ok", "aruba_client": True})
    stale_data, stale_ts = _poll_cache_get("kpis")
    if stale_data:
        return (
            jsonify(
                {
                    "status": "degraded",
                    "aruba_client": False,
                    "stale_cache_age_s": int(time.time() - stale_ts),
                }
            ),
            200,
        )
    return jsonify({"status": "unavailable", "aruba_client": False}), 503


@greenlake_bp.route("/api/grafana/kpis", methods=["GET"])
@require_grafana_key
def grafana_kpis():
    """Aggregated KPIs — all key metrics in one call to minimise Aruba API rate usage."""
    import app as _app

    aruba_client = _app.aruba_client

    def fetch():
        result = {}
        try:
            r = cached_get("/network-monitoring/v1/devices")
            items = r.get("items", [])
            total = r.get("count", len(items))
            up = sum(
                1 for d in items if d.get("status", "").upper() in ("UP", "ONLINE", "CONNECTED")
            )
            by_type = {}
            for d in items:
                dt = d.get("deviceType", d.get("type", "Unknown"))
                by_type[dt] = by_type.get(dt, 0) + 1
            result.update(
                total_devices=total,
                devices_up=up,
                devices_down=total - up,
                devices_by_type=[{"type": k, "count": v} for k, v in by_type.items()],
                fleet_health_pct=round(up / total * 100, 2) if total else 0,
            )
        except Exception as e:
            logger.warning(f"Grafana KPI devices: {e}")
            result.update(
                total_devices=0,
                devices_up=0,
                devices_down=0,
                devices_by_type=[],
                fleet_health_pct=0,
            )
        try:
            r = cached_get("/network-monitoring/v1/aps")
            items = r.get("items", [])
            total = r.get("count", len(items))
            up = sum(
                1 for a in items if a.get("status", "").upper() in ("UP", "ONLINE", "CONNECTED")
            )
            result.update(total_aps=total, aps_up=up, aps_down=total - up)
        except Exception as e:
            logger.warning(f"Grafana KPI APs: {e}")
            result.update(total_aps=0, aps_up=0, aps_down=0)
        try:
            r = aruba_client.get("/network-monitoring/v1/clients")
            result["total_clients"] = r.get("count", len(r.get("items", [])))
        except Exception as e:
            logger.warning(f"Grafana KPI clients: {e}")
            result["total_clients"] = 0
        try:
            r = cached_get("/network-monitoring/v1/sites-health")
            sites = r.get("items", r.get("sites", []))
            result["total_sites"] = r.get("count", len(sites))
            result["healthy_sites"] = sum(
                1 for s in sites if _safe_int(s.get("health", s.get("healthScore", 0))) >= 80
            )
        except Exception as e:
            logger.warning(f"Grafana KPI sites: {e}")
            result.update(total_sites=0, healthy_sites=0)
        result["timestamp"] = time.time()
        return result

    return _kpi_with_stale("kpis", fetch)


@greenlake_bp.route("/api/grafana/devices-by-type", methods=["GET"])
@require_grafana_key
def grafana_devices_by_type():
    """Device counts by type — Grafana bar gauge panel. Stale-cache aware."""
    import app as _app

    aruba_client = _app.aruba_client

    def fetch():
        r = cached_get("/network-monitoring/v1/devices")
        by_type = {}
        for d in r.get("items", []):
            dt = d.get("deviceType", d.get("type", "Unknown"))
            by_type[dt] = by_type.get(dt, 0) + 1
        return [{"type": k, "count": v} for k, v in sorted(by_type.items())]

    return _kpi_with_stale("devices-by-type", fetch)


@greenlake_bp.route("/api/grafana/sites-health", methods=["GET"])
@require_grafana_key
def grafana_sites_health():
    """Per-site health scores — Grafana table panel. Stale-cache aware."""
    import app as _app

    aruba_client = _app.aruba_client

    def fetch():
        r = aruba_client.get("/network-monitoring/v1/sites-health")
        sites = r.get("items", r.get("sites", []))
        return [
            {
                "site": s.get("siteName", s.get("name", "Unknown")),
                "health": s.get("health", s.get("healthScore", 0)),
                "devices": s.get("deviceCount", s.get("total_device_count", 0)),
                "clients": s.get("clientCount", s.get("total_client_count", 0)),
            }
            for s in sites
        ]

    return _kpi_with_stale("sites-health", fetch)
