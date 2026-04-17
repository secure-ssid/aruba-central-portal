# How It Works

End-to-end architecture of the Aruba Central Portal — how a browser click becomes an authenticated call to HPE Aruba Central, and how the response gets cached, served, and rendered.

---

## 1. Stack at a Glance

| Layer         | Technology                                                  |
|---------------|-------------------------------------------------------------|
| Frontend      | React 18 + Vite, MUI, TanStack Query, React Router          |
| Backend       | Flask (gunicorn in prod), Flask-CORS, Flask-Compress        |
| Auth          | OAuth2 client credentials to Aruba Central + session cookies to the UI |
| Token cache   | `.token_cache_central.json` (local) / Docker volume `token-cache`   |
| API client    | `utils/central_api_client.py` + `utils/token_manager.py`    |
| Optional      | HPE GreenLake RBAC, Ollama chat assistant, Grafana KPIs     |

Port layout:

- **1344** — production: Flask serves the built SPA + API; dev: Vite dev server (proxies `/api/*` to Flask).
- **5001** — Flask dev server (proxied to by Vite; `5000` is avoided to dodge macOS AirPlay).

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  Browser — React SPA (MUI + TanStack Query)                      │
│  • Calls /api/* with X-Session-ID header                         │
└──────────────────┬───────────────────────────────────────────────┘
                   │  HTTP(S)
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│  Flask Backend — dashboard/backend/app.py                        │
│  Blueprints (dashboard/backend/routes/):                         │
│    auth · devices · monitoring · config · troubleshoot ·         │
│    greenlake · chat                                              │
│  Cross-cutting:                                                  │
│    • Per-IP rate limit (default 300 req/min)                     │
│    • Session store (disk-persisted, 1h timeout)                  │
│    • cached_get() + parallel_get() in routes/helpers.py          │
│    • Response compression (gzip + brotli)                        │
└──────────────────┬───────────────────────────────────────────────┘
                   │  Bearer token (auto-refreshed)
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│  utils.CentralAPIClient + utils.TokenManager                     │
│  • OAuth2 client credentials                                     │
│  • 2h tokens, 5-min refresh buffer, 30-min issuance lock         │
│  • Rate-limit-aware retry + exponential backoff                  │
└──────────────────┬───────────────────────────────────────────────┘
                   │  HTTPS
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│  HPE Aruba Central — regional apigw-* endpoint                   │
└──────────────────────────────────────────────────────────────────┘
```

Optional side-channels:

- **HPE GreenLake IAM/SCIM** — populates `/gl/*` pages when `GL_RBAC_CLIENT_ID/SECRET` are set.
- **Ollama** — local LLM backend for the chat assistant (`OLLAMA_URL`, `OLLAMA_MODEL`).
- **Grafana** — `/api/grafana/kpis` auth'd via header `X-Grafana-API-Key`.

---

## 3. Startup

`dashboard/backend/app.py`:

1. Loads `.env` from the repo root.
2. Builds the Flask app, enables CORS + gzip/brotli compression.
3. Registers blueprints via `routes.register_all_blueprints(app)`.
4. Calls `initialize_client()` — loads `config.yaml`, builds a `TokenManager` and `CentralAPIClient`, and caches them module-globals.
5. Starts a background thread (`_auth_retry_loop`) that keeps retrying init on credential failures with exponential backoff (60 s → 15 min, max 50 tries).
6. Starts accepting requests on `0.0.0.0:PORT` (5001 dev / 1344 prod).

If credentials are missing or invalid, the server stays up and serves the **Setup Wizard** page — every API call returns `500 {"error": "Server not configured..."}` until credentials are saved.

---

## 4. Authentication

### OAuth2 (Aruba Central)

Client credentials grant (default):

```
POST {ARUBA_BASE_URL}/oauth2/token
  grant_type=client_credentials
  client_id=...
  client_secret=...

→ { "access_token": "...", "expires_in": 7200 }
```

The token is cached to `.token_cache_central.json` (Docker: `/app/data/.token_cache_central.json`). All subsequent Central calls use `Authorization: Bearer <token>` until the token is ~5 min from expiry, then `TokenManager` refreshes automatically.

### Aruba's 30-minute Token Issuance Cap

Aruba Central only issues **1 new token per client every 30 minutes**. `TokenManager` serializes refresh and honors the cap to avoid `429` storms on restart.

### Dashboard Sessions

The React SPA stores `sessionId` in `localStorage`; every `/api/*` call sends it as `X-Session-ID`. The `require_session` decorator validates / refreshes (1 h idle timeout), and the store is persisted to disk (`TOKEN_CACHE_DIR/sessions.json`) so sessions survive worker restarts and gunicorn fan-out.

---

## 5. Request Flow (typical GET)

1. **Browser:** `useDevices()` React Query hook fires `GET /api/devices`.
2. **Flask:** `before_request` enforces per-IP rate limit (default 300/min; stream endpoints excluded).
3. **`@require_session`** validates `X-Session-ID`, refreshes expiry, tracks the call.
4. **Blueprint handler** (`routes/devices.py`) calls `cached_get("/monitoring/v1/devices", ttl=30)`.
5. **`cached_get`** hits the in-process cache; on miss, calls `aruba_client.get(...)`.
6. **`CentralAPIClient`** attaches bearer token, retries on 429 with backoff, parses JSON.
7. Response returns to the browser with cache headers, compressed, and TanStack Query keeps it fresh with its own client-side cache.

Cross-cutting headers set on every response:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- API paths: `Cache-Control: no-store, no-cache, must-revalidate`
- Static assets: `Cache-Control: public, max-age=31536000, immutable`

---

## 6. Backend Blueprints

Each blueprint is mounted under `/api/<name>` via `routes/__init__.py`.

| Blueprint       | What it proxies / owns                                                        |
|-----------------|-------------------------------------------------------------------------------|
| `auth`          | Login, logout, session status, credential save (Setup Wizard)                 |
| `devices`       | APs, switches, gateways — list, detail, stats, commands                       |
| `monitoring`    | Health, sites, clients, alerts, events, topology, RF, WAN, firmware, reports  |
| `config`        | WLAN CRUD, VLAN, AP groups, policies, guest, NAC, setup wizard config        |
| `troubleshoot`  | Ping/trace, AP diagnostics, packet capture, cable test, RF diagnostics        |
| `greenlake`     | `/gl/*` — SCIM users/groups, platform roles, workspaces, subscriptions, tags  |
| `chat`          | Ollama-backed assistant, MCP client integration                               |

Shared helpers in `routes/helpers.py`:

- `cached_get(path, ttl)` — tiered TTL cache (short for dynamic data, long for metadata).
- `parallel_get(paths)` — `ThreadPoolExecutor` fan-out for dashboard pages that need many endpoints at once (e.g. the overview).

---

## 7. Frontend Architecture

```
dashboard/frontend/src/
  pages/              Routed views (DashboardPage, DevicesPage, WLANsPage, GL*Page, ...)
  hooks/              useApiQueries.js — every TanStack Query hook lives here
  components/         Shared UI (tables, charts, modals, breadcrumbs, sidebar)
  utils/              Formatters, API client, auth helpers
  contexts/           Global contexts (auth, theme)
```

Key patterns:

- **TanStack Query** for every `/api/*` fetch — dedupes requests, caches in memory, revalidates on focus.
- **React Router v6** for navigation; each page owns its own queries.
- **MUI theme** switches via the theme context; preference persists in `localStorage`.
- **Setup Wizard** is its own full-page flow rendered when the backend reports `credentials_configured: false`.

Build:

```bash
cd dashboard/frontend && npm run build   # emits dashboard/frontend/build/
```

Flask's `static_folder='../frontend/build'` serves the built SPA in production.

---

## 8. Token Cache Layout

Local dev (`.token_cache_central.json` in repo root):

```json
{
  "access_token": "eyJ0eXAi...",
  "expires_at": 1734200000.0,
  "token_type": "Bearer"
}
```

Docker: `token-cache` named volume mounted at `/app/data`. `TOKEN_CACHE_DIR` env var overrides the location (used by the container).

Session store: `TOKEN_CACHE_DIR/sessions.json` — persists in-memory session dict across gunicorn workers.

---

## 9. Error Handling

The `api_proxy` decorator in `app.py` converts upstream errors to consistent JSON:

| Upstream                          | Response to SPA                                           |
|-----------------------------------|-----------------------------------------------------------|
| `aruba_client` not initialized    | 500, `{"error": "Server not configured..."}`              |
| 401 Unauthorized                  | 401, `{"error": "Authentication required"}`               |
| 403 Forbidden                     | 403, `{"error": "Access forbidden: <context>"}`           |
| 404 Not Found (GET)               | 200, `{"data": [], "count": 0, "total": 0}` (graceful)   |
| 404 Not Found (non-GET)           | 404, `{"error": "Resource not found: <context>"}`         |
| 400 Bad Request                   | 400, passes Aruba error text through                      |
| 429 Too Many Requests             | `TokenManager` retries with backoff before giving up      |
| Other HTTPError                   | Propagates status code + generic message, logs details    |

---

## 10. Deployment

### Docker (recommended)

`docker-compose up -d` — builds the image (multi-stage: Node build then Python slim), runs as `PUID:PGID` (default `1000:1000`), mounts `token-cache` and `.env` as a read/write volume. The container runs `docker-entrypoint.sh`, which launches gunicorn on `0.0.0.0:1344`.

Healthcheck hits `http://localhost:1344/api/health` every 30 s (40 s grace period).

### Bare metal

Start the backend with gunicorn:

```bash
./venv/bin/gunicorn -b 0.0.0.0:1344 -w 4 dashboard.backend.app:app
```

Front with nginx/Caddy for TLS; set `X-Forwarded-Proto` so Flask generates `https://` URLs.

### Updates

```bash
git pull
docker compose up -d --build            # Docker
# or
pip install -r requirements.txt         # bare metal
cd dashboard/frontend && npm ci && npm run build
systemctl restart aruba-central-portal
```

---

## 11. Security Model

- Secrets never reach the browser — all Aruba API calls are proxied through Flask.
- OAuth2 tokens live server-side only, with an encrypted cache and the 30-min issuance lock enforced.
- Session IDs are opaque and tied to `X-Session-ID`; no cookies with `HttpOnly: false` carry credentials.
- Per-IP rate limits on every `/api/*` path; strict limits on login / setup.
- Response headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` set on everything.
- `.env` and `.token_cache_central.json` are git-ignored.
- The GreenLake RBAC pages require separate credentials and present read-only banners when those aren't set.

See [GREENLAKE_ROLES.md](GREENLAKE_ROLES.md) for the two-tier RBAC model and [GIT_SECURITY.md](GIT_SECURITY.md) for repo hygiene.

---

## 12. Related

- [../DOCKER.md](../DOCKER.md) — running in Docker
- [SETUP.md](SETUP.md) — local dev setup
- [CONFIGURATION.md](CONFIGURATION.md) — auth flows and token cache details
- [ENV_VARIABLES.md](ENV_VARIABLES.md) — full env reference
- [dashboard/ARCHITECTURE.md](dashboard/ARCHITECTURE.md) — dashboard internals in more depth
