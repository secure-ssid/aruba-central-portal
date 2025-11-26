# Get CX Switch Cable Test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/cx/:serial-number/cableTest/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the CX Switch Cable Test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "output": {
    "results": [
      {
        "cablePairDiagnostics": [
          {
            "pairName": "7-8",
            "length": "0",
            "status": "Good",
            "accuracy": "10"
          },
          {
            "pairName": "1-2",
            "length": "0",
            "status": "Good",
            "accuracy": "10"
          },
          {
            "pairName": "3-6",
            "length": "0",
            "status": "Good",
            "accuracy": "10"
          },
          {
            "pairName": "4-5",
            "length": "0",
            "status": "Good",
            "accuracy": "10"
          }
        ],
        "interfaceName": "1/1/1",
        "state": "complete"
      }
    ],
    "ports": [
      "1/1/1"
    ]
  },
  "progressPercent": 100,
  "startTime": "2025-05-20T09:32:26.217392470Z",
  "failReason": null,
  "status": "COMPLETED",
  "endTime": "2025-05-20T09:32:57.201302340Z"
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

#### OK. Returns the status and results of the CX Switch Cable Test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "output": {
    "results": [
      {
        "cablePairDiagnostics": [
          {
            "pairName": "7-8",
            "length": "0",
            "status": "Good",
            "accuracy": "10"
          },
          {
            "pairName": "1-2",
            "length": "0",
            "status": "Good",
            "accuracy": "10"
          },
          {
            "pairName": "3-6",
            "length": "0",
            "status": "Good",
            "accuracy": "10"
          },
          {
            "pairName": "4-5",
            "length": "0",
            "status": "Good",
            "accuracy": "10"
          }
        ],
        "interfaceName": "1/1/1",
        "state": "complete"
      }
    ],
    "ports": [
      "1/1/1"
    ]
  },
  "progressPercent": 100,
  "startTime": "2025-05-20T09:32:26.217392470Z",
  "failReason": null,
  "status": "COMPLETED",
  "endTime": "2025-05-20T09:32:57.201302340Z"
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

