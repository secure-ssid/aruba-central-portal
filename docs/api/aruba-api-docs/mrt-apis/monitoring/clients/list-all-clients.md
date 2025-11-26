# List all clients

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/clients?site-id=site1`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| site-id | site1 | The ID of the site from which the clients are to be retrieved.
 |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Response schema for listing clients

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
      "name": "Client1",
      "experience": "Good",
      "status": "Connected",
      "statusReason": "GOOD_PERFORMANCE",
      "type": "Wireless",
      "mac": "05:50:35:a1:a0:01",
      "ipv4": "129.110.213.218",
      "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
      "connectedDeviceSerial": "DTXC000001",
      "connectedTo": "Aruba-2930F-12G-PoEP-2G-2SFPP",
      "lastSeenAt": "2025-07-10T08:09:17.419Z",
      "network": "wlan-00001",
      "port": "1/1",
      "role": "wireless",
      "vlanId": "100",
      "tunnel": "Overlay",
      "tunnelId": 0,
      "connectedSince": "2025-07-10T08:09:17.419Z",
      "keyManagement": "WPA2_PSK",
      "authentication": "Captive Portal",
      "capabilities": "802.11gn"
    },
    {
      "name": "Client1",
      "experience": "Good",
      "status": "Connected",
      "statusReason": "GOOD_PERFORMANCE",
      "type": "Wireless",
      "mac": "05:50:35:a1:a0:01",
      "ipv4": "129.110.213.218",
      "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
      "connectedDeviceSerial": "DTXC000001",
      "connectedTo": "Aruba-2930F-12G-PoEP-2G-2SFPP",
      "lastSeenAt": "2025-07-10T08:09:17.419Z",
      "network": "wlan-00001",
      "port": "1/1",
      "role": "wireless",
      "vlanId": "100",
      "tunnel": "Overlay",
      "tunnelId": 0,
      "connectedSince": "2025-07-10T08:09:17.419Z",
      "keyManagement": "WPA2_PSK",
      "authentication": "Captive Portal",
      "capabilities": "802.11gn"
    }
  ],
  "count": 7337,
  "total": 6552,
  "next": 4093
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

#### Response schema for listing clients

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
      "name": "Client1",
      "experience": "Good",
      "status": "Connected",
      "statusReason": "GOOD_PERFORMANCE",
      "type": "Wireless",
      "mac": "05:50:35:a1:a0:01",
      "ipv4": "129.110.213.218",
      "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
      "connectedDeviceSerial": "DTXC000001",
      "connectedTo": "Aruba-2930F-12G-PoEP-2G-2SFPP",
      "lastSeenAt": "2025-07-10T08:09:17.419Z",
      "network": "wlan-00001",
      "port": "1/1",
      "role": "wireless",
      "vlanId": "100",
      "tunnel": "Overlay",
      "tunnelId": 0,
      "connectedSince": "2025-07-10T08:09:17.419Z",
      "keyManagement": "WPA2_PSK",
      "authentication": "Captive Portal",
      "capabilities": "802.11gn"
    },
    {
      "name": "Client1",
      "experience": "Good",
      "status": "Connected",
      "statusReason": "GOOD_PERFORMANCE",
      "type": "Wireless",
      "mac": "05:50:35:a1:a0:01",
      "ipv4": "129.110.213.218",
      "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
      "connectedDeviceSerial": "DTXC000001",
      "connectedTo": "Aruba-2930F-12G-PoEP-2G-2SFPP",
      "lastSeenAt": "2025-07-10T08:09:17.419Z",
      "network": "wlan-00001",
      "port": "1/1",
      "role": "wireless",
      "vlanId": "100",
      "tunnel": "Overlay",
      "tunnelId": 0,
      "connectedSince": "2025-07-10T08:09:17.419Z",
      "keyManagement": "WPA2_PSK",
      "authentication": "Captive Portal",
      "capabilities": "802.11gn"
    }
  ],
  "count": 7337,
  "total": 6552,
  "next": 4093
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

