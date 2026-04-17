# Aruba Central Dashboard

Full-stack web UI for HPE Aruba Central: Flask backend proxies the Aruba API, React SPA renders the UI.

[![Python](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/)
[![Node](https://img.shields.io/badge/node-18+-339933.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18-61dafb.svg)](https://react.dev/)
[![Flask](https://img.shields.io/badge/flask-backend-black.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](../LICENSE)

This directory contains the dashboard application. The repo's top-level [README](../README.md) covers the whole project (dashboard + scripts + utils).

---

## Preview

| Dashboard | Devices | GreenLake |
|-----------|---------|-----------|
| ![Dashboard](../docs/screenshots/dashboard.png) | ![Devices](../docs/screenshots/devices.png) | ![GreenLake](../docs/screenshots/greenlake.png) |

---

## What's Inside

```
dashboard/
├── backend/
│   ├── app.py              # Flask entry point + middleware
│   └── routes/             # Blueprints: auth, devices, monitoring,
│                           #   config, troubleshoot, greenlake, chat
└── frontend/
    ├── src/
    │   ├── pages/          # Routed views
    │   ├── hooks/          # TanStack Query hooks
    │   ├── components/     # Shared UI
    │   └── contexts/       # Auth, theme
    ├── public/
    └── vite.config.js
```

---

## Running Locally

See [../docs/SETUP.md](../docs/SETUP.md) for full instructions.

Short version:

```bash
# from repo root
source venv/bin/activate
python dashboard/backend/app.py              # Flask on :5001

# new terminal
cd dashboard/frontend
npm run dev                                  # Vite on :1344, proxies /api to :5001
```

Open `http://localhost:1344`.

Docker: `docker compose up -d` — see [../DOCKER.md](../DOCKER.md).

---

## Features

**Monitoring & reporting**
Device health, client tracking, alerts, events, topology, RF stats, WAN health, firmware inventory, scheduled reports.

**Configuration**
WLAN wizard (SSID creation with security/VLAN selection), AP groups, policies, guest access, NAC, webhooks.

**Troubleshooting**
Ping/trace, AP diagnostics, packet capture, cable tests, RF diagnostics.

**HPE GreenLake RBAC** (optional — requires `GL_RBAC_CLIENT_ID/SECRET`)
Devices, users, locations, tags, subscriptions, roles, workspaces, permissions.

**Chat assistant**
Ollama-backed natural-language queries about your Aruba data, wired into the backend blueprints via an MCP client.

**Cross-cutting**
Session auth, per-IP rate limiting, response caching (`cached_get`) with tiered TTL, parallel fan-out (`parallel_get`), gzip + brotli compression, secure headers.

---

## Architecture

```
Browser (React SPA)
        │  /api/* + X-Session-ID
        ▼
Flask backend (dashboard/backend/app.py)
  blueprints — auth / devices / monitoring / config /
               troubleshoot / greenlake / chat
  helpers  — cached_get, parallel_get
        │  Bearer token (TokenManager)
        ▼
HPE Aruba Central API (apigw-*.central.arubanetworks.com)
```

Full walk-through: [../docs/HOW_IT_WORKS.md](../docs/HOW_IT_WORKS.md)
Dashboard deep-dive: [../docs/dashboard/ARCHITECTURE.md](../docs/dashboard/ARCHITECTURE.md)

---

## Stack

**Backend** — Flask · Flask-CORS · Flask-Compress · gunicorn (prod) · `utils.CentralAPIClient` · `utils.TokenManager`

**Frontend** — React 18 · Vite · Material-UI · TanStack Query · React Router v6 · Recharts

**Auth** — OAuth2 client credentials → Aruba; opaque session IDs → browser

---

## Ports

| Mode        | Frontend                 | Backend                  |
|-------------|--------------------------|--------------------------|
| Dev         | `http://localhost:1344`  | `http://localhost:5001` (Vite proxies `/api/*`) |
| Docker/prod | `http://<host>:1344`     | same port (Flask serves built SPA) |

Override the dev proxy target with `DASHBOARD_DEV_API_PROXY`.

---

## Building for Production

```bash
cd dashboard/frontend
npm ci
npm run build          # → dashboard/frontend/build/
```

Flask's `static_folder='../frontend/build'` picks this up automatically. In Docker the multi-stage build does this for you.

---

## Testing

```bash
# from repo root
make test              # pytest — backend + utils
make test-cov          # with coverage
```

Frontend tests are not yet set up.

---

## Related Docs

- [../README.md](../README.md) — project overview
- [../DOCKER.md](../DOCKER.md) — Docker deployment
- [../docs/SETUP.md](../docs/SETUP.md) — local dev
- [../docs/HOW_IT_WORKS.md](../docs/HOW_IT_WORKS.md) — end-to-end request flow
- [../docs/dashboard/ARCHITECTURE.md](../docs/dashboard/ARCHITECTURE.md) — dashboard internals
- [../docs/dashboard/FEATURES.md](../docs/dashboard/FEATURES.md) — per-feature notes
- [../docs/GREENLAKE_ROLES.md](../docs/GREENLAKE_ROLES.md) — two-tier RBAC
- [../CLAUDE.md](../CLAUDE.md) — contributor conventions
