"""
Aruba Central API client for Bearer Token authentication.
Used for the Central API that uses direct bearer tokens with automatic refresh.
Includes retry logic for rate limiting (429 errors).
"""

import logging
import time
from typing import Any

import requests

from .token_manager import TokenManager

logger = logging.getLogger(__name__)


class CentralAPIError(Exception):
    """Structured error from Aruba Central API.

    Captures the HTTP status code, the Central-specific ``error_code``
    (e.g. ``DEVNOTFOUND``, ``RATE_LIMIT_EXCEEDED``, ``INVALID_TOKEN``),
    a human-readable message, and the raw ``requests.Response`` object.
    """

    def __init__(
        self,
        status_code: int,
        error_code: str = "",
        message: str = "",
        response: requests.Response | None = None,
    ):
        self.status_code = status_code
        self.error_code = error_code
        self.message = message
        self.response = response
        super().__init__(self.message or f"HTTP {status_code}: {error_code}")


class CentralAPIClient:
    """Client for interacting with Aruba Central API using Bearer tokens."""

    def __init__(
        self,
        base_url: str,
        access_token: str | None = None,
        token_manager: TokenManager | None = None,
    ):
        """Initialize the Central API client.

        Args:
            base_url: Base URL for Central API (e.g., https://internal.api.central.arubanetworks.com)
            access_token: Bearer access token (optional if token_manager provided)
            token_manager: TokenManager instance for automatic token refresh
        """
        self.base_url = base_url.rstrip("/")
        self.token_manager = token_manager
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})

        if token_manager:
            # Get fresh token from manager
            access_token = token_manager.get_access_token()
            logger.info("Central API client initialized with token manager")
        elif access_token:
            logger.info("Central API client initialized with static bearer token")
        else:
            raise ValueError("Either access_token or token_manager must be provided")

        self._update_token(access_token)

    def _update_token(self, access_token: str) -> None:
        """Update the authorization header with a new token."""
        self.session.headers.update({"Authorization": f"Bearer {access_token}"})

    def _ensure_valid_token(self) -> None:
        """Ensure we have a valid token, refreshing if necessary."""
        if self.token_manager:
            access_token = self.token_manager.get_access_token()
            self._update_token(access_token)

    def _request_with_retry(
        self, method: str, url: str, max_retries: int = 3, **kwargs
    ) -> requests.Response:
        """Make an HTTP request with automatic retry on rate limiting.

        Args:
            method: HTTP method (GET, POST, PUT, PATCH, DELETE)
            url: Full URL to request
            max_retries: Maximum number of retries for 429 errors
            **kwargs: Additional arguments passed to requests

        Returns:
            Response object

        Raises:
            requests.HTTPError: If the request fails after all retries
        """
        retry_delay = 60  # Start with 1 minute

        for attempt in range(max_retries + 1):
            self._ensure_valid_token()
            response = self.session.request(method, url, **kwargs)

            if response.status_code == 429 and attempt < max_retries:
                # Rate limit error - retry with exponential backoff
                # Respect Retry-After header from Central if present
                retry_after = response.headers.get("Retry-After")
                if retry_after:
                    try:
                        retry_delay = int(retry_after)
                    except (ValueError, TypeError):
                        pass  # Fall through to default delay
                logger.warning(
                    f"Rate limit (429) hit on {method} {url}. "
                    f"Waiting {retry_delay}s before retry {attempt + 1}/{max_retries}"
                )
                time.sleep(retry_delay)
                retry_delay = min(int(retry_delay * 1.5), 300)  # Cap at 5 minutes
                continue

            if response.status_code == 401 and attempt < max_retries and self.token_manager:
                # Token may have expired mid-request — force refresh and retry once
                logger.warning(
                    f"401 Unauthorized on {method} {url}. "
                    f"Forcing token refresh (attempt {attempt + 1}/{max_retries})"
                )
                try:
                    access_token = self.token_manager.get_access_token(force_refresh=True)
                    self._update_token(access_token)
                except Exception as refresh_err:
                    logger.error(f"Token refresh failed during retry: {refresh_err}")
                    return response
                continue

            return response

        return response  # Return last response if all retries exhausted

    def get(self, endpoint: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
        """Make a GET request to the API with automatic retry on rate limiting.

        Args:
            endpoint: API endpoint path (e.g., /network-monitoring/v1alpha1/aps)
            params: Optional query parameters

        Returns:
            Response JSON data

        Raises:
            requests.HTTPError: If the request fails
        """
        url = f"{self.base_url}{endpoint}"
        logger.info(f"GET {url} with params: {params}")

        response = self._request_with_retry("GET", url, params=params)

        # Log response details for debugging
        logger.debug(f"Response status: {response.status_code}")
        logger.debug(f"Response headers: {dict(response.headers)}")
        logger.debug(f"Response content length: {len(response.content) if response.content else 0}")

        if response.status_code >= 400:
            logger.error(f"API Error {response.status_code}: {response.text[:500]}")
            # Parse structured error from Central JSON response
            error_code = ""
            description = response.text[:500] if response.text else f"HTTP {response.status_code}"
            try:
                err_json = response.json()
                if isinstance(err_json, dict):
                    error_code = err_json.get("error_code", err_json.get("errorCode", ""))
                    description = err_json.get("description", err_json.get("message", err_json.get("error", description)))
            except (ValueError, TypeError):
                pass
            raise CentralAPIError(
                status_code=response.status_code,
                error_code=error_code,
                message=description,
                response=response,
            )

        # Handle empty responses
        if not response.text or response.text.strip() == "":
            logger.warning(f"Empty response body from {url}")
            return {}

        try:
            json_data = response.json()
            if json_data is None:
                logger.warning(f"response.json() returned None for {url}")
                logger.warning(f"Response text was: {response.text[:200]}")
                return {}
            logger.debug(
                f"Parsed JSON data type: {type(json_data)}, keys: {list(json_data.keys()) if isinstance(json_data, dict) else 'not a dict'}"
            )
            return json_data
        except ValueError as e:
            logger.error(f"Failed to parse JSON response from {url}: {e}")
            logger.error(f"Response text (first 500 chars): {response.text[:500]}")
            return {}

    def post(
        self,
        endpoint: str,
        data: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Make a POST request to the API with automatic retry on rate limiting.

        Args:
            endpoint: API endpoint path
            data: Request body data
            params: Optional query parameters

        Returns:
            Response JSON data

        Raises:
            requests.HTTPError: If the request fails
        """
        url = f"{self.base_url}{endpoint}"
        logger.debug(f"POST {url}")

        response = self._request_with_retry("POST", url, json=data, params=params)

        if response.status_code >= 400:
            error_code = ""
            description = response.text[:500] if response.text else f"HTTP {response.status_code}"
            try:
                err_json = response.json()
                if isinstance(err_json, dict):
                    error_code = err_json.get("error_code", err_json.get("errorCode", ""))
                    description = err_json.get("description", err_json.get("message", err_json.get("error", description)))
            except (ValueError, TypeError):
                pass
            raise CentralAPIError(
                status_code=response.status_code,
                error_code=error_code,
                message=description,
                response=response,
            )

        # Handle empty responses (e.g., 204 No Content)
        if not response.text or response.text.strip() == "":
            return {}

        return response.json()

    def put(
        self,
        endpoint: str,
        data: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Make a PUT request to the API with automatic retry on rate limiting.

        Args:
            endpoint: API endpoint path
            data: Request body data
            params: Optional query parameters

        Returns:
            Response JSON data

        Raises:
            requests.HTTPError: If the request fails
        """
        url = f"{self.base_url}{endpoint}"
        logger.debug(f"PUT {url}")

        response = self._request_with_retry("PUT", url, json=data, params=params)
        response.raise_for_status()

        if not response.text or response.text.strip() == "":
            return {}

        return response.json()

    def patch(
        self,
        endpoint: str,
        data: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Make a PATCH request to the API with automatic retry on rate limiting.

        Args:
            endpoint: API endpoint path
            data: Request body data
            params: Optional query parameters

        Returns:
            Response JSON data

        Raises:
            requests.HTTPError: If the request fails
        """
        url = f"{self.base_url}{endpoint}"
        logger.debug(f"PATCH {url}")

        response = self._request_with_retry("PATCH", url, json=data, params=params)
        response.raise_for_status()

        if not response.text or response.text.strip() == "":
            return {}

        return response.json()

    def delete(
        self,
        endpoint: str,
        params: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Make a DELETE request to the API with automatic retry on rate limiting.

        Args:
            endpoint: API endpoint path
            params: Optional query parameters

        Returns:
            Response JSON data

        Raises:
            requests.HTTPError: If the request fails
        """
        url = f"{self.base_url}{endpoint}"
        logger.debug(f"DELETE {url}")

        response = self._request_with_retry("DELETE", url, params=params)
        response.raise_for_status()

        # DELETE often returns 204 No Content
        if not response.text or response.text.strip() == "":
            return {}

        return response.json()

    def get_all_paginated(
        self,
        endpoint: str,
        params: dict[str, Any] | None = None,
        items_key: str = "items",
        max_pages: int = 20,
        page_size: int = 100,
    ) -> list[dict[str, Any]]:
        """Auto-paginate a GET endpoint that uses offset/limit pagination.

        Central APIs typically return {items: [...], count: N, total: T}.
        This helper fetches all pages and returns a flat list of items.

        Args:
            endpoint: API endpoint path
            params: Base query parameters (offset/limit will be managed)
            items_key: Key in the response that contains the list of items
            max_pages: Safety limit on number of pages to fetch
            page_size: Number of items per page

        Returns:
            Combined list of all items across pages
        """
        all_items: list[dict[str, Any]] = []
        params = dict(params) if params else {}
        params["limit"] = page_size
        params.setdefault("offset", 0)

        for _ in range(max_pages):
            response = self.get(endpoint, params=params)
            items = response.get(items_key, [])
            if not items:
                break
            all_items.extend(items)
            total = response.get("total", response.get("count", len(items)))
            if len(all_items) >= total:
                break
            params["offset"] = len(all_items)

        return all_items
