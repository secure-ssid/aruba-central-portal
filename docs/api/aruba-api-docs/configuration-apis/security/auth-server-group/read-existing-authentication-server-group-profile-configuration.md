# Read existing Authentication Server Group profile configuration

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/server-groups/:name`

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
  "assignment-rules": {
    "assignment-rule": [
      {
        "sequence-id": "<long>",
        "attribute": "ARUBA_LOCATION_ID",
        "attribute-str": "<string>",
        "operator": "ENDS_WITH",
        "operand": "<string>",
        "assign-action": "ASSIGN_ROLE",
        "vlan": "<integer>",
        "role": "<string>"
      },
      {
        "sequence-id": "<long>",
        "attribute": "WISPR_REDIRECTION_URL",
        "attribute-str": "<string>",
        "operator": "MATCH_EQUAL",
        "operand": "<string>",
        "assign-action": "ASSIGN_ROLE",
        "vlan": "<integer>",
        "role": "<string>"
      }
    ]
  },
  "attribute-profile": {
    "tunnel-private-group-id": {
      "value": "DYNAMIC",
      "request-type": "ACCOUNTING"
    },
    "nas-identifier": {
      "value": "<string>",
      "request-type": "AUTHENTICATION"
    },
    "nas-ip-address": {
      "request-type": "BOTH",
      "service-type": "PORT_ACCESS"
    },
    "framed-ip-address": {
      "request-type": "BOTH",
      "service-type": "BOTH"
    },
    "vsa": [
      {
        "vendor-vsa-type": "<string>",
        "vendor": "ARUBA",
        "vsa-type": "ATTRIBUTE_VALUE_PAIR",
        "vsa-value": "DFP_CLIENT_INFO"
      },
      {
        "vendor-vsa-type": "<string>",
        "vendor": "ARUBA",
        "vsa-type": "ATTRIBUTE_VALUE_PAIR",
        "vsa-value": "DFP_CLIENT_INFO"
      }
    ]
  },
  "name": "<string>",
  "description": "<string>",
  "type": "LOCAL",
  "count-servers": "<long>",
  "load-balance": "false",
  "load-balance-algo": "LOR",
  "fail-through": "false",
  "servers": [
    {
      "server-name": "<string>",
      "position": "<integer>",
      "match-rules": [
        {
          "operator-match-string-match-type": "<string>",
          "match-type": "FQDN",
          "operator": "NONE",
          "match-string": "<string>"
        },
        {
          "operator-match-string-match-type": "<string>",
          "match-type": "FQDN",
          "operator": "NONE",
          "match-string": "<string>"
        }
      ],
      "trim-fqdn": "<boolean>"
    },
    {
      "server-name": "<string>",
      "position": "<integer>",
      "match-rules": [
        {
          "operator-match-string-match-type": "<string>",
          "match-type": "AUTHSTRING",
          "operator": "STARTS_WITH",
          "match-string": "<string>"
        },
        {
          "operator-match-string-match-type": "<string>",
          "match-type": "AUTHSTRING",
          "operator": "CONTAINS",
          "match-string": "<string>"
        }
      ],
      "trim-fqdn": "<boolean>"
    }
  ]
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

