#!/usr/bin/env python3
"""
Shared utilities for test and debug scripts

Provides common error handling patterns, HTTP helpers, and configuration
loading for dashboard API testing scripts.
"""

import os
import requests
from typing import Optional, Dict, Any, Tuple, List
from rich.console import Console

console = Console()

# Load from environment with fallback
DASHBOARD_API = os.environ.get('DASHBOARD_API_URL', 'http://localhost:5000/api')
TEST_WLAN_PASSWORD = os.environ.get('TEST_WLAN_PASSWORD', 'TestPassword123!')


def api_request(
    method: str,
    url: str,
    headers: Optional[Dict[str, str]] = None,
    json_data: Optional[Dict[str, Any]] = None,
    timeout: int = 30
) -> Tuple[Optional[Dict], Optional[str]]:
    """Make HTTP request with proper error handling

    Args:
        method: HTTP method (GET, POST, DELETE, etc.)
        url: Full URL to request
        headers: Optional request headers
        json_data: Optional JSON payload for POST/PUT
        timeout: Request timeout in seconds (default 30)

    Returns:
        Tuple of (response_data, error_message):
        - (data_dict, None) on success
        - (None, error_message) on failure
    """
    try:
        response = requests.request(
            method=method,
            url=url,
            headers=headers,
            json=json_data,
            timeout=timeout
        )

        # Handle successful responses
        if response.status_code in [200, 201, 204]:
            # 204 No Content returns empty body
            if response.status_code == 204:
                return {}, None

            # Try to parse JSON response
            try:
                return response.json(), None
            except requests.exceptions.JSONDecodeError:
                # Success but no JSON body (some endpoints return empty string)
                return {}, None

        # Handle error responses with clear categorization
        elif response.status_code == 401:
            return None, "Session expired - please re-authenticate"

        elif response.status_code == 403:
            return None, "Permission denied - insufficient access"

        elif response.status_code == 404:
            return None, f"Resource not found: {url}"

        elif response.status_code == 409:
            # Conflict - often means resource already exists or is in use
            try:
                error_data = response.json()
                msg = error_data.get('message', error_data.get('error', 'Conflict'))
                return None, f"Conflict: {msg}"
            except requests.exceptions.JSONDecodeError:
                return None, "Conflict - resource may be in use"

        elif response.status_code >= 500:
            # Server error
            try:
                error_data = response.json()
                msg = error_data.get('message', error_data.get('error', str(error_data)))
                return None, f"Server error (HTTP {response.status_code}): {msg}"
            except requests.exceptions.JSONDecodeError:
                return None, f"Server error (HTTP {response.status_code}): {response.text[:200]}"

        else:
            # Other client errors (400, etc.)
            try:
                error_data = response.json()
                msg = error_data.get('message', error_data.get('error', str(error_data)))
                return None, f"Request failed (HTTP {response.status_code}): {msg}"
            except requests.exceptions.JSONDecodeError:
                return None, f"Request failed (HTTP {response.status_code}): {response.text[:200]}"

    except requests.exceptions.ConnectionError:
        return None, f"Cannot connect to {url}. Is the dashboard backend running?"

    except requests.exceptions.Timeout:
        return None, f"Request timed out after {timeout} seconds"

    except requests.exceptions.RequestException as e:
        return None, f"Network error: {type(e).__name__}: {str(e)}"

    except Exception as e:
        # Truly unexpected errors (programming bugs, etc.)
        return None, f"Unexpected error: {type(e).__name__}: {str(e)}"


def login_to_dashboard() -> Tuple[Optional[str], Optional[str]]:
    """Login to dashboard and get session ID

    Returns:
        Tuple of (session_id, error_message):
        - (session_id, None) on success
        - (None, error_message) on failure
    """
    data, error = api_request('POST', f"{DASHBOARD_API}/auth/login", timeout=10)

    if error:
        return None, f"Login failed: {error}"

    if not data:
        return None, "Login succeeded but received empty response"

    session_id = data.get('session_id')
    if not session_id:
        return None, "Login succeeded but no session_id in response"

    return session_id, None


def get_devices(session_id: str) -> Tuple[Optional[List[Dict]], Optional[str]]:
    """Get all devices from dashboard

    Args:
        session_id: Active session ID from login

    Returns:
        Tuple of (devices_list, error_message):
        - (devices, None) on success
        - (None, error_message) on failure
    """
    headers = {'X-Session-ID': session_id}
    data, error = api_request('GET', f"{DASHBOARD_API}/devices", headers=headers)

    if error:
        return None, error

    if not isinstance(data, dict):
        return None, f"Unexpected response format: expected dict, got {type(data).__name__}"

    devices = data.get('items', data.get('devices', []))

    if not isinstance(devices, list):
        return None, f"Unexpected devices format: expected list, got {type(devices).__name__}"

    return devices, None


def get_gateways(session_id: str) -> Tuple[Optional[List[Dict]], Optional[str]]:
    """Get all gateways from dashboard

    Args:
        session_id: Active session ID from login

    Returns:
        Tuple of (gateways_list, error_message):
        - (gateways, None) on success (empty list if no gateways)
        - (None, error_message) on failure
    """
    devices, error = get_devices(session_id)

    if error:
        return None, error

    gateways = [d for d in devices if d.get('deviceType') == 'GATEWAY']
    return gateways, None


def get_first_gateway(session_id: str) -> Tuple[Optional[Dict], Optional[str]]:
    """Get first available gateway from dashboard

    Args:
        session_id: Active session ID from login

    Returns:
        Tuple of (gateway_dict, error_message):
        - (gateway, None) on success
        - (None, error_message) if no gateways or error
    """
    gateways, error = get_gateways(session_id)

    if error:
        return None, error

    if not gateways:
        return None, "No gateways found in the system"

    return gateways[0], None


def validate_response_structure(
    data: Any,
    expected_type: type,
    required_keys: Optional[List[str]] = None
) -> Optional[str]:
    """Validate response data structure

    Args:
        data: Response data to validate
        expected_type: Expected Python type (dict, list, etc.)
        required_keys: Optional list of required dictionary keys

    Returns:
        None if valid, error message string if invalid
    """
    if not isinstance(data, expected_type):
        return f"Invalid response type: expected {expected_type.__name__}, got {type(data).__name__}"

    if required_keys and isinstance(data, dict):
        missing = [key for key in required_keys if key not in data]
        if missing:
            return f"Missing required keys: {', '.join(missing)}"

    return None
