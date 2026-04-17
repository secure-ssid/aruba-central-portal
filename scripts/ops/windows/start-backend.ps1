# PowerShell script to start the Flask backend server
# Run this in one terminal window

Write-Host "Starting Aruba Central Portal Backend..." -ForegroundColor Green
Write-Host ""

# Activate virtual environment
if (Test-Path "venv\Scripts\Activate.ps1") {
    & "venv\Scripts\Activate.ps1"
} else {
    Write-Host "Error: Virtual environment not found. Run: python -m venv venv" -ForegroundColor Red
    exit 1
}

# Set environment variables
$env:FLASK_ENV = "development"
$env:FLASK_APP = "dashboard\backend\app.py"
$env:PYTHONPATH = $PWD
$env:TOKEN_CACHE_DIR = "$PWD\data"

# Create data directory if it doesn't exist
if (-not (Test-Path "data")) {
    New-Item -ItemType Directory -Path "data" | Out-Null
}

# Change to backend directory and run Flask
Set-Location dashboard\backend
$env:PORT = if ($env:PORT) { $env:PORT } else { "5001" }
Write-Host "Backend API will be available at: http://localhost:$($env:PORT)" -ForegroundColor Cyan
Write-Host "Frontend (Vite on 1344) proxies /api to this port — see DASHBOARD_DEV_API_PROXY if you change PORT" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Match vite.config.js default proxy (5001 avoids macOS AirPlay on 5000)
python app.py

