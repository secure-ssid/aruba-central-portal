# Read Object Groups

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/object-groups`

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
  "group": [
    {
      "type": "PORT_GROUP",
      "name": "<string>",
      "description": "<string>",
      "items": [
        {
          "index": "<long>",
          "address-type": "ADDRESS_HOST",
          "ipv4-address": "<string>",
          "ipv4-prefix": "<string>",
          "ipv4-subnet-address": "<string>",
          "ipv6-address": "<string>",
          "ipv6-prefix": "<string>",
          "ipv6-subnet-address": "<string>",
          "ports": {
            "operator": "COMPARISON_NE",
            "min": "0",
            "max": "<integer>"
          }
        },
        {
          "index": "<long>",
          "address-type": "ADDRESS_NETWORK",
          "ipv4-address": "<string>",
          "ipv4-prefix": "<string>",
          "ipv4-subnet-address": "<string>",
          "ipv6-address": "<string>",
          "ipv6-prefix": "<string>",
          "ipv6-subnet-address": "<string>",
          "ports": {
            "operator": "COMPARISON_RANGE",
            "min": "0",
            "max": "<integer>"
          }
        }
      ],
      "vrf": "<string>"
    },
    {
      "type": "PORT_GROUP",
      "name": "<string>",
      "description": "<string>",
      "items": [
        {
          "index": "<long>",
          "address-type": "ADDRESS_SUBNET_MASK",
          "ipv4-address": "<string>",
          "ipv4-prefix": "<string>",
          "ipv4-subnet-address": "<string>",
          "ipv6-address": "<string>",
          "ipv6-prefix": "<string>",
          "ipv6-subnet-address": "<string>",
          "ports": {
            "operator": "COMPARISON_NE",
            "min": "0",
            "max": "<integer>"
          }
        },
        {
          "index": "<long>",
          "address-type": "ADDRESS_HOST",
          "ipv4-address": "<string>",
          "ipv4-prefix": "<string>",
          "ipv4-subnet-address": "<string>",
          "ipv6-address": "<string>",
          "ipv6-prefix": "<string>",
          "ipv6-subnet-address": "<string>",
          "ports": {
            "operator": "COMPARISON_RANGE",
            "min": "0",
            "max": "<integer>"
          }
        }
      ],
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

