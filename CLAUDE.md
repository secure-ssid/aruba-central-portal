# CLAUDE.md

Python automation + Flask/Vite dashboard for the Aruba Central (HPE) API.
OAuth2 client-credentials against HPE SSO, Central REST on top.

This file is part **operating contract**, part **map**, part **rulebook of
scars**. Read it every session. For setup / Docker / screenshots see
`README.md`, `START_HERE.md`, `DOCKER_DEPLOYMENT.md`.

---

## Operating Principles

1. **Think before coding.** State assumptions out loud: which region, which
   tenant, real API or mock? If the request is ambiguous, ask — don't paper
   over confusion with plausible-looking code.
2. **Don't bypass existing infrastructure.** This repo's bugs come from
   ignoring the plumbing (retry, pagination, 401 refresh, caching), not from
   over-engineering. Re-using is simpler than rewriting.
3. **Surgical changes.** Touch only what the task requires. Match surrounding
   style. Don't refactor adjacent code you happen to dislike.
4. **Goal-driven.** Every change has a verifiable success criterion: a
   passing test, a concrete API response, a reproduced bug fixed. If you
   can't state it, you're not ready to code.

---

## Repo Map

```
utils/              OAuth + HTTP client (shared by scripts AND backend)
scripts/            CLI tools grouped by domain
dashboard/backend/  Flask app (entry: app.py) + Blueprints in routes/
dashboard/frontend/ Vite + React + TanStack Query
tests/              pytest; mocks HTTP with `responses` + unittest.mock
docs/               Local copies of Central/GreenLake API docs — search HERE first
tools/              Shell diagnostics (e.g. diagnose-greenlake.sh)
```

### Core modules (read before editing)

- `utils/central_api_client.py` — `CentralAPIClient`. Auto token refresh,
  429 retry with `Retry-After`, one-shot 401 refresh-and-retry,
  pagination helpers. Raises `CentralAPIError` with `.status_code` / `.error_code`.
- `utils/token_manager.py` — OAuth2 client-credentials via HPE SSO. Caches
  token to `.token_cache_central.json` (chmod 0o600). Respects `TOKEN_CACHE_DIR`.
- `utils/config.py` — `load_config()` merges `config.yaml` + `.env` (env wins).

### Dashboard backend (`dashboard/backend/`)

- Entry: `app.py`. Blueprints wired via `register_all_blueprints(app)`.
- Blueprint registry: `routes/__init__.py`. Add a blueprint? Register it here.
- Blueprints in `routes/`: `auth`, `monitoring`, `devices`, `config`,
  `troubleshoot`, `greenlake`, `chat`, `events`.
- **`routes/helpers.py` is THE shared module** — import from it, don't re-roll:
  - `cached_get(endpoint, params, ttl=None)` — tiered cache via `CACHE_TIERS`
    (inventory/sites/WLANs 300s, clients 60s, sites-health 30s, alerts 15s).
  - `cached_get_paginated(...)` — auto-pages list endpoints.
  - `parallel_get(calls)` — ThreadPoolExecutor fan-out.
  - `api_proxy(endpoint_builder, ...)` decorator — standard error → JSON mapping.
  - `rate_limit(max_requests, window_seconds)` decorator — per-IP sliding window.
  - `require_session` decorator — session cookie/header check.
  - `monitoring_list_items(resp)` — extracts list from varying response shapes
    (`items` on old endpoints, `result` on newer — don't hard-code either).

### Dashboard frontend (`dashboard/frontend/src/`)

- API access goes through hooks in `hooks/useApiQueries.js` (TanStack Query).
  Reuse `useDevices`, `useSwitches`, `useAccessPoints`, `useGateways`,
  `useSites`, `useNetworkHealth`, `useSitesHealth`, `useClients`, `useAlerts`,
  `useTokenInfo`, `useRateLimit`, and the GreenLake family. Don't `fetch()` inline.

### Scripts (`scripts/`)

`discovery/`, `network/wlan/`, `users/`, `tenants/`, `monitoring/`,
`wlan-testing/`, `ops/` (incl. `ops/windows/`), `testing/` (ad-hoc probes,
NOT pytest). Top-level shells: `qa_smoke.sh`, `qa_full.sh`, `dev-backend.sh`.

---

## Project Invariants (non-negotiable)

### Secrets
- Credentials load from `.env` / env vars only. Never hard-code.
- Never log `Authorization`, `client_secret`, or `access_token`. Redact first.
- Never commit `.env`, `config.local.yaml`, or `.token_cache_*.json`.
- Don't bake secrets into Docker images — `docker-entrypoint.sh` reads env at runtime.

### Central API calls
- Route every Central call through `CentralAPIClient`. No direct `requests.get(base_url+...)`,
  no custom retry loops, no parallel token caches.
- Branch on `CentralAPIError.status_code` / `.error_code`. Never string-match
  `"404" in str(e)`.
- Never swallow 401 — let the client's refresh path run, then re-raise.
- Use `get_all_paginated()` / `cached_get_paginated()` for list endpoints.
  Single-page calls silently truncate.
- Response shape varies: use `monitoring_list_items()` / `_extract_paginated_list()`.
  Don't hard-code `items` or `result`.

### Endpoint namespaces (real footguns)
- Alerts: `/network-notifications/v1/alerts` — NOT `/network-monitoring/`.
- Device / AP / client inventory: `/network-monitoring/v1/...`.
- WLAN config: `/network-config/v1alpha1/wlan-ssids`. The `v1alpha1` is load-bearing.
- Verify paths in `docs/` before the web.

### Caching
- Use `cached_get` / `cached_get_paginated` / `parallel_get` in routes.
- Respect `CACHE_TIERS` (helpers.py). Don't pass `ttl=0` or a shorter TTL
  to "get fresh data" — that's how rate-limit incidents start.
- New cacheable endpoint? Add it to `CACHE_TIERS`. Don't sprinkle magic TTLs.

### Flask routes
- New routes are blueprints registered via `register_all_blueprints()`.
- Gate auth-bearing endpoints with `@require_session`; expensive/public ones
  with `@rate_limit(...)`.
- Use `@api_proxy` for thin passthroughs — uniform `CentralAPIError` handling.
- Don't `import app` at blueprint module top level. Use the helpers.

### Tests
- Tests never hit the real Central API. Mock with `responses` + `unittest.mock`;
  fixtures in `tests/conftest.py`.
- New script / route / util → new test. No untested API surface ships.
- `make all` (format + lint + type-check + test) must pass before committing.
- Don't `git commit --no-verify` to skip hooks — fix the root cause.

### Regional URLs
- `ARUBA_BASE_URL` / `CENTRAL_BASE_URL` in `.env` must match the customer's
  region (EU / US / APAC). 401s that survive a fresh token almost always
  mean wrong-region base URL, not a code bug.

---

## Commands

```bash
# Setup
python -m venv venv && source venv/bin/activate
make install-dev
cp env.template .env          # or .env.example — both exist; env.template is more commented

# Development gate (run before commit)
make all                      # format + lint + type-check + test

# Individual
make test                     # pytest tests/ -v
make test-cov                 # coverage
make lint                     # ruff on utils/ tests/ scripts/
make format                   # black
make format-check             # black --check (CI-safe)
make type-check               # mypy utils/
make pre-commit               # install pre-commit hooks
make clean                    # nuke caches

# CLIs
./venv/bin/python scripts/wlan-testing/wlan_cli.py list
./venv/bin/python scripts/wlan-testing/wlan_cli.py create <name> -p "password"
./venv/bin/python scripts/wlan-testing/scope_cli.py sites
./venv/bin/python scripts/wlan-testing/scope_cli.py wlans <site>

# Docker: see DOCKER_DEPLOYMENT.md
```

Activate the venv (`./venv/bin/python ...` or `source venv/bin/activate`)
before running anything. System Python does not have the deps.

---

## When Stuck

- `401 Unauthorized` → check `.env` creds and region; tokens expire in the HPE portal.
- `Module not found` → venv not active, or `make install-dev` not run.
- GreenLake auth weirdness → `tools/diagnose-greenlake.sh`.
- API shape questions → `docs/api/`, `docs/greenlake/` BEFORE WebFetch.
- If `docs/` and code disagree, **code wins** — flag the stale doc.
