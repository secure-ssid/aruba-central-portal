# Read loopback interface(s) configurations

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/loopback-interfaces`

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
      "ipv4": [
        {
          "address": "<string>"
        },
        {
          "address": "<string>"
        }
      ],
      "ipv4-prefix": "<string>",
      "secondary-ip": [
        "<string>",
        "<string>"
      ],
      "ipv6-address": [
        "<string>",
        "<string>"
      ],
      "ipv6-addresses": [
        {
          "ipv6-address": "<string>",
          "tag": "0"
        },
        {
          "ipv6-address": "<string>",
          "tag": "0"
        }
      ],
      "link-local": "<string>",
      "enable-default-link-local": "false",
      "ipv4-config": {
        "address": "<string>",
        "prefix-len": "32",
        "addl-ipv4": [
          {
            "addl-address": "<string>",
            "addl-prefix-len": "32"
          },
          {
            "addl-address": "<string>",
            "addl-prefix-len": "32"
          }
        ]
      },
      "ipv6-config": {
        "addresses": [
          {
            "address": "<string>",
            "prefix-len": "128",
            "tag": "0"
          },
          {
            "address": "<string>",
            "prefix-len": "128",
            "tag": "0"
          }
        ],
        "link-local": "<string>",
        "enable-default-link-local": "false"
      },
      "urpf": {
        "ipv4-enable": "DISABLE"
      },
      "pim-sparse": {
        "enable": "false"
      },
      "pim6-sparse": {
        "enable": "false"
      },
      "pim-bidir": {
        "bidir-enable": "false",
        "hello-interval": "30",
        "hello-delay": "5",
        "lan-prune-delay": "true",
        "override-interval": "2500",
        "propagation-delay": "500"
      },
      "id": "<integer>",
      "description": "<string>",
      "vrf-forwarding": "<string>"
    },
    {
      "ipv4": [
        {
          "address": "<string>"
        },
        {
          "address": "<string>"
        }
      ],
      "ipv4-prefix": "<string>",
      "secondary-ip": [
        "<string>",
        "<string>"
      ],
      "ipv6-address": [
        "<string>",
        "<string>"
      ],
      "ipv6-addresses": [
        {
          "ipv6-address": "<string>",
          "tag": "0"
        },
        {
          "ipv6-address": "<string>",
          "tag": "0"
        }
      ],
      "link-local": "<string>",
      "enable-default-link-local": "false",
      "ipv4-config": {
        "address": "<string>",
        "prefix-len": "32",
        "addl-ipv4": [
          {
            "addl-address": "<string>",
            "addl-prefix-len": "32"
          },
          {
            "addl-address": "<string>",
            "addl-prefix-len": "32"
          }
        ]
      },
      "ipv6-config": {
        "addresses": [
          {
            "address": "<string>",
            "prefix-len": "128",
            "tag": "0"
          },
          {
            "address": "<string>",
            "prefix-len": "128",
            "tag": "0"
          }
        ],
        "link-local": "<string>",
        "enable-default-link-local": "false"
      },
      "urpf": {
        "ipv4-enable": "DISABLE"
      },
      "pim-sparse": {
        "enable": "false"
      },
      "pim6-sparse": {
        "enable": "false"
      },
      "pim-bidir": {
        "bidir-enable": "false",
        "hello-interval": "30",
        "hello-delay": "5",
        "lan-prune-delay": "true",
        "override-interval": "2500",
        "propagation-delay": "500"
      },
      "id": "<integer>",
      "description": "<string>",
      "vrf-forwarding": "<string>"
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

