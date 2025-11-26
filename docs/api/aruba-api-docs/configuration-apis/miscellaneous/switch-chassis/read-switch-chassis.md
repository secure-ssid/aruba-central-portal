# Read switch-chassis

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/switch-chassis`

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
  "chassis": [
    {
      "line-modules": [
        {
          "power-admin-state": "POWER_ENABLED",
          "power-priority": "128",
          "hw-profile": "<string>",
          "line-module-name": "<string>",
          "sku": "R0X44A"
        },
        {
          "power-admin-state": "POWER_ENABLED",
          "power-priority": "128",
          "hw-profile": "<string>",
          "line-module-name": "<string>",
          "sku": "J9547A"
        }
      ],
      "fabric-modules": [
        {
          "power-admin-state": "POWER_ENABLED",
          "power-priority": "128",
          "hw-profile": "<string>",
          "fabric-module-name": "<string>"
        },
        {
          "power-admin-state": "POWER_ENABLED",
          "power-priority": "128",
          "hw-profile": "<string>",
          "fabric-module-name": "<string>"
        }
      ],
      "fixed-modules": [
        {
          "slot-num": "<integer>",
          "module-sku": "JL255A"
        },
        {
          "slot-num": "<integer>",
          "module-sku": "JL354A"
        }
      ],
      "flexible-modules": [
        {
          "slot-name": "<string>",
          "slot-sku": "JL083A"
        },
        {
          "slot-name": "<string>",
          "slot-sku": "JL083A"
        }
      ],
      "chassis-name": "<string>",
      "description": "<string>",
      "allow-v2-modules": "true",
      "platform": "PLATFORM_5406"
    },
    {
      "line-modules": [
        {
          "power-admin-state": "POWER_ENABLED",
          "power-priority": "128",
          "hw-profile": "<string>",
          "line-module-name": "<string>",
          "sku": "J9537A"
        },
        {
          "power-admin-state": "POWER_ENABLED",
          "power-priority": "128",
          "hw-profile": "<string>",
          "line-module-name": "<string>",
          "sku": "R0X39B"
        }
      ],
      "fabric-modules": [
        {
          "power-admin-state": "POWER_ENABLED",
          "power-priority": "128",
          "hw-profile": "<string>",
          "fabric-module-name": "<string>"
        },
        {
          "power-admin-state": "POWER_ENABLED",
          "power-priority": "128",
          "hw-profile": "<string>",
          "fabric-module-name": "<string>"
        }
      ],
      "fixed-modules": [
        {
          "slot-num": "<integer>",
          "module-sku": "JL075A"
        },
        {
          "slot-num": "<integer>",
          "module-sku": "JL261A"
        }
      ],
      "flexible-modules": [
        {
          "slot-name": "<string>",
          "slot-sku": "JL083A"
        },
        {
          "slot-name": "<string>",
          "slot-sku": "JL083A"
        }
      ],
      "chassis-name": "<string>",
      "description": "<string>",
      "allow-v2-modules": "true",
      "platform": "PLATFORM_4100I"
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

