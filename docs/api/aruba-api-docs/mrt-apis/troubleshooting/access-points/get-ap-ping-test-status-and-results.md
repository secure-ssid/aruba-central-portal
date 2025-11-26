# Get AP Ping test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/aps/:serial-number/ping/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the AP Ping test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T13:07:48.849780286Z",
  "endTime": "2025-05-20T13:08:04.034123064Z",
  "rawOutput": "\nCOMMAND=ping www.google.com\nPING 142.251.46.164 (142.251.46.164): 56 data bytes\n64 bytes from 142.251.46.164: icmp_seq=0 ttl=108 time=200.2 ms\n64 bytes from 142.251.46.164: icmp_seq=1 ttl=108 time=209.8 ms\n64 bytes from 142.251.46.164: icmp_seq=3 ttl=108 time=208.8 ms\n64 bytes from 142.251.46.164: icmp_seq=4 ttl=108 time=200.2 ms\n\n--- 142.251.46.164 ping statistics ---\n5 packets transmitted, 4 packets received, 20% packet loss\nround-trip min/avg/max = 200.2/204.7/209.8 ms\n",
  "output": {
    "receivedPacketsCount": "4",
    "packetLossPercent": "20",
    "minimumRoundTripTimeMilliseconds": "200.2",
    "maximumRoundTripTimeMilliseconds": "209.8",
    "replies": [
      {
        "sentPacketAddress": "142.251.46.164",
        "sentPacketIcmpSequenceNumber": "0",
        "sentPacketTimeToLive": "108",
        "sentPacketTimeMilliseconds": "200.2",
        "sentPacketSizeBytes": "64"
      },
      {
        "sentPacketAddress": "142.251.46.164",
        "sentPacketIcmpSequenceNumber": "1",
        "sentPacketTimeToLive": "108",
        "sentPacketTimeMilliseconds": "209.8",
        "sentPacketSizeBytes": "64"
      },
      {
        "sentPacketAddress": "142.251.46.164",
        "sentPacketIcmpSequenceNumber": "3",
        "sentPacketTimeToLive": "108",
        "sentPacketTimeMilliseconds": "208.8",
        "sentPacketSizeBytes": "64"
      },
      {
        "sentPacketAddress": "142.251.46.164",
        "sentPacketIcmpSequenceNumber": "4",
        "sentPacketTimeToLive": "108",
        "sentPacketTimeMilliseconds": "200.2",
        "sentPacketSizeBytes": "64"
      }
    ],
    "averageRoundTripTimeMilliseconds": "204.7",
    "destination": "www.google.com",
    "resolvedIp": "142.251.46.164",
    "transmittedPacketsCount": "5"
  },
  "failReason": null,
  "progressPercent": 100,
  "status": "COMPLETED"
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

#### OK. Returns the status and results of the AP Ping test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T13:07:48.849780286Z",
  "endTime": "2025-05-20T13:08:04.034123064Z",
  "rawOutput": "\nCOMMAND=ping www.google.com\nPING 142.251.46.164 (142.251.46.164): 56 data bytes\n64 bytes from 142.251.46.164: icmp_seq=0 ttl=108 time=200.2 ms\n64 bytes from 142.251.46.164: icmp_seq=1 ttl=108 time=209.8 ms\n64 bytes from 142.251.46.164: icmp_seq=3 ttl=108 time=208.8 ms\n64 bytes from 142.251.46.164: icmp_seq=4 ttl=108 time=200.2 ms\n\n--- 142.251.46.164 ping statistics ---\n5 packets transmitted, 4 packets received, 20% packet loss\nround-trip min/avg/max = 200.2/204.7/209.8 ms\n",
  "output": {
    "receivedPacketsCount": "4",
    "packetLossPercent": "20",
    "minimumRoundTripTimeMilliseconds": "200.2",
    "maximumRoundTripTimeMilliseconds": "209.8",
    "replies": [
      {
        "sentPacketAddress": "142.251.46.164",
        "sentPacketIcmpSequenceNumber": "0",
        "sentPacketTimeToLive": "108",
        "sentPacketTimeMilliseconds": "200.2",
        "sentPacketSizeBytes": "64"
      },
      {
        "sentPacketAddress": "142.251.46.164",
        "sentPacketIcmpSequenceNumber": "1",
        "sentPacketTimeToLive": "108",
        "sentPacketTimeMilliseconds": "209.8",
        "sentPacketSizeBytes": "64"
      },
      {
        "sentPacketAddress": "142.251.46.164",
        "sentPacketIcmpSequenceNumber": "3",
        "sentPacketTimeToLive": "108",
        "sentPacketTimeMilliseconds": "208.8",
        "sentPacketSizeBytes": "64"
      },
      {
        "sentPacketAddress": "142.251.46.164",
        "sentPacketIcmpSequenceNumber": "4",
        "sentPacketTimeToLive": "108",
        "sentPacketTimeMilliseconds": "200.2",
        "sentPacketSizeBytes": "64"
      }
    ],
    "averageRoundTripTimeMilliseconds": "204.7",
    "destination": "www.google.com",
    "resolvedIp": "142.251.46.164",
    "transmittedPacketsCount": "5"
  },
  "failReason": null,
  "progressPercent": 100,
  "status": "COMPLETED"
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

