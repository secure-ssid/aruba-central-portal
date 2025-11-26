# Update vsx by {name}

## Request

**Method:** `PATCH`

**URL:** `{{baseUrl}}/network-config/v1alpha1/vsx-profiles/:name`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Content-Type | application/json |  |
| Accept | application/json |  |

### Request Body

```json
{
  "auto-role": "<boolean>",
  "name": "<string>",
  "description": "<string>",
  "peer1": {
    "role": "VSX_PRIMARY",
    "port-channel-interface": [
      {
        "switchport": {
          "interface-mode": "TRUNK",
          "native-vlan": "<integer>",
          "tag": "false",
          "access-vlan": "<integer>",
          "trunk-vlan-all": "false",
          "trunk-vlans": [
            "<integer>"
          ],
          "trunk-vlan-ranges": [
            "<string>"
          ]
        },
        "ipv4-address": "<string>",
        "ipv4-address-secondary": [
          "<string>"
        ],
        "ipv6-address": [
          "<string>"
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "portchannel-ifname": "<string>",
        "description": "<string>",
        "enable": "false",
        "trunk-type": "MULTI_CHASSIS",
        "routing": "<boolean>",
        "port-list": [
          "<string>"
        ],
        "linkup-delay-timer-exclude": "false",
        "lacp-mode": "AUTO",
        "fallback": "false",
        "fallback-static": "false",
        "existing-portchannel-ip": "<boolean>",
        "shutdown-on-split": "false",
        "vrf-forwarding": "<string>",
        "cipt-mode": "AUTO",
        "cipt-client-limit-max": "<integer>",
        "cipt-update-interval": "<integer>"
      }
    ],
    "ethernet-interface": [
      {
        "switchport": {
          "interface-mode": "TRUNK",
          "native-vlan": "<integer>",
          "tag": "false",
          "access-vlan": "<integer>",
          "trunk-vlan-all": "false",
          "trunk-vlans": [
            "<integer>"
          ],
          "trunk-vlan-ranges": [
            "<string>"
          ]
        },
        "ipv4-address": "<string>",
        "ipv4-address-secondary": [
          "<string>"
        ],
        "ipv6-address": [
          "<string>"
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "ethernet-ifname": "<string>",
        "description": "<string>",
        "shutdown-on-split": "false",
        "vrf-forwarding": "<string>",
        "existing-ethernet-ip": "<boolean>"
      }
    ],
    "management-interface": [
      {
        "ipv4-address": "<string>",
        "ipv4-address-secondary": [
          "<string>"
        ],
        "ipv6-address": [
          "<string>"
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "mgmt-ifname": "<string>",
        "existing-management-ip": "<boolean>"
      }
    ],
    "vlan-interface": [
      {
        "ipv4-address": "<string>",
        "ipv4-address-secondary": [
          "<string>"
        ],
        "ipv6-address": [
          "<string>"
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "vlan-id": "<integer>",
        "description": "<string>",
        "existing-vlan-ip": "<boolean>",
        "vrf-forwarding": "<string>",
        "active-forwarding": "false"
      }
    ],
    "loopback-interface": [
      {
        "ipv4-address": "<string>",
        "ipv4-address-secondary": [
          "<string>"
        ],
        "ipv6-address": [
          "<string>"
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "loopback-id": "<integer>",
        "description": "<string>",
        "vrf-forwarding": "<string>",
        "existing-loopback-ip": "<boolean>"
      }
    ],
    "inter-switch-link": {
      "physical-interface": "<string>",
      "portchannel-interface": "<string>"
    },
    "vrf": [
      {
        "vrf-name": "<string>",
        "existing-vrf": "false"
      }
    ]
  },
  "peer2": {
    "role": "VSX_SECONDARY",
    "port-channel-interface": [
      {
        "switchport": {
          "interface-mode": "ACCESS",
          "native-vlan": "<integer>",
          "tag": "false",
          "access-vlan": "<integer>",
          "trunk-vlan-all": "false",
          "trunk-vlans": [
            "<integer>"
          ],
          "trunk-vlan-ranges": [
            "<string>"
          ]
        },
        "ipv4-address": "<string>",
        "ipv4-address-secondary": [
          "<string>"
        ],
        "ipv6-address": [
          "<string>"
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "portchannel-ifname": "<string>",
        "description": "<string>",
        "enable": "false",
        "trunk-type": "DT_TRUNK",
        "routing": "<boolean>",
        "port-list": [
          "<string>"
        ],
        "linkup-delay-timer-exclude": "false",
        "lacp-mode": "AUTO",
        "fallback": "false",
        "fallback-static": "false",
        "existing-portchannel-ip": "<boolean>",
        "shutdown-on-split": "false",
        "vrf-forwarding": "<string>",
        "cipt-mode": "AUTO",
        "cipt-client-limit-max": "<integer>",
        "cipt-update-interval": "<integer>"
      }
    ],
    "ethernet-interface": [
      {
        "switchport": {
          "interface-mode": "ACCESS",
          "native-vlan": "<integer>",
          "tag": "false",
          "access-vlan": "<integer>",
          "trunk-vlan-all": "false",
          "trunk-vlans": [
            "<integer>"
          ],
          "trunk-vlan-ranges": [
            "<string>"
          ]
        },
        "ipv4-address": "<string>",
        "ipv4-address-secondary": [
          "<string>"
        ],
        "ipv6-address": [
          "<string>"
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "ethernet-ifname": "<string>",
        "description": "<string>",
        "shutdown-on-split": "false",
        "vrf-forwarding": "<string>",
        "existing-ethernet-ip": "<boolean>"
      }
    ],
    "management-interface": [
      {
        "ipv4-address": "<string>",
        "ipv4-address-secondary": [
          "<string>"
        ],
        "ipv6-address": [
          "<string>"
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "mgmt-ifname": "<string>",
        "existing-management-ip": "<boolean>"
      }
    ],
    "vlan-interface": [
      {
        "ipv4-address": "<string>",
        "ipv4-address-secondary": [
          "<string>"
        ],
        "ipv6-address": [
          "<string>"
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "vlan-id": "<integer>",
        "description": "<string>",
        "existing-vlan-ip": "<boolean>",
        "vrf-forwarding": "<string>",
        "active-forwarding": "false"
      }
    ],
    "loopback-interface": [
      {
        "ipv4-address": "<string>",
        "ipv4-address-secondary": [
          "<string>"
        ],
        "ipv6-address": [
          "<string>"
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "loopback-id": "<integer>",
        "description": "<string>",
        "vrf-forwarding": "<string>",
        "existing-loopback-ip": "<boolean>"
      }
    ],
    "inter-switch-link": {
      "physical-interface": "<string>",
      "portchannel-interface": "<string>"
    },
    "vrf": [
      {
        "vrf-name": "<string>",
        "existing-vrf": "false"
      }
    ]
  },
  "sync-features": {
    "system-mac": "<string>",
    "split-recovery-disable": "false",
    "linkup-delay-timer": "180",
    "l3-vlans": [
      {
        "active-gateway": {
          "ipv4-address": [
            "<string>"
          ],
          "ipv6-address": [
            "<string>"
          ],
          "mac-address-v4": "<string>",
          "extended-mac-address-v4": "<boolean>",
          "mac-address-v6": "<string>",
          "extended-mac-address-v6": "<boolean>",
          "virtual-gw-l3-src-mac-enable": "false"
        },
        "id": "<integer>",
        "active-forwarding": "false",
        "shutdown-on-split": "false"
      }
    ]
  }
}
```
### Response Examples

#### Successful Operation

**Status:** 200 OK

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

