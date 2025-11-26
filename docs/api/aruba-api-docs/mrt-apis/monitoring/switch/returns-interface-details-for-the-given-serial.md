# Returns interface details for the given serial.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/switch/:serial/interfaces?site-id=2345678`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| site-id | 2345678 | ID of the site for which switch-related information is requested. |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Object containing the interfaces information

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
      "name": "GigabitEthernet1/0/1",
      "index": 1,
      "status": "Up",
      "adminStatus": "Up",
      "operStatus": "Up",
      "alias": "GE1",
      "errorReason": "None",
      "description": "Uplink to Core Switch",
      "mtu": 1500,
      "speed": 1000,
      "connector": "RJ45",
      "duplex": "Full",
      "lag": "LAG1",
      "vlanMode": "Access",
      "allowedVlans": [
        "VLAN10",
        "VLAN20"
      ],
      "allowedVlanIds": [
        10,
        20
      ],
      "nativeVlan": 1,
      "poeStatus": "Enabled",
      "poeClass": "Class4",
      "portAlignment": "Aligned",
      "serial": "CN31HKZ0CN",
      "peerPort": "GigabitEthernet1/0/24",
      "peerMemberId": 2,
      "uplink": true,
      "type": "GigabitEthernet",
      "module": "1",
      "neighbour": "CoreSwitch",
      "neighbourPort": "GigabitEthernet1/0/24",
      "neighbourFamily": "Aruba",
      "neighbourFunction": "Core",
      "neighbourRole": "Core Switch",
      "neighbourHealth": "Good",
      "neighbourSerial": "CN32HKZ0DN",
      "neighbourType": "Switch",
      "isMultipleNeighbourClients": false,
      "transceiverType": "SFP",
      "transceiverSerial": "SFP123456",
      "transceiverModel": "SFP-1G-LX",
      "transceiverProductNumber": "J4859C",
      "transceiverStatus": "Good",
      "ipv4": "10.1.1.1",
      "stpInstanceType": "RSTP",
      "stpInstanceId": 0,
      "stpPortRole": "Root",
      "stpPortState": "Forwarding",
      "stpPortInconsistent": "None"
    },
    {
      "name": "GigabitEthernet1/0/1",
      "index": 1,
      "status": "Up",
      "adminStatus": "Up",
      "operStatus": "Up",
      "alias": "GE1",
      "errorReason": "None",
      "description": "Uplink to Core Switch",
      "mtu": 1500,
      "speed": 1000,
      "connector": "RJ45",
      "duplex": "Full",
      "lag": "LAG1",
      "vlanMode": "Access",
      "allowedVlans": [
        "VLAN10",
        "VLAN20"
      ],
      "allowedVlanIds": [
        10,
        20
      ],
      "nativeVlan": 1,
      "poeStatus": "Enabled",
      "poeClass": "Class4",
      "portAlignment": "Aligned",
      "serial": "CN31HKZ0CN",
      "peerPort": "GigabitEthernet1/0/24",
      "peerMemberId": 2,
      "uplink": true,
      "type": "GigabitEthernet",
      "module": "1",
      "neighbour": "CoreSwitch",
      "neighbourPort": "GigabitEthernet1/0/24",
      "neighbourFamily": "Aruba",
      "neighbourFunction": "Core",
      "neighbourRole": "Core Switch",
      "neighbourHealth": "Good",
      "neighbourSerial": "CN32HKZ0DN",
      "neighbourType": "Switch",
      "isMultipleNeighbourClients": false,
      "transceiverType": "SFP",
      "transceiverSerial": "SFP123456",
      "transceiverModel": "SFP-1G-LX",
      "transceiverProductNumber": "J4859C",
      "transceiverStatus": "Good",
      "ipv4": "10.1.1.1",
      "stpInstanceType": "RSTP",
      "stpInstanceId": 0,
      "stpPortRole": "Root",
      "stpPortState": "Forwarding",
      "stpPortInconsistent": "None"
    }
  ],
  "count": 1,
  "total": 1,
  "offset": "string"
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

#### Object containing the interfaces information

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
      "name": "GigabitEthernet1/0/1",
      "index": 1,
      "status": "Up",
      "adminStatus": "Up",
      "operStatus": "Up",
      "alias": "GE1",
      "errorReason": "None",
      "description": "Uplink to Core Switch",
      "mtu": 1500,
      "speed": 1000,
      "connector": "RJ45",
      "duplex": "Full",
      "lag": "LAG1",
      "vlanMode": "Access",
      "allowedVlans": [
        "VLAN10",
        "VLAN20"
      ],
      "allowedVlanIds": [
        10,
        20
      ],
      "nativeVlan": 1,
      "poeStatus": "Enabled",
      "poeClass": "Class4",
      "portAlignment": "Aligned",
      "serial": "CN31HKZ0CN",
      "peerPort": "GigabitEthernet1/0/24",
      "peerMemberId": 2,
      "uplink": true,
      "type": "GigabitEthernet",
      "module": "1",
      "neighbour": "CoreSwitch",
      "neighbourPort": "GigabitEthernet1/0/24",
      "neighbourFamily": "Aruba",
      "neighbourFunction": "Core",
      "neighbourRole": "Core Switch",
      "neighbourHealth": "Good",
      "neighbourSerial": "CN32HKZ0DN",
      "neighbourType": "Switch",
      "isMultipleNeighbourClients": false,
      "transceiverType": "SFP",
      "transceiverSerial": "SFP123456",
      "transceiverModel": "SFP-1G-LX",
      "transceiverProductNumber": "J4859C",
      "transceiverStatus": "Good",
      "ipv4": "10.1.1.1",
      "stpInstanceType": "RSTP",
      "stpInstanceId": 0,
      "stpPortRole": "Root",
      "stpPortState": "Forwarding",
      "stpPortInconsistent": "None"
    },
    {
      "name": "GigabitEthernet1/0/1",
      "index": 1,
      "status": "Up",
      "adminStatus": "Up",
      "operStatus": "Up",
      "alias": "GE1",
      "errorReason": "None",
      "description": "Uplink to Core Switch",
      "mtu": 1500,
      "speed": 1000,
      "connector": "RJ45",
      "duplex": "Full",
      "lag": "LAG1",
      "vlanMode": "Access",
      "allowedVlans": [
        "VLAN10",
        "VLAN20"
      ],
      "allowedVlanIds": [
        10,
        20
      ],
      "nativeVlan": 1,
      "poeStatus": "Enabled",
      "poeClass": "Class4",
      "portAlignment": "Aligned",
      "serial": "CN31HKZ0CN",
      "peerPort": "GigabitEthernet1/0/24",
      "peerMemberId": 2,
      "uplink": true,
      "type": "GigabitEthernet",
      "module": "1",
      "neighbour": "CoreSwitch",
      "neighbourPort": "GigabitEthernet1/0/24",
      "neighbourFamily": "Aruba",
      "neighbourFunction": "Core",
      "neighbourRole": "Core Switch",
      "neighbourHealth": "Good",
      "neighbourSerial": "CN32HKZ0DN",
      "neighbourType": "Switch",
      "isMultipleNeighbourClients": false,
      "transceiverType": "SFP",
      "transceiverSerial": "SFP123456",
      "transceiverModel": "SFP-1G-LX",
      "transceiverProductNumber": "J4859C",
      "transceiverStatus": "Good",
      "ipv4": "10.1.1.1",
      "stpInstanceType": "RSTP",
      "stpInstanceId": 0,
      "stpPortRole": "Root",
      "stpPortState": "Forwarding",
      "stpPortInconsistent": "None"
    }
  ],
  "count": 1,
  "total": 1,
  "offset": "string"
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

