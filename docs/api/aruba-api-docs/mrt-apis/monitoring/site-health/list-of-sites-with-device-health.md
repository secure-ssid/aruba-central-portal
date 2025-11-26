# List of sites with device health

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/sites-device-health`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Success

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
      "id": "00001",
      "type": "network-monitoring/sites-device-health",
      "name": "Site 1",
      "deviceTypes": [
        {
          "name": "Access Points",
          "health": {
            "groups": [
              {
                "name": "Fair",
                "value": 4
              },
              {
                "name": "Fair",
                "value": 4
              }
            ]
          }
        },
        {
          "name": "Access Points",
          "health": {
            "groups": [
              {
                "name": "Fair",
                "value": 4
              },
              {
                "name": "Fair",
                "value": 4
              }
            ]
          }
        }
      ]
    },
    {
      "id": "00001",
      "type": "network-monitoring/sites-device-health",
      "name": "Site 1",
      "deviceTypes": [
        {
          "name": "Access Points",
          "health": {
            "groups": [
              {
                "name": "Fair",
                "value": 4
              },
              {
                "name": "Fair",
                "value": 4
              }
            ]
          }
        },
        {
          "name": "Access Points",
          "health": {
            "groups": [
              {
                "name": "Fair",
                "value": 4
              },
              {
                "name": "Fair",
                "value": 4
              }
            ]
          }
        }
      ]
    }
  ],
  "count": 1,
  "total": 10,
  "response": {
    "status": "SUCCESS",
    "code": "SITE-HEALTH-SUCCESS-001",
    "message": "Sites details fetched successfully"
  },
  "offset": 0
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

#### Success

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
      "id": "00001",
      "type": "network-monitoring/sites-device-health",
      "name": "Site 1",
      "deviceTypes": [
        {
          "name": "Access Points",
          "health": {
            "groups": [
              {
                "name": "Fair",
                "value": 4
              },
              {
                "name": "Fair",
                "value": 4
              }
            ]
          }
        },
        {
          "name": "Access Points",
          "health": {
            "groups": [
              {
                "name": "Fair",
                "value": 4
              },
              {
                "name": "Fair",
                "value": 4
              }
            ]
          }
        }
      ]
    },
    {
      "id": "00001",
      "type": "network-monitoring/sites-device-health",
      "name": "Site 1",
      "deviceTypes": [
        {
          "name": "Access Points",
          "health": {
            "groups": [
              {
                "name": "Fair",
                "value": 4
              },
              {
                "name": "Fair",
                "value": 4
              }
            ]
          }
        },
        {
          "name": "Access Points",
          "health": {
            "groups": [
              {
                "name": "Fair",
                "value": 4
              },
              {
                "name": "Fair",
                "value": 4
              }
            ]
          }
        }
      ]
    }
  ],
  "count": 1,
  "total": 10,
  "response": {
    "status": "SUCCESS",
    "code": "SITE-HEALTH-SUCCESS-001",
    "message": "Sites details fetched successfully"
  },
  "offset": 0
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

