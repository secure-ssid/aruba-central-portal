# Returns switch details for the given serial.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/switch/:serial?site-id=2345678`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| site-id | 2345678 | ID of the site for which switch-related information is requested. |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Object containing the switch information

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "id": "CN31HKZ0CN",
  "type": "switch",
  "switchLinkType": "BPS",
  "recommendation": null,
  "switchType": "pvos",
  "stpEnable": false,
  "stpMode": null,
  "serial": "CN31HKZ0CN",
  "ipv4": "10.21.78.3",
  "status": "Offline",
  "ipv6": null,
  "macAddress": "ec:50:aa:0d:99:30",
  "publicIp": "59.144.73.163",
  "model": "AS-2930F",
  "stackId": null,
  "health": "Poor",
  "healthReasons": {
    "poorReasons": [
      "DEVICE_OFFLINE"
    ],
    "fairReasons": {},
    "primaryReason": {
      "reasonEnum": "None",
      "typeId": "None",
      "totalReasons": 0
    }
  },
  "siteId": "749988555",
  "upTime": null,
  "rebootTs": null,
  "firmwareVersion": "WC.16.11.0001",
  "deployment": "Standalone",
  "firmwareUpdatedTs": null,
  "firmwareBackupVersion": null,
  "firmwareStatus": null,
  "firmwareRecommendedVersion": null,
  "contact": "",
  "jNumber": "JL258A",
  "lastSeen": 1707919492646,
  "managementVlan": null,
  "nativeVlan": null,
  "configStatus": "Synchronized",
  "deviceName": "Aruba-2930F-8G-PoEP-2SFPP",
  "switchRole": "Standalone",
  "manufacturer": "Aruba",
  "location": "",
  "stackMemberId": 2,
  "stackMemberStatus": null,
  "stackMemberPriority": null,
  "lastConfigChange": 1707907296000,
  "lastRestartReason": null
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

#### Device with serial number not found.

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
  "errorCode": "HPE_GL_NETWORK_MONITORING_THREAT_NOT_FOUND",
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

#### Device with serial number not found.

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
  "errorCode": "HPE_GL_NETWORK_MONITORING_THREAT_NOT_FOUND",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Object containing the switch information

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "id": "CN31HKZ0CN",
  "type": "switch",
  "switchLinkType": "BPS",
  "recommendation": null,
  "switchType": "pvos",
  "stpEnable": false,
  "stpMode": null,
  "serial": "CN31HKZ0CN",
  "ipv4": "10.21.78.3",
  "status": "Offline",
  "ipv6": null,
  "macAddress": "ec:50:aa:0d:99:30",
  "publicIp": "59.144.73.163",
  "model": "AS-2930F",
  "stackId": null,
  "health": "Poor",
  "healthReasons": {
    "poorReasons": [
      "DEVICE_OFFLINE"
    ],
    "fairReasons": {},
    "primaryReason": {
      "reasonEnum": "None",
      "typeId": "None",
      "totalReasons": 0
    }
  },
  "siteId": "749988555",
  "upTime": null,
  "rebootTs": null,
  "firmwareVersion": "WC.16.11.0001",
  "deployment": "Standalone",
  "firmwareUpdatedTs": null,
  "firmwareBackupVersion": null,
  "firmwareStatus": null,
  "firmwareRecommendedVersion": null,
  "contact": "",
  "jNumber": "JL258A",
  "lastSeen": 1707919492646,
  "managementVlan": null,
  "nativeVlan": null,
  "configStatus": "Synchronized",
  "deviceName": "Aruba-2930F-8G-PoEP-2SFPP",
  "switchRole": "Standalone",
  "manufacturer": "Aruba",
  "location": "",
  "stackMemberId": 2,
  "stackMemberStatus": null,
  "stackMemberPriority": null,
  "lastConfigChange": 1707907296000,
  "lastRestartReason": null
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

