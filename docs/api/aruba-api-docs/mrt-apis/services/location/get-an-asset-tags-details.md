# Get an Asset Tag's details

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-services/v1alpha1/asset-tags/:asset-tag-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Successful operation

**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "id": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "type": "/network-services/v1alpha1/asset-tags",
  "macAddress": "11:22:33:44:55:66",
  "createdAt": "2023-10-01T12:00:00Z",
  "deviceClassifications": [
    "ArubaAssetTag",
    "Blyott"
  ],
  "firstSeen": "2023-10-01T12:00:00Z",
  "metadata": {
    "id": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
    "type": "string",
    "createdAt": "2023-10-01T12:00:00Z",
    "updatedAt": "2023-10-01T12:00:00Z",
    "name": "Tag1",
    "labels": [
      "Label1",
      "Label2"
    ],
    "customId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
    "notes": "Sample notes for the tag."
  },
  "lastKnownLocation": {
    "id": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
    "type": "string",
    "createdAt": "2023-10-01T12:00:00Z",
    "siteId": "42e3f61b-2b8c-ed49-5b16-e1f063fdfd6b",
    "floorId": "4b9a8929-4d81-2976-3e42-bdf9ecb04ddb",
    "siteName": "Main Campus",
    "floorName": "First Floor",
    "floorNumber": 1228.6398295024558,
    "lastSeen": "2023-10-01T12:00:00Z",
    "buildingId": "bb14c158-0074-a461-ecc9-208cc5beafec",
    "buildingName": "Building A",
    "batteryLevel": 79,
    "coordinates": {
      "cartesianCoordinates": {
        "xInMetre": 19.12,
        "yInMetre": 74.9
      },
      "geoCoordinates": {
        "latitude": 45.687416,
        "longitude": -73.622016
      }
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
  "errorCode": "HPE_GL_NETWORK_SERVICES_INVALID_PAGE_INFO_INPUT",
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
  "errorCode": "HPE_GL_NETWORK_SERVICES_INVALID_SESSION",
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

#### Resource not found.

**Status:** 404 Not Found

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_NETWORK_SERVICES_TAG_DATA_NOT_FOUND",
  "message": "Error message",
  "debugId": "a53ea9f0efeb99b2a9a52ef9c7e3093b",
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
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Invalid limit or offset input less than 0",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 429
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
  "errorCode": "HPE_GL_NETWORK_SERVICES_INTERNAL_SERVER_ERROR",
  "message": "Error message",
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
  "errorCode": "HPE_GL_NETWORK_SERVICES_INVALID_SESSION",
  "message": "Unauthorized Request",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 401
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
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Invalid limit or offset input less than 0",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 429
}
```
---

#### Resource not found.

**Status:** 404 Not Found

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GL_NETWORK_SERVICES_TAG_DATA_NOT_FOUND",
  "message": "Error message",
  "debugId": "a53ea9f0efeb99b2a9a52ef9c7e3093b",
  "httpStatusCode": 404
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
  "errorCode": "HPE_GL_NETWORK_SERVICES_INTERNAL_SERVER_ERROR",
  "message": "Error message",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 500
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
  "errorCode": "HPE_GL_NETWORK_SERVICES_INVALID_PAGE_INFO_INPUT",
  "message": "Invalid limit or offset input less than 0",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 400
}
```
---

#### Successful operation

**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "id": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "type": "/network-services/v1alpha1/asset-tags",
  "macAddress": "11:22:33:44:55:66",
  "createdAt": "2023-10-01T12:00:00Z",
  "deviceClassifications": [
    "ArubaAssetTag",
    "Blyott"
  ],
  "firstSeen": "2023-10-01T12:00:00Z",
  "metadata": {
    "id": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
    "type": "string",
    "createdAt": "2023-10-01T12:00:00Z",
    "updatedAt": "2023-10-01T12:00:00Z",
    "name": "Tag1",
    "labels": [
      "Label1",
      "Label2"
    ],
    "customId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
    "notes": "Sample notes for the tag."
  },
  "lastKnownLocation": {
    "id": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
    "type": "string",
    "createdAt": "2023-10-01T12:00:00Z",
    "siteId": "42e3f61b-2b8c-ed49-5b16-e1f063fdfd6b",
    "floorId": "4b9a8929-4d81-2976-3e42-bdf9ecb04ddb",
    "siteName": "Main Campus",
    "floorName": "First Floor",
    "floorNumber": 1228.6398295024558,
    "lastSeen": "2023-10-01T12:00:00Z",
    "buildingId": "bb14c158-0074-a461-ecc9-208cc5beafec",
    "buildingName": "Building A",
    "batteryLevel": 79,
    "coordinates": {
      "cartesianCoordinates": {
        "xInMetre": 19.12,
        "yInMetre": 74.9
      },
      "geoCoordinates": {
        "latitude": 45.687416,
        "longitude": -73.622016
      }
    }
  }
}
```
---

