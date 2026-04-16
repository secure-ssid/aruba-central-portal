"""
Auth, setup, and health Blueprint routes.

Extracted from app.py (lines 420-516, 3927-4073, 6214-6221).
"""
from pathlib import Path
from flask import Blueprint, request, jsonify
import time
import secrets
import logging

from .helpers import require_session, rate_limit

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)


# ============= Authentication Endpoints =============

@auth_bp.route('/api/auth/login', methods=['POST'])
@rate_limit(max_requests=10, window_seconds=60)
def login():
    """Authenticate and create session with Aruba Central."""
    import app as _app
    try:
        if not _app.aruba_client and not _app.initialize_client():
            return jsonify({"error": "Server configuration error"}), 500

        _app.token_manager.get_access_token(force_refresh=True)
        token_info = _app.token_manager.get_token_info()

        session_id = secrets.token_urlsafe(32)
        _app.active_sessions[session_id] = {'created': time.time(), 'expires': time.time() + _app.SESSION_TIMEOUT}
        _app._save_sessions_to_disk()

        logger.info(f"Session created, token expires in {token_info.get('expires_in_minutes', 0)}m")

        return jsonify({
            "success": True,
            "session_id": session_id,
            "expires_in": _app.SESSION_TIMEOUT,
            "token_info": {"created": True, "expires_at": token_info.get('expires_at'),
                          "expires_in_minutes": token_info.get('expires_in_minutes')}
        })
    except Exception as e:
        logger.error(f"Login: {e}")
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/api/auth/logout', methods=['POST'])
@require_session
def logout():
    """Logout and end session."""
    import app as _app
    session_id = request.headers.get('X-Session-ID')
    if session_id in _app.active_sessions:
        del _app.active_sessions[session_id]
    return jsonify({"success": True})


@auth_bp.route('/api/auth/status', methods=['GET'])
@require_session
def auth_status():
    """Check authentication status."""
    import app as _app
    token_info = _app.token_manager.get_token_info() if _app.token_manager else {}
    return jsonify({
        "authenticated": True,
        "customer_id": _app.config["aruba_central"]["customer_id"][:16] + "...",
        "base_url": _app.config["aruba_central"]["base_url"],
        "token": token_info
    })


@auth_bp.route('/api/token/info', methods=['GET'])
@require_session
def token_info():
    """Get token information and expiry status."""
    import app as _app
    if not _app.token_manager:
        return jsonify({"error": "Token manager not initialized"}), 500

    return jsonify(_app.token_manager.get_token_info())


@auth_bp.route('/api/token/refresh', methods=['POST'])
@require_session
def refresh_token():
    """Force refresh the access token."""
    import app as _app
    if not _app.token_manager:
        return jsonify({"error": "Token manager not initialized"}), 500

    try:
        new_token = _app.token_manager.get_access_token(force_refresh=True)
        return jsonify({
            "success": True,
            "message": "Token refreshed successfully",
            "token_info": _app.token_manager.get_token_info()
        })
    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/api/rate-limit/status', methods=['GET'])
@require_session
def get_rate_limit_status():
    """Get API rate limit usage stats."""
    import app as _app
    t = _app.api_call_tracker
    reset_sec = max(0, t['daily_reset_time'] - time.time())
    daily_lim, sec_lim = 5000, 7
    return jsonify({
        "daily_calls": t['daily_calls'], "daily_limit": daily_lim,
        "daily_percentage": (t['daily_calls'] / daily_lim * 100),
        "calls_remaining": max(0, daily_lim - t['daily_calls']),
        "reset_in_hours": int(reset_sec // 3600), "reset_in_minutes": int((reset_sec % 3600) // 60),
        "current_rate_per_second": len(t['second_window']), "per_second_limit": sec_lim,
        "recent_calls": len(t['all_calls'])
    })


# ============= Setup & Configuration Endpoints =============

@auth_bp.route('/api/setup/check', methods=['GET'])
def check_setup():
    """Check if credentials are configured."""
    import app as _app
    return jsonify({
        "configured": _app.credentials_configured,
        "needs_setup": not _app.credentials_configured
    })


@auth_bp.route('/api/setup/configure', methods=['POST'])
@rate_limit(max_requests=10, window_seconds=60)
def configure_credentials():
    """Configure Aruba Central credentials via UI."""
    import app as _app

    with _app._client_lock:
        if _app.credentials_configured:
            return jsonify({"error": "Credentials already configured. Use workspace switch to change credentials."}), 403

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        client_id = data.get('client_id', '').strip()
        client_secret = data.get('client_secret', '').strip()
        customer_id = data.get('customer_id', '').strip()
        base_url = data.get('base_url', 'https://internal.api.central.arubanetworks.com').strip()
        # Optional GreenLake RBAC details
        rbac = data.get('rbac') or None
        rbac_client_id = ''
        rbac_client_secret = ''
        gl_api_base = ''
        if isinstance(rbac, dict):
            rbac_client_id = (rbac.get('client_id') or '').strip()
            rbac_client_secret = (rbac.get('client_secret') or '').strip()
            gl_api_base = (rbac.get('api_base') or 'https://global.api.greenlake.hpe.com').strip()

        # Validate inputs
        if not all([client_id, client_secret, customer_id]):
            return jsonify({"error": "Client ID, Client Secret, and Customer ID are required"}), 400

        # Sanitize: reject values containing newlines to prevent .env injection
        all_values = [client_id, client_secret, customer_id, base_url,
                      rbac_client_id, rbac_client_secret, gl_api_base]
        for val in all_values:
            if '\n' in val or '\r' in val:
                return jsonify({"error": "Credential values must not contain newline characters"}), 400

        # Write to .env file
        env_path = Path(__file__).parent.parent.parent.parent / '.env'
        env_content = f"""# Aruba Central API Configuration (New Central / HPE GreenLake)
# Generated by Setup Wizard

# Aruba Central API Base URL
ARUBA_BASE_URL={base_url}

# OAuth2 Credentials
ARUBA_CLIENT_ID={client_id}
ARUBA_CLIENT_SECRET={client_secret}
ARUBA_CUSTOMER_ID={customer_id}
#
# Optional HPE GreenLake Platform RBAC credentials (used for MSP/tenant management)
GL_RBAC_CLIENT_ID={rbac_client_id}
GL_RBAC_CLIENT_SECRET={rbac_client_secret}
GL_API_BASE={gl_api_base}
"""

        # Try to write to .env file with proper error handling
        import os
        import stat
        env_write_success = False

        try:
            # First try to change permissions if possible
            try:
                os.chmod(env_path, stat.S_IRUSR | stat.S_IWUSR)
            except (OSError, PermissionError):
                pass  # If we can't chmod, try writing anyway

            env_path.write_text(env_content)
            # Set owner-only permissions after writing (file may not exist before write)
            try:
                os.chmod(env_path, stat.S_IRUSR | stat.S_IWUSR)
            except (OSError, PermissionError):
                pass
            logger.info(f"Credentials saved to {env_path}")
            env_write_success = True
        except (OSError, PermissionError) as e:
            logger.warning(f"Could not write to {env_path}: {e}. Setting environment variables directly.")

        # Set environment variables (either from file or directly)
        if env_write_success:
            # Reload environment variables from file
            from dotenv import load_dotenv
            try:
                load_dotenv(env_path, override=True)
                logger.info("Environment variables reloaded from file")
            except (OSError, PermissionError) as e:
                logger.warning(f"Could not read {env_path}: {e}. Setting directly.")
                env_write_success = False

        if not env_write_success:
            # Fallback: Set environment variables directly in the current process
            os.environ['ARUBA_BASE_URL'] = base_url
            os.environ['ARUBA_CLIENT_ID'] = client_id
            os.environ['ARUBA_CLIENT_SECRET'] = client_secret
            os.environ['ARUBA_CUSTOMER_ID'] = customer_id
            # Optional RBAC values
            os.environ['GL_RBAC_CLIENT_ID'] = rbac_client_id
            os.environ['GL_RBAC_CLIENT_SECRET'] = rbac_client_secret
            os.environ['GL_API_BASE'] = gl_api_base or 'https://global.api.greenlake.hpe.com'
            logger.info("Credentials set in environment variables directly")

        # Reinitialize client with new credentials
        if _app.initialize_client():
            # Send SIGHUP to gunicorn master process to reload all workers
            # This ensures all workers pick up the new credentials
            try:
                import signal
                master_pid = os.getppid()  # Parent process is gunicorn master
                logger.info(f"Sending SIGHUP to gunicorn master (pid: {master_pid}) to reload workers")
                os.kill(master_pid, signal.SIGHUP)
                logger.info("Worker reload signal sent successfully")
            except Exception as e:
                logger.warning(f"Could not reload workers automatically: {e}")
                logger.info("Workers will reload on next container restart")

            # Create a session automatically so user doesn't have to login again
            session_id = secrets.token_urlsafe(32)
            _app.active_sessions[session_id] = {
                'created': time.time(),
                'expires': time.time() + _app.SESSION_TIMEOUT
            }
            logger.info("Session created automatically after credential configuration")
            _app._save_sessions_to_disk()

            return jsonify({
                "success": True,
                "message": "Credentials configured successfully! Workers reloading...",
                "configured": True,
                "session_id": session_id,
                "expires_in": _app.SESSION_TIMEOUT
            })
        else:
            return jsonify({
                "error": "Credentials saved but failed to initialize client. Please check your credentials."
            }), 500

    except Exception as e:
        logger.error(f"Error configuring credentials: {e}")
        return jsonify({"error": str(e)}), 500


# ============= Health Check Endpoint =============

@auth_bp.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    import app as _app
    return jsonify({
        "status": "healthy",
        "version": "2.0.0",
        "aruba_client_initialized": _app.aruba_client is not None
    })
