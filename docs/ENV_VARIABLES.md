# Environment Variables

Every variable the portal reads. The **Setup Wizard** at `http://<host>:1344` writes the required ones to `.env` automatically; everything else is opt-in.

---

## Required (Aruba Central API)

| Variable              | Description                                  | Example                                             |
|-----------------------|----------------------------------------------|-----------------------------------------------------|
| `ARUBA_BASE_URL`      | Regional Aruba Central API endpoint          | `https://apigw-prod2.central.arubanetworks.com`     |
| `ARUBA_CLIENT_ID`     | OAuth2 client ID                             | `abc123...`                                         |
| `ARUBA_CLIENT_SECRET` | OAuth2 client secret                         | `xyz789...`                                         |
| `ARUBA_CUSTOMER_ID`   | Customer / tenant ID                         | `cust_abc123...`                                    |

### Regional Base URLs

| Region  | URL                                                   |
|---------|-------------------------------------------------------|
| US East | `https://apigw-prod2.central.arubanetworks.com`       |
| US West | `https://apigw-uswest4.central.arubanetworks.com`     |
| EU      | `https://apigw-eucentral3.central.arubanetworks.com`  |
| APAC    | `https://apigw-apeast1.central.arubanetworks.com`     |

Using the wrong region returns `401 Unauthorized` on every request.

---

## Optional — Auth Alternatives

| Variable              | Purpose                                                    | Default |
|-----------------------|------------------------------------------------------------|---------|
| `ARUBA_USERNAME`      | Enables OAuth2 password grant flow                         | unset   |
| `ARUBA_PASSWORD`      | Paired with `ARUBA_USERNAME`                               | unset   |
| `ARUBA_ACCESS_TOKEN`  | Skip OAuth, use this bearer token verbatim                 | unset   |
| `TOKEN_CACHE_DIR`     | Where to persist `.token_cache_central.json` (Docker sets `/app/data`) | project root |

`TokenManager` picks the flow based on which variables are set.

---

## Optional — HPE GreenLake RBAC

Required for the `/gl/*` pages (Devices, Users, Locations, Tags, Subscriptions, Roles, Workspaces, Permissions). Without them the pages show a banner instead of erroring.

| Variable                | Purpose                                |
|-------------------------|----------------------------------------|
| `GL_RBAC_CLIENT_ID`     | GreenLake RBAC OAuth2 client ID        |
| `GL_RBAC_CLIENT_SECRET` | GreenLake RBAC OAuth2 client secret    |

Obtain them at [HPE GreenLake](https://client.greenlake.hpe.com) → **Manage → API clients**, assigning at least `Workspace Owner` or `Administrator`.

---

## Optional — Integrations

| Variable          | Purpose                                                   | Default                 |
|-------------------|-----------------------------------------------------------|-------------------------|
| `GRAFANA_API_KEY` | Lets `/api/grafana/kpis` authenticate Grafana via header  | unset                   |
| `OLLAMA_URL`     | Ollama base URL for the built-in chat assistant           | `http://localhost:11434`|
| `OLLAMA_MODEL`    | Default Ollama model                                      | `qwen3.5:cloud`           |

---

## Optional — Runtime

| Variable      | Purpose                                              | Default     |
|---------------|------------------------------------------------------|-------------|
| `FLASK_ENV`   | `production` or `development`                        | `production`|
| `LOG_LEVEL`   | `DEBUG` / `INFO` / `WARNING` / `ERROR`               | `INFO`      |
| `PUID`        | Container user UID (Docker only)                     | `1000`      |
| `PGID`        | Container user GID (Docker only)                     | `1000`      |
| `CONFIG_PATH` | Non-default path to `config.yaml`                    | repo root   |

---

## Example `.env`

```env
# Required
ARUBA_BASE_URL=https://apigw-prod2.central.arubanetworks.com
ARUBA_CLIENT_ID=your_client_id
ARUBA_CLIENT_SECRET=your_client_secret
ARUBA_CUSTOMER_ID=your_customer_id

# Optional — GreenLake RBAC pages
GL_RBAC_CLIENT_ID=your_gl_client_id
GL_RBAC_CLIENT_SECRET=your_gl_client_secret

# Optional — runtime
LOG_LEVEL=INFO
```

---

## Setting Variables

### `.env` file (recommended)

```bash
cp env.template .env
$EDITOR .env
```

Both the CLI scripts and Docker Compose load `.env` from the repo root automatically.

### Shell

```bash
# Linux / macOS
export ARUBA_CLIENT_ID=...

# Windows PowerShell
$env:ARUBA_CLIENT_ID = '...'
```

### Docker Compose

Variables in `.env` flow into the container via `env_file: .env` in `docker-compose.yml`. Override at run time:

```bash
ARUBA_BASE_URL=https://apigw-eucentral3.central.arubanetworks.com docker compose up -d
```

### CI/CD

Use the secret store for your platform:

- GitHub Actions — repository **Secrets**
- GitLab CI — **CI/CD Variables**
- Jenkins — **Credentials**
- AWS — **Parameter Store** or **Secrets Manager**

---

## Security Rules

- `.env` is git-ignored — keep it that way.
- Never paste real credentials into issues, screenshots, or logs.
- Rotate client secrets at least every 90 days.
- Use read-only scopes whenever write access isn't needed.
- `chmod 600 .env .token_cache_central.json` on shared hosts.

---

## Troubleshooting

| Symptom                         | Check                                                     |
|---------------------------------|-----------------------------------------------------------|
| `401 Unauthorized`              | Base URL matches region, credentials correct, delete `.token_cache_central.json` |
| `429 Too Many Requests`         | Aruba caps new tokens at 1 per 30 min; confirm caching works |
| `Token refresh failed 400`      | Pre-Setup-Wizard state — finish setup at `http://<host>:1344` |
| Variables not picked up         | Running from repo root? `python-dotenv` installed?        |
| GreenLake pages show a banner   | `GL_RBAC_CLIENT_ID` / `GL_RBAC_CLIENT_SECRET` not set     |
