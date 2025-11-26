# Update  authentication profile configuration.

## Request

**Method:** `PATCH`

**URL:** `{{baseUrl}}/network-config/v1alpha1/auth-profiles/:authProfileId`

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
  "auth-type": "EAP",
  "wired-profile": {
    "ap-port-profiles": [
      "<string>",
      "<string>"
    ]
  },
  "eap": {
    "ocsp-url": "<string>",
    "ocsp-fail-behavior": "REJECT_ALL",
    "server-cert": "<string>",
    "server-key": "<string>",
    "server-key-passphrase": "<string>",
    "uem-providers": {
      "uem": [
        {
          "name": "<string>",
          "uem-type": "MSINTUNE_UEM",
          "scep-url": "<string>",
          "scep-dynamic-challenge-url": "<string>",
          "bearer-token": "<string>",
          "uem-id": "<string>",
          "enable": "true",
          "intune-extension": "<string>"
        },
        {
          "name": "<string>",
          "uem-type": "GOOGLE_UEM",
          "scep-url": "<string>",
          "scep-dynamic-challenge-url": "<string>",
          "bearer-token": "<string>",
          "uem-id": "<string>",
          "enable": "true",
          "intune-extension": "<string>"
        }
      ]
    }
  },
  "mpsk": {
    "password-policy": "ALPHANUMERIC"
  },
  "mab": {
    "allow-all": "false"
  },
  "captive-portal": {
    "anonymous-password": "<string>",
    "sponsor-domains": [
      "<string>",
      "<string>"
    ],
    "sponsor-emails": [
      "<string>",
      "<string>"
    ],
    "allow-internet-on-service-unavailable": "<boolean>",
    "cna-policy": "AUTOMATIC",
    "final-redirection-url": "<string>",
    "network-login-host-override": "<string>",
    "pre-auth-access-rules": [
      {
        "position": "<integer>",
        "destination": {
          "domain-name": "<string>",
          "port": "<integer>"
        }
      },
      {
        "position": "<integer>",
        "destination": {
          "domain-name": "<string>",
          "port": "<integer>"
        }
      }
    ]
  },
  "airpass-profile": {
    "venue-category": "STADIUM",
    "domain-name": "<string>",
    "operator-name": "<string>",
    "approval-email": "<string>",
    "provider": [
      "<string>",
      "<string>"
    ],
    "site": [
      {
        "site-id": "<string>"
      },
      {
        "site-id": "<string>"
      }
    ]
  },
  "default-policy": {
    "allow-mac-caching": "false",
    "session-timeout": "28800",
    "session-data-quota": "<integer>",
    "periodic-quota-subject": "ACCOUNT",
    "periodic-time-quota": "<integer>",
    "periodic-data-quota": "<integer>",
    "simultaneous-use": "<integer>"
  },
  "auth-profile-id": "<string>",
  "description": "<string>",
  "identity-stores": [
    "<string>",
    "<string>"
  ],
  "networks": [
    "<string>",
    "<string>"
  ],
  "wired": "false",
  "organization-name": "<string>",
  "portal-profile": "<string>",
  "dpp": "false"
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

