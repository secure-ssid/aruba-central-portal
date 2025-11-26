# Get locations of Wi-Fi clients

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-services/v1alpha1/wifi-clients-locations`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Response returned with a list of Wifi client locations and the associated page information. Users can request the next page based on the information returned.


**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "count": 100,
  "items": [
    {
      "type": "network-services/wifi-client-locations",
      "id": "11:22:33:44:55:66-1234567890123",
      "siteId": "1033566193",
      "floorId": "9f50f534-c117-48f8-9bf8-a6594e1f49a5",
      "associated": true,
      "cartesianCoordinates": {
        "xInMetre": 19.12,
        "yInMetre": 74.9
      },
      "clientClassification": "Unknown",
      "accuracy": 25.2,
      "numOfReportingAps": 3,
      "connected": true,
      "createdAt": "2023-02-14T12:23:00.000Z",
      "buildingId": "cfd5dfe0-1476-49b1-ac37-6576801d1124",
      "macAddress": "11:22:33:44:55:66",
      "hashedMacAddress": "43ddc7ed75eb039db1fec4839c0e33d21bfb21e1",
      "associatedBssid": "stringstringstring",
      "geoCoordinates": {
        "latitude": 45.687416,
        "longitude": -73.622016
      }
    },
    {
      "type": "network-services/wifi-client-locations",
      "id": "11:22:33:44:55:66-1234567890123",
      "siteId": "1033566193",
      "floorId": "9f50f534-c117-48f8-9bf8-a6594e1f49a5",
      "associated": true,
      "cartesianCoordinates": {
        "xInMetre": 19.12,
        "yInMetre": 74.9
      },
      "clientClassification": "Unknown",
      "accuracy": 25.2,
      "numOfReportingAps": 3,
      "connected": true,
      "createdAt": "2023-02-14T12:23:00.000Z",
      "buildingId": "cfd5dfe0-1476-49b1-ac37-6576801d1124",
      "macAddress": "11:22:33:44:55:66",
      "hashedMacAddress": "43ddc7ed75eb039db1fec4839c0e33d21bfb21e1",
      "associatedBssid": "stringstringstring",
      "geoCoordinates": {
        "latitude": 45.687416,
        "longitude": -73.622016
      }
    }
  ],
  "offset": 0,
  "total": 200
}
```
---

#### Bad request error response.

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
  "errorCode": "HPE_GL_NETWORK_SERVICES_WIFI_CLIENT_LOCATION_INVALID_PAGE_INFO_INPUT",
  "message": "Error message",
  "debugId": "a53ea9f0efeb99b2a9a52ef9c7e3093b"
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
  "message": "Error message",
  "debugId": "a53ea9f0efeb99b2a9a52ef9c7e3093b"
}
```
---

#### Resource not found error response.

**Status:** 404 Not Found

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 404,
  "errorCode": "HPE_GL_NETWORK_SERVICES_WIFI_CLIENT_LOCATION_CLIENT_MAC_NOT_FOUND",
  "message": "Error message",
  "debugId": "a53ea9f0efeb99b2a9a52ef9c7e3093b"
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
  "message": "Error message",
  "debugId": "a53ea9f0efeb99b2a9a52ef9c7e3093b"
}
```
---

#### Internal Server Error response.

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
  "errorCode": "HPE_GL_NETWORK_SERVICES_WIFI_CLIENT_LOCATION_DATABASE_ERROR",
  "message": "Error message",
  "debugId": "a53ea9f0efeb99b2a9a52ef9c7e3093b"
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

#### Bad request error response.

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
  "errorCode": "HPE_GL_NETWORK_SERVICES_WIFI_CLIENT_LOCATION_INVALID_PAGE_INFO_INPUT",
  "message": "Error message",
  "debugId": "a53ea9f0efeb99b2a9a52ef9c7e3093b"
}
```
---

#### Resource not found error response.

**Status:** 404 Not Found

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "httpStatusCode": 404,
  "errorCode": "HPE_GL_NETWORK_SERVICES_WIFI_CLIENT_LOCATION_CLIENT_MAC_NOT_FOUND",
  "message": "Error message",
  "debugId": "a53ea9f0efeb99b2a9a52ef9c7e3093b"
}
```
---

#### Internal Server Error response.

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
  "errorCode": "HPE_GL_NETWORK_SERVICES_WIFI_CLIENT_LOCATION_DATABASE_ERROR",
  "message": "Error message",
  "debugId": "a53ea9f0efeb99b2a9a52ef9c7e3093b"
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
  "message": "Error message",
  "debugId": "a53ea9f0efeb99b2a9a52ef9c7e3093b"
}
```
---

#### Response returned with a list of Wifi client locations and the associated page information. Users can request the next page based on the information returned.


**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 2777745037903466500
- `X-RateLimit-Remaining`: 2777745037903466500
- `X-RateLimit-Reset`: 1981-03-27T08:51:57.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "count": 100,
  "items": [
    {
      "type": "network-services/wifi-client-locations",
      "id": "11:22:33:44:55:66-1234567890123",
      "siteId": "1033566193",
      "floorId": "9f50f534-c117-48f8-9bf8-a6594e1f49a5",
      "associated": true,
      "cartesianCoordinates": {
        "xInMetre": 19.12,
        "yInMetre": 74.9
      },
      "clientClassification": "Unknown",
      "accuracy": 25.2,
      "numOfReportingAps": 3,
      "connected": true,
      "createdAt": "2023-02-14T12:23:00.000Z",
      "buildingId": "cfd5dfe0-1476-49b1-ac37-6576801d1124",
      "macAddress": "11:22:33:44:55:66",
      "hashedMacAddress": "43ddc7ed75eb039db1fec4839c0e33d21bfb21e1",
      "associatedBssid": "stringstringstring",
      "geoCoordinates": {
        "latitude": 45.687416,
        "longitude": -73.622016
      }
    },
    {
      "type": "network-services/wifi-client-locations",
      "id": "11:22:33:44:55:66-1234567890123",
      "siteId": "1033566193",
      "floorId": "9f50f534-c117-48f8-9bf8-a6594e1f49a5",
      "associated": true,
      "cartesianCoordinates": {
        "xInMetre": 19.12,
        "yInMetre": 74.9
      },
      "clientClassification": "Unknown",
      "accuracy": 25.2,
      "numOfReportingAps": 3,
      "connected": true,
      "createdAt": "2023-02-14T12:23:00.000Z",
      "buildingId": "cfd5dfe0-1476-49b1-ac37-6576801d1124",
      "macAddress": "11:22:33:44:55:66",
      "hashedMacAddress": "43ddc7ed75eb039db1fec4839c0e33d21bfb21e1",
      "associatedBssid": "stringstringstring",
      "geoCoordinates": {
        "latitude": 45.687416,
        "longitude": -73.622016
      }
    }
  ],
  "offset": 0,
  "total": 200
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
  "message": "Error message",
  "debugId": "a53ea9f0efeb99b2a9a52ef9c7e3093b"
}
```
---

