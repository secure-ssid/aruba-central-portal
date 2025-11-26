# Get blocked firewall session logs


## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/site-firewall-sessions?site-id=2778382&start-query-time=1732121673000&end-query-time=1732132473000`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| site-id | 2778382 | ID of the site from which to retrieve the firewall session logs.
 |
| start-query-time | 1732121673000 | The start time for the query in epoch milliseconds, must be less than end-query-time.
 |
| end-query-time | 1732132473000 | The end time for the query in epoch milliseconds, must be greater than start-query-time.
 |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Successful operation

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "firewallSessionLogs": {
    "items": [
      {
        "type": "network-monitoring/site-firewall-sessions",
        "id": "1699550427000-10.53.110.142-b8:27:eb:61:34:f0-13.107.42.14",
        "timestamp": "1699551447000",
        "serialNumber": "CN00000000",
        "clientUsername": "aruba-test@hpe.com",
        "clientMac": "b8:27:eb:61:34:f0",
        "sourceIp": "10.53.110.142",
        "destinationIp": "13.107.42.14",
        "clientRole": "guest",
        "ssidName": "guestWifi",
        "tunneledTraffic": false,
        "clientConnectionType": "wireless",
        "vlanId": 12,
        "txBytes": 5433,
        "rxBytes": 572522496,
        "sessionType": "blocked",
        "applicationName": "Netflix",
        "applicationCategories": [
          "Streaming"
        ],
        "webUrl": "netflix.com",
        "webCategories": "Streaming Media",
        "webReputation": "Trustworthy",
        "blockedSessionReason": "Web Classification",
        "deviceType": "DEVICE_TYPE_AP",
        "tlsServerVersion": "tls_v1.2",
        "certificateExpiryDate": 1907231844072,
        "destinationLocation": "United States"
      }
    ],
    "offset": 0,
    "total": 101,
    "count": 1
  }
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

#### Successful operation

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "firewallSessionLogs": {
    "items": [
      {
        "type": "network-monitoring/site-firewall-sessions",
        "id": "1699550427000-10.53.110.142-b8:27:eb:61:34:f0-13.107.42.14",
        "timestamp": "1699551447000",
        "serialNumber": "CN00000000",
        "clientUsername": "aruba-test@hpe.com",
        "clientMac": "b8:27:eb:61:34:f0",
        "sourceIp": "10.53.110.142",
        "destinationIp": "13.107.42.14",
        "clientRole": "guest",
        "ssidName": "guestWifi",
        "tunneledTraffic": false,
        "clientConnectionType": "wireless",
        "vlanId": 12,
        "txBytes": 5433,
        "rxBytes": 572522496,
        "sessionType": "blocked",
        "applicationName": "Netflix",
        "applicationCategories": [
          "Streaming"
        ],
        "webUrl": "netflix.com",
        "webCategories": "Streaming Media",
        "webReputation": "Trustworthy",
        "blockedSessionReason": "Web Classification",
        "deviceType": "DEVICE_TYPE_AP",
        "tlsServerVersion": "tls_v1.2",
        "certificateExpiryDate": 1907231844072,
        "destinationLocation": "United States"
      }
    ],
    "offset": 0,
    "total": 101,
    "count": 1
  }
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

