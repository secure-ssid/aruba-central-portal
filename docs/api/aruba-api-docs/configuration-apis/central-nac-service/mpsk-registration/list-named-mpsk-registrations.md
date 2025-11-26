# List Named MPSK registrations

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/cnac-named-mpsk-reg`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Success. Returns list of registered named MPSKs along with their details and associated
pagination information.


**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "count": "<long>",
  "items": [
    {
      "id": "<string>",
      "type": "<string>",
      "createdAt": "<string>",
      "enable": "<boolean>",
      "modifiedAt": "<string>",
      "mpsk": "<string>",
      "name": "<string>",
      "network": "<string>",
      "userRole": "<string>"
    },
    {
      "id": "<string>",
      "type": "<string>",
      "createdAt": "<string>",
      "enable": "<boolean>",
      "modifiedAt": "<string>",
      "mpsk": "<string>",
      "name": "<string>",
      "network": "<string>",
      "userRole": "<string>"
    }
  ],
  "mpsks": [
    {
      "id": "<string>",
      "type": "<string>",
      "createdAt": "<string>",
      "enable": "<boolean>",
      "modifiedAt": "<string>",
      "mpsk": "<string>",
      "name": "<string>",
      "network": "<string>",
      "userRole": "<string>"
    },
    {
      "id": "<string>",
      "type": "<string>",
      "createdAt": "<string>",
      "enable": "<boolean>",
      "modifiedAt": "<string>",
      "mpsk": "<string>",
      "name": "<string>",
      "network": "<string>",
      "userRole": "<string>"
    }
  ],
  "next": "<string>",
  "page": {
    "count": "<long>",
    "cursor": "<string>",
    "limit": "<long>"
  },
  "total": "<long>"
}
```
---

#### Bad request. The request is malformed or invalid input received.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "debugId": "<string>",
  "errorCode": "HPE_GL_ERROR_MISSING_IDENTIFIER",
  "httpStatusCode": "<long>",
  "message": "<string>"
}
```
---

#### Unauthorized access.

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "debugId": "<string>",
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "httpStatusCode": "<long>",
  "message": "<string>"
}
```
---

#### Forbidden. Access is denied.

**Status:** 403 Forbidden

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "debugId": "<string>",
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "httpStatusCode": "<long>",
  "message": "<string>"
}
```
---

#### Too many requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "debugId": "<string>",
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "httpStatusCode": "<long>",
  "message": "<string>"
}
```
---

#### Internal server error.

**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "debugId": "<string>",
  "errorCode": "HPE_GL_ERROR_INTERNAL_SERVER_ERROR",
  "httpStatusCode": "<long>",
  "message": "<string>"
}
```
---

#### Service unavailable. The server is temporarily unavailable.

**Status:** 503 Service Unavailable

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "debugId": "<string>",
  "errorCode": "HPE_GL_ERROR_SERVICE_UNAVAILABLE",
  "httpStatusCode": "<long>",
  "message": "<string>"
}
```
---

