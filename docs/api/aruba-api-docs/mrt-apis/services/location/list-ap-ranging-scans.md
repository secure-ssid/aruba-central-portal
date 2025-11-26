# List AP ranging scans

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-services/v1alpha1/sitemaps/:site-id/floors/:floor-id/ap-ranging-scans?limit=100&next=string`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| limit | 100 | (Required)  |
| next | string | (Required)  |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### List of AP ranging scans matching the floor-id and query-time.


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
      "id": "string",
      "type": "FTM_SCAN",
      "createdAt": "2023-02-14T12:23:00.000Z",
      "updatedAt": "2023-02-14T12:23:00.000Z",
      "siteId": "d13f1447-f4dc-ed80-9004-b1ee2e307f38",
      "floorId": "79543d62-bb9c-e6ae-9003-ff53ddb4b07d",
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
    },
    {
      "id": "string",
      "type": "FTM_SCAN",
      "createdAt": "2023-02-14T12:23:00.000Z",
      "updatedAt": "2023-02-14T12:23:00.000Z",
      "siteId": "cb620a14-8d50-d917-fc81-7c10cad2914a",
      "floorId": "fddd99f0-75e5-6b99-69a7-4dd30b15041c",
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

#### List of AP ranging scans matching the floor-id and query-time.


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
      "id": "string",
      "type": "FTM_SCAN",
      "createdAt": "2023-02-14T12:23:00.000Z",
      "updatedAt": "2023-02-14T12:23:00.000Z",
      "siteId": "d13f1447-f4dc-ed80-9004-b1ee2e307f38",
      "floorId": "79543d62-bb9c-e6ae-9003-ff53ddb4b07d",
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
    },
    {
      "id": "string",
      "type": "FTM_SCAN",
      "createdAt": "2023-02-14T12:23:00.000Z",
      "updatedAt": "2023-02-14T12:23:00.000Z",
      "siteId": "cb620a14-8d50-d917-fc81-7c10cad2914a",
      "floorId": "fddd99f0-75e5-6b99-69a7-4dd30b15041c",
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
  ],
  "count": 1,
  "total": 1,
  "next": "string"
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

