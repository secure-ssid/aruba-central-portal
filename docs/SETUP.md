# Local Development Setup

Run the portal locally with the Python backend + Vite frontend for live reload. For Docker, see [../DOCKER.md](../DOCKER.md).

Windows/PowerShell specifics live in [DEV_SETUP.md](DEV_SETUP.md).

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- Aruba Central API credentials (see [ENV_VARIABLES.md](ENV_VARIABLES.md))

---

## Clone and Install

```bash
git clone https://github.com/secure-ssid/aruba-central-portal.git
cd aruba-central-portal

python3 -m venv venv
source venv/bin/activate              # Windows: .\venv\Scripts\Activate.ps1

make install-dev                      # installs runtime + dev deps

cd dashboard/frontend
npm install
cd ../..
```

---

## Run

Two terminals:

```bash
# Terminal 1 — backend
source venv/bin/activate
./venv/bin/python dashboard/backend/app.py
```

```bash
# Terminal 2 — frontend
cd dashboard/frontend
npm run dev
```

Open `http://localhost:1344`. The Vite dev server proxies `/api/*` to the Flask backend, so everything is served from a single URL.

Complete the Setup Wizard on first visit — it writes credentials to `.env` for you.

On Windows, `scripts/ops/windows/start-dev.ps1` starts both services in one go.

---

## Tests

```bash
make test                                      # full suite
./venv/bin/python -m pytest tests/ -x -q       # quick smoke
make test-cov                                  # coverage report
```

---

## Quality Gates

```bash
make lint          # ruff
make format        # black
make type-check    # mypy
make all           # lint + format + type-check + test
```

---

## Project Layout

```
dashboard/
  backend/         Flask app, blueprints under routes/
  frontend/        React SPA (Vite)
scripts/           CLI tools (discovery, wlan, users, tenants, monitoring, ops, testing)
utils/             Shared API client, token manager, config loader
tests/             pytest suite
docs/              This documentation
tools/             Diagnostics (e.g. diagnose-greenlake.sh)
```

---

## Common Issues

**Module not found**

```bash
source venv/bin/activate
make install-dev
```

**Port 1344 in use** — see [troubleshooting/FIX_PORT_1344.md](troubleshooting/FIX_PORT_1344.md).

**npm install fails**

```bash
cd dashboard/frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Node.js not found on Windows** — see [troubleshooting/FIX_NODEJS_PATH.md](troubleshooting/FIX_NODEJS_PATH.md).

**`401 Unauthorized`** — verify `ARUBA_BASE_URL` matches your region; delete `.token_cache_central.json` and retry.

---

## Related

- [../DOCKER.md](../DOCKER.md) — Docker setup
- [ENV_VARIABLES.md](ENV_VARIABLES.md) — every environment variable
- [CONFIGURATION.md](CONFIGURATION.md) — `config.yaml`, token cache, auth flows
- [HOW_IT_WORKS.md](HOW_IT_WORKS.md) — architecture
- [../CLAUDE.md](../CLAUDE.md) — contributor conventions
