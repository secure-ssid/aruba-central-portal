# HPE GreenLake Workspace & Tenant Management APIs

## Overview

The HPE GreenLake Workspace & Tenant Management APIs enable programmatic access to workspace information and multi-tenant management for Managed Service Providers (MSPs). With these APIs, you can view, create, update, and delete managed service provider tenants.

**API Endpoint Base:** `https://global.api.greenlake.hpe.com/`

**Documentation:**
- [Workspace Management Guide](https://developer.greenlake.hpe.com/docs/greenlake/services/workspace/public/guide/)
- [Workspace Management API Reference](https://developer.greenlake.hpe.com/docs/greenlake/services/workspace/public/openapi/workspace-management-v1/nb-api-workspaces)
- [Workspace Management Glossary](https://developer.greenlake.hpe.com/docs/greenlake/services/workspace/public/glossary/)

---

## Workspace Management API

### Overview
Workspaces are resource boundaries in HPE GreenLake that organize users, devices, and subscriptions. The Workspace Management API provides access to workspace information and configuration.

### Core Concepts

#### Workspace
A workspace is an isolated operational environment within HPE GreenLake containing:
- Users and groups
- Devices and subscriptions
- Role assignments
- Configuration settings
- Resources (compute, storage, network)

#### Workspace ID
Unique identifier for each workspace, required for most API operations:
- Format: `workspace-xxxxx` or UUID
- Obtained from workspace creation response or listing operation

#### Workspace Types
1. **Organization Workspace** - Standard workspace for organization
2. **MSP Workspace** - Multi-tenant mode for Managed Service Providers
3. **Tenant Workspace** - Child workspace within MSP mode

### Supported Operations

#### List Workspaces
- **HTTP Method:** `GET`
- **Endpoint:** `/workspace-management/v1/workspaces`
- **Query Parameters:**
  - `limit` - Number of results (optional, default: 50, max: 1000)
  - `offset` - Pagination offset (optional)
  - `filter` - Advanced filtering (optional)
  - `sort` - Sort order (optional, e.g., "name:asc")
- **Description:** Retrieve list of all workspaces the user has access to
- **Required Permissions:** `workspace.management.view`

#### Get Workspace Details
- **HTTP Method:** `GET`
- **Endpoint:** `/workspace-management/v1/workspaces/{workspaceId}`
- **Description:** Retrieve detailed information about a specific workspace
- **Required Permissions:** `workspace.management.view`

#### Get Workspace Contact Information
- **HTTP Method:** `GET`
- **Endpoint:** `/workspace-management/v1/workspaces/{workspaceId}/contact`
- **Description:** Retrieve address, phone, and email for workspace
- **Required Permissions:** `workspace.management.view`

#### Update Workspace
- **HTTP Method:** `PUT`
- **Endpoint:** `/workspace-management/v1/workspaces/{workspaceId}`
- **Description:** Update workspace information and settings
- **Required Permissions:** `workspace.management.edit`

#### Delete Workspace
- **HTTP Method:** `DELETE`
- **Endpoint:** `/workspace-management/v1/workspaces/{workspaceId}`
- **Description:** Remove a workspace (only empty workspaces)
- **Required Permissions:** `workspace.management.delete`

### Request/Response Examples

#### List Workspaces Request
```bash
curl -X GET "https://global.api.greenlake.hpe.com/workspace-management/v1/workspaces?limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### List Workspaces Response (200 OK)
```json
{
  "items": [
    {
      "id": "workspace-001",
      "name": "Production Environment",
      "type": "organization",
      "status": "active",
      "description": "Main production workspace",
      "created_at": "2024-01-01T10:00:00Z",
      "modified_at": "2024-01-20T15:30:00Z",
      "created_by": "admin@example.com",
      "workspace_admin": "admin@example.com",
      "device_count": 150,
      "user_count": 25
    },
    {
      "id": "workspace-002",
      "name": "Development Environment",
      "type": "organization",
      "status": "active",
      "description": "Development and testing workspace",
      "created_at": "2024-01-05T08:30:00Z",
      "modified_at": "2024-01-18T12:00:00Z",
      "created_by": "admin@example.com",
      "workspace_admin": "dev-admin@example.com",
      "device_count": 50,
      "user_count": 10
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0,
  "page": 1
}
```

#### Get Workspace Details Request
```bash
curl -X GET "https://global.api.greenlake.hpe.com/workspace-management/v1/workspaces/workspace-001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get Workspace Details Response (200 OK)
```json
{
  "id": "workspace-001",
  "name": "Production Environment",
  "type": "organization",
  "status": "active",
  "description": "Main production workspace",
  "region": "us-east-1",
  "created_at": "2024-01-01T10:00:00Z",
  "modified_at": "2024-01-20T15:30:00Z",
  "created_by": "admin@example.com",
  "workspace_admin": "admin@example.com",
  "device_count": 150,
  "user_count": 25,
  "subscription_count": 15,
  "api_endpoint": "https://global.api.greenlake.hpe.com",
  "capabilities": [
    "device-management",
    "subscription-management",
    "user-management",
    "analytics"
  ]
}
```

#### Get Workspace Contact Information Request
```bash
curl -X GET "https://global.api.greenlake.hpe.com/workspace-management/v1/workspaces/workspace-001/contact" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get Workspace Contact Information Response (200 OK)
```json
{
  "workspace_id": "workspace-001",
  "organization_name": "Acme Corporation",
  "address": {
    "street": "123 Enterprise Drive",
    "city": "San Jose",
    "state": "CA",
    "postal_code": "95110",
    "country": "USA"
  },
  "phone": "+1-408-555-0100",
  "email": "contact@acme.com",
  "contact_person": "John Smith",
  "contact_title": "IT Director"
}
```

#### Update Workspace Request
```bash
curl -X PUT "https://global.api.greenlake.hpe.com/workspace-management/v1/workspaces/workspace-001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Environment - Updated",
    "description": "Main production workspace with updated configuration",
    "status": "active"
  }'
```

#### Update Workspace Response (200 OK)
```json
{
  "id": "workspace-001",
  "name": "Production Environment - Updated",
  "description": "Main production workspace with updated configuration",
  "status": "active",
  "modified_at": "2024-01-21T10:15:00Z",
  "modified_by": "admin@example.com"
}
```

---

## MSP Multi-Tenant Management API

### Overview
The MSP Multi-Tenant Management API is specifically designed for Managed Service Providers to manage multiple customer workspaces (tenants) from a single MSP workspace. This enables efficient multi-tenant operations and tenant isolation.

**Documentation:** https://developer.greenlake.hpe.com/docs/greenlake/services/workspace/public/openapi/workspace-management-v1/nb-api-workspaces

### Key Concepts

#### MSP Workspace
An MSP (Managed Service Provider) workspace is a multi-tenant operational mode that allows managing multiple independent HPE GreenLake workspaces from a single interface.

#### Tenant
An isolated environment with unique users and workloads dedicated to a single customer in an MSP workspace. Tenants are completely isolated from each other.

#### Tenant Workspace
A child workspace within an MSP workspace representing a customer's dedicated environment.

### Supported Operations

#### List MSP Tenants
- **HTTP Method:** `GET`
- **Endpoint:** `/workspace-management/v1/msp-tenants`
- **Query Parameters:**
  - `msp-workspace-id` - MSP workspace identifier (required)
  - `limit` - Number of results (optional)
  - `offset` - Pagination offset (optional)
  - `filter` - Filter tenants (optional)
- **Description:** Retrieve list of all tenants in an MSP workspace
- **Required Permissions:** `workspace.management.view`

#### Get MSP Tenant Details
- **HTTP Method:** `GET`
- **Endpoint:** `/workspace-management/v1/msp-tenants/{tenantId}`
- **Description:** Retrieve detailed information about a specific tenant
- **Required Permissions:** `workspace.management.view`

#### Create MSP Customer Workspace
- **HTTP Method:** `POST`
- **Endpoint:** `/workspace-management/v1/msp-tenants`
- **Description:** Create a new tenant workspace for an MSP customer
- **Required Permissions:** `workspace.management.create`

#### Update MSP Tenant
- **HTTP Method:** `PUT`
- **Endpoint:** `/workspace-management/v1/msp-tenants/{tenantId}`
- **Description:** Update tenant information and settings
- **Required Permissions:** `workspace.management.edit`

#### Delete MSP Tenant
- **HTTP Method:** `DELETE`
- **Endpoint:** `/workspace-management/v1/msp-tenants/{tenantId}`
- **Description:** Delete a tenant and its associated resources
- **Required Permissions:** `workspace.management.delete`

### Request/Response Examples

#### List MSP Tenants Request
```bash
curl -X GET "https://global.api.greenlake.hpe.com/workspace-management/v1/msp-tenants?msp-workspace-id=msp-workspace-001&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### List MSP Tenants Response (200 OK)
```json
{
  "items": [
    {
      "id": "tenant-001",
      "name": "Customer A",
      "status": "active",
      "workspace_id": "workspace-cust-a",
      "created_at": "2024-01-01T10:00:00Z",
      "modified_at": "2024-01-20T15:30:00Z",
      "device_count": 50,
      "user_count": 10,
      "subscription_count": 5
    },
    {
      "id": "tenant-002",
      "name": "Customer B",
      "status": "active",
      "workspace_id": "workspace-cust-b",
      "created_at": "2024-01-05T08:30:00Z",
      "modified_at": "2024-01-18T12:00:00Z",
      "device_count": 75,
      "user_count": 15,
      "subscription_count": 8
    }
  ],
  "total": 12,
  "limit": 20,
  "offset": 0
}
```

#### Create MSP Customer Workspace Request
```bash
curl -X POST "https://global.api.greenlake.hpe.com/workspace-management/v1/msp-tenants" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "msp_workspace_id": "msp-workspace-001",
    "name": "New Customer C",
    "customer_id": "cust-c-12345",
    "description": "Workspace for Customer C",
    "contact": {
      "organization_name": "Customer C Inc",
      "email": "admin@customerc.com",
      "phone": "+1-408-555-0200",
      "address": {
        "street": "456 Business Ave",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94102",
        "country": "USA"
      }
    },
    "tags": ["customer", "enterprise"]
  }'
```

#### Create MSP Customer Workspace Response (201 Created)
```json
{
  "id": "tenant-003",
  "name": "New Customer C",
  "customer_id": "cust-c-12345",
  "status": "active",
  "workspace_id": "workspace-cust-c",
  "msp_workspace_id": "msp-workspace-001",
  "description": "Workspace for Customer C",
  "created_at": "2024-01-21T10:30:00Z",
  "created_by": "msp-admin@example.com",
  "contact": {
    "organization_name": "Customer C Inc",
    "email": "admin@customerc.com",
    "phone": "+1-408-555-0200"
  },
  "tags": ["customer", "enterprise"],
  "device_count": 0,
  "user_count": 0
}
```

#### Get MSP Tenant Details Request
```bash
curl -X GET "https://global.api.greenlake.hpe.com/workspace-management/v1/msp-tenants/tenant-001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get MSP Tenant Details Response (200 OK)
```json
{
  "id": "tenant-001",
  "name": "Customer A",
  "customer_id": "cust-a-12345",
  "status": "active",
  "workspace_id": "workspace-cust-a",
  "msp_workspace_id": "msp-workspace-001",
  "description": "Workspace for Customer A",
  "created_at": "2024-01-01T10:00:00Z",
  "modified_at": "2024-01-20T15:30:00Z",
  "created_by": "msp-admin@example.com",
  "contact": {
    "organization_name": "Customer A Corp",
    "email": "admin@customera.com",
    "phone": "+1-408-555-0100",
    "address": {
      "street": "123 Enterprise Drive",
      "city": "San Jose",
      "state": "CA",
      "postal_code": "95110",
      "country": "USA"
    }
  },
  "tags": ["customer", "strategic"],
  "device_count": 50,
  "user_count": 10,
  "subscription_count": 5,
  "api_endpoint": "https://global.api.greenlake.hpe.com"
}
```

#### Update MSP Tenant Request
```bash
curl -X PUT "https://global.api.greenlake.hpe.com/workspace-management/v1/msp-tenants/tenant-001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer A - Updated",
    "description": "Updated workspace for Customer A",
    "status": "active",
    "tags": ["customer", "strategic", "vip"]
  }'
```

#### Update MSP Tenant Response (200 OK)
```json
{
  "id": "tenant-001",
  "name": "Customer A - Updated",
  "description": "Updated workspace for Customer A",
  "status": "active",
  "tags": ["customer", "strategic", "vip"],
  "modified_at": "2024-01-21T11:00:00Z",
  "modified_by": "msp-admin@example.com"
}
```

#### Delete MSP Tenant Request
```bash
curl -X DELETE "https://global.api.greenlake.hpe.com/workspace-management/v1/msp-tenants/tenant-003" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Delete MSP Tenant Response (204 No Content)
```
(Empty response body on success)
```

---

## MSP Authentication & Token Management

### MSP Token Exchange

In MSP mode, Managed Service Providers can exchange an MSP workspace token for a tenant-scoped token using OAuth 2.0 Token Exchange (RFC 8693):

#### Token Exchange Request
```bash
curl -X POST "https://sso.common.cloud.hpe.com/as/token.oauth2" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:token-exchange&subject_token=MSP_TOKEN&subject_token_type=urn:ietf:params:oauth:token-type:access_token&resource=https://global.api.greenlake.hpe.com/workspace-management/v1/msp-tenants/tenant-001&audience=https://global.api.greenlake.hpe.com"
```

#### Token Exchange Response
```json
{
  "access_token": "TENANT_SCOPED_TOKEN",
  "token_type": "Bearer",
  "expires_in": 900,
  "resource": "https://global.api.greenlake.hpe.com/workspace-management/v1/msp-tenants/tenant-001"
}
```

### Token Validity in MSP Mode
- MSP workspace tokens: Valid for 15 minutes
- Tenant-scoped tokens: Valid for 15 minutes
- Token refresh: Always get fresh tokens for security

---

## Workspace Isolation & Security

### Multi-Tenant Isolation
1. **Complete Data Isolation** - Each tenant's data is completely isolated
2. **Role-Based Access** - Users can only access assigned workspaces
3. **Audit Trail** - All operations tracked per tenant
4. **Separate Credentials** - Each tenant has separate API credentials
5. **Resource Quotas** - Configurable per tenant

### Workspace Access Control
- Users assigned to workspace can access its resources
- Roles determine what operations are allowed
- MSP admins can manage all tenants
- Tenant admins manage their own workspace only

---

## Workspace Quotas and Limits

### Resource Limits per Workspace
- **Maximum Devices:** 10,000
- **Maximum Users:** 5,000
- **Maximum Groups:** 1,000
- **Maximum Subscriptions:** 5,000
- **API Requests/Minute:** 1000

### MSP-Specific Limits
- **Maximum Tenants per MSP:** 1,000
- **Maximum API Calls/Minute (per MSP):** 5,000
- **Tenant Creation Rate:** 10 per minute

---

## Error Handling

### Common HTTP Status Codes
- **200 OK** - Request successful
- **201 Created** - Workspace/tenant created
- **204 No Content** - Successful deletion
- **400 Bad Request** - Invalid parameters
- **401 Unauthorized** - Missing/invalid token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Workspace/tenant not found
- **409 Conflict** - Workspace/tenant already exists
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Service error

### Error Response Example
```json
{
  "error": {
    "code": "WORKSPACE_NOT_FOUND",
    "message": "The specified workspace does not exist",
    "workspace_id": "workspace-invalid"
  }
}
```

---

## Best Practices

### Workspace Management Best Practices
1. **Naming Convention** - Use meaningful, consistent names
2. **Documentation** - Document workspace purpose and scope
3. **Regular Audits** - Review workspace configuration regularly
4. **Backup Strategy** - Plan for disaster recovery
5. **Access Control** - Apply principle of least privilege

### MSP Tenant Management Best Practices
1. **Tenant Naming** - Use customer identifiers in names
2. **Quota Planning** - Set appropriate limits per tenant
3. **Billing Tracking** - Track resources per tenant
4. **Security Isolation** - Ensure complete data separation
5. **SLA Monitoring** - Track performance per tenant

### API Usage Best Practices
1. Cache workspace information when possible
2. Implement exponential backoff for retries
3. Monitor rate limits and adjust calls accordingly
4. Use batch operations when available
5. Implement error handling for all operations

---

## Related Resources

- [Workspace Management Guide](https://developer.greenlake.hpe.com/docs/greenlake/services/workspace/public/guide/)
- [Workspace Management API Reference](https://developer.greenlake.hpe.com/docs/greenlake/services/workspace/public/openapi/workspace-management-v1/nb-api-workspaces)
- [Workspace Management Glossary](https://developer.greenlake.hpe.com/docs/greenlake/services/workspace/public/glossary/)
- [API Authentication Guide](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/authentication/authentication)
- [API and Event Catalog](https://developer.greenlake.hpe.com/docs/greenlake/services)
