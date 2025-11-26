# Get device location details

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-services/v1alpha1/sites/:site-id/devices/:serial-number/location`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Object containing the list of the device's geographic information matching the request criteria. 
If no device with the requested information is found then an empty list is returned.


**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "id": "5064db8d-599b-480e-84c7-32980144d91a",
  "type": "GATEWAY",
  "createdAt": "2023-02-14T12:23:00.000Z",
  "siteId": "106f26c4-b5a5-8e33-21df-0eda70aea0cd",
  "floorId": "a3a57ffb-2610-c1f3-8c6c-d2b43ac5ab33",
  "serialNumber": "AP00000001",
  "buildingId": "50e45989-80ea-66cf-25d6-b2674b2c886b",
  "floorLevel": 1,
  "tenantId": "cid1234567890",
  "ipv4": "190.247.204.26",
  "ipv6": "c58e:231a:8414:5b50:7205:6f6a:22e1:6503",
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

#### Device with serial number not found.

**Status:** 404 Not Found

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_NETWORK_SERVICES_DEVICE_L",
  "message": "string",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 404
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

#### Object containing the list of the device's geographic information matching the request criteria. 
If no device with the requested information is found then an empty list is returned.


**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "id": "5064db8d-599b-480e-84c7-32980144d91a",
  "type": "GATEWAY",
  "createdAt": "2023-02-14T12:23:00.000Z",
  "siteId": "106f26c4-b5a5-8e33-21df-0eda70aea0cd",
  "floorId": "a3a57ffb-2610-c1f3-8c6c-d2b43ac5ab33",
  "serialNumber": "AP00000001",
  "buildingId": "50e45989-80ea-66cf-25d6-b2674b2c886b",
  "floorLevel": 1,
  "tenantId": "cid1234567890",
  "ipv4": "190.247.204.26",
  "ipv6": "c58e:231a:8414:5b50:7205:6f6a:22e1:6503",
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

#### Device with serial number not found.

**Status:** 404 Not Found

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_NETWORK_SERVICES_DEVICE_L",
  "message": "string",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 404
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

