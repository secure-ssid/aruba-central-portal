# Windows / PowerShell Development Setup

Linux and macOS users: see [SETUP.md](SETUP.md). The general dev workflow is the same — this guide only covers Windows-specific steps.

---

## Prerequisites

- **Python 3.10+** — [python.org](https://www.python.org/downloads/)
- **Node.js 18+ LTS** — [nodejs.org](https://nodejs.org/)
- **Git for Windows** — [git-scm.com](https://git-scm.com/download/win)
- PowerShell 5.1 or 7+

Verify:

```powershell
python --version
node --version
npm --version
```

If `node` isn't recognized after install, see [troubleshooting/FIX_NODEJS_PATH.md](troubleshooting/FIX_NODEJS_PATH.md).

---

## Clone and Install

```powershell
git clone https://github.com/secure-ssid/aruba-central-portal.git
cd aruba-central-portal

python -m venv venv
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
pip install -r requirements-dev.txt

cd dashboard\frontend
npm install
cd ..\..
```

> If `Activate.ps1` is blocked, allow signed scripts for this session:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

## Run

Helper scripts live under `scripts/ops/windows/`:

```powershell
.\scripts\ops\windows\start-dev.ps1          # backend + frontend in two windows
.\scripts\ops\windows\start-backend.ps1      # backend only
.\scripts\ops\windows\start-frontend.ps1     # frontend only
```

Or run the services manually:

```powershell
# Terminal 1 — backend
.\venv\Scripts\Activate.ps1
python .\dashboard\backend\app.py

# Terminal 2 — frontend
cd .\dashboard\frontend
npm run dev
```

Open `http://localhost:1344`. The Vite dev server proxies `/api/*` to Flask, so both show up on the same URL.

---

## Configure Credentials

Complete the in-app **Setup Wizard** at `http://localhost:1344`. It writes the required values to `.env` in the repo root:

```
ARUBA_BASE_URL
ARUBA_CLIENT_ID
ARUBA_CLIENT_SECRET
ARUBA_CUSTOMER_ID
```

Optional variables (GreenLake RBAC, logging, etc.) are listed in [ENV_VARIABLES.md](ENV_VARIABLES.md).

---

## Tests and Quality

```powershell
.\venv\Scripts\Activate.ps1
pytest                        # full suite
pytest --cov=utils            # with coverage
python -m ruff check utils tests scripts
python -m black utils tests scripts
python -m mypy utils --ignore-missing-imports
```

Or use the repo `Makefile` via WSL / Git Bash:

```bash
make test
make all
```

---

## Common Issues

**Port 1344 already in use**

```powershell
netstat -ano | findstr :1344
taskkill /PID <PID> /F
```

See [troubleshooting/FIX_PORT_1344.md](troubleshooting/FIX_PORT_1344.md) for more.

**Node.js not found after install** — [troubleshooting/FIX_NODEJS_PATH.md](troubleshooting/FIX_NODEJS_PATH.md).

**Module not found**

```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

**`npm install` fails**

```powershell
cd .\dashboard\frontend
Remove-Item -Recurse -Force node_modules, package-lock.json
npm cache clean --force
npm install
```

---

## Related

- [SETUP.md](SETUP.md) — Linux/macOS equivalent
- [../DOCKER.md](../DOCKER.md) — Docker workflow
- [ENV_VARIABLES.md](ENV_VARIABLES.md) — variable reference
- [CONFIGURATION.md](CONFIGURATION.md) — authentication flows and token cache
