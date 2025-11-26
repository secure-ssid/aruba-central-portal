# Get a list of Asset Tags

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-services/v1alpha1/asset-tags`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

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
  "count": 100,
  "items": [
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
        "siteId": "d5bc71f6-018a-06f3-2172-57384efd4166",
        "floorId": "07e3172f-a67b-c984-0c7f-e301c94f8e4f",
        "siteName": "Main Campus",
        "floorName": "First Floor",
        "floorNumber": 6263.068595010824,
        "lastSeen": "2023-10-01T12:00:00Z",
        "buildingId": "617d35bd-e29f-1dd4-7d43-cdd88dfad9ec",
        "buildingName": "Building A",
        "batteryLevel": 63,
        "coordinates": {
          "cartesianCoordinates": {
            "value": "<Error: Too many levels of nesting to fake this schema>"
          },
          "geoCoordinates": {
            "value": "<Error: Too many levels of nesting to fake this schema>"
          }
        }
      }
    },
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
        "siteId": "230efb10-9d5c-0864-259b-44912d893503",
        "floorId": "5340b496-e35a-3115-238f-f7b200666c84",
        "siteName": "Main Campus",
        "floorName": "First Floor",
        "floorNumber": 4601.668994279559,
        "lastSeen": "2023-10-01T12:00:00Z",
        "buildingId": "0167436f-7d56-bcc9-f268-2572e6b907d7",
        "buildingName": "Building A",
        "batteryLevel": 17,
        "coordinates": {
          "cartesianCoordinates": {
            "value": "<Error: Too many levels of nesting to fake this schema>"
          },
          "geoCoordinates": {
            "value": "<Error: Too many levels of nesting to fake this schema>"
          }
        }
      }
    }
  ],
  "offset": 0,
  "total": 200
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
  "count": 100,
  "items": [
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
        "siteId": "d5bc71f6-018a-06f3-2172-57384efd4166",
        "floorId": "07e3172f-a67b-c984-0c7f-e301c94f8e4f",
        "siteName": "Main Campus",
        "floorName": "First Floor",
        "floorNumber": 6263.068595010824,
        "lastSeen": "2023-10-01T12:00:00Z",
        "buildingId": "617d35bd-e29f-1dd4-7d43-cdd88dfad9ec",
        "buildingName": "Building A",
        "batteryLevel": 63,
        "coordinates": {
          "cartesianCoordinates": {
            "value": "<Error: Too many levels of nesting to fake this schema>"
          },
          "geoCoordinates": {
            "value": "<Error: Too many levels of nesting to fake this schema>"
          }
        }
      }
    },
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
        "siteId": "230efb10-9d5c-0864-259b-44912d893503",
        "floorId": "5340b496-e35a-3115-238f-f7b200666c84",
        "siteName": "Main Campus",
        "floorName": "First Floor",
        "floorNumber": 4601.668994279559,
        "lastSeen": "2023-10-01T12:00:00Z",
        "buildingId": "0167436f-7d56-bcc9-f268-2572e6b907d7",
        "buildingName": "Building A",
        "batteryLevel": 17,
        "coordinates": {
          "cartesianCoordinates": {
            "value": "<Error: Too many levels of nesting to fake this schema>"
          },
          "geoCoordinates": {
            "value": "<Error: Too many levels of nesting to fake this schema>"
          }
        }
      }
    }
  ],
  "offset": 0,
  "total": 200
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

