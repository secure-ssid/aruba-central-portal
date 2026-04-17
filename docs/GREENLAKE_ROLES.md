# Roles and Permissions

Aruba Central uses a **two-tier role system** when fronted by HPE GreenLake:

- **Tier 1 — Platform roles** control GreenLake infrastructure (workspaces, users, devices, subscriptions).
- **Tier 2 — Service roles** control what a user can do *inside* Aruba Central (networks, APs, switches, sites).

A user needs a role in both tiers to fully use the portal.

```
┌─────────────────────────────────────────────────────────────┐
│ HPE GreenLake                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Tier 1 — Platform Roles                                 │ │
│ │   Administrator / Operator / Observer                   │ │
│ │   Scope: workspaces, users, devices, subscriptions      │ │
│ │   APIs: /authorization/v1/*, /identity/v2beta1/scim/v2/*│ │
│ └─────────────────────────────────────────────────────────┘ │
│                          │                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Tier 2 — Aruba Central Service Roles                    │ │
│ │   Aruba Central Admin / Workspace Admin / Monitor / ... │ │
│ │   Scope: networks, APs, switches, sites, labels         │ │
│ │   APIs: /platform/rbac/v1/*                             │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Tier 1 — Platform Roles

| Role          | Permissions           | Typical user                              |
|---------------|-----------------------|-------------------------------------------|
| Administrator | View / Edit / Delete  | Full platform management                  |
| Operator      | View / Edit           | Day-to-day operations, no destructive ops |
| Observer      | View only             | Monitoring, reporting, auditing           |

**Administrator** can create/delete workspaces, invite and remove users, assign roles, move devices, transfer subscriptions, view audit logs.

**Operator** can modify workspace settings and user info, reassign devices — but can't delete workspaces or users.

**Observer** is read-only across all platform resources, including report export.

### Assigning Platform Roles

- **API:** `POST /authorization/v1/role-assignments`
- **UI:** `/gl/roles` (GLRolesPage)
- **SCIM:** `/identity/v2beta1/scim/v2/Groups`

Requires `GL_RBAC_CLIENT_ID` / `GL_RBAC_CLIENT_SECRET` in the environment.

---

## Tier 2 — Aruba Central Service Roles

Service roles are scoped by **application**, **groups**, **sites**, and **labels** inside a workspace.

| Application       | Role                        | Scope                            | What it grants                         |
|-------------------|-----------------------------|----------------------------------|----------------------------------------|
| `nms`             | Aruba Central Administrator | allgroups / allsites / alllabels | Full network configuration             |
| `account_setting` | Workspace Administrator     | allgroups                        | Account / workspace configuration      |
| `monitoring`      | Network Monitor             | selected groups                  | Read-only monitoring                   |
| `guest`           | Guest Manager               | specific sites                   | Guest WiFi management                  |

**Aruba Central Administrator** (`nms`) manages APs, switches, gateways, controllers, WLANs, VLANs, and firewall rules, plus troubleshooting tools — across every group/site/label in the workspace.

**Workspace Administrator** (`account_setting`) manages SSO, RADIUS, API clients, subscriptions, and licensing. Cannot touch network devices.

### Scope Values

- Groups: `allgroups` or explicit list of group IDs
- Sites: `allsites` or explicit list of site IDs
- Labels: `alllabels` or explicit list of label IDs

### Assigning Service Roles

- **API:** `/platform/rbac/v1/users/{username}` (see [API Reference](#api-reference))
- **UI:** `/users` (UsersPage), `/gl/users` (GLUsersPage)

---

## Example Role Combinations

| User type             | Platform       | Service                       | Can do                                                |
|-----------------------|----------------|-------------------------------|-------------------------------------------------------|
| Network admin         | Administrator  | Aruba Central Administrator   | Everything                                            |
| Network operator      | Operator       | Aruba Central Administrator   | All network config; cannot delete workspaces / users  |
| Workspace manager     | Administrator  | Workspace Administrator       | Manage users/workspace/SSO; no network config         |
| Read-only auditor     | Observer       | Network Monitor               | View-only everywhere; export reports                  |
| Limited ops           | Operator       | `nms` with specific groups    | Manage only assigned groups/sites                     |

---

## MSP / Multi-Tenant

In MSP deployments each customer gets their own workspace, and a user can have **different** roles in different workspaces.

```
john@msp.com
  Workspace Customer-A  →  Platform: Administrator | Service: Aruba Central Administrator
  Workspace Customer-B  →  Platform: Observer      | Service: Network Monitor
  Workspace Customer-C  →  (no access)
```

When an MSP user switches workspaces the access token is **exchanged** for the target workspace, roles are re-evaluated, and all subsequent API calls target the new tenant. The portal implements this in `GLWorkspacesPage` via the GreenLake token-exchange endpoint.

---

## Assignment Example (JSON)

**Full admin:**

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
        "scope": {"groups": ["allgroups"]}
      }]
    }
  ]
}
```

**Scoped operator:**

```json
{
  "applications": [
    {
      "name": "nms",
      "info": [{
        "role": "Network Operations",
        "scope": {
          "groups": ["group1", "group2"],
          "sites": ["site-sfo"],
          "labels": []
        }
      }]
    }
  ]
}
```

---

## API Reference

### Platform (GreenLake IAM)

```http
GET    /authorization/v1/roles
POST   /authorization/v1/role-assignments
GET    /authorization/v1/users/{userId}/role-assignments
```

```http
POST /authorization/v1/role-assignments
{
  "userId": "user@example.com",
  "roleId": "greenlake_administrator",
  "scope": {"workspaceId": "workspace-123"}
}
```

### Service (Aruba Central RBAC)

```http
GET    /platform/rbac/v1/roles
GET    /platform/rbac/v1/users
GET    /platform/rbac/v1/users/{username}
POST   /platform/rbac/v1/users
PATCH  /platform/rbac/v1/users/{username}
DELETE /platform/rbac/v1/users/{username}
```

Pagination uses `limit` and `offset`.

---

## UI Pages

| Page                | Purpose                                                                 |
|---------------------|-------------------------------------------------------------------------|
| `/users`            | Aruba Central service role management (SCIM + group membership)         |
| `/gl/users`         | Combined view of platform + service roles per user                      |
| `/gl/roles`         | Browse and assign platform roles                                        |
| `/gl/workspaces`    | Switch between workspaces in MSP setups                                 |
| `/gl/permissions`   | Platform permission catalogue                                           |

---

## Best Practices

- **Least privilege** — start users at Observer / Monitor; escalate only when needed.
- **Separate duties** — don't hand out both platform Administrator *and* service Administrator unless the user truly needs both.
- **Scope by group/site** — full-workspace scope is rarely necessary.
- **Service accounts** — dedicated identities for automation with the minimum role required; rotate secrets.
- **Audit quarterly** — review `/authorization/v1/users/*/role-assignments` and remove departed employees.

---

## Troubleshooting

**User can sign in but sees no devices**
1. `GET /authorization/v1/users/{userId}/role-assignments` — assign Observer or higher if empty.
2. `GET /platform/rbac/v1/users/{username}` — assign an `nms` service role if empty.

**User can view but not edit**
- Platform role is likely Observer → upgrade to Operator/Administrator.
- Service role is likely Network Monitor → assign Aruba Central Administrator.

**MSP workspace switching fails**
- Confirm `GL_RBAC_CLIENT_ID` / `GL_RBAC_CLIENT_SECRET` are set.
- Check that the user has a role in the target workspace.
- Run `./tools/diagnose-greenlake.sh` for end-to-end diagnostics.

---

## Related

- [greenlake/aruba-api-docs/greenlake-authorization-apis.md](greenlake/aruba-api-docs/greenlake-authorization-apis.md) — platform role API
- [greenlake/aruba-api-docs/greenlake-identity-apis.md](greenlake/aruba-api-docs/greenlake-identity-apis.md) — SCIM users and groups
- [greenlake/aruba-api-docs/greenlake-workspace-apis.md](greenlake/aruba-api-docs/greenlake-workspace-apis.md) — MSP workspaces
- [USER_MANAGEMENT_GUIDE.md](USER_MANAGEMENT_GUIDE.md) — script-based user management
