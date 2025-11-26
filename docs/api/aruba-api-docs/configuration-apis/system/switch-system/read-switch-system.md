# Read switch-system

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/switch-system`

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
  "profile": [
    {
      "redundant-management": {
        "redundancy-mode": "MGMT_REDUNDANCY_WARM_STANDBY",
        "preferred-active-module": "<integer>",
        "rapid-switchover": "<long>"
      },
      "name": "<string>",
      "contact": "<string>",
      "location": "<string>",
      "description": "<string>",
      "gbp": {
        "enable": "false"
      },
      "timezone": {
        "daylight-time-rule": "NONE",
        "begin-date": "<string>",
        "end-date": "<string>"
      },
      "virtual-mac": "<string>",
      "disable-factory-reset": "false",
      "usb-port-disable": "false",
      "internal-vlan-range": "<string>",
      "mac-age-time": "<long>",
      "mac-address-delimiter": "COMMA",
      "enable-unsupported-transceiver": "<boolean>",
      "unsupported-transceiver-logging-interval": "1440",
      "unsupported-transceiver-logging": "<boolean>",
      "max-vlan": "<integer>",
      "management-vlan-id": "<integer>",
      "primary-vlan": "<integer>",
      "ip-routing": "false",
      "ipv6-unicast-routing": "false",
      "ip-multicast-routing": "false",
      "access-list": {
        "log-enable": "true",
        "log-timer": "<integer>",
        "secure-update": "true",
        "deny-fragmented-tcp-header": "false",
        "deny-non-classifiable-layer4-header": "false"
      },
      "loop-protect": {
        "transmit-interval": "5",
        "re-enable-timer": "<long>",
        "trap": "false",
        "mode": "PORT_MODE",
        "vlans": [
          "<integer>",
          "<integer>"
        ]
      },
      "fault-monitor": {
        "excessive-oversize-packets": {
          "sensitivity": "LOW",
          "action": "NOTIFY"
        },
        "excessive-crc-errors": {
          "sensitivity": "LOW",
          "action": "NOTIFY"
        },
        "excessive-late-collisions": {
          "sensitivity": "HIGH",
          "action": "NOTIFY_AND_DISABLE"
        },
        "excessive-broadcasts": {
          "sensitivity": "HIGH",
          "action": "NOTIFY_AND_DISABLE"
        },
        "excessive-multicasts": {
          "sensitivity": "MEDIUM",
          "action": "NOTIFY"
        },
        "link-flap": {
          "sensitivity": "LOW",
          "action": "NOTIFY_AND_DISABLE"
        },
        "bad-transceiver": {
          "sensitivity": "HIGH",
          "action": "NOTIFY_AND_DISABLE"
        },
        "over-bandwidth": {
          "sensitivity": "MEDIUM",
          "action": "NOTIFY"
        },
        "link-loss": {
          "sensitivity": "HIGH",
          "action": "NOTIFY"
        },
        "half-duplex-mismatch": {
          "sensitivity": "LOW",
          "action": "NOTIFY_AND_DISABLE"
        },
        "full-duplex-mismatch": {
          "sensitivity": "LOW",
          "action": "NOTIFY_AND_DISABLE"
        }
      },
      "aaa": {
        "client-move": "SECURE_ENABLED",
        "auto-vlan-enable": "false",
        "client-event-log-enable": "false",
        "cached-critical-role": {
          "enable": "false",
          "cache-replace-mode": "NONE",
          "cache-timeout": "96",
          "persistent-storage-enable": "false",
          "persistent-storage-write-interval": "3600"
        },
        "use-lldp-data": "false",
        "allow-vlan-tagged": "false",
        "accounting": {
          "accounting-mode": "START_STOP",
          "local-accounting": "false",
          "interim-update-enable": "false",
          "interim-update-interval": "60",
          "interim-update-onreauth-enable": "false",
          "acct-server-group": "<string>"
        },
        "cppm-user-name": "<string>",
        "cppm-password": "<string>"
      },
      "macsec": {
        "selftest-enable": "false"
      },
      "dynamic-arp-inspection": {
        "enable": "false",
        "validate-destination-mac": "false",
        "validate-ip": "false",
        "validate-source-mac": "false"
      },
      "port-security": {
        "enable": "false",
        "traps-enable": "true"
      },
      "fastboot": "<boolean>",
      "captive-portal-enable": "false",
      "policy-in": "<string>",
      "private-vlan": {
        "hw-resource-share-enable": "true"
      },
      "qinq": {
        "ethertype": "ETHERTYPE_88A8",
        "vlan-mode": "MODE_SVLAN",
        "tag-type": "<string>"
      },
      "dfp-cppm-timer": "120"
    },
    {
      "redundant-management": {
        "redundancy-mode": "MGMT_REDUNDANCY_NONE",
        "preferred-active-module": "<integer>",
        "rapid-switchover": "<long>"
      },
      "name": "<string>",
      "contact": "<string>",
      "location": "<string>",
      "description": "<string>",
      "gbp": {
        "enable": "false"
      },
      "timezone": {
        "daylight-time-rule": "NONE",
        "begin-date": "<string>",
        "end-date": "<string>"
      },
      "virtual-mac": "<string>",
      "disable-factory-reset": "false",
      "usb-port-disable": "false",
      "internal-vlan-range": "<string>",
      "mac-age-time": "<long>",
      "mac-address-delimiter": "COLON",
      "enable-unsupported-transceiver": "<boolean>",
      "unsupported-transceiver-logging-interval": "1440",
      "unsupported-transceiver-logging": "<boolean>",
      "max-vlan": "<integer>",
      "management-vlan-id": "<integer>",
      "primary-vlan": "<integer>",
      "ip-routing": "false",
      "ipv6-unicast-routing": "false",
      "ip-multicast-routing": "false",
      "access-list": {
        "log-enable": "true",
        "log-timer": "<integer>",
        "secure-update": "true",
        "deny-fragmented-tcp-header": "false",
        "deny-non-classifiable-layer4-header": "false"
      },
      "loop-protect": {
        "transmit-interval": "5",
        "re-enable-timer": "<long>",
        "trap": "false",
        "mode": "PORT_MODE",
        "vlans": [
          "<integer>",
          "<integer>"
        ]
      },
      "fault-monitor": {
        "excessive-oversize-packets": {
          "sensitivity": "HIGH",
          "action": "NOTIFY_AND_DISABLE"
        },
        "excessive-crc-errors": {
          "sensitivity": "MEDIUM",
          "action": "NOTIFY_AND_DISABLE"
        },
        "excessive-late-collisions": {
          "sensitivity": "MEDIUM",
          "action": "NOTIFY_AND_DISABLE"
        },
        "excessive-broadcasts": {
          "sensitivity": "LOW",
          "action": "NOTIFY"
        },
        "excessive-multicasts": {
          "sensitivity": "MEDIUM",
          "action": "NOTIFY"
        },
        "link-flap": {
          "sensitivity": "HIGH",
          "action": "NOTIFY"
        },
        "bad-transceiver": {
          "sensitivity": "HIGH",
          "action": "NOTIFY_AND_DISABLE"
        },
        "over-bandwidth": {
          "sensitivity": "LOW",
          "action": "NOTIFY_AND_DISABLE"
        },
        "link-loss": {
          "sensitivity": "LOW",
          "action": "NOTIFY"
        },
        "half-duplex-mismatch": {
          "sensitivity": "HIGH",
          "action": "NOTIFY_AND_DISABLE"
        },
        "full-duplex-mismatch": {
          "sensitivity": "HIGH",
          "action": "NOTIFY_AND_DISABLE"
        }
      },
      "aaa": {
        "client-move": "SECURE_ENABLED",
        "auto-vlan-enable": "false",
        "client-event-log-enable": "false",
        "cached-critical-role": {
          "enable": "false",
          "cache-replace-mode": "NONE",
          "cache-timeout": "96",
          "persistent-storage-enable": "false",
          "persistent-storage-write-interval": "3600"
        },
        "use-lldp-data": "false",
        "allow-vlan-tagged": "false",
        "accounting": {
          "accounting-mode": "START_STOP",
          "local-accounting": "false",
          "interim-update-enable": "false",
          "interim-update-interval": "60",
          "interim-update-onreauth-enable": "false",
          "acct-server-group": "<string>"
        },
        "cppm-user-name": "<string>",
        "cppm-password": "<string>"
      },
      "macsec": {
        "selftest-enable": "false"
      },
      "dynamic-arp-inspection": {
        "enable": "false",
        "validate-destination-mac": "false",
        "validate-ip": "false",
        "validate-source-mac": "false"
      },
      "port-security": {
        "enable": "false",
        "traps-enable": "true"
      },
      "fastboot": "<boolean>",
      "captive-portal-enable": "false",
      "policy-in": "<string>",
      "private-vlan": {
        "hw-resource-share-enable": "true"
      },
      "qinq": {
        "ethertype": "ETHERTYPE_8100",
        "vlan-mode": "MODE_MIXED_VLAN",
        "tag-type": "<string>"
      },
      "dfp-cppm-timer": "120"
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

