# Reboot a Gateway

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/gateways/:serial-number/reboot`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Accepted. The reboot action has been successfully initiated.

**Status:** 202 Accepted

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-06-25T08:31:15.380079232Z",
  "status": "INITIATED"
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

#### Conflict. The device is already performing reboot.

**Status:** 409 Conflict

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "summary": "Device Already Rebooting",
  "value": {
    "serviceName": "Troubleshooting",
    "httpStatusCode": "409",
    "message": "Device already rebooting: VN2ZLHB006",
    "code": "DOWNSTREAM_SERVICE_ERROR",
    "errorType": "CONFLICT",
    "errorCode": "HPE_GRAVITY_DEVICE_NOT_READY"
  }
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

#### Conflict. The device is already performing reboot.

**Status:** 409 Conflict

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "summary": "Device Already Rebooting",
  "value": {
    "serviceName": "Troubleshooting",
    "httpStatusCode": "409",
    "message": "Device already rebooting: VN2ZLHB006",
    "code": "DOWNSTREAM_SERVICE_ERROR",
    "errorType": "CONFLICT",
    "errorCode": "HPE_GRAVITY_DEVICE_NOT_READY"
  }
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

#### Accepted. The reboot action has been successfully initiated.

**Status:** 202 Accepted

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-06-25T08:31:15.380079232Z",
  "status": "INITIATED"
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

