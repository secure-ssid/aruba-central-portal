"""Tests for Flask blueprint registration and route coverage."""

import json
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent / "dashboard" / "backend"))


# =============================================================================
# Fixtures
# =============================================================================


@pytest.fixture(scope="module")
def flask_app():
    """Create the Flask app with blueprints registered for testing."""
    with (
        patch("utils.config.load_config") as mock_cfg,
        patch("utils.token_manager.TokenManager") as mock_tm_cls,
        patch("utils.central_api_client.CentralAPIClient") as mock_client_cls,
    ):

        mock_cfg.return_value = {
            "aruba_central": {
                "base_url": "https://test.api.central.arubanetworks.com",
                "client_id": "test-id",
                "client_secret": "test-secret",
                "customer_id": "test-customer",
            }
        }
        mock_tm = MagicMock()
        mock_tm.get_access_token.return_value = "test-token"
        mock_tm.is_token_valid.return_value = True
        mock_tm_cls.return_value = mock_tm

        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client

        import app as flask_app_module

        flask_app_module.app.config["TESTING"] = True
        flask_app_module.app.config["SECRET_KEY"] = "test-secret-key"
        yield flask_app_module.app


@pytest.fixture
def client(flask_app):
    """Flask test client."""
    with flask_app.test_client() as c:
        yield c


@pytest.fixture
def authed_client(flask_app):
    """Flask test client with an active session registered in active_sessions."""
    import app as m

    session_id = "test-session-id-12345"
    import time

    m.active_sessions[session_id] = {
        "authenticated": True,
        "access_token": "test-token",
        "created_at": time.time(),
        "last_activity": time.time(),
        "expires": time.time() + 86400,  # 24h from now
    }
    with flask_app.test_client() as c:
        c.set_cookie("session_id", session_id)
        yield c
    m.active_sessions.pop(session_id, None)


# =============================================================================
# Blueprint Registration
# =============================================================================


class TestBlueprintRegistration:
    """Verify all blueprints are registered and routing correctly."""

    def test_blueprints_registered_flag(self, flask_app):
        import app as m

        assert m._blueprints_registered is True

    def test_all_blueprints_present(self, flask_app):
        blueprint_names = set(flask_app.blueprints.keys())
        expected = {"auth", "devices", "monitoring", "config", "troubleshoot", "greenlake", "chat"}
        assert expected.issubset(
            blueprint_names
        ), f"Missing blueprints: {expected - blueprint_names}"

    def test_auth_routes_registered(self, flask_app):
        rules = {r.rule for r in flask_app.url_map.iter_rules()}
        assert "/api/auth/login" in rules
        assert "/api/auth/logout" in rules
        assert "/api/auth/status" in rules
        assert "/api/health" in rules

    def test_devices_routes_registered(self, flask_app):
        rules = {r.rule for r in flask_app.url_map.iter_rules()}
        assert "/api/devices" in rules
        assert "/api/switches" in rules
        assert "/api/aps" in rules

    def test_monitoring_routes_registered(self, flask_app):
        rules = {r.rule for r in flask_app.url_map.iter_rules()}
        assert "/api/monitoring/aps" in rules
        assert "/api/monitoring/switches" in rules
        assert "/api/monitoring/gateways" in rules

    def test_config_routes_registered(self, flask_app):
        rules = {r.rule for r in flask_app.url_map.iter_rules()}
        assert "/api/groups" in rules
        assert "/api/sites" in rules
        assert "/api/config/roles" in rules

    def test_troubleshoot_routes_registered(self, flask_app):
        rules = {r.rule for r in flask_app.url_map.iter_rules()}
        assert "/api/troubleshoot/ping" in rules
        assert "/api/troubleshoot/traceroute" in rules

    def test_greenlake_routes_registered(self, flask_app):
        rules = {r.rule for r in flask_app.url_map.iter_rules()}
        assert "/api/greenlake/users" in rules
        assert "/api/greenlake/tags" in rules
        assert "/api/greenlake/workspaces" in rules

    def test_chat_routes_registered(self, flask_app):
        rules = {r.rule for r in flask_app.url_map.iter_rules()}
        assert "/api/chat/message" in rules
        assert "/api/stream/events" in rules

    def test_auth_routes_use_auth_blueprint(self, flask_app):
        adapter = flask_app.url_map.bind("localhost")
        ep, _ = adapter.match("/api/auth/login", method="POST")
        assert ep.startswith("auth.")

    def test_devices_routes_use_devices_blueprint(self, flask_app):
        adapter = flask_app.url_map.bind("localhost")
        ep, _ = adapter.match("/api/devices", method="GET")
        assert ep.startswith("devices.")

    def test_greenlake_routes_use_greenlake_blueprint(self, flask_app):
        adapter = flask_app.url_map.bind("localhost")
        ep, _ = adapter.match("/api/greenlake/users", method="GET")
        assert ep.startswith("greenlake.")


# =============================================================================
# Auth Blueprint
# =============================================================================


class TestAuthBlueprint:
    """Test auth blueprint endpoints."""

    def test_health_check_returns_200(self, client):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = json.loads(resp.data)
        assert "status" in data

    def test_auth_status_requires_auth(self, client):
        resp = client.get("/api/auth/status")
        assert resp.status_code in (401, 403)

    def test_auth_status_authenticated(self, authed_client, flask_app):
        import app as m

        mock_tm = MagicMock()
        mock_tm.get_token_info.return_value = {"expires_in": 3600}
        m.token_manager = mock_tm
        resp = authed_client.get("/api/auth/status")
        assert resp.status_code == 200
        data = json.loads(resp.data)
        assert data.get("authenticated") is True

    def test_login_endpoint_exists(self, client):
        """Login endpoint is reachable (response varies based on server config)."""
        resp = client.post("/api/auth/login", data=json.dumps({}), content_type="application/json")
        assert resp.status_code != 404

    def test_logout_with_session(self, authed_client):
        resp = authed_client.post("/api/auth/logout")
        assert resp.status_code == 200

    def test_logout_without_session_returns_401(self, client):
        resp = client.post("/api/auth/logout")
        assert resp.status_code in (401, 403)

    def test_rate_limit_status_requires_auth(self, client):
        resp = client.get("/api/rate-limit/status")
        assert resp.status_code in (401, 403)

    def test_token_info_requires_auth(self, client):
        resp = client.get("/api/token/info")
        assert resp.status_code in (401, 403)


# =============================================================================
# Devices Blueprint
# =============================================================================


class TestDevicesBlueprint:
    """Test devices blueprint endpoints."""

    def test_devices_requires_auth(self, client):
        resp = client.get("/api/devices")
        assert resp.status_code in (401, 403)

    def test_switches_requires_auth(self, client):
        resp = client.get("/api/switches")
        assert resp.status_code in (401, 403)

    def test_aps_requires_auth(self, client):
        resp = client.get("/api/aps")
        assert resp.status_code in (401, 403)

    def test_devices_with_auth_calls_api(self, authed_client, flask_app):
        import app as m

        m.aruba_client = MagicMock()
        m.aruba_client.get_all_paginated.return_value = []
        resp = authed_client.get("/api/devices")
        assert resp.status_code == 200

    def test_switches_with_auth_calls_api(self, authed_client, flask_app):
        import app as m

        m.aruba_client = MagicMock()
        m.aruba_client.get_all_paginated.return_value = []
        resp = authed_client.get("/api/switches")
        assert resp.status_code == 200

    def test_aps_with_auth_calls_api(self, authed_client, flask_app):
        import app as m

        m.aruba_client = MagicMock()
        m.aruba_client.get_all_paginated.return_value = []
        resp = authed_client.get("/api/aps")
        assert resp.status_code == 200


# =============================================================================
# Monitoring Blueprint
# =============================================================================


class TestMonitoringBlueprint:
    """Test monitoring blueprint endpoints."""

    def test_monitoring_aps_requires_auth(self, client):
        resp = client.get("/api/monitoring/aps")
        assert resp.status_code in (401, 403)

    def test_monitoring_switches_requires_auth(self, client):
        resp = client.get("/api/monitoring/switches")
        assert resp.status_code in (401, 403)

    def test_monitoring_aps_with_auth(self, authed_client, flask_app):
        import app as m

        m.aruba_client = MagicMock()
        m.aruba_client.get_all_paginated.return_value = []
        resp = authed_client.get("/api/monitoring/aps")
        assert resp.status_code == 200

    def test_monitoring_switches_with_auth(self, authed_client, flask_app):
        import app as m

        m.aruba_client = MagicMock()
        m.aruba_client.get_all_paginated.return_value = []
        resp = authed_client.get("/api/monitoring/switches")
        assert resp.status_code == 200

    def test_monitoring_gateways_with_auth(self, authed_client, flask_app):
        import app as m

        m.aruba_client = MagicMock()
        m.aruba_client.get_all_paginated.return_value = []
        resp = authed_client.get("/api/monitoring/gateways")
        assert resp.status_code == 200


# =============================================================================
# Config Blueprint
# =============================================================================


class TestConfigBlueprint:
    """Test config blueprint endpoints."""

    def test_groups_requires_auth(self, client):
        resp = client.get("/api/groups")
        assert resp.status_code in (401, 403)

    def test_sites_requires_auth(self, client):
        resp = client.get("/api/sites")
        assert resp.status_code in (401, 403)

    def test_groups_with_auth(self, authed_client, flask_app):
        import app as m

        m.aruba_client = MagicMock()
        m.aruba_client.get_all_paginated.return_value = []
        resp = authed_client.get("/api/groups")
        assert resp.status_code == 200

    def test_sites_with_auth(self, authed_client, flask_app):
        import app as m

        m.aruba_client = MagicMock()
        m.aruba_client.get_all_paginated.return_value = []
        resp = authed_client.get("/api/sites")
        assert resp.status_code == 200

    def test_wlan_config_requires_auth(self, client):
        resp = client.get("/api/wlans")
        assert resp.status_code in (401, 403)


# =============================================================================
# Troubleshoot Blueprint
# =============================================================================


class TestTroubleshootBlueprint:
    """Test troubleshoot blueprint endpoints."""

    def test_ping_requires_auth(self, client):
        resp = client.post(
            "/api/troubleshoot/ping",
            data=json.dumps({"host": "8.8.8.8"}),
            content_type="application/json",
        )
        assert resp.status_code in (401, 403)

    def test_traceroute_requires_auth(self, client):
        resp = client.post(
            "/api/troubleshoot/traceroute",
            data=json.dumps({"host": "8.8.8.8"}),
            content_type="application/json",
        )
        assert resp.status_code in (401, 403)

    def test_firmware_requires_auth(self, client):
        resp = client.get("/api/firmware/compliance")
        assert resp.status_code in (401, 403)


# =============================================================================
# GreenLake Blueprint
# =============================================================================


class TestGreenlakeBlueprint:
    """Test greenlake blueprint endpoints."""

    def test_users_requires_auth(self, client):
        resp = client.get("/api/greenlake/users")
        assert resp.status_code in (401, 403)

    def test_alerts_requires_auth(self, client):
        # Alerts are at /api/alerts (owned by greenlake blueprint)
        resp = client.get("/api/alerts")
        assert resp.status_code in (401, 403)

    def test_users_with_auth(self, authed_client, flask_app):
        """GreenLake users endpoint returns 400 when GL not configured, not 401."""
        resp = authed_client.get("/api/greenlake/users")
        # 400 = GL not configured; 200 = configured; both mean auth passed
        assert resp.status_code in (200, 400)

    def test_tags_requires_auth(self, client):
        resp = client.get("/api/greenlake/tags")
        assert resp.status_code in (401, 403)

    def test_workspaces_requires_auth(self, client):
        resp = client.get("/api/greenlake/workspaces")
        assert resp.status_code in (401, 403)


# =============================================================================
# Chat Blueprint
# =============================================================================


class TestChatBlueprint:
    """Test chat blueprint endpoints."""

    def test_chat_message_requires_auth(self, client):
        resp = client.post(
            "/api/chat/message",
            data=json.dumps({"message": "hello"}),
            content_type="application/json",
        )
        assert resp.status_code in (401, 403)

    def test_chat_intents_requires_auth(self, client):
        """Chat intents endpoint requires authentication."""
        resp = client.get("/api/chat/intents")
        assert resp.status_code in (401, 403)

    def test_sse_stream_requires_auth(self, client):
        resp = client.get("/api/stream/events")
        assert resp.status_code in (401, 403)

    def test_webhook_endpoint_exists(self, client):
        """Webhook endpoint exists (may return 400/405 without proper payload)."""
        resp = client.post(
            "/api/webhooks/aruba-central", data=json.dumps({}), content_type="application/json"
        )
        assert resp.status_code != 404


# =============================================================================
# Route Count Sanity Check
# =============================================================================


class TestRouteCoverage:
    """Verify expected minimum number of routes per blueprint."""

    def _count_blueprint_routes(self, flask_app, prefix):
        return sum(1 for r in flask_app.url_map.iter_rules() if r.endpoint.startswith(f"{prefix}."))

    def test_auth_has_minimum_routes(self, flask_app):
        assert self._count_blueprint_routes(flask_app, "auth") >= 7

    def test_devices_has_minimum_routes(self, flask_app):
        assert self._count_blueprint_routes(flask_app, "devices") >= 10

    def test_monitoring_has_minimum_routes(self, flask_app):
        assert self._count_blueprint_routes(flask_app, "monitoring") >= 10

    def test_config_has_minimum_routes(self, flask_app):
        assert self._count_blueprint_routes(flask_app, "config") >= 20

    def test_troubleshoot_has_minimum_routes(self, flask_app):
        assert self._count_blueprint_routes(flask_app, "troubleshoot") >= 10

    def test_greenlake_has_minimum_routes(self, flask_app):
        assert self._count_blueprint_routes(flask_app, "greenlake") >= 15

    def test_chat_has_minimum_routes(self, flask_app):
        assert self._count_blueprint_routes(flask_app, "chat") >= 3
