# Read ntp

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/ntp`

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
      "authenticate": "false",
      "authentication-profile": [
        {
          "key-identifier": "<long>",
          "key-hash": "SHA1",
          "key-value": "<string>",
          "key-trusted": "false",
          "ciphertext": {
            "key-value": "<string>"
          }
        },
        {
          "key-identifier": "<long>",
          "key-hash": "MD5",
          "key-value": "<string>",
          "key-trusted": "false",
          "ciphertext": {
            "key-value": "<string>"
          }
        }
      ],
      "trusted-key": [
        "<long>",
        "<long>"
      ],
      "conductor": [
        {
          "vrf": "<string>",
          "stratum": "<integer>"
        },
        {
          "vrf": "<string>",
          "stratum": "<integer>"
        }
      ],
      "debug": "false",
      "dhcp-disable": "false",
      "source-interface": "LOOPBACK",
      "source-vlan": "<integer>",
      "time-serve": [
        "<integer>",
        "<integer>"
      ],
      "traps": [
        "NTP_STRATUM_CHANGE",
        "NTP_LEAPSEC_ANNOUNCED"
      ],
      "servers": [
        {
          "address": "<string>",
          "tx-mode": "BURST",
          "burst": "SINGLE",
          "iburst": "ALWAYS",
          "key-identifier": "<long>",
          "max-poll": "10",
          "min-poll": "6",
          "mgmt-interface": "false",
          "prefer": "false",
          "version": "<integer>"
        },
        {
          "address": "<string>",
          "tx-mode": "BURST",
          "burst": "SINGLE",
          "iburst": "ALWAYS",
          "key-identifier": "<long>",
          "max-poll": "10",
          "min-poll": "6",
          "mgmt-interface": "false",
          "prefer": "false",
          "version": "<integer>"
        }
      ],
      "max-association": "8",
      "operation-mode": "BROADCAST",
      "server-mode-disable": "false",
      "servers-alias": "<string>",
      "name": "<string>",
      "description": "<string>",
      "vrf": "<string>"
    },
    {
      "authenticate": "false",
      "authentication-profile": [
        {
          "key-identifier": "<long>",
          "key-hash": "SHA1",
          "key-value": "<string>",
          "key-trusted": "false",
          "ciphertext": {
            "key-value": "<string>"
          }
        },
        {
          "key-identifier": "<long>",
          "key-hash": "SHA1",
          "key-value": "<string>",
          "key-trusted": "false",
          "ciphertext": {
            "key-value": "<string>"
          }
        }
      ],
      "trusted-key": [
        "<long>",
        "<long>"
      ],
      "conductor": [
        {
          "vrf": "<string>",
          "stratum": "<integer>"
        },
        {
          "vrf": "<string>",
          "stratum": "<integer>"
        }
      ],
      "debug": "false",
      "dhcp-disable": "false",
      "source-interface": "VLAN",
      "source-vlan": "<integer>",
      "time-serve": [
        "<integer>",
        "<integer>"
      ],
      "traps": [
        "NTP_LEAPSEC_ANNOUNCED",
        "NTP_ALL"
      ],
      "servers": [
        {
          "address": "<string>",
          "tx-mode": "IBURST",
          "burst": "SINGLE",
          "iburst": "ALWAYS",
          "key-identifier": "<long>",
          "max-poll": "10",
          "min-poll": "6",
          "mgmt-interface": "false",
          "prefer": "false",
          "version": "<integer>"
        },
        {
          "address": "<string>",
          "tx-mode": "IBURST",
          "burst": "SINGLE",
          "iburst": "ALWAYS",
          "key-identifier": "<long>",
          "max-poll": "10",
          "min-poll": "6",
          "mgmt-interface": "false",
          "prefer": "false",
          "version": "<integer>"
        }
      ],
      "max-association": "8",
      "operation-mode": "BROADCAST",
      "server-mode-disable": "false",
      "servers-alias": "<string>",
      "name": "<string>",
      "description": "<string>",
      "vrf": "<string>"
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

