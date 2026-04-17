# Configuration

The portal loads configuration from three sources, highest priority first:

1. Environment variables (process env or `.env`)
2. `config.yaml` in the repo root
3. Hard-coded defaults in `utils/config.py`

Environment variables always win, so you can override anything per-deployment without touching files.

---

## Required Settings

| Variable               | Purpose                                             |
|------------------------|-----------------------------------------------------|
| `ARUBA_BASE_URL`       | Regional API endpoint                               |
| `ARUBA_CLIENT_ID`      | OAuth2 client ID                                    |
| `ARUBA_CLIENT_SECRET`  | OAuth2 client secret                                |
| `ARUBA_CUSTOMER_ID`    | Customer/tenant ID                                  |

The in-app **Setup Wizard** (`http://<host>:1344`) writes these to `.env` for you.

Full list of optional variables: [ENV_VARIABLES.md](ENV_VARIABLES.md).

---

## Regional Base URLs

| Region  | URL                                                   |
|---------|-------------------------------------------------------|
| US East | `https://apigw-prod2.central.arubanetworks.com`       |
| US West | `https://apigw-uswest4.central.arubanetworks.com`     |
| EU      | `https://apigw-eucentral3.central.arubanetworks.com`  |
| APAC    | `https://apigw-apeast1.central.arubanetworks.com`     |

Using the wrong region returns `401 Unauthorized` on every request.

---

## `config.yaml`

Provides non-secret defaults used by scripts and the dashboard. Secrets never live here.

```yaml
aruba_central:
  base_url: "https://apigw-prod2.central.arubanetworks.com"
  # client_id / client_secret / customer_id must come from env

logging:
  level: "INFO"
  format: "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
```

Add script-specific keys here as needed — every script loads this file via `utils.load_config()` and can read arbitrary nested values.

Create `config.local.yaml` for machine-specific overrides; it's git-ignored.

---

## Authentication Flows

`utils/token_manager.py` handles OAuth2 automatically. It picks a flow based on which variables are present.

### Client Credentials (default)

Service-to-service. Requires `ARUBA_CLIENT_ID`, `ARUBA_CLIENT_SECRET`, `ARUBA_CUSTOMER_ID`.

```python
from utils import CentralAPIClient, TokenManager, load_config

cfg = load_config()["aruba_central"]
tm = TokenManager(client_id=cfg["client_id"], client_secret=cfg["client_secret"])
client = CentralAPIClient(base_url=cfg["base_url"], token_manager=tm)

devices = client.get("/monitoring/v1/devices")
```

### Password Grant

User-based. Also set `ARUBA_USERNAME` and `ARUBA_PASSWORD`. `TokenManager` detects them and switches flow.

### Pre-existing Token

If you already have a bearer token, set `ARUBA_ACCESS_TOKEN` and the OAuth dance is skipped.

---

## Token Caching

Aruba Central allows **one new access token per 30 minutes per client**. The `TokenManager` caches the token on disk so restarts don't burn quota.

- Cache file: `.token_cache_central.json` (project root; git-ignored)
- Token lifetime: 2 hours (7200 s)
- Safety buffer: 5 min — refreshes happen before actual expiry
- Docker: the `token-cache` named volume mounts to `/app/data`

### Format

```json
{
  "access_token": "eyJ0eXAiOi...",
  "expires_at": 1734200000.0,
  "token_type": "Bearer"
}
```

### When to clear

- `401 Unauthorized` repeatedly after a credential rotation
- You regenerated the client secret in Aruba Central
- The file is obviously corrupt

```bash
# Local
rm .token_cache_central.json

# Docker
docker compose down
docker volume rm aruba-central-portal_token-cache
docker compose up -d
```

---

## Dashboard Backend Config

The Flask backend (`dashboard/backend/app.py`) reads:

- `FLASK_ENV` — `production` (default) or `development`
- `LOG_LEVEL` — defaults to `INFO`
- `PUID` / `PGID` — container user (Docker only; default `1000:1000`)
- `GL_RBAC_CLIENT_ID` / `GL_RBAC_CLIENT_SECRET` — enables `/gl/*` (GreenLake RBAC) pages
- `GRAFANA_API_KEY` — allows Grafana to pull KPIs from `/api/grafana/kpis`
- `OLLAMA_URL` / `OLLAMA_MODEL` — configure the built-in chat assistant backend

HTTP response caching lives in `dashboard/backend/routes/helpers.py`:

- `cached_get(path, ttl=...)` — tiered TTL cache for GET responses
- `parallel_get(paths)` — ThreadPoolExecutor fan-out for parallel backend fetches

### Running Behind a Reverse Proxy

Production deployments should terminate TLS at a reverse proxy (nginx / Traefik / Caddy) and forward to `localhost:1344`. See [DOCKER.md](../DOCKER.md#https-in-production) for an nginx example.

Set `X-Forwarded-Proto` so Flask generates correct `https://` URLs.

---

## Security Checklist

- [ ] `.env` is git-ignored (`git check-ignore .env`)
- [ ] `chmod 600 .env .token_cache_central.json`
- [ ] Production uses process env vars, not a committed `.env`
- [ ] Credentials rotated at least every 90 days
- [ ] OAuth2 scopes reduced to what you actually use
- [ ] Reverse proxy terminates TLS in production
- [ ] Separate credentials for dev / staging / prod

---

## Validating Your Setup

```python
from utils import CentralAPIClient, TokenManager, load_config

cfg = load_config()["aruba_central"]
tm = TokenManager(client_id=cfg["client_id"], client_secret=cfg["client_secret"])
client = CentralAPIClient(base_url=cfg["base_url"], token_manager=tm)

try:
    resp = client.get("/network-monitoring/v1alpha1/devices")
    print(f"OK — {resp.get('count', 0)} device(s)")
except Exception as exc:
    print(f"FAIL — {exc}")
```

Or use the diagnostic helpers:

```bash
./scripts/ops/debug-setup.sh        # local setup sanity
./tools/diagnose-greenlake.sh       # GreenLake RBAC
```

---

## Common Errors

| Error                         | Likely cause                                                 | Fix                                         |
|-------------------------------|--------------------------------------------------------------|---------------------------------------------|
| `401 Unauthorized`            | Wrong region, bad creds, or cached token invalid             | Check `ARUBA_BASE_URL`, delete `.token_cache_central.json`, re-verify creds |
| `429 Too Many Requests`       | Hit the 30-min token issuance limit                          | Wait 30 min; make sure caching is on       |
| `ModuleNotFoundError`         | venv not activated / deps not installed                      | `source venv/bin/activate && make install-dev` |
| `.env` not loading            | `python-dotenv` missing or running from wrong cwd            | `pip install python-dotenv`; run from repo root |
| `config.yaml not found`       | Running a script outside the repo                            | `cd` to the repo root or set `CONFIG_PATH`  |

---

## References

- [Aruba Central API docs](https://developer.arubanetworks.com/aruba-central/docs)
- [OAuth2 client credentials flow](https://oauth.net/2/grant-types/client-credentials/)
- [ENV_VARIABLES.md](ENV_VARIABLES.md) — every variable
- [HOW_IT_WORKS.md](HOW_IT_WORKS.md) — end-to-end architecture
- [GREENLAKE_ROLES.md](GREENLAKE_ROLES.md) — RBAC model
