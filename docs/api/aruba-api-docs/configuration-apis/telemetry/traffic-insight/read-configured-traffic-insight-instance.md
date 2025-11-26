# Read configured Traffic-insight Instance

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/traffic-insight`

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
  "instance": [
    {
      "monitor": [
        {
          "monitor-name-type": "<string>",
          "monitor-n-flows": "5",
          "group-by": "APP_ID",
          "single-value-filter": {
            "parameter": "DESTINATION_IP_MASK",
            "source-ip": "<string>",
            "destination-ip": "<string>",
            "source-ip-prefix": "<string>",
            "destination-ip-prefix": "<string>",
            "source-port": "<integer>",
            "destination-port": "<integer>",
            "ip-protocol": "IP_UDP",
            "application-id": "<integer>",
            "egress-interface": "<string>",
            "egress-queue": "<integer>"
          },
          "reset-interval": "600"
        },
        {
          "monitor-name-type": "<string>",
          "monitor-n-flows": "5",
          "group-by": "EGRESS_INTERFACE",
          "single-value-filter": {
            "parameter": "IP_PROTOCOL",
            "source-ip": "<string>",
            "destination-ip": "<string>",
            "source-ip-prefix": "<string>",
            "destination-ip-prefix": "<string>",
            "source-port": "<integer>",
            "destination-port": "<integer>",
            "ip-protocol": "IP_IGMP",
            "application-id": "<integer>",
            "egress-interface": "<string>",
            "egress-queue": "<integer>"
          },
          "reset-interval": "600"
        }
      ],
      "name": "<string>",
      "enable": "false",
      "source": "IPFIX"
    },
    {
      "monitor": [
        {
          "monitor-name-type": "<string>",
          "monitor-n-flows": "5",
          "group-by": "DST_PORT",
          "single-value-filter": {
            "parameter": "DESTINATION_IP",
            "source-ip": "<string>",
            "destination-ip": "<string>",
            "source-ip-prefix": "<string>",
            "destination-ip-prefix": "<string>",
            "source-port": "<integer>",
            "destination-port": "<integer>",
            "ip-protocol": "<integer>",
            "application-id": "<integer>",
            "egress-interface": "<string>",
            "egress-queue": "<integer>"
          },
          "reset-interval": "600"
        },
        {
          "monitor-name-type": "<string>",
          "monitor-n-flows": "5",
          "group-by": "IP_PROTO",
          "single-value-filter": {
            "parameter": "DESTINATION_PORT",
            "source-ip": "<string>",
            "destination-ip": "<string>",
            "source-ip-prefix": "<string>",
            "destination-ip-prefix": "<string>",
            "source-port": "<integer>",
            "destination-port": "<integer>",
            "ip-protocol": "<integer>",
            "application-id": "<integer>",
            "egress-interface": "<string>",
            "egress-queue": "<integer>"
          },
          "reset-interval": "600"
        }
      ],
      "name": "<string>",
      "enable": "false",
      "source": "IPFIX"
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

