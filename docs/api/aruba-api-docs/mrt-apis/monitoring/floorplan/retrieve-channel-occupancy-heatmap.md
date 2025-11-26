# Retrieve channel occupancy heatmap.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/sitemaps/:site-id/floors/:floor-id/heatmap-channel-occupancy?signal-cutoff=-95&is-channel-overlap=true`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| signal-cutoff | -95 | signal cutoff for heatmap |
| is-channel-overlap | true | Channel overlap flag for heatmap. tru: channel overlap, false: no channel overlap. |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Returns channel occupancy heatmap for a given site id and floor id.

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
      "id": "16a-aad7-4070-8a19-fd6b8e1ff012",
      "type": "Feature",
      "featureType": "HeatmapChannelOccupancy",
      "geometryRelative": [
        [
          [
            6283568389198447000,
            8402818502033428000
          ],
          [
            5328314634006868000,
            6328318597668434000
          ]
        ],
        [
          [
            142146416244944900,
            2447146503279958000
          ],
          [
            2853360706128384000,
            136404573344292860
          ]
        ]
      ],
      "properties": {
        "floorId": "16a-aad7-4070-8a19-fd6b8e1ff012",
        "channel": "11",
        "channelWidth": "20 MHz"
      }
    },
    {
      "id": "16a-aad7-4070-8a19-fd6b8e1ff012",
      "type": "Feature",
      "featureType": "HeatmapChannelOccupancy",
      "geometryRelative": [
        [
          [
            5752521068031400000,
            2902229104070306000
          ],
          [
            6707054674353203000,
            5122882175738188000
          ]
        ],
        [
          [
            4644184108564111000,
            2731577728931672000
          ],
          [
            8128191046588047000,
            4224169343954768000
          ]
        ]
      ],
      "properties": {
        "floorId": "16a-aad7-4070-8a19-fd6b8e1ff012",
        "channel": "11",
        "channelWidth": "20 MHz"
      }
    }
  ],
  "count": 1,
  "type": "string"
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

#### Returns channel occupancy heatmap for a given site id and floor id.

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
      "id": "16a-aad7-4070-8a19-fd6b8e1ff012",
      "type": "Feature",
      "featureType": "HeatmapChannelOccupancy",
      "geometryRelative": [
        [
          [
            6283568389198447000,
            8402818502033428000
          ],
          [
            5328314634006868000,
            6328318597668434000
          ]
        ],
        [
          [
            142146416244944900,
            2447146503279958000
          ],
          [
            2853360706128384000,
            136404573344292860
          ]
        ]
      ],
      "properties": {
        "floorId": "16a-aad7-4070-8a19-fd6b8e1ff012",
        "channel": "11",
        "channelWidth": "20 MHz"
      }
    },
    {
      "id": "16a-aad7-4070-8a19-fd6b8e1ff012",
      "type": "Feature",
      "featureType": "HeatmapChannelOccupancy",
      "geometryRelative": [
        [
          [
            5752521068031400000,
            2902229104070306000
          ],
          [
            6707054674353203000,
            5122882175738188000
          ]
        ],
        [
          [
            4644184108564111000,
            2731577728931672000
          ],
          [
            8128191046588047000,
            4224169343954768000
          ]
        ]
      ],
      "properties": {
        "floorId": "16a-aad7-4070-8a19-fd6b8e1ff012",
        "channel": "11",
        "channelWidth": "20 MHz"
      }
    }
  ],
  "count": 1,
  "type": "string"
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

