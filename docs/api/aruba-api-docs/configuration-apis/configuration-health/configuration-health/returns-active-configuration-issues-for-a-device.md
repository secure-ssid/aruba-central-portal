# Returns active configuration issues for a device.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/config-health/active-issue?serial=<string>`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| serial | <string> |  |

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
  "configDistribution": [
    {
      "id": "<string>",
      "issue": "<string>",
      "recommendedAction": "<string>",
      "timestamp": "<string>"
    },
    {
      "id": "<string>",
      "issue": "<string>",
      "recommendedAction": "<string>",
      "timestamp": "<string>"
    }
  ],
  "configImport": [
    {
      "id": "<string>",
      "issue": "<string>",
      "issueType": "<string>",
      "recommendedAction": "<string>",
      "timestamp": "<string>"
    },
    {
      "id": "<string>",
      "issue": "<string>",
      "issueType": "<string>",
      "recommendedAction": "<string>",
      "timestamp": "<string>"
    }
  ],
  "validationBlocker": [
    {
      "assignedScope": "<string>",
      "assignedScopeType": "SCOPE_TYPE_UNSPECIFIED",
      "id": "<string>",
      "issueCategory": "<string>",
      "issueDescription": "<string>",
      "profileName": "<string>",
      "profileType": "<string>",
      "recommendedAction": "<string>",
      "timestamp": "<string>"
    },
    {
      "assignedScope": "<string>",
      "assignedScopeType": "SCOPE_TYPE_UNSPECIFIED",
      "id": "<string>",
      "issueCategory": "<string>",
      "issueDescription": "<string>",
      "profileName": "<string>",
      "profileType": "<string>",
      "recommendedAction": "<string>",
      "timestamp": "<string>"
    }
  ],
  "validationNonBlocker": [
    {
      "assignedScope": "<string>",
      "assignedScopeType": "SCOPE_TYPE_GLOBAL",
      "id": "<string>",
      "issueCategory": "<string>",
      "issueDescription": "<string>",
      "profileName": "<string>",
      "profileType": "<string>",
      "recommendedAction": "<string>",
      "timestamp": "<string>"
    },
    {
      "assignedScope": "<string>",
      "assignedScopeType": "SCOPE_TYPE_LIBRARY",
      "id": "<string>",
      "issueCategory": "<string>",
      "issueDescription": "<string>",
      "profileName": "<string>",
      "profileType": "<string>",
      "recommendedAction": "<string>",
      "timestamp": "<string>"
    }
  ]
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

