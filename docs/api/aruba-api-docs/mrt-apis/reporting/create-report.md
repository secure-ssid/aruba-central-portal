# Create Report

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-reporting/v1alpha1/reports`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Content-Type | application/json |  |
| Accept | application/json |  |

### Request Body

```json
{
  "report": {
    "name": "Application Analytics Report",
    "type": "appAnalytics",
    "timeZone": "America/New_York",
    "filters": [
      {
        "filterType": "scope",
        "values": [
          "global"
        ]
      },
      {
        "filterType": "deviceTypes",
        "values": [
          "access_points"
        ]
      },
      {
        "filterType": "connectionType",
        "values": [
          "wireless"
        ]
      },
      {
        "filterType": "appCategories",
        "values": [
          "Any"
        ]
      }
    ],
    "reportPeriod": {
      "type": "LAST_WEEK"
    },
    "reportSchedule": {
      "recurrenceType": "EVERY_WEEK",
      "startDate": "2025-03-01T00:00:00Z",
      "endDate": "2025-06-01T00:00:00Z"
    },
    "email": {
      "recipients": [
        "user1@mail.com",
        "user2@mail.com"
      ],
      "formats": [
        "CSV",
        "PDF"
      ]
    }
  }
}
```
### Response Examples

#### Successful status of report creation

**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
true
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

#### Successful status of report creation

**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
true
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

