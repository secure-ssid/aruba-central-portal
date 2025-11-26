# Get a list of Access Point radios

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/aps/:serial-number/radios`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### List of Radios of an access point, along with their details.

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
      "macAddress": "11:22:33:44:55:66",
      "radioNumber": 7,
      "status": "UP",
      "band": "2.4 GHz",
      "siteId": "24833497",
      "id": "AP00000001/radios/0",
      "type": "string",
      "bandRange": "Lower",
      "channel": "string",
      "bandwidth": "20 MHz",
      "mode": "Client Access",
      "power": "string",
      "channelUtilization": "string",
      "nonWifiInterference": "string",
      "txUtilization": "string",
      "rxUtilization": "string",
      "noiseFloor": "string",
      "errors": "14.65",
      "drops": "77.44",
      "retries": "11",
      "channelQuality": "string",
      "channelChangeCount": 9,
      "powerChangeCount": 6
    },
    {
      "macAddress": "11:22:33:44:55:66",
      "radioNumber": 0,
      "status": "UP",
      "band": "2.4 GHz",
      "siteId": "24833497",
      "id": "AP00000001/radios/0",
      "type": "string",
      "bandRange": "Lower",
      "channel": "string",
      "bandwidth": "20 MHz",
      "mode": "Client Access",
      "power": "string",
      "channelUtilization": "string",
      "nonWifiInterference": "string",
      "txUtilization": "string",
      "rxUtilization": "string",
      "noiseFloor": "string",
      "errors": "14.65",
      "drops": "77.44",
      "retries": "11",
      "channelQuality": "string",
      "channelChangeCount": 9,
      "powerChangeCount": 6
    }
  ],
  "count": 1,
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

#### List of Radios of an access point, along with their details.

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
      "macAddress": "11:22:33:44:55:66",
      "radioNumber": 7,
      "status": "UP",
      "band": "2.4 GHz",
      "siteId": "24833497",
      "id": "AP00000001/radios/0",
      "type": "string",
      "bandRange": "Lower",
      "channel": "string",
      "bandwidth": "20 MHz",
      "mode": "Client Access",
      "power": "string",
      "channelUtilization": "string",
      "nonWifiInterference": "string",
      "txUtilization": "string",
      "rxUtilization": "string",
      "noiseFloor": "string",
      "errors": "14.65",
      "drops": "77.44",
      "retries": "11",
      "channelQuality": "string",
      "channelChangeCount": 9,
      "powerChangeCount": 6
    },
    {
      "macAddress": "11:22:33:44:55:66",
      "radioNumber": 0,
      "status": "UP",
      "band": "2.4 GHz",
      "siteId": "24833497",
      "id": "AP00000001/radios/0",
      "type": "string",
      "bandRange": "Lower",
      "channel": "string",
      "bandwidth": "20 MHz",
      "mode": "Client Access",
      "power": "string",
      "channelUtilization": "string",
      "nonWifiInterference": "string",
      "txUtilization": "string",
      "rxUtilization": "string",
      "noiseFloor": "string",
      "errors": "14.65",
      "drops": "77.44",
      "retries": "11",
      "channelQuality": "string",
      "channelChangeCount": 9,
      "powerChangeCount": 6
    }
  ],
  "count": 1,
  "total": 10
}
```
---

