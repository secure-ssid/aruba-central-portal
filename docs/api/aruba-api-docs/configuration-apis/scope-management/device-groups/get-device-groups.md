# Get device-groups

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/device-groups?limit=<integer>&offset=<integer>`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| limit | <integer> | number of device-groups that needs to be fetched. (Default: 100) Maximum limit per query is 100 |
| offset | <integer> | offset from where the device-groups need to be fetched |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Returned device-groups list with its properties

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "items": [
    {
      "id": "<string>",
      "type": "<string>",
      "scopeName": "<string>",
      "scopeId": "<string>",
      "description": "<string>",
      "deviceCount": "<string>"
    },
    {
      "id": "<string>",
      "type": "<string>",
      "scopeName": "<string>",
      "scopeId": "<string>",
      "description": "<string>",
      "deviceCount": "<string>"
    }
  ],
  "count": "<integer>",
  "total": "<long>",
  "offset": "<string>",
  "response": {
    "code": "<string>",
    "status": "<string>",
    "message": "<string>"
  }
}
```
---

#### Invalid input received.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<integer>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "message": "<string>",
  "debugId": "<string>",
  "httpStatusCode": "<integer>"
}
```
---

#### Forbidden.

**Status:** 403 Forbidden

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "<string>",
  "debugId": "<string>",
  "httpStatusCode": "<integer>"
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "<string>",
  "debugId": "<string>",
  "httpStatusCode": "<integer>"
}
```
---

#### Internal Server Error.

**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "errorCode": "HPE_GL_ERROR_INTERNAL_SERVER_ERR",
  "message": "<string>",
  "debugId": "<string>",
  "httpStatusCode": "<integer>"
}
```
---

#### Unexpected error.

**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "errorCode": "HPE_GL_ERROR_BAD_REQUEST",
  "message": "<string>",
  "debugId": "<string>",
  "httpStatusCode": "<integer>"
}
```
---

