# HPE GreenLake API Authentication Guide

## Overview

HPE GreenLake APIs use OAuth 2.0 bearer tokens for authentication and authorization. All API requests require a valid access token passed in the Authorization header. The authentication model is based on the OAuth 2.0 Client Credentials flow, where users create API credentials and exchange them for short-lived access tokens.

**Documentation:** https://developer.greenlake.hpe.com/docs/greenlake/guides/public/authentication/authentication

---

## Authentication Architecture

### Key Components

1. **API Client Credentials**
   - Client ID: Unique identifier for the API client
   - Client Secret: Secure secret for authentication (keep confidential)
   - Associated with a user account
   - Single user can have multiple API clients

2. **OAuth 2.0 Token Endpoint**
   - URL: `https://sso.common.cloud.hpe.com/as/token.oauth2`
   - Accepts client credentials
   - Issues access tokens

3. **Access Token**
   - JWT (JSON Web Token) format
   - Bearer token for API requests
   - Contains user identity and permissions
   - Short-lived (15 minutes for GreenLake, 120 minutes for other HPE services)

4. **API Service Endpoint**
   - URL: `https://global.api.greenlake.hpe.com/`
   - Validates tokens
   - Processes authorized requests

### Authentication Flow Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. Create API Client Credentials                               │
│     (Client ID + Client Secret)                                 │
│                                                                 │
│  2. Exchange Credentials for Access Token                        │
│     POST https://sso.common.cloud.hpe.com/as/token.oauth2      │
│                                                                 │
│  3. Receive JWT Access Token (15 minute validity)               │
│                                                                 │
│  4. Use Access Token in API Requests                             │
│     Authorization: Bearer <ACCESS_TOKEN>                         │
│                                                                 │
│  5. API Service Validates Token & Processes Request              │
│                                                                 │
│  6. Token Expires → Repeat Steps 2-5                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## OAuth 2.0 Client Credentials Flow

### Step 1: Create API Client Credentials

#### In HPE GreenLake Portal
1. Navigate to Settings → API Clients
2. Click "Create New Client"
3. Enter client name and description
4. Select scopes (see Scopes section)
5. Click "Generate"
6. Save Client ID and Client Secret securely
7. Client Secret is only shown once - store it safely

#### API Client Properties
```
Client ID:     abc123def456
Client Secret: xyz789uvw012abc345def678ghi901jkl234mno567pqr890stu
Workspace ID:  workspace-001
Status:        Active
Created:       2024-01-15T10:00:00Z
Expires:       (Optional)
```

### Step 2: Exchange Credentials for Access Token

#### OAuth 2.0 Token Request
```bash
curl -X POST "https://sso.common.cloud.hpe.com/as/token.oauth2" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"
```

#### Token Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `grant_type` | Yes | Must be: `client_credentials` |
| `client_id` | Yes | Your API Client ID |
| `client_secret` | Yes | Your API Client Secret |
| `scope` | No | Space-separated list of scopes (optional) |

#### Token Response
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900,
  "scope": "ccs.device-management.view ccs.device-management.edit"
}
```

#### Token Response Fields

| Field | Description |
|-------|-------------|
| `access_token` | JWT access token for API requests |
| `token_type` | Always "Bearer" |
| `expires_in` | Token validity in seconds (900 = 15 minutes) |
| `scope` | Granted scopes (space-separated) |

### Step 3: Use Access Token in API Requests

#### Authorization Header Format
```bash
curl -X GET "https://global.api.greenlake.hpe.com/device-management/v1/devices" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

#### Token Structure
```
Bearer <JWT_TOKEN>

Where JWT contains:
- Header: Algorithm (RS256) and token type
- Payload: User identity, roles, permissions, expiration
- Signature: Cryptographically signed
```

---

## Token Validity & Refresh

### Token Lifetimes

#### HPE GreenLake Services
- **Token Validity:** 15 minutes
- **Refresh Requirement:** Get new token every 15 minutes
- **Clock Skew:** 1 minute tolerance

#### Other HPE Services (non-GreenLake)
- **Token Validity:** 120 minutes (2 hours)
- **Refresh Requirement:** Get new token every 2 hours

### Token Refresh Strategy

#### Option 1: Automatic Refresh (Recommended)
```javascript
class GreenLakeClient {
  async getValidToken() {
    const now = Date.now();

    // Refresh if token expires within 1 minute
    if (this.tokenExpiry - now < 60000) {
      await this.refreshToken();
    }

    return this.accessToken;
  }

  async refreshToken() {
    const response = await fetch('https://sso.common.cloud.hpe.com/as/token.oauth2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${this.clientId}&client_secret=${this.clientSecret}`
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000);
  }
}
```

#### Option 2: Per-Request Refresh
```bash
# Get token
TOKEN=$(curl -s -X POST "https://sso.common.cloud.hpe.com/as/token.oauth2" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET" \
  | jq -r '.access_token')

# Use token in request
curl -X GET "https://global.api.greenlake.hpe.com/device-management/v1/devices" \
  -H "Authorization: Bearer $TOKEN"
```

### Token Expiration Handling
```json
{
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "The access token has expired",
    "status": 401
  }
}
```

When you receive a 401 Unauthorized response:
1. Attempt to refresh the token
2. Retry the failed request with new token
3. Implement exponential backoff for retries

---

## Required Scopes & Permissions

### Understanding Scopes

Scopes define what API operations an API client can perform. Scopes are assigned when creating the API client credentials and inherited from the user's role assignments.

### Scope Format
```
<service>.<resource>.<action>
```

### Available Scopes

#### Device Management Scopes
- `ccs.device-management.view` - View devices
- `ccs.device-management.create` - Create/onboard devices
- `ccs.device-management.edit` - Modify device configuration
- `ccs.device-management.delete` - Delete devices

#### Subscription Management Scopes
- `ccs.subscription-management.view` - View subscriptions
- `ccs.subscription-management.edit` - Manage subscriptions
- `ccs.subscription-management.assign` - Assign subscriptions

#### Workspace Management Scopes
- `workspace.management.view` - View workspace information
- `workspace.management.edit` - Configure workspace
- `workspace.management.create` - Create workspaces
- `workspace.management.delete` - Delete workspaces

#### Identity Management Scopes
- `iam.users.view` - View users
- `iam.users.create` - Create users
- `iam.users.edit` - Edit users
- `iam.users.delete` - Delete users
- `iam.groups.view` - View groups
- `iam.groups.create` - Create groups
- `iam.groups.edit` - Edit groups
- `iam.groups.delete` - Delete groups

#### IAM/Roles Scopes
- `iam.roles.view` - View roles
- `iam.roles.assign` - Assign roles
- `iam.permissions.view` - View permissions

#### Service Catalog Scopes
- `service-catalog.offering.view` - View service offerings
- `service-catalog.offering.edit` - Manage offerings
- `service-catalog.provision.view` - View provisioning
- `service-catalog.provision.create` - Create service requests

### Scope Inheritance

Scopes are inherited from:
1. **User's Role Assignments** - Scopes based on roles in workspace
2. **API Client Configuration** - Scopes explicitly granted to API client
3. **Intersection** - Token has minimum of both (most restrictive)

#### Example Scope Inheritance
```
User Roles:          Administrator in workspace-001
Administrator Role:  All permissions
API Client Scopes:   ccs.device-management.view, ccs.device-management.edit

Resulting Token Scopes: ccs.device-management.view, ccs.device-management.edit
(Limited by API client scope restriction)
```

### Requesting Specific Scopes

When creating API credentials, you can request specific scopes:

```bash
curl -X POST "https://sso.common.cloud.hpe.com/as/token.oauth2" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&scope=ccs.device-management.view%20ccs.subscription-management.view"
```

---

## MSP Token Exchange

### OAuth 2.0 Token Exchange (RFC 8693)

For Managed Service Providers (MSPs), you can exchange an MSP workspace token for a tenant-scoped token using RFC 8693 Token Exchange:

#### Token Exchange Request
```bash
curl -X POST "https://sso.common.cloud.hpe.com/as/token.oauth2" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:token-exchange&subject_token=MSP_WORKSPACE_TOKEN&subject_token_type=urn:ietf:params:oauth:token-type:access_token&resource=https://global.api.greenlake.hpe.com/workspace-management/v1/msp-tenants/TENANT_ID&audience=https://global.api.greenlake.hpe.com"
```

#### Token Exchange Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `grant_type` | Yes | Must be: `urn:ietf:params:oauth:grant-type:token-exchange` |
| `subject_token` | Yes | The MSP workspace access token |
| `subject_token_type` | Yes | Must be: `urn:ietf:params:oauth:token-type:access_token` |
| `resource` | Yes | Target tenant workspace URI |
| `audience` | Yes | API service URL |

#### Token Exchange Response
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900,
  "resource": "https://global.api.greenlake.hpe.com/workspace-management/v1/msp-tenants/tenant-001"
}
```

#### Using Tenant-Scoped Token
```bash
curl -X GET "https://global.api.greenlake.hpe.com/device-management/v1/devices" \
  -H "Authorization: Bearer TENANT_SCOPED_TOKEN" \
  -H "X-Tenant-ID: tenant-001"
```

---

## API Authentication Examples

### Example 1: Python Authentication
```python
import requests
import json

class GreenLakeAuth:
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token = None
        self.token_expiry = 0
        self.token_endpoint = "https://sso.common.cloud.hpe.com/as/token.oauth2"
        self.api_base = "https://global.api.greenlake.hpe.com"

    def get_token(self):
        """Get a valid access token"""
        import time

        # Return existing token if still valid
        if self.token and time.time() < self.token_expiry - 60:
            return self.token

        # Request new token
        response = requests.post(
            self.token_endpoint,
            data={
                "grant_type": "client_credentials",
                "client_id": self.client_id,
                "client_secret": self.client_secret
            }
        )

        if response.status_code != 200:
            raise Exception(f"Token request failed: {response.text}")

        data = response.json()
        self.token = data["access_token"]
        self.token_expiry = time.time() + data["expires_in"]

        return self.token

    def get_devices(self, workspace_id):
        """Retrieve devices from workspace"""
        token = self.get_token()

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        response = requests.get(
            f"{self.api_base}/device-management/v1/devices",
            headers=headers,
            params={"workspace-id": workspace_id}
        )

        if response.status_code != 200:
            raise Exception(f"API request failed: {response.text}")

        return response.json()

# Usage
auth = GreenLakeAuth("your_client_id", "your_client_secret")
devices = auth.get_devices("workspace-001")
print(json.dumps(devices, indent=2))
```

### Example 2: Node.js Authentication
```javascript
const https = require('https');

class GreenLakeAuth {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.token = null;
    this.tokenExpiry = 0;
    this.tokenEndpoint = 'sso.common.cloud.hpe.com';
    this.apiBase = 'global.api.greenlake.hpe.com';
  }

  async getToken() {
    const now = Date.now();

    // Return existing token if valid
    if (this.token && now < this.tokenExpiry - 60000) {
      return this.token;
    }

    // Request new token
    const postData = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret
    }).toString();

    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.tokenEndpoint,
        path: '/as/token.oauth2',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const response = JSON.parse(data);
          this.token = response.access_token;
          this.tokenExpiry = now + (response.expires_in * 1000);
          resolve(this.token);
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  async getDevices(workspaceId) {
    const token = await this.getToken();
    const url = `/device-management/v1/devices?workspace-id=${workspaceId}`;

    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.apiBase,
        path: url,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`API request failed: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }
}

// Usage
const auth = new GreenLakeAuth('your_client_id', 'your_client_secret');
auth.getDevices('workspace-001')
  .then(devices => console.log(JSON.stringify(devices, null, 2)))
  .catch(error => console.error('Error:', error));
```

### Example 3: Bash/cURL Authentication
```bash
#!/bin/bash

# Configuration
CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"
WORKSPACE_ID="workspace-001"
TOKEN_FILE="/tmp/greenlake_token.cache"
TOKEN_EXPIRY_FILE="/tmp/greenlake_token_expiry.cache"
API_BASE="https://global.api.greenlake.hpe.com"

# Function to get valid token
get_token() {
    local now=$(date +%s)

    # Check if cached token is still valid
    if [ -f "$TOKEN_FILE" ] && [ -f "$TOKEN_EXPIRY_FILE" ]; then
        local expiry=$(cat "$TOKEN_EXPIRY_FILE")
        if [ $now -lt $((expiry - 60)) ]; then
            cat "$TOKEN_FILE"
            return
        fi
    fi

    # Request new token
    local response=$(curl -s -X POST "https://sso.common.cloud.hpe.com/as/token.oauth2" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET")

    local token=$(echo "$response" | jq -r '.access_token')
    local expires_in=$(echo "$response" | jq -r '.expires_in')
    local new_expiry=$((now + expires_in))

    echo "$token" > "$TOKEN_FILE"
    echo "$new_expiry" > "$TOKEN_EXPIRY_FILE"

    echo "$token"
}

# Function to call API
api_request() {
    local method=$1
    local endpoint=$2
    local token=$(get_token)

    curl -s -X $method \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        "${API_BASE}${endpoint}"
}

# Example: Get devices
api_request GET "/device-management/v1/devices?workspace-id=$WORKSPACE_ID" | jq .
```

---

## Security Best Practices

### Credential Management
1. **Secure Storage** - Store Client Secret securely (environment variables, secret managers)
2. **Rotation** - Rotate credentials every 90 days
3. **Least Privilege** - Grant only required scopes
4. **No Hardcoding** - Never hardcode credentials in code
5. **Audit Trails** - Monitor API client creation and token usage

### Token Handling
1. **Token Expiration** - Always check token validity before use
2. **Refresh Strategy** - Implement automatic token refresh
3. **Transport Security** - Always use HTTPS/TLS
4. **Token Storage** - Store tokens in secure memory only
5. **No Logging** - Never log tokens or sensitive data

### API Usage
1. **Rate Limiting** - Respect rate limits and implement backoff
2. **Error Handling** - Handle 401/403 errors appropriately
3. **Input Validation** - Validate all inputs before API calls
4. **HTTPS Only** - All communications over HTTPS
5. **Monitoring** - Log authentication failures

---

## Error Handling

### Common Authentication Errors

#### 400 Bad Request - Invalid Parameters
```json
{
  "error": "invalid_request",
  "error_description": "The request is missing required parameters"
}
```

**Solutions:**
- Verify grant_type is set to "client_credentials"
- Check client_id and client_secret are correct
- Ensure Content-Type is "application/x-www-form-urlencoded"

#### 401 Unauthorized - Invalid Credentials
```json
{
  "error": "invalid_client",
  "error_description": "Client authentication failed"
}
```

**Solutions:**
- Verify client_id and client_secret are correct
- Check credentials haven't expired
- Ensure API client is still active

#### 401 Unauthorized - Invalid/Expired Token
```json
{
  "error": {
    "code": "TOKEN_INVALID",
    "message": "The access token is invalid or expired"
  }
}
```

**Solutions:**
- Refresh the token immediately
- Implement automatic token refresh
- Verify token wasn't modified

#### 403 Forbidden - Insufficient Permissions
```json
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "User does not have permission to access this resource",
    "required_scope": "ccs.device-management.edit"
  }
}
```

**Solutions:**
- Grant additional scopes to API client
- Verify user has appropriate role
- Check resource restrictions

---

## Related Resources

- [API Authentication Guide](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/authentication/authentication)
- [API Client Credentials Guide](https://developer.greenlake.hpe.com/docs/greenlake/services/credentials/public/guide)
- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [OAuth 2.0 Token Exchange RFC 8693](https://tools.ietf.org/html/rfc8693)
- [API and Event Catalog](https://developer.greenlake.hpe.com/docs/greenlake/services)
