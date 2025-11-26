# Read existing roles

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/roles`

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
  "role": [
    {
      "session-parameters": {
        "mtu": "<integer>",
        "auth-mode": "CLIENT_MODE",
        "reauth-period": "<long>",
        "session-timeout": "<long>",
        "trust-mode": "DSCP",
        "stp-admin-edge-port": "<boolean>",
        "captive-portal-type": "CENTRAL_NAC",
        "captive-portal": "<string>",
        "check-for-accounting": "<boolean>",
        "poe-priority": "CRITICAL",
        "poe-allocate-by-method": "USAGE",
        "poe-allocate-by-class": "false",
        "poe-max-power": "<integer>",
        "client-inactivity-timeout": "<long>",
        "cached-reauth-period": "<long>",
        "gateway-zone": "<string>",
        "gateway-role": "<string>",
        "device-traffic-class": "VOICE",
        "tunneled-node-server-redirect": "false",
        "allow-tunneled-node-with-device-profile": "true",
        "allow-jumbo-frames": "false",
        "speed": "SPEED_AUTO",
        "duplex-mode": "AUTO",
        "max-sessions": "64000",
        "reauthentication-interval": "0",
        "reauthentication-interval-seconds": "0",
        "pool": {
          "l2tp": "<string>",
          "pptp": "<string>",
          "via-dhcp": "<string>",
          "via-dhcp-subnet": "<string>",
          "via-dhcp-subnet-netmask": "<string>"
        }
      },
      "vlan-parameters": {
        "access-vlan": "<integer>",
        "trunk-allowed-vlans": "<string>",
        "trunk-native-vlan": "<integer>",
        "access-vlan-name": "<string>",
        "trunk-allowed-vlan-names": [
          "<string>"
        ],
        "trunk-native-vlan-name": "<string>",
        "private-vlan-port-type": "PROMISCUOUS",
        "wired-access-vlan-id": "<integer>",
        "wired-access-vlan-name": "<string>"
      },
      "qos-parameters": {
        "cos": "<integer>",
        "ingress-bandwidth": "100",
        "egress-bandwidth": "100"
      },
      "classification-parameters": {
        "ip-classification": "false",
        "dpi-classification": "false",
        "dpi-youtube-education": "false",
        "web-cc": "false"
      },
      "miscellaneous-parameters": {
        "enforce-dhcp": "false",
        "robust-age-out": "false",
        "registration-role": "false",
        "openflow-enable": "false"
      },
      "ipfix-flow-monitor": {
        "ipv4-monitor": "<string>",
        "ipv6-monitor": "<string>"
      },
      "app-aaa-contract": {
        "app": [
          {
            "appname": "emol",
            "bwc-name": "<string>",
            "direction": "UPSTREAM"
          }
        ]
      },
      "app-category-aaa-contract": {
        "app-category": [
          {
            "category-name": "COLLABORATION",
            "bwc-name": "<string>",
            "direction": "UPSTREAM"
          }
        ]
      },
      "web-category-aaa-contract": {
        "web-category": [
          {
            "webcategory-name": "SHAREWARE-AND-FREEWARE",
            "bwc-name": "<string>",
            "direction": "DOWNSTREAM"
          }
        ]
      },
      "web-reputation-aaa-contract": {
        "web-reputation": [
          {
            "webrepname": "LOW_RISK",
            "bwc-name": "<string>",
            "direction": "UPSTREAM"
          }
        ]
      },
      "exclude-app-contract": {
        "exclude-app": [
          {
            "exclude-app-name": "impress"
          }
        ]
      },
      "exclude-app-cat-contract": {
        "exclude-app-category": [
          {
            "exclude-app-category-name": "INSTANT-MESSAGING"
          }
        ]
      },
      "aaa-bw-contract": {
        "bw-contract": [
          {
            "bwc-name": "<string>",
            "direction": "DOWNSTREAM",
            "association": "PER_USER"
          }
        ]
      },
      "name": "<string>",
      "description": "<string>",
      "macsec-policy": "<string>",
      "calea": "<boolean>",
      "redirect-blocked-https-url": "false",
      "error-page-url": "<long>",
      "utf8": "<boolean>",
      "airslice-application-list": [
        "DPI_APP_GITHUB"
      ],
      "monitoring-application-list": [
        "DPI_APP_ALG_WIFI_CALLING"
      ],
      "via-connection-profile": "<string>",
      "vlan-type": "VLAN_NAME",
      "access-vlan-id": "<integer>",
      "access-vlan-name": "<string>",
      "dyn-app-prioritization": "true",
      "dap-application-uuid": [
        "CISCO_WEBEX"
      ],
      "object-group-ipv4": "<string>",
      "object-group-ipv6": "<string>"
    }
  ],
  "metadata": {
    "count_objects_in_module": {
      "LOCAL": 0,
      "SHARED": 0,
      "ANY": 0
    }
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

