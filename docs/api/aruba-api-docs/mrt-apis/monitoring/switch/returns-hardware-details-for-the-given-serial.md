# Returns hardware details for the given serial.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/switch/:serial/hardware-categories?site-id=2345678`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| site-id | 2345678 | ID of the site for which switch-related information is requested. |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Object containing the switch information

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
      "id": "CN31HKZ0CN",
      "type": "switch-hardware",
      "serial": "CN31HKZ0CN",
      "model": "AS-2930M",
      "role": "Standby",
      "cpu": {
        "health": "Good"
      },
      "memory": {
        "health": "Good"
      },
      "temperature": {
        "health": "Good"
      },
      "fans": {
        "health": "Good",
        "totalCount": 2786,
        "upCount": 8677,
        "failedIds": [
          {
            "stackMemberId": 9419,
            "ids": [
              "1",
              "2"
            ]
          },
          {
            "stackMemberId": 1110,
            "ids": [
              "1",
              "2"
            ]
          }
        ]
      },
      "powerSupplies": {
        "health": "Good",
        "totalCount": 5897,
        "upCount": 216,
        "failedIds": [
          {
            "stackMemberId": 631,
            "ids": [
              "1",
              "2"
            ]
          },
          {
            "stackMemberId": 6287,
            "ids": [
              "1",
              "2"
            ]
          }
        ]
      },
      "poeSlots": {
        "health": "Good",
        "totalCount": 9650,
        "upCount": 9985,
        "failedIds": [
          {
            "stackMemberId": 5979,
            "ids": [
              "1",
              "2"
            ]
          },
          {
            "stackMemberId": 3591,
            "ids": [
              "1",
              "2"
            ]
          }
        ]
      },
      "stackMemberId": 5085,
      "status": "online"
    },
    {
      "id": "CN31HKZ0CN",
      "type": "switch-hardware",
      "serial": "CN31HKZ0CN",
      "model": "AS-2930M",
      "role": "Standby",
      "cpu": {
        "health": "Good"
      },
      "memory": {
        "health": "Good"
      },
      "temperature": {
        "health": "Good"
      },
      "fans": {
        "health": "Good",
        "totalCount": 7094,
        "upCount": 2450,
        "failedIds": [
          {
            "stackMemberId": 1902,
            "ids": [
              "1",
              "2"
            ]
          },
          {
            "stackMemberId": 8274,
            "ids": [
              "1",
              "2"
            ]
          }
        ]
      },
      "powerSupplies": {
        "health": "Good",
        "totalCount": 2695,
        "upCount": 7019,
        "failedIds": [
          {
            "stackMemberId": 5508,
            "ids": [
              "1",
              "2"
            ]
          },
          {
            "stackMemberId": 8427,
            "ids": [
              "1",
              "2"
            ]
          }
        ]
      },
      "poeSlots": {
        "health": "Good",
        "totalCount": 9846,
        "upCount": 1024,
        "failedIds": [
          {
            "stackMemberId": 9463,
            "ids": [
              "1",
              "2"
            ]
          },
          {
            "stackMemberId": 9398,
            "ids": [
              "1",
              "2"
            ]
          }
        ]
      },
      "stackMemberId": 9114,
      "status": "online"
    }
  ],
  "count": 2
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

#### Device with serial number not found.

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
  "errorCode": "HPE_GL_NETWORK_MONITORING_THREAT_NOT_FOUND",
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

#### Object containing the switch information

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
      "id": "CN31HKZ0CN",
      "type": "switch-hardware",
      "serial": "CN31HKZ0CN",
      "model": "AS-2930M",
      "role": "Standby",
      "cpu": {
        "health": "Good"
      },
      "memory": {
        "health": "Good"
      },
      "temperature": {
        "health": "Good"
      },
      "fans": {
        "health": "Good",
        "totalCount": 2786,
        "upCount": 8677,
        "failedIds": [
          {
            "stackMemberId": 9419,
            "ids": [
              "1",
              "2"
            ]
          },
          {
            "stackMemberId": 1110,
            "ids": [
              "1",
              "2"
            ]
          }
        ]
      },
      "powerSupplies": {
        "health": "Good",
        "totalCount": 5897,
        "upCount": 216,
        "failedIds": [
          {
            "stackMemberId": 631,
            "ids": [
              "1",
              "2"
            ]
          },
          {
            "stackMemberId": 6287,
            "ids": [
              "1",
              "2"
            ]
          }
        ]
      },
      "poeSlots": {
        "health": "Good",
        "totalCount": 9650,
        "upCount": 9985,
        "failedIds": [
          {
            "stackMemberId": 5979,
            "ids": [
              "1",
              "2"
            ]
          },
          {
            "stackMemberId": 3591,
            "ids": [
              "1",
              "2"
            ]
          }
        ]
      },
      "stackMemberId": 5085,
      "status": "online"
    },
    {
      "id": "CN31HKZ0CN",
      "type": "switch-hardware",
      "serial": "CN31HKZ0CN",
      "model": "AS-2930M",
      "role": "Standby",
      "cpu": {
        "health": "Good"
      },
      "memory": {
        "health": "Good"
      },
      "temperature": {
        "health": "Good"
      },
      "fans": {
        "health": "Good",
        "totalCount": 7094,
        "upCount": 2450,
        "failedIds": [
          {
            "stackMemberId": 1902,
            "ids": [
              "1",
              "2"
            ]
          },
          {
            "stackMemberId": 8274,
            "ids": [
              "1",
              "2"
            ]
          }
        ]
      },
      "powerSupplies": {
        "health": "Good",
        "totalCount": 2695,
        "upCount": 7019,
        "failedIds": [
          {
            "stackMemberId": 5508,
            "ids": [
              "1",
              "2"
            ]
          },
          {
            "stackMemberId": 8427,
            "ids": [
              "1",
              "2"
            ]
          }
        ]
      },
      "poeSlots": {
        "health": "Good",
        "totalCount": 9846,
        "upCount": 1024,
        "failedIds": [
          {
            "stackMemberId": 9463,
            "ids": [
              "1",
              "2"
            ]
          },
          {
            "stackMemberId": 9398,
            "ids": [
              "1",
              "2"
            ]
          }
        ]
      },
      "stackMemberId": 9114,
      "status": "online"
    }
  ],
  "count": 2
}
```
---

#### Device with serial number not found.

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
  "errorCode": "HPE_GL_NETWORK_MONITORING_THREAT_NOT_FOUND",
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

