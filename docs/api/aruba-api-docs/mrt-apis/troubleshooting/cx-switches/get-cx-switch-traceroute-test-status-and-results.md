# Get CX Switch Traceroute test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/cx/:serial-number/traceroute/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the CX Switch Traceroute test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T09:40:10.047563489Z",
  "rawOutput": "traceroute to 10.1.1.10 (10.1.1.10), 1 hops min, 30 hops max, 3 sec. timeout, 3 probes\n  1   10.1.1.10  0.529ms  0.320ms  0.166ms \n",
  "output": {
    "resolvedIp": "10.1.1.10",
    "hops": [
      {
        "hop": "1",
        "probes": [
          {
            "ipAddress": "null",
            "reverseDnsResolution": "10.1.1.10",
            "responseTimeMilliseconds": "0.529ms"
          },
          {
            "ipAddress": "null",
            "reverseDnsResolution": "10.1.1.10",
            "responseTimeMilliseconds": "0.320ms"
          },
          {
            "ipAddress": "null",
            "reverseDnsResolution": "10.1.1.10",
            "responseTimeMilliseconds": "0.166ms"
          }
        ]
      }
    ],
    "destination": "10.1.1.10"
  },
  "status": "COMPLETED",
  "failReason": null,
  "progressPercent": 100,
  "endTime": "2025-05-20T09:40:11.490562492Z"
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

#### OK. Returns the status and results of the CX Switch Traceroute test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T09:40:10.047563489Z",
  "rawOutput": "traceroute to 10.1.1.10 (10.1.1.10), 1 hops min, 30 hops max, 3 sec. timeout, 3 probes\n  1   10.1.1.10  0.529ms  0.320ms  0.166ms \n",
  "output": {
    "resolvedIp": "10.1.1.10",
    "hops": [
      {
        "hop": "1",
        "probes": [
          {
            "ipAddress": "null",
            "reverseDnsResolution": "10.1.1.10",
            "responseTimeMilliseconds": "0.529ms"
          },
          {
            "ipAddress": "null",
            "reverseDnsResolution": "10.1.1.10",
            "responseTimeMilliseconds": "0.320ms"
          },
          {
            "ipAddress": "null",
            "reverseDnsResolution": "10.1.1.10",
            "responseTimeMilliseconds": "0.166ms"
          }
        ]
      }
    ],
    "destination": "10.1.1.10"
  },
  "status": "COMPLETED",
  "failReason": null,
  "progressPercent": 100,
  "endTime": "2025-05-20T09:40:11.490562492Z"
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

