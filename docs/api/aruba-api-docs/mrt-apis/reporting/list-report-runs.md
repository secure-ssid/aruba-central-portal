# List Report Runs

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-reporting/v1alpha1/reports/:report-id/report-runs`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### List Report runs Response 


**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "report": {
    "id": 1840,
    "name": "Inventory Report",
    "reportScope": {
      "scopeType": "sites",
      "values": [
        "1234567",
        "7554321"
      ]
    },
    "reportType": "inventory",
    "createdBy": "user1@mail.com",
    "createdAt": "2019-10-12T07:20:50Z",
    "lastModifiedBy": "user1@mail.com",
    "lastModifiedAt": "2019-10-12T07:20:50Z",
    "reportSchedule": {
      "scheduleType": "ONE_TIME",
      "lastRunTs": "2019-10-12T07:20:50Z",
      "lastRunStatus": "COMPLETED",
      "nextRunTs": "2019-10-12T07:20:50Z",
      "completedRuns": 91,
      "totalRuns": 181,
      "scheduleEnd": "2019-10-12T07:20:50Z"
    }
  },
  "items": [
    {
      "id": 7740,
      "fromTs": "2019-10-12T07:20:50Z",
      "toTs": "2019-10-12T07:20:50Z",
      "status": "COMPLETED",
      "modifiedAt": "2019-10-12T07:20:50Z",
      "exportDetails": [
        {
          "exportType": "CSV",
          "status": "COMPLETED"
        },
        {
          "exportType": "CSV",
          "status": "COMPLETED"
        }
      ]
    },
    {
      "id": 3000,
      "fromTs": "2019-10-12T07:20:50Z",
      "toTs": "2019-10-12T07:20:50Z",
      "status": "COMPLETED",
      "modifiedAt": "2019-10-12T07:20:50Z",
      "exportDetails": [
        {
          "exportType": "CSV",
          "status": "COMPLETED"
        },
        {
          "exportType": "CSV",
          "status": "COMPLETED"
        }
      ]
    }
  ],
  "count": 1,
  "total": 1,
  "next": 1
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

#### List Report runs Response 


**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 1883225208298528800
- `X-RateLimit-Remaining`: 1883225208298528800
- `X-RateLimit-Reset`: 1979-08-29T03:43:55.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "report": {
    "id": 1840,
    "name": "Inventory Report",
    "reportScope": {
      "scopeType": "sites",
      "values": [
        "1234567",
        "7554321"
      ]
    },
    "reportType": "inventory",
    "createdBy": "user1@mail.com",
    "createdAt": "2019-10-12T07:20:50Z",
    "lastModifiedBy": "user1@mail.com",
    "lastModifiedAt": "2019-10-12T07:20:50Z",
    "reportSchedule": {
      "scheduleType": "ONE_TIME",
      "lastRunTs": "2019-10-12T07:20:50Z",
      "lastRunStatus": "COMPLETED",
      "nextRunTs": "2019-10-12T07:20:50Z",
      "completedRuns": 91,
      "totalRuns": 181,
      "scheduleEnd": "2019-10-12T07:20:50Z"
    }
  },
  "items": [
    {
      "id": 7740,
      "fromTs": "2019-10-12T07:20:50Z",
      "toTs": "2019-10-12T07:20:50Z",
      "status": "COMPLETED",
      "modifiedAt": "2019-10-12T07:20:50Z",
      "exportDetails": [
        {
          "exportType": "CSV",
          "status": "COMPLETED"
        },
        {
          "exportType": "CSV",
          "status": "COMPLETED"
        }
      ]
    },
    {
      "id": 3000,
      "fromTs": "2019-10-12T07:20:50Z",
      "toTs": "2019-10-12T07:20:50Z",
      "status": "COMPLETED",
      "modifiedAt": "2019-10-12T07:20:50Z",
      "exportDetails": [
        {
          "exportType": "CSV",
          "status": "COMPLETED"
        },
        {
          "exportType": "CSV",
          "status": "COMPLETED"
        }
      ]
    }
  ],
  "count": 1,
  "total": 1,
  "next": 1
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

