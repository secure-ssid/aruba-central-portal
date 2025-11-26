# Get AP Get Arp Table test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/aps/:serial-number/getArpTable/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the AP Get Arp Table test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T13:25:03.610188852Z",
  "endTime": "2025-05-20T13:25:03.920485478Z",
  "rawOutput": "\nCOMMAND=show arp\nIP address       HW type     Flags       HW address            Mask     Device\n172.31.98.18     0x1         0x2         a4:83:e7:18:ec:9f     *        br0.3333\n10.27.113.225    0x1         0x2         ec:eb:b8:19:aa:00     *        br0\n10.27.113.226    0x1         0x2         20:4c:03:11:f3:90     *        br0\n172.31.98.36     0x1         0x0         00:00:00:00:00:00     *        br0.3333\n172.31.98.2      0x1         0x6         c8:b5:ad:c3:b2:02     *        br0.3333\n",
  "output": {
    "entries": [
      {
        "macAddress": "a4:83:e7:18:ec:9f",
        "mask": "*",
        "ipAddress": "172.31.98.18",
        "device": "br0.3333",
        "hardwareType": "0x1",
        "flags": "0x2"
      },
      {
        "macAddress": "ec:eb:b8:19:aa:00",
        "mask": "*",
        "ipAddress": "10.27.113.225",
        "device": "br0",
        "hardwareType": "0x1",
        "flags": "0x2"
      },
      {
        "macAddress": "20:4c:03:11:f3:90",
        "mask": "*",
        "ipAddress": "10.27.113.226",
        "device": "br0",
        "hardwareType": "0x1",
        "flags": "0x2"
      },
      {
        "macAddress": "00:00:00:00:00:00",
        "mask": "*",
        "ipAddress": "172.31.98.36",
        "device": "br0.3333",
        "hardwareType": "0x1",
        "flags": "0x0"
      },
      {
        "macAddress": "c8:b5:ad:c3:b2:02",
        "mask": "*",
        "ipAddress": "172.31.98.2",
        "device": "br0.3333",
        "hardwareType": "0x1",
        "flags": "0x6"
      }
    ]
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

#### OK. Returns the status and results of the AP Get Arp Table test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T13:25:03.610188852Z",
  "endTime": "2025-05-20T13:25:03.920485478Z",
  "rawOutput": "\nCOMMAND=show arp\nIP address       HW type     Flags       HW address            Mask     Device\n172.31.98.18     0x1         0x2         a4:83:e7:18:ec:9f     *        br0.3333\n10.27.113.225    0x1         0x2         ec:eb:b8:19:aa:00     *        br0\n10.27.113.226    0x1         0x2         20:4c:03:11:f3:90     *        br0\n172.31.98.36     0x1         0x0         00:00:00:00:00:00     *        br0.3333\n172.31.98.2      0x1         0x6         c8:b5:ad:c3:b2:02     *        br0.3333\n",
  "output": {
    "entries": [
      {
        "macAddress": "a4:83:e7:18:ec:9f",
        "mask": "*",
        "ipAddress": "172.31.98.18",
        "device": "br0.3333",
        "hardwareType": "0x1",
        "flags": "0x2"
      },
      {
        "macAddress": "ec:eb:b8:19:aa:00",
        "mask": "*",
        "ipAddress": "10.27.113.225",
        "device": "br0",
        "hardwareType": "0x1",
        "flags": "0x2"
      },
      {
        "macAddress": "20:4c:03:11:f3:90",
        "mask": "*",
        "ipAddress": "10.27.113.226",
        "device": "br0",
        "hardwareType": "0x1",
        "flags": "0x2"
      },
      {
        "macAddress": "00:00:00:00:00:00",
        "mask": "*",
        "ipAddress": "172.31.98.36",
        "device": "br0.3333",
        "hardwareType": "0x1",
        "flags": "0x0"
      },
      {
        "macAddress": "c8:b5:ad:c3:b2:02",
        "mask": "*",
        "ipAddress": "172.31.98.2",
        "device": "br0.3333",
        "hardwareType": "0x1",
        "flags": "0x6"
      }
    ]
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

