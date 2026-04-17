#!/usr/bin/env bash
# Start Flask API for local dev (use with Vite on http://localhost:1344).
# Default PORT=5001 matches dashboard/frontend/vite.config.js proxy (avoids macOS AirPlay on 5000).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export PYTHONPATH="$ROOT${PYTHONPATH:+:$PYTHONPATH}"
if [[ -f "$ROOT/venv/bin/activate" ]]; then
  # shellcheck source=/dev/null
  source "$ROOT/venv/bin/activate"
fi
export PORT="${PORT:-5001}"
mkdir -p "${TOKEN_CACHE_DIR:-$ROOT/data}"
export TOKEN_CACHE_DIR="${TOKEN_CACHE_DIR:-$ROOT/data}"
cd "$ROOT/dashboard/backend"
echo "Flask API: http://127.0.0.1:${PORT}  (health: /api/health)"
echo "Vite on :1344 proxies /api here — keep this terminal open."
exec python app.py
