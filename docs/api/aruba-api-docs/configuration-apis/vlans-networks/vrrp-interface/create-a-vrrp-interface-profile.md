# Create a VRRP-interface profile

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-config/v1alpha1/vrrp/:name`

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
  "virtual-router": [
    {
      "tracking-items": [
        {
          "tracking-name": "<string>",
          "mode": "VLAN",
          "interfaces": "<string>",
          "interval": "<integer>",
          "vlans": "<integer>",
          "identifier": "<integer>",
          "uplink-vlan": "<integer>",
          "priority-offset-op": "ADD",
          "priority-offset": "<integer>"
        },
        {
          "tracking-name": "<string>",
          "mode": "VLAN",
          "interfaces": "<string>",
          "interval": "<integer>",
          "vlans": "<integer>",
          "identifier": "<integer>",
          "uplink-vlan": "<integer>",
          "priority-offset-op": "ADD",
          "priority-offset": "<integer>"
        }
      ],
      "router-id-address-family": "<string>",
      "address-alias": "<string>",
      "address": "<string>",
      "sec-address": [
        "<string>",
        "<string>"
      ],
      "advertise-interval": "<integer>",
      "preempt": "true",
      "preempt-delay": "0",
      "priority-alias": "<string>",
      "priority": "<integer>",
      "disable": "<boolean>",
      "version-3-checksum": "<boolean>",
      "description": "<string>",
      "authentication-type": "TEXT",
      "password-type": "PLAIN_TEXT",
      "password": "<string>",
      "ciphertext-password": "<string>",
      "hold-time": "45",
      "cluster-preempt": "false",
      "version": "VRRP_V3",
      "bfd": [
        "<string>",
        "<string>"
      ],
      "null-auth-compatibility": "false",
      "failback": "false",
      "failover": "false",
      "with-monitoring": "false",
      "lowest-primary-ip-address": "<string>",
      "track-id": [
        "<integer>",
        "<integer>"
      ]
    },
    {
      "tracking-items": [
        {
          "tracking-name": "<string>",
          "mode": "PORT",
          "interfaces": "<string>",
          "interval": "<integer>",
          "vlans": "<integer>",
          "identifier": "<integer>",
          "uplink-vlan": "<integer>",
          "priority-offset-op": "ADD",
          "priority-offset": "<integer>"
        },
        {
          "tracking-name": "<string>",
          "mode": "UPLINK_CELLULAR",
          "interfaces": "<string>",
          "interval": "<integer>",
          "vlans": "<integer>",
          "identifier": "<integer>",
          "uplink-vlan": "<integer>",
          "priority-offset-op": "ADD",
          "priority-offset": "<integer>"
        }
      ],
      "router-id-address-family": "<string>",
      "address-alias": "<string>",
      "address": "<string>",
      "sec-address": [
        "<string>",
        "<string>"
      ],
      "advertise-interval": "<integer>",
      "preempt": "true",
      "preempt-delay": "0",
      "priority-alias": "<string>",
      "priority": "<integer>",
      "disable": "<boolean>",
      "version-3-checksum": "<boolean>",
      "description": "<string>",
      "authentication-type": "TEXT",
      "password-type": "PLAIN_TEXT",
      "password": "<string>",
      "ciphertext-password": "<string>",
      "hold-time": "45",
      "cluster-preempt": "false",
      "version": "VRRP_V2",
      "bfd": [
        "<string>",
        "<string>"
      ],
      "null-auth-compatibility": "false",
      "failback": "false",
      "failover": "false",
      "with-monitoring": "false",
      "lowest-primary-ip-address": "<boolean>",
      "track-id": [
        "<integer>",
        "<integer>"
      ]
    }
  ],
  "name": "<string>",
  "description": "<string>"
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

