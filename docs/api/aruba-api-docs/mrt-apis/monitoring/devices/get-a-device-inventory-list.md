# Get a device inventory list

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/device-inventory`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### List of network devices, including Access Points, Switches, and Gateways from device inventory, along with their details and associated pagination information.


**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "items": [
    {
      "serialNumber": "AP00000001",
      "macAddress": "11:22:33:44:55:66",
      "deviceName": "ap_1",
      "deviceType": "ACCESS_POINT",
      "siteId": "24833497",
      "id": "AP00000001",
      "type": "network-monitoring/device-monitoring",
      "model": "AP-275",
      "partNumber": "JX973A",
      "deployment": "Standalone",
      "role": "Conductor",
      "persona": "Instant",
      "deviceFunction": "Instant",
      "softwareVersion": "8.5.2.0_59123",
      "ipv4": "198.51.100.42",
      "status": "ONLINE",
      "deviceGroupId": "string",
      "scopeId": "string",
      "isProvisioned": "YES",
      "siteName": "site_test_new",
      "deviceGroupName": "AP Persona group",
      "stackId": "07009020-c27d1b2",
      "tier": "ADVANCED_SWITCH_6300"
    },
    {
      "serialNumber": "AP00000001",
      "macAddress": "11:22:33:44:55:66",
      "deviceName": "ap_1",
      "deviceType": "ACCESS_POINT",
      "siteId": "24833497",
      "id": "AP00000001",
      "type": "network-monitoring/device-monitoring",
      "model": "AP-275",
      "partNumber": "JX973A",
      "deployment": "Standalone",
      "role": "Conductor",
      "persona": "Instant",
      "deviceFunction": "Instant",
      "softwareVersion": "8.5.2.0_59123",
      "ipv4": "198.51.100.42",
      "status": "ONLINE",
      "deviceGroupId": "string",
      "scopeId": "string",
      "isProvisioned": "YES",
      "siteName": "site_test_new",
      "deviceGroupName": "AP Persona group",
      "stackId": "07009020-c27d1b2",
      "tier": "ADVANCED_SWITCH_6300"
    }
  ],
  "count": 1,
  "next": "2",
  "total": 10
}
```
---

#### Invalid input received.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 400,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INVALID_INPUT",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 401,
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Forbidden: Access is denied.


**Status:** 403 Forbidden

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 403,
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 429,
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Internal server error.


**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 500,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INTERNAL_SERVER_ERROR",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 401,
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Forbidden: Access is denied.


**Status:** 403 Forbidden

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 403,
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Internal server error.


**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 500,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INTERNAL_SERVER_ERROR",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### List of network devices, including Access Points, Switches, and Gateways from device inventory, along with their details and associated pagination information.


**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "items": [
    {
      "serialNumber": "AP00000001",
      "macAddress": "11:22:33:44:55:66",
      "deviceName": "ap_1",
      "deviceType": "ACCESS_POINT",
      "siteId": "24833497",
      "id": "AP00000001",
      "type": "network-monitoring/device-monitoring",
      "model": "AP-275",
      "partNumber": "JX973A",
      "deployment": "Standalone",
      "role": "Conductor",
      "persona": "Instant",
      "deviceFunction": "Instant",
      "softwareVersion": "8.5.2.0_59123",
      "ipv4": "198.51.100.42",
      "status": "ONLINE",
      "deviceGroupId": "string",
      "scopeId": "string",
      "isProvisioned": "YES",
      "siteName": "site_test_new",
      "deviceGroupName": "AP Persona group",
      "stackId": "07009020-c27d1b2",
      "tier": "ADVANCED_SWITCH_6300"
    },
    {
      "serialNumber": "AP00000001",
      "macAddress": "11:22:33:44:55:66",
      "deviceName": "ap_1",
      "deviceType": "ACCESS_POINT",
      "siteId": "24833497",
      "id": "AP00000001",
      "type": "network-monitoring/device-monitoring",
      "model": "AP-275",
      "partNumber": "JX973A",
      "deployment": "Standalone",
      "role": "Conductor",
      "persona": "Instant",
      "deviceFunction": "Instant",
      "softwareVersion": "8.5.2.0_59123",
      "ipv4": "198.51.100.42",
      "status": "ONLINE",
      "deviceGroupId": "string",
      "scopeId": "string",
      "isProvisioned": "YES",
      "siteName": "site_test_new",
      "deviceGroupName": "AP Persona group",
      "stackId": "07009020-c27d1b2",
      "tier": "ADVANCED_SWITCH_6300"
    }
  ],
  "count": 1,
  "next": "2",
  "total": 10
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 429,
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Invalid input received.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 400,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INVALID_INPUT",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

