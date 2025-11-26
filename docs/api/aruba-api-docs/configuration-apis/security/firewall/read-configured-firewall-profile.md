# Read configured firewall Profile

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/firewall`

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
      "name": "<string>",
      "description": "<string>",
      "ipv4": {
        "flow-offload": "<boolean>",
        "ipv6-fragment-timeout": "<integer>",
        "ipv6-route-gc-interval": "<integer>",
        "ipv6-addr-gen-mode": "EUI_64",
        "disable-sw-rps": "false"
      },
      "ipv6": {
        "attack-rate": [
          {
            "protocol": "PING",
            "rate": "<integer>"
          },
          {
            "protocol": "PING",
            "rate": "<integer>"
          }
        ],
        "ext-hdr-parse-len": "100",
        "prohibit-rst-replay": "false",
        "drop-ip-fragments": "false",
        "enable-per-packet-logging": "false",
        "enable-stateful-icmp": "false",
        "enforce-tcp-handshake": "false",
        "enforce-tcp-sequence": "false",
        "prohibit-ip-spoofing": "true",
        "session-idle-timeout": "16"
      }
    },
    {
      "name": "<string>",
      "description": "<string>",
      "ipv4": {
        "flow-offload": "<boolean>",
        "ipv6-fragment-timeout": "<integer>",
        "ipv6-route-gc-interval": "<integer>",
        "ipv6-addr-gen-mode": "EUI_64",
        "disable-sw-rps": "false"
      },
      "ipv6": {
        "attack-rate": [
          {
            "protocol": "SESSION",
            "rate": "<integer>"
          },
          {
            "protocol": "TCP_SYN",
            "rate": "<integer>"
          }
        ],
        "ext-hdr-parse-len": "100",
        "prohibit-rst-replay": "false",
        "drop-ip-fragments": "false",
        "enable-per-packet-logging": "false",
        "enable-stateful-icmp": "false",
        "enforce-tcp-handshake": "false",
        "enforce-tcp-sequence": "false",
        "prohibit-ip-spoofing": "true",
        "session-idle-timeout": "16"
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

