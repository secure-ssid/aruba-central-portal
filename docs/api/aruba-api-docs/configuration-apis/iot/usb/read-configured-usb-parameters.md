# Read configured usb parameters

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/usb`

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
      "name": "<string>",
      "description": "<string>",
      "usb-profile": [
        {
          "usb-prof-name": "<string>",
          "acl": "<string>"
        },
        {
          "usb-prof-name": "<string>",
          "acl": "<string>"
        }
      ],
      "usb-acl-profile": [
        {
          "usb-acl-name": "<string>",
          "rule": [
            {
              "rule-name": "AMBERBOX_DETECTOR",
              "action": "PERMIT"
            },
            {
              "rule-name": "FRANKLIN_U301",
              "action": "DENY"
            }
          ]
        },
        {
          "usb-acl-name": "<string>",
          "rule": [
            {
              "rule-name": "ZTE_MF820",
              "action": "DENY"
            },
            {
              "rule-name": "HUAWEI_HWD12_LTE",
              "action": "PERMIT"
            }
          ]
        }
      ],
      "usb-profile-binding-name": "<string>"
    },
    {
      "name": "<string>",
      "description": "<string>",
      "usb-profile": [
        {
          "usb-prof-name": "<string>",
          "acl": "<string>"
        },
        {
          "usb-prof-name": "<string>",
          "acl": "<string>"
        }
      ],
      "usb-acl-profile": [
        {
          "usb-acl-name": "<string>",
          "rule": [
            {
              "rule-name": "ZTE_MF190_EGYPT",
              "action": "DENY"
            },
            {
              "rule-name": "HUAWEI_E160",
              "action": "DENY"
            }
          ]
        },
        {
          "usb-acl-name": "<string>",
          "rule": [
            {
              "rule-name": "HUAWEI_K4605",
              "action": "DENY"
            },
            {
              "rule-name": "SIERRA_881U",
              "action": "PERMIT"
            }
          ]
        }
      ],
      "usb-profile-binding-name": "<string>"
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

