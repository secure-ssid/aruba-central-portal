# Get AP Speedtest status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/aps/:serial-number/speedtest/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the AP Speedtest.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T13:19:36.125254066Z",
  "endTime": "2025-05-20T13:19:48.499847376Z",
  "progressPercent": 100,
  "output": {
    "iperfServerAddress": "84.17.57.129",
    "serverPort": "51118",
    "downstreamRetries": null,
    "upstreamDatagrams": null,
    "downstreamDatagrams": null,
    "upstreamJitter": null,
    "downstreamJitter": null,
    "upstreamLostPackets": null,
    "upstreamBytes": "21069984",
    "downstreamLostPackets": null,
    "upstreamBandwidthInMbps": "16.855683",
    "downstreamBandwidthInMbps": null,
    "intervalInSeconds": "10",
    "protocol": "TCP",
    "upstreamRetries": "1442",
    "downstreamBytes": null
  },
  "failReason": null,
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

#### OK. Returns the status and results of the AP Speedtest.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T13:19:36.125254066Z",
  "endTime": "2025-05-20T13:19:48.499847376Z",
  "progressPercent": 100,
  "output": {
    "iperfServerAddress": "84.17.57.129",
    "serverPort": "51118",
    "downstreamRetries": null,
    "upstreamDatagrams": null,
    "downstreamDatagrams": null,
    "upstreamJitter": null,
    "downstreamJitter": null,
    "upstreamLostPackets": null,
    "upstreamBytes": "21069984",
    "downstreamLostPackets": null,
    "upstreamBandwidthInMbps": "16.855683",
    "downstreamBandwidthInMbps": null,
    "intervalInSeconds": "10",
    "protocol": "TCP",
    "upstreamRetries": "1442",
    "downstreamBytes": null
  },
  "failReason": null,
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

