# List gateway uplink performance trends for the selected probe

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/gateways/:serial-number/uplinks/:link-tag/probes/:probe/performance-trends`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### The response object provides a list of probes that are available for the uplink.


**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
[
  {
    "metric": "latency",
    "graph": {
      "keys": [
        "latency"
      ],
      "samples": [
        {
          "data": [
            1.3
          ],
          "timestamp": "2022-07-30T20:00:00Z"
        }
      ]
    },
    "id": "GW00000001/uplinks/airtel/probes/Health Check",
    "type": "network-monitoring/gateway-monitoring"
  },
  {
    "metric": "jitter",
    "graph": {
      "keys": [
        "jitter"
      ],
      "samples": [
        {
          "data": [
            0.09
          ],
          "timestamp": "2022-07-30T20:00:00Z"
        }
      ]
    },
    "id": "GW00000001/uplinks/airtel/probes/Health Check",
    "type": "network-monitoring/gateway-monitoring"
  },
  {
    "metric": "packet_loss",
    "graph": {
      "keys": [
        "packet_loss"
      ],
      "samples": [
        {
          "data": [
            6.9
          ],
          "timestamp": "2022-07-30T20:00:00Z"
        }
      ]
    },
    "id": "GW00000001/uplinks/airtel/probes/Health Check",
    "type": "network-monitoring/gateway-monitoring"
  },
  {
    "metric": "mos_score",
    "graph": {
      "keys": [
        "mos_score"
      ],
      "samples": [
        {
          "data": [
            3.8
          ],
          "timestamp": "2022-07-30T20:00:00Z"
        }
      ]
    },
    "id": "GW00000001/uplinks/airtel/probes/Health Check",
    "type": "network-monitoring/gateway-monitoring"
  }
]
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

#### The response object provides a list of probes that are available for the uplink.


**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
[
  {
    "metric": "latency",
    "graph": {
      "keys": [
        "latency"
      ],
      "samples": [
        {
          "data": [
            1.3
          ],
          "timestamp": "2022-07-30T20:00:00Z"
        }
      ]
    },
    "id": "GW00000001/uplinks/airtel/probes/Health Check",
    "type": "network-monitoring/gateway-monitoring"
  },
  {
    "metric": "jitter",
    "graph": {
      "keys": [
        "jitter"
      ],
      "samples": [
        {
          "data": [
            0.09
          ],
          "timestamp": "2022-07-30T20:00:00Z"
        }
      ]
    },
    "id": "GW00000001/uplinks/airtel/probes/Health Check",
    "type": "network-monitoring/gateway-monitoring"
  },
  {
    "metric": "packet_loss",
    "graph": {
      "keys": [
        "packet_loss"
      ],
      "samples": [
        {
          "data": [
            6.9
          ],
          "timestamp": "2022-07-30T20:00:00Z"
        }
      ]
    },
    "id": "GW00000001/uplinks/airtel/probes/Health Check",
    "type": "network-monitoring/gateway-monitoring"
  },
  {
    "metric": "mos_score",
    "graph": {
      "keys": [
        "mos_score"
      ],
      "samples": [
        {
          "data": [
            3.8
          ],
          "timestamp": "2022-07-30T20:00:00Z"
        }
      ]
    },
    "id": "GW00000001/uplinks/airtel/probes/Health Check",
    "type": "network-monitoring/gateway-monitoring"
  }
]
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

