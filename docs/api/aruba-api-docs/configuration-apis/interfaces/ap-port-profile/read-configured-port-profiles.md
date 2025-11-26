# Read configured port profiles

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/ap-port-profiles`

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
      "switchport": {
        "interface-mode": "ACCESS",
        "native-vlan": "<integer>",
        "access-vlan": "<integer>",
        "allowed-vlan-selector": "VLAN_RANGES",
        "allowed-vlan-name": "<string>",
        "trunk-vlan-ranges": [
          "<string>",
          "<string>"
        ],
        "trunk-vlan-all": "false"
      },
      "mac-authentication": "false",
      "dot1x-timer-idrequest-period": "5",
      "l2-auth-failthrough": "false",
      "captive-portal-type": "INTERNAL_CP",
      "captive-portal": "<string>",
      "exclude-uplink": [
        "WIFI",
        "CELLULAR"
      ],
      "called-station-id": {
        "type": "AP_GROUP",
        "mac-address-delimiter": "NONE",
        "upper-case": "false",
        "include-ssid": "false",
        "include-ssid-delimiter": "<string>"
      },
      "internal-auth-server": "INTERNAL_SERVER",
      "primary-auth-server": "<string>",
      "backup-auth-server": "<string>",
      "auth-server-group": "<string>",
      "cloud-auth": "false",
      "radius-accounting": "false",
      "radius-interim-accounting-interval": "<integer>",
      "primary-acct-server": "<string>",
      "backup-acct-server": "<string>",
      "acct-server-group": "<string>",
      "cp-accounting-mode": "USER_AUTHENTICATION",
      "assignment-rules": {
        "assignment-rule": [
          {
            "sequence-id": "<long>",
            "attribute": "LOGIN_LAT_PORT",
            "attribute-str": "<string>",
            "operator": "MATCH_EQUAL",
            "operand": "<string>",
            "assign-action": "ASSIGN_VLAN",
            "vlan": "<integer>",
            "role": "<string>"
          },
          {
            "sequence-id": "<long>",
            "attribute": "CRYPT_PASSWORD",
            "attribute-str": "<string>",
            "operator": "CONTAINS",
            "operand": "<string>",
            "assign-action": "ASSIGN_ROLE",
            "vlan": "<string>",
            "role": "<string>"
          }
        ]
      },
      "profile-name": "<string>",
      "description": "<string>",
      "speed": "SPEED_AUTO",
      "enable": "false",
      "duplex": "HALF_DUPLEX",
      "port-type": "LAN",
      "trusted": "false",
      "poe": {
        "enabled": "<boolean>"
      },
      "stp": {
        "enable": "false"
      },
      "loop-protect": {
        "enable": "false",
        "transmit-interval": "2",
        "re-enable": "false",
        "re-enable-timer": "300",
        "storm-control-broadcast": "false",
        "storm-control-threshold": "2000"
      },
      "port-bond": "false",
      "dot3az": "false",
      "dot3bz": "false",
      "client-isolation": "false",
      "cluster-preemption": "false",
      "content-filtering": "false",
      "forward-mode": "BRIDGE",
      "inactivity-timeout": "1000",
      "out-of-service": "NONE"
    },
    {
      "switchport": {
        "interface-mode": "ACCESS",
        "native-vlan": "<integer>",
        "access-vlan": "<integer>",
        "allowed-vlan-selector": "NAMED_VLAN",
        "allowed-vlan-name": "<string>",
        "trunk-vlan-ranges": [
          "<string>",
          "<string>"
        ],
        "trunk-vlan-all": "false"
      },
      "mac-authentication": "false",
      "dot1x-timer-idrequest-period": "5",
      "l2-auth-failthrough": "false",
      "captive-portal-type": "EXTERNAL_CP",
      "captive-portal": "<string>",
      "exclude-uplink": [
        "CELLULAR",
        "MESH"
      ],
      "called-station-id": {
        "type": "AP_GROUP",
        "mac-address-delimiter": "NONE",
        "upper-case": "false",
        "include-ssid": "false",
        "include-ssid-delimiter": "<string>"
      },
      "internal-auth-server": "INTERNAL_SERVER",
      "primary-auth-server": "<string>",
      "backup-auth-server": "<string>",
      "auth-server-group": "<string>",
      "cloud-auth": "false",
      "radius-accounting": "false",
      "radius-interim-accounting-interval": "<integer>",
      "primary-acct-server": "<string>",
      "backup-acct-server": "<string>",
      "acct-server-group": "<string>",
      "cp-accounting-mode": "USER_AUTHENTICATION",
      "assignment-rules": {
        "assignment-rule": [
          {
            "sequence-id": "<long>",
            "attribute": "SUFFIX",
            "attribute-str": "<string>",
            "operator": "CONTAINS",
            "operand": "<string>",
            "assign-action": "ASSIGN_ROLE",
            "vlan": "<string>",
            "role": "<string>"
          },
          {
            "sequence-id": "<long>",
            "attribute": "MS_CHAP_RESPONSE",
            "attribute-str": "<string>",
            "operator": "MATCHES_REGULAR_EXPRESSION",
            "operand": "<string>",
            "assign-action": "ASSIGN_ROLE",
            "vlan": "<integer>",
            "role": "<string>"
          }
        ]
      },
      "profile-name": "<string>",
      "description": "<string>",
      "speed": "SPEED_AUTO",
      "enable": "false",
      "duplex": "HALF_DUPLEX",
      "port-type": "WAN",
      "trusted": "false",
      "poe": {
        "enabled": "<boolean>"
      },
      "stp": {
        "enable": "false"
      },
      "loop-protect": {
        "enable": "false",
        "transmit-interval": "2",
        "re-enable": "false",
        "re-enable-timer": "300",
        "storm-control-broadcast": "false",
        "storm-control-threshold": "2000"
      },
      "port-bond": "false",
      "dot3az": "false",
      "dot3bz": "false",
      "client-isolation": "false",
      "cluster-preemption": "false",
      "content-filtering": "false",
      "forward-mode": "L2",
      "inactivity-timeout": "1000",
      "out-of-service": "INTERNET_DOWN"
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

