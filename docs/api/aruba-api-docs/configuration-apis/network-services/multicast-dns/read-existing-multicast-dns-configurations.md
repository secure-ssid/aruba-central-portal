# Read existing Multicast DNS configurations

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/multicast-dns`

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
      "enable": "false",
      "service-discovery-rule-set": [
        {
          "profile-name": "<string>",
          "filter-rule": [
            {
              "sequence-number": "<long>",
              "action": "DENY",
              "match-service-group": "<string>",
              "service-name": "<string>",
              "instance-name": "<string>"
            },
            {
              "sequence-number": "<long>",
              "action": "DENY",
              "match-service-group": "<string>",
              "service-name": "<string>",
              "instance-name": "<string>"
            }
          ],
          "sd-gateway-vlans": [
            "<string>",
            "<string>"
          ]
        },
        {
          "profile-name": "<string>",
          "filter-rule": [
            {
              "sequence-number": "<long>",
              "action": "DENY",
              "match-service-group": "<string>",
              "service-name": "<string>",
              "instance-name": "<string>"
            },
            {
              "sequence-number": "<long>",
              "action": "DENY",
              "match-service-group": "<string>",
              "service-name": "<string>",
              "instance-name": "<string>"
            }
          ],
          "sd-gateway-vlans": [
            "<string>",
            "<string>"
          ]
        }
      ],
      "service-discovery-service": [
        {
          "sd-name": "<string>",
          "description": "<string>",
          "identifiers-container": {
            "custom-identifiers": [
              "<string>",
              "<string>"
            ],
            "identifiers": [
              "CUPS_SUB_FAX_IPP",
              "PRESENCE"
            ]
          }
        },
        {
          "sd-name": "<string>",
          "description": "<string>",
          "identifiers-container": {
            "custom-identifiers": [
              "<string>",
              "<string>"
            ],
            "identifiers": [
              "SSH",
              "AFPOVERTCP"
            ]
          }
        }
      ],
      "filter-in-action": "DENY",
      "filter-out-action": "PERMIT",
      "gateway-vlans": [
        "<string>",
        "<string>"
      ]
    },
    {
      "name": "<string>",
      "description": "<string>",
      "enable": "false",
      "service-discovery-rule-set": [
        {
          "profile-name": "<string>",
          "filter-rule": [
            {
              "sequence-number": "<long>",
              "action": "PERMIT",
              "match-service-group": "<string>",
              "service-name": "<string>",
              "instance-name": "<string>"
            },
            {
              "sequence-number": "<long>",
              "action": "PERMIT",
              "match-service-group": "<string>",
              "service-name": "<string>",
              "instance-name": "<string>"
            }
          ],
          "sd-gateway-vlans": [
            "<string>",
            "<string>"
          ]
        },
        {
          "profile-name": "<string>",
          "filter-rule": [
            {
              "sequence-number": "<long>",
              "action": "PERMIT",
              "match-service-group": "<string>",
              "service-name": "<string>",
              "instance-name": "<string>"
            },
            {
              "sequence-number": "<long>",
              "action": "PERMIT",
              "match-service-group": "<string>",
              "service-name": "<string>",
              "instance-name": "<string>"
            }
          ],
          "sd-gateway-vlans": [
            "<string>",
            "<string>"
          ]
        }
      ],
      "service-discovery-service": [
        {
          "sd-name": "<string>",
          "description": "<string>",
          "identifiers-container": {
            "custom-identifiers": [
              "<string>",
              "<string>"
            ],
            "identifiers": [
              "AIRPLAY",
              "PRINTER_SUB_HTTP"
            ]
          }
        },
        {
          "sd-name": "<string>",
          "description": "<string>",
          "identifiers-container": {
            "custom-identifiers": [
              "<string>",
              "<string>"
            ],
            "identifiers": [
              "APPLE_MOBDEV",
              "PRINTER"
            ]
          }
        }
      ],
      "filter-in-action": "DENY",
      "filter-out-action": "PERMIT",
      "gateway-vlans": [
        "<string>",
        "<string>"
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

