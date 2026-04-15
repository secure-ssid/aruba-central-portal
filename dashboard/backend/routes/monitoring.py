"""
Monitoring Blueprint — extracted from app.py.

Covers:
  - /api/monitoring/network-health
  - /api/explore  (API Explorer)
  - /api/services/health and related service endpoints
  - All /api/monitoring/* prefixed routes
"""

from flask import Blueprint, request, jsonify
import logging
import time
import requests
from .helpers import require_session, api_proxy, cached_get, parallel_get

monitoring_bp = Blueprint("monitoring", __name__)
logger = logging.getLogger(__name__)


# ============= Network Monitoring Endpoints =============


@monitoring_bp.route("/api/monitoring/network-health", methods=["GET"])
@require_session
def get_network_health():
    """Get network health metrics using v1alpha1 API."""
    try:
        # Fetch devices and APs in parallel (both cached 5 min)
        data = parallel_get(
            [
                ("/network-monitoring/v1/devices",),
                ("/network-monitoring/v1/aps",),
            ]
        )

        health_data = {}

        devices = data.get("/network-monitoring/v1/devices")
        if devices:
            health_data["total_devices"] = devices.get("count", 0)
            if "items" in devices:
                health_data["switches"] = sum(
                    1 for d in devices["items"] if d.get("deviceType") == "SWITCH"
                )
            else:
                health_data["switches"] = 0
        else:
            health_data["total_devices"] = 0
            health_data["switches"] = 0

        aps = data.get("/network-monitoring/v1/aps")
        health_data["access_points"] = aps.get("count", 0) if aps else 0

        return jsonify(health_data)
    except Exception as e:
        logger.error(f"Error fetching network health: {e}")
        return jsonify({"error": str(e)}), 500


# ============= API Explorer Endpoint =============


@monitoring_bp.route("/api/explore", methods=["POST"])
@require_session
def api_explorer():
    """
    Generic API explorer endpoint.
    Allows testing any Aruba Central API endpoint.
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        data = request.get_json()
        endpoint = data.get("endpoint", "")
        method = data.get("method", "GET").upper()
        params = data.get("params", {})
        body = data.get("body", {})

        # Sanitize endpoint
        if not endpoint.startswith("/"):
            endpoint = "/" + endpoint

        # Execute request based on method
        try:
            if method == "GET":
                # Log params for debugging filter issues
                if "filter" in params:
                    logger.info(f"🔍 API Explorer: Filter parameter: {params.get('filter')}")
                logger.info(f"🔍 API Explorer: Endpoint={endpoint}, Params={params}")
                response = aruba_client.get(endpoint, params=params)
            elif method == "POST":
                response = aruba_client.post(endpoint, data=body, params=params)
            elif method == "PUT":
                response = aruba_client.put(endpoint, data=body, params=params)
            elif method == "DELETE":
                response = aruba_client.delete(endpoint, params=params)
            else:
                return jsonify({"error": f"Unsupported method: {method}"}), 400

            return jsonify({"success": True, "data": response})
        except Exception as api_err:
            # Return error details to help with debugging
            error_msg = str(api_err)
            status_code = 500

            if "404" in error_msg or "Not Found" in error_msg:
                status_code = 404
                error_msg = f"Endpoint not found: {endpoint}"
            elif "403" in error_msg or "Forbidden" in error_msg:
                status_code = 403
                error_msg = f"Access forbidden: {endpoint}"
            elif "401" in error_msg or "Unauthorized" in error_msg:
                status_code = 401
                error_msg = "Authentication failed"

            return (
                jsonify(
                    {"success": False, "error": error_msg, "endpoint": endpoint, "method": method}
                ),
                status_code,
            )
    except Exception as e:
        logger.error(f"API Explorer error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


# ============= Services Endpoints =============


@monitoring_bp.route("/api/services/health", methods=["GET"])
@require_session
def get_services_health():
    """Get overall service health status."""
    try:
        # Fetch all three in parallel (all cached)
        data = parallel_get(
            [
                ("/network-monitoring/v1/devices",),
                ("/network-monitoring/v1/wlans",),
                ("/central/v2/sites",),
            ]
        )

        health_status = {"overall_status": "healthy", "services": [], "timestamp": time.time()}

        # Device service
        devices = data.get("/network-monitoring/v1/devices")
        if devices is not None:
            health_status["services"].append(
                {
                    "name": "Device Management",
                    "status": "up",
                    "details": f"{devices.get('count', 0)} devices monitored",
                }
            )
        else:
            health_status["services"].append(
                {"name": "Device Management", "status": "error", "details": "Unavailable"}
            )
            health_status["overall_status"] = "degraded"

        # Wireless service
        wlans = data.get("/network-monitoring/v1/wlans")
        if wlans is not None:
            health_status["services"].append(
                {
                    "name": "Wireless Services",
                    "status": "up",
                    "details": f"{wlans.get('count', 0)} WLANs configured",
                }
            )
        else:
            health_status["services"].append(
                {"name": "Wireless Services", "status": "error", "details": "Unavailable"}
            )
            health_status["overall_status"] = "degraded"

        # Site service
        sites = data.get("/central/v2/sites")
        if sites is not None:
            health_status["services"].append(
                {
                    "name": "Site Management",
                    "status": "up",
                    "details": f"{sites.get('total', 0)} sites configured",
                }
            )
        else:
            health_status["services"].append(
                {"name": "Site Management", "status": "error", "details": "Unavailable"}
            )
            health_status["overall_status"] = "degraded"

        return jsonify(health_status)
    except Exception as e:
        logger.error(f"Error fetching services health: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/services/subscriptions", methods=["GET"])
@require_session
def get_service_subscriptions():
    """Get service subscriptions and licenses."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        try:
            response = aruba_client.get("/platform/licensing/v1/subscriptions")
            return jsonify(response)
        except Exception as serr:
            if (
                "404" in str(serr)
                or "400" in str(serr)
                or "Not Found" in str(serr)
                or "Bad Request" in str(serr)
            ):
                logger.warning("Service subscriptions not available; returning empty list")
                return jsonify({"subscriptions": [], "count": 0})
            raise serr
    except Exception as e:
        logger.error(f"Error fetching service subscriptions: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/services/audit-logs", methods=["GET"])
@require_session
def get_service_audit_logs():
    """Get service audit logs."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        limit = request.args.get("limit", 100)
        offset = request.args.get("offset", 0)

        params = {"limit": limit, "offset": offset}

        try:
            response = aruba_client.get("/platform/auditlogs/v1/logs", params=params)
            return jsonify(response)
        except Exception as aerr:
            if (
                "404" in str(aerr)
                or "400" in str(aerr)
                or "Not Found" in str(aerr)
                or "Bad Request" in str(aerr)
            ):
                logger.warning("Audit logs not available; returning empty list")
                return jsonify({"logs": [], "count": 0, "offset": int(offset)})
            raise aerr
    except Exception as e:
        logger.error(f"Error fetching audit logs: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/services/capacity", methods=["GET"])
@require_session
def get_service_capacity():
    """Get service capacity and usage metrics."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        # Get device counts and calculate capacity
        devices = aruba_client.get("/network-monitoring/v1/devices")

        capacity = {
            "devices": {
                "total": devices.get("count", 0),
                "limit": 10000,  # Default limit, adjust based on subscription
                "percentage": 0,
            },
            "timestamp": time.time(),
        }

        if capacity["devices"]["limit"] > 0:
            capacity["devices"]["percentage"] = (
                capacity["devices"]["total"] / capacity["devices"]["limit"]
            ) * 100

        return jsonify(capacity)
    except Exception as e:
        logger.error(f"Error fetching service capacity: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Advanced Monitoring Endpoints =============


# Access Points Monitoring
@monitoring_bp.route("/api/monitoring/aps/top-bandwidth", methods=["GET"])
@require_session
def get_top_aps_bandwidth():
    """Get Access Points with highest wireless bandwidth usage."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("limit"):
            params["limit"] = request.args.get("limit")
        if request.args.get("site_id"):
            params["site_id"] = request.args.get("site_id")

        response = aruba_client.get("/network-monitoring/v1/aps/bandwidth/top", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching top APs by bandwidth: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/aps", methods=["GET"])
@require_session
def get_aps_monitoring():
    """Get list of Access Points with monitoring data."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("site_id"):
            params["site_id"] = request.args.get("site_id")
        if request.args.get("limit"):
            params["limit"] = request.args.get("limit")
        if request.args.get("offset"):
            params["offset"] = request.args.get("offset")

        response = aruba_client.get("/network-monitoring/v1/aps", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching APs monitoring: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/aps/<serial>", methods=["GET"])
@require_session
def get_ap_monitoring_details(serial):
    """Get detailed monitoring information for a specific Access Point."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1/aps/{serial}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching AP monitoring details for {serial}: {e}")
        return jsonify({"error": str(e)}), 500


def _get_utilization_trend(
    device_type, serial, metric, endpoint_path, extra_fields=None, unit=None
):
    """Generic utilization trend fetcher shared by AP and switch metric endpoints.

    Args:
        device_type: 'AP' or 'switch' (used in log/error messages).
        serial: device serial number from the URL path.
        metric: metric name used as the convenience key in each processed sample
                (e.g. 'cpu_utilization', 'memory_utilization', 'power_consumption').
        endpoint_path: full Aruba Central API path.
        extra_fields: optional callable(avg_value) -> dict of additional fields
                      to merge into each processed sample.
        unit: optional unit string (e.g. 'watts') added to the top-level response.
    """
    import app as _app

    aruba_client = _app.aruba_client
    config = _app.config
    try:
        params = {}

        # Support OData filter for timestamp range
        if request.args.get("filter"):
            params["filter"] = request.args.get("filter")

        # Support site-id parameter (hyphen and underscore variants)
        if request.args.get("site-id"):
            params["site-id"] = request.args.get("site-id")
        elif request.args.get("site_id"):
            params["site-id"] = request.args.get("site_id")

        # Legacy support for interval/duration
        if request.args.get("interval"):
            params["interval"] = request.args.get("interval")
        if request.args.get("duration"):
            params["duration"] = request.args.get("duration")

        logger.info(
            f"Fetching {device_type} {metric}: {endpoint_path} for serial: {serial} with params: {params}"
        )

        response = aruba_client.get(endpoint_path, params=params)

        # Process response to ensure 5-minute averages
        if "graph" in response and "samples" in response["graph"]:
            samples = response["graph"]["samples"]
            processed_samples = []

            for sample in samples:
                if "data" in sample and len(sample["data"]) > 0:
                    values = sample["data"]
                    avg_value = sum(values) / len(values) if values else 0

                    processed_sample = {
                        "timestamp": sample.get("timestamp"),
                        "data": [round(avg_value, 2)],
                        metric: round(avg_value, 2),
                    }
                    if extra_fields:
                        processed_sample.update(extra_fields(avg_value))
                    processed_samples.append(processed_sample)
                else:
                    processed_samples.append(sample)

            response["graph"]["samples"] = processed_samples
            response["processed"] = True
            response["interval"] = "5 minutes"
            if unit:
                response["unit"] = unit

        return jsonify(response)
    except Exception as e:
        error_str = str(e)
        logger.error(f"Error fetching {metric} for {device_type} {serial}: {error_str}")

        error_response = {
            "error": f"Failed to fetch {metric.replace('_', ' ')}",
            "message": error_str,
            "endpoint": endpoint_path,
            "base_url": config["aruba_central"]["base_url"] if config else "Not configured",
        }

        if "404" in error_str or "Not Found" in error_str:
            error_response["suggestion"] = (
                f"Verify the serial number and that the {device_type} exists in your Central account"
            )
            return jsonify(error_response), 404
        elif "401" in error_str or "Unauthorized" in error_str:
            error_response["suggestion"] = (
                "Authentication failed. Please check your credentials and token."
            )
            return jsonify(error_response), 401
        elif "403" in error_str or "Forbidden" in error_str:
            error_response["suggestion"] = "Access forbidden. Check API permissions."
            return jsonify(error_response), 403

        return jsonify(error_response), 500


@monitoring_bp.route("/api/monitoring/aps/<serial>/cpu", methods=["GET"])
@require_session
def get_ap_cpu_utilization(serial):
    """Get CPU utilization information for an Access Point."""
    return _get_utilization_trend(
        device_type="AP",
        serial=serial,
        metric="cpu_utilization",
        endpoint_path=f"/network-monitoring/v1/aps/{serial}/cpu-utilization-trends",
    )


@monitoring_bp.route("/api/monitoring/aps/<serial>/memory", methods=["GET"])
@require_session
def get_ap_memory_utilization(serial):
    """Get memory utilization information for an Access Point."""
    return _get_utilization_trend(
        device_type="AP",
        serial=serial,
        metric="memory_utilization",
        endpoint_path=f"/network-monitoring/v1/aps/{serial}/memory-utilization-trends",
    )


@monitoring_bp.route("/api/monitoring/aps/<serial>/temperature", methods=["GET"])
@require_session
def get_ap_temperature(serial):
    """Get hardware temperature information for an Access Point.

    NOTE: This endpoint path is inferred from existing patterns (cpu-utilization-trends, memory-utilization-trends).
    The actual Aruba Central API endpoint may differ. If this returns 404, the endpoint may not be available
    or may use a different path. Please verify with Aruba Central API documentation or test via API Explorer.
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("interval"):
            params["interval"] = request.args.get("interval")
        if request.args.get("duration"):
            params["duration"] = request.args.get("duration")

        # Try the inferred endpoint path
        response = aruba_client.get(
            f"/network-monitoring/v1/aps/{serial}/hardware-temperature-trends", params=params
        )
        return jsonify(response)
    except Exception as e:
        error_str = str(e)
        logger.error(f"Error fetching temperature for AP {serial}: {error_str}")
        # Return helpful error message if endpoint doesn't exist
        if "404" in error_str or "Not Found" in error_str:
            return (
                jsonify(
                    {
                        "error": "Temperature endpoint not found",
                        "message": "The hardware-temperature-trends endpoint may not be available in the Aruba Central API. Please verify the correct endpoint path.",
                        "suggestion": "Try using the API Explorer to test available endpoints, or check the device details endpoint which may include temperature data.",
                    }
                ),
                404,
            )
        return jsonify({"error": error_str}), 500


@monitoring_bp.route("/api/monitoring/aps/<serial>/throughput", methods=["GET"])
@require_session
def get_ap_throughput_trend(serial):
    """Get throughput trend for an Access Point."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("interval"):
            params["interval"] = request.args.get("interval")
        if request.args.get("duration"):
            params["duration"] = request.args.get("duration")

        response = aruba_client.get(
            f"/network-monitoring/v1/aps/{serial}/throughput", params=params
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching throughput for AP {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/aps/<serial>/radios", methods=["GET"])
@require_session
def get_ap_radios(serial):
    """Get list of radios for an Access Point."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1/aps/{serial}/radios")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching radios for AP {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/aps/<serial>/radios/<radio_id>/channel-util", methods=["GET"])
@require_session
def get_radio_channel_utilization(serial, radio_id):
    """Get channel utilization information for an AP radio."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("interval"):
            params["interval"] = request.args.get("interval")
        if request.args.get("duration"):
            params["duration"] = request.args.get("duration")

        response = aruba_client.get(
            f"/network-monitoring/v1/aps/{serial}/radios/{radio_id}/channel-utilization",
            params=params,
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching channel utilization for radio {radio_id}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/aps/<serial>/ports", methods=["GET"])
@require_session
def get_ap_ports(serial):
    """Get list of ports for an Access Point."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1/aps/{serial}/ports")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching ports for AP {serial}: {e}")
        return jsonify({"error": str(e)}), 500


# WLANs Monitoring
@monitoring_bp.route("/api/monitoring/wlans", methods=["GET"])
@require_session
def get_wlans_monitoring():
    """Get list of WLANs with monitoring data."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("site_id"):
            params["site_id"] = request.args.get("site_id")

        response = aruba_client.get("/network-monitoring/v1/wlans", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching WLANs monitoring: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/wlans/<wlan_name>/throughput", methods=["GET"])
@require_session
def get_wlan_throughput(wlan_name):
    """Get throughput trend for a WLAN."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("interval"):
            params["interval"] = request.args.get("interval")
        if request.args.get("duration"):
            params["duration"] = request.args.get("duration")

        response = aruba_client.get(
            f"/network-monitoring/v1/wlans/{wlan_name}/throughput", params=params
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching throughput for WLAN {wlan_name}: {e}")
        return jsonify({"error": str(e)}), 500


# Switch Monitoring
@monitoring_bp.route("/api/monitoring/switches", methods=["GET"])
@require_session
def get_switches_monitoring():
    """Get list of switches with monitoring data."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        # Normalize site id key expected by upstream API
        site_id = request.args.get("site_id", request.args.get("site-id"))
        if site_id:
            params["site-id"] = site_id
        # Optional timeframe passthrough (e.g., 1h, 1d, 7d)
        if request.args.get("timeframe"):
            params["timeframe"] = request.args.get("timeframe")
        if request.args.get("limit"):
            params["limit"] = request.args.get("limit")

        response = aruba_client.get("/network-monitoring/v1/switches", params=params)
        return jsonify(response)
    except Exception as e:
        # Gracefully handle 400/404 as empty list
        try:
            from requests.exceptions import HTTPError

            if (
                isinstance(e, HTTPError)
                and getattr(e, "response", None) is not None
                and e.response.status_code in (400, 404)
            ):
                logger.warning(
                    f"Switches monitoring returned {e.response.status_code}; returning empty result"
                )
                return jsonify({"count": 0, "items": []})
        except Exception:
            pass
        logger.error(f"Error fetching switches monitoring: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/switches/<serial>", methods=["GET"])
@require_session
def get_switch_monitoring_details(serial):
    """Get detailed monitoring information for a specific switch."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1/switches/{serial}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching switch monitoring details for {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/switches/<serial>/cpu", methods=["GET"])
@require_session
def get_switch_cpu_utilization(serial):
    """Get CPU utilization information for a Switch."""
    return _get_utilization_trend(
        device_type="switch",
        serial=serial,
        metric="cpu_utilization",
        endpoint_path=f"/network-monitoring/v1/switches/{serial}/cpu-utilization-trends",
    )


@monitoring_bp.route("/api/monitoring/switches/<serial>/memory", methods=["GET"])
@require_session
def get_switch_memory_utilization(serial):
    """Get memory utilization information for a Switch."""
    return _get_utilization_trend(
        device_type="switch",
        serial=serial,
        metric="memory_utilization",
        endpoint_path=f"/network-monitoring/v1/switches/{serial}/memory-utilization-trends",
    )


@monitoring_bp.route("/api/monitoring/switches/<serial>/power", methods=["GET"])
@require_session
def get_switch_power_consumption(serial):
    """Get power consumption information for a Switch."""
    return _get_utilization_trend(
        device_type="switch",
        serial=serial,
        metric="power_consumption",
        endpoint_path=f"/network-monitoring/v1/switches/{serial}/power-consumption-trends",
        extra_fields=lambda avg: {"power_consumption_watts": round(avg, 2)},
        unit="watts",
    )


@monitoring_bp.route("/api/monitoring/switches/<serial>/temperature", methods=["GET"])
@require_session
def get_switch_temperature(serial):
    """Get hardware temperature information for a switch.

    NOTE: This endpoint path is inferred from existing patterns. The actual Aruba Central API endpoint may differ.
    If this returns 404, the endpoint may not be available or may use a different path. Temperature data may also
    be available in the switch details endpoint.
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("interval"):
            params["interval"] = request.args.get("interval")
        if request.args.get("duration"):
            params["duration"] = request.args.get("duration")

        # Try the inferred endpoint path
        response = aruba_client.get(
            f"/network-monitoring/v1/switches/{serial}/hardware-temperature-trends", params=params
        )
        return jsonify(response)
    except Exception as e:
        error_str = str(e)
        logger.error(f"Error fetching temperature for switch {serial}: {error_str}")
        # Return helpful error message if endpoint doesn't exist
        if "404" in error_str or "Not Found" in error_str:
            return (
                jsonify(
                    {
                        "error": "Temperature endpoint not found",
                        "message": "The hardware-temperature-trends endpoint may not be available for switches. Temperature data may be included in the switch details endpoint.",
                        "suggestion": "Try GET /api/monitoring/switches/{serial} which may include temperature in the response.",
                    }
                ),
                404,
            )
        return jsonify({"error": error_str}), 500


@monitoring_bp.route("/api/monitoring/switches/<serial>/ports", methods=["GET"])
@require_session
def get_switch_ports_monitoring(serial):
    """Get monitoring data for switch ports."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1/switches/{serial}/ports")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching ports for switch {serial}: {e}")
        return jsonify({"error": str(e)}), 500


# Gateway Monitoring
@monitoring_bp.route("/api/monitoring/gateways", methods=["GET"])
@require_session
def get_gateways_monitoring():
    """Get list of gateways with monitoring data."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("site_id"):
            params["site_id"] = request.args.get("site_id")

        response = aruba_client.get("/network-monitoring/v1/gateways", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching gateways monitoring: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/gateways/<serial>", methods=["GET"])
@require_session
def get_gateway_monitoring_details(serial):
    """Get detailed monitoring information for a specific gateway."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1/gateways/{serial}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching gateway monitoring details for {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/gateways/<serial>/tunnels", methods=["GET"])
@require_session
def get_gateway_tunnels(serial):
    """Get tunnel information for a gateway."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1/gateways/{serial}/tunnels")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching tunnels for gateway {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/gateways/<serial>/temperature", methods=["GET"])
@require_session
def get_gateway_temperature(serial):
    """Get hardware temperature information for a gateway.

    NOTE: This endpoint path is inferred from existing patterns. The actual Aruba Central API endpoint may differ.
    According to some documentation, gateways may have hardware-temperature-trends endpoints, but this needs verification.
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("interval"):
            params["interval"] = request.args.get("interval")
        if request.args.get("duration"):
            params["duration"] = request.args.get("duration")

        # Try the inferred endpoint path
        response = aruba_client.get(
            f"/network-monitoring/v1/gateways/{serial}/hardware-temperature-trends", params=params
        )
        return jsonify(response)
    except Exception as e:
        error_str = str(e)
        logger.error(f"Error fetching temperature for gateway {serial}: {error_str}")
        # Return helpful error message if endpoint doesn't exist
        if "404" in error_str or "Not Found" in error_str:
            return (
                jsonify(
                    {
                        "error": "Temperature endpoint not found",
                        "message": "The hardware-temperature-trends endpoint may not be available for gateways, or may use a different path.",
                        "suggestion": "Check the gateway details endpoint or verify the correct endpoint path in Aruba Central API documentation.",
                    }
                ),
                404,
            )
        return jsonify({"error": error_str}), 500


@monitoring_bp.route("/api/monitoring/gateways/<serial>/vlans", methods=["GET"])
@require_session
def get_gateway_vlans(serial):
    """Get VLANs configured on a gateway.

    This endpoint is used to fetch available VLANs for tunnel mode WLAN configuration.
    Only VLANs that exist on the gateway can be used for L2 tunnel mode WLANs.

    Uses the correct API endpoint: /network-config/v1alpha1/layer2-vlan (singular)
    Response format: {"l2-vlan": [{"vlan-id": 200, "vlan-name": "Corporate", ...}, ...]}
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        # Use the correct endpoint - singular 'layer2-vlan'
        logger.info(f"Fetching VLANs for gateway {serial} using layer2-vlan endpoint")
        response = aruba_client.get("/network-config/v1alpha1/layer2-vlan")

        # Debug: Log the raw response to see actual structure
        logger.info(f"Raw API response: {response}")

        # The response has format: {"l2-vlan": [...]}
        if "l2-vlan" in response:
            # Debug: Log first VLAN object to see field names
            if len(response["l2-vlan"]) > 0:
                logger.info(f"Sample VLAN object: {response['l2-vlan'][0]}")

            # Transform to frontend-expected format
            vlans = []
            for vlan in response["l2-vlan"]:
                # The API returns 'vlan' (not 'vlan-id') and 'name'
                vlan_id = vlan.get("vlan")
                vlan_name = vlan.get("name", f"VLAN {vlan_id}" if vlan_id else "Unknown")

                vlans.append({"id": vlan_id, "name": vlan_name})
            logger.info(f"Successfully fetched {len(vlans)} VLANs: {[v['id'] for v in vlans]}")
            return jsonify({"vlans": vlans})
        else:
            logger.warning("Unexpected response format - no 'l2-vlan' key found")
            return jsonify({"vlans": []})

    except Exception as e:
        error_str = str(e)
        logger.error(f"Error fetching VLANs: {error_str}")
        return (
            jsonify(
                {
                    "error": "Unable to fetch gateway VLANs",
                    "message": error_str,
                    "vlans": [],  # Return empty array so wizard doesn't break
                }
            ),
            500,
        )


# Device Monitoring (Generic)
@monitoring_bp.route("/api/monitoring/devices", methods=["GET"])
@require_session
def get_devices_monitoring():
    """Get monitoring data for all devices."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("site_id"):
            params["site_id"] = request.args.get("site_id")
        if request.args.get("device_type"):
            params["device_type"] = request.args.get("device_type")

        response = aruba_client.get("/network-monitoring/v1/devices", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching devices monitoring: {e}")
        return jsonify({"error": str(e)}), 500


# Client Monitoring
@monitoring_bp.route("/api/monitoring/clients/<mac>/session", methods=["GET"])
@require_session
def get_client_session_details(mac):
    """Get detailed session information for a client."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1/clients/{mac}/session")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching session for client {mac}: {e}")
        return jsonify({"error": str(e)}), 500


# Firewall Sessions
@monitoring_bp.route("/api/monitoring/firewall/sessions", methods=["GET"])
@require_session
def get_firewall_sessions():
    """Get firewall session information."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("gateway_serial"):
            params["gateway_serial"] = request.args.get("gateway_serial")
        if request.args.get("limit"):
            params["limit"] = request.args.get("limit")

        response = aruba_client.get("/network-monitoring/v1/firewall/sessions", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching firewall sessions: {e}")
        return jsonify({"error": str(e)}), 500


# IDPS (Intrusion Detection/Prevention)
@monitoring_bp.route("/api/monitoring/idps/events", methods=["GET"])
@require_session
def get_idps_events():
    """Get IDPS (Intrusion Detection/Prevention System) events."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("gateway_serial"):
            params["gateway_serial"] = request.args.get("gateway_serial")
        if request.args.get("severity"):
            params["severity"] = request.args.get("severity")
        if request.args.get("limit"):
            params["limit"] = request.args.get("limit")

        response = aruba_client.get("/network-monitoring/v1/idps/events", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching IDPS events: {e}")
        return jsonify({"error": str(e)}), 500


# Application Visibility
@monitoring_bp.route("/api/monitoring/applications", methods=["GET"])
@require_session
def get_applications_monitoring():
    """Get application visibility data from network monitoring API."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        # Normalize site id key expected by upstream API
        site_id = request.args.get("site_id", request.args.get("site-id"))
        if site_id:
            params["site-id"] = site_id
        # Optional timeframe passthrough (e.g., 1h, 1d, 7d)
        if request.args.get("timeframe"):
            params["timeframe"] = request.args.get("timeframe")
        if request.args.get("limit"):
            params["limit"] = request.args.get("limit")

        response = aruba_client.get("/network-monitoring/v1/applications", params=params)
        return jsonify(response)
    except Exception as e:
        # If upstream provided HTTP details, pass through status and message for easier debugging
        try:
            if isinstance(e, requests.HTTPError) and e.response is not None:
                status = e.response.status_code
                text = e.response.text or ""
                logger.error(f"Upstream error applications: {status} {text[:300]}")
                # Try to forward JSON if present
                try:
                    return jsonify(e.response.json()), status
                except Exception:
                    return jsonify({"error": text}), status
        except Exception:
            pass
        logger.error(f"Error fetching application visibility: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/applications/top", methods=["GET"])
@require_session
def get_top_applications():
    """Get top applications by bandwidth usage."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        # Normalize site id key expected by upstream API
        site_id = request.args.get("site_id", request.args.get("site-id"))
        if site_id:
            params["site-id"] = site_id
        # Optional timeframe passthrough (e.g., 1h, 1d, 7d)
        if request.args.get("timeframe"):
            params["timeframe"] = request.args.get("timeframe")
        limit = 10
        if request.args.get("limit"):
            try:
                limit = int(request.args.get("limit", 10))
            except Exception:
                limit = 10

        # Derive top applications from the generic applications API

        # Fallback logic
        try:
            apps_response = aruba_client.get("/network-monitoring/v1/applications", params=params)
        except Exception as apps_err:
            try:
                from requests.exceptions import HTTPError

                if (
                    isinstance(apps_err, HTTPError)
                    and getattr(apps_err, "response", None) is not None
                    and apps_err.response.status_code in (400, 404)
                ):
                    logger.warning(
                        f"Applications endpoint unavailable/invalid params (status {apps_err.response.status_code}); returning empty list"
                    )
                    return jsonify({"count": 0, "items": []})
            except Exception:
                pass
            raise apps_err

        # Extract list safely
        if isinstance(apps_response, dict):
            app_list = apps_response.get("applications") or apps_response.get("items") or []
        elif isinstance(apps_response, list):
            app_list = apps_response
        else:
            app_list = []

        def app_metric(app: dict) -> float:
            # Try common fields; default to 0 if missing or non-numeric
            candidates = [
                app.get("total_bytes"),
                app.get("bytes"),
                app.get("usage_bytes"),
                app.get("bandwidth_bps"),
            ]
            numeric = [c for c in candidates if isinstance(c, (int, float))]
            return max(numeric) if numeric else 0.0

        # Sort and slice
        sorted_apps = sorted(app_list, key=app_metric, reverse=True)[:limit]
        return jsonify({"count": len(sorted_apps), "items": sorted_apps})
    except Exception as e:
        # If upstream provided HTTP details, pass through status and message for easier debugging
        try:
            if isinstance(e, requests.HTTPError) and e.response is not None:
                status = e.response.status_code
                text = e.response.text or ""
                logger.error(f"Upstream error applications/top: {status} {text[:300]}")
                try:
                    return jsonify(e.response.json()), status
                except Exception:
                    return jsonify({"error": text}), status
        except Exception:
            pass
        logger.error(f"Error fetching top applications: {e}")
        return jsonify({"error": str(e)}), 500


# Swarms (AP Groups)
@monitoring_bp.route("/api/monitoring/swarms", methods=["GET"])
@require_session
def get_swarms():
    """Get list of swarms (AP groups)."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("site_id"):
            params["site_id"] = request.args.get("site_id")

        response = aruba_client.get("/network-monitoring/v1/swarms", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching swarms: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/swarms/<swarm_id>", methods=["GET"])
@require_session
def get_swarm_details(swarm_id):
    """Get detailed information for a specific swarm."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1/swarms/{swarm_id}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching swarm details for {swarm_id}: {e}")
        return jsonify({"error": str(e)}), 500


# --- Gateway Extended Monitoring ---


@monitoring_bp.route("/api/monitoring/gateways/<serial>/uplinks", methods=["GET"])
@require_session
def get_gateway_uplinks(serial):
    """Get WAN uplinks for a gateway.

    Endpoint: /network-monitoring/v1/gateways/{serial-number}/uplinks
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(f"/network-monitoring/v1/gateways/{serial}/uplinks", params=params)
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching uplinks for gateway {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route(
    "/api/monitoring/gateways/<serial>/uplinks/<link_tag>/throughput", methods=["GET"]
)
@require_session
def get_gateway_uplink_throughput(serial, link_tag):
    """Get throughput trends for a specific gateway uplink.

    Endpoint: /network-monitoring/v1/gateways/{serial-number}/uplinks/{link-tag}/throughput-trends
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1/gateways/{serial}/uplinks/{link_tag}/throughput-trends",
            params=params,
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching uplink throughput for gateway {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route(
    "/api/monitoring/gateways/<serial>/uplinks/<link_tag>/wan-availability", methods=["GET"]
)
@require_session
def get_gateway_uplink_wan_availability(serial, link_tag):
    """Get WAN availability trends for a specific gateway uplink.

    Endpoint: /network-monitoring/v1/gateways/{serial-number}/uplinks/{link-tag}/wan-availability-trends
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1/gateways/{serial}/uplinks/{link_tag}/wan-availability-trends",
            params=params,
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching WAN availability for gateway {serial} uplink {link_tag}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/gateways/<serial>/wan-availability", methods=["GET"])
@require_session
def get_gateway_wan_availability(serial):
    """Get WAN availability trends for a gateway (all uplinks aggregated).

    Endpoint: /network-monitoring/v1/gateways/{serial-number}/wan-availability-trends
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1/gateways/{serial}/wan-availability-trends", params=params
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching WAN availability trends for gateway {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/gateways/<serial>/wan-tunnels-health", methods=["GET"])
@require_session
def get_gateway_wan_tunnels_health(serial):
    """Get WAN tunnel health summary for a gateway.

    Endpoint: /network-monitoring/v1/gateways/{serial-number}/wan-tunnels-health-summary
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1/gateways/{serial}/wan-tunnels-health-summary", params=params
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching WAN tunnels health for gateway {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/gateways/<serial>/lan-tunnels-health", methods=["GET"])
@require_session
def get_gateway_lan_tunnels_health(serial):
    """Get LAN tunnel health summary for a gateway.

    Endpoint: /network-monitoring/v1/gateways/{serial-number}/lan-tunnels-health-summary
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1/gateways/{serial}/lan-tunnels-health-summary", params=params
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching LAN tunnels health for gateway {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/gateways/<serial>/cpu", methods=["GET"])
@require_session
def get_gateway_cpu_utilization(serial):
    """Get CPU utilization trends for a gateway.

    Endpoint: /network-monitoring/v1/gateways/{serial-number}/cpu-utilization-trends
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1/gateways/{serial}/cpu-utilization-trends", params=params
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching CPU utilization for gateway {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/gateways/<serial>/ports", methods=["GET"])
@require_session
def get_gateway_ports(serial):
    """Get port information for a gateway.

    Endpoint: /network-monitoring/v1/gateways/{serial-number}/ports
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(f"/network-monitoring/v1/gateways/{serial}/ports", params=params)
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching ports for gateway {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/gateways/<serial>/ports/<port_number>", methods=["GET"])
@require_session
def get_gateway_port_details(serial, port_number):
    """Get details for a specific gateway port.

    Endpoint: /network-monitoring/v1/gateways/{serial-number}/ports/{port-number}
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1/gateways/{serial}/ports/{port_number}", params=params
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching port {port_number} for gateway {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route(
    "/api/monitoring/gateways/<serial>/ports/<port_number>/throughput", methods=["GET"]
)
@require_session
def get_gateway_port_throughput(serial, port_number):
    """Get throughput trends for a specific gateway port.

    Endpoint: /network-monitoring/v1/gateways/{serial-number}/ports/{port-number}/throughput-trends
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1/gateways/{serial}/ports/{port_number}/throughput-trends",
            params=params,
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching port throughput for gateway {serial} port {port_number}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route(
    "/api/monitoring/gateways/<serial>/tunnel/<tunnel_name>/throughput", methods=["GET"]
)
@require_session
def get_gateway_tunnel_throughput(serial, tunnel_name):
    """Get throughput trends for a specific gateway tunnel.

    Endpoint: /network-monitoring/v1/gateways/{serial-number}/tunnels/{tunnel-name}/throughput-trends
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1/gateways/{serial}/tunnels/{tunnel_name}/throughput-trends",
            params=params,
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching tunnel throughput for gateway {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@monitoring_bp.route("/api/monitoring/gateways/<serial>/wan-interfaces", methods=["GET"])
@require_session
def get_gw_wan_interfaces(serial):
    """Get gateway WAN interface details."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        response = aruba_client.get(
            f"/network-monitoring/v1alpha1/gateways/{serial}/wan-interfaces"
        )
        return jsonify(response if response else [])
    except Exception as e:
        logger.error(f"Error fetching WAN interfaces for gateway {serial}: {e}")
        return jsonify({"error": "Failed to fetch WAN interfaces"}), 500


@monitoring_bp.route("/api/monitoring/gateways/<serial>/wan-tunnels", methods=["GET"])
@require_session
def get_gw_wan_tunnels(serial):
    """Get gateway WAN tunnel details."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        response = aruba_client.get(f"/network-monitoring/v1alpha1/gateways/{serial}/wan-tunnels")
        return jsonify(response if response else [])
    except Exception as e:
        logger.error(f"Error fetching WAN tunnels for gateway {serial}: {e}")
        return jsonify({"error": "Failed to fetch WAN tunnels"}), 500
