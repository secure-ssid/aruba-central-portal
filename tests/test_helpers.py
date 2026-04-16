"""Tests for dashboard backend route helpers."""

import json
import sys
import time
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from flask import Flask, jsonify

# Ensure the dashboard backend is importable
sys.path.insert(0, str(Path(__file__).parent.parent / "dashboard" / "backend"))

from routes.helpers import rate_limit, _rate_limit_store, _rate_limit_lock


@pytest.fixture()
def rate_limit_app():
    """Create a minimal Flask app with rate-limited routes for testing."""
    app = Flask(__name__)
    app.config["TESTING"] = True

    @app.route("/limited", methods=["GET"])
    @rate_limit(max_requests=3, window_seconds=60)
    def limited_endpoint():
        return jsonify({"ok": True})

    return app


class TestRateLimitDecorator:
    """Tests for the rate_limit decorator in helpers.py."""

    def _clear_bucket(self, func_name):
        """Remove all rate-limit entries whose key contains *func_name*."""
        with _rate_limit_lock:
            keys = [k for k in _rate_limit_store if func_name in k]
            for k in keys:
                del _rate_limit_store[k]

    def test_rate_limit_allows_under_limit(self, rate_limit_app):
        """Test that requests under the limit are allowed through."""
        self._clear_bucket("limited_endpoint")

        with rate_limit_app.test_client() as client:
            # 3 requests exactly at the limit — all should succeed
            for _ in range(3):
                resp = client.get("/limited")
                assert resp.status_code == 200
                data = json.loads(resp.data)
                assert data == {"ok": True}

    def test_rate_limit_blocks_over_limit(self, rate_limit_app):
        """Test that the 4th request (over limit of 3) gets 429."""
        self._clear_bucket("limited_endpoint")

        with rate_limit_app.test_client() as client:
            # First 3 should pass
            for _ in range(3):
                resp = client.get("/limited")
                assert resp.status_code == 200

            # 4th request should be blocked
            resp = client.get("/limited")
            assert resp.status_code == 429
            data = json.loads(resp.data)
            assert "error" in data
            assert "Rate limit exceeded" in data["error"]
            assert "Retry-After" in resp.headers
