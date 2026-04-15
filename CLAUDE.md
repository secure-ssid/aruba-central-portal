# CLAUDE.md

## Project Overview

Python automation framework for Aruba Central API. Provides reusable utilities and scripts for network management, device operations, monitoring, and reporting. Also contains a Flask + Vite dashboard (`dashboard/`) for visualizing and managing Aruba Central data.

## Architecture

- **`utils/central_api_client.py`** — HTTP client with auto token refresh, rate-limit retry
- **`utils/token_manager.py`** — OAuth2 client credentials via HPE SSO, token caching
- **`utils/config.py`** — loads `config.yaml` + env var overrides
- **`scripts/`** — organized by domain: `discovery/`, `network/wlan/`, `users/`, `tenants/`, `monitoring/`, `wlan-testing/`, `archive/`
- **`dashboard/backend/routes/`** — Flask blueprints: `auth`, `devices`, `monitoring`, `config`, `troubleshoot`, `greenlake`, `chat`
- **`dashboard/backend/routes/helpers.py`** — `cached_get()` (tiered TTL), `parallel_get()` (ThreadPoolExecutor) for API response caching
- **`dashboard/backend/app.py`** — Flask entry point, registers blueprints via `register_all_blueprints(app)`
- **`dashboard/frontend/src/hooks/useApiQueries.js`** — React Query hooks for devices, sites, health, alerts, etc.
- **`docs/`** — local API docs (search here before web); see `.claude/rules/docs-search.md`

## Dev Commands

```bash
make help          # All available commands
make test          # Run all tests
make test-cov      # Tests with coverage report
make lint          # Ruff lint check
make format        # Black formatting
make type-check    # mypy
make all           # format + lint + type-check + test
make clean         # Remove cache files
```

```bash
# Environment setup
python -m venv venv && source venv/bin/activate
make install-dev
cp .env.example .env   # Then add credentials
```

## CLI Tools

```bash
# WLAN CLI
./venv/bin/python scripts/wlan-testing/wlan_cli.py list
./venv/bin/python scripts/wlan-testing/wlan_cli.py create <name> -p "password"

# Scope CLI
./venv/bin/python scripts/wlan-testing/scope_cli.py sites
./venv/bin/python scripts/wlan-testing/scope_cli.py wlans <site>
```

## Security Rules

- Never commit `.env` or `config.local.yaml`
- Credentials only in environment variables or `.env`
- Use least-privilege OAuth2 scopes
- Rotate API credentials regularly

## Common Issues

- **"401 Unauthorized"**: Check `.env` credentials, verify not expired in Aruba Central portal
- **"Module not found"**: Activate virtual environment, run `make install-dev`
- **Regional API URLs**: Verify base URL in `.env` matches your Aruba Central region

## Testing

```bash
make test                                      # Run all 100 tests
./venv/bin/python -m pytest tests/ -x -q       # Quick smoke test
```

Current coverage: `central_api_client.py` 91%, `token_manager.py` 90%, `config.py` 88%

Add tests in `tests/` for every new script. Mock API responses with `unittest.mock` or `responses`.
