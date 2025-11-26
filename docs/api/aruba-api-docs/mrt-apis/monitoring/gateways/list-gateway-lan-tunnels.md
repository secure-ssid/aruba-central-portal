# List Gateway LAN tunnels

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/gateways/:serial-number/lan-tunnels`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Object containing information about the LAN tunnels present in gateway.


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
      "id": "GW00000001",
      "type": "string",
      "tunnelName": "Tunnel_1",
      "health": "Good",
      "healthReasons": [
        "TUNNEL_STATUS",
        "TUNNEL_STATUS"
      ],
      "status": "Up",
      "encapsulation": "IPSec",
      "destinationName": "gw_1",
      "destinationSerial": "GW00000001",
      "destinationSite": "site_1",
      "sourceIpAddress": "172.51.100.42",
      "destinationIpAddress": "172.51.100.42",
      "mode": "Orchestrat",
      "ssid": "SSID_1",
      "vni": 67882
    },
    {
      "id": "GW00000001",
      "type": "string",
      "tunnelName": "Tunnel_1",
      "health": "Good",
      "healthReasons": [
        "TUNNEL_STATUS",
        "TUNNEL_STATUS"
      ],
      "status": "Up",
      "encapsulation": "vxlan",
      "destinationName": "gw_1",
      "destinationSerial": "GW00000001",
      "destinationSite": "site_1",
      "sourceIpAddress": "172.51.100.42",
      "destinationIpAddress": "172.51.100.42",
      "mode": "Orchestrat",
      "ssid": "SSID_1",
      "vni": 67882
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

#### Not Found error

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 404,
  "errorCode": "HPE_GL_ERROR_NOT_FOUND",
  "message": "Not Found",
  "debugId": "abc-123-456"
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

#### Object containing information about the LAN tunnels present in gateway.


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
      "id": "GW00000001",
      "type": "string",
      "tunnelName": "Tunnel_1",
      "health": "Good",
      "healthReasons": [
        "TUNNEL_STATUS",
        "TUNNEL_STATUS"
      ],
      "status": "Up",
      "encapsulation": "IPSec",
      "destinationName": "gw_1",
      "destinationSerial": "GW00000001",
      "destinationSite": "site_1",
      "sourceIpAddress": "172.51.100.42",
      "destinationIpAddress": "172.51.100.42",
      "mode": "Orchestrat",
      "ssid": "SSID_1",
      "vni": 67882
    },
    {
      "id": "GW00000001",
      "type": "string",
      "tunnelName": "Tunnel_1",
      "health": "Good",
      "healthReasons": [
        "TUNNEL_STATUS",
        "TUNNEL_STATUS"
      ],
      "status": "Up",
      "encapsulation": "vxlan",
      "destinationName": "gw_1",
      "destinationSerial": "GW00000001",
      "destinationSite": "site_1",
      "sourceIpAddress": "172.51.100.42",
      "destinationIpAddress": "172.51.100.42",
      "mode": "Orchestrat",
      "ssid": "SSID_1",
      "vni": 67882
    }
  ],
  "count": 1,
  "next": "2",
  "total": 10
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

#### Not Found error

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 404,
  "errorCode": "HPE_GL_ERROR_NOT_FOUND",
  "message": "Not Found",
  "debugId": "abc-123-456"
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

