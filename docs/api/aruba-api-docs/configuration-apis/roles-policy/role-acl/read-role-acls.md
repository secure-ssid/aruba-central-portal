# Read Role ACLs

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/role-acls`

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
  "acl": [
    {
      "acl-type": "ACL_IPV4",
      "name": "<string>",
      "description": "<string>",
      "rules": [
        {
          "src-role": "<string>",
          "position": "<long>",
          "description": "<string>",
          "action": "PERMIT",
          "destination": {
            "address-type": "ADDRESS_ANY",
            "ipv4-address": "<string>",
            "ipv4-prefix": "<string>",
            "ipv4-subnet-address": "<string>",
            "ipv6-address": "<string>",
            "ipv6-prefix": "<string>",
            "ipv6-subnet-address": "<string>"
          },
          "vrf": "<string>",
          "count": "false"
        },
        {
          "src-role": "<string>",
          "position": "<long>",
          "description": "<string>",
          "action": "PERMIT",
          "destination": {
            "address-type": "ADDRESS_ANY",
            "ipv4-address": "<string>",
            "ipv4-prefix": "<string>",
            "ipv4-subnet-address": "<string>",
            "ipv6-address": "<string>",
            "ipv6-prefix": "<string>",
            "ipv6-subnet-address": "<string>"
          },
          "vrf": "<string>",
          "count": "false"
        }
      ]
    },
    {
      "acl-type": "ACL_IPV6",
      "name": "<string>",
      "description": "<string>",
      "rules": [
        {
          "src-role": "<string>",
          "position": "<long>",
          "description": "<string>",
          "action": "PERMIT",
          "destination": {
            "address-type": "ADDRESS_SUBNET_MASK",
            "ipv4-address": "<string>",
            "ipv4-prefix": "<string>",
            "ipv4-subnet-address": "<string>",
            "ipv6-address": "<string>",
            "ipv6-prefix": "<string>",
            "ipv6-subnet-address": "<string>"
          },
          "vrf": "<string>",
          "count": "false"
        },
        {
          "src-role": "<string>",
          "position": "<long>",
          "description": "<string>",
          "action": "PERMIT",
          "destination": {
            "address-type": "ADDRESS_ANY",
            "ipv4-address": "<string>",
            "ipv4-prefix": "<string>",
            "ipv4-subnet-address": "<string>",
            "ipv6-address": "<string>",
            "ipv6-prefix": "<string>",
            "ipv6-subnet-address": "<string>"
          },
          "vrf": "<string>",
          "count": "false"
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

