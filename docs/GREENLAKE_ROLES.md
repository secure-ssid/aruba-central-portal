# HPE GreenLake Role Architecture

## Overview

The Aruba Central Portal integrates with a **two-tier role system** that combines HPE GreenLake platform roles with Aruba Central service roles. Understanding this architecture is critical for proper user access management.

---

## Two-Tier Role System

```
┌─────────────────────────────────────────────────────────────┐
│                    HPE GREENLAKE PLATFORM                   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ TIER 1: Platform Roles (Infrastructure Access)        │ │
│  │                                                       │ │
│  │  Controls: Workspaces, Users, Devices, Subscriptions │ │
│  │  Roles:    Administrator, Operator, Observer          │ │
│  │  Managed:  HPE GreenLake IAM & SCIM APIs              │ │
│  └───────────────────────────────────────────────────────┘ │
│                            │                                │
│                            │                                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ TIER 2: Service Roles (Application Access)           │ │
│  │                                                       │ │
│  │  Service:  Aruba Central Network Management          │ │
│  │  Controls: Networks, APs, Switches, Clients, Sites   │ │
│  │  Roles:    Aruba Central Admin, Workspace Admin, etc │ │
│  │  Managed:  Aruba Central RBAC APIs                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Tier 1: HPE GreenLake Platform Roles

Platform roles control access to **HPE GreenLake infrastructure resources** across all services.

### Available Platform Roles

| Role | Permissions | Use Case |
|------|-------------|----------|
| **Administrator** | View, Edit, Delete | Full platform management - can manage workspaces, users, subscriptions, devices |
| **Operator** | View, Edit | Day-to-day operations - can configure but not delete critical resources |
| **Observer** | View only | Read-only access - monitoring, reporting, auditing |

### Platform Role Capabilities

**Administrator** can:
- Create, update, delete workspaces (tenants)
- Invite, modify, remove users
- Assign platform and service roles to users
- Manage device inventory
- Subscribe devices to services
- Transfer subscriptions between tenants (MSP)
- View all audit logs and activity

**Operator** can:
- View all platform resources
- Modify workspace settings
- Update user information
- Reassign devices
- Cannot delete workspaces or users

**Observer** can:
- View workspaces, users, devices, subscriptions
- Export reports
- Cannot make any modifications

### Platform Role Assignment

Platform roles are assigned via:
- **API:** HPE GreenLake IAM API (`/authorization/v1/role-assignments`)
- **UI:** GLRolesPage (new page created in this update)
- **SCIM:** SCIM Groups API (`/identity/v2beta1/scim/v2/Groups`)

---

## Tier 2: Aruba Central Service Roles

Service roles control access to **Aruba Central network management features** within a workspace.

### Available Service Roles

| Application | Role Name | Scope | Permissions |
|-------------|-----------|-------|-------------|
| `nms` | Aruba Central Administrator | allgroups, allsites, alllabels | Full network management access |
| `account_setting` | Workspace Administrator | allgroups | Account/workspace configuration |
| `monitoring` | Network Monitor | selected groups | Read-only network monitoring |
| `guest` | Guest Manager | specific sites | Guest WiFi management only |

### Service Role Capabilities

**Aruba Central Administrator** (`nms` application):
- Full access to network configuration
- Manage APs, switches, gateways, controllers
- Configure WLANs, VLANs, firewall rules
- View and configure all groups, sites, labels
- Troubleshooting tools and diagnostics

**Workspace Administrator** (`account_setting` application):
- Manage workspace settings
- Configure authentication (SSO, RADIUS)
- API client management
- Subscription and license management
- Cannot modify network devices directly

### Service Role Assignment

Service roles are assigned via:
- **API:** Aruba Central RBAC API (`/platform/rbac/v1/roles`)
- **UI:** UsersPage and GLUsersPage (enhanced)
- **Scope:** Can be restricted to specific groups, sites, or labels

---

## How the Two Tiers Work Together

### Required Roles for Full Access

A user needs **BOTH** a platform role and a service role to fully use Aruba Central:

```
User Access Flow:
┌─────────────────────────────────────────────────────────────┐
│ 1. Platform Role Check                                       │
│    Does user have GreenLake platform role?                   │
│    └─> NO  → Access Denied (cannot enter workspace)          │
│    └─> YES → Proceed to Step 2                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Service Role Check                                        │
│    Does user have Aruba Central service role?                │
│    └─> NO  → Limited Access (can view workspace, no network) │
│    └─> YES → Full Access (can manage network)                │
└─────────────────────────────────────────────────────────────┘
```

### Example User Configurations

**Example 1: Network Administrator**
- Platform Role: **Administrator**
- Service Role: **Aruba Central Administrator (nms)**
- Capabilities:
  - ✅ Manage workspaces, users, devices
  - ✅ Full network configuration access
  - ✅ Assign roles to other users
  - ✅ Subscribe devices to Aruba Central

**Example 2: Network Operator**
- Platform Role: **Operator**
- Service Role: **Aruba Central Administrator (nms)**
- Capabilities:
  - ✅ Full network configuration access
  - ✅ Modify workspace settings
  - ❌ Cannot delete workspaces
  - ❌ Cannot remove users

**Example 3: Workspace Manager (No Network Access)**
- Platform Role: **Administrator**
- Service Role: **Workspace Administrator (account_setting)**
- Capabilities:
  - ✅ Manage workspaces, users, devices
  - ✅ Configure SSO, API clients
  - ❌ Cannot configure network devices
  - ❌ Cannot access network monitoring

**Example 4: Read-Only Auditor**
- Platform Role: **Observer**
- Service Role: **Network Monitor (monitoring)**
- Capabilities:
  - ✅ View all platform resources
  - ✅ View network status and health
  - ✅ Export reports
  - ❌ Cannot modify anything

---

## MSP Multi-Tenant Considerations

### Workspace Isolation

In MSP (Managed Service Provider) environments:
- Each customer gets their own **workspace** (tenant)
- Roles are scoped **per workspace**
- A user can have different roles in different workspaces

**Example:**
```
User: john@msp.com

Workspace "Customer A":
  Platform Role: Administrator
  Service Role: Aruba Central Administrator

Workspace "Customer B":
  Platform Role: Observer
  Service Role: Network Monitor

Workspace "Customer C":
  No access (not assigned to this workspace)
```

### Token Exchange for MSP

When an MSP technician switches between customer workspaces:
1. **Platform authentication** remains the same (MSP account)
2. **Access token is exchanged** for the target workspace
3. **Roles are re-evaluated** for the new workspace context
4. **API calls** automatically target the new workspace

This is handled by the MSP Token Transfer functionality (see GLWorkspacesPage).

---

## Role Assignment Best Practices

### 1. Principle of Least Privilege
- Assign the minimum role required for the job
- Use Observer role for monitoring-only users
- Reserve Administrator role for senior staff

### 2. Separate Duties
- Network configuration: Aruba Central Administrator
- User management: Platform Administrator
- Monitoring & reporting: Observer + Network Monitor
- Guest WiFi management: Guest Manager only

### 3. Regular Audits
- Review role assignments quarterly
- Remove access for departed employees immediately
- Audit logs available via HPE GreenLake Console

### 4. Service Accounts
- API clients should have minimal required roles
- Use Operator instead of Administrator when possible
- Rotate credentials regularly

---

## API Reference

### Platform Role APIs (HPE GreenLake)

**List Platform Roles:**
```bash
GET /authorization/v1/roles
Authorization: Bearer {access_token}
```

**Assign Platform Role to User:**
```bash
POST /authorization/v1/role-assignments
Content-Type: application/json

{
  "userId": "user@example.com",
  "roleId": "greenlake_administrator",
  "scope": {
    "workspaceId": "workspace-123"
  }
}
```

**Get User's Platform Roles:**
```bash
GET /authorization/v1/users/{userId}/role-assignments
Authorization: Bearer {access_token}
```

### Service Role APIs (Aruba Central)

**List Aruba Central Roles:**
```bash
GET /platform/rbac/v1/roles
Authorization: Bearer {access_token}
```

**Get User's Service Roles:**
```bash
GET /platform/rbac/v1/users/{username}
Authorization: Bearer {access_token}
```

**Response Example:**
```json
{
  "applications": [
    {
      "name": "nms",
      "info": [{
        "role": "Aruba Central Administrator",
        "scope": {
          "groups": ["allgroups"],
          "sites": ["allsites"],
          "labels": ["alllabels"]
        }
      }]
    },
    {
      "name": "account_setting",
      "info": [{
        "role": "Workspace Administrator",
        "scope": {
          "groups": ["allgroups"]
        }
      }]
    }
  ]
}
```

---

## UI Implementation

### Pages for Role Management

**GLRolesPage** (NEW):
- View all available platform roles
- See role descriptions and permissions
- Assign platform roles to users
- Distinction from Aruba Central service roles

**GLUsersPage** (ENHANCED):
- Shows **both** platform and service roles for each user
- Two-column layout: Platform Roles | Service Roles
- Click user to see detailed role assignments
- Edit button to modify either tier of roles

**UsersPage** (EXISTING):
- Focused on Aruba Central service role management
- SCIM-based user provisioning
- Group membership (maps to roles)

---

## Troubleshooting

### User Cannot Access Aruba Central

**Symptom:** User can log in to HPE GreenLake but sees no network devices

**Diagnosis:**
1. Check platform role: `GET /authorization/v1/users/{userId}/role-assignments`
   - If no role: Assign Observer or higher
2. Check service role: `GET /platform/rbac/v1/users/{username}`
   - If no `nms` application role: Assign Aruba Central Administrator

### User Can View But Not Edit

**Symptom:** User can see devices but gets permission errors when trying to configure

**Diagnosis:**
1. Check platform role: Likely **Observer** (view-only)
   - Solution: Upgrade to Operator or Administrator
2. Check service role: Likely **Network Monitor** (view-only)
   - Solution: Assign Aruba Central Administrator role

### MSP Cannot Switch Between Tenants

**Symptom:** Workspace switching fails or shows "Access Denied"

**Diagnosis:**
1. Check token exchange implementation in backend
2. Verify user has role assignment in target workspace
3. Check GreenLake client credentials are configured
4. Review workspace switching logs in backend

**Fix:** Ensure `GL_RBAC_CLIENT_ID` and `GL_RBAC_CLIENT_SECRET` are set in environment

---

## Migration from Single-Tier to Two-Tier

If you were previously using only Aruba Central RBAC:

### Before (Single Tier):
```
User john@example.com:
  - Aruba Central Administrator (nms)
  - Full access to everything
```

### After (Two Tier):
```
User john@example.com:
  Platform:
    - Role: Administrator
    - Scope: All workspaces
  Service:
    - Application: nms
    - Role: Aruba Central Administrator
    - Scope: allgroups, allsites, alllabels
```

### Migration Steps:
1. Audit existing Aruba Central users
2. Assign appropriate platform roles (default: Operator)
3. Retain existing service role assignments
4. Test access for each user
5. Update documentation and training materials

---

## Related Documentation

- [ROLES_AND_PERMISSIONS.md](./ROLES_AND_PERMISSIONS.md) - Aruba Central RBAC details
- [/aruba-api-docs/greenlake-authorization-apis.md](../aruba-api-docs/greenlake-authorization-apis.md) - Platform role API reference
- [/aruba-api-docs/greenlake-identity-apis.md](../aruba-api-docs/greenlake-identity-apis.md) - SCIM user/group management
- [/aruba-api-docs/greenlake-workspace-apis.md](../aruba-api-docs/greenlake-workspace-apis.md) - MSP tenant management

---

## Summary

✅ **Platform roles** control access to GreenLake infrastructure (workspaces, users, devices)
✅ **Service roles** control access within Aruba Central (network configuration)
✅ **Both are required** for full functionality
✅ **Scope independently** - platform role per workspace, service role per group/site
✅ **MSP support** - different roles in different customer workspaces

For questions or issues, refer to the API documentation or contact HPE support.
