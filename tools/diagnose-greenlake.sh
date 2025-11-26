#!/bin/bash
# GreenLake Configuration Diagnostic Script

echo "================================="
echo "GreenLake Configuration Diagnostic"
echo "================================="
echo

# Check backend directory
BACKEND_DIR="/home/choate/aruba-central-portal-v2/aruba-central-portal/dashboard/backend"
cd "$BACKEND_DIR" || { echo "ERROR: Backend directory not found!"; exit 1; }

echo "1. Checking .env file..."
if [ -f ".env" ]; then
    echo "   ✅ .env file exists"
    echo "   Location: $BACKEND_DIR/.env"
    echo

    echo "2. Checking Aruba Central credentials..."
    if grep -q "ARUBA_CLIENT_ID" .env && grep -q "ARUBA_CLIENT_SECRET" .env; then
        echo "   ✅ Aruba Central credentials found"
        grep "^ARUBA_CLIENT_ID" .env | head -1
        echo "   ARUBA_CLIENT_SECRET=***HIDDEN***"
        grep "^ARUBA_CUSTOMER_ID" .env | head -1
    else
        echo "   ❌ Aruba Central credentials MISSING"
    fi
    echo

    echo "3. Checking GreenLake RBAC credentials..."
    if grep -q "GL_RBAC_CLIENT_ID" .env && grep -q "GL_RBAC_CLIENT_SECRET" .env; then
        echo "   ✅ GreenLake credentials found"
        grep "^GL_RBAC_CLIENT_ID" .env | head -1
        echo "   GL_RBAC_CLIENT_SECRET=***HIDDEN***"
    else
        echo "   ❌ GreenLake credentials MISSING <-- THIS IS THE PROBLEM!"
        echo
        echo "   SOLUTION: Add these lines to .env:"
        echo "   GL_RBAC_CLIENT_ID=your_client_id"
        echo "   GL_RBAC_CLIENT_SECRET=your_client_secret"
        echo "   GL_API_BASE=https://global.api.greenlake.hpe.com"
    fi
else
    echo "   ❌ .env file NOT FOUND"
    echo "   Expected location: $BACKEND_DIR/.env"
    echo
    echo "   SOLUTION: Create .env file with:"
    echo "   ARUBA_CLIENT_ID=your_aruba_client_id"
    echo "   ARUBA_CLIENT_SECRET=your_aruba_client_secret"
    echo "   ARUBA_CUSTOMER_ID=your_customer_id"
    echo "   GL_RBAC_CLIENT_ID=your_gl_client_id"
    echo "   GL_RBAC_CLIENT_SECRET=your_gl_client_secret"
fi
echo

echo "4. Checking if backend is running..."
if pgrep -f "python.*app.py" > /dev/null; then
    echo "   ✅ Backend is running"
    echo "   PID: $(pgrep -f 'python.*app.py')"
else
    echo "   ❌ Backend is NOT running"
    echo "   Start with: python app.py"
fi
echo

echo "5. Testing backend connectivity..."
if curl -s http://localhost:5000/api/setup/check > /dev/null 2>&1; then
    echo "   ✅ Backend responding on port 5000"
    RESPONSE=$(curl -s http://localhost:5000/api/setup/check)
    echo "   Response: $RESPONSE"
else
    echo "   ❌ Backend NOT responding on port 5000"
fi
echo

echo "6. Testing GreenLake endpoint (requires login)..."
# Try to login first
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' 2>/dev/null)

if echo "$LOGIN_RESPONSE" | grep -q "session_id"; then
    echo "   ✅ Login successful"
    SESSION_ID=$(echo "$LOGIN_RESPONSE" | sed -n 's/.*"session_id":"\([^"]*\)".*/\1/p')

    # Test GreenLake users endpoint
    GL_RESPONSE=$(curl -s http://localhost:5000/api/greenlake/users \
      -H "X-Session-ID: $SESSION_ID" 2>/dev/null)

    if echo "$GL_RESPONSE" | grep -q "GreenLake RBAC not configured"; then
        echo "   ❌ GreenLake endpoints returning error:"
        echo "   $GL_RESPONSE"
        echo
        echo "   ⚠️  ROOT CAUSE: GL_RBAC credentials not configured!"
    elif echo "$GL_RESPONSE" | grep -q "error"; then
        echo "   ❌ GreenLake API error:"
        echo "   $GL_RESPONSE"
    else
        echo "   ✅ GreenLake endpoint responding!"
        echo "   Response preview: $(echo "$GL_RESPONSE" | head -c 200)..."
    fi
else
    echo "   ❌ Login failed"
    echo "   Response: $LOGIN_RESPONSE"
fi
echo

echo "================================="
echo "DIAGNOSIS COMPLETE"
echo "================================="
echo

# Summary
if [ -f ".env" ]; then
    if grep -q "GL_RBAC_CLIENT_ID" .env && grep -q "GL_RBAC_CLIENT_SECRET" .env; then
        echo "STATUS: ✅ Configuration looks good!"
        echo "If endpoints still failing, check credential validity in HPE GreenLake portal"
    else
        echo "STATUS: ❌ MISSING GREENLAKE CREDENTIALS"
        echo
        echo "ACTION REQUIRED:"
        echo "1. Obtain GreenLake API credentials from https://common.cloud.hpe.com/"
        echo "2. Add to .env file:"
        echo "   GL_RBAC_CLIENT_ID=your_client_id"
        echo "   GL_RBAC_CLIENT_SECRET=your_client_secret"
        echo "3. Restart backend: pkill -f 'python app.py' && python app.py"
        echo
        echo "See GREENLAKE_SETUP.md for detailed instructions"
    fi
else
    echo "STATUS: ❌ NO .ENV FILE FOUND"
    echo
    echo "ACTION REQUIRED: Create .env file with all credentials"
    echo "See GREENLAKE_SETUP.md for instructions"
fi
echo
