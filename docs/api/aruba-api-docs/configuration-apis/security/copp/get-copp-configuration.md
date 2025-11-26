# Get CoPP configuration

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/copp`

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
      "log": "true",
      "copp-policy": {
        "configured-copp-policy-entries": [
          {
            "class": "ACL_LOGGING",
            "priority": "<integer>",
            "rate-pps": "<long>",
            "rate-kbits": "<long>",
            "burst-pkts": "<long>",
            "burst-kbytes": "<long>",
            "drop": "<boolean>"
          },
          {
            "class": "UNKNOWN_MULTICAST",
            "priority": "<integer>",
            "rate-pps": "<string>",
            "rate-kbits": "<long>",
            "burst-pkts": "<long>",
            "burst-kbytes": "<long>",
            "drop": "<boolean>"
          }
        ],
        "user-defined-class-entries": [
          {
            "user-defined-class-index": "<long>",
            "ip-match": "IPV4_ANY",
            "ip-address": "<string>",
            "ip-protocol": "UDP",
            "l4-port": "<integer>",
            "rate": "<long>",
            "drop": "false"
          },
          {
            "user-defined-class-index": "<long>",
            "ip-match": "IPV4_ANY",
            "ip-address": "<string>",
            "ip-protocol": "TCP",
            "l4-port": "<integer>",
            "rate": "<string>",
            "drop": "false"
          }
        ],
        "applied": "<boolean>"
      }
    },
    {
      "name": "<string>",
      "description": "<string>",
      "log": "true",
      "copp-policy": {
        "configured-copp-policy-entries": [
          {
            "class": "HYPERTEXT",
            "priority": "<integer>",
            "rate-pps": "<string>",
            "rate-kbits": "<long>",
            "burst-pkts": "<long>",
            "burst-kbytes": "<long>",
            "drop": "<boolean>"
          },
          {
            "class": "OSPF_UNICAST_IPV6",
            "priority": "<integer>",
            "rate-pps": "<long>",
            "rate-kbits": "<long>",
            "burst-pkts": "<long>",
            "burst-kbytes": "<long>",
            "drop": "<boolean>"
          }
        ],
        "user-defined-class-entries": [
          {
            "user-defined-class-index": "<long>",
            "ip-match": "IPV4",
            "ip-address": "<string>",
            "ip-protocol": "TCP",
            "l4-port": "<integer>",
            "rate": "<long>",
            "drop": "false"
          },
          {
            "user-defined-class-index": "<long>",
            "ip-match": "IPV4",
            "ip-address": "<string>",
            "ip-protocol": "UDP",
            "l4-port": "<integer>",
            "rate": "<long>",
            "drop": "false"
          }
        ],
        "applied": "<boolean>"
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

