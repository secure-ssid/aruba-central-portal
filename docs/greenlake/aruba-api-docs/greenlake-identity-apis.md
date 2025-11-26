# HPE GreenLake Identity & User Management APIs

## Overview

The HPE GreenLake Identity & User Management APIs provide comprehensive user and group management capabilities, including SCIM v2.0 compliance for standardized identity lifecycle management and integration with external identity providers.

**API Endpoint Base:** `https://global.api.greenlake.hpe.com/`

---

## SCIM v2 Users API

### Overview
The SCIM v2 Users API enables standardized user account management compliant with SCIM (System for Cross-domain Identity Management) 2.0 specifications. This API automates identity lifecycle management and synchronizes user data across systems.

**Documentation:** https://developer.greenlake.hpe.com/docs/greenlake/services/scim

### SCIM Proxy Endpoint
```
Base URL: https://sps.us1.greenlake-hpe.com/v1alpha1/scimproxy
```

### Supported Operations

#### Create User
- **HTTP Method:** `POST`
- **Endpoint:** `/scim/v2/Users`
- **Description:** Create a new user in HPE GreenLake
- **Required Permissions:** User Management - Create

#### Get User
- **HTTP Method:** `GET`
- **Endpoint:** `/scim/v2/Users/{userId}`
- **Description:** Retrieve details for a specific user
- **Required Permissions:** User Management - View

#### List Users
- **HTTP Method:** `GET`
- **Endpoint:** `/scim/v2/Users`
- **Query Parameters:**
  - `filter` - Filter users by specific criteria (optional)
  - `startIndex` - Starting index for pagination (optional)
  - `count` - Number of results to return (optional)
- **Description:** Retrieve a list of users
- **Required Permissions:** User Management - View

#### Update User
- **HTTP Method:** `PUT`
- **Endpoint:** `/scim/v2/Users/{userId}`
- **Description:** Update user information
- **Required Permissions:** User Management - Edit

#### Delete User
- **HTTP Method:** `DELETE`
- **Endpoint:** `/scim/v2/Users/{userId}`
- **Description:** Remove a user from HPE GreenLake
- **Required Permissions:** User Management - Delete

### Request/Response Examples

#### Create User Request
```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "userName": "john.doe@example.com",
  "name": {
    "givenName": "John",
    "familyName": "Doe"
  },
  "emails": [
    {
      "value": "john.doe@example.com",
      "primary": true
    }
  ],
  "active": true
}
```

#### Create User Response (201 Created)
```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "id": "2819c223-7f76-453a-919d-413861904646",
  "userName": "john.doe@example.com",
  "name": {
    "givenName": "John",
    "familyName": "Doe"
  },
  "emails": [
    {
      "value": "john.doe@example.com",
      "primary": true
    }
  ],
  "active": true,
  "meta": {
    "resourceType": "User",
    "created": "2024-01-15T10:30:00Z",
    "lastModified": "2024-01-15T10:30:00Z",
    "location": "https://sps.us1.greenlake-hpe.com/v1alpha1/scimproxy/scim/v2/Users/2819c223-7f76-453a-919d-413861904646"
  }
}
```

---

## SCIM v2 Groups API

### Overview
The SCIM v2 Groups API enables standardized group management compliant with SCIM 2.0 specifications. Groups organize users by roles and departments for simplified access control and administration.

**Documentation:** https://developer.greenlake.hpe.com/docs/greenlake/services/scim

### Supported Operations

#### Create Group
- **HTTP Method:** `POST`
- **Endpoint:** `/scim/v2/Groups`
- **Description:** Create a new group in HPE GreenLake
- **Required Permissions:** User Management - Create

#### Get Group
- **HTTP Method:** `GET`
- **Endpoint:** `/scim/v2/Groups/{groupId}`
- **Description:** Retrieve details for a specific group
- **Required Permissions:** User Management - View

#### List Groups
- **HTTP Method:** `GET`
- **Endpoint:** `/scim/v2/Groups`
- **Query Parameters:**
  - `filter` - Filter groups by specific criteria (optional)
  - `startIndex` - Starting index for pagination (optional)
  - `count` - Number of results to return (optional)
- **Description:** Retrieve a list of groups
- **Required Permissions:** User Management - View

#### Update Group
- **HTTP Method:** `PUT`
- **Endpoint:** `/scim/v2/Groups/{groupId}`
- **Description:** Update group information and membership
- **Required Permissions:** User Management - Edit

#### Delete Group
- **HTTP Method:** `DELETE`
- **Endpoint:** `/scim/v2/Groups/{groupId}`
- **Description:** Remove a group from HPE GreenLake
- **Required Permissions:** User Management - Delete

### Request/Response Examples

#### Create Group Request
```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
  "displayName": "Network Administrators",
  "members": [
    {
      "value": "2819c223-7f76-453a-919d-413861904646",
      "display": "john.doe@example.com"
    }
  ]
}
```

#### Create Group Response (201 Created)
```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
  "id": "e9e30dba-f08b-404c-b4e7-e82fbe2fb7c8",
  "displayName": "Network Administrators",
  "members": [
    {
      "value": "2819c223-7f76-453a-919d-413861904646",
      "display": "john.doe@example.com"
    }
  ],
  "meta": {
    "resourceType": "Group",
    "created": "2024-01-15T10:35:00Z",
    "lastModified": "2024-01-15T10:35:00Z",
    "location": "https://sps.us1.greenlake-hpe.com/v1alpha1/scimproxy/scim/v2/Groups/e9e30dba-f08b-404c-b4e7-e82fbe2fb7c8"
  }
}
```

---

## Identity Management API

### Overview
The HPE GreenLake Identity Management API provides programmatic access to manage user identities, authentication settings, and identity provider configurations within HPE GreenLake organizations.

**Documentation:** https://developer.greenlake.hpe.com/docs/greenlake/services/identity/public

### Supported Operations

#### Get User Information
- **HTTP Method:** `GET`
- **Endpoint:** `/iam/v1/users/{userId}`
- **Description:** Retrieve comprehensive user information including roles and permissions
- **Required Permissions:** Identity Management - View

#### List Organization Users
- **HTTP Method:** `GET`
- **Endpoint:** `/iam/v1/users`
- **Query Parameters:**
  - `organization-id` - Filter by organization (required)
  - `limit` - Number of results to return (optional)
  - `offset` - Starting position for pagination (optional)
- **Description:** List all users in an organization
- **Required Permissions:** Identity Management - View

#### Update User Profile
- **HTTP Method:** `PATCH`
- **Endpoint:** `/iam/v1/users/{userId}`
- **Description:** Update user profile information
- **Required Permissions:** Identity Management - Edit

#### Get User Roles
- **HTTP Method:** `GET`
- **Endpoint:** `/iam/v1/users/{userId}/roles`
- **Description:** Retrieve roles assigned to a user
- **Required Permissions:** Identity Management - View

### Request/Response Examples

#### Get User Information Request
```bash
curl -X GET "https://global.api.greenlake.hpe.com/iam/v1/users/john.doe@example.com" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get User Information Response (200 OK)
```json
{
  "userId": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "organizationId": "org-12345",
  "active": true,
  "roles": [
    {
      "id": "admin-role-001",
      "name": "Administrator",
      "workspace": "workspace-001"
    }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "lastModifiedAt": "2024-01-20T15:30:00Z"
}
```

---

## SCIM Integration Setup

### Prerequisites for SCIM Integration
- Organization must be Organization Governance type
- Valid SCIM 2.0 compliant identity provider
- Admin credentials for IdP configuration

### Configuration Steps

1. **Generate SCIM Credentials:**
   - Create API client credentials in HPE GreenLake portal
   - Note the OAuth 2.0 token endpoint

2. **Configure IdP:**
   - Enter SCIM Base URL: `https://sps.us1.greenlake-hpe.com/v1alpha1/scimproxy`
   - Authenticate with OAuth 2.0 Bearer token
   - Map IdP user/group attributes to SCIM schema

3. **Enable Sync:**
   - Activate SCIM integration in IdP
   - Test user/group synchronization
   - Monitor sync status in HPE GreenLake portal

### Important Notes
- When SCIM integration is enabled, users and groups are managed by the IdP
- Only Organization Governance organizations support SCIM integration
- Bidirectional sync is supported for most identity providers
- User updates from IdP are reflected within minutes

---

## Required Permissions

### User Management Permissions
- `iam.users.view` - View user information
- `iam.users.create` - Create new users
- `iam.users.edit` - Modify user information
- `iam.users.delete` - Delete users

### Group Management Permissions
- `iam.groups.view` - View group information
- `iam.groups.create` - Create new groups
- `iam.groups.edit` - Modify groups and membership
- `iam.groups.delete` - Delete groups

---

## Rate Limits

- **Default Rate Limit:** 100 requests per minute per API client
- **Burst Limit:** Up to 150 requests in a 10-second window
- **Response Code for Limit Exceeded:** 429 Too Many Requests

---

## Authentication

All Identity Management API calls require OAuth 2.0 Bearer token authentication:

```bash
curl -X GET "https://global.api.greenlake.hpe.com/iam/v1/users" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Error Handling

### Common HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource successfully created
- **204 No Content** - Successful request with no response body
- **400 Bad Request** - Invalid request parameters
- **401 Unauthorized** - Missing or invalid authentication
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Service error

### Error Response Example
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": "The 'userName' field is required"
  }
}
```

---

## Related Resources

- [HPE GreenLake SCIM Documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/scim)
- [HPE GreenLake User Management](https://developer.greenlake.hpe.com/docs/greenlake/services/identity/public)
- [API Authentication Guide](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/authentication/authentication)
- [API and Event Catalog](https://developer.greenlake.hpe.com/docs/greenlake/services)
