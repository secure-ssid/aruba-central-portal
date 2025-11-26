# Read net-groups

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/net-groups`

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
  "net-group": [
    {
      "name": "<string>",
      "description": "<string>",
      "netdestination-type": "IPV6_ONLY",
      "invert": "false",
      "exclude": "<string>",
      "preemptive-failover": "false",
      "items": [
        {
          "index": "<integer>",
          "type": "INTERFACE",
          "fqdn": "<string>",
          "address": "<string>",
          "address-range": [
            "<string>",
            "<string>"
          ],
          "prefix": "<string>",
          "network-vlan": "<integer>",
          "ports": {
            "operator": "COMPARISON_LT",
            "min": "0",
            "max": "<integer>"
          },
          "vlan": "<integer>",
          "vlan-offset": "<integer>",
          "default-host": "false",
          "null-interface": "false",
          "tunnel-name": "<string>"
        },
        {
          "index": "<integer>",
          "type": "PORT",
          "fqdn": "<string>",
          "address": "<string>",
          "address-range": [
            "<string>",
            "<string>"
          ],
          "prefix": "<string>",
          "network-vlan": "<integer>",
          "ports": {
            "operator": "PORT_GROUP",
            "min": "0",
            "max": "<integer>"
          },
          "vlan": "<integer>",
          "vlan-offset": "<integer>",
          "default-host": "false",
          "null-interface": "false",
          "tunnel-name": "<string>"
        }
      ]
    },
    {
      "name": "<string>",
      "description": "<string>",
      "netdestination-type": "IPV4_IPV6_MIXED",
      "invert": "false",
      "exclude": "<string>",
      "preemptive-failover": "false",
      "items": [
        {
          "index": "<integer>",
          "type": "PORT",
          "fqdn": "<string>",
          "address": "<string>",
          "address-range": [
            "<string>",
            "<string>"
          ],
          "prefix": "<string>",
          "network-vlan": "<integer>",
          "ports": {
            "operator": "COMPARISON_EQ",
            "min": "0",
            "max": "<integer>"
          },
          "vlan": "<integer>",
          "vlan-offset": "<integer>",
          "default-host": "false",
          "null-interface": "false",
          "tunnel-name": "<string>"
        },
        {
          "index": "<integer>",
          "type": "VLAN",
          "fqdn": "<string>",
          "address": "<string>",
          "address-range": [
            "<string>",
            "<string>"
          ],
          "prefix": "<string>",
          "network-vlan": "<integer>",
          "ports": {
            "operator": "COMPARISON_RANGE",
            "min": "0",
            "max": "<integer>"
          },
          "vlan": "<integer>",
          "vlan-offset": "<integer>",
          "default-host": "false",
          "null-interface": "false",
          "tunnel-name": "<string>"
        }
      ]
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

