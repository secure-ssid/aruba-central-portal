"""
Flask Blueprint package for Aruba Central Dashboard backend.

Each module contains routes for a specific domain. Import and register
all blueprints in app.py (or app_v2.py) using register_all_blueprints().
"""

from .auth import auth_bp
from .monitoring import monitoring_bp
from .devices import devices_bp
from .config import config_bp
from .troubleshoot import troubleshoot_bp
from .greenlake import greenlake_bp
from .chat import chat_bp


def register_all_blueprints(app):
    """Register all route blueprints with the Flask app."""
    app.register_blueprint(auth_bp)
    app.register_blueprint(monitoring_bp)
    app.register_blueprint(devices_bp)
    app.register_blueprint(config_bp)
    app.register_blueprint(troubleshoot_bp)
    app.register_blueprint(greenlake_bp)
    app.register_blueprint(chat_bp)
