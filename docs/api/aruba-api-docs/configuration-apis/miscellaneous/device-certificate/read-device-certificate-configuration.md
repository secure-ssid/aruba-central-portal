# Read Device Certificate configuration.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/device-certificates`

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
  "device-certificate": [
    {
      "subject": {
        "common-name": "<string>",
        "org": "<string>",
        "org-unit": "<string>",
        "locality": "<string>",
        "state": "<string>",
        "country": "<string>",
        "include-serial-number": "<boolean>"
      },
      "name": "<string>",
      "cert-key-type": "ECDSA",
      "rsa-key-length": "KEY_LEN_1024",
      "ecdsa-curve-size": "CURVE_SIZE_521",
      "app-usage": [
        "SSH_SERVER",
        "CAPTIVE_PORTAL"
      ],
      "validity-start": "<string>",
      "validity-end": "<string>",
      "subject-alt-name-dns": "<string>",
      "subject-alt-name-ip": "<string>",
      "key-usage": [
        "DATA_ENCIPHERMENT",
        "KEY_ENCIPHERMENT"
      ],
      "key-usage-restriction": "KEY_RESTRICTION_DECIPHER",
      "ext-key-usage": [
        "SERVER_AUTH",
        "CLIENT_AUTH"
      ],
      "est-profile": "<string>"
    },
    {
      "subject": {
        "common-name": "<string>",
        "org": "<string>",
        "org-unit": "<string>",
        "locality": "<string>",
        "state": "<string>",
        "country": "<string>",
        "include-serial-number": "<boolean>"
      },
      "name": "<string>",
      "cert-key-type": "RSA",
      "rsa-key-length": "KEY_LEN_4096",
      "ecdsa-curve-size": "CURVE_SIZE_521",
      "app-usage": [
        "SSH_CLIENT",
        "ALL"
      ],
      "validity-start": "<string>",
      "validity-end": "<string>",
      "subject-alt-name-dns": "<string>",
      "subject-alt-name-ip": "<string>",
      "key-usage": [
        "KEY_AGREEMENT",
        "NON_REPUDIATION"
      ],
      "key-usage-restriction": "KEY_RESTRICTION_ENCIPHER",
      "ext-key-usage": [
        "SERVER_AUTH",
        "SERVER_AUTH"
      ],
      "est-profile": "<string>"
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

