# Initiate a Ping test on a CX Switch

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/cx/:serial-number/ping`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Content-Type | application/json |  |
| Accept | application/json |  |

### Request Body

```json
{
  "destination": "www.google.com"
}
```
### Response Examples

#### Accepted. The operation has been successfully initiated. The response includes the location to track the operation's status.

**Status:** 202 Accepted

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "location": "/network-troubleshooting/v1alpha1/cx/{serial-number}/ping/async-operations/{task-id}",
  "status": "INITIATED",
  "startTime": "2025-04-09T10:00:00Z"
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

#### Accepted. The operation has been successfully initiated. The response includes the location to track the operation's status.

**Status:** 202 Accepted

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "location": "/network-troubleshooting/v1alpha1/cx/{serial-number}/ping/async-operations/{task-id}",
  "status": "INITIATED",
  "startTime": "2025-04-09T10:00:00Z"
}
```
---

