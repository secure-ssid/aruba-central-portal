# CLAUDE.md

Contributor conventions and quick reference for the Aruba Central Portal repo.

## Project

Python + React toolkit for HPE Aruba Central. Two layers:

- **Dashboard** (`dashboard/`) — Flask backend + React (Vite) frontend.
- **Scripts + utils** (`scripts/`, `utils/`) — CLI automation sharing the same Aruba API client.

## Architecture

- `utils/central_api_client.py` — HTTP client with bearer-token injection, rate-limit retry, exponential backoff.
- `utils/token_manager.py` — OAuth2 client credentials flow, token cache, honors Aruba's 30-min token-issuance lock.
- `utils/config.py` — merges `config.yaml` + env vars (env wins).
- `scripts/` — by domain: `discovery/`, `network/wlan/`, `users/`, `tenants/`, `monitoring/`, `wlan-testing/`, `testing/`, `ops/`.
- `dashboard/backend/app.py` — Flask entry point; registers blueprints via `routes.register_all_blueprints(app)`.
- `dashboard/backend/routes/` — blueprints: `auth`, `devices`, `monitoring`, `config`, `troubleshoot`, `greenlake`, `chat`.
- `dashboard/backend/routes/helpers.py` — `cached_get()` (tiered TTL) and `parallel_get()` (ThreadPoolExecutor).
- `dashboard/frontend/src/hooks/useApiQueries.js` — TanStack Query hooks for every backend endpoint.
- `docs/` — project docs and local API references; search here before the web.

## Dev Commands

```bash
make help          # all targets
make install-dev   # runtime + dev deps
make test          # pytest
make test-cov      # coverage report
make lint          # ruff
make format        # black
make type-check    # mypy
make all           # format + lint + type-check + test
make clean         # cache cleanup
```

```bash
# First-time setup
python3 -m venv venv && source venv/bin/activate
make install-dev
cp env.template .env   # then run the Setup Wizard to fill it in
```

## Running the Dashboard

```bash
# Backend (Flask, dev port 5001)
./venv/bin/python dashboard/backend/app.py

# Frontend (Vite, port 1344, proxies /api/* to backend)
cd dashboard/frontend && npm install && npm run dev

# Or Docker (production-style)
docker compose up -d
```

Details: [DOCKER.md](DOCKER.md), [docs/SETUP.md](docs/SETUP.md).

## CLI Tools

```bash
# WLAN CLI
./venv/bin/python scripts/wlan-testing/wlan_cli.py list
./venv/bin/python scripts/wlan-testing/wlan_cli.py create <name> -p "password"

# Scope / site discovery
./venv/bin/python scripts/wlan-testing/scope_cli.py sites
./venv/bin/python scripts/wlan-testing/scope_cli.py wlans <site>

# Ops
./scripts/ops/debug-setup.sh          # local setup sanity
./tools/diagnose-greenlake.sh         # GreenLake RBAC diagnostics
```

## Code Conventions

- Python 3.10+, black (88 col), ruff, mypy `--ignore-missing-imports`.
- Scripts bootstrap the client via `utils.load_config()`; never hard-code credentials.
- Backend routes belong in a blueprint under `dashboard/backend/routes/` — do not add them to `app.py`.
- New endpoints go through `cached_get` / `parallel_get` when they proxy Aruba GETs.
- Tests are required for every new script or blueprint; mock HTTP with `unittest.mock` or `responses`.

## Security

- Never commit `.env`, `.token_cache_central.json`, or `config.local.yaml` (all git-ignored).
- Credentials only in env vars or `.env`.
- Use least-privilege OAuth2 scopes; rotate client secrets regularly.
- See [docs/GIT_SECURITY.md](docs/GIT_SECURITY.md) for repo hygiene rules.

## Common Issues

- **`401 Unauthorized`** — wrong `ARUBA_BASE_URL` region, bad credentials, or corrupt `.token_cache_central.json`. Delete the cache and retry.
- **`429 Too Many Requests`** — you hit Aruba's 30-min token cap. Caching should prevent this; confirm `TokenManager` isn't being bypassed.
- **`ModuleNotFoundError`** — venv not activated or deps not installed (`make install-dev`).
- **GreenLake `/gl/*` pages banner** — `GL_RBAC_CLIENT_ID` / `GL_RBAC_CLIENT_SECRET` not set.

## Testing

```bash
make test                                      # full suite
./venv/bin/python -m pytest tests/ -x -q       # quick smoke
```

Coverage targets: `central_api_client.py` ≥90%, `token_manager.py` ≥90%, `config.py` ≥85%.
Add tests under `tests/` for every new utility or script. Mock Aruba responses with `unittest.mock` or `responses`.

## Docs to Keep in Mind

- [README.md](README.md) — project overview
- [DOCKER.md](DOCKER.md) — Docker workflow
- [docs/SETUP.md](docs/SETUP.md), [docs/DEV_SETUP.md](docs/DEV_SETUP.md)
- [docs/CONFIGURATION.md](docs/CONFIGURATION.md), [docs/ENV_VARIABLES.md](docs/ENV_VARIABLES.md)
- [docs/HOW_IT_WORKS.md](docs/HOW_IT_WORKS.md) — end-to-end architecture
- [docs/GREENLAKE_ROLES.md](docs/GREENLAKE_ROLES.md) — RBAC model
- [docs/dashboard/ARCHITECTURE.md](docs/dashboard/ARCHITECTURE.md), [docs/dashboard/FEATURES.md](docs/dashboard/FEATURES.md)
