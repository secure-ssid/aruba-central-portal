# Get Gateway Traceroute test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/gateways/:serial-number/traceroute/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the Gateway Traceroute test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "endTime": "2025-05-21T11:39:31.826643044Z",
  "status": "COMPLETED",
  "output": {
    "hops": [
      {
        "probes": [
          {
            "reverseDnsResolution": "10.97.118.2",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          },
          {
            "reverseDnsResolution": "10.97.118.2",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          },
          {
            "reverseDnsResolution": "10.97.118.2",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          }
        ],
        "hop": "1"
      },
      {
        "probes": [
          {
            "reverseDnsResolution": "10.97.112.1",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          },
          {
            "reverseDnsResolution": "10.97.112.1",
            "ipAddress": "null",
            "responseTimeMilliseconds": "0 ms"
          },
          {
            "reverseDnsResolution": "10.97.112.1",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          }
        ],
        "hop": "2"
      },
      {
        "probes": [],
        "hop": "3"
      },
      {
        "probes": [
          {
            "reverseDnsResolution": "10.186.172.153",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          },
          {
            "reverseDnsResolution": "10.186.172.153",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          },
          {
            "reverseDnsResolution": "10.186.172.153",
            "ipAddress": "null",
            "responseTimeMilliseconds": "0 ms"
          }
        ],
        "hop": "5"
      }
    ],
    "destination": "blrubshared-pdash.arubacorp.net"
  },
  "progressPercent": 100,
  "startTime": "2025-05-21T11:39:13.645841269Z",
  "failReason": null,
  "rawOutput": "\ntraceroute blrubshared-pdash.arubacorp.net\ntraceroute to 10.186.172.153 ,\n              1 hop min, 30 hops max, 5 sec. timeout, 3 probes\n 1 10.97.118.2           1 ms      1 ms      1 ms\n 2 10.97.112.1           1 ms      0 ms      1 ms\n 3  *  *  * \n 4 10.186.128.6          1 ms10.186.128.4          1 ms      1 ms\n 5 10.186.172.153        1 ms      1 ms      0 ms\n\n"
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

#### OK. Returns the status and results of the Gateway Traceroute test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "endTime": "2025-05-21T11:39:31.826643044Z",
  "status": "COMPLETED",
  "output": {
    "hops": [
      {
        "probes": [
          {
            "reverseDnsResolution": "10.97.118.2",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          },
          {
            "reverseDnsResolution": "10.97.118.2",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          },
          {
            "reverseDnsResolution": "10.97.118.2",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          }
        ],
        "hop": "1"
      },
      {
        "probes": [
          {
            "reverseDnsResolution": "10.97.112.1",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          },
          {
            "reverseDnsResolution": "10.97.112.1",
            "ipAddress": "null",
            "responseTimeMilliseconds": "0 ms"
          },
          {
            "reverseDnsResolution": "10.97.112.1",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          }
        ],
        "hop": "2"
      },
      {
        "probes": [],
        "hop": "3"
      },
      {
        "probes": [
          {
            "reverseDnsResolution": "10.186.172.153",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          },
          {
            "reverseDnsResolution": "10.186.172.153",
            "ipAddress": "null",
            "responseTimeMilliseconds": "1 ms"
          },
          {
            "reverseDnsResolution": "10.186.172.153",
            "ipAddress": "null",
            "responseTimeMilliseconds": "0 ms"
          }
        ],
        "hop": "5"
      }
    ],
    "destination": "blrubshared-pdash.arubacorp.net"
  },
  "progressPercent": 100,
  "startTime": "2025-05-21T11:39:13.645841269Z",
  "failReason": null,
  "rawOutput": "\ntraceroute blrubshared-pdash.arubacorp.net\ntraceroute to 10.186.172.153 ,\n              1 hop min, 30 hops max, 5 sec. timeout, 3 probes\n 1 10.97.118.2           1 ms      1 ms      1 ms\n 2 10.97.112.1           1 ms      0 ms      1 ms\n 3  *  *  * \n 4 10.186.128.6          1 ms10.186.128.4          1 ms      1 ms\n 5 10.186.172.153        1 ms      1 ms      0 ms\n\n"
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

