# Update site-collection

## Request

**Method:** `PUT`

**URL:** `{{baseUrl}}/network-config/v1alpha1/site-collections`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Content-Type | application/json |  |
| Accept | application/json |  |

### Request Body

```json
{
  "scopeId": "<string>",
  "scopeName": "<string>",
  "description": "<string>"
}
```
### Response Examples

#### Site-collection update successful and returns the scopeId of the Site-collection updated.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "items": [
    "<string>",
    "<string>"
  ],
  "code": "<string>",
  "status": "<string>",
  "message": "<string>"
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

