# Read a portal overrides profile

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/overrides/:overrideId`

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
  "override-id": "<string>",
  "name": "<string>",
  "messages": [
    {
      "language": "DE",
      "accept-button-title": "<string>",
      "access-denied-title": "<string>",
      "back-button-title": "<string>",
      "continue-button-title": "<string>",
      "email-address-placeholder": "<string>",
      "email-label": "<string>",
      "logged-in-message": "<string>",
      "logged-in-title": "<string>",
      "login-button-title": "<string>",
      "login-failed-message": "<string>",
      "login-message": "<string>",
      "login-title": "<string>",
      "network-login-button-title": "<string>",
      "network-login-message": "<string>",
      "network-login-title": "<string>",
      "password-placeholder": "<string>",
      "phone-help-message": "<string>",
      "phone-label": "<string>",
      "phone-number-placeholder": "<string>",
      "register-button-title": "<string>",
      "register-message": "<string>",
      "register-title": "<string>",
      "sponsor-approval-granted-message": "<string>",
      "sponsor-approval-granted-title": "<string>",
      "sponsor-approval-pending-message": "<string>",
      "sponsor-approval-pending-title": "<string>",
      "sponsor-approve-button-title": "<string>",
      "sponsor-approve-message": "<string>",
      "sponsor-approve-title": "<string>",
      "sponsor-approved-message": "<string>",
      "sponsor-approved-title": "<string>",
      "sponsor-label": "<string>",
      "sponsor-message": "<string>",
      "sponsor-placeholder": "<string>",
      "terms-accept-message": "<string>",
      "terms-message": "<string>",
      "terms-title": "<string>",
      "username-label": "<string>",
      "username-placeholder": "<string>",
      "verification-code-label": "<string>",
      "verification-code-placeholder": "<string>",
      "verification-email-check-message": "<string>",
      "verification-email-notice-message": "<string>",
      "verification-email-sent-message": "<string>",
      "verification-phone-notice-message": "<string>",
      "verified-account-message": "<string>",
      "verify-account-message": "<string>",
      "verify-button-title": "<string>",
      "verify-title": "<string>"
    },
    {
      "language": "DA",
      "accept-button-title": "<string>",
      "access-denied-title": "<string>",
      "back-button-title": "<string>",
      "continue-button-title": "<string>",
      "email-address-placeholder": "<string>",
      "email-label": "<string>",
      "logged-in-message": "<string>",
      "logged-in-title": "<string>",
      "login-button-title": "<string>",
      "login-failed-message": "<string>",
      "login-message": "<string>",
      "login-title": "<string>",
      "network-login-button-title": "<string>",
      "network-login-message": "<string>",
      "network-login-title": "<string>",
      "password-placeholder": "<string>",
      "phone-help-message": "<string>",
      "phone-label": "<string>",
      "phone-number-placeholder": "<string>",
      "register-button-title": "<string>",
      "register-message": "<string>",
      "register-title": "<string>",
      "sponsor-approval-granted-message": "<string>",
      "sponsor-approval-granted-title": "<string>",
      "sponsor-approval-pending-message": "<string>",
      "sponsor-approval-pending-title": "<string>",
      "sponsor-approve-button-title": "<string>",
      "sponsor-approve-message": "<string>",
      "sponsor-approve-title": "<string>",
      "sponsor-approved-message": "<string>",
      "sponsor-approved-title": "<string>",
      "sponsor-label": "<string>",
      "sponsor-message": "<string>",
      "sponsor-placeholder": "<string>",
      "terms-accept-message": "<string>",
      "terms-message": "<string>",
      "terms-title": "<string>",
      "username-label": "<string>",
      "username-placeholder": "<string>",
      "verification-code-label": "<string>",
      "verification-code-placeholder": "<string>",
      "verification-email-check-message": "<string>",
      "verification-email-notice-message": "<string>",
      "verification-email-sent-message": "<string>",
      "verification-phone-notice-message": "<string>",
      "verified-account-message": "<string>",
      "verify-account-message": "<string>",
      "verify-button-title": "<string>",
      "verify-title": "<string>"
    }
  ],
  "description": "<string>",
  "fallback-language": "ZH"
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

