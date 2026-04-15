# Setup Guide

Two setup paths: **Development** (Python + Node, live reload) and **Docker** (production / self-hosted).

---

## Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ (https://nodejs.org/)

### Install

**Linux/macOS:**
```bash
git clone https://github.com/secure-ssid/aruba-central-portal.git
cd aruba-central-portal

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend (new terminal)
cd dashboard/frontend
npm install
npm run dev
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/secure-ssid/aruba-central-portal.git
cd aruba-central-portal

python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Frontend (new terminal)
cd dashboard\frontend
npm install
npm run dev
```

### Start Both Services

**Linux/macOS:**
```bash
# Terminal 1 - Backend
source venv/bin/activate
cd dashboard/backend
python app.py

# Terminal 2 - Frontend
cd dashboard/frontend
npm run dev
```

**Windows:** use `scripts/ops/windows/start-dev.ps1`

### Access
- **Frontend (main):** http://localhost:1344
- **Backend API:** http://localhost:5000

### Configure Credentials
Open http://localhost:1344 and use the Setup Wizard to enter your Aruba Central API credentials. The `.env` file is updated automatically.

### Run Tests
```bash
pytest                                          # Unit tests
pytest --cov=utils --cov-report=term-missing    # With coverage
make all                                        # Format + lint + type-check + test
```

---

## Docker Setup

```bash
git clone https://github.com/secure-ssid/aruba-central-portal.git
cd aruba-central-portal
cp .env.example .env
nano .env   # Add credentials
docker-compose up -d
```

Open `http://localhost:1344` — use the Setup Wizard to verify credentials.

### Credentials
Edit `.env`:
```env
ARUBA_BASE_URL=https://apigw-prod2.central.arubanetworks.com
ARUBA_CLIENT_ID=your_client_id
ARUBA_CLIENT_SECRET=your_client_secret
ARUBA_CUSTOMER_ID=your_customer_id
```

**Region URLs:**
| Region  | URL |
|---------|-----|
| US East | `https://apigw-prod2.central.arubanetworks.com` |
| US West | `https://apigw-uswest4.central.arubanetworks.com` |
| EU      | `https://apigw-eucentral3.central.arubanetworks.com` |
| APAC    | `https://apigw-apeast1.central.arubanetworks.com` |

**Getting credentials from Aruba Central:**
1. Log in to https://central.arubanetworks.com
2. Go to **Account Home → API Gateway → System Apps & Tokens**
3. Click **Generate App Credentials**
4. Copy Client ID, Client Secret, and Customer ID

### Docker Commands
```bash
docker-compose logs -f         # View logs
docker-compose down            # Stop
docker-compose restart         # Restart
docker-compose up -d --build   # Rebuild and restart
docker-compose ps              # Status
```

See [DOCKER_DEPLOYMENT.md](../DOCKER_DEPLOYMENT.md) for full production Docker guide.

---

## Troubleshooting

See [troubleshooting/](troubleshooting/) for issue-specific fixes:
- [FIX_NODEJS_PATH.md](troubleshooting/FIX_NODEJS_PATH.md) — Node.js not found on Windows PATH
- [FIX_PORT_1344.md](troubleshooting/FIX_PORT_1344.md) — Port 1344 already in use

**Port 1344 in use:**
```bash
# Linux/macOS
lsof -i :1344 && kill -9 <PID>

# Windows PowerShell
netstat -ano | findstr :1344
taskkill /PID <PID> /F
```

**Module not found:**
```bash
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

**npm install fails:**
```bash
cd dashboard/frontend
npm cache clean --force
npm install
```

---

## More Information

- [DOCKER_DEPLOYMENT.md](../DOCKER_DEPLOYMENT.md) — Full production Docker guide
- [DEV_SETUP.md](DEV_SETUP.md) — Detailed Windows/PowerShell dev setup
- [ENV_VARIABLES.md](ENV_VARIABLES.md) — All environment variables explained
- [HOW_IT_WORKS.md](HOW_IT_WORKS.md) — Architecture overview
