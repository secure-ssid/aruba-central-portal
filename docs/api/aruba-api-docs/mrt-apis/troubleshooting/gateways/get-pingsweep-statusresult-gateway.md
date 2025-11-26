# Get PingSweep status/result (Gateway)

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/gateways/:serial-number/pingSweep/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns current status and, when completed, the full PingSweep output.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "status": "COMPLETED",
  "progressPercent": 100,
  "startTime": "2025-09-18T10:00:01Z",
  "endTime": "2025-09-18T10:00:05Z",
  "failReason": null,
  "output": {
    "destination": "1.1.1.1",
    "successRate": "100",
    "transmittedPacketsCount": "10",
    "receivedPacketsCount": "10",
    "minimumRoundTripTimeMilliseconds": "110.597",
    "averageRoundTripTimeMilliseconds": "110.767",
    "maximumRoundTripTimeMilliseconds": "110.88",
    "responses": [
      {
        "count": "1",
        "replies": [
          {
            "requestId": "1",
            "size": "10",
            "timedOut": false
          },
          {
            "requestId": "2",
            "size": "20",
            "timedOut": false
          },
          {
            "requestId": "3",
            "size": "30",
            "timedOut": false
          },
          {
            "requestId": "4",
            "size": "40",
            "timedOut": false
          },
          {
            "requestId": "5",
            "size": "50",
            "timedOut": false
          }
        ]
      },
      {
        "count": "2",
        "replies": [
          {
            "requestId": "6",
            "size": "10",
            "timedOut": false
          },
          {
            "requestId": "7",
            "size": "20",
            "timedOut": false
          },
          {
            "requestId": "8",
            "size": "30",
            "timedOut": false
          },
          {
            "requestId": "9",
            "size": "40",
            "timedOut": false
          },
          {
            "requestId": "10",
            "size": "50",
            "timedOut": false
          }
        ]
      }
    ]
  }
}
```
---

#### Bad Request. Validation errors in the request body or parameters, or invalid parameters for the specific device.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_BAD_REQUEST",
  "message": "Validation errors - packetSize must be between 10 and 2000"
}
```
---

#### Unauthorized. Authentication credentials are required or invalid.

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_UNAUTHORIZED",
  "message": "Authentication required."
}
```
---

#### Not Found. The specified async task ID or device serial was not found for this operation type.

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_TASK_NOT_FOUND",
  "message": "Async operation task not found: c7a3f2d1-e8a9-4b7c-8d1e-0f9a3b2c1d0e"
}
```
---

#### Too Many Requests. The user has sent too many requests in a given amount of time.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_TOO_MANY_REQUESTS",
  "message": "Rate limit exceeded."
}
```
---

#### Internal Server Error. An unexpected error occurred on the server.

**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred."
}
```
---

#### Internal Server Error. An unexpected error occurred on the server.

**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred."
}
```
---

#### Unauthorized. Authentication credentials are required or invalid.

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_UNAUTHORIZED",
  "message": "Authentication required."
}
```
---

#### Bad Request. Validation errors in the request body or parameters, or invalid parameters for the specific device.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_BAD_REQUEST",
  "message": "Validation errors - packetSize must be between 10 and 2000"
}
```
---

#### OK. Returns current status and, when completed, the full PingSweep output.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "status": "COMPLETED",
  "progressPercent": 100,
  "startTime": "2025-09-18T10:00:01Z",
  "endTime": "2025-09-18T10:00:05Z",
  "failReason": null,
  "output": {
    "destination": "1.1.1.1",
    "successRate": "100",
    "transmittedPacketsCount": "10",
    "receivedPacketsCount": "10",
    "minimumRoundTripTimeMilliseconds": "110.597",
    "averageRoundTripTimeMilliseconds": "110.767",
    "maximumRoundTripTimeMilliseconds": "110.88",
    "responses": [
      {
        "count": "1",
        "replies": [
          {
            "requestId": "1",
            "size": "10",
            "timedOut": false
          },
          {
            "requestId": "2",
            "size": "20",
            "timedOut": false
          },
          {
            "requestId": "3",
            "size": "30",
            "timedOut": false
          },
          {
            "requestId": "4",
            "size": "40",
            "timedOut": false
          },
          {
            "requestId": "5",
            "size": "50",
            "timedOut": false
          }
        ]
      },
      {
        "count": "2",
        "replies": [
          {
            "requestId": "6",
            "size": "10",
            "timedOut": false
          },
          {
            "requestId": "7",
            "size": "20",
            "timedOut": false
          },
          {
            "requestId": "8",
            "size": "30",
            "timedOut": false
          },
          {
            "requestId": "9",
            "size": "40",
            "timedOut": false
          },
          {
            "requestId": "10",
            "size": "50",
            "timedOut": false
          }
        ]
      }
    ]
  }
}
```
---

#### Not Found. The specified async task ID or device serial was not found for this operation type.

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_TASK_NOT_FOUND",
  "message": "Async operation task not found: c7a3f2d1-e8a9-4b7c-8d1e-0f9a3b2c1d0e"
}
```
---

#### Too Many Requests. The user has sent too many requests in a given amount of time.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_TOO_MANY_REQUESTS",
  "message": "Rate limit exceeded."
}
```
---

