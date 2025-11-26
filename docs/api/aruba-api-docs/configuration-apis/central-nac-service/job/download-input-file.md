# Download input file

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/cnac-job/:job-id/input`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Success - The input file has been downloaded successfully.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
<binary>
```
---

#### Bad request - the request is malformed or invalid.

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

#### Authorization information is missing or invalid.

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

#### Forbidden - not permitted to perform this action.

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

#### API rate limit exceeded - too many requests in a given period.

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

#### Internal server error - unexpected error occurred on the server.

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

#### Service unavailable - the server is temporarily unavailable.

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

