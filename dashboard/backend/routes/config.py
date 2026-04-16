"""
Configuration Blueprint — extracted from app.py.

Covers:
  - /api/config/wlan*, /api/config/vlan*, /api/config/named-vlan*
  - /api/config/roles*, /api/config/role-gpids*, /api/config/policies*
  - /api/config/scope-maps*, /api/config/nac/*
  - /api/config/auth-servers, /api/config/captive-portal-profiles
  - /api/config/static-routes*, /api/config/acls, /api/config/stp
  - /api/config/dhcp-pools, /api/config/ntp, /api/config/dns
  - /api/config/snmp, /api/config/syslog
  - /api/clients/* (client endpoints)
  - /api/sites/health, /api/sites/device-health, /api/tenant/device-health
  - /api/sites/config, /api/sites, /api/sites/<site_id>
  - /api/groups, /api/templates
  - /api/nac/* (NAC endpoints)
  - /api/scope/* (scope management)
  - /api/appexperience/* (application experience)
  - /api/config/bulk-*, /api/config/export
  - /api/workspace/*, /api/cluster/info
  - /api/services/*
  - /api/sites/<site_id>/health, /api/sites/client-health
  - /api/tenant/client-health
"""

import logging
import requests
from flask import Blueprint, request, jsonify, make_response

from utils.central_api_client import CentralAPIError
from .helpers import require_session, api_proxy, cached_get, cached_get_paginated

config_bp = Blueprint("config", __name__)
logger = logging.getLogger(__name__)


# ============= Network Configuration Endpoints (v1alpha1) =============
# These endpoints proxy to the network-config/v1alpha1 API for WLAN wizard functionality


# WLAN Configuration Endpoints
@config_bp.route("/api/config/wlan", methods=["GET"])
@require_session
def get_wlans_config():
    """Get all WLANs via network-config API."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        response = aruba_client.get("/network-config/v1alpha1/wlan-ssids", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching WLANs config: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/wlan/<ssid_name>", methods=["GET"])
@require_session
def get_wlan_config(ssid_name):
    """Get specific WLAN configuration."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-config/v1alpha1/wlan-ssids/{ssid_name}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching WLAN {ssid_name}: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/wlan/<ssid_name>", methods=["POST"])
@require_session
def create_wlan_config(ssid_name):
    """Create new WLAN."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        wlan_data = request.get_json()
        params = request.args.to_dict()  # Get query parameters
        logger.info(f"Creating WLAN {ssid_name} with data: {wlan_data}")
        logger.info(f"Query parameters: {params}")
        response = aruba_client.post(
            f"/network-config/v1alpha1/wlan-ssids/{ssid_name}", data=wlan_data, params=params
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error creating WLAN {ssid_name}: {e}")
        # Try to get more details from the error
        if hasattr(e, "response") and hasattr(e.response, "text"):
            logger.error(f"API response: {e.response.text}")
            try:
                error_json = e.response.json()
                logger.error(f"API error details: {error_json}")
            except Exception:
                pass
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/wlan/<ssid_name>", methods=["PATCH"])
@require_session
def update_wlan_config(ssid_name):
    """Update existing WLAN."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        wlan_data = request.get_json()
        response = aruba_client.patch(
            f"/network-config/v1alpha1/wlan-ssids/{ssid_name}", data=wlan_data
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error updating WLAN {ssid_name}: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/wlan/<ssid_name>", methods=["DELETE"])
@require_session
def delete_wlan_config(ssid_name):
    """Delete a WLAN."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.delete(f"/network-config/v1alpha1/wlan-ssids/{ssid_name}")
        return jsonify({"message": f"WLAN {ssid_name} deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error deleting WLAN {ssid_name}: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/vlan/<int:vlan_id>", methods=["GET"])
@require_session
def get_vlan_config(vlan_id):
    """Get specific VLAN."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-config/v1alpha1/layer2-vlan/{vlan_id}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching VLAN {vlan_id}: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/vlan/<int:vlan_id>", methods=["POST"])
@require_session
def create_vlan_config(vlan_id):
    """Create new Layer2 VLAN."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        vlan_data = request.get_json()
        response = aruba_client.post(
            f"/network-config/v1alpha1/layer2-vlan/{vlan_id}", data=vlan_data
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error creating VLAN {vlan_id}: {e}")
        return jsonify({"error": str(e)}), 500


# Named VLAN Endpoints
@config_bp.route("/api/config/named-vlan", methods=["GET"])
@require_session
def get_named_vlans_config():
    """Get all Named VLANs."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        response = aruba_client.get("/network-config/v1alpha1/named-vlan", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching Named VLANs: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/named-vlan/<name>", methods=["GET"])
@require_session
def get_named_vlan_config(name):
    """Get specific Named VLAN."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-config/v1alpha1/named-vlan/{name}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching Named VLAN {name}: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/named-vlan/<name>", methods=["POST"])
@require_session
def create_named_vlan_config(name):
    """Create new Named VLAN."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        vlan_data = request.get_json()
        response = aruba_client.post(f"/network-config/v1alpha1/named-vlan/{name}", data=vlan_data)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error creating Named VLAN {name}: {e}")
        return jsonify({"error": str(e)}), 500


# Role Configuration Endpoints
@config_bp.route("/api/config/roles", methods=["GET"])
@require_session
def get_roles_config():
    """Get all roles."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        response = aruba_client.get("/network-config/v1alpha1/roles", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching roles: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/roles/<role_name>", methods=["GET"])
@require_session
def get_role_config(role_name):
    """Get specific role."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-config/v1alpha1/roles/{role_name}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching role {role_name}: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/roles/<role_name>", methods=["POST"])
@require_session
def create_role_config(role_name):
    """Create new role."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        role_data = request.get_json()
        params = request.args.to_dict()  # Get query parameters
        logger.info(f"Creating role {role_name} with data: {role_data}")
        logger.info(f"Query parameters: {params}")
        response = aruba_client.post(
            f"/network-config/v1alpha1/roles/{role_name}", data=role_data, params=params
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error creating role {role_name}: {e}")
        # Try to get more details from the error
        if hasattr(e, "response") and hasattr(e.response, "text"):
            logger.error(f"API response: {e.response.text}")
        return jsonify({"error": str(e)}), 500


# Role-GPID Configuration Endpoints
@config_bp.route("/api/config/role-gpids/<role_name>", methods=["POST"])
@require_session
def create_role_gpid_config(role_name):
    """Create new role-gpid."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        gpid_data = request.get_json()
        logger.info(f"Creating role-gpid {role_name} with data: {gpid_data}")
        response = aruba_client.post(
            f"/network-config/v1alpha1/role-gpids/{role_name}", data=gpid_data
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error creating role-gpid {role_name}: {e}")
        if hasattr(e, "response") and hasattr(e.response, "text"):
            logger.error(f"API response: {e.response.text}")
        return jsonify({"error": str(e)}), 500


# Policy Configuration Endpoints
@config_bp.route("/api/config/policies", methods=["GET"])
@require_session
def get_policies_config():
    """Get all policies."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        response = aruba_client.get("/network-config/v1alpha1/policies", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching policies: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/policies/<policy_name>", methods=["GET"])
@require_session
def get_policy_config(policy_name):
    """Get specific policy."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-config/v1alpha1/policies/{policy_name}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching policy {policy_name}: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/policies/<policy_name>", methods=["POST"])
@require_session
def create_policy_config(policy_name):
    """Create new policy."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        policy_data = request.get_json()
        response = aruba_client.post(
            f"/network-config/v1alpha1/policies/{policy_name}", data=policy_data
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error creating policy {policy_name}: {e}")
        return jsonify({"error": str(e)}), 500


# Scope Map Endpoints (for assigning profiles to scopes)
@config_bp.route("/api/config/scope-maps", methods=["GET", "POST"])
@require_session
def scope_maps():
    """Get all scope maps or create scope map assignments."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if request.method == "GET":
            params = request.args.to_dict()
            response = aruba_client.get("/network-config/v1alpha1/scope-maps", params=params)
            return jsonify(response)
        else:  # POST
            # Create scope map with JSON body containing scope-map array
            # Expected format: {"scope-map": [{"scope-id": ..., "persona": ..., "resource": ...}]}
            scope_map_data = request.get_json()
            logger.info(f"Creating scope maps with data: {scope_map_data}")
            response = aruba_client.post("/network-config/v1alpha1/scope-maps", data=scope_map_data)
            return jsonify(response)
    except Exception as e:
        logger.error(f"Error with scope maps: {e}")
        if hasattr(e, "response") and hasattr(e.response, "text"):
            logger.error(f"API response: {e.response.text}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/scope-maps/<path:scope_resource>", methods=["POST"])
@require_session
def create_scope_map(scope_resource):
    """
    Create scope map assignment.
    Path format: {scopeName}/{persona}/{resource}
    Example: HQ-Site/CAMPUS_AP/wlan-ssids~2FCorp-WiFi
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        # The scope_resource contains: scopeName/persona/resource
        # We forward the entire path AND query parameters to the API
        assignment_data = request.get_json()
        params = request.args.to_dict()  # Get query parameters
        logger.info(f"Creating scope map {scope_resource} with data: {assignment_data}")
        logger.info(f"Query parameters: {params}")
        response = aruba_client.post(
            f"/network-config/v1alpha1/scope-maps/{scope_resource}",
            data=assignment_data,
            params=params,
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error creating scope map {scope_resource}: {e}")
        if hasattr(e, "response") and hasattr(e.response, "text"):
            logger.error(f"API response: {e.response.text}")
        return jsonify({"error": str(e)}), 500


# MPSK (Multi-Pre-Shared-Key) Endpoints
@config_bp.route("/api/config/nac/mpsk-registration", methods=["GET"])
@require_session
def get_mpsk_registrations():
    """Get all MPSK registrations."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        response = aruba_client.get("/network-config/v1alpha1/nac/mpsk-registration", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching MPSK registrations: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/nac/mpsk-registration", methods=["POST"])
@require_session
def create_mpsk_registration():
    """Create new MPSK registration."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        mpsk_data = request.get_json()
        response = aruba_client.post(
            "/network-config/v1alpha1/nac/mpsk-registration", data=mpsk_data
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error creating MPSK registration: {e}")
        return jsonify({"error": str(e)}), 500


# Authentication Server Endpoints (for future use)
@config_bp.route("/api/config/auth-servers", methods=["GET"])
@require_session
def get_auth_servers():
    """Get all authentication servers."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        response = aruba_client.get("/network-config/v1alpha1/auth-servers", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching auth servers: {e}")
        return jsonify({"error": str(e)}), 500


# Captive Portal Endpoints (for future use)
@config_bp.route("/api/config/captive-portal-profiles", methods=["GET"])
@require_session
def get_captive_portal_profiles():
    """Get all captive portal profiles."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        response = aruba_client.get(
            "/network-config/v1alpha1/captive-portal-profiles", params=params
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching captive portal profiles: {e}")
        return jsonify({"error": str(e)}), 500


# Static Route Configuration Endpoints
@config_bp.route("/api/config/static-routes", methods=["GET"])
@require_session
def get_static_routes():
    """Get static route configurations."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        params = {}
        group = request.args.get("group")
        if group:
            params["group"] = group
        device_serial = request.args.get("serial")
        if device_serial:
            params["serial"] = device_serial
        response = aruba_client.get("/network-config/v1alpha1/static-route", params=params)
        return jsonify(response if response else {"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching static routes: {e}")
        return jsonify({"error": "Failed to fetch static routes"}), 500


@config_bp.route("/api/config/static-routes", methods=["POST"])
@require_session
def create_static_route():
    """Create a new static route."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body required"}), 400
        group = request.args.get("group")
        params = {}
        if group:
            params["group"] = group
        response = aruba_client.post(
            "/network-config/v1alpha1/static-route", data=data, params=params
        )
        return jsonify(response if response else {"success": True})
    except Exception as e:
        logger.error(f"Error creating static route: {e}")
        return jsonify({"error": "Failed to create static route"}), 500


@config_bp.route("/api/config/static-routes/<path:route_id>", methods=["DELETE"])
@require_session
def delete_static_route(route_id):
    """Delete a static route."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        group = request.args.get("group")
        params = {}
        if group:
            params["group"] = group
        response = aruba_client.delete(
            f"/network-config/v1alpha1/static-route/{route_id}", params=params
        )
        return jsonify(response if response else {"success": True})
    except Exception as e:
        logger.error(f"Error deleting static route: {e}")
        return jsonify({"error": "Failed to delete static route"}), 500


# ACL/Firewall Configuration Endpoints (read-only)
@config_bp.route("/api/config/acls", methods=["GET"])
@require_session
def get_acls():
    """Get ACL configurations."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        params = {}
        group = request.args.get("group")
        if group:
            params["group"] = group
        response = aruba_client.get("/network-config/v1alpha1/role-acl", params=params)
        return jsonify(response if response else {"items": [], "count": 0})
    except Exception as e:
        sc = getattr(e, 'status_code', None)
        if sc in (400, 404) or any(x in str(e) for x in ('404', 'Not Found', 'Bad Request')):
            logger.warning(f"ACL endpoint unavailable: {e}")
            return jsonify({"items": [], "count": 0})
        logger.error(f"Error fetching ACLs: {e}")
        return jsonify({"error": "Failed to fetch ACL configuration"}), 500


# STP Configuration Endpoints (read-only)
@config_bp.route("/api/config/stp", methods=["GET"])
@require_session
def get_stp_config():
    """Get Spanning Tree Protocol configurations."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        params = {}
        group = request.args.get("group")
        if group:
            params["group"] = group
        response = aruba_client.get("/network-config/v1alpha1/stp", params=params)
        return jsonify(response if response else {"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching STP config: {e}")
        return jsonify({"error": "Failed to fetch STP configuration"}), 500


# Network Services Configuration Endpoints
@config_bp.route("/api/config/dhcp-pools", methods=["GET"])
@require_session
def get_dhcp_pools():
    """Get DHCP server pool configurations."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        params = {}
        group = request.args.get("group")
        if group:
            params["group"] = group
        response = aruba_client.get("/network-config/v1alpha1/dhcp-server", params=params)
        return jsonify(response if response else {"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching DHCP pools: {e}")
        return jsonify({"error": "Failed to fetch DHCP configuration"}), 500


@config_bp.route("/api/config/ntp", methods=["GET"])
@require_session
def get_ntp_config():
    """Get NTP server configurations."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        params = {}
        group = request.args.get("group")
        if group:
            params["group"] = group
        response = aruba_client.get("/network-config/v1alpha1/ntp", params=params)
        return jsonify(response if response else {"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching NTP config: {e}")
        return jsonify({"error": "Failed to fetch NTP configuration"}), 500


@config_bp.route("/api/config/dns", methods=["GET"])
@require_session
def get_dns_config():
    """Get DNS resolver configurations."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        params = {}
        group = request.args.get("group")
        if group:
            params["group"] = group
        response = aruba_client.get("/network-config/v1alpha1/dns", params=params)
        return jsonify(response if response else {"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching DNS config: {e}")
        return jsonify({"error": "Failed to fetch DNS configuration"}), 500


@config_bp.route("/api/config/snmp", methods=["GET"])
@require_session
def get_snmp_config():
    """Get SNMP configurations."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        params = {}
        group = request.args.get("group")
        if group:
            params["group"] = group
        response = aruba_client.get("/network-config/v1alpha1/snmp", params=params)
        return jsonify(response if response else {"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching SNMP config: {e}")
        return jsonify({"error": "Failed to fetch SNMP configuration"}), 500


@config_bp.route("/api/config/syslog", methods=["GET"])
@require_session
def get_syslog_config():
    """Get syslog/logging configurations."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        params = {}
        group = request.args.get("group")
        if group:
            params["group"] = group
        response = aruba_client.get("/network-config/v1alpha1/logging", params=params)
        return jsonify(response if response else {"items": [], "count": 0})
    except Exception as e:
        logger.error(f"Error fetching syslog config: {e}")
        return jsonify({"error": "Failed to fetch syslog configuration"}), 500


# ============= Client Endpoints =============


@config_bp.route("/api/clients", methods=["GET"])
@require_session
def get_clients():
    """Get connected clients — tries multiple endpoints in order of reliability."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500

        site_id = request.args.get("site_id", request.args.get("site-id"))
        connection_type = request.args.get("connection_type")
        ssid = request.args.get("ssid")
        # Central API caps page size at 100; caller can set a max total via ?limit=
        max_total = int(request.args.get("limit", 2000))
        page_size = 100

        base_params = {"limit": page_size}
        if site_id:
            base_params["site-id"] = site_id
        if connection_type:
            base_params["filter"] = f"clientConnectionType eq '{connection_type}'"
        if ssid:
            f = base_params.get("filter", "")
            base_params["filter"] = (f + " and " if f else "") + f"wlanName eq '{ssid}'"

        # Try v1 first (what MCP uses and what works)
        endpoints_to_try = [
            ("/network-monitoring/v1/clients", lambda r: r.get("clients", r.get("items", []))),
            ("/monitoring/v2/clients", lambda r: r.get("clients", r.get("items", []))),
            ("/monitoring/v1/clients", lambda r: r.get("clients", r.get("items", []))),
        ]

        all_clients = []
        for endpoint, extractor in endpoints_to_try:
            try:
                response = aruba_client.get(endpoint, params=base_params)
                clients = extractor(response)
                total = response.get("total", response.get("count", len(clients)))
                logger.info(f"Clients fetched from {endpoint}: {len(clients)} (total={total})")
                all_clients = list(clients)

                # Auto-paginate 100 at a time until we have everything (or hit max_total)
                while len(all_clients) < total and len(all_clients) < max_total:
                    next_params = {**base_params, "offset": len(all_clients)}
                    next_resp = aruba_client.get(endpoint, params=next_params)
                    next_page = extractor(next_resp)
                    if not next_page:
                        break
                    all_clients.extend(next_page)
                break
            except Exception as e:
                logger.warning(f"Clients endpoint {endpoint} failed: {e}")
                continue

        return jsonify(
            {
                "count": len(all_clients),
                "clients": all_clients,
                "items": all_clients,  # keep both keys for compatibility
                "total": len(all_clients),
            }
        )

    except Exception as e:
        logger.error(f"Error fetching clients: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/clients/trends", methods=["GET"])
@require_session
def get_client_trends():
    """Get client connection trends, optionally filtered by site."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        site_id = request.args.get("site_id", request.args.get("site-id"))
        params = {}
        if site_id:
            params["site-id"] = site_id

        response = aruba_client.get("/network-monitoring/v1/clients-trend", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching client trends: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/clients/usage/topn", methods=["GET"])
@require_session
def get_top_clients():
    """Get top N clients by usage, optionally filtered by site."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        site_id = request.args.get("site_id", request.args.get("site-id"))
        params = {}
        if site_id:
            params["site-id"] = site_id

        response = aruba_client.get("/network-monitoring/v1/clients-topn-usage", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching top clients: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/clients/health", methods=["GET"])
@require_session
def get_client_health_summary():
    """Aggregate client health: counts by status, type, and signal quality."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        params.setdefault("limit", "500")
        response = aruba_client.get("/network-monitoring/v1/clients", params=params)
        items = response.get("items", [])

        # Aggregate by status
        by_status = {}
        by_type = {}
        by_signal = {"excellent": 0, "good": 0, "fair": 0, "poor": 0, "unknown": 0}

        for client in items:
            status = client.get("status", "UNKNOWN")
            by_status[status] = by_status.get(status, 0) + 1

            ctype = client.get("clientConnectionType", client.get("connectionType", "UNKNOWN"))
            by_type[ctype] = by_type.get(ctype, 0) + 1

            snr = client.get("snr", client.get("signalStrength", None))
            if snr is None:
                by_signal["unknown"] += 1
            elif snr >= 40:
                by_signal["excellent"] += 1
            elif snr >= 25:
                by_signal["good"] += 1
            elif snr >= 15:
                by_signal["fair"] += 1
            else:
                by_signal["poor"] += 1

        return jsonify(
            {
                "total": response.get("total", len(items)),
                "count": len(items),
                "by_status": by_status,
                "by_connection_type": by_type,
                "by_signal_quality": by_signal,
                "items": items,
            }
        )
    except Exception as e:
        logger.error(f"Error fetching client health: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/clients/<mac>", methods=["GET"])
@require_session
def get_client_by_mac(mac):
    """Get detailed information for a specific client by MAC address.

    Tries multiple API endpoints (following the same pattern as the MCP
    get_client_details tool) and merges all results.  Legacy /monitoring/v1
    returns fingerprinting fields (device_type, os_type, manufacturer, os,
    labels); the new network-monitoring v1/v1alpha1 endpoints return
    connectivity and performance fields.  The session endpoint adds real-time
    performance data (SNR, throughput, retry rate, etc.).

    Priority (highest wins): legacy > new-API detail > session
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        legacy_data = {}
        new_data = {}
        session_data = {}

        # Normalise MAC for endpoints that want no separators
        mac_no_sep = mac.lower().replace(":", "").replace("-", "")

        # Legacy API — device fingerprinting: device_type, os_type, manufacturer, os, labels
        try:
            legacy_data = aruba_client.get(f"/monitoring/v1/clients/{mac}") or {}
        except Exception as le:
            logger.debug(f"Legacy client endpoint failed for {mac}: {le}")

        # New API — try the same endpoint variants the MCP tool uses so we get
        # whatever the platform actually supports.
        for endpoint in [
            f"/network-monitoring/v1/clients/{mac}",
            f"/network-monitoring/v1/clients/details?macAddress={mac}",
            f"/network-monitoring/v1alpha1/clients/{mac_no_sep}",
        ]:
            try:
                data = aruba_client.get(endpoint) or {}
                if data and not data.get("error"):
                    new_data = data
                    logger.debug(f"Client detail fetched from {endpoint}")
                    break
            except Exception as ne:
                logger.debug(f"New client endpoint {endpoint} failed for {mac}: {ne}")

        # Session endpoint — real-time performance metrics (SNR, throughput, etc.)
        try:
            session_data = aruba_client.get(f"/network-monitoring/v1/clients/{mac}/session") or {}
        except Exception as se:
            logger.debug(f"Session endpoint failed for {mac}: {se}")

        if not legacy_data and not new_data and not session_data:
            return jsonify({"error": "Client not found"}), 404

        # Merge priority: legacy fingerprinting > new-API detail > session (base)
        merged = {**session_data, **new_data, **legacy_data}
        return jsonify(merged)
    except Exception as e:
        logger.error(f"Error fetching client {mac}: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/clients/<mac>/mobility-trail", methods=["GET"])
@require_session
def get_client_mobility_trail(mac):
    """Get mobility trail (roaming history) for a client.

    Endpoint: /network-monitoring/v1/clients/{mac-address}/mobility-trail
    Shows AP-to-AP roaming history for a wireless client.
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get(f"/network-monitoring/v1/clients/{mac}/mobility-trail", params=params)
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching mobility trail for client {mac}: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Site Health Endpoints =============


@config_bp.route("/api/sites/health", methods=["GET"])
@require_session
def get_sites_health():
    """Get sites health with optional fields parameter.
    If fields=devices fails, fallback to request without fields parameter.
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500

        params = request.args.to_dict()
        # Aruba Central sites-health API enforces limit <= 100
        if "limit" in params:
            params["limit"] = min(int(params["limit"]), 100)
        endpoint = "/network-monitoring/v1/sites-health"

        # Try with fields parameter if provided
        if "fields" in params:
            try:
                logger.info(f"Attempting sites-health with fields={params.get('fields')}")
                response = cached_get(endpoint, params=params)
                logger.info(
                    f"Sites health response received: type={type(response)}, is None: {response is None}"
                )
                if response is None:
                    logger.warning("Aruba Central API returned None/empty response")
                    return jsonify({"count": 0, "items": []})
                logger.info(
                    f"Response keys: {list(response.keys()) if isinstance(response, dict) else 'not a dict'}"
                )
                logger.info(
                    f"Response count: {response.get('count', 'N/A') if isinstance(response, dict) else 'N/A'}"
                )
                return jsonify(response)
            except Exception as e:
                error_str = str(e)
                logger.warning(f"Sites health with fields parameter failed: {error_str}")
                params_without_fields = {k: v for k, v in params.items() if k != "fields"}
                logger.info(f"Retrying sites-health without fields parameter")
                try:
                    response = cached_get(endpoint, params=params_without_fields)
                    logger.info(
                        f"Sites health fallback response: type={type(response)}, is None: {response is None}"
                    )
                    if response is None:
                        logger.warning("Aruba Central API returned None/empty response (fallback)")
                        return jsonify({"count": 0, "items": []})
                    logger.info(
                        f"Fallback response keys: {list(response.keys()) if isinstance(response, dict) else 'not a dict'}"
                    )
                    logger.warning(
                        f"Sites health succeeded without fields parameter. The 'fields' parameter may not be supported."
                    )
                    return jsonify(response)
                except Exception as e2:
                    logger.error(f"Sites health failed even without fields: {e2}")
                    raise e
        else:
            response = cached_get(endpoint, params=params)
            logger.info(
                f"Sites health response (no fields): type={type(response)}, is None: {response is None}"
            )
            if response is None:
                logger.warning("Aruba Central API returned None/empty response")
                return jsonify({"count": 0, "items": []})
            logger.info(
                f"Response keys: {list(response.keys()) if isinstance(response, dict) else 'not a dict'}"
            )
            return jsonify(response)
    except Exception as e:
        error_str = str(e)
        logger.error(f"Sites health error: {error_str}", exc_info=True)

        # Extract HTTP error details if available
        if isinstance(e, requests.HTTPError):
            try:
                error_response_text = e.response.text if hasattr(e, "response") else None
                error_status_code = e.response.status_code if hasattr(e, "response") else None
                return (
                    jsonify(
                        {
                            "error": f"HTTP {error_status_code}: {error_response_text or error_str}",
                            "endpoint": endpoint,
                            "params": params,
                        }
                    ),
                    error_status_code or 500,
                )
            except Exception:
                pass

        return jsonify({"error": error_str, "endpoint": endpoint}), 500


@config_bp.route("/api/sites/device-health", methods=["GET"])
@require_session
def get_sites_device_health():
    """Sites device health — caps limit at 100 (API restriction)."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500
        params = request.args.to_dict()
        if "limit" in params:
            params["limit"] = min(int(params["limit"]), 100)
        response = aruba_client.get("/network-monitoring/v1/sites-device-health", params=params)
        return jsonify(response or {"items": []})
    except Exception as e:
        logger.error(f"Sites device health error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/tenant/device-health", methods=["GET"])
@require_session
@api_proxy("/network-monitoring/v1/tenant-device-health", error_msg="Tenant device health")
def get_tenant_device_health():
    pass


@config_bp.route("/api/sites/client-health", methods=["GET"])
@require_session
def get_sites_client_health():
    """Get client health metrics aggregated per site.

    Endpoint: /network-monitoring/v1/sites-client-health
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        if "site_id" in params and "site-id" not in params:
            params["site-id"] = params.pop("site_id")
        r = aruba_client.get("/network-monitoring/v1/sites-client-health", params=params)
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching sites client health: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/tenant/client-health", methods=["GET"])
@require_session
def get_tenant_client_health():
    """Get client health metrics aggregated at the tenant level.

    Endpoint: /network-monitoring/v1/tenant-client-health
    """
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = request.args.to_dict()
        r = aruba_client.get("/network-monitoring/v1/tenant-client-health", params=params)
        return jsonify(r)
    except Exception as e:
        logger.error(f"Error fetching tenant client health: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Network Config Sites Endpoints =============


@config_bp.route("/api/sites/config", methods=["GET", "POST", "PUT", "DELETE"])
@require_session
def sites_config():
    """Handle site configuration operations using network-config API."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        if not aruba_client:
            return jsonify({"error": "Server not configured"}), 500

        if request.method == "GET":
            # GET sites
            response = aruba_client.get("/network-config/v1alpha1/sites")
            return jsonify(response if response else [])

        elif request.method == "POST":
            # Create new site
            data = request.get_json()
            response = aruba_client.post("/network-config/v1alpha1/sites", data=data)
            return jsonify(response)

        elif request.method == "PUT":
            # Update existing site
            data = request.get_json()
            response = aruba_client.put("/network-config/v1alpha1/sites", data=data)
            return jsonify(response)

        elif request.method == "DELETE":
            # Delete site
            scope_id = request.args.get("scope-id")
            if not scope_id:
                return jsonify({"error": "scope-id query parameter is required"}), 400

            params = {"scope-id": scope_id}
            response = aruba_client.delete("/network-config/v1alpha1/sites", params=params)
            return jsonify(response)
        else:
            return jsonify({"error": "Method not allowed"}), 405
    except Exception as e:
        logger.error(f"Error in site config operation: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Configuration Endpoints =============


@config_bp.route("/api/sites", methods=["GET"])
@require_session
def get_sites():
    """Get all sites with auto-pagination for large deployments."""
    try:
        params = request.args.to_dict()
        response = cached_get_paginated(
            "/network-config/v1/sites",
            params=params,
            max_pages=10,
            page_size=100,
        )
        return jsonify(response)
    except CentralAPIError as e:
        logger.error(f"Sites: HTTP {e.status_code} {e.error_code}: {e.message}", exc_info=True)
        if e.status_code == 404:
            return jsonify({"items": [], "count": 0, "total": 0})
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        logger.error(f"Sites: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/sites/<site_id>", methods=["GET"])
@require_session
@api_proxy(
    lambda site_id: f"/network-config/v1/sites/{site_id}",
    error_msg="Site details",
    fallback_data={},
)
def get_site_details(site_id):
    pass


@config_bp.route("/api/sites", methods=["POST"])
@require_session
@api_proxy("/network-config/v1/sites", method="POST", error_msg="Create site")
def create_site():
    pass


@config_bp.route("/api/sites/<site_id>", methods=["DELETE"])
@require_session
@api_proxy(
    lambda site_id: f"/network-config/v1/sites/{site_id}", method="DELETE", error_msg="Delete site"
)
def delete_site(site_id):
    pass


@config_bp.route("/api/groups", methods=["GET"])
@require_session
def get_groups():
    """Get all groups with auto-pagination for large deployments."""
    try:
        params = request.args.to_dict()
        response = cached_get_paginated(
            "/configuration/v1/groups",
            params=params,
            items_key="groups",
            max_pages=10,
            page_size=100,
        )
        return jsonify(response)
    except CentralAPIError as e:
        logger.error(f"Groups: HTTP {e.status_code} {e.error_code}: {e.message}", exc_info=True)
        if e.status_code == 404:
            return jsonify({"groups": [], "count": 0, "total": 0})
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        logger.error(f"Groups: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/groups", methods=["POST"])
@require_session
def create_group():
    """Create a new device group."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        data = request.get_json()
        if not data or not data.get("group"):
            return jsonify({"error": "group name is required"}), 400
        response = aruba_client.post("/configuration/v1/groups", json=data)
        return jsonify(response or {"success": True})
    except Exception as e:
        logger.error(f"Error creating group: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/groups/<group_name>", methods=["DELETE"])
@require_session
def delete_group(group_name):
    """Delete a device group by name."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.delete(f"/configuration/v1/groups/{group_name}")
        return jsonify(response or {"success": True})
    except Exception as e:
        logger.error(f"Error deleting group {group_name}: {e}")
        return jsonify({"error": str(e)}), 500


# ============= NAC (Network Access Control) Endpoints =============


@config_bp.route("/api/nac/user-roles", methods=["GET"])
@require_session
@api_proxy("/configuration/v1/user_roles", error_msg="NAC user roles")
def get_nac_user_roles():
    pass


@config_bp.route("/api/nac/device-profiles", methods=["GET"])
@require_session
@api_proxy("/configuration/v1/device_profile", error_msg="NAC device profiles")
def get_nac_device_profiles():
    pass


@config_bp.route("/api/nac/client-auth", methods=["GET"])
@require_session
def get_nac_client_auth():
    """Get NAC client authentication status."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        site_id = request.args.get("site_id", request.args.get("site-id"))

        if not site_id:
            return (
                jsonify(
                    {
                        "error": "site-id parameter is required",
                        "message": "Please provide site-id as a query parameter",
                    }
                ),
                400,
            )

        params = {"site-id": site_id}
        response = aruba_client.get("/network-monitoring/v1/clients", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching NAC client auth: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/nac/policies", methods=["GET"])
@require_session
@api_proxy("/configuration/v1/auth_policies", error_msg="NAC policies")
def get_nac_policies():
    pass


@config_bp.route("/api/nac/certificates", methods=["GET"])
@require_session
@api_proxy("/configuration/v1/certificates", error_msg="NAC certificates")
def get_nac_certificates():
    pass


@config_bp.route("/api/nac/radius-profiles", methods=["GET"])
@require_session
@api_proxy("/configuration/v1/radius_server", error_msg="RADIUS profiles")
def get_nac_radius_profiles():
    pass


@config_bp.route("/api/nac/onboarding-rules", methods=["GET"])
@require_session
@api_proxy("/configuration/v1/onboarding_rules", error_msg="Onboarding rules")
def get_nac_onboarding_rules():
    pass


@config_bp.route("/api/nac/mac-registrations", methods=["GET"])
@require_session
def get_mac_registrations():
    """List all MAC registrations."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        params = {}
        raw_limit = request.args.get("limit")
        if raw_limit:
            params["limit"] = min(int(raw_limit), 100)
        if request.args.get("offset"):
            params["offset"] = request.args.get("offset")
        response = aruba_client.get("/network-config/v1alpha1/nac/mac-registration", params=params)
        return jsonify(response)
    except Exception as e:
        sc = getattr(e, 'status_code', None)
        err = str(e)
        if sc in (400, 404) or any(x in err for x in ('404', 'Not Found', 'Invalid module', 'module name', 'Bad Request')):
            logger.warning(f"MAC registrations endpoint unavailable: {e}")
            return jsonify({"items": [], "count": 0, "total": 0})
        logger.error(f"Error fetching MAC registrations: {e}")
        return jsonify({"error": err}), 500


@config_bp.route("/api/nac/mac-registrations", methods=["POST"])
@require_session
def create_mac_registration():
    """Create a new MAC registration."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        data = request.get_json()
        if not data or not data.get("macAddress"):
            return jsonify({"error": "macAddress is required"}), 400
        response = aruba_client.post("/network-config/v1alpha1/nac/mac-registration", data=data)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error creating MAC registration: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/nac/mac-registrations/<mac_id>", methods=["DELETE"])
@require_session
def delete_mac_registration(mac_id):
    """Delete a MAC registration by ID."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.delete(f"/network-config/v1alpha1/nac/mac-registration/{mac_id}")
        return jsonify(response or {"success": True})
    except Exception as e:
        logger.error(f"Error deleting MAC registration {mac_id}: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Scope Management Endpoints =============


@config_bp.route("/api/scope/labels", methods=["GET"])
@require_session
def get_scope_labels():
    """Get all labels with auto-pagination for large deployments."""
    try:
        params = request.args.to_dict()
        response = cached_get_paginated(
            "/central/v2/labels",
            params=params,
            items_key="labels",
            max_pages=10,
            page_size=100,
        )
        return jsonify(response)
    except CentralAPIError as e:
        logger.error(f"Labels: HTTP {e.status_code} {e.error_code}: {e.message}", exc_info=True)
        if e.status_code == 404:
            return jsonify({"labels": [], "count": 0, "total": 0})
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        logger.error(f"Labels: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/scope/labels", methods=["POST"])
@require_session
@api_proxy("/central/v2/labels", method="POST", error_msg="Create label")
def create_scope_label():
    pass


@config_bp.route("/api/scope/labels/<label_id>", methods=["DELETE"])
@require_session
@api_proxy(
    lambda label_id: f"/central/v2/labels/{label_id}", method="DELETE", error_msg="Delete label"
)
def delete_scope_label(label_id):
    pass


@config_bp.route("/api/scope/label-associations", methods=["GET"])
@require_session
def get_label_associations():
    """Get device and site associations for labels."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        label_id = request.args.get("label_id")
        if not label_id:
            return jsonify({"error": "label_id parameter required"}), 400

        response = aruba_client.get(f"/central/v2/labels/{label_id}/associations")
        return jsonify(response)
    except CentralAPIError as e:
        logger.error(f"Error fetching label associations: HTTP {e.status_code} {e.error_code}: {e.message}")
        if e.status_code == 404:
            return jsonify({"devices": [], "sites": [], "count": 0})
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        logger.error(f"Error fetching label associations: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/scope/geofences", methods=["GET"])
@require_session
@api_proxy(
    "/central/v2/geofences",
    error_msg="Geofences",
    fallback_data={"geofences": [], "count": 0, "total": 0},
)
def get_geofences():
    pass


@config_bp.route("/api/scope/site-hierarchy", methods=["GET"])
@require_session
def get_site_hierarchy():
    """Get site hierarchy and relationships."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        # Get all sites first
        sites_response = cached_get("/central/v2/sites")
        sites = sites_response.get("sites", [])

        # Build hierarchy structure
        hierarchy = {"sites": sites, "total": len(sites), "hierarchy": {}}

        # Group by any parent/child relationships if available
        for site in sites:
            site_id = site.get("site_id")
            if site_id:
                hierarchy["hierarchy"][site_id] = site

        return jsonify(hierarchy)
    except CentralAPIError as e:
        logger.error(f"Error fetching site hierarchy: HTTP {e.status_code} {e.error_code}: {e.message}")
        if e.status_code == 404:
            return jsonify({"sites": [], "total": 0, "hierarchy": {}})
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        logger.error(f"Error fetching site hierarchy: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Application Experience Endpoints =============


@config_bp.route("/api/appexperience/applications", methods=["GET"])
@require_session
@api_proxy("/monitoring/v1/applications", error_msg="Applications")
def get_applications():
    pass


@config_bp.route("/api/appexperience/app-categories", methods=["GET"])
@require_session
@api_proxy("/monitoring/v1/app_categories", error_msg="App categories")
def get_app_categories():
    pass


@config_bp.route("/api/appexperience/traffic-analysis", methods=["GET"])
@require_session
def get_traffic_analysis():
    """Get application traffic analysis data."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        # Get traffic data with filters
        params = {}
        if request.args.get("app_name"):
            params["app_name"] = request.args.get("app_name")
        # Normalize site id
        site_id = request.args.get("site_id", request.args.get("site-id"))
        if site_id:
            params["site-id"] = site_id
        # Time range
        if request.args.get("from_timestamp"):
            params["from_timestamp"] = request.args.get("from_timestamp")
        if request.args.get("to_timestamp"):
            params["to_timestamp"] = request.args.get("to_timestamp")
        if request.args.get("timeframe"):
            params["timeframe"] = request.args.get("timeframe")

        response = aruba_client.get("/monitoring/v1/app_analytics", params=params)
        return jsonify(response)
    except CentralAPIError as e:
        if e.status_code in (400, 404):
            logger.warning(f"Traffic analysis error treated as empty: HTTP {e.status_code} {e.error_code}")
            return jsonify({"items": [], "count": 0})
        logger.error(f"Error fetching traffic analysis: {e.message}")
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        logger.error(f"Error fetching traffic analysis: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/appexperience/qos-policies", methods=["GET"])
@require_session
@api_proxy("/configuration/v1/qos", error_msg="QoS policies")
def get_qos_policies():
    pass


@config_bp.route("/api/appexperience/dpi-settings", methods=["GET"])
@require_session
@api_proxy("/configuration/v1/dpi", error_msg="DPI settings")
def get_dpi_settings():
    pass


@config_bp.route("/api/appexperience/app-visibility", methods=["GET"])
@require_session
def get_app_visibility():
    """Get application visibility settings and stats."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        group = request.args.get("group", "all")
        params = {"group": group} if group != "all" else {}
        response = aruba_client.get("/monitoring/v1/app_visibility", params=params)
        return jsonify(response)
    except CentralAPIError as e:
        if e.status_code in (400, 404):
            logger.warning(f"App visibility error treated as empty: HTTP {e.status_code} {e.error_code}")
            return jsonify({"items": [], "count": 0})
        logger.error(f"Error fetching app visibility: {e.message}")
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        logger.error(f"Error fetching app visibility: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Bulk Configuration Endpoints =============


@config_bp.route("/api/config/bulk-ap-rename", methods=["POST"])
@require_session
def bulk_ap_rename():
    """Bulk rename access points from CSV data."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        data = request.get_json()
        ap_mappings = data.get("mappings", [])  # [{'serial': 'xxx', 'new_name': 'yyy'}, ...]

        if not ap_mappings:
            return jsonify({"error": "No AP mappings provided"}), 400

        results = []
        for mapping in ap_mappings:
            serial = mapping.get("serial")
            new_name = mapping.get("new_name")

            if not serial or not new_name:
                results.append(
                    {"serial": serial, "status": "failed", "error": "Missing serial or new_name"}
                )
                continue

            try:
                # Update AP name via Central API
                response = aruba_client.post(
                    f"/configuration/v1/ap/{serial}", data={"hostname": new_name}
                )
                results.append({"serial": serial, "new_name": new_name, "status": "success"})
            except Exception as e:
                results.append({"serial": serial, "status": "failed", "error": str(e)})

        success_count = sum(1 for r in results if r["status"] == "success")
        return jsonify(
            {
                "total": len(ap_mappings),
                "successful": success_count,
                "failed": len(ap_mappings) - success_count,
                "results": results,
            }
        )
    except Exception as e:
        logger.error(f"Bulk AP rename error: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/bulk-group-assign", methods=["POST"])
@require_session
def bulk_group_assign():
    """Bulk assign devices to groups."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        data = request.get_json()
        device_group_mappings = data.get("mappings", [])  # [{'serial': 'xxx', 'group': 'yyy'}, ...]

        results = []
        for mapping in device_group_mappings:
            serial = mapping.get("serial")
            group = mapping.get("group")

            if not serial or not group:
                results.append(
                    {"serial": serial, "status": "failed", "error": "Missing serial or group"}
                )
                continue

            try:
                response = aruba_client.post(
                    f"/configuration/v2/devices/{serial}/group", data={"group": group}
                )
                results.append({"serial": serial, "group": group, "status": "success"})
            except Exception as e:
                results.append({"serial": serial, "status": "failed", "error": str(e)})

        success_count = sum(1 for r in results if r["status"] == "success")
        return jsonify(
            {
                "total": len(device_group_mappings),
                "successful": success_count,
                "failed": len(device_group_mappings) - success_count,
                "results": results,
            }
        )
    except Exception as e:
        logger.error(f"Bulk group assign error: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/bulk-site-assign", methods=["POST"])
@require_session
def bulk_site_assign():
    """Bulk assign devices to sites."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        data = request.get_json()
        device_site_mappings = data.get("mappings", [])

        results = []
        for mapping in device_site_mappings:
            serial = mapping.get("serial")
            site_id = mapping.get("site_id")

            if not serial or not site_id:
                results.append(
                    {"serial": serial, "status": "failed", "error": "Missing serial or site_id"}
                )
                continue

            try:
                response = aruba_client.post(
                    f"/central/v2/sites/associations",
                    data={"device_id": serial, "site_id": site_id},
                )
                results.append({"serial": serial, "site_id": site_id, "status": "success"})
            except Exception as e:
                results.append({"serial": serial, "status": "failed", "error": str(e)})

        success_count = sum(1 for r in results if r["status"] == "success")
        return jsonify(
            {
                "total": len(device_site_mappings),
                "successful": success_count,
                "failed": len(device_site_mappings) - success_count,
                "results": results,
            }
        )
    except Exception as e:
        logger.error(f"Bulk site assign error: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/export", methods=["GET"])
@require_session
def export_configuration():
    """Export device configuration."""
    import app as _app
    import json

    aruba_client = _app.aruba_client
    try:
        serial = request.args.get("serial")
        if not serial:
            return jsonify({"error": "Device serial required"}), 400

        # Try New Central path first, fall back to legacy
        response = None
        for endpoint in [
            f"/network-config/v1/devices/{serial}/config",
            f"/configuration/v1/devices/{serial}/configuration",
        ]:
            try:
                response = aruba_client.get(endpoint)
                if response and not response.get("error"):
                    break
            except Exception:
                continue

        if not response:
            return jsonify({"error": "Could not retrieve configuration from device"}), 404

        # Extract config text — handle plain-text wrapped as {"text": "..."} by the client
        config_text = (
            response.get("config")
            or response.get("configuration")
            or response.get("text")
            or json.dumps(response, indent=2)
        )

        if not isinstance(config_text, str):
            config_text = json.dumps(config_text, indent=2)

        resp = make_response(config_text)
        resp.headers["Content-Type"] = "text/plain"
        resp.headers["Content-Disposition"] = f"attachment; filename={serial}_config.txt"
        return resp
    except Exception as e:
        logger.error(f"Config export error: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Workspace Management Endpoints =============


@config_bp.route("/api/workspace/switch", methods=["POST"])
@require_session
def switch_workspace():
    """Switch to a different workspace with new credentials."""
    import app as _app
    import os
    from utils.central_api_client import CentralAPIClient
    from utils.token_manager import TokenManager

    try:
        data = request.get_json()
        new_client_id = data.get("client_id")
        new_client_secret = data.get("client_secret")
        new_customer_id = data.get("customer_id")
        base_url = data.get("base_url", _app.config["aruba_central"]["base_url"])

        # Optional: GreenLake RBAC credentials for MSP workspace switching
        gl_client_id = data.get("gl_client_id")
        gl_client_secret = data.get("gl_client_secret")
        gl_api_base = data.get("gl_api_base", "https://global.api.greenlake.hpe.com")

        if not all([new_client_id, new_client_secret, new_customer_id]):
            return jsonify({"error": "client_id, client_secret, and customer_id are required"}), 400

        # Validate base_url is a proper HTTPS URL
        if base_url and not base_url.startswith("https://"):
            return jsonify({"error": "base_url must use HTTPS"}), 400

        # Update configuration
        _app.config["aruba_central"]["client_id"] = new_client_id
        _app.config["aruba_central"]["client_secret"] = new_client_secret
        _app.config["aruba_central"]["customer_id"] = new_customer_id
        _app.config["aruba_central"]["base_url"] = base_url

        # Reinitialize token manager and client for Aruba Central
        _app.token_manager = TokenManager(client_id=new_client_id, client_secret=new_client_secret)

        _app.aruba_client = CentralAPIClient(base_url=base_url, token_manager=_app.token_manager)

        # Update GreenLake credentials if provided (for MSP workspace switching)
        if gl_client_id and gl_client_secret:
            os.environ["GL_RBAC_CLIENT_ID"] = gl_client_id
            os.environ["GL_RBAC_CLIENT_SECRET"] = gl_client_secret
            os.environ["GL_API_BASE"] = gl_api_base
            logger.info("GreenLake RBAC credentials updated for workspace switch")

        logger.info(f"Workspace switched to customer_id: {new_customer_id[:16]}...")

        return jsonify(
            {
                "success": True,
                "message": "Workspace switched successfully",
                "customer_id": new_customer_id[:16] + "...",
                "base_url": base_url,
                "greenlake_updated": bool(gl_client_id and gl_client_secret),
            }
        )
    except Exception as e:
        logger.error(f"Workspace switch error: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/workspace/info", methods=["GET"])
@require_session
def get_workspace_info():
    """Get current workspace information."""
    import app as _app

    try:
        return jsonify(
            {
                "customer_id": (
                    _app.config["aruba_central"]["customer_id"][:16] + "..."
                    if _app.config
                    else "Unknown"
                ),
                "base_url": _app.config["aruba_central"]["base_url"] if _app.config else "Unknown",
                "region": (
                    _app.config["aruba_central"].get("region", "Unknown")
                    if _app.config
                    else "Unknown"
                ),
            }
        )
    except Exception as e:
        logger.error(f"Error getting workspace info: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/workspace/greenlake", methods=["POST"])
@require_session
def save_greenlake_credentials():
    """Save GreenLake API credentials without changing Central workspace."""
    import os

    try:
        data = request.get_json()
        gl_client_id = data.get("gl_client_id")
        gl_client_secret = data.get("gl_client_secret")
        gl_api_base = data.get("gl_api_base", "https://global.api.greenlake.hpe.com")

        if not gl_client_id or not gl_client_secret:
            return jsonify({"error": "gl_client_id and gl_client_secret are required"}), 400

        os.environ["GL_RBAC_CLIENT_ID"] = gl_client_id
        os.environ["GL_RBAC_CLIENT_SECRET"] = gl_client_secret
        os.environ["GL_API_BASE"] = gl_api_base

        logger.info("GreenLake API credentials updated")
        return jsonify({"success": True, "message": "GreenLake credentials saved successfully"})
    except Exception as e:
        logger.error(f"Error saving GreenLake credentials: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/workspace/greenlake/status", methods=["GET"])
@require_session
def get_greenlake_status():
    """Check if GreenLake API credentials are configured."""
    import os

    configured = bool(os.environ.get("GL_RBAC_CLIENT_ID") and os.environ.get("GL_RBAC_CLIENT_SECRET"))
    return jsonify({
        "configured": configured,
        "api_base": os.environ.get("GL_API_BASE", "https://global.api.greenlake.hpe.com"),
    })


# ============= Site Health — Individual Site =============


@config_bp.route("/api/sites/<site_id>/health", methods=["GET"])
@require_session
def get_site_health(site_id):
    """Get detailed health metrics for a specific site."""
    import app as _app

    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/network-monitoring/v1/site-health/{site_id}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching health for site {site_id}: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Webhook Management Endpoints =============


@config_bp.route("/api/config/webhooks", methods=["GET"])
@require_session
def list_webhooks():
    """List all configured webhooks."""
    import app as _app
    aruba_client = _app.aruba_client
    try:
        params = {}
        if request.args.get("limit"):
            params["limit"] = request.args.get("limit")
        if request.args.get("offset"):
            params["offset"] = request.args.get("offset")
        response = aruba_client.get("/central/v2/webhooks", params=params)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error listing webhooks: {e}")
        err = str(e)
        if "404" in err or "Not Found" in err:
            return jsonify({"webhooks": [], "count": 0, "total": 0})
        return jsonify({"error": err}), 500


@config_bp.route("/api/config/webhooks", methods=["POST"])
@require_session
def create_webhook():
    """Create a new webhook."""
    import app as _app
    aruba_client = _app.aruba_client
    try:
        data = request.get_json()
        response = aruba_client.post("/central/v2/webhooks", json=data)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error creating webhook: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/webhooks/<webhook_id>", methods=["GET"])
@require_session
def get_webhook(webhook_id):
    """Get a specific webhook by ID."""
    import app as _app
    aruba_client = _app.aruba_client
    try:
        response = aruba_client.get(f"/central/v2/webhooks/{webhook_id}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error fetching webhook {webhook_id}: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/webhooks/<webhook_id>", methods=["PUT"])
@require_session
def update_webhook(webhook_id):
    """Update an existing webhook."""
    import app as _app
    aruba_client = _app.aruba_client
    try:
        data = request.get_json()
        response = aruba_client.put(f"/central/v2/webhooks/{webhook_id}", json=data)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error updating webhook {webhook_id}: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/webhooks/<webhook_id>", methods=["DELETE"])
@require_session
def delete_webhook(webhook_id):
    """Delete a webhook."""
    import app as _app
    aruba_client = _app.aruba_client
    try:
        response = aruba_client.delete(f"/central/v2/webhooks/{webhook_id}")
        return jsonify(response or {"success": True})
    except Exception as e:
        logger.error(f"Error deleting webhook {webhook_id}: {e}")
        return jsonify({"error": str(e)}), 500


@config_bp.route("/api/config/webhooks/<webhook_id>/rotate-key", methods=["POST"])
@require_session
def rotate_webhook_key(webhook_id):
    """Rotate the secret key for a webhook."""
    import app as _app
    aruba_client = _app.aruba_client
    try:
        response = aruba_client.post(f"/central/v2/webhooks/{webhook_id}/rotate-key")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error rotating key for webhook {webhook_id}: {e}")
        return jsonify({"error": str(e)}), 500
