# Get a list of IDPS threats.


## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/threats?start-time=1734248950711`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| start-time | 1734248950711 | Specifies the start time (in milliseconds) from which the threats should be listed.
 |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### A list of threats along with their respective details.
 The list will contain only the latest 20 threats sorted in descending order of timestamp if no sorting and pagination are applied. Otherwise, it will contain the requested number of threats starting 

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
      "action": "ALLOWED",
      "appProto": "HTTP",
      "clientMacaddr": "00:00:00:00:xx:xx",
      "customerId": "cf3f80d06b7011ef85c8dac199bxxxxx",
      "cveReference": "CVE-2007-0015",
      "description": "WEB_CLIENT signatures are designed to alert on attacks against web client software",
      "destCity": "San Jose",
      "destCountry": "USA",
      "destIp": "192.168.x.x",
      "destPort": 80,
      "deviceIp": "192.168.x.x",
      "deviceModel": "GW-275",
      "deviceName": "ap_1",
      "deviceSerialNum": "GW00000001",
      "flowId": 12345,
      "groupId": "12345",
      "groupName": "group1",
      "id": "threat~1732223424345~x~xxxxx-x",
      "malwareFamily": "Android_SmsThief",
      "proto": "TCP",
      "severity": "Informational",
      "signatureId": 2016141,
      "signatureName": "12345",
      "siteId": "12345",
      "siteName": "site1",
      "srcCity": "San Jose",
      "srcCountry": "US",
      "srcIp": "192.168.x.x",
      "srcPort": 80,
      "strategy": "IPS_STRICT",
      "timestamp": "1730259294489",
      "type": "network-monitoring/idps",
      "userName": "user1",
      "userRole": "admin"
    },
    {
      "action": "ALLOWED",
      "appProto": "HTTP",
      "clientMacaddr": "00:00:00:00:xx:xx",
      "customerId": "cf3f80d06b7011ef85c8dac199bxxxxx",
      "cveReference": "CVE-2007-0015",
      "description": "WEB_CLIENT signatures are designed to alert on attacks against web client software",
      "destCity": "San Jose",
      "destCountry": "USA",
      "destIp": "192.168.x.x",
      "destPort": 80,
      "deviceIp": "192.168.x.x",
      "deviceModel": "GW-275",
      "deviceName": "ap_1",
      "deviceSerialNum": "GW00000001",
      "flowId": 12345,
      "groupId": "12345",
      "groupName": "group1",
      "id": "threat~1732223424345~x~xxxxx-x",
      "malwareFamily": "Android_SmsThief",
      "proto": "TCP",
      "severity": "Informational",
      "signatureId": 2016141,
      "signatureName": "12345",
      "siteId": "12345",
      "siteName": "site1",
      "srcCity": "San Jose",
      "srcCountry": "US",
      "srcIp": "192.168.x.x",
      "srcPort": 80,
      "strategy": "IPS_STRICT",
      "timestamp": "1730259294489",
      "type": "network-monitoring/idps",
      "userName": "user1",
      "userRole": "admin"
    }
  ],
  "count": 1,
  "total": 100,
  "offset": 10
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

#### A list of threats along with their respective details.
 The list will contain only the latest 20 threats sorted in descending order of timestamp if no sorting and pagination are applied. Otherwise, it will contain the requested number of threats starting 

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
      "action": "ALLOWED",
      "appProto": "HTTP",
      "clientMacaddr": "00:00:00:00:xx:xx",
      "customerId": "cf3f80d06b7011ef85c8dac199bxxxxx",
      "cveReference": "CVE-2007-0015",
      "description": "WEB_CLIENT signatures are designed to alert on attacks against web client software",
      "destCity": "San Jose",
      "destCountry": "USA",
      "destIp": "192.168.x.x",
      "destPort": 80,
      "deviceIp": "192.168.x.x",
      "deviceModel": "GW-275",
      "deviceName": "ap_1",
      "deviceSerialNum": "GW00000001",
      "flowId": 12345,
      "groupId": "12345",
      "groupName": "group1",
      "id": "threat~1732223424345~x~xxxxx-x",
      "malwareFamily": "Android_SmsThief",
      "proto": "TCP",
      "severity": "Informational",
      "signatureId": 2016141,
      "signatureName": "12345",
      "siteId": "12345",
      "siteName": "site1",
      "srcCity": "San Jose",
      "srcCountry": "US",
      "srcIp": "192.168.x.x",
      "srcPort": 80,
      "strategy": "IPS_STRICT",
      "timestamp": "1730259294489",
      "type": "network-monitoring/idps",
      "userName": "user1",
      "userRole": "admin"
    },
    {
      "action": "ALLOWED",
      "appProto": "HTTP",
      "clientMacaddr": "00:00:00:00:xx:xx",
      "customerId": "cf3f80d06b7011ef85c8dac199bxxxxx",
      "cveReference": "CVE-2007-0015",
      "description": "WEB_CLIENT signatures are designed to alert on attacks against web client software",
      "destCity": "San Jose",
      "destCountry": "USA",
      "destIp": "192.168.x.x",
      "destPort": 80,
      "deviceIp": "192.168.x.x",
      "deviceModel": "GW-275",
      "deviceName": "ap_1",
      "deviceSerialNum": "GW00000001",
      "flowId": 12345,
      "groupId": "12345",
      "groupName": "group1",
      "id": "threat~1732223424345~x~xxxxx-x",
      "malwareFamily": "Android_SmsThief",
      "proto": "TCP",
      "severity": "Informational",
      "signatureId": 2016141,
      "signatureName": "12345",
      "siteId": "12345",
      "siteName": "site1",
      "srcCity": "San Jose",
      "srcCountry": "US",
      "srcIp": "192.168.x.x",
      "srcPort": 80,
      "strategy": "IPS_STRICT",
      "timestamp": "1730259294489",
      "type": "network-monitoring/idps",
      "userName": "user1",
      "userRole": "admin"
    }
  ],
  "count": 1,
  "total": 100,
  "offset": 10
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

