# Retrieves placed devices over the FloorPlan

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/sitemaps/:site-id/network-devices-deployed?filter=floorId eq 'dd5ccb1f-9b65-42a8-b50e-faa7842bbcd8'`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| filter | floorId eq 'dd5ccb1f-9b65-42a8-b50e-faa7842bbcd8' | OData 4.0 filter must be provided with at least `floorId` or `buildingId`. Other supported fields are ``types` (`in` operator must be used ), `name`, `model` and `serial`.
 |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Returns list of placed devices on the FloorPlan.

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
      "geometry": {
        "type": "MultiLineString",
        "coordinates": [
          -99,
          90
        ]
      },
      "geometryRelative": [
        111.40338611698985,
        -147.8879755328198
      ],
      "accesspointProperties": {
        "model": "AP-635",
        "serialNumber": "AP00000001",
        "macAddress": "11:22:33:44:55:66",
        "state": "DEPLOYED",
        "status": "ONLINE",
        "isAnchor": "string",
        "partNumber": "JX973A",
        "radios": [
          {
            "serial": "AP00000001",
            "power": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1,
            "macAddress": "11:22:33:44:55:66"
          },
          {
            "serial": "AP00000001",
            "power": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1,
            "macAddress": "11:22:33:44:55:66"
          }
        ],
        "siteId": "3b5b-0e6c-4b73-9f6e-4e895a080190",
        "floorId": "fff2bd91-de81-4097-8420-3ca7f87450fd"
      },
      "lpId": "AP00000021",
      "lpFeatureType": "POINT",
      "deviceType": "GATEWAY"
    },
    {
      "id": "AP00000021",
      "type": "Access Point",
      "deviceName": "AP 001",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          -95,
          -167
        ]
      },
      "geometryRelative": [
        20.96439085058543,
        -173.1119633678603
      ],
      "accesspointProperties": {
        "model": "AP-635",
        "serialNumber": "AP00000001",
        "macAddress": "11:22:33:44:55:66",
        "state": "DEPLOYED",
        "status": "ONLINE",
        "isAnchor": "string",
        "partNumber": "JX973A",
        "radios": [
          {
            "serial": "AP00000001",
            "power": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1,
            "macAddress": "11:22:33:44:55:66"
          },
          {
            "serial": "AP00000001",
            "power": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1,
            "macAddress": "11:22:33:44:55:66"
          }
        ],
        "siteId": "3b5b-0e6c-4b73-9f6e-4e895a080190",
        "floorId": "fff2bd91-de81-4097-8420-3ca7f87450fd"
      },
      "lpId": "AP00000021",
      "lpFeatureType": "POINT",
      "deviceType": "GATEWAY"
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

#### Returns list of placed devices on the FloorPlan.

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
      "geometry": {
        "type": "MultiLineString",
        "coordinates": [
          -99,
          90
        ]
      },
      "geometryRelative": [
        111.40338611698985,
        -147.8879755328198
      ],
      "accesspointProperties": {
        "model": "AP-635",
        "serialNumber": "AP00000001",
        "macAddress": "11:22:33:44:55:66",
        "state": "DEPLOYED",
        "status": "ONLINE",
        "isAnchor": "string",
        "partNumber": "JX973A",
        "radios": [
          {
            "serial": "AP00000001",
            "power": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1,
            "macAddress": "11:22:33:44:55:66"
          },
          {
            "serial": "AP00000001",
            "power": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1,
            "macAddress": "11:22:33:44:55:66"
          }
        ],
        "siteId": "3b5b-0e6c-4b73-9f6e-4e895a080190",
        "floorId": "fff2bd91-de81-4097-8420-3ca7f87450fd"
      },
      "lpId": "AP00000021",
      "lpFeatureType": "POINT",
      "deviceType": "GATEWAY"
    },
    {
      "id": "AP00000021",
      "type": "Access Point",
      "deviceName": "AP 001",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          -95,
          -167
        ]
      },
      "geometryRelative": [
        20.96439085058543,
        -173.1119633678603
      ],
      "accesspointProperties": {
        "model": "AP-635",
        "serialNumber": "AP00000001",
        "macAddress": "11:22:33:44:55:66",
        "state": "DEPLOYED",
        "status": "ONLINE",
        "isAnchor": "string",
        "partNumber": "JX973A",
        "radios": [
          {
            "serial": "AP00000001",
            "power": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1,
            "macAddress": "11:22:33:44:55:66"
          },
          {
            "serial": "AP00000001",
            "power": "18 Dbm",
            "band": "5 GHz",
            "channel": "5 GHz",
            "number": 1,
            "macAddress": "11:22:33:44:55:66"
          }
        ],
        "siteId": "3b5b-0e6c-4b73-9f6e-4e895a080190",
        "floorId": "fff2bd91-de81-4097-8420-3ca7f87450fd"
      },
      "lpId": "AP00000021",
      "lpFeatureType": "POINT",
      "deviceType": "GATEWAY"
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

