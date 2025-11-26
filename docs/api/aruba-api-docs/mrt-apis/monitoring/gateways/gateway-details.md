# Gateway Details

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/gateways/:serial-number`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Object containing information about the gateway, such as MAC address, name, status, uplinks, ports, vlans


**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "serialNumber": "GW00000001",
  "siteId": "24833497",
  "siteName": "gateway-site-1",
  "deviceName": "gw_1",
  "role": "Isolated Leader",
  "deployment": "Cluster",
  "clusterName": "gw-cluster",
  "model": "Aruba-9004",
  "macAddress": "11:22:33:44:55:66",
  "publicIpv4": "172.51.100.42",
  "ipv4": "198.51.100.42",
  "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
  "status": "ONLINE",
  "lastSeenAt": null,
  "uptimeInMillis": 1702794777,
  "softwareVersion": "8.5.2.0_59123",
  "failureReason": "null",
  "lastRebootReason": "AC Power Cycle",
  "manufacturer": "Aruba",
  "partNumber": "R1B20A",
  "deviceFunction": "VPNC",
  "deviceType": "Gateway",
  "uplinks": [
    {
      "vlanId": 305,
      "linkTag": "Airtel",
      "publicIp": "172.51.100.42",
      "privateIp": "10.71.50.02",
      "uplinkType": "Active",
      "transport": "Internet",
      "status": "Up",
      "wanBackup": "Disabled"
    }
  ],
  "ports": [
    {
      "macAddress": "11:22:33:44:55:66",
      "name": "eth0",
      "portNumber": "GE 0/0/0",
      "portType": "RJ45",
      "duplex": "Auto",
      "speed": "1000",
      "vlanMode": "Trunk",
      "status": "Connected",
      "description": "Gigabit-Level",
      "vlan": 305,
      "vlanNative": "",
      "mtu": 1500,
      "pcId": 2
    }
  ],
  "vlans": [
    {
      "vlanId": 305,
      "name": "Client-Vlan 1",
      "vlanType": "Static",
      "status": "Up",
      "adminStatus": "Up",
      "ipv4": "10.27.103.66",
      "ipv4Subnet": "10.27.103.66/28",
      "ipv4MaskAddr": "255.255.255.240",
      "interfaces": "GE 0/0/0",
      "voice": "null",
      "ipv6Prefix": "null"
    }
  ],
  "id": "GW00000001",
  "type": "network-monitoring/gateway-monitoring"
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

#### Object containing information about the gateway, such as MAC address, name, status, uplinks, ports, vlans


**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "serialNumber": "GW00000001",
  "siteId": "24833497",
  "siteName": "gateway-site-1",
  "deviceName": "gw_1",
  "role": "Isolated Leader",
  "deployment": "Cluster",
  "clusterName": "gw-cluster",
  "model": "Aruba-9004",
  "macAddress": "11:22:33:44:55:66",
  "publicIpv4": "172.51.100.42",
  "ipv4": "198.51.100.42",
  "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
  "status": "ONLINE",
  "lastSeenAt": null,
  "uptimeInMillis": 1702794777,
  "softwareVersion": "8.5.2.0_59123",
  "failureReason": "null",
  "lastRebootReason": "AC Power Cycle",
  "manufacturer": "Aruba",
  "partNumber": "R1B20A",
  "deviceFunction": "VPNC",
  "deviceType": "Gateway",
  "uplinks": [
    {
      "vlanId": 305,
      "linkTag": "Airtel",
      "publicIp": "172.51.100.42",
      "privateIp": "10.71.50.02",
      "uplinkType": "Active",
      "transport": "Internet",
      "status": "Up",
      "wanBackup": "Disabled"
    }
  ],
  "ports": [
    {
      "macAddress": "11:22:33:44:55:66",
      "name": "eth0",
      "portNumber": "GE 0/0/0",
      "portType": "RJ45",
      "duplex": "Auto",
      "speed": "1000",
      "vlanMode": "Trunk",
      "status": "Connected",
      "description": "Gigabit-Level",
      "vlan": 305,
      "vlanNative": "",
      "mtu": 1500,
      "pcId": 2
    }
  ],
  "vlans": [
    {
      "vlanId": 305,
      "name": "Client-Vlan 1",
      "vlanType": "Static",
      "status": "Up",
      "adminStatus": "Up",
      "ipv4": "10.27.103.66",
      "ipv4Subnet": "10.27.103.66/28",
      "ipv4MaskAddr": "255.255.255.240",
      "interfaces": "GE 0/0/0",
      "voice": "null",
      "ipv6Prefix": "null"
    }
  ],
  "id": "GW00000001",
  "type": "network-monitoring/gateway-monitoring"
}
```
---

