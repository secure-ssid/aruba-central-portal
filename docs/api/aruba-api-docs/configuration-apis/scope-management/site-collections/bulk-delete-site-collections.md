# Bulk delete site-collections

## Request

**Method:** `DELETE`

**URL:** `{{baseUrl}}/network-config/v1alpha1/site-collections/bulk`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Content-Type | application/json |  |
| Accept | application/json |  |

### Request Body

```json
{
  "items": [
    {
      "id": "<string>"
    },
    {
      "id": "<string>"
    }
  ]
}
```
### Response Examples

#### Site-collections deleted successfully

**Status:** 202 Accepted

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 
- `Location`: 

**Response Body:**

```json
{
  "code": "<string>",
  "status": "<string>",
  "message": "<string>",
  "items": [
    "<string>",
    "<string>"
  ]
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

