# Read existing H2QP OSU provider related settings.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/h2qp-osu-provider`

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
  "h2qp-osu-provider-profile": [
    {
      "name": "<string>",
      "enable": "true",
      "friendly-name-duple": [
        {
          "value": "<string>",
          "lang-code": "eng",
          "hex": "<string>"
        },
        {
          "value": "<string>",
          "lang-code": "eng",
          "hex": "<string>"
        }
      ],
      "osu-server-uri": "<string>",
      "icons-available": [
        {
          "file-index": "<integer>",
          "filename": "<string>",
          "width": "128",
          "height": "128",
          "lang-code": "eng",
          "icon-type": "image/png"
        },
        {
          "file-index": "<integer>",
          "filename": "<string>",
          "width": "128",
          "height": "128",
          "lang-code": "eng",
          "icon-type": "image/png"
        }
      ],
      "srvc-desc": [
        {
          "desc": "<string>",
          "lang-code": "eng",
          "desc-hex": "<string>"
        },
        {
          "desc": "<string>",
          "lang-code": "eng",
          "desc-hex": "<string>"
        }
      ],
      "osu-method": "SOAP_XML"
    },
    {
      "name": "<string>",
      "enable": "true",
      "friendly-name-duple": [
        {
          "value": "<string>",
          "lang-code": "eng",
          "hex": "<string>"
        },
        {
          "value": "<string>",
          "lang-code": "eng",
          "hex": "<string>"
        }
      ],
      "osu-server-uri": "<string>",
      "icons-available": [
        {
          "file-index": "<integer>",
          "filename": "<string>",
          "width": "128",
          "height": "128",
          "lang-code": "eng",
          "icon-type": "image/png"
        },
        {
          "file-index": "<integer>",
          "filename": "<string>",
          "width": "128",
          "height": "128",
          "lang-code": "eng",
          "icon-type": "image/png"
        }
      ],
      "srvc-desc": [
        {
          "desc": "<string>",
          "lang-code": "eng",
          "desc-hex": "<string>"
        },
        {
          "desc": "<string>",
          "lang-code": "eng",
          "desc-hex": "<string>"
        }
      ],
      "osu-method": "SOAP_XML"
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

