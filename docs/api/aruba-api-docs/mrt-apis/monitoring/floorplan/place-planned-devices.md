# Place planned devices

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/sitemaps/:site-id/network-devices-planned`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Content-Type | application/json |  |
| Accept | application/json |  |

### Request Body

```json
{
  "devicesOnFloor": [
    {
      "floorId": "16a-aad7-4070-8a19-fd6b8e1ff012",
      "devices": [
        {
          "deviceType": "ACCESSPOINT",
          "deviceStatus": "PLANNED",
          "id": "string",
          "locationSource": "MANUAL",
          "geometryRelative": [
            574.9466349991286,
            1146.821443384888
          ],
          "properties": {
            "name": "string",
            "model": "AP-635"
          }
        },
        {
          "deviceType": "ACCESSPOINT",
          "deviceStatus": "PLANNED",
          "id": "string",
          "locationSource": "UNKNOWN",
          "geometryRelative": [
            1532.4416992632855,
            535.3156098299645
          ],
          "properties": {
            "name": "string",
            "model": "AP-635"
          }
        }
      ]
    },
    {
      "floorId": "16a-aad7-4070-8a19-fd6b8e1ff012",
      "devices": [
        {
          "deviceType": "ACCESSPOINT",
          "deviceStatus": "PLANNED",
          "id": "string",
          "locationSource": "MANUAL",
          "geometryRelative": [
            1231.9016080417828,
            1148.9863108995385
          ],
          "properties": {
            "name": "string",
            "model": "AP-635"
          }
        },
        {
          "deviceType": "ACCESSPOINT",
          "deviceStatus": "PLANNED",
          "id": "string",
          "locationSource": "MANUAL",
          "geometryRelative": [
            570.1959518589268,
            692.7754678191302
          ],
          "properties": {
            "name": "string",
            "model": "AP-635"
          }
        }
      ]
    }
  ]
}
```
### Response Examples

#### place planned devices over the floor

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "devicesPlacementResults": [
    {
      "serial": "AP00000001",
      "lpId": "string",
      "floor": "fff2bd91-de81-4097-8420-3ca7f87450fd",
      "statusCode": "SUC-001",
      "statusMessage": "Device placed successfully"
    },
    {
      "serial": "AP00000001",
      "lpId": "string",
      "floor": "fff2bd91-de81-4097-8420-3ca7f87450fd",
      "statusCode": "SUC-001",
      "statusMessage": "Device placed successfully"
    }
  ],
  "code": "SUC-001",
  "status": "SUCCESS",
  "message": "Successfully placed"
}
```
---

#### Invalid input received.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 400,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INVALID_INPUT",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 401,
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Forbidden: Access is denied.


**Status:** 403 Forbidden

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 403,
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Not Found error

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 404,
  "errorCode": "HPE_GL_ERROR_NOT_FOUND",
  "message": "Not Found",
  "debugId": "abc-123-456"
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 429,
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Internal server error.


**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 500,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INTERNAL_SERVER_ERROR",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### place planned devices over the floor

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "devicesPlacementResults": [
    {
      "serial": "AP00000001",
      "lpId": "string",
      "floor": "fff2bd91-de81-4097-8420-3ca7f87450fd",
      "statusCode": "SUC-001",
      "statusMessage": "Device placed successfully"
    },
    {
      "serial": "AP00000001",
      "lpId": "string",
      "floor": "fff2bd91-de81-4097-8420-3ca7f87450fd",
      "statusCode": "SUC-001",
      "statusMessage": "Device placed successfully"
    }
  ],
  "code": "SUC-001",
  "status": "SUCCESS",
  "message": "Successfully placed"
}
```
---

#### Forbidden: Access is denied.


**Status:** 403 Forbidden

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 403,
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Invalid input received.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 400,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INVALID_INPUT",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 429,
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Not Found error

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 404,
  "errorCode": "HPE_GL_ERROR_NOT_FOUND",
  "message": "Not Found",
  "debugId": "abc-123-456"
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 401,
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Internal server error.


**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 500,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INTERNAL_SERVER_ERROR",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

