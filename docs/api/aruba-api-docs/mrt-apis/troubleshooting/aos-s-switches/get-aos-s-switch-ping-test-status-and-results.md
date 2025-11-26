# Get AOS-S Switch Ping test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/aos-s/:serial-number/ping/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the AOS-S Switch Ping test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "endTime": "2025-05-21T05:10:26.892804343Z",
  "status": "COMPLETED",
  "output": {
    "maximumRoundTripTimeMilliseconds": "8",
    "transmittedPacketsCount": "5",
    "replies": [
      {
        "sentPacketAddress": "8.8.8.8",
        "sentPacketIcmpSequenceNumber": "1",
        "sentPacketTimeMilliseconds": "8"
      },
      {
        "sentPacketAddress": "8.8.8.8",
        "sentPacketIcmpSequenceNumber": "2",
        "sentPacketTimeMilliseconds": "8"
      },
      {
        "sentPacketAddress": "8.8.8.8",
        "sentPacketIcmpSequenceNumber": "3",
        "sentPacketTimeMilliseconds": "8"
      },
      {
        "sentPacketAddress": "8.8.8.8",
        "sentPacketIcmpSequenceNumber": "4",
        "sentPacketTimeMilliseconds": "7"
      },
      {
        "sentPacketAddress": "8.8.8.8",
        "sentPacketIcmpSequenceNumber": "5",
        "sentPacketTimeMilliseconds": "8"
      }
    ],
    "receivedPacketsCount": "5",
    "packetLossPercent": "0",
    "minimumRoundTripTimeMilliseconds": "7",
    "averageRoundTripTimeMilliseconds": "7"
  },
  "progressPercent": 100,
  "rawOutput": "\nping 8.8.8.8 repetitions 5\n8.8.8.8 is alive, iteration 1, time = 8 ms\n8.8.8.8 is alive, iteration 2, time = 8 ms\n8.8.8.8 is alive, iteration 3, time = 8 ms\n8.8.8.8 is alive, iteration 4, time = 7 ms\n8.8.8.8 is alive, iteration 5, time = 8 ms\n5 packets transmitted, 5 packets received, 0% packet loss\nround-trip (ms) min/avg/max = 7/7/8\n\n",
  "startTime": "2025-05-21T05:10:20.861006578Z",
  "failReason": null
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

#### OK. Returns the status and results of the AOS-S Switch Ping test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "endTime": "2025-05-21T05:10:26.892804343Z",
  "status": "COMPLETED",
  "output": {
    "maximumRoundTripTimeMilliseconds": "8",
    "transmittedPacketsCount": "5",
    "replies": [
      {
        "sentPacketAddress": "8.8.8.8",
        "sentPacketIcmpSequenceNumber": "1",
        "sentPacketTimeMilliseconds": "8"
      },
      {
        "sentPacketAddress": "8.8.8.8",
        "sentPacketIcmpSequenceNumber": "2",
        "sentPacketTimeMilliseconds": "8"
      },
      {
        "sentPacketAddress": "8.8.8.8",
        "sentPacketIcmpSequenceNumber": "3",
        "sentPacketTimeMilliseconds": "8"
      },
      {
        "sentPacketAddress": "8.8.8.8",
        "sentPacketIcmpSequenceNumber": "4",
        "sentPacketTimeMilliseconds": "7"
      },
      {
        "sentPacketAddress": "8.8.8.8",
        "sentPacketIcmpSequenceNumber": "5",
        "sentPacketTimeMilliseconds": "8"
      }
    ],
    "receivedPacketsCount": "5",
    "packetLossPercent": "0",
    "minimumRoundTripTimeMilliseconds": "7",
    "averageRoundTripTimeMilliseconds": "7"
  },
  "progressPercent": 100,
  "rawOutput": "\nping 8.8.8.8 repetitions 5\n8.8.8.8 is alive, iteration 1, time = 8 ms\n8.8.8.8 is alive, iteration 2, time = 8 ms\n8.8.8.8 is alive, iteration 3, time = 8 ms\n8.8.8.8 is alive, iteration 4, time = 7 ms\n8.8.8.8 is alive, iteration 5, time = 8 ms\n5 packets transmitted, 5 packets received, 0% packet loss\nround-trip (ms) min/avg/max = 7/7/8\n\n",
  "startTime": "2025-05-21T05:10:20.861006578Z",
  "failReason": null
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

