# HPE GreenLake API Documentation

This directory contains comprehensive documentation for HPE GreenLake APIs, organized by functional area. All documentation is formatted as clean markdown with endpoint specifications, HTTP methods, parameters, request/response examples, and required permissions.

## Documentation Files

### 1. Authentication
**File:** `greenlake-authentication.md`

Comprehensive guide to OAuth 2.0 authentication for HPE GreenLake APIs, including:
- OAuth 2.0 Client Credentials flow
- API client credential creation and management
- Token generation and validation
- Token refresh strategies
- Required scopes and permissions
- MSP token exchange (RFC 8693)
- Code examples in Python, Node.js, and Bash
- Security best practices
- Error handling and troubleshooting

**Key Topics:**
- Token endpoint: `https://sso.common.cloud.hpe.com/as/token.oauth2`
- API base: `https://global.api.greenlake.hpe.com/`
- Token validity: 15 minutes for GreenLake services
- Scopes: Device management, subscriptions, workspace, IAM, service catalog

---

### 2. Identity & User Management APIs
**File:** `greenlake-identity-apis.md`

Complete reference for user and group management APIs:
- SCIM v2 Users API (create, read, update, delete users)
- SCIM v2 Groups API (manage user groups)
- Identity Management API (user information and roles)
- SCIM integration setup with external identity providers
- Required permissions for user/group operations
- Request/response examples with JSON payloads
- Rate limits and error handling

**Key Endpoints:**
- `/scim/v2/Users` - User management
- `/scim/v2/Groups` - Group management
- `/iam/v1/users` - User information
- `https://sps.us1.greenlake-hpe.com/v1alpha1/scimproxy` - SCIM proxy

**Supported Operations:**
- Create/read/update/delete users
- Create/read/update/delete groups
- List users with filtering
- User role retrieval

---

### 3. Authorization APIs - Roles & Permissions
**File:** `greenlake-authorization-apis.md`

Complete guide to authorization, roles, and permissions:
- Platform role types (Administrator, Operator, Observer)
- Role assignment APIs for users and groups
- Permissions API and permission categories
- Role-based access control (RBAC) model
- Service-specific permissions
- API access examples by role
- Best practices for access control
- Error handling and status codes

**Key Endpoints:**
- `/iam/v1/users/{userId}/roles` - Assign/retrieve user roles
- `/iam/v1/groups/{groupId}/roles` - Assign/retrieve group roles
- `/iam/v1/permissions` - Query available permissions
- `/iam/v1/roles/{roleId}/permissions` - Get role permissions

**Permission Categories:**
- Device management (view, create, edit, delete)
- Subscription management (view, edit, assign)
- Workspace management (view, edit, create, delete)
- User/group management (CRUD operations)
- Role management (view, assign, revoke)

---

### 4. Device Management APIs
**File:** `greenlake-device-apis.md`

Comprehensive API reference for device inventory and subscription management:
- Device Inventory API (list, get, add, update, delete devices)
- Device Subscription API (manage software licenses)
- Device status tracking and filtering
- Asynchronous operation handling
- Subscription assignment and management
- Rate limits and quota information
- Request/response examples with curl
- Best practices for device management

**Key Endpoints:**
- `/device-management/v1/devices` - Device inventory operations
- `/device-management/v1/devices/{deviceId}` - Specific device management
- `/subscription-management/v1/subscriptions` - Subscription operations
- `/subscription-management/v1/devices/{deviceId}/subscriptions` - Device subscriptions

**Supported Operations:**
- List devices with pagination and filtering
- Add/remove devices from workspace
- Update device configuration
- Assign/revoke subscriptions
- Track device and subscription status
- Monitor asynchronous operation progress

**Rate Limits:**
- List devices: 160 req/min per workspace
- Add devices: 25 req/min per workspace
- Device operations: 40 req/min per workspace

---

### 5. Workspace & Tenant Management APIs
**File:** `greenlake-workspace-apis.md`

Complete documentation for workspace and MSP multi-tenant management:
- Workspace Management API (CRUD operations)
- MSP Multi-Tenant Management (manage customer tenants)
- Workspace isolation and security
- Tenant creation and lifecycle management
- MSP token exchange and authentication
- Workspace contact information management
- Quota and limit information
- Best practices for workspace organization

**Key Endpoints:**
- `/workspace-management/v1/workspaces` - Workspace operations
- `/workspace-management/v1/workspaces/{workspaceId}` - Specific workspace
- `/workspace-management/v1/msp-tenants` - MSP tenant management
- `/workspace-management/v1/msp-tenants/{tenantId}` - Specific tenant

**Supported Operations:**
- List workspaces with filtering
- Get workspace and contact details
- Create/update/delete workspaces
- Create MSP customer workspaces (tenants)
- Update tenant information
- Delete tenants and resources
- Exchange tokens for MSP access

**Workspace Limits:**
- Max devices: 10,000 per workspace
- Max users: 5,000 per workspace
- Max API requests: 1,000 req/min
- Max tenants (MSP): 1,000

---

## API Organization by Purpose

### User & Access Management
- **Authentication:** `greenlake-authentication.md`
- **User Management:** `greenlake-identity-apis.md`
- **Authorization:** `greenlake-authorization-apis.md`

### Resource Management
- **Devices:** `greenlake-device-apis.md`
- **Workspaces/Tenants:** `greenlake-workspace-apis.md`

---

## Quick Start Guide

### 1. Setup Authentication
```bash
# 1. Create API Client Credentials (via portal)
# 2. Get access token
TOKEN=$(curl -s -X POST "https://sso.common.cloud.hpe.com/as/token.oauth2" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET" \
  | jq -r '.access_token')

# 3. Use token in API calls
curl -X GET "https://global.api.greenlake.hpe.com/device-management/v1/devices" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Manage Workspace
```bash
# List workspaces
curl -X GET "https://global.api.greenlake.hpe.com/workspace-management/v1/workspaces" \
  -H "Authorization: Bearer $TOKEN"

# Get workspace details
curl -X GET "https://global.api.greenlake.hpe.com/workspace-management/v1/workspaces/workspace-001" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Manage Devices
```bash
# List devices
curl -X GET "https://global.api.greenlake.hpe.com/device-management/v1/devices?workspace-id=workspace-001" \
  -H "Authorization: Bearer $TOKEN"

# Add device
curl -X POST "https://global.api.greenlake.hpe.com/device-management/v1/devices" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "workspace-001",
    "devices": [{"serial": "SN123456789", "name": "Device-1"}]
  }'
```

### 4. Manage Users & Roles
```bash
# Create user (SCIM)
curl -X POST "https://sps.us1.greenlake-hpe.com/v1alpha1/scimproxy/scim/v2/Users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "user@example.com",
    "name": {"givenName": "John", "familyName": "Doe"}
  }'

# Assign role to user
curl -X POST "https://global.api.greenlake.hpe.com/iam/v1/users/user@example.com/roles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "workspace-001",
    "roleId": "operator-role-001"
  }'
```

---

## Common API Patterns

### Pagination
```bash
# List with pagination
curl -X GET "https://global.api.greenlake.hpe.com/device-management/v1/devices?limit=50&offset=0" \
  -H "Authorization: Bearer $TOKEN"

# Response includes:
# - items: array of results
# - total: total number of items
# - limit: items per page
# - offset: current offset
# - page: current page number
```

### Filtering
```bash
# Advanced filtering
curl -X GET "https://global.api.greenlake.hpe.com/device-management/v1/devices?filter=status:active%20AND%20model:Aruba%206300" \
  -H "Authorization: Bearer $TOKEN"
```

### Asynchronous Operations
```bash
# Operations like adding devices return 202 Accepted
# Response includes task_id and location header

# Poll task status
curl -X GET "https://global.api.greenlake.hpe.com/device-management/v1/tasks/task-12345" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Required Permissions by Operation

### View Operations
Required: `<service>.*.view` scope
Example: `ccs.device-management.view`

### Create Operations
Required: `<service>.*.create` scope
Example: `ccs.device-management.create`

### Edit Operations
Required: `<service>.*.edit` scope
Example: `ccs.device-management.edit`

### Delete Operations
Required: `<service>.*.delete` scope
Example: `ccs.device-management.delete`

---

## Rate Limits Overview

| Operation | Rate Limit | Details |
|-----------|-----------|---------|
| Device List | 160 req/min | Per workspace |
| Device Details | 40 req/min | Per workspace |
| Add Devices | 25 req/min | Per workspace |
| Update Device | 40 req/min | Per workspace |
| Delete Device | 25 req/min | Per workspace |
| List Subscriptions | 100 req/min | Per workspace |
| Add Subscriptions | 25 req/min | Per workspace |
| Token Requests | 100 req/min | Per client |
| General API | 1,000 req/min | Per workspace |

When limits are exceeded, APIs return HTTP 429 with retry-after header.

---

## Error Response Format

All APIs return errors in consistent JSON format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional details if available"
  }
}
```

Common HTTP Status Codes:
- **200-204:** Success
- **400:** Bad request (invalid parameters)
- **401:** Unauthorized (invalid/missing token)
- **403:** Forbidden (insufficient permissions)
- **404:** Not found (resource doesn't exist)
- **409:** Conflict (resource already exists)
- **429:** Too many requests (rate limit exceeded)
- **500:** Internal server error (service issue)

---

## Related Resources

- [HPE GreenLake Developer Portal](https://developer.greenlake.hpe.com/)
- [API and Event Catalog](https://developer.greenlake.hpe.com/docs/greenlake/services)
- [API Authentication Guide](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/authentication/authentication)
- [HPE GreenLake Support](https://support.hpe.com/)

---

## Documentation Metadata

- **Last Updated:** November 23, 2024
- **Total Files:** 5 markdown files + this README
- **Total Content:** 2,604 lines of documentation
- **Coverage:** Identity, Authorization, Devices, Workspaces, Authentication
- **API Version:** HPE GreenLake current/latest
- **Source:** HPE GreenLake Developer Portal

---

## Document Structure

Each API documentation file follows this structure:

1. **Overview** - Service description and purpose
2. **Key Concepts** - Important definitions
3. **Supported Operations** - Available API methods
4. **Request/Response Examples** - curl commands and JSON
5. **Authentication** - Required scopes and permissions
6. **Rate Limits** - Quotas and limits
7. **Error Handling** - Status codes and error responses
8. **Best Practices** - Usage recommendations
9. **Related Resources** - Links to more information

---

## Using This Documentation

### For API Developers
- Reference `greenlake-authentication.md` first for setup
- Then reference service-specific docs (identity, device, etc.)
- Use code examples to understand request/response format
- Check error handling section for troubleshooting

### For Integration Partners
- Start with the Quick Start Guide above
- Review required permissions for your use case
- Implement error handling and rate limit management
- Follow security best practices

### For Operations Teams
- Reference device and workspace management APIs
- Monitor rate limit usage and quotas
- Track audit logs via authentication section
- Use filtering and pagination for large datasets

---

## Contributing

To update this documentation:
1. Verify changes against official HPE GreenLake documentation
2. Maintain consistent formatting and structure
3. Include both curl and code examples when possible
4. Test all API examples before committing
5. Update this README with any significant changes

---

## Support

For API issues and questions:
- Check HPE GreenLake Developer Portal: https://developer.greenlake.hpe.com/
- Review HPE Support: https://support.hpe.com/
- Contact HPE GreenLake support team

---

**All documentation is based on HPE GreenLake APIs as of November 2024.**
