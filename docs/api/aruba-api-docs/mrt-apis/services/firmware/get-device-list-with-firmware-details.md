# Get device list with firmware details

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-services/v1alpha1/firmware-details`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### List of device's firmware details, including Access Points, Switches, Gateways and associated pagination information.


**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "count": 1,
  "items": [
    {
      "serialNumber": "AP00000001",
      "deviceName": "ap_1",
      "softwareVersion": "8.5.2.0_59123",
      "recommendedVersion": "8.5.2.0_59123",
      "upgradeStatus": "Up To Date",
      "firmwareClassification": "Bug Fix",
      "lastUpgradedTimeAt": "2023-10-10T10:10:10Z",
      "deviceType": "ACCESS_POINT",
      "siteId": "24833497",
      "id": "AP00000001",
      "type": "network-services/firmware-management"
    },
    {
      "serialNumber": "AP00000001",
      "deviceName": "ap_1",
      "softwareVersion": "8.5.2.0_59123",
      "recommendedVersion": "8.5.2.0_59123",
      "upgradeStatus": "Up To Date",
      "firmwareClassification": "Bug Fix",
      "lastUpgradedTimeAt": "2023-10-10T10:10:10Z",
      "deviceType": "ACCESS_POINT",
      "siteId": "24833497",
      "id": "AP00000001",
      "type": "network-services/firmware-management"
    }
  ],
  "next": "2",
  "total": 10
}
```
---

#### Bad Request

**Status:** 400 Bad Request

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 400,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INVALID_INPUT",
  "message": "Error Message",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 401,
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "message": "Error Message",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Forbidden: Access is denied.


**Status:** 403 Forbidden

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 403,
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Error Message",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 429,
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Error Message",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Internal server error.


**Status:** 500 Internal Server Error

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 500,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INTERNAL_SERVER_ERROR",
  "message": "Error Message",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 429,
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Error Message",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 401,
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "message": "Error Message",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Bad Request

**Status:** 400 Bad Request

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 400,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INVALID_INPUT",
  "message": "Error Message",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Internal server error.


**Status:** 500 Internal Server Error

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 500,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INTERNAL_SERVER_ERROR",
  "message": "Error Message",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### List of device's firmware details, including Access Points, Switches, Gateways and associated pagination information.


**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "count": 1,
  "items": [
    {
      "serialNumber": "AP00000001",
      "deviceName": "ap_1",
      "softwareVersion": "8.5.2.0_59123",
      "recommendedVersion": "8.5.2.0_59123",
      "upgradeStatus": "Up To Date",
      "firmwareClassification": "Bug Fix",
      "lastUpgradedTimeAt": "2023-10-10T10:10:10Z",
      "deviceType": "ACCESS_POINT",
      "siteId": "24833497",
      "id": "AP00000001",
      "type": "network-services/firmware-management"
    },
    {
      "serialNumber": "AP00000001",
      "deviceName": "ap_1",
      "softwareVersion": "8.5.2.0_59123",
      "recommendedVersion": "8.5.2.0_59123",
      "upgradeStatus": "Up To Date",
      "firmwareClassification": "Bug Fix",
      "lastUpgradedTimeAt": "2023-10-10T10:10:10Z",
      "deviceType": "ACCESS_POINT",
      "siteId": "24833497",
      "id": "AP00000001",
      "type": "network-services/firmware-management"
    }
  ],
  "next": "2",
  "total": 10
}
```
---

#### Forbidden: Access is denied.


**Status:** 403 Forbidden

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 403,
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Error Message",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

