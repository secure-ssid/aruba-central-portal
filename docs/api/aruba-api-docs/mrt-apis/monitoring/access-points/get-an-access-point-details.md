# Get an Access Point details

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/aps/:serial-number`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Object containing information about the access point, such as MAC address, name, status, radios, ports, modem, and WLANs.


**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "serialNumber": "AP00000001",
  "siteId": "24833497",
  "macAddress": "11:22:33:44:55:66",
  "deviceName": "ap_1",
  "ipv4": "198.51.100.42",
  "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
  "model": "AP-275",
  "softwareVersion": "8.5.2.0_59123",
  "status": "ONLINE",
  "lastSeenAt": null,
  "uptimeInMillis": 1702794777,
  "lastRebootReason": "AP_RELOAD",
  "manufacturer": "Aruba",
  "negotiatedPower": "802.3at",
  "role": "Conductor",
  "deployment": "Standalone",
  "bandSelection": "Dual band",
  "publicIpv4": "172.51.100.42",
  "countryCode": "US",
  "mode": "Client Access",
  "defaultGateway": "104.38.250.23 (DHCP)",
  "radios": [
    {
      "macAddress": "11:22:33:44:66:60",
      "band": "5 GHz",
      "status": "UP",
      "radioNumber": 0,
      "mode": "Client Access",
      "antenna": "Internal",
      "spatialStream": "3x3:3",
      "bandwidth": "40 MHz",
      "channel": "36+",
      "power": 13,
      "wlans": [
        {
          "wLanName": "wlan-00006",
          "security": "Open",
          "securityLevel": "Captive Portal",
          "bssid": "11:22:33:44:66:60",
          "vlan": "11",
          "status": "ENABLED"
        }
      ]
    }
  ],
  "ports": [
    {
      "macAddress": "11:22:33:44:55:66",
      "name": "eth0",
      "portIndex": 0,
      "status": "UP",
      "vlanMode": "Trunk",
      "allowedVlan": "all",
      "nativeVlan": "1",
      "accessVlan": "1",
      "speed": "5 Gbps",
      "duplex": "Auto",
      "connector": "RJ45"
    }
  ],
  "modem": {
    "manufacturer": "Aruba",
    "simState": "SIM_READY",
    "status": "DISCONNECTED",
    "state": "DISCONNECTED",
    "model": "MDM-USB-LTE/R8F34A",
    "imei": "869710031619392",
    "imsi": "405861081571487",
    "iccid": "89918610400322214587",
    "firmwareVersion": "EM12GPAR01A20M4G",
    "accessTechnology": "TDD LTE",
    "bandwidth": "20 MHz",
    "band": "TDD B40"
  },
  "id": "AP00000001",
  "type": "network-monitoring/access-point-monitoring"
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

#### Object containing information about the access point, such as MAC address, name, status, radios, ports, modem, and WLANs.


**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "serialNumber": "AP00000001",
  "siteId": "24833497",
  "macAddress": "11:22:33:44:55:66",
  "deviceName": "ap_1",
  "ipv4": "198.51.100.42",
  "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
  "model": "AP-275",
  "softwareVersion": "8.5.2.0_59123",
  "status": "ONLINE",
  "lastSeenAt": null,
  "uptimeInMillis": 1702794777,
  "lastRebootReason": "AP_RELOAD",
  "manufacturer": "Aruba",
  "negotiatedPower": "802.3at",
  "role": "Conductor",
  "deployment": "Standalone",
  "bandSelection": "Dual band",
  "publicIpv4": "172.51.100.42",
  "countryCode": "US",
  "mode": "Client Access",
  "defaultGateway": "104.38.250.23 (DHCP)",
  "radios": [
    {
      "macAddress": "11:22:33:44:66:60",
      "band": "5 GHz",
      "status": "UP",
      "radioNumber": 0,
      "mode": "Client Access",
      "antenna": "Internal",
      "spatialStream": "3x3:3",
      "bandwidth": "40 MHz",
      "channel": "36+",
      "power": 13,
      "wlans": [
        {
          "wLanName": "wlan-00006",
          "security": "Open",
          "securityLevel": "Captive Portal",
          "bssid": "11:22:33:44:66:60",
          "vlan": "11",
          "status": "ENABLED"
        }
      ]
    }
  ],
  "ports": [
    {
      "macAddress": "11:22:33:44:55:66",
      "name": "eth0",
      "portIndex": 0,
      "status": "UP",
      "vlanMode": "Trunk",
      "allowedVlan": "all",
      "nativeVlan": "1",
      "accessVlan": "1",
      "speed": "5 Gbps",
      "duplex": "Auto",
      "connector": "RJ45"
    }
  ],
  "modem": {
    "manufacturer": "Aruba",
    "simState": "SIM_READY",
    "status": "DISCONNECTED",
    "state": "DISCONNECTED",
    "model": "MDM-USB-LTE/R8F34A",
    "imei": "869710031619392",
    "imsi": "405861081571487",
    "iccid": "89918610400322214587",
    "firmwareVersion": "EM12GPAR01A20M4G",
    "accessTechnology": "TDD LTE",
    "bandwidth": "20 MHz",
    "band": "TDD B40"
  },
  "id": "AP00000001",
  "type": "network-monitoring/access-point-monitoring"
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

