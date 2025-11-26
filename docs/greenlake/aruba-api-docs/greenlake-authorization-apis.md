# HPE GreenLake Authorization APIs - Roles & Permissions

## Overview

The HPE GreenLake Authorization APIs enable programmatic management of roles, permissions, and access control. The platform uses role-based access control (RBAC) to manage user permissions across resources and workspaces.

**API Endpoint Base:** `https://global.api.greenlake.hpe.com/`

---

## Platform Roles

### Overview
Roles in HPE GreenLake are groups of permissions that define what actions users can perform within a workspace. The platform provides three built-in role types with different privilege levels.

**Documentation:** https://developer.greenlake.hpe.com/docs/greenlake/services/identity/public

### Standard Role Types

#### 1. Administrator Role
- **Name:** Administrator
- **Scope:** Workspace-level
- **Privileges:**
  - View resources
  - Create/Edit resources
  - Delete resources
  - Manage users and roles
  - Configure workspace settings
- **Use Case:** Full administrative control of workspace

#### 2. Operator Role
- **Name:** Operator
- **Scope:** Workspace-level
- **Privileges:**
  - View resources
  - Create/Edit resources
  - Cannot delete resources
  - Cannot manage other users
  - Limited configuration access
- **Use Case:** Day-to-day operational management

#### 3. Observer Role
- **Name:** Observer
- **Scope:** Workspace-level
- **Privileges:**
  - View resources (read-only)
  - Cannot create/edit resources
  - Cannot delete resources
- **Use Case:** Monitoring and reporting only

---

## Role Assignments API

### Overview
The Role Assignments API allows programmatic assignment and management of roles to users within workspaces. Once users are provisioned through SCIM integration or manual creation, administrators assign roles to define their access permissions.

**Documentation:** https://developer.greenlake.hpe.com/docs/greenlake/services/identity/public

### Supported Operations

#### Assign Role to User
- **HTTP Method:** `POST`
- **Endpoint:** `/iam/v1/users/{userId}/roles`
- **Description:** Assign a role to a user within a specific workspace
- **Required Permissions:** `iam.roles.assign` (Administrator only)

#### Get User Roles
- **HTTP Method:** `GET`
- **Endpoint:** `/iam/v1/users/{userId}/roles`
- **Query Parameters:**
  - `workspace-id` - Filter roles by workspace (optional)
- **Description:** Retrieve all roles assigned to a user
- **Required Permissions:** `iam.roles.view`

#### Get User Roles in Workspace
- **HTTP Method:** `GET`
- **Endpoint:** `/iam/v1/workspaces/{workspaceId}/users/{userId}/roles`
- **Description:** Retrieve roles assigned to a user in a specific workspace
- **Required Permissions:** `iam.roles.view`

#### Remove Role from User
- **HTTP Method:** `DELETE`
- **Endpoint:** `/iam/v1/users/{userId}/roles/{roleId}`
- **Query Parameters:**
  - `workspace-id` - Workspace from which to remove role
- **Description:** Revoke a role assignment from a user
- **Required Permissions:** `iam.roles.assign` (Administrator only)

#### Assign Role to Group
- **HTTP Method:** `POST`
- **Endpoint:** `/iam/v1/groups/{groupId}/roles`
- **Description:** Assign a role to all members of a group
- **Required Permissions:** `iam.roles.assign` (Administrator only)

#### Get Group Roles
- **HTTP Method:** `GET`
- **Endpoint:** `/iam/v1/groups/{groupId}/roles`
- **Description:** Retrieve all roles assigned to a group
- **Required Permissions:** `iam.roles.view`

### Request/Response Examples

#### Assign Role to User Request
```bash
curl -X POST "https://global.api.greenlake.hpe.com/iam/v1/users/john.doe@example.com/roles" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "workspace-001",
    "roleId": "operator-role-001"
  }'
```

#### Assign Role to User Response (201 Created)
```json
{
  "roleAssignmentId": "role-assign-12345",
  "userId": "john.doe@example.com",
  "workspaceId": "workspace-001",
  "roleId": "operator-role-001",
  "roleName": "Operator",
  "assignedAt": "2024-01-15T10:30:00Z",
  "assignedBy": "admin@example.com"
}
```

#### Get User Roles Request
```bash
curl -X GET "https://global.api.greenlake.hpe.com/iam/v1/users/john.doe@example.com/roles?workspace-id=workspace-001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get User Roles Response (200 OK)
```json
{
  "userId": "john.doe@example.com",
  "roles": [
    {
      "roleId": "operator-role-001",
      "roleName": "Operator",
      "workspaceId": "workspace-001",
      "workspaceName": "Production Environment",
      "assignedAt": "2024-01-15T10:30:00Z"
    },
    {
      "roleId": "observer-role-001",
      "roleName": "Observer",
      "workspaceId": "workspace-002",
      "workspaceName": "Development Environment",
      "assignedAt": "2024-01-10T14:15:00Z"
    }
  ]
}
```

#### Remove Role from User Request
```bash
curl -X DELETE "https://global.api.greenlake.hpe.com/iam/v1/users/john.doe@example.com/roles/operator-role-001?workspace-id=workspace-001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Remove Role from User Response (204 No Content)
```
(Empty response body on success)
```

---

## Permissions API

### Overview
The Permissions API provides detailed information about available permissions and allows querying which permissions are associated with specific roles or services.

**Documentation:** https://developer.greenlake.hpe.com/docs/greenlake/services/iam

### Supported Operations

#### List All Permissions
- **HTTP Method:** `GET`
- **Endpoint:** `/iam/v1/permissions`
- **Query Parameters:**
  - `service` - Filter by service name (optional)
  - `resource-type` - Filter by resource type (optional)
  - `limit` - Number of results (optional, default: 50)
  - `offset` - Pagination offset (optional)
- **Description:** Retrieve list of all available permissions
- **Required Permissions:** `iam.permissions.view` (Operator or higher)

#### Get Permission Details
- **HTTP Method:** `GET`
- **Endpoint:** `/iam/v1/permissions/{permissionId}`
- **Description:** Retrieve detailed information about a specific permission
- **Required Permissions:** `iam.permissions.view`

#### Get Permissions by Role
- **HTTP Method:** `GET`
- **Endpoint:** `/iam/v1/roles/{roleId}/permissions`
- **Description:** List all permissions included in a specific role
- **Required Permissions:** `iam.permissions.view`

#### Get Permissions by Service
- **HTTP Method:** `GET`
- **Endpoint:** `/iam/v1/permissions?service={serviceName}`
- **Description:** List all permissions for a specific service
- **Required Permissions:** `iam.permissions.view`

### Common Permission Categories

#### Device Management Permissions
- `ccs.device-management.view` - View devices
- `ccs.device-management.create` - Create/onboard devices
- `ccs.device-management.edit` - Modify device configuration
- `ccs.device-management.delete` - Delete devices

#### Subscription Management Permissions
- `ccs.subscription-management.view` - View subscriptions
- `ccs.subscription-management.edit` - Manage subscriptions
- `ccs.subscription-management.assign` - Assign subscriptions to devices

#### Workspace Management Permissions
- `workspace.management.view` - View workspace information
- `workspace.management.edit` - Configure workspace settings
- `workspace.management.create` - Create new workspaces
- `workspace.management.delete` - Delete workspaces

#### User Management Permissions
- `iam.users.view` - View users
- `iam.users.create` - Create users
- `iam.users.edit` - Modify user information
- `iam.users.delete` - Delete users

#### Group Management Permissions
- `iam.groups.view` - View groups
- `iam.groups.create` - Create groups
- `iam.groups.edit` - Modify groups
- `iam.groups.delete` - Delete groups

#### Role Management Permissions
- `iam.roles.view` - View available roles
- `iam.roles.assign` - Assign roles to users/groups
- `iam.roles.revoke` - Revoke role assignments

### Request/Response Examples

#### List All Permissions Request
```bash
curl -X GET "https://global.api.greenlake.hpe.com/iam/v1/permissions?service=device-management&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### List All Permissions Response (200 OK)
```json
{
  "permissions": [
    {
      "permissionId": "perm-001",
      "name": "ccs.device-management.view",
      "displayName": "View Devices",
      "description": "Allows viewing device inventory and details",
      "service": "device-management",
      "resourceType": "device",
      "action": "read"
    },
    {
      "permissionId": "perm-002",
      "name": "ccs.device-management.edit",
      "displayName": "Edit Devices",
      "description": "Allows modifying device configuration",
      "service": "device-management",
      "resourceType": "device",
      "action": "write"
    },
    {
      "permissionId": "perm-003",
      "name": "ccs.device-management.delete",
      "displayName": "Delete Devices",
      "description": "Allows removing devices from workspace",
      "service": "device-management",
      "resourceType": "device",
      "action": "delete"
    }
  ],
  "total": 15,
  "limit": 10,
  "offset": 0
}
```

#### Get Permissions by Role Request
```bash
curl -X GET "https://global.api.greenlake.hpe.com/iam/v1/roles/operator-role-001/permissions" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get Permissions by Role Response (200 OK)
```json
{
  "roleId": "operator-role-001",
  "roleName": "Operator",
  "permissions": [
    {
      "permissionId": "perm-001",
      "name": "ccs.device-management.view",
      "displayName": "View Devices"
    },
    {
      "permissionId": "perm-002",
      "name": "ccs.device-management.edit",
      "displayName": "Edit Devices"
    },
    {
      "permissionId": "perm-004",
      "name": "ccs.subscription-management.view",
      "displayName": "View Subscriptions"
    },
    {
      "permissionId": "perm-005",
      "name": "workspace.management.view",
      "displayName": "View Workspace Information"
    }
  ]
}
```

---

## Access Control Model

### Token-based Authorization
When a user generates an access token using their API client credentials, the token inherits the user's roles and permissions. API requests made with the token are authorized based on the user's assigned roles.

### Key Components

1. **User**: Identified by username or user ID
2. **Role**: Named collection of permissions (Administrator, Operator, Observer)
3. **Workspace**: Resource boundary for role assignment
4. **Permission**: Specific action on a resource (view, create, edit, delete)

### Authorization Flow

```
1. User logs in and generates API token
   ↓
2. Token contains user's role and permission claims
   ↓
3. API request made with token in Authorization header
   ↓
4. API service validates token and checks permissions
   ↓
5. If permission matches action → Allow (200/201/204)
   If permission missing → Deny (403 Forbidden)
```

---

## Role-Based API Access Examples

### Service Catalog API Access by Role

#### Observer Role
- Permission: `service-catalog.offering.view`
- Can make: `GET /catalog/v1/offerings` (list offerings)
- Cannot make: POST/PUT/DELETE operations

#### Operator Role
- Permissions: `service-catalog.offering.view`, `service-catalog.provision.create`
- Can make: `GET /catalog/v1/offerings` (list offerings)
- Can make: `POST /provision/v1/requests` (create service request)
- Cannot make: DELETE operations

#### Administrator Role
- Full permissions on all services
- Can make: Any HTTP method on any endpoint within workspace

---

## Rate Limits

### Role/Permission Operations
- **Per User:** 50 role assignments per minute
- **Per Workspace:** 200 role operations per minute
- **Per API Client:** 1000 permission queries per minute

---

## Best Practices

### Role Assignment Best Practices
1. Use groups for bulk role assignment
2. Apply principle of least privilege
3. Regularly audit role assignments
4. Use workspace-specific roles
5. Document role purposes and requirements

### Permission Management Best Practices
1. Understand permission dependencies
2. Don't assign individual permissions (use roles)
3. Review role permissions regularly
4. Create custom roles for specific needs
5. Monitor permission-related API calls

### Security Considerations
1. Only Administrators can assign/revoke roles
2. Token refresh inherits current role state
3. Role changes take effect immediately
4. Revoked roles prevent further API access
5. Audit logs track all role changes

---

## Error Handling

### Common HTTP Status Codes
- **200 OK** - Request successful
- **201 Created** - Role successfully assigned
- **204 No Content** - Successful deletion (no response body)
- **400 Bad Request** - Invalid parameters (e.g., invalid role ID)
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - Insufficient permissions to perform action
- **404 Not Found** - User, role, or workspace not found
- **409 Conflict** - Role already assigned to user
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Service error

### Error Response Example
```json
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "User does not have permission to assign roles",
    "requiredPermission": "iam.roles.assign",
    "userPermissions": ["iam.roles.view"]
  }
}
```

---

## Related Resources

- [HPE GreenLake User Management](https://developer.greenlake.hpe.com/docs/greenlake/services/identity/public)
- [Workspace Management](https://developer.greenlake.hpe.com/docs/greenlake/services/workspace/public)
- [IAM APIs](https://developer.greenlake.hpe.com/docs/greenlake/services/iam)
- [API Authentication Guide](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/authentication/authentication)
- [Roles & Permissions Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us&page=GUID-FF77BFEC-79AB-4FBC-8684-FADB9FAE138A.html)
