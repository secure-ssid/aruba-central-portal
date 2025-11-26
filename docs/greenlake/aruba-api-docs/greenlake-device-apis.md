# HPE GreenLake Device Management APIs

## Overview

The HPE GreenLake Device Management APIs enable programmatic management of device inventory, device onboarding, and subscription assignment. With these APIs, you can invoke any operation or task that is available through the HPE GreenLake user interface.

**API Endpoint Base:** `https://global.api.greenlake.hpe.com/`

**Documentation:**
- [Device Management Guide](https://developer.greenlake.hpe.com/docs/greenlake/services/device-management/public/guide/)
- [Device Management API Reference](https://developer.greenlake.hpe.com/docs/greenlake/services/device-management/public/openapi/nbapi-inventory-latest/overview/)

---

## Device Inventory API

### Overview
The Device Inventory API provides comprehensive device management capabilities including viewing, managing, and onboarding devices in your HPE GreenLake workspace.

### Supported Operations

#### List Devices in Workspace
- **HTTP Method:** `GET`
- **Endpoint:** `/device-management/v1/devices`
- **Query Parameters:**
  - `workspace-id` - Filter devices by workspace ID (required in multi-workspace context)
  - `limit` - Number of results to return (optional, default: 50, max: 1000)
  - `offset` - Pagination offset (optional, default: 0)
  - `filter` - Advanced filtering criteria (optional)
  - `sort` - Sort order (optional, e.g., "name:asc")
- **Description:** Retrieve list of devices managed in a workspace
- **Required Permissions:** `ccs.device-management.view`
- **Rate Limit:** 160 requests per minute per workspace

#### Get Device Details
- **HTTP Method:** `GET`
- **Endpoint:** `/device-management/v1/devices/{deviceId}`
- **Description:** Retrieve detailed information about a specific device
- **Required Permissions:** `ccs.device-management.view`
- **Rate Limit:** 40 requests per minute per workspace

#### Add Devices to Workspace
- **HTTP Method:** `POST`
- **Endpoint:** `/device-management/v1/devices`
- **Description:** Add one or more devices to a workspace (asynchronous operation)
- **Required Permissions:** `ccs.device-management.edit`
- **Rate Limit:** 25 requests per minute per workspace
- **Response Code:** 202 Accepted (asynchronous response)

#### Update Device
- **HTTP Method:** `PATCH`
- **Endpoint:** `/device-management/v1/devices/{deviceId}`
- **Description:** Update device configuration or settings
- **Required Permissions:** `ccs.device-management.edit`
- **Rate Limit:** 40 requests per minute per workspace

#### Delete Device
- **HTTP Method:** `DELETE`
- **Endpoint:** `/device-management/v1/devices/{deviceId}`
- **Description:** Remove a device from a workspace
- **Required Permissions:** `ccs.device-management.delete`
- **Rate Limit:** 25 requests per minute per workspace

### Request/Response Examples

#### List Devices Request
```bash
curl -X GET "https://global.api.greenlake.hpe.com/device-management/v1/devices?workspace-id=workspace-001&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

#### List Devices Response (200 OK)
```json
{
  "items": [
    {
      "id": "device-001",
      "name": "Switch-A1",
      "serial": "SN123456789",
      "type": "switch",
      "model": "Aruba 6300",
      "status": "active",
      "workspace_id": "workspace-001",
      "subscriptions": [
        {
          "id": "sub-001",
          "name": "Aruba Central",
          "status": "active",
          "start_date": "2024-01-01T00:00:00Z",
          "end_date": "2025-01-01T00:00:00Z"
        }
      ],
      "created_at": "2024-01-15T10:00:00Z",
      "modified_at": "2024-01-20T15:30:00Z"
    },
    {
      "id": "device-002",
      "name": "Switch-B2",
      "serial": "SN987654321",
      "type": "switch",
      "model": "Aruba 6400",
      "status": "active",
      "workspace_id": "workspace-001",
      "subscriptions": [],
      "created_at": "2024-01-16T08:30:00Z",
      "modified_at": "2024-01-20T12:00:00Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0,
  "page": 1
}
```

#### Get Device Details Request
```bash
curl -X GET "https://global.api.greenlake.hpe.com/device-management/v1/devices/device-001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get Device Details Response (200 OK)
```json
{
  "id": "device-001",
  "name": "Switch-A1",
  "serial": "SN123456789",
  "type": "switch",
  "model": "Aruba 6300",
  "status": "active",
  "workspace_id": "workspace-001",
  "hardware_version": "v1.2.3",
  "firmware_version": "10.1.4100",
  "ip_address": "192.168.1.10",
  "mac_address": "00:11:22:33:44:55",
  "location": "Data Center Floor 1",
  "subscriptions": [
    {
      "id": "sub-001",
      "name": "Aruba Central",
      "status": "active",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2025-01-01T00:00:00Z",
      "license_type": "perpetual"
    }
  ],
  "tags": ["production", "critical"],
  "created_at": "2024-01-15T10:00:00Z",
  "modified_at": "2024-01-20T15:30:00Z",
  "created_by": "admin@example.com",
  "modified_by": "admin@example.com"
}
```

#### Add Devices Request
```bash
curl -X POST "https://global.api.greenlake.hpe.com/device-management/v1/devices" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "workspace-001",
    "devices": [
      {
        "serial": "SN123456789",
        "name": "Switch-A1",
        "type": "switch",
        "model": "Aruba 6300",
        "location": "Data Center Floor 1",
        "tags": ["production"]
      },
      {
        "serial": "SN987654321",
        "name": "Switch-B2",
        "type": "switch",
        "model": "Aruba 6400",
        "location": "Data Center Floor 2",
        "tags": ["backup"]
      }
    ]
  }'
```

#### Add Devices Response (202 Accepted)
```json
{
  "task_id": "task-12345",
  "status": "pending",
  "message": "Device addition task created successfully",
  "created_devices": 0,
  "failed_devices": 0,
  "location": "https://global.api.greenlake.hpe.com/device-management/v1/tasks/task-12345"
}
```

#### Update Device Request
```bash
curl -X PATCH "https://global.api.greenlake.hpe.com/device-management/v1/devices/device-001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Switch-A1-Updated",
    "location": "Data Center Floor 2",
    "tags": ["production", "critical", "monitored"]
  }'
```

#### Update Device Response (200 OK)
```json
{
  "id": "device-001",
  "name": "Switch-A1-Updated",
  "serial": "SN123456789",
  "type": "switch",
  "status": "active",
  "location": "Data Center Floor 2",
  "tags": ["production", "critical", "monitored"],
  "modified_at": "2024-01-21T10:15:00Z"
}
```

#### Delete Device Request
```bash
curl -X DELETE "https://global.api.greenlake.hpe.com/device-management/v1/devices/device-001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Delete Device Response (204 No Content)
```
(Empty response body on success)
```

---

## Device Subscription API

### Overview
The Device Subscription API enables management of software subscriptions and entitlements assigned to devices. Subscriptions provide access to services and features for managed devices.

**Documentation:** https://developer.greenlake.hpe.com/docs/greenlake/services/subscription-management/public/

### Supported Operations

#### Get Device Subscriptions
- **HTTP Method:** `GET`
- **Endpoint:** `/subscription-management/v1/subscriptions`
- **Query Parameters:**
  - `device-id` - Filter by specific device (optional)
  - `workspace-id` - Filter by workspace (optional)
  - `status` - Filter by status: active, expired, expiring (optional)
  - `limit` - Number of results (optional)
  - `offset` - Pagination offset (optional)
- **Description:** List subscriptions in workspace or for specific device
- **Required Permissions:** `ccs.subscription-management.view`

#### Get Subscription Details
- **HTTP Method:** `GET`
- **Endpoint:** `/subscription-management/v1/subscriptions/{subscriptionId}`
- **Description:** Retrieve detailed information about a specific subscription
- **Required Permissions:** `ccs.subscription-management.view`

#### Add Subscriptions
- **HTTP Method:** `POST`
- **Endpoint:** `/subscription-management/v1/subscriptions`
- **Description:** Add subscriptions to devices (asynchronous operation)
- **Required Permissions:** `ccs.subscription-management.edit`, `ccs.device-management.edit`
- **Response Code:** 202 Accepted (asynchronous response)

#### Update Subscriptions
- **HTTP Method:** `PATCH`
- **Endpoint:** `/subscription-management/v1/subscriptions`
- **Description:** Update subscription settings (e.g., add/remove tags)
- **Required Permissions:** `ccs.subscription-management.edit`
- **Limitations:**
  - Only one operation per API call (cannot assign devices and assign subscriptions in same call)
  - Currently supports adding/removing tags only

#### Assign Subscriptions to Devices
- **HTTP Method:** `POST`
- **Endpoint:** `/subscription-management/v1/devices/{deviceId}/subscriptions`
- **Description:** Assign subscriptions to a specific device
- **Required Permissions:** `ccs.device-management.edit`, `ccs.subscription-management.edit`

#### Remove Subscriptions from Device
- **HTTP Method:** `DELETE`
- **Endpoint:** `/subscription-management/v1/devices/{deviceId}/subscriptions/{subscriptionId}`
- **Description:** Remove a subscription from a device
- **Required Permissions:** `ccs.device-management.edit`, `ccs.subscription-management.edit`

### Request/Response Examples

#### List Subscriptions Request
```bash
curl -X GET "https://global.api.greenlake.hpe.com/subscription-management/v1/subscriptions?workspace-id=workspace-001&status=active" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### List Subscriptions Response (200 OK)
```json
{
  "items": [
    {
      "id": "sub-001",
      "name": "Aruba Central",
      "type": "central-management",
      "status": "active",
      "devices": ["device-001", "device-002"],
      "device_count": 2,
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2025-01-01T00:00:00Z",
      "days_remaining": 315,
      "license_type": "perpetual",
      "created_at": "2024-01-01T00:00:00Z",
      "modified_at": "2024-01-20T10:00:00Z"
    },
    {
      "id": "sub-002",
      "name": "Networking Analytics",
      "type": "analytics",
      "status": "expiring",
      "devices": ["device-003"],
      "device_count": 1,
      "start_date": "2024-06-01T00:00:00Z",
      "end_date": "2024-12-01T00:00:00Z",
      "days_remaining": 30,
      "license_type": "annual",
      "created_at": "2024-06-01T00:00:00Z",
      "modified_at": "2024-10-15T14:00:00Z"
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}
```

#### Add Subscriptions Request
```bash
curl -X POST "https://global.api.greenlake.hpe.com/subscription-management/v1/subscriptions" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "workspace-001",
    "subscriptions": [
      {
        "license_key": "LIC-KEY-12345",
        "name": "Aruba Central",
        "type": "central-management",
        "quantity": 10
      }
    ]
  }'
```

#### Add Subscriptions Response (202 Accepted)
```json
{
  "task_id": "task-67890",
  "status": "pending",
  "message": "Subscription addition task created successfully",
  "location": "https://global.api.greenlake.hpe.com/subscription-management/v1/tasks/task-67890"
}
```

#### Assign Subscriptions to Device Request
```bash
curl -X POST "https://global.api.greenlake.hpe.com/subscription-management/v1/devices/device-001/subscriptions" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptions": [
      {
        "id": "sub-001",
        "quantity": 1
      }
    ]
  }'
```

#### Assign Subscriptions to Device Response (200 OK)
```json
{
  "device_id": "device-001",
  "subscriptions": [
    {
      "id": "sub-001",
      "name": "Aruba Central",
      "assigned_quantity": 1,
      "status": "active"
    }
  ]
}
```

#### Update Subscriptions (Add Tags) Request
```bash
curl -X PATCH "https://global.api.greenlake.hpe.com/subscription-management/v1/subscriptions" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "workspace-001",
    "subscriptions": [
      {
        "id": "sub-001",
        "tags": ["production", "critical"]
      }
    ]
  }'
```

#### Update Subscriptions Response (200 OK)
```json
{
  "updated_count": 1,
  "subscriptions": [
    {
      "id": "sub-001",
      "name": "Aruba Central",
      "tags": ["production", "critical"],
      "modified_at": "2024-01-21T11:30:00Z"
    }
  ]
}
```

---

## Device Status Tracking

### Device Status Values
- **active** - Device is online and managed
- **inactive** - Device is offline or not responding
- **unmanaged** - Device added but not yet activated
- **retired** - Device has been decommissioned
- **error** - Device encountered an error state

### Subscription Status Values
- **active** - Subscription is current and valid
- **expiring** - Subscription expires within 30 days
- **expired** - Subscription has passed end date
- **inactive** - Subscription is not currently assigned
- **suspended** - Subscription is temporarily suspended

---

## Asynchronous Operations

### Task Polling

For asynchronous operations (Add Devices, Add Subscriptions), use the task ID from the response to poll for status:

```bash
curl -X GET "https://global.api.greenlake.hpe.com/device-management/v1/tasks/{taskId}" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Task Status Response
```json
{
  "task_id": "task-12345",
  "status": "completed",
  "message": "Operation completed successfully",
  "created_devices": 2,
  "failed_devices": 0,
  "results": [
    {
      "serial": "SN123456789",
      "status": "created",
      "device_id": "device-001"
    },
    {
      "serial": "SN987654321",
      "status": "created",
      "device_id": "device-002"
    }
  ],
  "created_at": "2024-01-21T09:00:00Z",
  "completed_at": "2024-01-21T09:02:30Z"
}
```

---

## Device Filtering

### Filter Syntax
The `filter` parameter supports complex filtering:

```
GET /device-management/v1/devices?filter=status:active AND model:"Aruba 6300" AND tags:production
```

### Supported Filter Fields
- `status` - Device status
- `type` - Device type (switch, access-point, etc.)
- `model` - Device model
- `name` - Device name
- `serial` - Serial number
- `tags` - Device tags
- `location` - Device location
- `created_at` - Creation date
- `modified_at` - Last modification date

---

## Rate Limits

### Device Operations
- **List Devices:** 160 requests/minute per workspace
- **Get Device Details:** 40 requests/minute per workspace
- **Add Devices:** 25 requests/minute per workspace
- **Update Device:** 40 requests/minute per workspace
- **Delete Device:** 25 requests/minute per workspace

### Subscription Operations
- **List Subscriptions:** 100 requests/minute per workspace
- **Add Subscriptions:** 25 requests/minute per workspace
- **Update Subscriptions:** 50 requests/minute per workspace

### Rate Limit Response
When rate limit is exceeded, the API returns HTTP 429:
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 60
  }
}
```

---

## Error Handling

### Common HTTP Status Codes
- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **202 Accepted** - Asynchronous operation accepted
- **204 No Content** - Successful deletion
- **400 Bad Request** - Invalid parameters
- **401 Unauthorized** - Missing/invalid authentication
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Device not found
- **409 Conflict** - Device already exists
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Service error

### Error Response Example
```json
{
  "error": {
    "code": "INVALID_DEVICE_SERIAL",
    "message": "Device with serial SN123456789 is already managed",
    "details": "Device cannot be added twice to the same workspace"
  }
}
```

---

## Best Practices

### Device Management Best Practices
1. Use meaningful device names for easy identification
2. Apply appropriate tags for organization
3. Monitor device status regularly
4. Keep firmware updated
5. Document device locations

### Subscription Management Best Practices
1. Verify subscription availability before assignment
2. Track subscription expiration dates
3. Automate subscription renewal processes
4. Monitor subscription utilization
5. Review unused subscriptions regularly

### API Usage Best Practices
1. Batch operations when possible
2. Use pagination for large result sets
3. Implement exponential backoff for retries
4. Cache static device information
5. Monitor rate limit headers

---

## Related Resources

- [Device Management Guide](https://developer.greenlake.hpe.com/docs/greenlake/services/device-management/public/guide/)
- [Device Management API Reference](https://developer.greenlake.hpe.com/docs/greenlake/services/device-management/public/openapi/nbapi-inventory-latest/overview/)
- [Subscription Management Guide](https://developer.greenlake.hpe.com/docs/greenlake/services/subscription-management/public/guide/)
- [Subscription Management API Reference](https://developer.greenlake.hpe.com/docs/greenlake/services/subscription-management/public/openapi/nbapi-subscription-latest/overview/)
- [API Authentication Guide](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/authentication/authentication)
