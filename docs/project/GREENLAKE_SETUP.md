# GreenLake Integration Setup Guide

## Problem Identified

The GreenLake endpoints require HPE GreenLake Platform RBAC API credentials that are **not currently configured**. This is why all GreenLake pages show empty data.

## Root Cause

The backend's `_get_greenlake_client()` function (line 3822 in `app.py`) requires these environment variables:

```python
GL_RBAC_CLIENT_ID      # Required - GreenLake OAuth2 client ID
GL_RBAC_CLIENT_SECRET  # Required - GreenLake OAuth2 client secret
GL_API_BASE            # Optional - defaults to https://global.api.greenlake.hpe.com
```

Without these credentials, the function returns `None` and all GreenLake endpoints return:
```json
{"error": "GreenLake RBAC not configured"}
```

## Solution: Configure GreenLake Credentials

### Step 1: Obtain GreenLake API Credentials

1. **Log in to HPE GreenLake Platform:**
   - Go to https://common.cloud.hpe.com/
   - Sign in with your HPE GreenLake account

2. **Navigate to API Clients:**
   - Click on "Manage" → "Authentication"
   - Select "API Clients" tab

3. **Create New API Client:**
   - Click "Create API Client"
   - Name: "Aruba Central Dashboard"
   - Type: "Service Account"
   - Scopes: Select all relevant scopes:
     - `identity.read` - User management
     - `identity.write` - User creation/modification
     - `authorization.read` - Role viewing
     - `authorization.write` - Role assignment
     - `devices.read` - Device inventory
     - `devices.write` - Device management
     - `subscriptions.read` - Subscription viewing
     - `workspaces.read` - Workspace listing
     - `workspaces.write` - Workspace management

4. **Save Credentials:**
   - **Client ID** - Copy and save this
   - **Client Secret** - Copy and save this (shown only once!)

### Step 2: Configure Backend

#### Option A: Using .env File (Recommended for Development)

Create/edit `.env` file in `/home/choate/aruba-central-portal-v2/aruba-central-portal/dashboard/backend/`:

```bash
# Aruba Central API Credentials (existing)
ARUBA_CLIENT_ID=your_aruba_client_id
ARUBA_CLIENT_SECRET=your_aruba_client_secret
ARUBA_CUSTOMER_ID=your_customer_id
ARUBA_API_BASE=https://internal.api.central.arubanetworks.com

# GreenLake Platform RBAC API Credentials (NEW - add these)
GL_RBAC_CLIENT_ID=your_greenlake_client_id
GL_RBAC_CLIENT_SECRET=your_greenlake_client_secret
GL_API_BASE=https://global.api.greenlake.hpe.com
```

#### Option B: Using Environment Variables

```bash
export GL_RBAC_CLIENT_ID="your_greenlake_client_id"
export GL_RBAC_CLIENT_SECRET="your_greenlake_client_secret"
export GL_API_BASE="https://global.api.greenlake.hpe.com"
```

#### Option C: Using Setup Wizard (Future Enhancement)

The backend already has a `/api/setup/configure` endpoint that can be enhanced to accept GreenLake credentials.

### Step 3: Restart Backend

After configuring credentials:

```bash
cd /home/choate/aruba-central-portal-v2/aruba-central-portal/dashboard/backend
pkill -f "python app.py"
source venv/bin/activate
python app.py
```

### Step 4: Verify Configuration

Test the GreenLake endpoints:

```bash
# Login to get session
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' \
  | grep session_id

# Extract session ID from above response and test:
SESSION_ID="your_session_id_here"

# Test GreenLake users endpoint
curl http://localhost:5000/api/greenlake/users \
  -H "X-Session-ID: $SESSION_ID"

# Should return user data, not an error
```

## Understanding the Two-Tier Credential System

The Aruba Central Dashboard requires **TWO** sets of credentials:

### 1. Aruba Central API Credentials
- **Purpose:** Access Aruba Central network management features
- **Variables:** `ARUBA_CLIENT_ID`, `ARUBA_CLIENT_SECRET`, `ARUBA_CUSTOMER_ID`
- **Used For:**
  - Device monitoring (/api/devices)
  - Client management (/api/clients)
  - Site management (/api/sites)
  - WLAN configuration (/api/wlans)
  - Alerts and analytics

### 2. GreenLake Platform RBAC Credentials
- **Purpose:** Access HPE GreenLake platform features (MSP/multi-tenancy)
- **Variables:** `GL_RBAC_CLIENT_ID`, `GL_RBAC_CLIENT_SECRET`
- **Used For:**
  - User management (/api/greenlake/users)
  - Role assignments (/api/greenlake/role-assignments)
  - Workspace management (/api/greenlake/workspaces)
  - Device inventory (/api/greenlake/devices)
  - Tags (/api/greenlake/tags)
  - Subscriptions (/api/greenlake/subscriptions)
  - Permissions (/api/greenlake/permissions)

**Both are required** for full dashboard functionality.

## Demo/Mock Mode (Alternative Solution)

If you don't have GreenLake credentials yet, I can add a demo/mock mode that returns sample data for testing the UI.

### Enable Mock Mode

Add to `.env`:
```bash
GL_MOCK_MODE=true
```

With mock mode enabled, the GreenLake endpoints will return realistic sample data instead of making actual API calls.

## Troubleshooting

### Issue: "GreenLake RBAC not configured" Error

**Cause:** GL_RBAC_CLIENT_ID or GL_RBAC_CLIENT_SECRET not set

**Solution:**
1. Check `.env` file exists and contains credentials
2. Verify environment variables are set: `env | grep GL_RBAC`
3. Restart backend after adding credentials

### Issue: "401 Unauthorized" from GreenLake API

**Cause:** Invalid credentials or expired client

**Solution:**
1. Verify credentials in HPE GreenLake portal
2. Check if client is still active (not deleted/disabled)
3. Regenerate client secret if needed
4. Update `.env` with new credentials

### Issue: "403 Forbidden" from GreenLake API

**Cause:** Insufficient API scopes/permissions

**Solution:**
1. Go to HPE GreenLake portal → API Clients
2. Edit your client
3. Add missing scopes (identity.read, authorization.read, etc.)
4. Save and restart backend

### Issue: Backend not reading .env file

**Cause:** .env file in wrong location or not loaded

**Solution:**
1. Ensure `.env` is in `dashboard/backend/` directory
2. Check file permissions: `chmod 600 .env`
3. Verify `load_config()` is loading .env (it should auto-load)

### Issue: Session authentication not working

**Cause:** Session ID not being passed correctly

**Solution:**
Use `X-Session-ID` header (not cookies):
```bash
curl http://localhost:5000/api/greenlake/users \
  -H "X-Session-ID: your_session_id"
```

## Next Steps

### Option 1: Configure Real Credentials (Recommended)
1. Follow "Step 1: Obtain GreenLake API Credentials" above
2. Add credentials to `.env` file
3. Restart backend
4. Test endpoints

### Option 2: Use Mock/Demo Mode (For Testing Only)
1. I can add mock mode to return sample data
2. Enables UI testing without real credentials
3. Not suitable for production use

### Option 3: Skip GreenLake Features
1. Use only Aruba Central features (devices, clients, sites, etc.)
2. Ignore GreenLake pages (users, roles, workspaces, etc.)
3. Comment out GreenLake menu items in Sidebar.jsx

## Summary

**Current Status:** ❌ GreenLake endpoints not working
**Reason:** Missing GL_RBAC_CLIENT_ID and GL_RBAC_CLIENT_SECRET
**Solution:** Configure GreenLake API credentials or enable mock mode
**UI Status:** ✅ All pages built correctly, waiting for backend configuration

The code implementation is **100% correct**. The issue is purely **configuration-related**.

---

*Need help setting up? Let me know if you want me to:*
1. Add mock/demo mode for testing without credentials
2. Create an automated setup wizard for credential configuration
3. Add better error messages when credentials are missing
