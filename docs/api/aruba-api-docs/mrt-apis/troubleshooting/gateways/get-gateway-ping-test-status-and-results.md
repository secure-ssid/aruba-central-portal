# Get Gateway Ping test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/gateways/:serial-number/ping/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the Gateway Ping test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "output": {
    "packetSizeBytes": "92",
    "timeoutSeconds": "2",
    "successRatePercent": "100",
    "sentPacketsCount": "5",
    "receivedPacketsCount": "5",
    "minimumLatencyMilliseconds": "200.873",
    "destination": "142.251.214.132",
    "averageLatencyMilliseconds": "207.567",
    "maximumLatencyMilliseconds": "211.744"
  },
  "progressPercent": 100,
  "rawOutput": "\r\n! - Success  . - Failure  D - Duplicate Response\r\n\rPress 'q' to abort.\r\nSending 5, 92-byte ICMP Echos to 142.251.214.132, timeout is 2 seconds:\r\n!!!!!\r\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 200.873/207.567/211.744 ms\n\r\n",
  "startTime": "2025-05-20T13:34:57.099357263Z",
  "failReason": null,
  "status": "COMPLETED",
  "endTime": "2025-05-20T13:35:00.211569256Z"
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

#### OK. Returns the status and results of the Gateway Ping test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "output": {
    "packetSizeBytes": "92",
    "timeoutSeconds": "2",
    "successRatePercent": "100",
    "sentPacketsCount": "5",
    "receivedPacketsCount": "5",
    "minimumLatencyMilliseconds": "200.873",
    "destination": "142.251.214.132",
    "averageLatencyMilliseconds": "207.567",
    "maximumLatencyMilliseconds": "211.744"
  },
  "progressPercent": 100,
  "rawOutput": "\r\n! - Success  . - Failure  D - Duplicate Response\r\n\rPress 'q' to abort.\r\nSending 5, 92-byte ICMP Echos to 142.251.214.132, timeout is 2 seconds:\r\n!!!!!\r\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 200.873/207.567/211.744 ms\n\r\n",
  "startTime": "2025-05-20T13:34:57.099357263Z",
  "failReason": null,
  "status": "COMPLETED",
  "endTime": "2025-05-20T13:35:00.211569256Z"
}
```
---

