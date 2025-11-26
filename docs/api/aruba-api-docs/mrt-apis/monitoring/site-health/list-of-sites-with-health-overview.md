# List of sites with health overview

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/sites-health`

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
      "type": "network-monitoring/sites-health",
      "name": "Site 1",
      "address": {
        "country": "India",
        "address": "HPE Mahadevpura",
        "city": "Bangalore",
        "zipCode": "560048",
        "state": "Karnataka"
      },
      "alerts": {
        "totalCount": 15,
        "groups": [
          {
            "name": "Critical",
            "count": 15
          },
          {
            "name": "Critical",
            "count": 15
          }
        ]
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
      "devices": {
        "count": 125,
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
      "clients": {
        "count": 125,
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
    },
    {
      "id": "00001",
      "type": "network-monitoring/sites-health",
      "name": "Site 1",
      "address": {
        "country": "India",
        "address": "HPE Mahadevpura",
        "city": "Bangalore",
        "zipCode": "560048",
        "state": "Karnataka"
      },
      "alerts": {
        "totalCount": 15,
        "groups": [
          {
            "name": "Critical",
            "count": 15
          },
          {
            "name": "Critical",
            "count": 15
          }
        ]
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
      "devices": {
        "count": 125,
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
      "clients": {
        "count": 125,
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
      "type": "network-monitoring/sites-health",
      "name": "Site 1",
      "address": {
        "country": "India",
        "address": "HPE Mahadevpura",
        "city": "Bangalore",
        "zipCode": "560048",
        "state": "Karnataka"
      },
      "alerts": {
        "totalCount": 15,
        "groups": [
          {
            "name": "Critical",
            "count": 15
          },
          {
            "name": "Critical",
            "count": 15
          }
        ]
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
      "devices": {
        "count": 125,
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
      "clients": {
        "count": 125,
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
    },
    {
      "id": "00001",
      "type": "network-monitoring/sites-health",
      "name": "Site 1",
      "address": {
        "country": "India",
        "address": "HPE Mahadevpura",
        "city": "Bangalore",
        "zipCode": "560048",
        "state": "Karnataka"
      },
      "alerts": {
        "totalCount": 15,
        "groups": [
          {
            "name": "Critical",
            "count": 15
          },
          {
            "name": "Critical",
            "count": 15
          }
        ]
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
      "devices": {
        "count": 125,
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
      "clients": {
        "count": 125,
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

