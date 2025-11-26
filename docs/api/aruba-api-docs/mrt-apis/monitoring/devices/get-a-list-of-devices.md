# Get a list of devices

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/devices`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### List of network devices, including Access Points, Switches, and Gateways, along with their details and associated pagination information.


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
      "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
      "status": "ONLINE",
      "uptimeInMillis": 1702794777,
      "lastSeenAt": "2024-03-12T07:20:50.52Z",
      "buildingId": "3bfc74ca-4473-be38-7e7a-4fd8f1a1d07b",
      "floorId": "ce2cd9bd-0c71-bfde-85ed-13cd69d2593d",
      "configStatus": "Synchronized",
      "configLastModifiedAt": "2025-03-12T07:20:50.52Z",
      "siteName": "site_test_new",
      "clusterName": "cluster 1"
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
      "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
      "status": "ONLINE",
      "uptimeInMillis": 1702794777,
      "lastSeenAt": "2024-03-12T07:20:50.52Z",
      "buildingId": "264ff6cf-f9ec-fe73-38fa-4c8a6138d933",
      "floorId": "ca420511-ea65-786a-36fb-12a65b191845",
      "configStatus": "Synchronized",
      "configLastModifiedAt": "2025-03-12T07:20:50.52Z",
      "siteName": "site_test_new",
      "clusterName": "cluster 1"
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

#### List of network devices, including Access Points, Switches, and Gateways, along with their details and associated pagination information.


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
      "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
      "status": "ONLINE",
      "uptimeInMillis": 1702794777,
      "lastSeenAt": "2024-03-12T07:20:50.52Z",
      "buildingId": "3bfc74ca-4473-be38-7e7a-4fd8f1a1d07b",
      "floorId": "ce2cd9bd-0c71-bfde-85ed-13cd69d2593d",
      "configStatus": "Synchronized",
      "configLastModifiedAt": "2025-03-12T07:20:50.52Z",
      "siteName": "site_test_new",
      "clusterName": "cluster 1"
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
      "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
      "status": "ONLINE",
      "uptimeInMillis": 1702794777,
      "lastSeenAt": "2024-03-12T07:20:50.52Z",
      "buildingId": "264ff6cf-f9ec-fe73-38fa-4c8a6138d933",
      "floorId": "ca420511-ea65-786a-36fb-12a65b191845",
      "configStatus": "Synchronized",
      "configLastModifiedAt": "2025-03-12T07:20:50.52Z",
      "siteName": "site_test_new",
      "clusterName": "cluster 1"
    }
  ],
  "count": 1,
  "next": "2",
  "total": 10
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

