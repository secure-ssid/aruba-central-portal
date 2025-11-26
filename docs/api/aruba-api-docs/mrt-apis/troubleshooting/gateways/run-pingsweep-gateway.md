# Run PingSweep (Gateway)

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/gateways/:serial-number/pingSweep`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Content-Type | application/json |  |
| Accept | application/json |  |

### Request Body

```json
{
  "destination": "1.1.1.1",
  "count": 2,
  "startPacketSize": 10,
  "endPacketSize": 50,
  "sweepInterval": 10
}
```
### Response Examples

#### Accepted. Operation initiated; poll the provided location for status/result.

**Status:** 202 Accepted

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "location": "/network-troubleshooting/v1alpha1/gateways/{serial-number}/pingSweep/async-operations/{task-id}",
  "status": "INITIATED",
  "startTime": "2025-09-18T10:00:00Z"
}
```
---

#### Bad Request

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_BAD_REQUEST",
  "message": "The total number of ICMP requests should be between 1 to 100"
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

#### Not Found. The device with the specified serial number was not found.

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_DEVICE_NOT_FOUND",
  "message": "Device not found: CXXYYZZ001"
}
```
---

#### Conflict. The device is currently offline.

**Status:** 409 Conflict

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_DEVICE_OFFLINE",
  "message": "Device offline: CXXYYZZ001"
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

#### Conflict. The device is currently offline.

**Status:** 409 Conflict

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_DEVICE_OFFLINE",
  "message": "Device offline: CXXYYZZ001"
}
```
---

#### Not Found. The device with the specified serial number was not found.

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_DEVICE_NOT_FOUND",
  "message": "Device not found: CXXYYZZ001"
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

#### Bad Request

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_BAD_REQUEST",
  "message": "The total number of ICMP requests should be between 1 to 100"
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

#### Accepted. Operation initiated; poll the provided location for status/result.

**Status:** 202 Accepted

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "location": "/network-troubleshooting/v1alpha1/gateways/{serial-number}/pingSweep/async-operations/{task-id}",
  "status": "INITIATED",
  "startTime": "2025-09-18T10:00:00Z"
}
```
---

