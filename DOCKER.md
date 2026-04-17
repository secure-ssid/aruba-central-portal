# Docker Guide

Run the Aruba Central Portal in Docker on any platform (Docker Desktop on Windows/macOS/Linux, Ugreen NAS, Synology, or a plain Docker host).

The container exposes the web UI + API on port **1344**. Credentials are configured through the **Setup Wizard** in the browser — do not hand-edit `.env`.

---

## Prerequisites

- Docker Engine 20.10+ or Docker Desktop
- Docker Compose v2 (`docker compose`) or legacy `docker-compose`
- Aruba Central API credentials (see [Getting API Credentials](#getting-api-credentials))

**System:** 2 CPU / 1 GB RAM / 1 GB disk minimum; 2 GB RAM recommended.

---

## Quick Start

```bash
git clone https://github.com/secure-ssid/aruba-central-portal.git
cd aruba-central-portal
docker compose up -d
```

Open `http://localhost:1344` and complete the Setup Wizard. Credentials are saved to `.env` automatically.

### Verify

```bash
docker compose ps
docker compose logs -f aruba-central-portal
curl http://localhost:1344/api/health
```

---

## Getting API Credentials

1. Sign in to [Aruba Central](https://central.arubanetworks.com).
2. Go to **Account Home → API Gateway → System Apps & Tokens**.
3. Click **Add Apps & Tokens → System App**.
4. Select the permissions you need (at minimum: Monitoring read; add Configuration read/write for the WLAN wizard).
5. Copy the **Client ID**, **Client Secret**, and **Customer ID**.

Pick your region's base URL:

| Region  | Base URL                                                |
|---------|---------------------------------------------------------|
| US East | `https://apigw-prod2.central.arubanetworks.com`         |
| US West | `https://apigw-uswest4.central.arubanetworks.com`       |
| EU     | `https://apigw-eucentral3.central.arubanetworks.com`    |
| APAC   | `https://apigw-apeast1.central.arubanetworks.com`       |

Paste all four values into the Setup Wizard.

---

## Environment Variables

The Setup Wizard writes these to `.env`. You normally don't need to set them by hand; this table is a reference.

| Variable                | Required | Purpose                                              |
|-------------------------|----------|------------------------------------------------------|
| `ARUBA_BASE_URL`        | yes      | Regional API endpoint                                |
| `ARUBA_CLIENT_ID`       | yes      | OAuth2 client ID                                     |
| `ARUBA_CLIENT_SECRET`   | yes      | OAuth2 client secret                                 |
| `ARUBA_CUSTOMER_ID`     | yes      | Customer/tenant ID                                   |
| `GL_RBAC_CLIENT_ID`     | optional | HPE GreenLake RBAC client ID (enables `/gl/*` pages) |
| `GL_RBAC_CLIENT_SECRET` | optional | HPE GreenLake RBAC client secret                     |
| `PUID` / `PGID`         | optional | Container UID/GID (default `1000:1000`)              |
| `LOG_LEVEL`             | optional | `DEBUG` / `INFO` / `WARNING` / `ERROR` (default `INFO`) |

Full reference: [docs/ENV_VARIABLES.md](docs/ENV_VARIABLES.md).

---

## Day-to-Day Operations

```bash
docker compose logs -f                 # Live logs
docker compose restart                 # Restart container
docker compose down                    # Stop
docker compose ps                      # Status
docker compose exec aruba-central-portal /bin/bash   # Shell in container
```

### Change the Exposed Port

Edit `docker-compose.yml`:

```yaml
ports:
  - "8080:1344"    # Browser on 8080, internal still 1344
```

---

## Updating the Container

```bash
git pull
docker compose down
docker compose up -d --build
docker compose logs -f
```

If you keep local edits, stash them first: `git stash && git pull && git stash pop`.

For hosts with persistent deployment directories, operational scripts are in `scripts/ops/` (e.g. `scripts/ops/update-portal.sh`).

---

## Troubleshooting

### Port 1344 already in use

```bash
# Linux/macOS
lsof -ti:1344 | xargs kill -9

# Windows (PowerShell)
netstat -ano | findstr :1344
taskkill /PID <PID> /F
```

Or change the host port in `docker-compose.yml`.

### "Token refresh failed 400"

Normal until the Setup Wizard has run. Open `http://<host>:1344` and enter credentials.

### 401 Unauthorized after setup

- Verify the base URL matches your Aruba Central region.
- Re-check the credentials in Aruba Central (System Apps & Tokens).
- Wait ≥30 minutes if you recently regenerated a client secret — Aruba Central limits new access tokens to one per 30 minutes.

### Container keeps restarting

```bash
docker compose logs aruba-central-portal
docker compose config            # Validate compose file
```

### Clear the token cache

```bash
docker compose down
docker volume rm aruba-central-portal_token-cache
docker compose up -d
```

---

## Development Profile

`docker-compose.yml` ships an optional `aruba-dev` service for running scripts inside a container without rebuilding:

```bash
docker compose --profile dev run --rm aruba-dev
# Shell opens inside /app with the repo bind-mounted
```

---

## HTTPS in Production

Terminate TLS at a reverse proxy (nginx, Traefik, Caddy). Example nginx snippet:

```nginx
server {
    listen 443 ssl http2;
    server_name aruba.example.com;

    ssl_certificate     /etc/letsencrypt/live/aruba.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aruba.example.com/privkey.pem;

    location / {
        proxy_pass         http://127.0.0.1:1344;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

---

## Uninstall

```bash
docker compose down           # Stop container (keeps token cache volume)
docker compose down -v        # Stop and remove the token cache too
docker rmi aruba-central-portal:latest
```

---

## Related Docs

- [docs/SETUP.md](docs/SETUP.md) — non-Docker developer setup
- [docs/ENV_VARIABLES.md](docs/ENV_VARIABLES.md) — full variable reference
- [docs/HOW_IT_WORKS.md](docs/HOW_IT_WORKS.md) — architecture and request flow
- [docs/GREENLAKE_ROLES.md](docs/GREENLAKE_ROLES.md) — RBAC model for `/gl/*` pages
