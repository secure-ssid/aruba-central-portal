# Import MAC csv file

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-config/v1alpha1/cnac-mac-reg/import`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Content-Type | multipart/form-data |  |
| Accept | application/json |  |

### Request Body

**Form Data:**

- **file**: The file to be imported

### Response Examples

#### Success. The file has been imported and the import job has started.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "jobid": [
    "<string>",
    "<string>"
  ]
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

#### File not found.

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "debugId": "<string>",
  "errorCode": "HPE_GL_ERROR_NOT_FOUND",
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

#### Unexpected error - An unspecified error occurred.

**Status:** 500 Internal Server Error

---

