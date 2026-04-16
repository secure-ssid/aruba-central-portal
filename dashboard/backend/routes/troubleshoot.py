"""
Blueprint: troubleshoot
Covers:
  - /api/wlans/...             (Wireless/WLAN endpoints)
  - /api/templates             (Template endpoint)
  - /api/troubleshoot/...      (Troubleshooting endpoints — CX, APs, Gateways)
  - /api/firmware/...          (Firmware management endpoints)
  - /api/cluster/info          (Cluster/region info)
  - /api/webhooks/...          (Webhook ingest)
  - /api/stream/events         (SSE streaming)
"""

from flask import Blueprint, request, jsonify, Response, stream_with_context
import logging
import re
import time
import hmac
import hashlib
import json
import queue
import os
import urllib.parse
import requests

from .helpers import require_session, api_proxy

troubleshoot_bp = Blueprint('troubleshoot', __name__)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Async polling helpers (local copies so the blueprint is self-contained)
# ---------------------------------------------------------------------------

def _poll_async_operation(device_serial, tool_path, post_data, operation_name,
                          max_wait=30, poll_interval=1):
    """
    Generic async troubleshooting poll-wait helper.

    1. POST to ``tool_path`` (already includes the device serial) to initiate
       the operation.
    2. Extract the task-id from the ``location`` field in the response.
    3. Poll ``<tool_path>/async-operations/<task_id>`` until COMPLETED, FAILED,
       or timeout.
    4. Return a tuple ``(response_dict, status_code)`` suitable for
       ``jsonify(response_dict), status_code``.
    """
    import app as _app
    aruba_client = _app.aruba_client

    # Step 1 - Initiate
    response = aruba_client.post(tool_path, data=post_data)

    # Step 2 - Extract task id from location header/field
    location = response.get('location', '')
    task_id_match = re.search(r'/async-operations/([a-f0-9\-]+)', location)
    if not task_id_match:
        # If the response already contains a completed result, return it.
        if response.get('status') == 'COMPLETED':
            return response, 200
        if 'output' in response and response.get('status') == 'COMPLETED':
            return response, 200
        return {"error": "Could not extract task ID from response", "response": response}, 500

    task_id = task_id_match.group(1)
    status_url = f'{tool_path}/async-operations/{task_id}'

    # Step 3 - Poll
    start_time = time.time()
    max_attempts = int(max_wait / poll_interval) + 1
    async_response = None

    for _ in range(max_attempts):
        if time.time() - start_time > max_wait:
            return {
                "error": f"{operation_name} operation timed out",
                "status": "TIMEOUT",
                "task_id": task_id,
            }, 504

        async_response = aruba_client.get(status_url)
        status = async_response.get('status', 'UNKNOWN')

        if status == 'COMPLETED':
            return async_response, 200
        elif status == 'FAILED':
            fail_reason = async_response.get('failReason', 'Unknown error')
            return {
                "error": f"{operation_name} operation failed: {fail_reason}",
                "status": "FAILED",
                "task_id": task_id,
                "response": async_response,
            }, 500
        else:
            # INITIATED, IN_PROGRESS, or unknown — keep polling
            time.sleep(poll_interval)

    # Exhausted all attempts
    return {
        "error": f"{operation_name} operation did not complete within expected time",
        "status": "TIMEOUT",
        "task_id": task_id,
        "last_response": async_response,
    }, 504


def _poll_aoss_operation(device_serial, tool_path, post_data, status_path_template,
                         operation_name, max_wait=30, poll_interval=1,
                         completed_statuses=('COMPLETED', 'SUCCESS'),
                         fail_reason_key='reason'):
    """
    Poll-wait helper for AOS-S style endpoints that return ``test_id``
    instead of a location header.
    """
    import app as _app
    aruba_client = _app.aruba_client

    response = aruba_client.post(tool_path, data=post_data)

    test_id = response.get('test_id')
    if not test_id:
        return {"error": "Could not extract test ID from AOS-S response"}, 500

    status_url = status_path_template.format(test_id=test_id)

    start_time = time.time()
    max_attempts = int(max_wait / poll_interval) + 1
    async_response = None

    for _ in range(max_attempts):
        if time.time() - start_time > max_wait:
            return {
                "error": f"{operation_name} operation timed out",
                "status": "TIMEOUT",
                "test_id": test_id,
            }, 504

        async_response = aruba_client.get(status_url)
        status = async_response.get('status', 'UNKNOWN')

        if status in completed_statuses:
            return async_response, 200
        elif status == 'FAILED':
            fail_reason = async_response.get(fail_reason_key, 'Unknown error')
            return {
                "error": f"{operation_name} operation failed: {fail_reason}",
                "status": "FAILED",
                "test_id": test_id,
            }, 500
        else:
            time.sleep(poll_interval)

    return {
        "error": f"{operation_name} operation did not complete within expected time",
        "status": "TIMEOUT",
        "test_id": test_id,
    }, 504


# ============= Wireless/WLAN Endpoints =============

@troubleshoot_bp.route('/api/wlans', methods=['GET'])
@require_session
def get_wlans():
    """Get all WLANs with full configuration using network-config API.

    Uses /network-config/v1alpha1/wlan-ssids which returns comprehensive
    configuration data for all WLANs in a single call, including:
    - SSID name, description, enabled status
    - Forward mode (bridge/tunnel), RF band, VLAN settings
    - Security settings, 802.11k/r/v, captive portal
    - High-throughput, WMM, and advanced radio settings
    """
    import app as _app
    aruba_client = _app.aruba_client

    try:
        response = aruba_client.get('/network-config/v1alpha1/wlan-ssids')

        # Transform response to a consistent format for frontend
        wlans = []
        wlan_list = response.get('wlan-ssid', [])

        def to_bool(value):
            """Convert API value to boolean - handles bool, string, or None."""
            if isinstance(value, bool):
                return value
            if isinstance(value, str):
                return value.lower() == 'true'
            return False

        for wlan in wlan_list:
            # Extract key fields into a flattened structure for easy display
            essid = wlan.get('essid', {})
            transformed = {
                # Basic info
                'ssid': wlan.get('ssid') or essid.get('name', 'Unknown'),
                'essidName': essid.get('name', ''),
                'essidAlias': essid.get('alias', ''),
                'description': wlan.get('description', ''),
                'enabled': to_bool(wlan.get('enable', False)),

                # Network settings
                'forwardMode': wlan.get('forward-mode', 'FORWARD_MODE_BRIDGE'),
                'rfBand': wlan.get('rf-band', ''),
                'hideSsid': to_bool(wlan.get('hide-ssid', False)),

                # VLAN settings
                'vlanSelector': wlan.get('vlan-selector', ''),
                'vlanName': wlan.get('vlan-name', ''),
                'vlanIdRange': wlan.get('vlan-id-range', []),

                # Security
                'opmode': wlan.get('opmode', ''),
                'macAuthentication': to_bool(wlan.get('mac-authentication', False)),
                'captivePortalType': wlan.get('captive-portal-type', ''),
                'captivePortal': wlan.get('captive-portal', ''),
                'wpa3TransitionMode': to_bool(wlan.get('wpa3-transition-mode-enable', False)),
                'mfpCapable': to_bool(wlan.get('mfp-capable', False)),
                'mfpRequired': to_bool(wlan.get('mfp-required', False)),

                # 802.11 standards
                'dot11k': to_bool(wlan.get('dot11k', False)),
                'dot11r': to_bool(wlan.get('dot11r', False)),
                'dot11v': to_bool(wlan.get('dot11v', False)),

                # Client settings
                'maxClientsThreshold': wlan.get('max-clients-threshold', '64'),
                'inactivityTimeout': wlan.get('inactivity-timeout', '1000'),
                'clientIsolation': to_bool(wlan.get('client-isolation', False)),
                'denyInterUserBridging': to_bool(wlan.get('deny-inter-user-bridging', False)),

                # Advanced
                'bandwidthLimit': wlan.get('bandwidth-limit', ''),
                'contentFiltering': to_bool(wlan.get('content-filtering', False)),
                'enforceDhcp': to_bool(wlan.get('enforce-dhcp', False)),

                # Keep raw config for detailed view/export
                '_rawConfig': wlan
            }
            wlans.append(transformed)

        return jsonify({
            'wlans': wlans,
            'count': len(wlans),
            'metadata': response.get('metadata', {})
        })
    except Exception as e:
        logger.error(f"Error fetching WLANs: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/wlans/<ssid_name>', methods=['GET'])
@require_session
def get_wlan_details(ssid_name):
    """Get WLAN details by SSID name."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        response = aruba_client.get(f'/configuration/v1/wlan/{ssid_name}')
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching WLAN {ssid_name}: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/wlans', methods=['POST'])
@require_session
def create_wlan():
    """Create a new WLAN."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        data = request.get_json()
        response = aruba_client.post('/configuration/v1/wlan', data=data)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error creating WLAN: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/wlans/<ssid_name>', methods=['DELETE'])
@require_session
def delete_wlan(ssid_name):
    """Delete a WLAN."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        response = aruba_client.delete(f'/configuration/v1/wlan/{ssid_name}')
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error deleting WLAN {ssid_name}: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Templates Endpoint =============

@troubleshoot_bp.route('/api/templates', methods=['GET'])
@require_session
@api_proxy('/configuration/v1/templates', error_msg="Templates", fallback_data={"templates": [], "count": 0, "total": 0})
def get_templates(): pass


# ============= Troubleshooting Endpoints =============

@troubleshoot_bp.route('/api/troubleshoot/ping', methods=['POST'])
@require_session
def troubleshoot_ping():
    """Execute ping test from device using async API.

    Reference: https://developer.arubanetworks.com/new-central/reference/ping
    Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/ping
    """
    try:
        data = request.get_json()
        device_serial = data.get('device_serial')
        target = data.get('target')

        if not device_serial or not target:
            return jsonify({"error": "device_serial and target are required"}), 400

        try:
            result, status_code = _poll_async_operation(
                device_serial,
                f'/network-troubleshooting/v1alpha1/cx/{device_serial}/ping',
                {"destination": target},
                "Ping",
                max_wait=30, poll_interval=1,
            )
            return jsonify(result), status_code
        except Exception as terr:
            if '400' in str(terr) or '404' in str(terr) or 'Not Found' in str(terr) or 'Bad Request' in str(terr):
                return jsonify({"status": "unavailable", "result": None})
            raise terr
    except Exception as e:
        logger.error(f"Ping troubleshooting error: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/traceroute', methods=['POST'])
@require_session
def troubleshoot_traceroute():
    """Execute traceroute test from CX switch using async API.

    Reference: https://developer.arubanetworks.com/new-central/reference/initiatecxtraceroute
    Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/traceroute
    """
    try:
        data = request.get_json()
        device_serial = data.get('device_serial')
        target = data.get('target')

        if not device_serial or not target:
            return jsonify({"error": "device_serial and target are required"}), 400

        try:
            result, status_code = _poll_async_operation(
                device_serial,
                f'/network-troubleshooting/v1alpha1/cx/{device_serial}/traceroute',
                {"destination": target},
                "Traceroute",
                max_wait=60, poll_interval=1,
            )
            return jsonify(result), status_code
        except Exception as terr:
            if '400' in str(terr) or '404' in str(terr) or 'Not Found' in str(terr) or 'Bad Request' in str(terr):
                return jsonify({"status": "unavailable", "result": None})
            raise terr
    except Exception as e:
        logger.error(f"Traceroute troubleshooting error: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/cx/poe-bounce', methods=['POST'])
@require_session
def troubleshoot_cx_poe_bounce():
    """Execute POE bounce test on CX switch using async API.

    Reference: https://developer.arubanetworks.com/new-central/reference/initiatecxpoebounce
    Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/poeBounce
    """
    try:
        data = request.get_json()
        device_serial = data.get('device_serial')
        port = data.get('port')

        if not device_serial or not port:
            return jsonify({"error": "device_serial and port are required"}), 400

        try:
            result, status_code = _poll_async_operation(
                device_serial,
                f'/network-troubleshooting/v1alpha1/cx/{device_serial}/poeBounce',
                {"port": port},
                "POE bounce",
                max_wait=30, poll_interval=1,
            )
            return jsonify(result), status_code
        except Exception as terr:
            # Properly handle HTTP errors from requests library
            if isinstance(terr, requests.HTTPError):
                http_status = terr.response.status_code if hasattr(terr, 'response') and terr.response else None
                error_text = terr.response.text if hasattr(terr, 'response') and terr.response else str(terr)

                logger.error(
                    f"POE bounce API error: HTTP {http_status} - {error_text[:500] if error_text else 'Unknown error'}"
                )

                if http_status in (400, 404):
                    error_msg = error_text if error_text and len(error_text) < 200 else "POE bounce operation is not available for this device or port"
                    return jsonify({
                        "status": "unavailable", "result": None,
                        "error": error_msg, "status_code": http_status
                    }), http_status
                else:
                    return jsonify({
                        "status": "error",
                        "error": error_text[:200] if error_text else str(terr),
                        "status_code": http_status
                    }), http_status if http_status else 500
            elif '400' in str(terr) or '404' in str(terr):
                logger.warning(f"POE bounce error (string check): {terr}")
                return jsonify({
                    "status": "unavailable", "result": None,
                    "error": "POE bounce operation is not available. This may indicate the device or port does not support this operation."
                }), 404
            raise terr
    except Exception as e:
        logger.error(f"POE bounce troubleshooting error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/cx/port-bounce', methods=['POST'])
@require_session
def troubleshoot_cx_port_bounce():
    """Execute port bounce test on switch using async API.

    Tries CX endpoint first, falls back to AOS-S endpoint if CX fails.

    CX Reference: https://developer.arubanetworks.com/new-central/reference/initiatecxportbounce
    CX Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/port-bounce
    AOS-S Endpoint: /troubleshooting/v1alpha1/switches/{serial}/port-bounce
    """
    import app as _app
    aruba_client = _app.aruba_client

    def _check_port_status_inner(serial, port_id):
        """Check port status after bounce, returning a dict or None."""
        try:
            time.sleep(2)  # Wait for port to stabilize
            encoded = urllib.parse.quote(port_id, safe='')
            resp = aruba_client.get(
                f'/network-monitoring/v1/switches/{serial}/interfaces/{encoded}'
            )
            if resp:
                return {
                    "operStatus": resp.get('operStatus', 'Unknown'),
                    "adminStatus": resp.get('adminStatus', 'Unknown'),
                    "id": resp.get('id', port_id),
                    "name": resp.get('name', port_id),
                }
        except Exception as err:
            logger.warning(f"Could not check port status after bounce: {err}")
            return {"error": "Could not retrieve port status", "note": "Port may still be recovering"}
        return None

    def _enrich_result(async_resp, serial, port_id):
        """Add port-status and message fields to a completed port-bounce response."""
        fail_reason = async_resp.get('failReason', '')
        ps = _check_port_status_inner(serial, port_id)
        out = {**async_resp}
        if ps:
            out["portStatus"] = ps
        if fail_reason == 'Timed Out':
            out["message"] = "Port bounce completed. Note: Port may have no device connected (Timed Out)."
        else:
            out["message"] = "Port bounce completed successfully."
            if ps and ps.get('operStatus') == 'Down':
                out["warning"] = "Port is currently Down. It may take a few seconds to come back up if a device is connected."
        return out

    try:
        data = request.get_json()
        device_serial = data.get('device_serial')
        port = data.get('port')

        if not device_serial or not port:
            return jsonify({"error": "device_serial and port are required"}), 400

        # Try CX endpoint first
        try:
            result, sc = _poll_async_operation(
                device_serial,
                f'/network-troubleshooting/v1alpha1/cx/{device_serial}/portBounce',
                {"ports": [port]},
                "Port bounce",
                max_wait=60, poll_interval=1,
            )

            if sc == 200:
                return jsonify(_enrich_result(result, device_serial, port))
            elif sc == 500 and result.get('status') == 'FAILED':
                fr = ''
                if isinstance(result.get('response'), dict):
                    fr = result['response'].get('failReason', '')
                if not fr:
                    fr = result.get('error', '')
                if 'Timed Out' in fr:
                    orig = result.get('response', result)
                    return jsonify(_enrich_result({**orig, "status": "COMPLETED"}, device_serial, port))
                ps = _check_port_status_inner(device_serial, port)
                if ps:
                    result["portStatus"] = ps
            return jsonify(result), sc

        except Exception as terr:
            if isinstance(terr, requests.HTTPError):
                http_status = terr.response.status_code if hasattr(terr, 'response') and terr.response else None
                error_text = terr.response.text if hasattr(terr, 'response') and terr.response else str(terr)

                # If CX endpoint fails with 404, try AOS-S switch endpoint
                if http_status == 404:
                    logger.info(f"CX port bounce endpoint not available for {device_serial}, trying AOS-S endpoint")
                    try:
                        aoss_result, aoss_sc = _poll_aoss_operation(
                            device_serial,
                            f'/troubleshooting/v1alpha1/switches/{device_serial}/port-bounce',
                            {"port": port},
                            f'/troubleshooting/v1alpha1/switches/{device_serial}/port-bounce/{{test_id}}',
                            "Port bounce",
                            max_wait=30, poll_interval=1,
                        )
                        return jsonify(aoss_result), aoss_sc
                    except Exception as aos_err:
                        logger.error(f"AOS-S port bounce also failed: {aos_err}")
                        return jsonify({
                            "status": "unavailable", "result": None,
                            "error": "Port bounce operation is not available for this device. Neither CX nor AOS-S endpoints are supported.",
                            "cx_error": error_text[:100] if error_text else str(terr),
                            "aos_error": str(aos_err)[:100]
                        }), 404

                logger.error(
                    f"Port bounce API error: HTTP {http_status} - {error_text[:500] if error_text else 'Unknown error'}"
                )
                if http_status == 400:
                    error_msg = error_text if error_text and len(error_text) < 200 else "Port bounce operation is not available for this device or port"
                    return jsonify({
                        "status": "unavailable", "result": None,
                        "error": error_msg, "status_code": http_status
                    }), http_status
                else:
                    return jsonify({
                        "status": "error",
                        "error": error_text[:200] if error_text else str(terr),
                        "status_code": http_status
                    }), http_status if http_status else 500
            elif '400' in str(terr) or '404' in str(terr):
                logger.warning(f"Port bounce error (string check): {terr}")
                return jsonify({
                    "status": "unavailable", "result": None,
                    "error": "Port bounce operation is not available. This may indicate the device or port does not support this operation."
                }), 404
            raise terr
    except Exception as e:
        logger.error(f"Port bounce troubleshooting error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/cx/cable-test', methods=['POST'])
@require_session
def troubleshoot_cx_cable_test():
    """Execute cable test on CX switch using async API.

    Reference: https://developer.arubanetworks.com/new-central/reference/initiatecxcabletest
    Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/cableTest
    """
    import app as _app
    aruba_client = _app.aruba_client

    try:
        data = request.get_json()
        device_serial = data.get('device_serial')
        port = data.get('port')

        if not device_serial or not port:
            return jsonify({"error": "device_serial and port are required"}), 400

        try:
            response = aruba_client.post(
                f'/network-troubleshooting/v1alpha1/cx/{device_serial}/cableTest',
                data={"port": port}
            )

            location = response.get('location', '')
            task_id_match = re.search(r'/async-operations/([a-f0-9\-]+)', location)
            if not task_id_match:
                if response.get('status') == 'COMPLETED':
                    return jsonify(response)
                return jsonify({"error": "Could not extract task ID from response"}), 500

            task_id = task_id_match.group(1)

            # Poll for completion
            max_attempts = 60
            poll_interval = 2
            max_wait_time = 120  # Cable tests can take longer

            start_time = time.time()
            for attempt in range(max_attempts):
                if time.time() - start_time > max_wait_time:
                    return jsonify({
                        "error": "Cable test operation timed out",
                        "status": "TIMEOUT",
                        "task_id": task_id
                    }), 504

                async_response = aruba_client.get(
                    f'/network-troubleshooting/v1alpha1/cx/{device_serial}/cableTest/async-operations/{task_id}'
                )

                status = async_response.get('status', 'UNKNOWN')

                if status == 'COMPLETED':
                    return jsonify(async_response)
                elif status == 'FAILED':
                    fail_reason = async_response.get('failReason', 'Unknown error')
                    return jsonify({
                        "error": f"Cable test operation failed: {fail_reason}",
                        "status": "FAILED",
                        "task_id": task_id
                    }), 500
                elif status in ['INITIATED', 'IN_PROGRESS']:
                    time.sleep(poll_interval)
                    continue
                else:
                    time.sleep(poll_interval)
                    continue

            return jsonify({
                "error": "Cable test operation did not complete within expected time",
                "status": "TIMEOUT",
                "task_id": task_id
            }), 504

        except Exception as terr:
            if '400' in str(terr) or '404' in str(terr):
                return jsonify({"status": "unavailable", "result": None})
            raise terr
    except Exception as e:
        logger.error(f"Cable test troubleshooting error: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/cx/http-test', methods=['POST'])
@require_session
def troubleshoot_cx_http_test():
    """Execute HTTP test on CX switch using async API.

    Reference: https://developer.arubanetworks.com/new-central/reference/initiatecxhttp
    Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/httpTest
    """
    import app as _app
    aruba_client = _app.aruba_client

    try:
        data = request.get_json()
        device_serial = data.get('device_serial')
        url = data.get('url')

        if not device_serial or not url:
            return jsonify({"error": "device_serial and url are required"}), 400

        try:
            response = aruba_client.post(
                f'/network-troubleshooting/v1alpha1/cx/{device_serial}/httpTest',
                data={"url": url}
            )

            location = response.get('location', '')
            task_id_match = re.search(r'/async-operations/([a-f0-9\-]+)', location)
            if not task_id_match:
                if response.get('status') == 'COMPLETED':
                    return jsonify(response)
                return jsonify({"error": "Could not extract task ID from response"}), 500

            task_id = task_id_match.group(1)

            # Poll for completion
            max_attempts = 30
            poll_interval = 1
            max_wait_time = 30

            start_time = time.time()
            for attempt in range(max_attempts):
                if time.time() - start_time > max_wait_time:
                    return jsonify({
                        "error": "HTTP test operation timed out",
                        "status": "TIMEOUT",
                        "task_id": task_id
                    }), 504

                async_response = aruba_client.get(
                    f'/network-troubleshooting/v1alpha1/cx/{device_serial}/httpTest/async-operations/{task_id}'
                )

                status = async_response.get('status', 'UNKNOWN')

                if status == 'COMPLETED':
                    return jsonify(async_response)
                elif status == 'FAILED':
                    fail_reason = async_response.get('failReason', 'Unknown error')
                    return jsonify({
                        "error": f"HTTP test operation failed: {fail_reason}",
                        "status": "FAILED",
                        "task_id": task_id
                    }), 500
                elif status in ['INITIATED', 'IN_PROGRESS']:
                    time.sleep(poll_interval)
                    continue
                else:
                    time.sleep(poll_interval)
                    continue

            return jsonify({
                "error": "HTTP test operation did not complete within expected time",
                "status": "TIMEOUT",
                "task_id": task_id
            }), 504

        except Exception as terr:
            if '400' in str(terr) or '404' in str(terr):
                return jsonify({"status": "unavailable", "result": None})
            raise terr
    except Exception as e:
        logger.error(f"HTTP test troubleshooting error: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/cx/aaa-test', methods=['POST'])
@require_session
def troubleshoot_cx_aaa_test():
    """Execute AAA test on CX switch using async API.

    Reference: https://developer.arubanetworks.com/new-central/reference/initiatecxaaa
    Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/aaaTest
    """
    import app as _app
    aruba_client = _app.aruba_client

    try:
        data = request.get_json()
        device_serial = data.get('device_serial')
        username = data.get('username')
        password = data.get('password')

        if not device_serial or not username or not password:
            return jsonify({"error": "device_serial, username, and password are required"}), 400

        try:
            response = aruba_client.post(
                f'/network-troubleshooting/v1alpha1/cx/{device_serial}/aaaTest',
                data={"username": username, "password": password}
            )

            location = response.get('location', '')
            task_id_match = re.search(r'/async-operations/([a-f0-9\-]+)', location)
            if not task_id_match:
                if response.get('status') == 'COMPLETED':
                    return jsonify(response)
                return jsonify({"error": "Could not extract task ID from response"}), 500

            task_id = task_id_match.group(1)

            # Poll for completion
            max_attempts = 30
            poll_interval = 1
            max_wait_time = 30

            start_time = time.time()
            for attempt in range(max_attempts):
                if time.time() - start_time > max_wait_time:
                    return jsonify({
                        "error": "AAA test operation timed out",
                        "status": "TIMEOUT",
                        "task_id": task_id
                    }), 504

                async_response = aruba_client.get(
                    f'/network-troubleshooting/v1alpha1/cx/{device_serial}/aaaTest/async-operations/{task_id}'
                )

                status = async_response.get('status', 'UNKNOWN')

                if status == 'COMPLETED':
                    return jsonify(async_response)
                elif status == 'FAILED':
                    fail_reason = async_response.get('failReason', 'Unknown error')
                    return jsonify({
                        "error": f"AAA test operation failed: {fail_reason}",
                        "status": "FAILED",
                        "task_id": task_id
                    }), 500
                elif status in ['INITIATED', 'IN_PROGRESS']:
                    time.sleep(poll_interval)
                    continue
                else:
                    time.sleep(poll_interval)
                    continue

            return jsonify({
                "error": "AAA test operation did not complete within expected time",
                "status": "TIMEOUT",
                "task_id": task_id
            }), 504

        except Exception as terr:
            if '400' in str(terr) or '404' in str(terr):
                return jsonify({"status": "unavailable", "result": None})
            raise terr
    except Exception as e:
        logger.error(f"AAA test troubleshooting error: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/cx/show-commands', methods=['GET'])
@require_session
def troubleshoot_cx_list_show_commands():
    """List available show commands for CX switch.

    Reference: https://developer.arubanetworks.com/new-central/reference/listcxshowcommands
    Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/showCommand
    """
    import app as _app
    aruba_client = _app.aruba_client

    try:
        device_serial = request.args.get('device_serial')
        if not device_serial:
            return jsonify({"error": "device_serial is required"}), 400

        try:
            response = aruba_client.get(
                f'/network-troubleshooting/v1alpha1/cx/{device_serial}/showCommand'
            )

            # Transform response: combine all commands from all categories into one object
            if isinstance(response, list):
                all_commands = []
                for category in response:
                    if isinstance(category, dict) and 'commands' in category:
                        for cmd_obj in category.get('commands', []):
                            if isinstance(cmd_obj, dict) and 'command' in cmd_obj:
                                # Include category name with each command
                                all_commands.append({
                                    "command": cmd_obj['command'],
                                    "category": category.get('categoryName', 'Unknown')
                                })

                # Return as single object with all commands
                return jsonify({
                    "commands": all_commands,
                    "count": len(all_commands)
                })

            return jsonify(response)
        except Exception as terr:
            if '400' in str(terr) or '404' in str(terr):
                return jsonify({"status": "unavailable", "result": None})
            raise terr
    except Exception as e:
        logger.error(f"List show commands error: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/cx/show-command', methods=['POST'])
@require_session
def troubleshoot_cx_run_show_command():
    """Run a show command on CX switch using async API.

    Reference: https://developer.arubanetworks.com/new-central/reference/runcxshowcommand
    Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/showCommand
    """
    import app as _app
    aruba_client = _app.aruba_client

    try:
        data = request.get_json()
        device_serial = data.get('device_serial')
        command = data.get('command')

        if not device_serial or not command:
            return jsonify({"error": "device_serial and command are required"}), 400

        try:
            response = aruba_client.post(
                f'/network-troubleshooting/v1alpha1/cx/{device_serial}/showCommand',
                data={"command": command}
            )

            location = response.get('location', '')
            task_id_match = re.search(r'/async-operations/([a-f0-9\-]+)', location)
            if not task_id_match:
                if response.get('status') == 'COMPLETED':
                    return jsonify(response)
                return jsonify({"error": "Could not extract task ID from response"}), 500

            task_id = task_id_match.group(1)

            # Poll for completion
            max_attempts = 30
            poll_interval = 1
            max_wait_time = 30

            start_time = time.time()
            for attempt in range(max_attempts):
                if time.time() - start_time > max_wait_time:
                    return jsonify({
                        "error": "Show command operation timed out",
                        "status": "TIMEOUT",
                        "task_id": task_id
                    }), 504

                async_response = aruba_client.get(
                    f'/network-troubleshooting/v1alpha1/cx/{device_serial}/showCommand/async-operations/{task_id}'
                )

                status = async_response.get('status', 'UNKNOWN')

                if status == 'COMPLETED':
                    return jsonify(async_response)
                elif status == 'FAILED':
                    fail_reason = async_response.get('failReason', 'Unknown error')
                    return jsonify({
                        "error": f"Show command operation failed: {fail_reason}",
                        "status": "FAILED",
                        "task_id": task_id
                    }), 500
                elif status in ['INITIATED', 'IN_PROGRESS']:
                    time.sleep(poll_interval)
                    continue
                else:
                    time.sleep(poll_interval)
                    continue

            return jsonify({
                "error": "Show command operation did not complete within expected time",
                "status": "TIMEOUT",
                "task_id": task_id
            }), 504

        except Exception as terr:
            if '400' in str(terr) or '404' in str(terr):
                return jsonify({"status": "unavailable", "result": None})
            raise terr
    except Exception as e:
        logger.error(f"Run show command error: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/cx/locate', methods=['POST'])
@require_session
def troubleshoot_cx_locate():
    """Locate a CX switch (flash LEDs).

    Reference: https://developer.arubanetworks.com/new-central/reference/locatecxswitch
    Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/locate
    """
    import app as _app
    aruba_client = _app.aruba_client

    try:
        data = request.get_json()
        device_serial = data.get('device_serial')
        enable = data.get('enable', True)

        if not device_serial:
            return jsonify({"error": "device_serial is required"}), 400

        try:
            response = aruba_client.post(
                f'/network-troubleshooting/v1alpha1/cx/{device_serial}/locate',
                data={"enable": enable}
            )
            return jsonify(response)
        except Exception as terr:
            if '400' in str(terr) or '404' in str(terr):
                return jsonify({"status": "unavailable", "result": None})
            raise terr
    except Exception as e:
        logger.error(f"Locate switch error: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/cx/reboot', methods=['POST'])
@require_session
def troubleshoot_cx_reboot():
    """Reboot a CX switch.

    Reference: https://developer.arubanetworks.com/new-central/reference/rebootcxswitch
    Endpoint: /network-troubleshooting/v1alpha1/cx/{serial-number}/reboot
    """
    import app as _app
    aruba_client = _app.aruba_client

    try:
        data = request.get_json()
        device_serial = data.get('device_serial')

        if not device_serial:
            return jsonify({"error": "device_serial is required"}), 400

        try:
            response = aruba_client.post(
                f'/network-troubleshooting/v1alpha1/cx/{device_serial}/reboot',
                data={}
            )
            return jsonify(response)
        except Exception as terr:
            if '400' in str(terr) or '404' in str(terr):
                return jsonify({"status": "unavailable", "result": None})
            raise terr
    except Exception as e:
        logger.error(f"Reboot switch error: {e}")
        return jsonify({"error": str(e)}), 500


# ── AP Troubleshooting Endpoints ──────────────────────────────────────────────

@troubleshoot_bp.route('/api/troubleshoot/aps/<serial>/ping', methods=['POST'])
@require_session
def troubleshoot_ap_ping(serial):
    """Run ping from an AOS AP."""
    import app as _app
    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        data = request.get_json() or {}
        target = data.get('target', '8.8.8.8')
        response = aruba_client.post(f'/troubleshooting/v1/aps/{serial}/ping', data={"target": target})
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error running ping on AP {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/aps/<serial>/traceroute', methods=['POST'])
@require_session
def troubleshoot_ap_traceroute(serial):
    """Run traceroute from an AOS AP."""
    import app as _app
    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        data = request.get_json() or {}
        target = data.get('target', '8.8.8.8')
        response = aruba_client.post(f'/troubleshooting/v1/aps/{serial}/traceroute', data={"target": target})
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error running traceroute on AP {serial}: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/aps/<serial>/locate', methods=['POST'])
@require_session
def troubleshoot_ap_locate(serial):
    """Blink AP LEDs to physically locate it."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        response = aruba_client.post(f'/troubleshooting/v1/aps/{serial}/locate', data={})
        return jsonify({"success": True, "message": "AP LED blink initiated", "response": response})
    except Exception as e:
        logger.error(f"Error locating AP {serial}: {e}")
        return jsonify({"error": "Failed to locate AP"}), 500


@troubleshoot_bp.route('/api/troubleshoot/aps/<serial>/reboot', methods=['POST'])
@require_session
def troubleshoot_ap_reboot(serial):
    """Reboot an AP remotely."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        response = aruba_client.post(f'/troubleshooting/v1/aps/{serial}/reboot', data={})
        return jsonify({"success": True, "message": "AP reboot initiated", "response": response})
    except Exception as e:
        logger.error(f"Error rebooting AP {serial}: {e}")
        return jsonify({"error": "Failed to reboot AP"}), 500


@troubleshoot_bp.route('/api/troubleshoot/aps/<serial>/disconnect-user', methods=['POST'])
@require_session
def troubleshoot_ap_disconnect_user(serial):
    """Disconnect a specific client from an AP."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        data = request.get_json() or {}
        mac = data.get('mac', '')
        if not mac:
            return jsonify({"error": "Client MAC address required"}), 400
        response = aruba_client.post(f'/troubleshooting/v1/aps/{serial}/disconnect-user', data={"mac": mac})
        return jsonify({"success": True, "message": f"Client {mac} disconnect initiated", "response": response})
    except Exception as e:
        logger.error(f"Error disconnecting client from AP {serial}: {e}")
        return jsonify({"error": "Failed to disconnect client"}), 500


@troubleshoot_bp.route('/api/troubleshoot/aps/<serial>/speedtest', methods=['POST'])
@require_session
def troubleshoot_ap_speedtest(serial):
    """Run speed test from AP."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        response = aruba_client.post(f'/troubleshooting/v1/aps/{serial}/speedtest', data={})
        return jsonify({"success": True, "message": "Speed test initiated", "response": response})
    except Exception as e:
        logger.error(f"Error running speed test on AP {serial}: {e}")
        return jsonify({"error": "Failed to run speed test"}), 500


@troubleshoot_bp.route('/api/troubleshoot/aps/<serial>/nslookup', methods=['POST'])
@require_session
def troubleshoot_ap_nslookup(serial):
    """Run DNS lookup from AP."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        data = request.get_json() or {}
        hostname = data.get('hostname', '')
        if not hostname:
            return jsonify({"error": "Hostname required"}), 400
        response = aruba_client.post(f'/troubleshooting/v1/aps/{serial}/nslookup', data={"hostname": hostname})
        return jsonify({"success": True, "message": f"DNS lookup for {hostname} initiated", "response": response})
    except Exception as e:
        logger.error(f"Error running DNS lookup on AP {serial}: {e}")
        return jsonify({"error": "Failed to run DNS lookup"}), 500


@troubleshoot_bp.route('/api/troubleshoot/aps/<serial>/http-test', methods=['POST'])
@require_session
def troubleshoot_ap_http_test(serial):
    """Run HTTP connectivity test from AP."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        data = request.get_json() or {}
        url = data.get('url', '')
        if not url:
            return jsonify({"error": "URL required"}), 400
        response = aruba_client.post(f'/troubleshooting/v1/aps/{serial}/http-test', data={"url": url})
        return jsonify({"success": True, "message": f"HTTP test to {url} initiated", "response": response})
    except Exception as e:
        logger.error(f"Error running HTTP test on AP {serial}: {e}")
        return jsonify({"error": "Failed to run HTTP test"}), 500


@troubleshoot_bp.route('/api/troubleshoot/gateways/<serial>/iperf', methods=['POST'])
@require_session
def troubleshoot_gw_iperf(serial):
    """Run iPerf bandwidth test from gateway."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        data = request.get_json() or {}
        target = data.get('target', '')
        if not target:
            return jsonify({"error": "Target IP/hostname required"}), 400
        payload = {"target": target}
        if data.get('duration'):
            payload['duration'] = int(data['duration'])
        if data.get('port'):
            payload['port'] = int(data['port'])
        response = aruba_client.post(f'/troubleshooting/v1/gateways/{serial}/iperf', data=payload)
        return jsonify({"success": True, "message": f"iPerf test to {target} initiated", "response": response})
    except Exception as e:
        logger.error(f"Error running iPerf on gateway {serial}: {e}")
        return jsonify({"error": "Failed to run iPerf test"}), 500


@troubleshoot_bp.route('/api/troubleshoot/gateways/<serial>/pingsweep', methods=['POST'])
@require_session
def troubleshoot_gw_pingsweep(serial):
    """Run ping sweep from gateway to discover hosts in a subnet."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        data = request.get_json() or {}
        subnet = data.get('subnet', '')
        if not subnet:
            return jsonify({"error": "Subnet required (e.g., 192.168.1.0/24)"}), 400
        response = aruba_client.post(f'/troubleshooting/v1/gateways/{serial}/pingsweep', data={"subnet": subnet})
        return jsonify({"success": True, "message": f"Ping sweep of {subnet} initiated", "response": response})
    except Exception as e:
        logger.error(f"Error running ping sweep on gateway {serial}: {e}")
        return jsonify({"error": "Failed to run ping sweep"}), 500


@troubleshoot_bp.route('/api/troubleshoot/gateways/<serial>/disconnect-client', methods=['POST'])
@require_session
def troubleshoot_gw_disconnect_client(serial):
    """Disconnect a client from gateway."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        data = request.get_json() or {}
        mac = data.get('mac', '')
        if not mac:
            return jsonify({"error": "Client MAC address required"}), 400
        response = aruba_client.post(f'/troubleshooting/v1/gateways/{serial}/disconnect-client', data={"mac": mac})
        return jsonify({"success": True, "message": f"Client {mac} disconnect from gateway initiated", "response": response})
    except Exception as e:
        logger.error(f"Error disconnecting client from gateway {serial}: {e}")
        return jsonify({"error": "Failed to disconnect client"}), 500


@troubleshoot_bp.route('/api/troubleshoot/device-logs', methods=['GET'])
@require_session
def get_device_logs():
    """Get device logs for troubleshooting."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        device_serial = request.args.get('serial')
        if not device_serial:
            return jsonify({"error": "Device serial required"}), 400
        try:
            response = aruba_client.get(f'/device-management/v1/device/{device_serial}/logs')
            return jsonify(response)
        except Exception:
            return jsonify({"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching device logs: {e}")
        return jsonify({"items": [], "count": 0})


@troubleshoot_bp.route('/api/troubleshoot/client-session', methods=['GET'])
@require_session
def get_client_session():
    """Get client session details for troubleshooting."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        mac_address = request.args.get('mac')
        if not mac_address:
            return jsonify({"error": "MAC address required"}), 400
        try:
            response = aruba_client.get(f'/network-monitoring/v1/clients/{mac_address}')
            return jsonify(response)
        except Exception:
            return jsonify({"session": None})
    except Exception as e:
        logger.error(f"Error fetching client session: {e}")
        return jsonify({"session": None})


@troubleshoot_bp.route('/api/troubleshoot/ap-diagnostics', methods=['GET'])
@require_session
def get_ap_diagnostics():
    """Get AP diagnostics for troubleshooting."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        serial = request.args.get('serial')
        if not serial:
            return jsonify({"error": "AP serial required"}), 400
        try:
            response = aruba_client.get(f'/network-monitoring/v1/aps/{serial}')
            return jsonify(response)
        except Exception:
            return jsonify({"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching AP diagnostics: {e}")
        return jsonify({"items": [], "count": 0})


@troubleshoot_bp.route('/api/troubleshoot/ap-radio-stats', methods=['GET'])
@require_session
def get_ap_radio_stats():
    """Get AP radio statistics for troubleshooting wireless issues."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        serial = request.args.get('serial')
        if not serial:
            return jsonify({"error": "AP serial required"}), 400
        try:
            response = aruba_client.get(f'/network-monitoring/v1/aps/{serial}/radio-stats')
            return jsonify(response)
        except Exception:
            return jsonify({"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching AP radio stats: {e}")
        return jsonify({"items": [], "count": 0})


@troubleshoot_bp.route('/api/troubleshoot/ap-interference', methods=['GET'])
@require_session
def get_ap_interference():
    """Get AP interference analysis."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        serial = request.args.get('serial')
        if not serial:
            return jsonify({"error": "AP serial required"}), 400
        try:
            response = aruba_client.get(f'/network-monitoring/v1/aps/{serial}/interference')
            return jsonify(response)
        except Exception:
            return jsonify({"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching AP interference: {e}")
        return jsonify({"items": [], "count": 0})


@troubleshoot_bp.route('/api/troubleshoot/client-connectivity', methods=['POST'])
@require_session
def troubleshoot_client_connectivity():
    """Perform comprehensive client connectivity troubleshooting."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        data = request.get_json()
        mac_address = data.get('mac_address')

        if not mac_address:
            return jsonify({"error": "mac_address is required"}), 400

        # Get client details
        client = aruba_client.get(f'/network-monitoring/v1/clients/{mac_address}')

        # Get associated AP if available
        ap_details = None
        if 'associatedDevice' in client or 'apSerial' in client:
            ap_serial = client.get('associatedDevice') or client.get('apSerial')
            if ap_serial:
                try:
                    ap_details = aruba_client.get(f'/network-monitoring/v1/aps/{ap_serial}')
                except Exception as e:
                    logger.warning(f"Could not fetch AP details: {e}")

        troubleshooting_data = {
            'client': client,
            'ap': ap_details,
            'timestamp': time.time()
        }

        return jsonify(troubleshooting_data)
    except Exception as e:
        logger.error(f"Error troubleshooting client connectivity: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/bandwidth-test', methods=['POST'])
@require_session
def troubleshoot_bandwidth_test():
    """Execute bandwidth test on device."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        data = request.get_json()
        device_serial = data.get('device_serial')

        if not device_serial:
            return jsonify({"error": "device_serial is required"}), 400

        response = aruba_client.post(
            f'/device-management/v1/device/{device_serial}/action/bandwidth-test',
            json=data
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Bandwidth test error: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/switch-port-status', methods=['GET'])
@require_session
def get_switch_port_status():
    """Get switch port status for troubleshooting connectivity issues."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        serial = request.args.get('serial')
        port = request.args.get('port')

        if not serial:
            return jsonify({"error": "Switch serial required"}), 400

        try:
            if port:
                response = aruba_client.get(f'/network-monitoring/v1/switches/{serial}/interfaces/{port}')
            else:
                response = aruba_client.get(f'/network-monitoring/v1/switches/{serial}/interfaces')
            return jsonify(response)
        except Exception:
            return jsonify({"interfaces": []})
    except Exception as e:
        logger.error(f"Error fetching switch port status: {e}")
        return jsonify({"interfaces": []})


@troubleshoot_bp.route('/api/troubleshoot/show-run-config', methods=['GET'])
@require_session
def show_run_config():
    """Get running configuration from a device."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        serial = request.args.get('serial')
        if not serial:
            return jsonify({"error": "Device serial required"}), 400

        # Fetch running config
        try:
            response = aruba_client.get(f'/configuration/v1/devices/{serial}/configuration')
            # Check if response has configuration field
            if 'configuration' in response and response['configuration']:
                return jsonify(response)
            elif 'configuration' in response:
                return jsonify({"configuration": "", "error": "Configuration is empty. This endpoint may not be supported for this device type."}), 404
            return jsonify(response)
        except Exception as e:
            # Return proper error messages
            err = str(e)
            if '404' in err or 'Not Found' in err:
                return jsonify({"error": "Configuration endpoint not found. This device type may not support show run-config."}), 404
            elif '400' in err or 'Bad Request' in err:
                return jsonify({"error": "Bad request. The device may not support this command."}), 400
            else:
                logger.error(f"Show run config error for {serial}: {e}")
                return jsonify({"error": f"Failed to fetch configuration: {err}"}), 500
    except Exception as e:
        logger.error(f"Show run config error: {e}")
        return jsonify({"error": f"Internal error: {str(e)}"}), 500


@troubleshoot_bp.route('/api/troubleshoot/show-tech-support', methods=['GET'])
@require_session
def show_tech_support():
    """Get tech support information from a device."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        serial = request.args.get('serial')
        if not serial:
            return jsonify({"error": "Device serial required"}), 400

        try:
            response = aruba_client.get(f'/troubleshooting/v1/devices/{serial}/tech-support')
            # Check if response has items
            if 'items' in response:
                if not response['items'] or len(response['items']) == 0:
                    return jsonify({"items": [], "count": 0, "error": "Tech support data is empty. This device may not support this command."}), 404
            return jsonify(response)
        except Exception as e:
            err = str(e)
            if '404' in err or 'Not Found' in err:
                return jsonify({"error": "Tech support endpoint not found. This device type may not support this command."}), 404
            elif '400' in err or 'Bad Request' in err:
                return jsonify({"error": "Bad request. The device may not support this command."}), 400
            else:
                logger.error(f"Show tech support error for {serial}: {e}")
                return jsonify({"error": f"Failed to fetch tech support: {err}"}), 500
    except Exception as e:
        logger.error(f"Show tech support error: {e}")
        return jsonify({"error": f"Internal error: {str(e)}"}), 500


@troubleshoot_bp.route('/api/troubleshoot/show-version', methods=['GET'])
@require_session
def show_version():
    """Get device version information."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        serial = request.args.get('serial')
        if not serial:
            return jsonify({"error": "Device serial required"}), 400

        # Get device details which includes version
        response = aruba_client.get(f'/network-monitoring/v1/devices')

        # Filter for the specific device
        if 'items' in response:
            device = next((d for d in response['items'] if d.get('serial') == serial or d.get('serialNumber') == serial), None)
            if device:
                return jsonify({
                    "serial": serial,
                    "firmware_version": device.get('firmwareVersion') or device.get('firmware_version'),
                    "model": device.get('model'),
                    "device_type": device.get('deviceType'),
                    "uptime": device.get('uptime'),
                    "status": device.get('status')
                })

        return jsonify({"error": "Device not found"}), 404
    except Exception as e:
        logger.error(f"Show version error: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/troubleshoot/show-interfaces', methods=['GET'])
@require_session
def show_interfaces():
    """Get interface information from a switch."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        serial = request.args.get('serial')
        if not serial:
            return jsonify({"error": "Device serial required"}), 400

        try:
            response = aruba_client.get(f'/network-monitoring/v1/switches/{serial}/interfaces')
            # Check if response has interfaces
            if 'interfaces' in response:
                if not response['interfaces'] or len(response['interfaces']) == 0:
                    return jsonify({"interfaces": [], "count": 0, "error": "No interfaces found. This command is typically only available for switches."}), 404
            return jsonify(response)
        except Exception as e:
            err = str(e)
            if '404' in err or 'Not Found' in err:
                return jsonify({"error": "Interfaces endpoint not found. This command is typically only available for switches."}), 404
            elif '400' in err or 'Bad Request' in err:
                return jsonify({"error": "Bad request. The device may not be a switch or may not support this command."}), 400
            else:
                logger.error(f"Show interfaces error for {serial}: {e}")
                return jsonify({"error": f"Failed to fetch interfaces: {err}"}), 500
    except Exception as e:
        logger.error(f"Show interfaces error: {e}")
        return jsonify({"error": f"Internal error: {str(e)}"}), 500


# ============= Firmware Management Endpoints =============

@troubleshoot_bp.route('/api/firmware/versions', methods=['GET'])
@require_session
def get_firmware_versions():
    """Get available firmware versions."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        device_type = request.args.get('device_type', 'IAP')
        try:
            response = aruba_client.get(f'/firmware/v1/versions/{device_type}')
            return jsonify(response)
        except Exception as fw_err:
            # Fallback to new Central inventory-based versions (if available) or return empty
            if '404' in str(fw_err) or 'Not Found' in str(fw_err):
                logger.warning("Firmware versions API not found; returning empty list")
                return jsonify({"versions": [], "count": 0})
            raise fw_err
    except Exception as e:
        logger.error(f"Error fetching firmware versions: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/firmware/compliance', methods=['GET'])
@require_session
def get_firmware_compliance():
    """Get firmware compliance status for devices."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        # Try different firmware API endpoints
        try:
            response = aruba_client.get('/firmware/v1/status')
            return jsonify(response)
        except Exception as fw_err:
            # Try alternative endpoint
            if "404" in str(fw_err) or "Not Found" in str(fw_err):
                try:
                    response = aruba_client.get('/platform/device_inventory/v1/devices')
                    # Transform to compliance format
                    devices = response.get('devices', [])
                    return jsonify({
                        "compliant": sum(1 for d in devices if d.get('firmware_compliant', False)),
                        "non_compliant": sum(1 for d in devices if not d.get('firmware_compliant', True)),
                        "total": len(devices),
                        "devices": devices
                    })
                except Exception:
                    # Return empty compliance data
                    logger.warning("Firmware compliance endpoint not available")
                    return jsonify({"compliant": 0, "non_compliant": 0, "total": 0, "devices": []})
            raise fw_err
    except Exception as e:
        logger.error(f"Error fetching firmware compliance: {e}")
        return jsonify({"compliant": 0, "non_compliant": 0, "total": 0, "devices": [], "error": "Firmware API not available"})


@troubleshoot_bp.route('/api/firmware/upgrade', methods=['POST'])
@require_session
def schedule_firmware_upgrade():
    """Schedule firmware upgrade for devices."""
    import app as _app
    aruba_client = _app.aruba_client

    try:
        data = request.get_json()
        response = aruba_client.post('/firmware/v1/upgrade', data=data)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error scheduling firmware upgrade: {e}")
        return jsonify({"error": str(e)}), 500


@troubleshoot_bp.route('/api/firmware/details', methods=['GET'])
@require_session
def get_firmware_details():
    """Get firmware details for devices including current and recommended versions.

    Tries v1 then v1alpha1. Supports query params: device_type, limit, offset.
    Endpoint: /network-services/v1/firmware-details
    """
    import app as _app
    aruba_client = _app.aruba_client

    try:
        params = request.args.to_dict()
        try:
            r = aruba_client.get('/network-services/v1/firmware-details', params=params)
        except Exception as e1:
            if '404' in str(e1) or 'Not Found' in str(e1):
                r = aruba_client.get('/network-services/v1alpha1/firmware-details', params=params)
            else:
                raise
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching firmware details: {e}")
        return jsonify({"items": [], "count": 0, "error": str(e)})


@troubleshoot_bp.route('/api/firmware/compliance-policy', methods=['GET'])
@require_session
def get_firmware_compliance_policy():
    """Get firmware compliance policy settings.

    Endpoint: /network-config/v1alpha1/firmware-compliance
    """
    import app as _app
    aruba_client = _app.aruba_client

    try:
        params = request.args.to_dict()
        r = aruba_client.get('/network-config/v1alpha1/firmware-compliance', params=params)
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching firmware compliance policy: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Cluster Info Endpoint =============

@troubleshoot_bp.route('/api/cluster/info', methods=['GET'])
def get_cluster_info():
    """Get information about Aruba Central regional clusters and base URLs."""
    import app as _app
    config = _app.config

    return jsonify({
        "current_base_url": config["aruba_central"]["base_url"] if config else "Not configured",
        "available_clusters": [
            {
                "name": "United States",
                "region": "us-west",
                "base_url": "https://internal-apigw.central.arubanetworks.com",
                "description": "US West region (default for most US customers)"
            },
            {
                "name": "United States - New HPE GreenLake",
                "region": "us-hpe-gl",
                "base_url": "https://internal.api.central.arubanetworks.com",
                "description": "New HPE GreenLake platform (check your Central dashboard URL)"
            },
            {
                "name": "Europe",
                "region": "eu-central",
                "base_url": "https://internal-apigw.central.arubanetworks.com",
                "description": "Europe Central region"
            },
            {
                "name": "Asia Pacific",
                "region": "apac",
                "base_url": "https://internal-apigw.apac.central.arubanetworks.com",
                "description": "Asia Pacific region"
            },
            {
                "name": "Canada",
                "region": "ca",
                "base_url": "https://internal-apigw.central.arubanetworks.com",
                "description": "Canada region"
            },
            {
                "name": "China",
                "region": "cn",
                "base_url": "https://internal-apigw.arubanetworks.com.cn",
                "description": "China region"
            }
        ],
        "how_to_find": {
            "step1": "Log into your Aruba Central dashboard",
            "step2": "Check the URL in your browser",
            "step3": "Match the domain to the cluster list above",
            "step4": "Use the corresponding base_url for API calls",
            "note": "Using the wrong cluster URL will result in authentication failures"
        },
        "documentation": "https://developer.arubanetworks.com/aruba-central/docs/api-getting-started"
    })

