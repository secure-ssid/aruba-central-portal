# Read the existing uplink profile

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/ap-uplinks/:name`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

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
  "preemption": {
    "enable": "true",
    "interval": "<integer>"
  },
  "failover": {
    "enable": "false",
    "ip": "<string>",
    "ip-for-cell": "<string>",
    "timeout": "10",
    "pkt-lost-cnt": "10",
    "pkt-send-freq": "30",
    "vpn-timeout": "180"
  },
  "name": "<string>",
  "description": "<string>",
  "ap-mode": "CAMPUS",
  "gateway-detect": "false",
  "ethernet-1": {
    "backup-link": "false",
    "port": "ETH_1",
    "speed": "SPEED_AUTO",
    "duplex": "AUTO_DUPLEX",
    "dot3az": "false",
    "interface-mode": "ACCESS",
    "native-vlan": "<integer>",
    "access-vlan": "<integer>",
    "trunk-vlan-ranges": [
      "<string>"
    ],
    "trunk-vlan-all": "false",
    "mgmt-vlan-opt": "TAGGED_VLAN",
    "mgmt-vlan-id": "<integer>",
    "ipv4-management-address": "<string>",
    "ipv4-management-alias": "<string>",
    "ipv6-management-address-format": "EUI_64",
    "default-gateway": [
      "<string>"
    ],
    "wan-vlan": "<integer>",
    "wan-type": "MPLS",
    "uplink-pppoe": {
      "lcp-interval": "<integer>",
      "lcp-failure": "<integer>",
      "password": "<string>",
      "secret": "<string>",
      "service-name": "<string>",
      "username": "<string>"
    },
    "uplink-dot1xsupp": {
      "eapol-method": "EAP_MD5",
      "eap-tls-cert-type": "DEVICE",
      "eap-identity": "<string>",
      "eap-identity-password": "<string>",
      "auth-timeout": "60",
      "validate-server-cert": "false",
      "secure-enhance": "false"
    },
    "static-ipv4": {
      "ip": "<string>",
      "mask": "<string>",
      "gateway": "<string>",
      "dns": "<string>",
      "domain": "<string>"
    },
    "static-ipv6": {
      "ip6-prefix": "<string>",
      "gateway": "<string>",
      "dns": "<string>",
      "domain": "<string>"
    }
  },
  "ethernet-2": {
    "backup-link": "false",
    "port": "ETH0_ETH1",
    "speed": "SPEED_AUTO",
    "duplex": "AUTO_DUPLEX",
    "dot3az": "false",
    "interface-mode": "ACCESS",
    "native-vlan": "<integer>",
    "access-vlan": "<integer>",
    "trunk-vlan-ranges": [
      "<string>"
    ],
    "trunk-vlan-all": "false",
    "mgmt-vlan-opt": "NATIVE_VLAN",
    "mgmt-vlan-id": "<integer>",
    "ipv4-management-address": "<string>",
    "ipv4-management-alias": "<string>",
    "ipv6-management-address-format": "STABLE_PRIVACY_ALGORITHM",
    "default-gateway": [
      "<string>"
    ],
    "wan-vlan": "<integer>",
    "wan-type": "INET"
  },
  "lte-modem": {
    "backup-link": "false",
    "aruba-skylark": "false",
    "plmn": "<string>",
    "modem-apn": {
      "id": "<long>",
      "apn": "<string>",
      "apn-username": "<string>",
      "apn-password": "<string>",
      "apn-authentication": "0",
      "isp-name": "<string>"
    },
    "gps": "false",
    "network-mode": "MODE_3G",
    "sim-slot": "NONE",
    "data-rate-limit": "<integer>",
    "billing-start-date": "<long>",
    "modem-e3372": "false",
    "generation": "NONE",
    "frequency-range": "LTE_B41_2500",
    "auto-upgrade": "false",
    "sim-failover": "false",
    "prefer-modem": "MODEM_0",
    "tp-driver-type": "NOVATEL_U620",
    "tp-device-id": "<string>",
    "tp-device-tty": "<string>",
    "tp-init-parameters": "<string>",
    "tp-cell-auth": {
      "type": "NONE",
      "username": "<string>",
      "password": "<string>"
    },
    "tp-dial-cmd": "<string>",
    "tp-modeswitch-cmd": "<string>",
    "tp-isp": "CHINA_TELECOM",
    "tp-country": "UK",
    "sim-pin-enable": {
      "current": "<string>"
    },
    "sim-pin-renew": {
      "current": "<string>",
      "new": "<string>"
    },
    "sim-pin-puk": {
      "puk": "<string>",
      "new": "<string>"
    }
  },
  "wifi-uplink": {
    "backup-link": "false",
    "ssid-name": "<string>",
    "uplink-band": "DOT11G",
    "opmode": "PERSONAL",
    "cipher-suite": "WPA_TKIP_PSK",
    "wifi1x-auth": {
      "method": "PEAP",
      "username": "<string>",
      "password": "<string>",
      "tls-method": "USER",
      "tls-method-user": "IAP",
      "eap-server": "false"
    },
    "wpa-passphrase": "<string>",
    "disable-on-mesh-point": "false",
    "eht-enable": "true"
  }
}
```
---

#### Bad Request

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Unauthorized Access

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Forbidden

**Status:** 403 Forbidden

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Not Found

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Not Acceptable

**Status:** 406 Not Acceptable

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Request Timeout

**Status:** 408 Request Timeout

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Precondition Failed

**Status:** 412 Precondition Failed

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Rate limit exceeded

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Internal Server Error

**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

