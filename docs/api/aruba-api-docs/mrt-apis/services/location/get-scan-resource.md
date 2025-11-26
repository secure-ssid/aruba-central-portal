# Get scan resource

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-services/v1alpha1/sitemaps/:site-id/floors/:floor-id/ap-ranging-scans/:scan-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Returned ftm scan resource.


**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "id": "string",
  "type": "FTM_SCAN",
  "createdAt": "2023-02-14T12:23:00.000Z",
  "updatedAt": "2023-02-14T12:23:00.000Z",
  "siteId": "55611728-c04f-f340-852b-0b1eb122cab3",
  "floorId": "87b68323-08d0-f2ed-694c-9b9e3ab2edf1",
  "status": "PENDING",
  "serialNumbers": [
    "AP00000001",
    "AP00000001"
  ],
  "scanStartTime": "2023-02-14T12:23:00.000Z",
  "estimatedCompletionTime": "2023-02-14T12:23:00.000Z",
  "dwellTimeMillis": 90,
  "scannedChannels": [
    {
      "band": "RADIO_BAND_5GHZ",
      "bandwidth": "CHANNEL_BW_80MHZ",
      "primaryChannelList": [
        36,
        36
      ]
    },
    {
      "band": "RADIO_BAND_5GHZ",
      "bandwidth": "CHANNEL_BW_80MHZ",
      "primaryChannelList": [
        36,
        36
      ]
    }
  ],
  "errorMessage": "string"
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
  "errorCode": "HPE_GL_NETWORK_SERVICES_RFGRAPH_INVALID_INPUT",
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
  "errorCode": "HPE_GL_NETWORK_SERVICES_RFGRAPH_",
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
  "errorCode": "HPE_GL_NETWORK_SERVICES_RFGRAPH_",
  "message": "com.arangodb.ArangoDBException: Cannot contact any host!",
  "debugId": "e5b61232-83c8-401a-8e14-a4c75b4fb745",
  "httpStatusCode": 500
}
```
---

#### Returned ftm scan resource.


**Status:** 200 OK

**Response Headers:**

- `X-RateLimit-Limit`: 3812142574930995000
- `X-RateLimit-Remaining`: 2013203081307711500
- `X-RateLimit-Reset`: 1975-01-18T06:18:15.
- `Content-Type`: application/json

**Response Body:**

```json
{
  "id": "string",
  "type": "FTM_SCAN",
  "createdAt": "2023-02-14T12:23:00.000Z",
  "updatedAt": "2023-02-14T12:23:00.000Z",
  "siteId": "55611728-c04f-f340-852b-0b1eb122cab3",
  "floorId": "87b68323-08d0-f2ed-694c-9b9e3ab2edf1",
  "status": "PENDING",
  "serialNumbers": [
    "AP00000001",
    "AP00000001"
  ],
  "scanStartTime": "2023-02-14T12:23:00.000Z",
  "estimatedCompletionTime": "2023-02-14T12:23:00.000Z",
  "dwellTimeMillis": 90,
  "scannedChannels": [
    {
      "band": "RADIO_BAND_5GHZ",
      "bandwidth": "CHANNEL_BW_80MHZ",
      "primaryChannelList": [
        36,
        36
      ]
    },
    {
      "band": "RADIO_BAND_5GHZ",
      "bandwidth": "CHANNEL_BW_80MHZ",
      "primaryChannelList": [
        36,
        36
      ]
    }
  ],
  "errorMessage": "string"
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
  "errorCode": "HPE_GL_NETWORK_SERVICES_RFGRAPH_",
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
  "errorCode": "HPE_GL_NETWORK_SERVICES_RFGRAPH_",
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
  "errorCode": "HPE_GL_NETWORK_SERVICES_RFGRAPH_INVALID_INPUT",
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

