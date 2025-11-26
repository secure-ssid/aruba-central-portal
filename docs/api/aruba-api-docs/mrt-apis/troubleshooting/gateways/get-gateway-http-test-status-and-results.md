# Get Gateway Http test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/gateways/:serial-number/http/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the Gateway Http test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T14:06:28.690974183Z",
  "endTime": "2025-05-20T14:06:31.154766496Z",
  "progressPercent": 100,
  "output": {
    "successRatePercent": "100",
    "url": "www.google.com",
    "minimumLatencyMilliseconds": "331",
    "averageLatencyMilliseconds": "407",
    "responses": [
      {
        "responseNumber": "1",
        "responseBytes": "19556",
        "responseTimeMilliseconds": "340",
        "downloadRate": "57.52KB/sec",
        "responseCode": "200/OK"
      },
      {
        "responseNumber": "2",
        "responseBytes": "19521",
        "responseTimeMilliseconds": "654",
        "downloadRate": "29.85KB/sec",
        "responseCode": "200/OK"
      },
      {
        "responseNumber": "3",
        "responseBytes": "20035",
        "responseTimeMilliseconds": "349",
        "downloadRate": "57.57KB/sec",
        "responseCode": "200/OK"
      },
      {
        "responseNumber": "4",
        "responseBytes": "19568",
        "responseTimeMilliseconds": "362",
        "downloadRate": "54.06KB/sec",
        "responseCode": "200/OK"
      },
      {
        "responseNumber": "5",
        "responseBytes": "19583",
        "responseTimeMilliseconds": "331",
        "downloadRate": "59.16KB/sec",
        "responseCode": "200/OK"
      }
    ],
    "maximumLatencyMilliseconds": "654",
    "sentPacketsCount": "5",
    "receivedPacketsCount": "5"
  },
  "status": "COMPLETED",
  "failReason": null,
  "rawOutput": "\nPinging 'www.google.com'\n\nPress 'q' to abort.\r\n1> Reply: [200/OK] bytes=19556 time=340ms Rate=57.52KB/sec\n2> Reply: [200/OK] bytes=19521 time=654ms Rate=29.85KB/sec\n3> Reply: [200/OK] bytes=20035 time=349ms Rate=57.57KB/sec\n4> Reply: [200/OK] bytes=19568 time=362ms Rate=54.06KB/sec\n5> Reply: [200/OK] bytes=19583 time=331ms Rate=59.16KB/sec\n\nPing Statistics for www.google.com\nPackets: Sent : 5 Received : 5 Success Rate is 100 percent (5/5)\nApproximate round trip time : max/avg/min = 654/407/331 ms\n"
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

#### OK. Returns the status and results of the Gateway Http test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T14:06:28.690974183Z",
  "endTime": "2025-05-20T14:06:31.154766496Z",
  "progressPercent": 100,
  "output": {
    "successRatePercent": "100",
    "url": "www.google.com",
    "minimumLatencyMilliseconds": "331",
    "averageLatencyMilliseconds": "407",
    "responses": [
      {
        "responseNumber": "1",
        "responseBytes": "19556",
        "responseTimeMilliseconds": "340",
        "downloadRate": "57.52KB/sec",
        "responseCode": "200/OK"
      },
      {
        "responseNumber": "2",
        "responseBytes": "19521",
        "responseTimeMilliseconds": "654",
        "downloadRate": "29.85KB/sec",
        "responseCode": "200/OK"
      },
      {
        "responseNumber": "3",
        "responseBytes": "20035",
        "responseTimeMilliseconds": "349",
        "downloadRate": "57.57KB/sec",
        "responseCode": "200/OK"
      },
      {
        "responseNumber": "4",
        "responseBytes": "19568",
        "responseTimeMilliseconds": "362",
        "downloadRate": "54.06KB/sec",
        "responseCode": "200/OK"
      },
      {
        "responseNumber": "5",
        "responseBytes": "19583",
        "responseTimeMilliseconds": "331",
        "downloadRate": "59.16KB/sec",
        "responseCode": "200/OK"
      }
    ],
    "maximumLatencyMilliseconds": "654",
    "sentPacketsCount": "5",
    "receivedPacketsCount": "5"
  },
  "status": "COMPLETED",
  "failReason": null,
  "rawOutput": "\nPinging 'www.google.com'\n\nPress 'q' to abort.\r\n1> Reply: [200/OK] bytes=19556 time=340ms Rate=57.52KB/sec\n2> Reply: [200/OK] bytes=19521 time=654ms Rate=29.85KB/sec\n3> Reply: [200/OK] bytes=20035 time=349ms Rate=57.57KB/sec\n4> Reply: [200/OK] bytes=19568 time=362ms Rate=54.06KB/sec\n5> Reply: [200/OK] bytes=19583 time=331ms Rate=59.16KB/sec\n\nPing Statistics for www.google.com\nPackets: Sent : 5 Received : 5 Success Rate is 100 percent (5/5)\nApproximate round trip time : max/avg/min = 654/407/331 ms\n"
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

