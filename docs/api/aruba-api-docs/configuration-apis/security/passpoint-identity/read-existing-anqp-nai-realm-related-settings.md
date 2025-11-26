# Read existing ANQP NAI Realm related settings.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/passpoint-identity`

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
      "enable": "<boolean>",
      "enable-alias": "<string>",
      "identity-type": "SIM",
      "nai-realm-name": [
        {
          "value": "<string>"
        },
        {
          "value": "<string>"
        }
      ],
      "encoding": "UTF8",
      "eap-method": [
        {
          "index": "<integer>",
          "method": "PEAP_MSCHAPV2",
          "auth-param": [
            {
              "id-value": "<string>",
              "id": "NON_EAP_INNER_AUTH",
              "value": "CRED_HW_TOKEN"
            },
            {
              "id-value": "<string>",
              "id": "RESERVED",
              "value": "EAP_ONE_TIME_PASSWORD"
            }
          ]
        },
        {
          "index": "<integer>",
          "method": "EAP_AKA",
          "auth-param": [
            {
              "id-value": "<string>",
              "id": "CREDENTIAL",
              "value": "EAP_GENERIC_TOKEN_CARD"
            },
            {
              "id-value": "<string>",
              "id": "EXPANDED_EAP",
              "value": "NON_EAP_MSCHAPV2"
            }
          ]
        }
      ],
      "home-realm": "false",
      "anqp-3gpp": [
        {
          "anqp-3gpp-profile-name": "<string>",
          "mno": "VRZ",
          "plmn": [
            "<string>",
            "<string>"
          ]
        },
        {
          "anqp-3gpp-profile-name": "<string>",
          "mno": "TMO",
          "plmn": [
            "<string>",
            "<string>"
          ]
        }
      ],
      "anqp-roam-cons": [
        {
          "anqp-roam-cons-name": "<string>",
          "org-id": "<string>"
        },
        {
          "anqp-roam-cons-name": "<string>",
          "org-id": "<string>"
        }
      ]
    },
    {
      "name": "<string>",
      "description": "<string>",
      "enable": "<boolean>",
      "enable-alias": "<string>",
      "identity-type": "EDUROAM",
      "nai-realm-name": [
        {
          "value": "<string>"
        },
        {
          "value": "<string>"
        }
      ],
      "encoding": "UTF8",
      "eap-method": [
        {
          "index": "<integer>",
          "method": "PEAP_MSCHAPV2",
          "auth-param": [
            {
              "id-value": "<string>",
              "id": "CREDENTIAL",
              "value": "TUN_CRED_CERT"
            },
            {
              "id-value": "<string>",
              "id": "EAP_INNER_AUTH",
              "value": "EAP_IDENTITY"
            }
          ]
        },
        {
          "index": "<integer>",
          "method": "NONE_NAI_REALM_EAP_METHOD",
          "auth-param": [
            {
              "id-value": "<string>",
              "id": "CREDENTIAL",
              "value": "TUN_CRED_SOFT_TOKEN"
            },
            {
              "id-value": "<string>",
              "id": "TUNNELED_EAP_CREDENTIAL_TYPE",
              "value": "EAP_METHOD_AKA"
            }
          ]
        }
      ],
      "home-realm": "false",
      "anqp-3gpp": [
        {
          "anqp-3gpp-profile-name": "<string>",
          "mno": "VRZ",
          "plmn": [
            "<string>",
            "<string>"
          ]
        },
        {
          "anqp-3gpp-profile-name": "<string>",
          "mno": "VRZ",
          "plmn": [
            "<string>",
            "<string>"
          ]
        }
      ],
      "anqp-roam-cons": [
        {
          "anqp-roam-cons-name": "<string>",
          "org-id": "<string>"
        },
        {
          "anqp-roam-cons-name": "<string>",
          "org-id": "<string>"
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

