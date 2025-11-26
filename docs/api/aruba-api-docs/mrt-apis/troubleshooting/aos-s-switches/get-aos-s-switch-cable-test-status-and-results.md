# Get AOS-S Switch Cable Test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/aos-s/:serial-number/cableTest/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the AOS-S Switch Cable Test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "endTime": "2025-05-21T04:49:40.514983412Z",
  "progressPercent": 100,
  "status": "COMPLETED",
  "startTime": "2025-05-21T04:49:39.372776208Z",
  "output": {
    "results": [
      {
        "cablePairDiagnostics": [
          {
            "length": "0",
            "status": "Open",
            "pairName": "1-2"
          },
          {
            "length": "0",
            "status": "Open",
            "pairName": "3-6"
          },
          {
            "length": "0",
            "status": "Open",
            "pairName": "4-5"
          },
          {
            "length": "0",
            "status": "Open",
            "pairName": "7-8"
          }
        ],
        "interfaceName": "3"
      },
      {
        "cablePairDiagnostics": [
          {
            "length": "0",
            "status": "Open",
            "pairName": "1-2"
          },
          {
            "length": "0",
            "status": "Open",
            "pairName": "3-6"
          },
          {
            "length": "0",
            "status": "Open",
            "pairName": "4-5"
          },
          {
            "length": "0",
            "status": "Open",
            "pairName": "7-8"
          }
        ],
        "interfaceName": "6"
      }
    ],
    "ports": [
      "3",
      "6"
    ]
  },
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

#### OK. Returns the status and results of the AOS-S Switch Cable Test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "endTime": "2025-05-21T04:49:40.514983412Z",
  "progressPercent": 100,
  "status": "COMPLETED",
  "startTime": "2025-05-21T04:49:39.372776208Z",
  "output": {
    "results": [
      {
        "cablePairDiagnostics": [
          {
            "length": "0",
            "status": "Open",
            "pairName": "1-2"
          },
          {
            "length": "0",
            "status": "Open",
            "pairName": "3-6"
          },
          {
            "length": "0",
            "status": "Open",
            "pairName": "4-5"
          },
          {
            "length": "0",
            "status": "Open",
            "pairName": "7-8"
          }
        ],
        "interfaceName": "3"
      },
      {
        "cablePairDiagnostics": [
          {
            "length": "0",
            "status": "Open",
            "pairName": "1-2"
          },
          {
            "length": "0",
            "status": "Open",
            "pairName": "3-6"
          },
          {
            "length": "0",
            "status": "Open",
            "pairName": "4-5"
          },
          {
            "length": "0",
            "status": "Open",
            "pairName": "7-8"
          }
        ],
        "interfaceName": "6"
      }
    ],
    "ports": [
      "3",
      "6"
    ]
  },
  "failReason": null
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

