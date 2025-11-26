# Read configured fault monitor profiles

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/fault-monitor`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Successful operation

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "profile": [
    {
      "link-flap": {
        "enable": "<boolean>",
        "sensitivity": "HIGH",
        "action": "NOTIFY"
      },
      "excessive-oversize-packets": {
        "enable": "<boolean>",
        "sensitivity": "MEDIUM",
        "action": "NOTIFY"
      },
      "excessive-fragments": {
        "enable": "<boolean>",
        "sensitivity": "HIGH",
        "action": "NOTIFY"
      },
      "excessive-crc-errors": {
        "enable": "<boolean>",
        "sensitivity": "LOW",
        "action": "NOTIFY"
      },
      "excessive-jabbers": {
        "enable": "<boolean>",
        "sensitivity": "MEDIUM",
        "action": "NOTIFY"
      },
      "excessive-late-collisions": {
        "enable": "<boolean>",
        "sensitivity": "LOW",
        "action": "NOTIFY"
      },
      "excessive-collisions": {
        "enable": "<boolean>",
        "sensitivity": "LOW",
        "action": "NOTIFY"
      },
      "excessive-tx-drops": {
        "enable": "<boolean>",
        "sensitivity": "MEDIUM",
        "action": "NOTIFY"
      },
      "excessive-fc-triggers": {
        "enable": "<boolean>",
        "sensitivity": "HIGH",
        "action": "NOTIFY"
      },
      "excessive-alignment-errors": {
        "enable": "<boolean>",
        "sensitivity": "HIGH",
        "action": "NOTIFY"
      },
      "excessive-broadcasts": {
        "enable": "<boolean>",
        "sensitivity": "HIGH",
        "action": "NOTIFY",
        "threshold-units": "PERCENT",
        "threshold-percent": "<integer>",
        "threshold-rate": "<long>"
      },
      "excessive-multicasts": {
        "enable": "<boolean>",
        "sensitivity": "LOW",
        "action": "NOTIFY",
        "threshold-units": "PPS",
        "threshold-percent": "<integer>",
        "threshold-rate": "<long>"
      },
      "name": "<string>",
      "description": "<string>"
    },
    {
      "link-flap": {
        "enable": "<boolean>",
        "sensitivity": "MEDIUM",
        "action": "NOTIFY"
      },
      "excessive-oversize-packets": {
        "enable": "<boolean>",
        "sensitivity": "MEDIUM",
        "action": "NOTIFY"
      },
      "excessive-fragments": {
        "enable": "<boolean>",
        "sensitivity": "LOW",
        "action": "NOTIFY"
      },
      "excessive-crc-errors": {
        "enable": "<boolean>",
        "sensitivity": "MEDIUM",
        "action": "NOTIFY"
      },
      "excessive-jabbers": {
        "enable": "<boolean>",
        "sensitivity": "LOW",
        "action": "NOTIFY"
      },
      "excessive-late-collisions": {
        "enable": "<boolean>",
        "sensitivity": "HIGH",
        "action": "NOTIFY"
      },
      "excessive-collisions": {
        "enable": "<boolean>",
        "sensitivity": "HIGH",
        "action": "NOTIFY"
      },
      "excessive-tx-drops": {
        "enable": "<boolean>",
        "sensitivity": "HIGH",
        "action": "NOTIFY"
      },
      "excessive-fc-triggers": {
        "enable": "<boolean>",
        "sensitivity": "MEDIUM",
        "action": "NOTIFY"
      },
      "excessive-alignment-errors": {
        "enable": "<boolean>",
        "sensitivity": "LOW",
        "action": "NOTIFY"
      },
      "excessive-broadcasts": {
        "enable": "<boolean>",
        "sensitivity": "LOW",
        "action": "NOTIFY",
        "threshold-units": "PERCENT",
        "threshold-percent": "<integer>",
        "threshold-rate": "<long>"
      },
      "excessive-multicasts": {
        "enable": "<boolean>",
        "sensitivity": "LOW",
        "action": "NOTIFY",
        "threshold-units": "PERCENT",
        "threshold-percent": "<integer>",
        "threshold-rate": "<long>"
      },
      "name": "<string>",
      "description": "<string>"
    }
  ],
  "metadata": {
    "count_objects_in_module": {
      "LOCAL": 0,
      "SHARED": 0,
      "ANY": 0
    }
  }
}
```
---

#### Bad Request

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Unauthorized Access

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Forbidden

**Status:** 403 Forbidden

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Not Found

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Not Acceptable

**Status:** 406 Not Acceptable

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Request Timeout

**Status:** 408 Request Timeout

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Precondition Failed

**Status:** 412 Precondition Failed

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Rate limit exceeded

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

#### Internal Server Error

**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": "<long>",
  "errorCode": "<string>",
  "message": "<string>",
  "debugId": "<string>"
}
```
---

