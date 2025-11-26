# Retrieve Wall Types

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/wall-types`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Returns a list of wall types for a given tenant, including both standard walls and custom walls.

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
      "id": "16a-aad7-4070-8a19-fd6b8e1ff012",
      "type": "STANDARD",
      "name": "dry-wall",
      "code": "dry-wall",
      "attenuation": 80.34378469790595
    },
    {
      "id": "16a-aad7-4070-8a19-fd6b8e1ff012",
      "type": "STANDARD",
      "name": "dry-wall",
      "code": "dry-wall",
      "attenuation": 66.02856878485206
    }
  ],
  "count": 1,
  "defaultWallTypeId": "dry-wall"
}
```
---

#### Bad request.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 400,
  "errorCode": "HPE_GL_IAM_EXPIRED_TOKEN",
  "message": "Authentication error - the token was expired",
  "debugId": "abc-123-456"
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
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Invalid JWT token in Request",
  "debugId": "75d40213-6776-40ff-a959-89a7514ef7fc",
  "httpStatusCode": 401
}
```
---

#### Not found error.

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 404,
  "errorCode": "HPE_GL_ERROR_NOT_FOUND",
  "message": "Not Found",
  "debugId": "abc-123-456"
}
```
---

#### Too many requests.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 429,
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Too Many Requests.",
  "debugId": "abc-123-456"
}
```
---

#### Internal server error.

**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 500,
  "errorCode": "string",
  "message": "Internal Server Error",
  "debugId": "abc-123-456"
}
```
---

#### Internal server error.

**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 500,
  "errorCode": "string",
  "message": "Internal Server Error",
  "debugId": "abc-123-456"
}
```
---

#### Bad request.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 400,
  "errorCode": "HPE_GL_IAM_EXPIRED_TOKEN",
  "message": "Authentication error - the token was expired",
  "debugId": "abc-123-456"
}
```
---

#### Returns a list of wall types for a given tenant, including both standard walls and custom walls.

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
      "id": "16a-aad7-4070-8a19-fd6b8e1ff012",
      "type": "STANDARD",
      "name": "dry-wall",
      "code": "dry-wall",
      "attenuation": 80.34378469790595
    },
    {
      "id": "16a-aad7-4070-8a19-fd6b8e1ff012",
      "type": "STANDARD",
      "name": "dry-wall",
      "code": "dry-wall",
      "attenuation": 66.02856878485206
    }
  ],
  "count": 1,
  "defaultWallTypeId": "dry-wall"
}
```
---

#### Too many requests.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 429,
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Too Many Requests.",
  "debugId": "abc-123-456"
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
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Invalid JWT token in Request",
  "debugId": "75d40213-6776-40ff-a959-89a7514ef7fc",
  "httpStatusCode": 401
}
```
---

#### Not found error.

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 404,
  "errorCode": "HPE_GL_ERROR_NOT_FOUND",
  "message": "Not Found",
  "debugId": "abc-123-456"
}
```
---

