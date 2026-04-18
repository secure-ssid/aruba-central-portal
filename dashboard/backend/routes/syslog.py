"""
Syslog Blueprint — local-network syslog ingest browser.

This does NOT talk to Aruba Central. Devices on the LAN (configured via
Central to log to this container's IP) send syslog here; these routes
expose the stored events + derived incidents to the dashboard.

Phase 1: events, stats, test-ingest.
Phase 2: incidents (rule-clustered groups of events) + on-demand run.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify, request

from pipeline.syslog import get_store  # type: ignore
from pipeline.syslog.clusterer import cluster_once  # type: ignore
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


# ─────────────────────── incidents (phase 2) ──────────────────

@syslog_bp.route("/incidents", methods=["GET"])
@require_session
@rate_limit(max_requests=120, window_seconds=60)
def list_incidents():
    """List clustered incidents. Filters: status, since_hours, severity_max."""
    args = request.args
    try:
        limit = min(int(args.get("limit", 50)), 200)
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

    status = args.get("status")
    if status and status not in ("open", "ack", "resolved"):
        return jsonify({"error": "status must be open|ack|resolved"}), 400

    anomaly_min = None
    if "anomaly_min" in args:
        try:
            anomaly_min = float(args["anomaly_min"])
        except ValueError:
            return jsonify({"error": "anomaly_min must be numeric"}), 400

    order_by = args.get("order_by", "last_seen")
    if order_by not in ("last_seen", "first_seen", "anomaly_score", "severity"):
        return jsonify({"error": "order_by must be last_seen|first_seen|anomaly_score|severity"}), 400

    return jsonify({
        "items": get_store().list_incidents(
            limit=limit, offset=offset, status=status,
            since=since, severity_max=severity_max,
            anomaly_min=anomaly_min, order_by=order_by,
        ),
        "limit": limit,
        "offset": offset,
    })


@syslog_bp.route("/incidents/<int:incident_id>", methods=["GET"])
@require_session
@rate_limit(max_requests=120, window_seconds=60)
def get_incident(incident_id: int):
    """Single incident + its constituent events."""
    store = get_store()
    incident = store.get_incident(incident_id)
    if not incident:
        return jsonify({"error": "incident not found"}), 404
    return jsonify({
        "incident": incident,
        "events": [e.to_dict() for e in store.incident_events(incident_id)],
    })


@syslog_bp.route("/incidents/<int:incident_id>/status", methods=["POST"])
@require_session
@rate_limit(max_requests=60, window_seconds=60)
def set_incident_status(incident_id: int):
    """Transition an incident: open → ack → resolved."""
    body = request.get_json(silent=True) or {}
    status = body.get("status")
    if status not in ("open", "ack", "resolved"):
        return jsonify({"error": "status must be open|ack|resolved"}), 400
    ok = get_store().update_incident_status(incident_id, status)
    if not ok:
        return jsonify({"error": "incident not found"}), 404
    return jsonify({"id": incident_id, "status": status})


@syslog_bp.route("/incidents/<int:incident_id>", methods=["DELETE"])
@require_session
@rate_limit(max_requests=60, window_seconds=60)
def delete_incident(incident_id: int):
    """Hard-delete an incident and its alert. Raw events are preserved."""
    ok = get_store().delete_incident(incident_id)
    if not ok:
        return jsonify({"error": "incident not found"}), 404
    return jsonify({"id": incident_id, "deleted": True})


@syslog_bp.route("/cluster/run", methods=["POST"])
@require_session
@rate_limit(max_requests=6, window_seconds=60)
def run_cluster_now():
    """Force a clusterer tick. Useful for tests and the dashboard 'refresh'."""
    result = cluster_once(get_store())
    return jsonify({
        "processed": result.processed,
        "incidents_touched": result.incidents_touched,
        "new_incidents": result.new_incidents,
    })


# ─────────────────────── alerts (phase 4+) ────────────────────

@syslog_bp.route("/alerts", methods=["GET"])
@require_session
@rate_limit(max_requests=120, window_seconds=60)
def list_alerts():
    """List generated alerts (human summaries of high-anomaly incidents)."""
    args = request.args
    try:
        limit = min(int(args.get("limit", 50)), 200)
        offset = max(int(args.get("offset", 0)), 0)
    except ValueError:
        return jsonify({"error": "limit/offset must be integers"}), 400

    approved_only = args.get("approved_only", "").lower() in ("1", "true", "yes")
    since = None
    if "since_hours" in args:
        try:
            since = datetime.now(timezone.utc) - timedelta(hours=float(args["since_hours"]))
        except ValueError:
            return jsonify({"error": "since_hours must be numeric"}), 400

    return jsonify({
        "items": get_store().list_alerts(
            limit=limit, offset=offset, approved_only=approved_only, since=since,
        ),
        "limit": limit,
        "offset": offset,
    })


@syslog_bp.route("/incidents/<int:incident_id>/alert", methods=["GET"])
@require_session
@rate_limit(max_requests=120, window_seconds=60)
def get_incident_alert(incident_id: int):
    alert = get_store().get_alert_by_incident(incident_id)
    if not alert:
        return jsonify({"error": "no alert for this incident"}), 404
    return jsonify(alert)
