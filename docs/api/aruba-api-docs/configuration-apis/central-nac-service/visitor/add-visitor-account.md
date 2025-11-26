# Add visitor account

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-config/v1alpha1/cnac-visitor`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Content-Type | application/json |  |
| Accept | application/json |  |

### Request Body

```json
{
  "input": {
    "authSource": "<string>",
    "changeNotification": "<string>",
    "companyName": "<string>",
    "displayName": "<string>",
    "email": "<string>",
    "enable": "<boolean>",
    "expireAt": "<string>",
    "name": "<string>",
    "phone": "<string>",
    "vestaPasswordMethod": "<string>",
    "vestaPasswordParameter": "<string>"
  }
}
```
### Response Examples

#### Success. The Visitor account has been created successfully.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "authSource": "<string>",
  "companyName": "<string>",
  "createdAt": "<string>",
  "displayName": "<string>",
  "email": "<string>",
  "enable": "<boolean>",
  "expireAt": "<string>",
  "id": "<string>",
  "modifiedAt": "<string>",
  "name": "<string>",
  "phone": "<string>",
  "status": "<string>"
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

#### Conflict. The resource already exists.

**Status:** 409 Conflict

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "debugId": "<string>",
  "errorCode": "HPE_GL_ERROR_CONFLICT",
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

