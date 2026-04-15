# Scripts

Automation scripts organized by domain. All scripts use `utils/central_api_client.py` for authenticated API access.

## Directories

| Directory | Purpose |
|-----------|---------|
| `discovery/` | API exploration and UUID lookup tools |
| `network/wlan/` | WLAN creation, cleanup, and debugging |
| `monitoring/` | Network health checks and alerting |
| `users/` | User audit and management |
| `tenants/` | MSP tenant operations |
| `testing/` | Integration test scripts |
| `wlan-testing/` | WLAN CLI and scope tooling |
| `ops/` | Operational scripts — deployment, updates, setup |
| `ops/windows/` | Windows PowerShell equivalents |

## Usage Pattern

All scripts follow this initialization pattern (see `CLAUDE.md` for details):

```python
from utils import CentralAPIClient, TokenManager, load_config

config = load_config()
aruba_config = config["aruba_central"]
token_manager = TokenManager(client_id=aruba_config["client_id"], ...)
client = CentralAPIClient(base_url=aruba_config["base_url"], token_manager=token_manager)
```

## CLI Tools

```bash
# WLAN management
python scripts/wlan-testing/wlan_cli.py list
python scripts/wlan-testing/wlan_cli.py create <name> -p "password"

# Scope/site discovery
python scripts/wlan-testing/scope_cli.py sites
python scripts/wlan-testing/scope_cli.py wlans <site>
```
