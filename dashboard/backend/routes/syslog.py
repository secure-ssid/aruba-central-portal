"""
Syslog Blueprint — local-network syslog ingest browser.

This does NOT talk to Aruba Central. Devices on the LAN (configured via
Central to log to this container's IP) send syslog here; these routes
expose the stored events to the dashboard.

Phase 1: read-only listing, stats, and a test-ingest endpoint for local
smoke tests. Phases 2+ will add /incidents and /alerts.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify, request

from pipeline.syslog import get_store  # type: ignore
from pipeline.syslog.parser import parse_syslog  # type: ignore

from .helpers import rate_limit, require_session

logger = logging.getLogger(__name__)

syslog_bp = Blueprint("syslog", __name__, url_prefix="/api/syslog")


@syslog_bp.route("/health", methods=["GET"])
@rate_limit(max_requests=120, window_seconds=60)
def syslog_health():
    """Cheap liveness probe for the syslog pipeline."""
    store = get_store()
    stats = store.stats(window=timedelta(minutes=5))
    return jsonify({
        "status": "ok",
        "db_path": str(store.db_path),
        "events_last_5m": stats["total"],
    })


@syslog_bp.route("/events", methods=["GET"])
@require_session
@rate_limit(max_requests=120, window_seconds=60)
def list_events():
    """Paginated event list. Query params: limit, offset, since (hours),
    severity_max, device_serial, event_code, search."""
    args = request.args
    try:
        limit = min(int(args.get("limit", 100)), 500)
        offset = max(int(args.get("offset", 0)), 0)
    except ValueError:
        return jsonify({"error": "limit/offset must be integers"}), 400

    since = None
    if "since_hours" in args:
        try:
            since = datetime.now(timezone.utc) - timedelta(hours=float(args["since_hours"]))
        except ValueError:
            return jsonify({"error": "since_hours must be numeric"}), 400

    severity_max = None
    if "severity_max" in args:
        try:
            severity_max = int(args["severity_max"])
        except ValueError:
            return jsonify({"error": "severity_max must be integer 0..7"}), 400

    store = get_store()
    events = store.list_events(
        limit=limit,
        offset=offset,
        since=since,
        severity_max=severity_max,
        device_serial=args.get("device_serial"),
        event_code=args.get("event_code"),
        search=args.get("search"),
    )
    total = store.count_events(since=since, severity_max=severity_max)
    return jsonify({
        "items": [e.to_dict() for e in events],
        "count": len(events),
        "total": total,
        "limit": limit,
        "offset": offset,
    })


@syslog_bp.route("/stats", methods=["GET"])
@require_session
@rate_limit(max_requests=60, window_seconds=60)
def stats():
    """Rollup counters for the dashboard widget."""
    try:
        hours = float(request.args.get("window_hours", 24))
    except ValueError:
        return jsonify({"error": "window_hours must be numeric"}), 400
    window = timedelta(hours=max(min(hours, 168), 0.083))  # 5 min .. 7 days
    return jsonify(get_store().stats(window=window))


@syslog_bp.route("/test-ingest", methods=["POST"])
@require_session
@rate_limit(max_requests=30, window_seconds=60)
def test_ingest():
    """
    Inject a syslog line for local smoke testing. Body: {"line": "<...>"}.
    Skips the network path so we can exercise parse+store without a device.
    """
    body = request.get_json(silent=True) or {}
    line = body.get("line")
    if not isinstance(line, str) or not line.strip():
        return jsonify({"error": "body must contain non-empty 'line' string"}), 400

    parsed = parse_syslog(line)
    store = get_store()
    event_id = store.insert_event(
        received_at=datetime.now(timezone.utc),
        event_time=parsed.event_time,
        source_ip=request.remote_addr or "test",
        transport="test",
        facility=parsed.facility,
        severity=parsed.severity,
        hostname=parsed.hostname,
        app_name=parsed.app_name,
        proc_id=parsed.proc_id,
        msg_id=parsed.msg_id,
        device_serial=parsed.device_serial,
        device_name=parsed.device_name,
        event_code=parsed.event_code,
        message=parsed.message,
        raw=parsed.raw,
        structured_data=parsed.structured_data,
    )
    return jsonify({"id": event_id, "format": parsed.format})
