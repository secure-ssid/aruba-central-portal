"""
Events Blueprint — per-device / per-site / per-client event logs.

Wraps the Aruba New-Central Network Troubleshooting event API:
  GET /network-troubleshooting/v1/events
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timezone, timedelta
import logging
import json

from utils.central_api_client import CentralAPIError
from .helpers import require_session

events_bp = Blueprint("events", __name__)
logger = logging.getLogger(__name__)

# Module-level flag: log the raw schema sample only once per process lifetime.
_SCHEMA_SAMPLE_LOGGED = False

_VALID_CONTEXT_TYPES = {
    "SITE",
    "ACCESS_POINT",
    "SWITCH",
    "GATEWAY",
    "WIRELESS_CLIENT",
    "WIRED_CLIENT",
    "BRIDGE",
}


def _rfc3339_ms(dt: datetime) -> str:
    """RFC 3339 UTC with millisecond precision, e.g. 2026-04-16T12:34:56.789Z."""
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def _fetch_events(context_type: str, context_identifier: str, site_id: str):
    """Shared fetch + normalization logic for all three routes."""
    global _SCHEMA_SAMPLE_LOGGED
    import app as _app

    aruba_client = _app.aruba_client

    if context_type not in _VALID_CONTEXT_TYPES:
        return jsonify({"error": f"invalid context-type: {context_type}"}), 400
    if not site_id:
        return jsonify({"error": "site_id query parameter is required"}), 400
    if not context_identifier:
        return jsonify({"error": "context-identifier is required"}), 400

    # Time window
    try:
        hours = int(request.args.get("hours", 24))
    except (TypeError, ValueError):
        hours = 24
    hours = max(1, min(hours, 720))  # cap at 30 days

    try:
        limit = int(request.args.get("limit", 100))
    except (TypeError, ValueError):
        limit = 100
    limit = max(1, min(limit, 1000))

    end_dt = datetime.now(timezone.utc)
    start_dt = end_dt - timedelta(hours=hours)

    params = {
        "context-type": context_type,
        "context-identifier": context_identifier,
        "site-id": site_id,
        "start-at": _rfc3339_ms(start_dt),
        "end-at": _rfc3339_ms(end_dt),
        "limit": limit,
    }

    # Note: upstream validates sort field; timestamp is NOT supported.
    # Only pass sort if explicitly provided by caller.
    sort_val = request.args.get("sort")
    if sort_val and sort_val.strip() and sort_val.lower() != "none":
        params["sort"] = sort_val

    if request.args.get("search"):
        params["search"] = request.args.get("search")
    if request.args.get("filter"):
        params["filter"] = request.args.get("filter")
    if request.args.get("next"):
        params["next"] = request.args.get("next")

    try:
        resp = aruba_client.get("/network-troubleshooting/v1/events", params=params)

        # Log the raw schema sample once per process lifetime.
        if not _SCHEMA_SAMPLE_LOGGED:
            try:
                logger.info("events schema sample: %s", json.dumps(resp)[:2000])
            except Exception as log_err:
                logger.info("events schema sample (unserializable): %r  err=%s",
                            str(resp)[:2000], log_err)
            _SCHEMA_SAMPLE_LOGGED = True

        # Normalize response — schema is undocumented. Try common shapes.
        if isinstance(resp, dict):
            event_list = (
                resp.get("events")
                or resp.get("items")
                or resp.get("result")
                or resp.get("data")
                or []
            )
            next_cursor = resp.get("next") or resp.get("nextCursor") or resp.get("next-cursor")
        elif isinstance(resp, list):
            event_list = resp
            next_cursor = None
        else:
            event_list = []
            next_cursor = None

        return jsonify({
            "events": event_list,
            "next": next_cursor,
            "total": len(event_list),
        })

    except CentralAPIError as e:
        logger.error(
            "Events API error: HTTP %s code=%s msg=%s params=%s",
            e.status_code, e.error_code, e.message, params,
        )
        return jsonify({
            "error": "upstream events API error",
            "status": e.status_code,
            "code": e.error_code,
            "message": e.message,
        }), 502
    except Exception as e:
        logger.error("Unexpected error fetching events: %s params=%s", e, params)
        return jsonify({"error": str(e)}), 502


@events_bp.route("/api/devices/<serial>/events", methods=["GET"])
@require_session
def get_device_events(serial):
    """Get event log for a specific device (AP/SWITCH/GATEWAY)."""
    ctype = request.args.get("type", "ACCESS_POINT").upper()
    site_id = request.args.get("site_id") or request.args.get("site-id")
    return _fetch_events(ctype, serial, site_id)


@events_bp.route("/api/sites/<site_id>/events", methods=["GET"])
@require_session
def get_site_events(site_id):
    """Get event log scoped to a site."""
    return _fetch_events("SITE", site_id, site_id)


@events_bp.route("/api/clients/<mac>/events", methods=["GET"])
@require_session
def get_client_events(mac):
    """Get event log for a specific client (wireless or wired)."""
    ctype = request.args.get("type", "WIRELESS_CLIENT").upper()
    if ctype not in ("WIRELESS_CLIENT", "WIRED_CLIENT"):
        return jsonify({"error": "type must be WIRELESS_CLIENT or WIRED_CLIENT"}), 400
    site_id = request.args.get("site_id") or request.args.get("site-id")
    return _fetch_events(ctype, mac, site_id)
