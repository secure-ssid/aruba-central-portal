# Retrieves placed (planned) devices

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/sitemaps/:site-id/network-devices-planned?filter=floorId eq 'dd5ccb1f-9b65-42a8-b50e-faa7842bbcd8'`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| filter | floorId eq 'dd5ccb1f-9b65-42a8-b50e-faa7842bbcd8' | OData 4.0 filter must be provided with at least `floorId`.
 |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Returns list of placed planned devices on the FloorPlan.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "items": [
    {
      "id": "AP00000021",
      "type": "Access Point",
      "deviceName": "AP 001",
      "geometryRelative": [
        161.29381140302098,
        -84.83578012626444
      ],
      "accesspointProperties": {
        "model": "AP-635",
        "partNumber": "JX973A",
        "radios": [
          {
            "txPower": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1
          },
          {
            "txPower": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1
          }
        ]
      },
      "lpFeatureType": "POINT",
      "deviceType": "SWITCH"
    },
    {
      "id": "AP00000021",
      "type": "Access Point",
      "deviceName": "AP 001",
      "geometryRelative": [
        63.25325586232685,
        1.7987904654389695
      ],
      "accesspointProperties": {
        "model": "AP-635",
        "partNumber": "JX973A",
        "radios": [
          {
            "txPower": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1
          },
          {
            "txPower": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1
          }
        ]
      },
      "lpFeatureType": "POINT",
      "deviceType": "SWITCH"
    }
  ],
  "count": 1,
  "total": 1,
  "next": "string",
  "response": {
    "code": "SUC-001",
    "status": "SUCCESS",
    "message": "success."
  }
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

#### Returns list of placed planned devices on the FloorPlan.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "items": [
    {
      "id": "AP00000021",
      "type": "Access Point",
      "deviceName": "AP 001",
      "geometryRelative": [
        161.29381140302098,
        -84.83578012626444
      ],
      "accesspointProperties": {
        "model": "AP-635",
        "partNumber": "JX973A",
        "radios": [
          {
            "txPower": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1
          },
          {
            "txPower": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1
          }
        ]
      },
      "lpFeatureType": "POINT",
      "deviceType": "SWITCH"
    },
    {
      "id": "AP00000021",
      "type": "Access Point",
      "deviceName": "AP 001",
      "geometryRelative": [
        63.25325586232685,
        1.7987904654389695
      ],
      "accesspointProperties": {
        "model": "AP-635",
        "partNumber": "JX973A",
        "radios": [
          {
            "txPower": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1
          },
          {
            "txPower": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1
          }
        ]
      },
      "lpFeatureType": "POINT",
      "deviceType": "SWITCH"
    }
  ],
  "count": 1,
  "total": 1,
  "next": "string",
  "response": {
    "code": "SUC-001",
    "status": "SUCCESS",
    "message": "success."
  }
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

