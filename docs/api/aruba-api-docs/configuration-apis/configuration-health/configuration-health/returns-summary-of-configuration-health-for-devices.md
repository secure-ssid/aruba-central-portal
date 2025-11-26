# Returns summary of configuration health for devices.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/config-health/devices?limit=100&offset=0`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| limit | 100 | Number of devices that needs to be fetched. |
| offset | 0 | Offset from where the devices need to be fetched |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### response

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "count": "<integer>",
  "devices": [
    {
      "activeIssues": [
        "string",
        "string"
      ],
      "configStatus": "UPDATE_IN_PROGRESS",
      "deployment": "<string>",
      "deviceFunction": "<string>",
      "deviceGroupName": "<string>",
      "lastConfigTimestamp": "<string>",
      "model": "<string>",
      "name": "<string>",
      "recommendedAction": "<string>",
      "role": "<string>",
      "serial": "<string>",
      "siteCollectionName": "<string>",
      "siteName": "<string>",
      "topPriorityIssue": "<string>",
      "type": "<string>"
    },
    {
      "activeIssues": [
        "string",
        "string"
      ],
      "configStatus": "UPDATE_IN_PROGRESS",
      "deployment": "<string>",
      "deviceFunction": "<string>",
      "deviceGroupName": "<string>",
      "lastConfigTimestamp": "<string>",
      "model": "<string>",
      "name": "<string>",
      "recommendedAction": "<string>",
      "role": "<string>",
      "serial": "<string>",
      "siteCollectionName": "<string>",
      "siteName": "<string>",
      "topPriorityIssue": "<string>",
      "type": "<string>"
    }
  ],
  "offset": "<integer>",
  "total": "<integer>"
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
  "httpStatusCode": "<integer>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
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
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "message": "<string>",
  "debugId": "<string>",
  "httpStatusCode": "<integer>"
}
```
---

#### Forbidden.

**Status:** 403 Forbidden

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "<string>",
  "debugId": "<string>",
  "httpStatusCode": "<integer>"
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
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "<string>",
  "debugId": "<string>",
  "httpStatusCode": "<integer>"
}
```
---

#### Internal Server Error.

**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "errorCode": "HPE_GL_ERROR_INTERNAL_SERVER_ERR",
  "message": "<string>",
  "debugId": "<string>",
  "httpStatusCode": "<integer>"
}
```
---

