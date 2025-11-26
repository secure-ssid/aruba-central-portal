# Read configuration of Authentication Server Group

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/server-groups`

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
  "server-group": [
    {
      "assignment-rules": {
        "assignment-rule": [
          {
            "sequence-id": "<long>",
            "attribute": "RTTS_EARLYLIFT_THRESHOLD",
            "attribute-str": "<string>",
            "operator": "VALUE_OF",
            "operand": "<string>",
            "assign-action": "ASSIGN_ROLE",
            "vlan": "<integer>",
            "role": "<string>"
          },
          {
            "sequence-id": "<long>",
            "attribute": "ARUBA_NETWORK_SSO_TOKEN",
            "attribute-str": "<string>",
            "operator": "STARTS_WITH",
            "operand": "<string>",
            "assign-action": "ASSIGN_VLAN",
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
          "request-type": "ACCOUNTING"
        },
        "nas-ip-address": {
          "request-type": "BOTH",
          "service-type": "PORT_ACCESS"
        },
        "framed-ip-address": {
          "request-type": "ACCOUNTING",
          "service-type": "MANAGEMENT"
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
      "type": "LDAP",
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
              "operator": "EQUALS",
              "match-string": "<string>"
            },
            {
              "operator-match-string-match-type": "<string>",
              "match-type": "AUTHSTRING",
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
              "match-type": "FQDN",
              "operator": "CONTAINS",
              "match-string": "<string>"
            },
            {
              "operator-match-string-match-type": "<string>",
              "match-type": "FQDN",
              "operator": "STARTS_WITH",
              "match-string": "<string>"
            }
          ],
          "trim-fqdn": "<boolean>"
        }
      ]
    },
    {
      "assignment-rules": {
        "assignment-rule": [
          {
            "sequence-id": "<long>",
            "attribute": "CONNECT_RATE",
            "attribute-str": "<string>",
            "operator": "MATCH_EQUAL",
            "operand": "<string>",
            "assign-action": "ASSIGN_ROLE",
            "vlan": "<string>",
            "role": "<string>"
          },
          {
            "sequence-id": "<long>",
            "attribute": "RTTS_BACKOFF_TIME",
            "attribute-str": "<string>",
            "operator": "MATCHES_REGULAR_EXPRESSION",
            "operand": "<string>",
            "assign-action": "ASSIGN_VLAN",
            "vlan": "<integer>",
            "role": "<string>"
          }
        ]
      },
      "attribute-profile": {
        "tunnel-private-group-id": {
          "value": "STATIC",
          "request-type": "AUTHENTICATION"
        },
        "nas-identifier": {
          "value": "<string>",
          "request-type": "BOTH"
        },
        "nas-ip-address": {
          "request-type": "ACCOUNTING",
          "service-type": "BOTH"
        },
        "framed-ip-address": {
          "request-type": "AUTHENTICATION",
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
      "type": "RADSEC",
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
              "operator": "EQUALS",
              "match-string": "<string>"
            },
            {
              "operator-match-string-match-type": "<string>",
              "match-type": "FQDN",
              "operator": "EQUALS",
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
              "operator": "CONTAINS",
              "match-string": "<string>"
            },
            {
              "operator-match-string-match-type": "<string>",
              "match-type": "FQDN",
              "operator": "STARTS_WITH",
              "match-string": "<string>"
            }
          ],
          "trim-fqdn": "<boolean>"
        }
      ]
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

