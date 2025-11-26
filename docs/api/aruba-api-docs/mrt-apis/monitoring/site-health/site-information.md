# Site information

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/site-health/:site-id`

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
  "id": "00001",
  "type": "network-monitoring/site-health",
  "response": {
    "status": "SUCCESS",
    "code": "SITE-HEALTH-SUCCESS-001",
    "message": "Sites details fetched successfully"
  },
  "reasons": [
    {
      "health": "Poor",
      "reason": "CLIENT_HEALTH_POOR",
      "data": {
        "count": 5
      }
    },
    {
      "health": "Poor",
      "reason": "CLIENT_HEALTH_POOR",
      "data": {
        "count": 5
      }
    }
  ],
  "health": {
    "groups": [
      {
        "name": "Poor",
        "value": 40
      },
      {
        "name": "Poor",
        "value": 40
      }
    ]
  },
  "deviceTypes": [
    {
      "name": "Switches",
      "health": {
        "groups": [
          {
            "name": "Poor",
            "value": 40
          },
          {
            "name": "Poor",
            "value": 40
          }
        ]
      }
    },
    {
      "name": "Switches",
      "health": {
        "groups": [
          {
            "name": "Poor",
            "value": 40
          },
          {
            "name": "Poor",
            "value": 40
          }
        ]
      }
    }
  ],
  "clientTypes": [
    {
      "name": "Wired",
      "health": {
        "groups": [
          {
            "name": "Poor",
            "value": 40
          },
          {
            "name": "Poor",
            "value": 40
          }
        ]
      }
    },
    {
      "name": "Wired",
      "health": {
        "groups": [
          {
            "name": "Poor",
            "value": 40
          },
          {
            "name": "Poor",
            "value": 40
          }
        ]
      }
    }
  ],
  "compute": [
    {
      "name": "VM",
      "health": {
        "groups": [
          {
            "name": "Poor",
            "value": 40
          },
          {
            "name": "Poor",
            "value": 40
          }
        ]
      }
    },
    {
      "name": "VM",
      "health": {
        "groups": [
          {
            "name": "Poor",
            "value": 40
          },
          {
            "name": "Poor",
            "value": 40
          }
        ]
      }
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
  "id": "00001",
  "type": "network-monitoring/site-health",
  "response": {
    "status": "SUCCESS",
    "code": "SITE-HEALTH-SUCCESS-001",
    "message": "Sites details fetched successfully"
  },
  "reasons": [
    {
      "health": "Poor",
      "reason": "CLIENT_HEALTH_POOR",
      "data": {
        "count": 5
      }
    },
    {
      "health": "Poor",
      "reason": "CLIENT_HEALTH_POOR",
      "data": {
        "count": 5
      }
    }
  ],
  "health": {
    "groups": [
      {
        "name": "Poor",
        "value": 40
      },
      {
        "name": "Poor",
        "value": 40
      }
    ]
  },
  "deviceTypes": [
    {
      "name": "Switches",
      "health": {
        "groups": [
          {
            "name": "Poor",
            "value": 40
          },
          {
            "name": "Poor",
            "value": 40
          }
        ]
      }
    },
    {
      "name": "Switches",
      "health": {
        "groups": [
          {
            "name": "Poor",
            "value": 40
          },
          {
            "name": "Poor",
            "value": 40
          }
        ]
      }
    }
  ],
  "clientTypes": [
    {
      "name": "Wired",
      "health": {
        "groups": [
          {
            "name": "Poor",
            "value": 40
          },
          {
            "name": "Poor",
            "value": 40
          }
        ]
      }
    },
    {
      "name": "Wired",
      "health": {
        "groups": [
          {
            "name": "Poor",
            "value": 40
          },
          {
            "name": "Poor",
            "value": 40
          }
        ]
      }
    }
  ],
  "compute": [
    {
      "name": "VM",
      "health": {
        "groups": [
          {
            "name": "Poor",
            "value": 40
          },
          {
            "name": "Poor",
            "value": 40
          }
        ]
      }
    },
    {
      "name": "VM",
      "health": {
        "groups": [
          {
            "name": "Poor",
            "value": 40
          },
          {
            "name": "Poor",
            "value": 40
          }
        ]
      }
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

