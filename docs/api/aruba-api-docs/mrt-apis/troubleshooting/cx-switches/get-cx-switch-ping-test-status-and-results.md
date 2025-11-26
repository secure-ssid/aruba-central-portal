# Get CX Switch Ping test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/cx/:serial-number/ping/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the CX Switch Ping test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "progressPercent": 100,
  "output": {
    "standardDeviationRoundTripTimeMilliseconds": "0.014",
    "totalRoundTripTimeMilliseconds": "4077",
    "replies": [
      {
        "sentPacketAddress": "10.1.1.10",
        "sentPacketIcmpSequenceNumber": "1",
        "sentPacketTimeToLive": "64",
        "sentPacketTimeMilliseconds": "0.447",
        "sentPacketSizeBytes": "108"
      },
      {
        "sentPacketAddress": "10.1.1.10",
        "sentPacketIcmpSequenceNumber": "2",
        "sentPacketTimeToLive": "64",
        "sentPacketTimeMilliseconds": "0.460",
        "sentPacketSizeBytes": "108"
      },
      {
        "sentPacketAddress": "10.1.1.10",
        "sentPacketIcmpSequenceNumber": "3",
        "sentPacketTimeToLive": "64",
        "sentPacketTimeMilliseconds": "0.478",
        "sentPacketSizeBytes": "108"
      },
      {
        "sentPacketAddress": "10.1.1.10",
        "sentPacketIcmpSequenceNumber": "4",
        "sentPacketTimeToLive": "64",
        "sentPacketTimeMilliseconds": "0.485",
        "sentPacketSizeBytes": "108"
      },
      {
        "sentPacketAddress": "10.1.1.10",
        "sentPacketIcmpSequenceNumber": "5",
        "sentPacketTimeToLive": "64",
        "sentPacketTimeMilliseconds": "0.452",
        "sentPacketSizeBytes": "108"
      }
    ],
    "averageRoundTripTimeMilliseconds": "0.464",
    "destination": "10.1.1.10",
    "transmittedPacketsCount": "5",
    "receivedPacketsCount": "5",
    "packetLossPercent": "0",
    "minimumRoundTripTimeMilliseconds": "0.447",
    "resolvedIp": "10.1.1.10",
    "maximumRoundTripTimeMilliseconds": "0.485"
  },
  "failReason": null,
  "startTime": "2025-05-20T09:38:36.390303695Z",
  "rawOutput": "PING 10.1.1.10 (10.1.1.10) 100(128) bytes of data.\n108 bytes from 10.1.1.10: icmp_seq=1 ttl=64 time=0.447 ms\n108 bytes from 10.1.1.10: icmp_seq=2 ttl=64 time=0.460 ms\n108 bytes from 10.1.1.10: icmp_seq=3 ttl=64 time=0.478 ms\n108 bytes from 10.1.1.10: icmp_seq=4 ttl=64 time=0.485 ms\n108 bytes from 10.1.1.10: icmp_seq=5 ttl=64 time=0.452 ms\n\n--- 10.1.1.10 ping statistics ---\n5 packets transmitted, 5 received, 0% packet loss, time 4077ms\nrtt min/avg/max/mdev = 0.447/0.464/0.485/0.014 ms\n",
  "status": "COMPLETED",
  "endTime": "2025-05-20T09:38:41.881905174Z"
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

#### OK. Returns the status and results of the CX Switch Ping test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "progressPercent": 100,
  "output": {
    "standardDeviationRoundTripTimeMilliseconds": "0.014",
    "totalRoundTripTimeMilliseconds": "4077",
    "replies": [
      {
        "sentPacketAddress": "10.1.1.10",
        "sentPacketIcmpSequenceNumber": "1",
        "sentPacketTimeToLive": "64",
        "sentPacketTimeMilliseconds": "0.447",
        "sentPacketSizeBytes": "108"
      },
      {
        "sentPacketAddress": "10.1.1.10",
        "sentPacketIcmpSequenceNumber": "2",
        "sentPacketTimeToLive": "64",
        "sentPacketTimeMilliseconds": "0.460",
        "sentPacketSizeBytes": "108"
      },
      {
        "sentPacketAddress": "10.1.1.10",
        "sentPacketIcmpSequenceNumber": "3",
        "sentPacketTimeToLive": "64",
        "sentPacketTimeMilliseconds": "0.478",
        "sentPacketSizeBytes": "108"
      },
      {
        "sentPacketAddress": "10.1.1.10",
        "sentPacketIcmpSequenceNumber": "4",
        "sentPacketTimeToLive": "64",
        "sentPacketTimeMilliseconds": "0.485",
        "sentPacketSizeBytes": "108"
      },
      {
        "sentPacketAddress": "10.1.1.10",
        "sentPacketIcmpSequenceNumber": "5",
        "sentPacketTimeToLive": "64",
        "sentPacketTimeMilliseconds": "0.452",
        "sentPacketSizeBytes": "108"
      }
    ],
    "averageRoundTripTimeMilliseconds": "0.464",
    "destination": "10.1.1.10",
    "transmittedPacketsCount": "5",
    "receivedPacketsCount": "5",
    "packetLossPercent": "0",
    "minimumRoundTripTimeMilliseconds": "0.447",
    "resolvedIp": "10.1.1.10",
    "maximumRoundTripTimeMilliseconds": "0.485"
  },
  "failReason": null,
  "startTime": "2025-05-20T09:38:36.390303695Z",
  "rawOutput": "PING 10.1.1.10 (10.1.1.10) 100(128) bytes of data.\n108 bytes from 10.1.1.10: icmp_seq=1 ttl=64 time=0.447 ms\n108 bytes from 10.1.1.10: icmp_seq=2 ttl=64 time=0.460 ms\n108 bytes from 10.1.1.10: icmp_seq=3 ttl=64 time=0.478 ms\n108 bytes from 10.1.1.10: icmp_seq=4 ttl=64 time=0.485 ms\n108 bytes from 10.1.1.10: icmp_seq=5 ttl=64 time=0.452 ms\n\n--- 10.1.1.10 ping statistics ---\n5 packets transmitted, 5 received, 0% packet loss, time 4077ms\nrtt min/avg/max/mdev = 0.447/0.464/0.485/0.014 ms\n",
  "status": "COMPLETED",
  "endTime": "2025-05-20T09:38:41.881905174Z"
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

