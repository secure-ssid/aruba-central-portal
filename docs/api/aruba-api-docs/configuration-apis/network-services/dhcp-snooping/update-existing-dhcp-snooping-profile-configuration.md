# Update existing DHCP-Snooping profile configuration

## Request

**Method:** `PATCH`

**URL:** `{{baseUrl}}/network-config/v1alpha1/dhcp-snooping/:name`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Content-Type | application/json |  |
| Accept | application/json |  |

### Request Body

```json
{
  "ipv4": {
    "external-storage": {
      "external-storage-profile-name": "<string>",
      "external-storage-ref": "<string>",
      "filename": "<string>"
    },
    "flash-storage": {
      "flash-storage-enable": "false",
      "delay": "900"
    },
    "remote-storage": {
      "mode": "TFTP",
      "username": "<string>",
      "password": "<string>",
      "enable-validate-sftp-server": "false",
      "server-address": "<string>",
      "file-name": "<string>",
      "delay": "300",
      "port": "0",
      "timeout": "300"
    },
    "authorized-server": [
      {
        "vrf": "<string>",
        "ip": [
          "<string>",
          "<string>"
        ]
      },
      {
        "vrf": "<string>",
        "ip": [
          "<string>",
          "<string>"
        ]
      }
    ]
  },
  "ipv6": {
    "external-storage": {
      "external-storage-profile-name": "<string>",
      "external-storage-ref": "<string>",
      "filename": "<string>"
    },
    "flash-storage": {
      "flash-storage-enable": "false",
      "delay": "900"
    },
    "remote-storage": {
      "mode": "SFTP",
      "username": "<string>",
      "password": "<string>",
      "enable-validate-sftp-server": "false",
      "server-address": "<string>",
      "file-name": "<string>",
      "delay": "300",
      "port": "0",
      "timeout": "300"
    },
    "authorized-server": [
      {
        "vrf": "<string>",
        "ip": [
          "<string>",
          "<string>"
        ]
      },
      {
        "vrf": "<string>",
        "ip": [
          "<string>",
          "<string>"
        ]
      }
    ],
    "ipv6-guard-policy": [
      {
        "policy-name": "<string>",
        "match-client": "<string>",
        "match-server": "<string>",
        "preference": {
          "min-preference": "0",
          "max-preference": "255"
        }
      },
      {
        "policy-name": "<string>",
        "match-client": "<string>",
        "match-server": "<string>",
        "preference": {
          "min-preference": "0",
          "max-preference": "255"
        }
      }
    ]
  },
  "name": "<string>",
  "description": "<string>"
}
```
### Response Examples

#### Successful Operation

**Status:** 200 OK

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

