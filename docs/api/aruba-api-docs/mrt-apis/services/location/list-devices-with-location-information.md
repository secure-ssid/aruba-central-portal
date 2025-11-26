# List devices with location information

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-services/v1alpha1/sites/:site-id/device-locations`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Returned device list with their consolidated locations.


**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "items": [
    {
      "id": "5064db8d-599b-480e-84c7-32980144d91a",
      "type": "SWITCH",
      "createdAt": "2023-02-14T12:23:00.000Z",
      "siteId": "fc7cc878-daac-5ddb-6b5e-9e75d099e275",
      "floorId": "0a2dcebc-149c-5caa-4e95-59447b930720",
      "serialNumber": "AP00000001",
      "buildingId": "285b9e92-0a5a-9c94-926b-cc5ee4417df1",
      "floorLevel": 1,
      "tenantId": "cid1234567890",
      "ipv4": "191.186.139.1",
      "ipv6": "ff39:a935:9028:625a:3a05:841d:a236:6a8b",
      "macAddress": "11:22:33:44:55:66",
      "model": "AP-635",
      "deployment": "string",
      "status": "ONLINE",
      "consolidatedLocation": {
        "source": "SYSTEM_GENERATED",
        "timestamp": "2023-02-14T12:23:00.000Z",
        "center": {
          "longitude": -73.622016,
          "latitude": 45.687416
        },
        "cartesianCoordinates": {
          "xPosition": 19,
          "yPosition": 74,
          "unit": "METERS"
        },
        "lciUncertainty": {
          "longitudeUncertainty": 0,
          "latitudeUncertainty": 0,
          "confidenceLevel": 0
        },
        "altitude": {
          "elevationType": "ABOVE_GROUND_LEVEL",
          "elevation": 18,
          "elevationUncertainty": 0
        }
      }
    },
    {
      "id": "5064db8d-599b-480e-84c7-32980144d91a",
      "type": "GATEWAY",
      "createdAt": "2023-02-14T12:23:00.000Z",
      "siteId": "0a7eb5bc-9560-4078-7684-9b728d20ef1e",
      "floorId": "d5fe13e0-4cd2-e733-6599-09e466758702",
      "serialNumber": "AP00000001",
      "buildingId": "8e9101f5-560a-acf0-6516-0072e4f228da",
      "floorLevel": 1,
      "tenantId": "cid1234567890",
      "ipv4": "199.96.154.166",
      "ipv6": "78d1:5ec9:d4af:55f4:d6e5:7be1:fe2f:185b",
      "macAddress": "11:22:33:44:55:66",
      "model": "AP-635",
      "deployment": "string",
      "status": "ONLINE",
      "consolidatedLocation": {
        "source": "SYSTEM_GENERATED",
        "timestamp": "2023-02-14T12:23:00.000Z",
        "center": {
          "longitude": -73.622016,
          "latitude": 45.687416
        },
        "cartesianCoordinates": {
          "xPosition": 19,
          "yPosition": 74,
          "unit": "METERS"
        },
        "lciUncertainty": {
          "longitudeUncertainty": 0,
          "latitudeUncertainty": 0,
          "confidenceLevel": 0
        },
        "altitude": {
          "elevationType": "ABOVE_GROUND_LEVEL",
          "elevation": 18,
          "elevationUncertainty": 0
        }
      }
    }
  ],
  "count": 1,
  "total": 1,
  "next": "string"
}
```
---

#### Invalid input received.

**Status:** 400 Bad Request

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_NETWORK_SERVICES_DEVICE_LOCATION_INVALID_INPUT",
  "message": "Invalid limit or offset input less than 0",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 400
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_NETWORK_SERVICES_DEVICE_L",
  "message": "Unauthorized Request",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 401
}
```
---

#### Forbidden: Access is denied.

**Status:** 403 Forbidden

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Unauthorized Request",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 403
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_NETWORK_SERVICES_DEVICE_LOCATION_INVALID_INPUT",
  "message": "Invalid limit or offset input less than 0",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 400
}
```
---

#### Internal Server Error.

**Status:** 500 Internal Server Error

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_NETWORK_SERVICES_DEVICE_L",
  "message": "com.arangodb.ArangoDBException: Cannot contact any host!",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 500
}
```
---

#### Forbidden: Access is denied.

**Status:** 403 Forbidden

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Unauthorized Request",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 403
}
```
---

#### Internal Server Error.

**Status:** 500 Internal Server Error

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_NETWORK_SERVICES_DEVICE_L",
  "message": "com.arangodb.ArangoDBException: Cannot contact any host!",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 500
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_NETWORK_SERVICES_DEVICE_L",
  "message": "Unauthorized Request",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 401
}
```
---

#### Invalid input received.

**Status:** 400 Bad Request

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_NETWORK_SERVICES_DEVICE_LOCATION_INVALID_INPUT",
  "message": "Invalid limit or offset input less than 0",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 400
}
```
---

#### Returned device list with their consolidated locations.


**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "items": [
    {
      "id": "5064db8d-599b-480e-84c7-32980144d91a",
      "type": "SWITCH",
      "createdAt": "2023-02-14T12:23:00.000Z",
      "siteId": "fc7cc878-daac-5ddb-6b5e-9e75d099e275",
      "floorId": "0a2dcebc-149c-5caa-4e95-59447b930720",
      "serialNumber": "AP00000001",
      "buildingId": "285b9e92-0a5a-9c94-926b-cc5ee4417df1",
      "floorLevel": 1,
      "tenantId": "cid1234567890",
      "ipv4": "191.186.139.1",
      "ipv6": "ff39:a935:9028:625a:3a05:841d:a236:6a8b",
      "macAddress": "11:22:33:44:55:66",
      "model": "AP-635",
      "deployment": "string",
      "status": "ONLINE",
      "consolidatedLocation": {
        "source": "SYSTEM_GENERATED",
        "timestamp": "2023-02-14T12:23:00.000Z",
        "center": {
          "longitude": -73.622016,
          "latitude": 45.687416
        },
        "cartesianCoordinates": {
          "xPosition": 19,
          "yPosition": 74,
          "unit": "METERS"
        },
        "lciUncertainty": {
          "longitudeUncertainty": 0,
          "latitudeUncertainty": 0,
          "confidenceLevel": 0
        },
        "altitude": {
          "elevationType": "ABOVE_GROUND_LEVEL",
          "elevation": 18,
          "elevationUncertainty": 0
        }
      }
    },
    {
      "id": "5064db8d-599b-480e-84c7-32980144d91a",
      "type": "GATEWAY",
      "createdAt": "2023-02-14T12:23:00.000Z",
      "siteId": "0a7eb5bc-9560-4078-7684-9b728d20ef1e",
      "floorId": "d5fe13e0-4cd2-e733-6599-09e466758702",
      "serialNumber": "AP00000001",
      "buildingId": "8e9101f5-560a-acf0-6516-0072e4f228da",
      "floorLevel": 1,
      "tenantId": "cid1234567890",
      "ipv4": "199.96.154.166",
      "ipv6": "78d1:5ec9:d4af:55f4:d6e5:7be1:fe2f:185b",
      "macAddress": "11:22:33:44:55:66",
      "model": "AP-635",
      "deployment": "string",
      "status": "ONLINE",
      "consolidatedLocation": {
        "source": "SYSTEM_GENERATED",
        "timestamp": "2023-02-14T12:23:00.000Z",
        "center": {
          "longitude": -73.622016,
          "latitude": 45.687416
        },
        "cartesianCoordinates": {
          "xPosition": 19,
          "yPosition": 74,
          "unit": "METERS"
        },
        "lciUncertainty": {
          "longitudeUncertainty": 0,
          "latitudeUncertainty": 0,
          "confidenceLevel": 0
        },
        "altitude": {
          "elevationType": "ABOVE_GROUND_LEVEL",
          "elevation": 18,
          "elevationUncertainty": 0
        }
      }
    }
  ],
  "count": 1,
  "total": 1,
  "next": "string"
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_NETWORK_SERVICES_DEVICE_LOCATION_INVALID_INPUT",
  "message": "Invalid limit or offset input less than 0",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 400
}
```
---

