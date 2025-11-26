# Read authorization policy configuration.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/authz-policies/:policyId`

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
  "conditions": {
    "description": "<string>",
    "combinator-operator": "COMB_OP_AND",
    "condition": [
      {
        "position": "<integer>",
        "condition-id": "<string>",
        "combinator-operator": "COMB_OP_AND",
        "condition-group": [
          {
            "position": "<integer>",
            "attr": "<string>",
            "operator": "OP_IS_MAC_ADDRESS",
            "condition-group-id": "<string>",
            "values": [
              "<string>",
              "<string>"
            ],
            "value": "<string>"
          },
          {
            "position": "<integer>",
            "attr": "<string>",
            "operator": "OP_NOT_CONTAINS_ALL",
            "condition-group-id": "<string>",
            "values": [
              "<string>",
              "<string>"
            ],
            "value": "<string>"
          }
        ]
      },
      {
        "position": "<integer>",
        "condition-id": "<string>",
        "combinator-operator": "COMB_OP_OR",
        "condition-group": [
          {
            "position": "<integer>",
            "attr": "<string>",
            "operator": "OP_CONTAINS_ALL",
            "condition-group-id": "<string>",
            "values": [
              "<string>",
              "<string>"
            ],
            "value": "<string>"
          },
          {
            "position": "<integer>",
            "attr": "<string>",
            "operator": "OP_CONTAINS_ANY",
            "condition-group-id": "<string>",
            "values": [
              "<string>",
              "<string>"
            ],
            "value": "<string>"
          }
        ]
      }
    ]
  },
  "rule": [
    {
      "position": "<integer>",
      "conditions": {
        "description": "<string>",
        "combinator-operator": "COMB_OP_AND",
        "condition": [
          {
            "position": "<integer>",
            "condition-id": "<string>",
            "combinator-operator": "COMB_OP_AND",
            "condition-group": [
              {
                "position": "<integer>",
                "attr": "<string>",
                "operator": "OP_ENDS_WITH_IGNORE_CASE",
                "condition-group-id": "<string>",
                "values": [
                  "<string>",
                  "<string>"
                ],
                "value": "<string>"
              },
              {
                "position": "<integer>",
                "attr": "<string>",
                "operator": "OP_NOT_EQUALS_IC",
                "condition-group-id": "<string>",
                "values": [
                  "<string>",
                  "<string>"
                ],
                "value": "<string>"
              }
            ]
          },
          {
            "position": "<integer>",
            "condition-id": "<string>",
            "combinator-operator": "COMB_OP_OR",
            "condition-group": [
              {
                "position": "<integer>",
                "attr": "<string>",
                "operator": "OP_NOT_CONTAINS_ELEM",
                "condition-group-id": "<string>",
                "values": [
                  "<string>",
                  "<string>"
                ],
                "value": "<string>"
              },
              {
                "position": "<integer>",
                "attr": "<string>",
                "operator": "OP_NOT_CONTAINS_ALL",
                "condition-group-id": "<string>",
                "values": [
                  "<string>",
                  "<string>"
                ],
                "value": "<string>"
              }
            ]
          }
        ]
      },
      "description": "<string>",
      "rule-id": "<string>",
      "rule-name": "<string>",
      "enable": "true",
      "enf-profile": [
        {
          "radius-profile": {
            "defined-attr": [
              {
                "attr-name": "ATTR_ARUBA_ROLE",
                "value": "<string>"
              },
              {
                "attr-name": "ATTR_SSID",
                "value": "<string>"
              }
            ],
            "custom-attr": [
              {
                "custom-attr-name": "<string>",
                "value": "<string>"
              },
              {
                "custom-attr-name": "<string>",
                "value": "<string>"
              }
            ]
          }
        },
        {
          "radius-profile": {
            "defined-attr": [
              {
                "attr-name": "ATTR_VLAN_ID",
                "value": "<string>"
              },
              {
                "attr-name": "ATTR_VLAN_ID",
                "value": "<string>"
              }
            ],
            "custom-attr": [
              {
                "custom-attr-name": "<string>",
                "value": "<string>"
              },
              {
                "custom-attr-name": "<string>",
                "value": "<string>"
              }
            ]
          }
        }
      ]
    },
    {
      "position": "<integer>",
      "conditions": {
        "description": "<string>",
        "combinator-operator": "COMB_OP_AND",
        "condition": [
          {
            "position": "<integer>",
            "condition-id": "<string>",
            "combinator-operator": "COMB_OP_AND",
            "condition-group": [
              {
                "position": "<integer>",
                "attr": "<string>",
                "operator": "MATCHES_REGEX",
                "condition-group-id": "<string>",
                "values": [
                  "<string>",
                  "<string>"
                ],
                "value": "<string>"
              },
              {
                "position": "<integer>",
                "attr": "<string>",
                "operator": "OP_CONTAINS_ALL",
                "condition-group-id": "<string>",
                "values": [
                  "<string>",
                  "<string>"
                ],
                "value": "<string>"
              }
            ]
          },
          {
            "position": "<integer>",
            "condition-id": "<string>",
            "combinator-operator": "COMB_OP_AND",
            "condition-group": [
              {
                "position": "<integer>",
                "attr": "<string>",
                "operator": "OP_IS_MAC_ADDRESS",
                "condition-group-id": "<string>",
                "values": [
                  "<string>",
                  "<string>"
                ],
                "value": "<string>"
              },
              {
                "position": "<integer>",
                "attr": "<string>",
                "operator": "MATCHES_REGEX",
                "condition-group-id": "<string>",
                "values": [
                  "<string>",
                  "<string>"
                ],
                "value": "<string>"
              }
            ]
          }
        ]
      },
      "description": "<string>",
      "rule-id": "<string>",
      "rule-name": "<string>",
      "enable": "true",
      "enf-profile": [
        {
          "radius-profile": {
            "defined-attr": [
              {
                "attr-name": "ATTR_VLAN_NAME",
                "value": "<string>"
              },
              {
                "attr-name": "ATTR_SSID",
                "value": "<string>"
              }
            ],
            "custom-attr": [
              {
                "custom-attr-name": "<string>",
                "value": "<string>"
              },
              {
                "custom-attr-name": "<string>",
                "value": "<string>"
              }
            ]
          }
        },
        {
          "radius-profile": {
            "defined-attr": [
              {
                "attr-name": "ATTR_SSID",
                "value": "<string>"
              },
              {
                "attr-name": "ATTR_POLICY_ACTION",
                "value": "<string>"
              }
            ],
            "custom-attr": [
              {
                "custom-attr-name": "<string>",
                "value": "<string>"
              },
              {
                "custom-attr-name": "<string>",
                "value": "<string>"
              }
            ]
          }
        }
      ]
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

