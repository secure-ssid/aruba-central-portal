# Utils

Shared Python utilities used by all scripts and the dashboard backend.

## Modules

### `central_api_client.py`
HTTP client for Aruba Central API. Handles:
- Automatic token refresh via `TokenManager`
- Rate-limit retry with exponential backoff (429 → 60s → 90s → 135s)
- Raises `requests.HTTPError` on failure

```python
from utils.central_api_client import CentralAPIClient
client = CentralAPIClient(base_url=..., token_manager=token_manager)
data = client.get("/monitoring/v1/devices")
```

### `token_manager.py`
OAuth2 client credentials flow via HPE SSO. Handles:
- Token caching to `.token_cache_central.json` (2-hour validity, 5-min buffer)
- Automatic refresh on expiration
- Respects Aruba Central's 1 token/30 min rate limit

```python
from utils.token_manager import TokenManager
token_manager = TokenManager(client_id=..., client_secret=...)
```

### `config.py`
Loads `config.yaml` with environment variable overrides. Returns a typed dict of all configuration values.

```python
from utils.config import load_config
config = load_config()
aruba_config = config["aruba_central"]
```

### `__init__.py`
Re-exports `CentralAPIClient`, `TokenManager`, and `load_config` for convenience:

```python
from utils import CentralAPIClient, TokenManager, load_config
```
