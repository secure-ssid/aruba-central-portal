# Read existing job-scheduler configurations

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/job-scheduler`

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
  "schedule": [
    {
      "schedule-entry": [
        {
          "sequence-number": "<long>",
          "schedule-job": "<string>"
        },
        {
          "sequence-number": "<long>",
          "schedule-job": "<string>"
        }
      ],
      "job": [
        {
          "entry": [
            {
              "cli-command": "<string>",
              "sequence-number": "<long>",
              "cli-delay": "<integer>",
              "type": "CLI"
            },
            {
              "cli-command": "<string>",
              "sequence-number": "<long>",
              "cli-delay": "<integer>",
              "type": "CLI"
            }
          ],
          "job-name": "<string>",
          "description": "<string>",
          "enable": "false"
        },
        {
          "entry": [
            {
              "cli-command": "<string>",
              "sequence-number": "<long>",
              "cli-delay": "<integer>",
              "type": "CLI"
            },
            {
              "cli-command": "<string>",
              "sequence-number": "<long>",
              "cli-delay": "<integer>",
              "type": "CLI"
            }
          ],
          "job-name": "<string>",
          "description": "<string>",
          "enable": "false"
        }
      ],
      "frequency": "WEEKLY",
      "week-day": "sunday",
      "days-of-the-week": [
        "thursday",
        "thursday"
      ],
      "month-day": "<integer>",
      "yearly-date": "<string>",
      "start-date-at": "<string>",
      "start-time-at": "<string>",
      "start-time-on": "<string>",
      "start-date-on": "<string>",
      "start-date-every": "<string>",
      "start-time-every": "<string>",
      "days": "<integer>",
      "hours": "<integer>",
      "minutes": "<long>",
      "duration": "<string>",
      "name": "<string>",
      "description": "<string>",
      "enable": "false"
    },
    {
      "schedule-entry": [
        {
          "sequence-number": "<long>",
          "schedule-job": "<string>"
        },
        {
          "sequence-number": "<long>",
          "schedule-job": "<string>"
        }
      ],
      "job": [
        {
          "entry": [
            {
              "cli-command": "<string>",
              "sequence-number": "<long>",
              "cli-delay": "<integer>",
              "type": "CLI"
            },
            {
              "cli-command": "<string>",
              "sequence-number": "<long>",
              "cli-delay": "<integer>",
              "type": "CLI"
            }
          ],
          "job-name": "<string>",
          "description": "<string>",
          "enable": "false"
        },
        {
          "entry": [
            {
              "cli-command": "<string>",
              "sequence-number": "<long>",
              "cli-delay": "<integer>",
              "type": "CLI"
            },
            {
              "cli-command": "<string>",
              "sequence-number": "<long>",
              "cli-delay": "<integer>",
              "type": "CLI"
            }
          ],
          "job-name": "<string>",
          "description": "<string>",
          "enable": "false"
        }
      ],
      "frequency": "YEARLY",
      "week-day": "sunday",
      "days-of-the-week": [
        "monday",
        "sunday"
      ],
      "month-day": "<integer>",
      "yearly-date": "<string>",
      "start-date-at": "<string>",
      "start-time-at": "<string>",
      "start-time-on": "<string>",
      "start-date-on": "<string>",
      "start-date-every": "<string>",
      "start-time-every": "<string>",
      "days": "<integer>",
      "hours": "<integer>",
      "minutes": "<long>",
      "duration": "<string>",
      "name": "<string>",
      "description": "<string>",
      "enable": "false"
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

