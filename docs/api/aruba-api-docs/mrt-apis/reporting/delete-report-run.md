# Delete Report Run

## Request

**Method:** `DELETE`

**URL:** `{{baseUrl}}/network-reporting/v1alpha1/reports/:report-id/report-runs/:report-run-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Status of report run deletion.

**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "status": "Success"
}
```
---

#### Invalid input received.

**Status:** 400 Bad Request

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 400,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INVALID_INPUT",
  "message": "Error message indicating the cause of the failure.",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 401,
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "message": "Error message indicating the cause of the failure.",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Forbidden: Access is denied.


**Status:** 403 Forbidden

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 403,
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Error message indicating the cause of the failure.",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Not Found error

**Status:** 404 Not Found

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 404,
  "errorCode": "HPE_GL_NETWORK_REPORTING_NOT_FOUND",
  "message": "Error message indicating the cause of the failure.",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 429,
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Error message indicating the cause of the failure.",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Internal server error.


**Status:** 500 Internal Server Error

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 500,
  "errorCode": "HPE_GL_NETWORK_REPORTING_INTERNAL_SERVER_ERROR",
  "message": "Error message indicating the cause of the failure.",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Not Found error

**Status:** 404 Not Found

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 404,
  "errorCode": "HPE_GL_NETWORK_REPORTING_NOT_FOUND",
  "message": "Error message indicating the cause of the failure.",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 429,
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Error message indicating the cause of the failure.",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Forbidden: Access is denied.


**Status:** 403 Forbidden

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 403,
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Error message indicating the cause of the failure.",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Internal server error.


**Status:** 500 Internal Server Error

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 500,
  "errorCode": "HPE_GL_NETWORK_REPORTING_INTERNAL_SERVER_ERROR",
  "message": "Error message indicating the cause of the failure.",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Invalid input received.

**Status:** 400 Bad Request

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 400,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INVALID_INPUT",
  "message": "Error message indicating the cause of the failure.",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Status of report run deletion.

**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "status": "Success"
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 401,
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "message": "Error message indicating the cause of the failure.",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

