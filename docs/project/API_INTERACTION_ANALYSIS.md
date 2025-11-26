# API Interaction Analysis - Scope Maps and WLAN Deployment

## Overview
This document details the expected API interactions for successful WLAN deployment, comparing current implementation against requirements.

---

## Current API Flow Issues

### Issue 1: Query Parameter Naming Convention Mismatch

**What Should Happen (Aruba API Standard):**
```
POST /network-config/v1alpha1/scope-maps/{scope-id}/{persona}/{resource}
?object-type=LOCAL
&scope-id=123
&persona=CAMPUS_AP
```

**What's Currently Being Sent:**
```
POST /api/config/scope-maps/123/CAMPUS_AP/wlan-ssids~2FTest-WLAN
?object_type=LOCAL          ← WRONG: underscore instead of hyphen
&scope_id=123               ← WRONG: underscore instead of hyphen
&persona=CAMPUS_AP          ← CORRECT
```

**Root Cause:**
- Frontend constructs query params with underscores (JavaScript naming convention)
- Aruba Central API expects hyphens (REST API standard)
- Backend passes params through without transformation

**Code Path:**
```
ReviewDeployPage.jsx (Lines 334-346)
  ↓ Creates queryParams with underscores
  ↓ Calls configAPI.scopeMaps.createScopeMap(...)
  ↓ api.js converts to URLSearchParams (preserves names as-is)
  ↓ Sends to /api/config/scope-maps/{path}
  ↓ app.py receives and forwards directly to Aruba API
  ↓ Aruba API rejects with "Invalid parameter object_type"
```

**Expected HTTP Request:**
```http
POST /network-config/v1alpha1/scope-maps/123/CAMPUS_AP/wlan-ssids~2FTest-WLAN?object-type=LOCAL&scope-id=123&persona=CAMPUS_AP HTTP/1.1
Host: internal.api.central.arubanetworks.com
Authorization: Bearer {token}
Content-Type: application/json

{
  "scope-name": "123",
  "scope-id": 123,
  "persona": "CAMPUS_AP",
  "resource": "wlan-ssids/Test-WLAN"
}
```

---

### Issue 2: Scope Identifier Type Confusion

**Problem Location:** ReviewDeployPage.jsx Lines 315-316

```javascript
const scopeIdentifier = data.scopeType === 'global' ? 'Global' : String(data.scopeId);
//                                                     ↑ String literal
//                                                                  ↑ Convert number to string
const scopeIdNum = data.scopeType === 'global' ? 0 : parseInt(data.scopeId, 10);
//                                                                           ↑ Convert string to number (but never used!)
```

**What Happens:**
1. For global scope: Uses string "Global"
2. For local scope: Converts numeric scopeId to string "123"
3. Numeric version created but NEVER used for API call
4. Result: All scope identifiers are strings in URL path

**Result in URL:**
```
// Global scope - CORRECT
GET /network-config/v1alpha1/scope-maps/Global/CAMPUS_AP/wlan-ssids~2FTest

// Local scope - WRONG (numeric ID sent as string in a string variable)
GET /network-config/v1alpha1/scope-maps/123/CAMPUS_AP/wlan-ssids~2FTest
//                            ↑
//                     This LOOKS correct but it's a STRING not INTEGER
```

**Why It Matters:**
- Aruba API validates path parameters as specific types
- scope-id MUST be numeric in the URL path
- Sending it as a string (even if it looks like a number) fails validation
- Error will be 400 Bad Request with unclear error message

---

### Issue 3: Redundant Data in Multiple Request Parts

**Current Implementation (Lines 326-346):**
```javascript
const scopeMapData = {
  'scope-name': scopeIdentifier,   // ← Duplicated in body and URL
  'scope-id': scopeIdNum,           // ← Duplicated in body and URL path
  'persona': devicePersona,         // ← Duplicated in body and URL path
  'resource': wlanResource,         // ← Duplicated in body and URL path
};

const queryParams = {
  object_type: 'LOCAL',            // ← Duplicated in query params
  scope_id: scopeIdentifier,       // ← Conflicts with body (different types)
  persona: devicePersona,          // ← Duplicated in query params and URL
};

// All three locations contain same information:
// 1. URL path: /scope-maps/{scope-id}/{persona}/{resource}
// 2. Query string: ?object-type=LOCAL&scope-id=123&persona=CAMPUS_AP
// 3. Request body: {scope-name, scope-id, persona, resource}
```

**Best Practice (What Aruba Expects):**
- URL path should define resource: `/scope-maps/{scope-id}/{persona}/{resource}`
- Query parameters should define operation: `?object-type=LOCAL`
- Request body should provide assignment details (minimal)

**Current Problem:**
```
POST /api/config/scope-maps/123/CAMPUS_AP/wlan-ssids~2FTest?object_type=LOCAL&scope_id=123&persona=CAMPUS_AP
{
  "scope-name": "123",
  "scope-id": 123,
  "persona": "CAMPUS_AP",
  "resource": "wlan-ssids/Test-WLAN"
}
```

Aruba API sees same data 3 times and may:
- Reject as redundant
- Get confused about which takes precedence
- Fail validation if any conflict exists

---

## Expected API Interactions for Success

### Scenario 1: Create Role

**Frontend Code:**
```javascript
await configAPI.rolesPolicies.createRole(roleName, roleData, {});
```

**Expected HTTP Request:**
```http
POST /api/config/roles/{roleName} HTTP/1.1
Content-Type: application/json

{
  "name": "{roleName}",
  "description": "Default role for {wlanName}",
  "vlan-parameters": {
    "access-vlan": 100
  },
  "qos-parameters": {
    "cos": 0
  }
}
```

**Backend Processing:**
```python
# app.py receives the request
@app.route('/api/config/roles/<role_name>', methods=['POST'])
def create_role(role_name):
    role_data = request.get_json()
    params = request.args.to_dict()  # Empty dict
    # Forward to Aruba API
    response = aruba_client.post(f'/network-config/v1alpha1/roles/{role_name}', data=role_data, params=params)
    return jsonify(response)
```

**Aruba API Response:**
```json
{
  "name": "{roleName}",
  "description": "Default role for {wlanName}",
  "vlan-parameters": {
    "access-vlan": 100
  },
  "qos-parameters": {
    "cos": 0
  }
}
```

---

### Scenario 2: Create WLAN

**Frontend Code:**
```javascript
await configAPI.wireless.createWLAN(data.wlanName, wlanData, {});
```

**Expected HTTP Request:**
```http
POST /api/config/wlan/{wlanName} HTTP/1.1
Content-Type: application/json

{
  "ssid": "{wlanName}",
  "opmode": "WPA2_PERSONAL",
  "enable": true,
  "forward-mode": "FORWARD_MODE_BRIDGE",
  "essid": {
    "name": "{ssidBroadcastName}"
  },
  "vlan-selector": "VLAN_RANGES",
  "vlan-id-range": ["100"],
  "default-role": "{roleName}-default",
  "personal-security": {
    "passphrase-format": "STRING",
    "wpa-passphrase": "{passphrase}"
  },
  "dot11k": true,
  "dot11r": true,
  "dot11v": true,
  "high-efficiency": {
    "enable": true
  },
  "max-clients-threshold": 64,
  "inactivity-timeout": 1000
}
```

---

### Scenario 3: Create Scope Map (CORRECT Implementation)

**Frontend Code - FIXED:**
```javascript
const scopeIdentifier = data.scopeType === 'global' ? 'Global' : String(parseInt(data.scopeId, 10));

// Minimal data in body
const scopeMapData = {
  'resource': wlanResource  // Only the resource assignment
};

// Correct query parameter format
const queryParams = data.scopeType === 'global' ? {} : {
  'object-type': 'LOCAL',      // ← HYPHEN (fixed)
  'scope-id': scopeIdentifier, // ← HYPHEN (fixed)
  'persona': devicePersona,
};

await configAPI.scopeMaps.createScopeMap(
  scopeIdentifier,
  devicePersona,
  wlanResource,
  scopeMapData,
  queryParams
);
```

**Expected HTTP Request:**
```http
POST /api/config/scope-maps/123/CAMPUS_AP/wlan-ssids~2FTest?object-type=LOCAL&scope-id=123&persona=CAMPUS_AP HTTP/1.1
Content-Type: application/json
Authorization: Bearer {token}

{
  "resource": "wlan-ssids/Test-WLAN"
}
```

**URL Breakdown:**
```
/api/config/scope-maps/{scope-id}/{persona}/{resource}
                       ^^^^^^^^^   ^^^^^^^   ^^^^^^^^^
                       Path params - identify what to configure

                       ?object-type=LOCAL&scope-id=123&persona=CAMPUS_AP
                        ^^^^^^^^^^^^^^      ^^^^^^^^   ^^^^^^^^
                        Query params - operation mode
```

**Backend Processing:**
```python
@app.route('/api/config/scope-maps/<path:scope_resource>', methods=['POST'])
def create_scope_map(scope_resource):
    # scope_resource = "123/CAMPUS_AP/wlan-ssids~2FTest"
    assignment_data = request.get_json()  # {resource: "wlan-ssids/Test-WLAN"}
    params = request.args.to_dict()       # {object-type: LOCAL, scope-id: 123, persona: CAMPUS_AP}

    # Forward to Aruba - backend PRESERVES hyphen formatting
    response = aruba_client.post(
        f'/network-config/v1alpha1/scope-maps/{scope_resource}',
        data=assignment_data,
        params=params  # These go directly as query string
    )
    return jsonify(response)
```

**Aruba API Success Response:**
```json
{
  "scope-id": 123,
  "persona": "CAMPUS_AP",
  "resource": "wlan-ssids/Test-WLAN",
  "status": "assigned"
}
```

---

## Debug Checklist: What to Log

When deployment fails, check these in the backend logs:

### 1. Check Query Parameter Names
```python
# In app.py create_scope_map()
logger.info(f"Scope resource path: {scope_resource}")
logger.info(f"Query parameters: {params}")
logger.info(f"Request body: {assignment_data}")

# CORRECT output:
# Scope resource path: 123/CAMPUS_AP/wlan-ssids~2FTest
# Query parameters: {'object-type': 'LOCAL', 'scope-id': '123', 'persona': 'CAMPUS_AP'}
# Request body: {'resource': 'wlan-ssids/Test-WLAN'}

# WRONG output:
# Query parameters: {'object_type': 'LOCAL', 'scope_id': '123', ...}  ← Underscores!
```

### 2. Check Constructed URL
```python
# In central_api_client.py post()
logger.info(f"POST {url}")
logger.debug(f"Query params being sent: {params}")

# CORRECT:
# POST https://internal.api.central.arubanetworks.com/network-config/v1alpha1/scope-maps/123/CAMPUS_AP/wlan-ssids~2FTest
# Query params being sent: {'object-type': 'LOCAL', 'scope-id': '123', 'persona': 'CAMPUS_AP'}

# Which constructs URL:
# https://...scope-maps/123/CAMPUS_AP/wlan-ssids~2FTest?object-type=LOCAL&scope-id=123&persona=CAMPUS_AP
```

### 3. Check Aruba API Response
```python
# In central_api_client.py post() error handler
if response.status_code >= 400:
    logger.error(f"API Error {response.status_code}: {response.text}")

# WRONG response (if query params use underscores):
# API Error 400: {"error": "Invalid parameter 'object_type'"}

# CORRECT response (if all names are hyphens):
# API Success 200: {"scope-id": 123, "persona": "CAMPUS_AP", ...}
```

---

## Testing curl Commands

### Test 1: Create Role (Minimal)
```bash
curl -X POST \
  'http://localhost:5000/api/config/roles/test-role' \
  -H 'X-Session-ID: {session_id}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "test-role",
    "description": "Test role",
    "vlan-parameters": {"access-vlan": 100},
    "qos-parameters": {"cos": 0}
  }'
```

### Test 2: Create WLAN (Minimal)
```bash
curl -X POST \
  'http://localhost:5000/api/config/wlan/test-wlan' \
  -H 'X-Session-ID: {session_id}' \
  -H 'Content-Type: application/json' \
  -d '{
    "ssid": "test-wlan",
    "opmode": "WPA2_PERSONAL",
    "enable": true,
    "forward-mode": "FORWARD_MODE_BRIDGE",
    "essid": {"name": "test-wlan"},
    "vlan-selector": "VLAN_RANGES",
    "vlan-id-range": ["100"],
    "default-role": "test-role",
    "personal-security": {
      "passphrase-format": "STRING",
      "wpa-passphrase": "TestPass123"
    },
    "dot11k": true,
    "dot11r": true,
    "dot11v": true,
    "high-efficiency": {"enable": true},
    "max-clients-threshold": 64,
    "inactivity-timeout": 1000
  }'
```

### Test 3: Create Scope Map (CRITICAL - shows hyphen vs underscore issue)
```bash
# WRONG - uses underscore (current implementation):
curl -X POST \
  'http://localhost:5000/api/config/scope-maps/Global/CAMPUS_AP/wlan-ssids~2Ftest-wlan?object_type=LOCAL&scope_id=Global&persona=CAMPUS_AP' \
  -H 'X-Session-ID: {session_id}' \
  -H 'Content-Type: application/json' \
  -d '{"resource": "wlan-ssids/test-wlan"}'

# CORRECT - uses hyphen (fixed implementation):
curl -X POST \
  'http://localhost:5000/api/config/scope-maps/Global/CAMPUS_AP/wlan-ssids~2Ftest-wlan?object-type=LOCAL&scope-id=Global&persona=CAMPUS_AP' \
  -H 'X-Session-ID: {session_id}' \
  -H 'Content-Type: application/json' \
  -d '{"resource": "wlan-ssids/test-wlan"}'
# Note: Only difference is object-type vs object_type and scope-id vs scope_id
```

---

## Data Flow Diagram

### Current (BROKEN) Flow:
```
ReviewDeployPage.jsx (wizardData)
  ↓
  queryParams: {object_type, scope_id}  ← WRONG
  ↓
configAPI.scopeMaps.createScopeMap()
  ↓
api.js
  ↓
  URLSearchParams(queryParams).toString()
  ↓
  "object_type=LOCAL&scope_id=123"  ← WRONG
  ↓
POST /api/config/scope-maps/123/CAMPUS_AP/...?object_type=LOCAL&scope_id=123
  ↓
app.py create_scope_map()
  ↓
  params = request.args.to_dict()  → {object_type, scope_id}
  ↓
  aruba_client.post(..., params=params)  → Sends as-is!
  ↓
  Aruba API
  ↓
  400 Bad Request: "Invalid parameter object_type"  ← ERROR!
```

### Fixed Flow:
```
ReviewDeployPage.jsx (wizardData)
  ↓
  queryParams: {'object-type', 'scope-id'}  ← CORRECT
  ↓
configAPI.scopeMaps.createScopeMap()
  ↓
api.js
  ↓
  URLSearchParams(queryParams).toString()
  ↓
  "object-type=LOCAL&scope-id=123"  ← CORRECT
  ↓
POST /api/config/scope-maps/123/CAMPUS_AP/...?object-type=LOCAL&scope-id=123
  ↓
app.py create_scope_map()
  ↓
  params = request.args.to_dict()  → {'object-type': 'LOCAL', 'scope-id': '123'}
  ↓
  aruba_client.post(..., params=params)  → Sends with correct names
  ↓
  Aruba API
  ↓
  200 OK: {scope-id: 123, persona: CAMPUS_AP, ...}  ← SUCCESS!
```

---

## Key Takeaways

1. **Query Parameter Naming:** REST APIs use hyphens (kebab-case) for multi-word parameters
   - WRONG: `object_type` (snake_case - Python convention)
   - CORRECT: `object-type` (kebab-case - REST convention)

2. **Type Consistency:** Scope IDs must be numeric in URL path
   - WRONG: String "123" in a string variable
   - CORRECT: Integer 123, converted to string only for URL encoding

3. **Minimal Data:** Don't duplicate information in multiple request parts
   - URL path defines WHAT to configure
   - Query parameters define HOW to configure it
   - Request body provides DETAILS only

4. **Backend Transparency:** Backend must preserve parameter names exactly
   - No transformation of query parameter names
   - No type conversion that removes information
   - Direct forwarding to Aruba API (except for authentication)

5. **Error Messages:** When Aruba API returns 400, check:
   - Query parameter names (hyphens vs underscores)
   - URL path components (numeric vs string types)
   - Redundant/conflicting data in request body

