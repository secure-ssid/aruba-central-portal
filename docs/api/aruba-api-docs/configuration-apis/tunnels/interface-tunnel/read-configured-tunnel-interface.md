# Read configured Tunnel Interface

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/tunnel`

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
  "interface": [
    {
      "mode": "GRE",
      "ip-version": "IPV6",
      "enabled": "false",
      "description": "<string>",
      "src": "<string>",
      "dst": "<string>",
      "ipv6-address": "<string>",
      "ipv6-prefix": [
        "<string>",
        "<string>"
      ],
      "ipv4-prefix": "<string>",
      "secondary-ipv4-prefix": [
        "<string>",
        "<string>"
      ],
      "vrf-forwarding": "<string>",
      "ttl": {
        "copy": "<boolean>",
        "value": "<integer>"
      },
      "mtu": "1500",
      "l3-counters": "RX",
      "id": "<integer>",
      "gre": {
        "trusted": "false",
        "trusted-vlans": [
          "1-4094",
          "1-4094"
        ],
        "allowed-vlans": [
          "<string>",
          "<string>"
        ],
        "openflow-enable": "<boolean>",
        "payload-type": "L3",
        "protocol": "<integer>",
        "acl": {
          "name": "<string>",
          "direction-in": "<boolean>",
          "direction-out": "<boolean>"
        },
        "inter-tunnel-flood": "true",
        "keepalive": {
          "enable-gre": "<boolean>",
          "cisco": "<boolean>",
          "interval": "10",
          "retries": "3",
          "enable-icmp": "<boolean>",
          "icmp-destination": "<string>",
          "icmp-nexthop": "<string>"
        }
      }
    },
    {
      "mode": "VXLAN",
      "ip-version": "UNKNOWN",
      "enabled": "false",
      "description": "<string>",
      "src": "<string>",
      "dst": "<string>",
      "ipv6-address": "<string>",
      "ipv6-prefix": [
        "<string>",
        "<string>"
      ],
      "ipv4-prefix": "<string>",
      "secondary-ipv4-prefix": [
        "<string>",
        "<string>"
      ],
      "vrf-forwarding": "<string>",
      "ttl": {
        "copy": "<boolean>",
        "value": "<integer>"
      },
      "mtu": "1500",
      "l3-counters": "RX_TX",
      "id": "<integer>",
      "gre": {
        "trusted": "false",
        "trusted-vlans": [
          "1-4094",
          "1-4094"
        ],
        "allowed-vlans": [
          "<string>",
          "<string>"
        ],
        "openflow-enable": "<boolean>",
        "payload-type": "L3",
        "protocol": "<integer>",
        "acl": {
          "name": "<string>",
          "direction-in": "<boolean>",
          "direction-out": "<boolean>"
        },
        "inter-tunnel-flood": "true",
        "keepalive": {
          "enable-gre": "<boolean>",
          "cisco": "<boolean>",
          "interval": "10",
          "retries": "3",
          "enable-icmp": "<boolean>",
          "icmp-destination": "<string>",
          "icmp-nexthop": "<string>"
        }
      }
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

