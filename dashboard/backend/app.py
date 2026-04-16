#!/usr/bin/env python3
"""
Flask backend for Aruba Central Dashboard
Serves as an API proxy to securely handle authentication and API calls
"""

import sys
import os
import json
import re
import queue
import threading
from collections import deque
from pathlib import Path
import requests
from flask import Flask, jsonify, request, send_from_directory, Response, stream_with_context, make_response
from flask_cors import CORS
from flask_compress import Compress
import logging
from functools import wraps
import secrets
import time
import hashlib
from datetime import datetime, timedelta

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from utils import load_config
from utils.central_api_client import CentralAPIClient
from utils.token_manager import TokenManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
CORS(app, origins=os.environ.get('CORS_ORIGINS', 'http://localhost:1344,http://localhost:5000,http://localhost:5001').split(','))

# Enable compression (gzip and brotli)
Compress(app)

# ── Register Blueprints (before monolithic routes so they take precedence) ────
try:
    from routes import register_all_blueprints
    register_all_blueprints(app)
    _blueprints_registered = True
    # Monolithic route handlers below are kept as reference/fallback.
    # Flask uses the first-registered route for duplicate paths,
    # so blueprint routes above take precedence over the originals.
except Exception as _bp_err:
    import logging as _logging
    _logging.getLogger(__name__).error(
        f"Blueprint registration failed — running monolithic mode: {_bp_err}"
    )
    _blueprints_registered = False

# Cache control helper functions
def add_cache_headers(response, cache_max_age=3600, is_static=False):
    """Add cache-control headers to response."""
    if is_static:
        # Static assets: long-term caching (1 year) with hash-based filenames
        response.cache_control.max_age = 31536000  # 1 year
        response.cache_control.public = True
        response.cache_control.immutable = True
    else:
        # API responses: shorter caching (default 1 hour)
        response.cache_control.max_age = cache_max_age
        response.cache_control.private = True
        response.cache_control.must_revalidate = True
    return response

def add_etag_header(response, content):
    """Add ETag header based on content hash."""
    if isinstance(content, str):
        content_bytes = content.encode('utf-8')
    else:
        content_bytes = content
    etag = hashlib.md5(content_bytes).hexdigest()
    response.set_etag(etag)
    return response

@app.after_request
def set_cache_headers(response):
    """Set appropriate cache headers for all responses."""
    # Don't cache API responses by default (they're dynamic)
    if request.path.startswith('/api/'):
        # API responses: no cache or short cache
        response.cache_control.no_cache = True
        response.cache_control.no_store = True
        response.cache_control.must_revalidate = True
    elif request.path.startswith('/static/') or request.path.endswith(('.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.ico')):
        # Static assets: long-term caching
        response = add_cache_headers(response, is_static=True)
    elif request.path == '/' or request.path.endswith('.html'):
        # HTML files: no cache (they may change)
        response.cache_control.no_cache = True
        response.cache_control.must_revalidate = True
    
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'

    return response

# Session management (in production, use Redis or database)
active_sessions = {}
SESSION_TIMEOUT = 3600  # 1 hour

# API Rate Limiting Tracking (based on Aruba Central default limits)
# Default limits: 5000 calls/day, 7 calls/second
api_call_tracker = {
    'daily_calls': 0,
    'daily_reset_time': time.time() + 86400,  # Reset after 24 hours
    'second_window': [],  # Track calls in current second
    'all_calls': []  # Track all calls for analytics
}

# Initialize Aruba Client
aruba_client = None
token_manager = None
config = None
credentials_configured = False
_client_lock = threading.Lock()

# ── Webhook event store (Agent C) ────────────────────────────────────────────
_event_store: deque = deque(maxlen=500)
_event_store_lock = threading.Lock()
_sse_subscribers: set = set()
_sse_subscribers_lock = threading.Lock()

# ── Polling response cache (Agent B) ─────────────────────────────────────────
_poll_cache: dict = {}
_poll_cache_lock = threading.Lock()
_POLL_CACHE_TTL = 30


def _safe_int(v, default=0):
    """Coerce v to int safely — handles dicts, None, non-numeric strings."""
    if isinstance(v, (int, float)):
        return int(v)
    if isinstance(v, str):
        try:
            return int(v)
        except (ValueError, TypeError):
            return default
    return default


def _poll_cache_get(key: str):
    with _poll_cache_lock:
        entry = _poll_cache.get(key)
        if entry:
            return entry["data"], entry["ts"]
        return None, None


def _poll_cache_set(key: str, data):
    with _poll_cache_lock:
        _poll_cache[key] = {"data": data, "ts": time.time()}


def _fan_out_event(event: dict):
    with _sse_subscribers_lock:
        dead = set()
        for q in _sse_subscribers:
            try:
                q.put_nowait(event)
            except queue.Full:
                dead.add(q)
        _sse_subscribers.difference_update(dead)


def _auth_retry_loop():
    """Retry aruba_client initialization with exponential backoff until it succeeds."""
    global aruba_client
    delay = 60
    max_delay = 900
    max_retries = 50
    retries = 0
    while retries < max_retries:
        time.sleep(delay)
        with _client_lock:
            if aruba_client:
                return
        logger.info("Auth retry: re-attempting Aruba Central init…")
        initialize_client()
        with _client_lock:
            if aruba_client:
                logger.info("Auth retry: client initialized successfully")
                return
        retries += 1
        delay = min(delay * 2, max_delay)
    logger.error("Auth retry: max retries (%d) exceeded, giving up", max_retries)


def initialize_client():
    """Initialize Aruba Central client."""
    global aruba_client, token_manager, config, credentials_configured

    try:
        config = load_config()
        logger.info("Configuration loaded successfully")

        # Check if credentials are configured
        aruba_config = config.get("aruba_central", {})
        client_id = aruba_config.get("client_id", "")
        client_secret = aruba_config.get("client_secret", "")
        customer_id = aruba_config.get("customer_id", "")

        if not client_id or not client_secret or not customer_id or \
           client_id == "your_client_id_here" or \
           client_secret == "your_client_secret_here" or \
           customer_id == "your_customer_id_here":
            logger.warning("Credentials not configured - setup wizard needed")
            credentials_configured = False
            return False

        # Initialize token manager
        _tm = TokenManager(
            client_id=client_id,
            client_secret=client_secret
        )

        # Initialize Aruba Central API client
        _ac = CentralAPIClient(
            base_url=aruba_config.get("base_url", "https://internal.api.central.arubanetworks.com"),
            token_manager=_tm
        )

        with _client_lock:
            token_manager = _tm
            aruba_client = _ac
            credentials_configured = True
        logger.info("Aruba Central client initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize Aruba Central client: {e}")
        logger.warning("Server will start but authentication will fail until configured")
        credentials_configured = False
        return False


# Try to initialize on startup
initialize_client()

# Background auth-retry thread
threading.Thread(target=_auth_retry_loop, daemon=True, name="auth-retry").start()


def track_api_call():
    """Track API call for rate limiting."""
    global api_call_tracker
    current_time = time.time()

    # Reset daily counter if needed
    if current_time > api_call_tracker['daily_reset_time']:
        api_call_tracker['daily_calls'] = 0
        api_call_tracker['daily_reset_time'] = current_time + 86400
        api_call_tracker['all_calls'] = []

    # Track call
    api_call_tracker['daily_calls'] += 1
    api_call_tracker['all_calls'].append({
        'timestamp': current_time,
        'endpoint': request.path,
        'method': request.method
    })

    # Keep only last 1000 calls for analytics
    if len(api_call_tracker['all_calls']) > 1000:
        api_call_tracker['all_calls'] = api_call_tracker['all_calls'][-1000:]

    # Track calls in current second (for rate per second tracking)
    api_call_tracker['second_window'] = [
        t for t in api_call_tracker['second_window']
        if t > current_time - 1
    ]
    api_call_tracker['second_window'].append(current_time)


SESSION_STORE_FILE = Path(os.environ.get('TOKEN_CACHE_DIR', '/app/data')) / 'sessions.json'

def _load_sessions_from_disk():
    try:
        if SESSION_STORE_FILE.exists():
            data = json.loads(SESSION_STORE_FILE.read_text() or '{}')
            # Merge into active_sessions without overwriting newer entries
            for sid, sess in data.items():
                if sid not in active_sessions:
                    active_sessions[sid] = sess
    except Exception as e:
        logger.debug(f"Could not load sessions from disk: {e}")

def _save_sessions_to_disk():
    try:
        SESSION_STORE_FILE.parent.mkdir(parents=True, exist_ok=True)
        SESSION_STORE_FILE.write_text(json.dumps(active_sessions))
    except Exception as e:
        logger.debug(f"Could not save sessions to disk: {e}")

def require_session(f):
    """Decorator to require valid session."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session_id = request.headers.get('X-Session-ID')
        if not session_id or session_id not in active_sessions:
            # Try to load from disk in case another worker created the session
            _load_sessions_from_disk()
        if not session_id or session_id not in active_sessions:
            return jsonify({"error": "Invalid or expired session"}), 401

        # Check session expiry
        session = active_sessions[session_id]
        if time.time() > session['expires']:
            del active_sessions[session_id]
            return jsonify({"error": "Session expired"}), 401

        # Refresh session
        session['expires'] = time.time() + SESSION_TIMEOUT
        # Persist refresh time for cross-worker visibility
        _save_sessions_to_disk()

        # Track API call for rate limiting monitoring
        track_api_call()

        return f(*args, **kwargs)
    return decorated_function


def api_proxy(endpoint_builder, method='GET', error_msg="API", fallback_data=None):
    """Create API proxy endpoint with error handling and graceful fallbacks."""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                # Check if aruba_client is initialized
                if not aruba_client:
                    logger.error(f"{error_msg}: Aruba client not initialized")
                    if fallback_data is not None:
                        return jsonify(fallback_data)
                    return jsonify({"error": "Server not configured. Please configure credentials first."}), 500
                
                endpoint = endpoint_builder(*args, **kwargs) if callable(endpoint_builder) else endpoint_builder
                params = request.args.to_dict()

                # Build kwargs based on method type
                api_kwargs = {'params': params}
                if method in ['POST', 'PUT', 'DELETE']:
                    data = request.get_json()
                    if data:
                        api_kwargs['data'] = data

                logger.debug(f"API Proxy: {method} {endpoint} with params: {params}")
                
                # Enhanced logging for sites-health endpoint
                if 'sites-health' in endpoint:
                    logger.info(f"🔍 Sites Health API Request: endpoint={endpoint}, params={params}")
                    if 'fields' in params:
                        logger.info(f"✅ 'fields' parameter found: {params.get('fields')}")
                    else:
                        logger.warning(f"⚠️ 'fields' parameter NOT found in request params")
                
                response = getattr(aruba_client, method.lower())(endpoint, **api_kwargs)
                
                # Enhanced logging for sites-health endpoint to verify devices field in response
                if 'sites-health' in endpoint:
                    logger.info(f"📊 Sites Health API Response: count={response.get('count', 0)}, items={len(response.get('items', []))}")
                    if response.get('items') and len(response.get('items', [])) > 0:
                        first_item = response['items'][0]
                        has_devices = 'devices' in first_item
                        logger.info(f"{'✅' if has_devices else '⚠️'} First site has 'devices' field: {has_devices}")
                        if has_devices:
                            devices_data = first_item.get('devices', {})
                            logger.info(f"✅ Devices structure keys: {list(devices_data.keys()) if isinstance(devices_data, dict) else 'Not a dict'}")
                        else:
                            logger.warning(f"⚠️ Devices field missing. Available keys in first item: {list(first_item.keys())}")
                
                return jsonify(response)
            except Exception as e:
                error_str = str(e)
                logger.error(f"{error_msg}: {error_str}", exc_info=True)
                
                # Try to extract more details from requests.HTTPError
                if isinstance(e, requests.HTTPError):
                    try:
                        error_response_text = e.response.text if hasattr(e, 'response') else None
                        error_status_code = e.response.status_code if hasattr(e, 'response') else None
                        logger.error(f"{error_msg}: HTTP {error_status_code} - {error_response_text}")
                        error_str = f"HTTP {error_status_code}: {error_response_text or error_str}"
                    except Exception:
                        pass
                
                # Check for AttributeError (aruba_client method not found)
                if isinstance(e, AttributeError):
                    logger.error(f"{error_msg}: aruba_client method '{method.lower()}' not found - {error_str}")
                    return jsonify({"error": "An API error occurred. Check server logs for details.", "status_code": 500}), 500

                # Return graceful fallback for common errors
                if "404" in error_str or "Not Found" in error_str:
                    # Return empty data for GET requests on 404
                    if method == 'GET':
                        logger.warning(f"{error_msg} endpoint not available: {endpoint}")
                        if fallback_data is not None:
                            return jsonify(fallback_data)
                        # Default empty response
                        return jsonify({"data": [], "count": 0, "total": 0})
                    return jsonify({"error": f"Resource not found: {error_msg}"}), 404
                elif "403" in error_str or "Forbidden" in error_str:
                    return jsonify({"error": f"Access forbidden: {error_msg}"}), 403
                elif "401" in error_str or "Unauthorized" in error_str:
                    return jsonify({"error": "Authentication required"}), 401
                elif "400" in error_str or "Bad Request" in error_str:
                    # For 400 errors, return the actual error message from API
                    logger.error(f"{error_msg}: Bad Request - {error_str}, endpoint={endpoint}, params={params}")
                    return jsonify({"error": f"Bad Request: {error_str}"}), 400

                # Default 500 error for other cases
                logger.error(f"{error_msg}: endpoint={endpoint}, method={method}, params={params}")
                error_status_code = 500
                if isinstance(e, requests.HTTPError) and hasattr(e, 'response') and e.response is not None:
                    error_status_code = e.response.status_code or 500
                return jsonify({"error": "An API error occurred. Check server logs for details.", "status_code": error_status_code}), error_status_code
        return wrapper
    return decorator


# ============= Main =============

if __name__ == '__main__':
    # Run Flask app
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=os.environ.get('FLASK_DEBUG', '').lower() == 'true')
