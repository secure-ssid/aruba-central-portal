"""
Device Management Blueprint

Covers:
  - /api/devices (list + detail)
  - /api/switches (list + detail sub-routes)
  - /api/aps (list + detail sub-routes)
  - /api/stacks
  - /api/device-parameters
  - Device Information Endpoints (Configuration API)
"""

from pathlib import Path
from datetime import datetime, timedelta

from flask import Blueprint, request, jsonify
import logging

from .helpers import (
    require_session,
    api_proxy,
    cached_get,
    cached_get_paginated,
    parallel_get,
    monitoring_list_items,
)

devices_bp = Blueprint("devices", __name__)
logger = logging.getLogger(__name__)


# ============= Device Management Endpoints =============


@devices_bp.route("/api/devices", methods=["GET"])
@require_session
def get_devices():
    """Get all devices with auto-pagination for large deployments."""
    try:
        params = request.args.to_dict()
        response = cached_get_paginated(
            "/network-monitoring/v1alpha1/devices",
            params=params,
            max_pages=10,
            page_size=100,
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Devices: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/devices/<serial>", methods=["GET"])
@require_session
def get_device_details(serial):
    """Get device by serial with current CPU, memory, and temperature if available."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            logger.error(f"Aruba client not initialized when fetching device {serial}")
            return (
                jsonify({"error": "Server not configured. Please configure credentials first."}),
                500,
            )

        # Direct lookup instead of fetching ALL devices and scanning
        try:
            device = aruba_client.get(f"/network-monitoring/v1alpha1/devices/{serial}")
        except Exception:
            # Fallback: search in cached device list if direct endpoint fails
            r = cached_get("/network-monitoring/v1alpha1/devices")
            device = None
            for d in monitoring_list_items(r):
                if d.get("serial") == serial or d.get("serialNumber") == serial:
                    device = d.copy()
                    break
            if not device:
                return jsonify({"error": f"Device {serial} not found"}), 404

        if isinstance(device, dict) and "serial" not in device and "items" in device:
            # API returned a list wrapper — unwrap
            items = device.get("items", [])
            device = items[0] if items else None
            if not device:
                return jsonify({"error": f"Device {serial} not found"}), 404

        device = dict(device)  # ensure mutable copy
        device_type = device.get("deviceType", "").upper() or device.get("type", "").upper()
        logger.info(f"Fetching device details for {serial}, type: {device_type}")

        is_ap = (
            device_type in ["AP", "IAP", "ACCESS_POINT", "ACCESS POINT"]
            or "ap" in device.get("deviceType", "").lower()
            or "ap" in device.get("type", "").lower()
        )

        if is_ap:
            logger.info(
                f"Device {serial} identified as AP, fetching utilization metrics in parallel"
            )

            def _fetch_utilization(endpoint_path):
                """Try up to 3 filter strategies; return (response, True) on success."""
                attempts = [
                    {},
                    {
                        "filter": f"timestamp gt '{(datetime.utcnow() - timedelta(hours=1)).strftime('%Y-%m-%dT%H:%M:%SZ')}'"
                    },
                    {
                        "filter": f"timestamp gt '{(datetime.utcnow() - timedelta(hours=24)).strftime('%Y-%m-%dT%H:%M:%SZ')}'"
                    },
                ]
                for params in attempts:
                    try:
                        resp = aruba_client.get(endpoint_path, params=params if params else None)
                        if (
                            "graph" in resp
                            and "samples" in resp["graph"]
                            and resp["graph"]["samples"]
                        ):
                            return resp
                    except Exception:
                        continue
                return None

            # ── Parallelize the 3 independent metric fetches ──
            from concurrent.futures import ThreadPoolExecutor

            metrics = {
                "cpu": f"/network-monitoring/v1alpha1/aps/{serial}/cpu-utilization-trends",
                "mem": f"/network-monitoring/v1alpha1/aps/{serial}/memory-utilization-trends",
                "power": f"/network-monitoring/v1alpha1/aps/{serial}/power-consumption-trends",
            }
            with ThreadPoolExecutor(max_workers=3) as pool:
                futures = {key: pool.submit(_fetch_utilization, ep) for key, ep in metrics.items()}
                results = {key: fut.result() for key, fut in futures.items()}

            def _extract_latest(response, device_key):
                if not response:
                    return
                samples = response.get("graph", {}).get("samples", [])
                if not samples:
                    return
                latest = samples[-1]
                if "data" not in latest or not latest["data"]:
                    return
                # Filter out None values that Central sometimes returns in trend series
                clean = [v for v in latest["data"] if isinstance(v, (int, float))]
                if not clean:
                    return
                avg_value = round(sum(clean) / len(clean), 2)
                if "power" in device_key.lower():
                    device[device_key] = f"{avg_value}W"
                    device["power_consumption"] = avg_value
                    device["power_consumption_watts"] = avg_value
                else:
                    device[device_key] = f"{avg_value}%"
                    if "cpu" in device_key.lower():
                        device["cpu_utilization"] = avg_value
                        device["cpu_utilization_percent"] = avg_value
                    elif "mem" in device_key.lower():
                        device["memory_utilization"] = avg_value
                        device["memory_utilization_percent"] = avg_value
                        device["memoryUsage"] = f"{avg_value}%"

            _extract_latest(results["cpu"], "cpuUtilization")
            _extract_latest(results["mem"], "memUtilization")
            _extract_latest(results["power"], "powerConsumption")
        else:
            logger.info(
                f"Device {serial} is not an AP (type: {device_type}), skipping utilization metrics"
            )

        # Ensure fields exist for frontend compatibility
        for field in ("cpuUtilization", "memUtilization", "powerConsumption", "temperature"):
            device.setdefault(field, None)

        return jsonify(device)
    except Exception as e:
        logger.error(f"Device {serial}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/switches/<serial>/details", methods=["GET"])
@require_session
@api_proxy(lambda serial: f"/network-monitoring/v1alpha1/switch/{serial}", error_msg="Switch details")
def get_switch_details(serial):
    pass


@devices_bp.route("/api/switches/<serial>/hardware", methods=["GET"])
@require_session
@api_proxy(
    lambda serial: f"/network-monitoring/v1alpha1/switch/{serial}/hardware-categories",
    error_msg="Switch hardware",
)
def get_switch_hardware(serial):
    pass


@devices_bp.route("/api/switches/<serial>/lag", methods=["GET"])
@require_session
@api_proxy(lambda serial: f"/network-monitoring/v1alpha1/switch/{serial}/lag", error_msg="Switch LAG")
def get_switch_lag(serial):
    pass


@devices_bp.route("/api/switches/<serial>/interfaces", methods=["GET"])
@require_session
@api_proxy(
    lambda serial: f"/network-monitoring/v1alpha1/switch/{serial}/interfaces",
    error_msg="Switch interfaces",
)
def get_switch_interfaces(serial):
    pass


@devices_bp.route("/api/switches/<serial>/show-command", methods=["POST"])
@require_session
def run_switch_show_command(serial):
    """Run a 'show' command on a CX switch and return task ID.

    Reference: https://developer.arubanetworks.com/new-central/reference/runcxshowcommand
    Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/showCommand
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        command = data.get("command", "")

        if not command.startswith("show "):
            return jsonify({"error": "Command must start with 'show '"}), 400

        response = aruba_client.post(
            f"/network-troubleshooting/v1alpha1/cx/{serial}/showCommand", data={"command": command}
        )
        logger.info(f"Show command response for {serial}: {response}")
        # Handle different response formats - taskId might be in different fields
        if isinstance(response, dict):
            # Check for common task ID field names
            if "taskId" not in response and "task_id" not in response:
                # Try to find task ID in nested structures
                if "data" in response and isinstance(response["data"], dict):
                    task_id = response["data"].get("taskId") or response["data"].get("task_id")
                    if task_id:
                        response["taskId"] = task_id
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error running show command on switch {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/switches/<serial>/show-command/<task_id>", methods=["GET"])
@require_session
def get_switch_show_command_result(serial, task_id):
    """Get the result of a 'show' command execution on a CX switch.

    Reference: https://developer.arubanetworks.com/new-central/reference/runcxshowcommand
    Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/showCommand/async-operations/{task-id}
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(
            f"/network-troubleshooting/v1alpha1/cx/{serial}/showCommand/async-operations/{task_id}"
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error getting show command result for switch {serial}, task {task_id}: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/switches/<serial>/vlans", methods=["GET"])
@require_session
@api_proxy(
    lambda serial: f"/network-monitoring/v1alpha1/switch/{serial}/vlans", error_msg="Switch VLANs"
)
def get_switch_vlans(serial):
    pass


@devices_bp.route("/api/stacks/<stack_id>/members", methods=["GET"])
@require_session
@api_proxy(
    lambda stack_id: f"/network-monitoring/v1alpha1/stack/{stack_id}/members", error_msg="Stack members"
)
def get_stack_members(stack_id):
    pass


@devices_bp.route("/api/device-parameters", methods=["GET"])
@require_session
@api_proxy("/network-config/v1alpha1/device-parameters", error_msg="Device parameters")
def get_device_parameters():
    pass


@devices_bp.route("/api/device-parameters/<platform_model>", methods=["GET"])
@require_session
@api_proxy(
    lambda platform_model: f"/network-config/v1alpha1/device-parameters/{platform_model}",
    error_msg="Device parameters by model",
)
def get_device_parameters_by_model(platform_model):
    pass


@devices_bp.route("/api/aps/<serial>/details", methods=["GET"])
@require_session
@api_proxy(lambda serial: f"/network-monitoring/v1alpha1/aps/{serial}", error_msg="AP details")
def get_ap_details(serial):
    pass


@devices_bp.route("/api/aps/<serial>/power-consumption", methods=["GET"])
@require_session
@api_proxy(
    lambda serial: f"/network-monitoring/v1alpha1/aps/{serial}/power-consumption-trends",
    error_msg="AP power consumption",
)
def get_ap_power_consumption(serial):
    pass


@devices_bp.route("/api/switches", methods=["GET"])
@require_session
def get_switches():
    """Get all switches with auto-pagination for large deployments."""
    try:
        params = request.args.to_dict()
        response = cached_get_paginated(
            "/network-monitoring/v1alpha1/switches",
            params=params,
            max_pages=10,
            page_size=100,
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Switches: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/aps", methods=["GET"])
@require_session
def get_access_points():
    """Get all access points with auto-pagination for large deployments."""
    try:
        params = request.args.to_dict()
        response = cached_get_paginated(
            "/network-monitoring/v1alpha1/aps",
            params=params,
            max_pages=10,
            page_size=100,
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"APs: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


# ============= Device Information Endpoints (Configuration API) =============


@devices_bp.route("/api/devices/<serial>/info", methods=["GET"])
@require_session
def get_device_info(serial):
    """Get device information from New Central monitoring API.

    Tries AP endpoint first, falls back to switch endpoint.
    The old /configuration/v1/device-info paths are Classic Central and do not exist in New Central.
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        try:
            response = aruba_client.get(f"/network-monitoring/v1alpha1/aps/{serial}")
            return jsonify(response)
        except Exception:
            try:
                response = aruba_client.get(f"/network-monitoring/v1alpha1/switch/{serial}")
                return jsonify(response)
            except Exception as e2:
                logger.warning(f"Device info not found for {serial}: {e2}")
                return jsonify({"error": f"Device {serial} not found in monitoring API"}), 404
    except Exception as e:
        logger.error(f"Error fetching device info for {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/devices/upload-image", methods=["POST"])
@require_session
def upload_device_image():
    """Upload and save a device image with background removed."""
    try:
        logger.info(
            f"Upload request received. Files: {list(request.files.keys())}, Form data: {list(request.form.keys())}"
        )

        if "image" not in request.files:
            logger.error("No 'image' key in request.files")
            return jsonify({"error": "No image file provided"}), 400

        file = request.files["image"]
        part_number = request.form.get("partNumber")

        logger.info(
            f"File received: {file.filename}, Part number: {part_number}, Content type: {file.content_type}"
        )

        if not part_number:
            return jsonify({"error": "Part number is required"}), 400

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            logger.warning(f"Invalid content type: {file.content_type}")
            return jsonify({"error": f"File must be an image. Received: {file.content_type}"}), 400

        # Create devices directory if it doesn't exist
        # Path resolution: backend/routes/devices.py -> backend -> dashboard -> frontend/public/images/devices
        backend_dir = Path(__file__).parent.parent
        devices_dir = backend_dir.parent / "frontend" / "public" / "images" / "devices"

        logger.info(f"Devices directory path: {devices_dir}")

        # Create directory if it doesn't exist
        try:
            devices_dir.mkdir(parents=True, exist_ok=True)
            logger.info(f"Directory created/verified: {devices_dir}")
        except Exception as dir_error:
            logger.error(f"Error creating directory: {dir_error}")
            return jsonify({"error": f"Failed to create directory: {str(dir_error)}"}), 500

        # Determine file extension from uploaded file
        # If it's already PNG, keep it; otherwise convert to PNG
        original_ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "png"
        # Always save as PNG for consistency (background removal outputs PNG)
        filename = f"{part_number}.png"
        filepath = devices_dir / filename

        logger.info(f"Saving file to: {filepath}")

        # Save the file
        try:
            file.save(str(filepath))
            logger.info(f"File saved successfully: {filename}")
        except Exception as save_error:
            logger.error(f"Error saving file: {save_error}")
            return jsonify({"error": f"Failed to save file: {str(save_error)}"}), 500

        # Verify file was saved
        if not filepath.exists():
            logger.error(f"File was not saved: {filepath}")
            return jsonify({"error": "File was not saved successfully"}), 500

        return jsonify(
            {
                "success": True,
                "message": f"Image uploaded successfully as {filename}",
                "filename": filename,
            }
        )
    except Exception as e:
        logger.error(f"Error uploading device image: {e}", exc_info=True)
        return jsonify({"error": str(e), "type": type(e).__name__}), 500


@devices_bp.route("/api/devices/<serial>/system-info", methods=["GET"])
@require_session
def get_device_system_info(serial):
    """Get system information from New Central monitoring API.

    /configuration/v1/system-info does not exist in New Central.
    Falls back to the monitoring AP or switch endpoint.
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        try:
            response = aruba_client.get(f"/network-monitoring/v1alpha1/aps/{serial}")
            return jsonify(response)
        except Exception:
            try:
                response = aruba_client.get(f"/network-monitoring/v1alpha1/switch/{serial}")
                return jsonify(response)
            except Exception as e2:
                logger.warning(f"System info not found for {serial}: {e2}")
                return jsonify({"error": f"Device {serial} not found"}), 404
    except Exception as e:
        logger.error(f"Error fetching system info for {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/aps/<serial>/system", methods=["GET"])
@require_session
def get_ap_system(serial):
    """Get AP details from New Central monitoring API.

    /configuration/v1/ap-system does not exist in New Central.
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1alpha1/aps/{serial}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching AP system info for {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/switches/<serial>/system", methods=["GET"])
@require_session
def get_switch_system(serial):
    """Get switch details from New Central monitoring API.

    /configuration/v1/switch-system does not exist in New Central.
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1alpha1/switch/{serial}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching switch system info for {serial}: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Additional Device Endpoints (lines ~9661+) =============


@devices_bp.route("/api/devices/<serial>/ports", methods=["GET"])
@require_session
def get_switch_ports(serial):
    """Get port/interface status for a switch using v1 switches interfaces endpoint."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        response = aruba_client.get(
            f"/network-monitoring/v1alpha1/switch/{serial}/interfaces", params=params
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching ports for {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/devices/<serial>/radio", methods=["GET"])
@require_session
def get_ap_radio(serial):
    """Get AP radio details using v1 aps radios endpoint."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        response = aruba_client.get(f"/network-monitoring/v1alpha1/aps/{serial}/radios", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching radio details for {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/devices/<serial>/health", methods=["GET"])
@require_session
def get_device_health(serial):
    """Get device health metrics from v1 devices endpoint."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1alpha1/devices/{serial}")
        # Also try to pull cpu/memory trend data
        health = {
            "device": response,
            "serial": serial,
        }
        # For APs, enrich with cpu and memory trends
        device_type = response.get("deviceType", "")
        if device_type == "ACCESS_POINT":
            try:
                cpu = aruba_client.get(
                    f"/network-monitoring/v1alpha1/aps/{serial}/cpu-utilization-trends"
                )
                health["cpuTrends"] = cpu
            except Exception:
                pass
            try:
                mem = aruba_client.get(
                    f"/network-monitoring/v1alpha1/aps/{serial}/memory-utilization-trends"
                )
                health["memoryTrends"] = mem
            except Exception:
                pass
        return jsonify(health)
    except Exception as e:
        logger.error(f"Error fetching device health for {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/aps/<serial>/radios", methods=["GET"])
@require_session
def get_ap_radios_v2(serial):
    """Get radios for a specific AP.

    Endpoint: /network-monitoring/v1alpha1/aps/{serial-number}/radios
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(f"/network-monitoring/v1alpha1/aps/{serial}/radios", params=params)
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching radios for AP {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/aps/<serial>/radios/<int:radio_number>/throughput", methods=["GET"])
@require_session
def get_ap_radio_throughput(serial, radio_number):
    """Get throughput trends for a specific AP radio.

    Endpoint: /network-monitoring/v1alpha1/aps/{serial-number}/radios/{radio-number}/throughput-trends
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1alpha1/aps/{serial}/radios/{radio_number}/throughput-trends",
            params=params,
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching radio throughput for AP {serial} radio {radio_number}: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route(
    "/api/aps/<serial>/radios/<int:radio_number>/channel-utilization", methods=["GET"]
)
@require_session
def get_ap_radio_channel_utilization(serial, radio_number):
    """Get channel utilization trends for a specific AP radio.

    Endpoint: /network-monitoring/v1alpha1/aps/{serial-number}/radios/{radio-number}/channel-utilization-trends
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1alpha1/aps/{serial}/radios/{radio_number}/channel-utilization-trends",
            params=params,
        )
        return jsonify(r)
    except Exception as e:
        logger.error(
            f"Error fetching channel utilization for AP {serial} radio {radio_number}: {e}"
        )
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/aps/<serial>/radios/<int:radio_number>/channel-quality", methods=["GET"])
@require_session
def get_ap_radio_channel_quality(serial, radio_number):
    """Get channel quality trends for a specific AP radio.

    Endpoint: /network-monitoring/v1alpha1/aps/{serial-number}/radios/{radio-number}/channel-quality-trends
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1alpha1/aps/{serial}/radios/{radio_number}/channel-quality-trends",
            params=params,
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching channel quality for AP {serial} radio {radio_number}: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/aps/<serial>/radios/<int:radio_number>/noise-floor", methods=["GET"])
@require_session
def get_ap_radio_noise_floor(serial, radio_number):
    """Get noise floor trends for a specific AP radio.

    Endpoint: /network-monitoring/v1alpha1/aps/{serial-number}/radios/{radio-number}/noise-floor-trends
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(
            f"/network-monitoring/v1alpha1/aps/{serial}/radios/{radio_number}/noise-floor-trends",
            params=params,
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching noise floor for AP {serial} radio {radio_number}: {e}")
        return jsonify({"error": str(e)}), 500


@devices_bp.route("/api/aps/<serial>/throughput", methods=["GET"])
@require_session
def get_ap_throughput_trends(serial):
    """Get wireless throughput trends for an AP.

    Endpoint: /network-monitoring/v1alpha1/aps/{serial-number}/throughput-trends?interface-type=WIRELESS
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        if "interface-type" not in params:
            params["interface-type"] = "WIRELESS"
        r = aruba_client.get(
            f"/network-monitoring/v1alpha1/aps/{serial}/throughput-trends", params=params
        )
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching throughput trends for AP {serial}: {e}")
        return jsonify({"error": str(e)}), 500
