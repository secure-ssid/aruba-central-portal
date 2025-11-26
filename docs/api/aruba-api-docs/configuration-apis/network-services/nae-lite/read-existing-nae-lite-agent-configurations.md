# Read existing nae-lite agent configurations

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/nae-lite/:name`

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
  "watches": [
    {
      "watch-name": "<string>",
      "type": "EVENT_LOG",
      "event-id": "<string>"
    },
    {
      "watch-name": "<string>",
      "type": "EVENT_LOG",
      "event-id": "<string>"
    }
  ],
  "monitors": [
    {
      "duration": "<integer>",
      "dur-unit": "DAYS",
      "monitor-name": "<string>",
      "alias": "CPU",
      "storage-location": "SECURITY",
      "module-mm": "MM_SLOT_1_1",
      "module-lc": "LC_SLOT_1_5",
      "vsf-member": "<integer>",
      "group-by": "RATE"
    },
    {
      "duration": "<integer>",
      "dur-unit": "HOURS",
      "monitor-name": "<string>",
      "alias": "CPU",
      "storage-location": "LOGS",
      "module-mm": "MM_SLOT_1_6",
      "module-lc": "LC_SLOT_1_7",
      "vsf-member": "<integer>",
      "group-by": "MIN"
    }
  ],
  "conditions": [
    {
      "include": "ANY",
      "include-regex": [
        "<string>",
        "<string>"
      ],
      "exclude-regex": [
        "<string>",
        "<string>"
      ],
      "count": "<long>",
      "operator": "GE",
      "operand": "0",
      "transition-from": "<string>",
      "transition-to": "<string>",
      "durationmonitor": "<integer>",
      "durunit-monitor": "SECONDS",
      "condtype": "CONDITION_1",
      "name-condition": "<string>",
      "set-monitor": "CLEAR_CONDITION",
      "set-watch": "CLEAR_CONDITION",
      "status": "NORMAL",
      "syslog": "<string>",
      "severity": "DEBUG",
      "facility": "FTP",
      "cli": "<string>",
      "redirect": "<string>",
      "nae-schedule": "<string>",
      "nae-trap": "<string>"
    },
    {
      "include": "ALL",
      "include-regex": [
        "<string>",
        "<string>"
      ],
      "exclude-regex": [
        "<string>",
        "<string>"
      ],
      "count": "<long>",
      "operator": "LE",
      "operand": "0",
      "transition-from": "<string>",
      "transition-to": "<string>",
      "durationmonitor": "<integer>",
      "durunit-monitor": "SECONDS",
      "condtype": "CONDITION_1",
      "name-condition": "<string>",
      "set-monitor": "CLEAR_CONDITION",
      "set-watch": "CLEAR_CONDITION",
      "status": "NORMAL",
      "syslog": "<string>",
      "severity": "NOTICE",
      "facility": "FTP",
      "cli": "<string>",
      "redirect": "<string>",
      "nae-schedule": "<string>",
      "nae-trap": "<string>"
    }
  ],
  "name": "<string>",
  "description": "<string>",
  "ready": "false",
  "disable": "false",
  "tags": [
    "<string>",
    "<string>"
  ],
  "agent-type": "MONITOR"
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

