# Configure sFlow by unique name.

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-config/v1alpha1/sflow/:name`

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
  "name": "<string>",
  "description": "<string>",
  "session": [
    {
      "collector": [
        {
          "col-name": "<string>",
          "ip-address": "<string>",
          "udp-port": "<integer>",
          "use-oobm": "false",
          "vrf": "<string>"
        },
        {
          "col-name": "<string>",
          "ip-address": "<string>",
          "udp-port": "<integer>",
          "use-oobm": "false",
          "vrf": "<string>"
        }
      ],
      "session-id": "<integer>",
      "enable": "false",
      "sampling-rate": "4096",
      "polling-interval": "30",
      "maximum-header-size": "128",
      "maximum-datagram-size": "1400",
      "agent-address": "<string>",
      "mode": "BOTH",
      "ethernet-interfaces": [
        {
          "sampling-enable": "false",
          "sampling-rate": "<long>",
          "polling-enable": "false",
          "polling-interval": "<long>",
          "eth-name": "<string>"
        },
        {
          "sampling-enable": "false",
          "sampling-rate": "<long>",
          "polling-enable": "false",
          "polling-interval": "<long>",
          "eth-name": "<string>"
        }
      ],
      "lag-interfaces": [
        {
          "sampling-enable": "false",
          "sampling-rate": "<long>",
          "polling-enable": "false",
          "polling-interval": "<long>",
          "lag-name": "<string>"
        },
        {
          "sampling-enable": "false",
          "sampling-rate": "<long>",
          "polling-enable": "false",
          "polling-interval": "<long>",
          "lag-name": "<string>"
        }
      ]
    },
    {
      "collector": [
        {
          "col-name": "<string>",
          "ip-address": "<string>",
          "udp-port": "<integer>",
          "use-oobm": "false",
          "vrf": "<string>"
        },
        {
          "col-name": "<string>",
          "ip-address": "<string>",
          "udp-port": "<integer>",
          "use-oobm": "false",
          "vrf": "<string>"
        }
      ],
      "session-id": "<integer>",
      "enable": "false",
      "sampling-rate": "4096",
      "polling-interval": "30",
      "maximum-header-size": "128",
      "maximum-datagram-size": "1400",
      "agent-address": "<string>",
      "mode": "BOTH",
      "ethernet-interfaces": [
        {
          "sampling-enable": "false",
          "sampling-rate": "<long>",
          "polling-enable": "false",
          "polling-interval": "<long>",
          "eth-name": "<string>"
        },
        {
          "sampling-enable": "false",
          "sampling-rate": "<long>",
          "polling-enable": "false",
          "polling-interval": "<long>",
          "eth-name": "<string>"
        }
      ],
      "lag-interfaces": [
        {
          "sampling-enable": "false",
          "sampling-rate": "<long>",
          "polling-enable": "false",
          "polling-interval": "<long>",
          "lag-name": "<string>"
        },
        {
          "sampling-enable": "false",
          "sampling-rate": "<long>",
          "polling-enable": "false",
          "polling-interval": "<long>",
          "lag-name": "<string>"
        }
      ]
    }
  ]
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

