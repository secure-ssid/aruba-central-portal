# Get Gateway Get Arp Table test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/gateways/:serial-number/getArpTable/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the Gateway Get Arp Table test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "progressPercent": 100,
  "endTime": "2025-05-20T14:07:59.805075582Z",
  "failReason": null,
  "rawOutput": "\nARP Table\n---------\nProtocol  Address        Hardware Address   Interface\n--------  -------        ----------------   ---------\nInternet  ridge          02:42:a9:fe:80:04  docker_gwbridge\n\nInternet  10.27.119.177  94:f1:28:0c:77:00  vlan4094\n\n",
  "status": "COMPLETED",
  "output": {
    "entries": [
      {
        "address": "10.27.119.173",
        "protocol": "Internet",
        "interfaceAndPort": "docker_gwbridge",
        "macAddress": "02:42:a9:fe:80:04"
      },
      {
        "address": "10.27.119.177",
        "protocol": "Internet",
        "interfaceAndPort": "vlan4094",
        "macAddress": "94:f1:28:0c:77:00"
      }
    ]
  },
  "startTime": "2025-05-20T14:07:59.506787035Z"
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

#### OK. Returns the status and results of the Gateway Get Arp Table test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "progressPercent": 100,
  "endTime": "2025-05-20T14:07:59.805075582Z",
  "failReason": null,
  "rawOutput": "\nARP Table\n---------\nProtocol  Address        Hardware Address   Interface\n--------  -------        ----------------   ---------\nInternet  ridge          02:42:a9:fe:80:04  docker_gwbridge\n\nInternet  10.27.119.177  94:f1:28:0c:77:00  vlan4094\n\n",
  "status": "COMPLETED",
  "output": {
    "entries": [
      {
        "address": "10.27.119.173",
        "protocol": "Internet",
        "interfaceAndPort": "docker_gwbridge",
        "macAddress": "02:42:a9:fe:80:04"
      },
      {
        "address": "10.27.119.177",
        "protocol": "Internet",
        "interfaceAndPort": "vlan4094",
        "macAddress": "94:f1:28:0c:77:00"
      }
    ]
  },
  "startTime": "2025-05-20T14:07:59.506787035Z"
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

