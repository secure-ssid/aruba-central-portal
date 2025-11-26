# Get client firewall session logs


## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/client-firewall-sessions?site-id=2778382&start-query-time=1732121673000&end-query-time=1732132473000&client-mac=00:00:00:00:00:00&filter='applicationCategory' eq 'Web' and 'deviceType' in ('DEVICE_TYPE_AP','DEVICE_TYPE_GATEWAY','DEVICE_TYPE_SWITCH') and 'deduplication' eq 'true'`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| site-id | 2778382 | ID of the site from which to retrieve the firewall session logs.
 |
| start-query-time | 1732121673000 | The start time for the query in epoch milliseconds, must be less than end-query-time.
 |
| end-query-time | 1732132473000 | The end time for the query in epoch milliseconds, must be greater than start-query-time.
 |
| client-mac | 00:00:00:00:00:00 | The client mac of the source device.
 |
| filter | 'applicationCategory' eq 'Web' and 'deviceType' in ('DEVICE_TYPE_AP','DEVICE_TYPE_GATEWAY','DEVICE_TYPE_SWITCH') and 'deduplication' eq 'true' | OData Version 4.0 filter string (limited functionality). Supports only 'and' conjunction ('or' and 'not' are NOT supported). Supported fields and operators are in the below given table.

| Field | Operators | Required | Type | Default Value | Summary |
| --------- | -------- | -------- | -------- | -------- | -------- |
| `applicationCategory` | `eq` | `Yes` | `String` | `N\A` | `Format is string. Only applicationCategory or webCategory must be set but not both. Also cannot have both applicationCategory and webCategory empty.`|
| `webCategory` | `eq` | `Yes` | `String` | `N\A` | `Format is string. Only applicationCategory or webCategory must be set but not both. Also cannot have both applicationCategory and webCategory empty.`| 
| `deviceType` | `eq` and `in` | `No` | `String` | `('DEVICE_TYPE_AP','DEVICE_TYPE_GATEWAY','DEVICE_TYPE_SWITCH'`) | `Format is a tuple that contains string. Example: ('DEVICE_TYPE_AP','DEVICE_TYPE_GATEWAY','DEVICE_TYPE_SWITCH')` | 
| `deduplication` | `eq` | `No` | `String` | `true` | `Format is string but should only contain values true or false. Returns unique session logs if set to true` |

**The operators are implemented as follows:**

* `eq`: Only values exactly matching the given value are returned.

* `in`: Only values present in the given list are returned.

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
  "clientFirewallSessionLogs": {
    "items": [
      {
        "type": "network-monitoring/client-firewall-sessions",
        "id": "1699550427000-10.53.110.142-b8:27:eb:61:34:f0-13.107.42.14",
        "timestamp": "1699551447000",
        "serialNumber": "CN00000000",
        "clientUsername": "aruba-test@hpe.com",
        "clientIp": "10.53.110.142",
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
        "sessionCount": 100,
        "clientHostname": "host1"
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
  "clientFirewallSessionLogs": {
    "items": [
      {
        "type": "network-monitoring/client-firewall-sessions",
        "id": "1699550427000-10.53.110.142-b8:27:eb:61:34:f0-13.107.42.14",
        "timestamp": "1699551447000",
        "serialNumber": "CN00000000",
        "clientUsername": "aruba-test@hpe.com",
        "clientIp": "10.53.110.142",
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
        "sessionCount": 100,
        "clientHostname": "host1"
      }
    ],
    "offset": 0,
    "total": 101,
    "count": 1
  }
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

