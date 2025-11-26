# Get a list of Access Point Tunnels

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/aps/:serial-number/tunnels`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### List of access point tunnels, along with their details and associated pagination information.


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
      "tunnelName": "c2c_tunnel_01",
      "index": "Primary",
      "status": "Up",
      "encapsulationType": "IPSec",
      "tunnelId": "gw-ipsecmap.11.22.33.44~Primary",
      "id": "string",
      "type": "string",
      "destinationName": "GW2",
      "destinationMacAddress": "00:01:02:03:04:05",
      "destinationIpAddress": "11.0.0.1",
      "sourceIpAddress": "10.0.0.1",
      "lastChangeReason": "Uplink Deleted",
      "uptimeInMillis": 3600000,
      "active": true
    },
    {
      "tunnelName": "c2c_tunnel_01",
      "index": "Primary",
      "status": "Up",
      "encapsulationType": "IPSec",
      "tunnelId": "gw-ipsecmap.11.22.33.44~Primary",
      "id": "string",
      "type": "string",
      "destinationName": "GW2",
      "destinationMacAddress": "00:01:02:03:04:05",
      "destinationIpAddress": "11.0.0.1",
      "sourceIpAddress": "10.0.0.1",
      "lastChangeReason": "Uplink Deleted",
      "uptimeInMillis": 3600000,
      "active": true
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

#### List of access point tunnels, along with their details and associated pagination information.


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
      "tunnelName": "c2c_tunnel_01",
      "index": "Primary",
      "status": "Up",
      "encapsulationType": "IPSec",
      "tunnelId": "gw-ipsecmap.11.22.33.44~Primary",
      "id": "string",
      "type": "string",
      "destinationName": "GW2",
      "destinationMacAddress": "00:01:02:03:04:05",
      "destinationIpAddress": "11.0.0.1",
      "sourceIpAddress": "10.0.0.1",
      "lastChangeReason": "Uplink Deleted",
      "uptimeInMillis": 3600000,
      "active": true
    },
    {
      "tunnelName": "c2c_tunnel_01",
      "index": "Primary",
      "status": "Up",
      "encapsulationType": "IPSec",
      "tunnelId": "gw-ipsecmap.11.22.33.44~Primary",
      "id": "string",
      "type": "string",
      "destinationName": "GW2",
      "destinationMacAddress": "00:01:02:03:04:05",
      "destinationIpAddress": "11.0.0.1",
      "sourceIpAddress": "10.0.0.1",
      "lastChangeReason": "Uplink Deleted",
      "uptimeInMillis": 3600000,
      "active": true
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

