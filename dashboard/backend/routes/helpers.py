"""
Shared helpers, decorators, and globals for Blueprint routes.

All route modules import from here instead of app.py to avoid circular imports.
The globals (aruba_client, etc.) are read from the app module at request time.
"""
import time
import logging
import requests
from functools import wraps
from flask import request, jsonify, current_app

logger = logging.getLogger(__name__)


def _get_globals():
    """Fetch live globals from the app module at request time."""
    import app as _app
    return {
        'aruba_client': _app.aruba_client,
        'token_manager': _app.token_manager,
        'config': _app.config,
        'credentials_configured': _app.credentials_configured,
        'active_sessions': _app.active_sessions,
        'SESSION_TIMEOUT': _app.SESSION_TIMEOUT,
        'api_call_tracker': _app.api_call_tracker,
    }


def require_session(f):
    """Require a valid session. Mirrors the decorator in app.py."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        import app as _app
        session_id = request.headers.get('X-Session-ID') or request.cookies.get('session_id')
        if not session_id or session_id not in _app.active_sessions:
            _app._load_sessions_from_disk()
        if not session_id or session_id not in _app.active_sessions:
            return jsonify({"error": "Invalid or expired session"}), 401

        session = _app.active_sessions[session_id]
        if time.time() > session['expires']:
            del _app.active_sessions[session_id]
            return jsonify({"error": "Session expired"}), 401

        session['expires'] = time.time() + _app.SESSION_TIMEOUT
        _app._save_sessions_to_disk()
        _app.track_api_call()
        return f(*args, **kwargs)
    return decorated_function


def api_proxy(endpoint_builder, method='GET', error_msg="API", fallback_data=None):
    """API proxy decorator — mirrors the one in app.py."""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            import app as _app
            aruba_client = _app.aruba_client
            try:
                if not aruba_client:
                    logger.error(f"{error_msg}: Aruba client not initialized")
                    if fallback_data is not None:
                        return jsonify(fallback_data)
                    return jsonify({"error": "Server not configured. Please configure credentials first."}), 500

                endpoint = endpoint_builder(*args, **kwargs) if callable(endpoint_builder) else endpoint_builder
                params = request.args.to_dict()
                api_kwargs = {'params': params}
                if method in ['POST', 'PUT', 'DELETE']:
                    data = request.get_json()
                    if data:
                        api_kwargs['data'] = data

                response = getattr(aruba_client, method.lower())(endpoint, **api_kwargs)
                return jsonify(response)
            except Exception as e:
                error_str = str(e)
                logger.error(f"{error_msg}: {error_str}", exc_info=True)

                if isinstance(e, requests.HTTPError):
                    try:
                        error_status_code = e.response.status_code if hasattr(e, 'response') else None
                        error_response_text = e.response.text if hasattr(e, 'response') else None
                        error_str = f"HTTP {error_status_code}: {error_response_text or error_str}"
                    except Exception:
                        pass

                if isinstance(e, AttributeError):
                    return jsonify({"error": "An API error occurred. Check server logs for details.", "status_code": 500}), 500

                if "404" in error_str or "Not Found" in error_str:
                    if method == 'GET':
                        if fallback_data is not None:
                            return jsonify(fallback_data)
                        return jsonify({"data": [], "count": 0, "total": 0})
                    return jsonify({"error": f"Resource not found: {error_msg}"}), 404
                elif "403" in error_str or "Forbidden" in error_str:
                    return jsonify({"error": f"Access forbidden: {error_msg}"}), 403
                elif "401" in error_str or "Unauthorized" in error_str:
                    return jsonify({"error": "Authentication required"}), 401
                elif "400" in error_str or "Bad Request" in error_str:
                    return jsonify({"error": f"Bad Request: {error_str}"}), 400

                error_status_code = 500
                if isinstance(e, requests.HTTPError) and hasattr(e, 'response') and e.response is not None:
                    error_status_code = e.response.status_code or 500
                return jsonify({"error": "An API error occurred. Check server logs for details.", "status_code": error_status_code}), error_status_code
        return wrapper
    return decorator
