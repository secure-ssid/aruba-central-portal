"""Tests for CentralAPIClient."""

import time
from unittest.mock import MagicMock, call, patch

import pytest
import responses
from requests.exceptions import HTTPError

from tests.conftest import (
    SAMPLE_DEVICES,
    SAMPLE_WLANS,
    TEST_ACCESS_TOKEN,
    TEST_BASE_URL,
    add_api_endpoint,
)
from utils.central_api_client import CentralAPIClient, CentralAPIError


class TestCentralAPIClientInit:
    """Tests for CentralAPIClient initialization."""

    def test_init_with_token_manager(self, mock_token_manager):
        """Test initialization with a token manager."""
        client = CentralAPIClient(base_url=TEST_BASE_URL, token_manager=mock_token_manager)

        assert client.base_url == TEST_BASE_URL
        assert client.token_manager == mock_token_manager
        mock_token_manager.get_access_token.assert_called_once()

    def test_init_with_static_token(self):
        """Test initialization with a static access token."""
        client = CentralAPIClient(base_url=TEST_BASE_URL, access_token=TEST_ACCESS_TOKEN)

        assert client.base_url == TEST_BASE_URL
        assert client.token_manager is None
        assert f"Bearer {TEST_ACCESS_TOKEN}" in client.session.headers["Authorization"]

    def test_init_without_token_raises_error(self):
        """Test that initialization without any token raises ValueError."""
        with pytest.raises(
            ValueError, match="Either access_token or token_manager must be provided"
        ):
            CentralAPIClient(base_url=TEST_BASE_URL)

    def test_base_url_trailing_slash_stripped(self, mock_token_manager):
        """Test that trailing slash is stripped from base URL."""
        client = CentralAPIClient(base_url=f"{TEST_BASE_URL}/", token_manager=mock_token_manager)

        assert client.base_url == TEST_BASE_URL


class TestCentralAPIClientGet:
    """Tests for CentralAPIClient GET requests."""

    @responses.activate
    def test_get_success(self, api_client, mock_devices_response):
        """Test successful GET request."""
        add_api_endpoint(responses, "GET", "/monitoring/v1/devices", mock_devices_response)

        result = api_client.get("/monitoring/v1/devices")

        assert result == mock_devices_response
        assert len(responses.calls) == 1

    @responses.activate
    def test_get_with_params(self, api_client, mock_devices_response):
        """Test GET request with query parameters."""
        add_api_endpoint(responses, "GET", "/monitoring/v1/devices", mock_devices_response)

        result = api_client.get("/monitoring/v1/devices", params={"limit": 10, "offset": 0})

        assert result == mock_devices_response
        assert "limit=10" in responses.calls[0].request.url

    @responses.activate
    def test_get_empty_response(self, api_client):
        """Test GET request that returns empty body."""
        responses.add(responses.GET, f"{TEST_BASE_URL}/api/empty", body="", status=200)

        result = api_client.get("/api/empty")

        assert result == {}

    @responses.activate
    def test_get_404_raises_error(self, api_client):
        """Test that 404 raises CentralAPIError with correct status_code."""
        responses.add(
            responses.GET, f"{TEST_BASE_URL}/api/notfound", json={"error": "Not found"}, status=404
        )

        with pytest.raises(CentralAPIError) as exc_info:
            api_client.get("/api/notfound")

        assert exc_info.value.status_code == 404
        assert exc_info.value.response is not None


class TestCentralAPIClientPost:
    """Tests for CentralAPIClient POST requests."""

    @responses.activate
    def test_post_success(self, api_client):
        """Test successful POST request."""
        response_data = {"status": "created", "id": "12345"}
        add_api_endpoint(responses, "POST", "/api/resource", response_data)

        result = api_client.post("/api/resource", data={"name": "test"})

        assert result == response_data
        assert len(responses.calls) == 1

    @responses.activate
    def test_post_with_params(self, api_client):
        """Test POST request with query parameters."""
        response_data = {"status": "created"}
        add_api_endpoint(responses, "POST", "/api/resource", response_data)

        api_client.post("/api/resource", data={"name": "test"}, params={"object_type": "SHARED"})

        assert "object_type=SHARED" in responses.calls[0].request.url


class TestCentralAPIClientDelete:
    """Tests for CentralAPIClient DELETE requests."""

    @responses.activate
    def test_delete_success(self, api_client):
        """Test successful DELETE request."""
        response_data = {"status": "deleted"}
        add_api_endpoint(responses, "DELETE", "/api/resource/123", response_data)

        result = api_client.delete("/api/resource/123")

        assert result == response_data


class TestCentralAPIClientRateLimiting:
    """Tests for 429 rate limit retry behavior."""

    @responses.activate
    def test_retry_on_429(self, api_client, mock_devices_response):
        """Test automatic retry on 429 rate limit."""
        # First call returns 429, second succeeds
        responses.add(
            responses.GET,
            f"{TEST_BASE_URL}/api/endpoint",
            json={"error": "rate limited"},
            status=429,
        )
        responses.add(
            responses.GET, f"{TEST_BASE_URL}/api/endpoint", json=mock_devices_response, status=200
        )

        # Patch time.sleep to avoid actual delays in tests
        with patch("time.sleep"):
            result = api_client.get("/api/endpoint")

        assert result == mock_devices_response
        assert len(responses.calls) == 2

    @responses.activate
    def test_max_retries_exceeded(self, api_client):
        """Test that error is raised after max retries."""
        # All calls return 429
        for _ in range(4):
            responses.add(
                responses.GET,
                f"{TEST_BASE_URL}/api/endpoint",
                json={"error": "rate limited"},
                status=429,
            )

        with patch("time.sleep"), pytest.raises(CentralAPIError) as exc_info:
            api_client.get("/api/endpoint")

        assert exc_info.value.status_code == 429
        # 1 initial + 3 retries = 4 calls
        assert len(responses.calls) == 4

    @responses.activate
    def test_exponential_backoff(self, api_client):
        """Test that retry delays increase exponentially."""
        # All calls return 429
        for _ in range(4):
            responses.add(
                responses.GET,
                f"{TEST_BASE_URL}/api/endpoint",
                json={"error": "rate limited"},
                status=429,
            )

        with patch("time.sleep") as mock_sleep:
            with pytest.raises(CentralAPIError):
                api_client.get("/api/endpoint")

            # Check sleep was called with increasing delays
            # Initial delay is 60, then 60*1.5=90, then 90*1.5=135
            calls = mock_sleep.call_args_list
            assert len(calls) == 3
            assert calls[0] == call(60)
            assert calls[1] == call(90)
            assert calls[2] == call(135)


class TestCentralAPIClientTokenRefresh:
    """Tests for token refresh behavior."""

    @responses.activate
    def test_token_refresh_before_request(self, mock_devices_response):
        """Test that token is refreshed before each request."""
        mock_manager = MagicMock()
        mock_manager.get_access_token.return_value = TEST_ACCESS_TOKEN

        client = CentralAPIClient(base_url=TEST_BASE_URL, token_manager=mock_manager)

        add_api_endpoint(responses, "GET", "/api/endpoint", mock_devices_response)

        client.get("/api/endpoint")

        # Token manager should be called during init and before request
        assert mock_manager.get_access_token.call_count >= 2


class TestCentralAPIClientHTTPMethods:
    """Test all HTTP method wrappers."""

    @responses.activate
    def test_put_method(self, api_client):
        """Test PUT request."""
        response_data = {"status": "updated"}
        add_api_endpoint(responses, "PUT", "/api/resource/123", response_data)

        result = api_client.put("/api/resource/123", data={"name": "updated"})

        assert result == response_data

    @responses.activate
    def test_patch_method(self, api_client):
        """Test PATCH request."""
        response_data = {"status": "patched"}
        add_api_endpoint(responses, "PATCH", "/api/resource/123", response_data)

        result = api_client.patch("/api/resource/123", data={"name": "patched"})

        assert result == response_data


class TestHTTPMethodErrors:
    """Tests for error paths on POST/PUT/PATCH/DELETE."""

    @responses.activate
    def test_post_404_raises_error(self, api_client):
        """Test that POST 404 raises CentralAPIError."""
        responses.add(
            responses.POST,
            f"{TEST_BASE_URL}/api/resource",
            json={"error_code": "NOTFOUND", "description": "Resource not found"},
            status=404,
        )

        with pytest.raises(CentralAPIError) as exc_info:
            api_client.post("/api/resource", data={"name": "test"})

        assert exc_info.value.status_code == 404
        assert exc_info.value.error_code == "NOTFOUND"
        assert exc_info.value.response is not None

    @responses.activate
    def test_put_404_raises_error(self, api_client):
        """Test that PUT 404 raises CentralAPIError."""
        responses.add(
            responses.PUT,
            f"{TEST_BASE_URL}/api/resource/123",
            json={"error_code": "NOTFOUND", "description": "Not found"},
            status=404,
        )

        with pytest.raises(CentralAPIError) as exc_info:
            api_client.put("/api/resource/123", data={"name": "updated"})

        assert exc_info.value.status_code == 404
        assert exc_info.value.error_code == "NOTFOUND"

    @responses.activate
    def test_patch_404_raises_error(self, api_client):
        """Test that PATCH 404 raises CentralAPIError."""
        responses.add(
            responses.PATCH,
            f"{TEST_BASE_URL}/api/resource/123",
            json={"error_code": "DEVNOTFOUND", "description": "Device not found"},
            status=404,
        )

        with pytest.raises(CentralAPIError) as exc_info:
            api_client.patch("/api/resource/123", data={"field": "val"})

        assert exc_info.value.status_code == 404
        assert exc_info.value.error_code == "DEVNOTFOUND"

    @responses.activate
    def test_delete_404_raises_error(self, api_client):
        """Test that DELETE 404 raises CentralAPIError."""
        responses.add(
            responses.DELETE,
            f"{TEST_BASE_URL}/api/resource/999",
            json={"error_code": "NOTFOUND", "description": "Resource not found"},
            status=404,
        )

        with pytest.raises(CentralAPIError) as exc_info:
            api_client.delete("/api/resource/999")

        assert exc_info.value.status_code == 404
        assert exc_info.value.error_code == "NOTFOUND"

    @responses.activate
    def test_post_empty_response_204(self, api_client):
        """Test POST returning 204 No Content (empty body)."""
        responses.add(
            responses.POST,
            f"{TEST_BASE_URL}/api/resource",
            body="",
            status=204,
        )

        result = api_client.post("/api/resource", data={"name": "test"})

        assert result == {}


class TestGetAllPaginated:
    """Tests for CentralAPIClient.get_all_paginated()."""

    @responses.activate
    def test_get_all_paginated_basic(self, api_client):
        """Test basic pagination that collects items across two pages."""
        # Page 1: 2 items out of 3 total
        responses.add(
            responses.GET,
            f"{TEST_BASE_URL}/api/items",
            json={
                "items": [{"id": 1}, {"id": 2}],
                "total": 3,
            },
            status=200,
        )
        # Page 2: 1 remaining item
        responses.add(
            responses.GET,
            f"{TEST_BASE_URL}/api/items",
            json={
                "items": [{"id": 3}],
                "total": 3,
            },
            status=200,
        )

        result = api_client.get_all_paginated("/api/items", page_size=2)

        assert len(result) == 3
        assert result == [{"id": 1}, {"id": 2}, {"id": 3}]
        assert len(responses.calls) == 2

    @responses.activate
    def test_get_all_paginated_prefers_result_when_items_empty(self, api_client):
        """network-monitoring style bodies may use ``result`` instead of ``items``."""
        responses.add(
            responses.GET,
            f"{TEST_BASE_URL}/network-monitoring/v1/devices",
            json={
                "result": [{"serialNumber": "SN1"}],
                "total": 1,
            },
            status=200,
        )

        result = api_client.get_all_paginated(
            "/network-monitoring/v1/devices", page_size=100
        )

        assert result == [{"serialNumber": "SN1"}]
        assert len(responses.calls) == 1

    @responses.activate
    def test_get_all_paginated_empty_response(self, api_client):
        """Test pagination when first page returns no items."""
        responses.add(
            responses.GET,
            f"{TEST_BASE_URL}/api/items",
            json={"items": [], "total": 0},
            status=200,
        )

        result = api_client.get_all_paginated("/api/items")

        assert result == []
        assert len(responses.calls) == 1

    @responses.activate
    def test_get_all_paginated_max_pages_cap(self, api_client):
        """Test that pagination stops at max_pages even if more data exists."""
        # Each page claims a huge total so pagination would keep going
        for _ in range(3):
            responses.add(
                responses.GET,
                f"{TEST_BASE_URL}/api/items",
                json={
                    "items": [{"id": "x"}],
                    "total": 9999,
                },
                status=200,
            )

        result = api_client.get_all_paginated("/api/items", max_pages=2, page_size=1)

        # Should stop after 2 pages even though total says 9999
        assert len(result) == 2
        assert len(responses.calls) == 2


class TestTokenRefreshOn401:
    """Tests for 401 automatic token refresh and retry."""

    @responses.activate
    def test_401_triggers_token_refresh_and_retry(self):
        """Test that 401 triggers a force-refresh and retries the request."""
        mock_manager = MagicMock()
        mock_manager.get_access_token.return_value = TEST_ACCESS_TOKEN

        client = CentralAPIClient(base_url=TEST_BASE_URL, token_manager=mock_manager)

        # First call returns 401, second succeeds after refresh
        responses.add(
            responses.GET,
            f"{TEST_BASE_URL}/api/data",
            json={"error": "Unauthorized"},
            status=401,
        )
        responses.add(
            responses.GET,
            f"{TEST_BASE_URL}/api/data",
            json={"result": "ok"},
            status=200,
        )

        result = client.get("/api/data")

        assert result == {"result": "ok"}
        # get_access_token called: init + first _ensure_valid_token + force_refresh + second _ensure_valid_token
        force_refresh_calls = [
            c for c in mock_manager.get_access_token.call_args_list
            if c == call(force_refresh=True)
        ]
        assert len(force_refresh_calls) >= 1

    @responses.activate
    def test_retry_after_header_parsing(self, api_client):
        """Test that Retry-After header value is respected on 429."""
        responses.add(
            responses.GET,
            f"{TEST_BASE_URL}/api/endpoint",
            json={"error": "rate limited"},
            status=429,
            headers={"Retry-After": "5"},
        )
        responses.add(
            responses.GET,
            f"{TEST_BASE_URL}/api/endpoint",
            json={"data": "ok"},
            status=200,
        )

        with patch("time.sleep") as mock_sleep:
            result = api_client.get("/api/endpoint")

        assert result == {"data": "ok"}
        # First sleep should use the Retry-After value of 5
        mock_sleep.assert_called_once_with(5)
