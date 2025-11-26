# Update existing auth server profile configuration

## Request

**Method:** `PATCH`

**URL:** `{{baseUrl}}/network-config/v1alpha1/auth-servers/:name`

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
  "called-station-id": {
    "type": "MAC_ADDRESS",
    "mac-address-delimiter": "NONE",
    "upper-case": "false",
    "include-ssid": "false",
    "include-ssid-delimiter": "<string>"
  },
  "name": "<string>",
  "description": "<string>",
  "type": "LOCAL",
  "radius-server-mode": "AUTH_ONLY",
  "auth-server-address": "<string>",
  "xmlapi-server-address": "<string>",
  "xmlapi-server-key": "<string>",
  "enable": "false",
  "enable-radsec": "false",
  "authentication-type": "MSCHAPv2",
  "auth-port": "<integer>",
  "acct-port": "1813",
  "tcp-port": "49",
  "max-retransmit-attempts": "<integer>",
  "timeout": "<integer>",
  "source-address": "<string>",
  "source-interface": "<integer>",
  "nas-ip-address": "<string>",
  "nas-identifier": "<string>",
  "cppm-user-name": "<string>",
  "service-type": "STANDARD",
  "use-ip-for-calling-station-id": "false",
  "use-md5": "false",
  "lower-case-mac-address": "false",
  "mac-address-delimiter": "DASH",
  "vrf": "<string>",
  "management-interface": "false",
  "clearpass": "false",
  "dynamic-authorization-enable": "false",
  "radsec-port": "2083",
  "radsec-client-cert": "<string>",
  "radsec-trusted-cacert-name": "<string>",
  "radsec-trusted-servercert-name": "<string>",
  "radsec-est-cert-profile": "<string>",
  "admin-dn": "<string>",
  "admin-password": "<string>",
  "base-dn": "<string>",
  "allow-cleartext": "false",
  "chase-referrals": "false",
  "filter": "<string>",
  "key-attribute": "<string>",
  "max-connection": "4",
  "session-authorization": "false",
  "domain": "<string>",
  "replay-protection": "false",
  "window-duration": "300",
  "window-type": "POSITIVE",
  "event-timestamp-required": "false",
  "rfc5176-enforcement-mode": "STRICT",
  "default-authenticated-role": "<string>",
  "preferred-conn-type": "CLEAR_TEXT",
  "auth-modifier": "<string>",
  "acct-modifier": "<string>",
  "deadtime": "5",
  "auth-throttle": "true",
  "dynamic-authorization-port": "<integer>",
  "radsec-keepalive": "TCP_KEEPALIVE",
  "rfc5997": "NONE",
  "msg-auth-required": "false",
  "tracking-enable": "false",
  "tracking-mode": "DEAD_ONLY",
  "tracking-method": "STATUS_SERVER",
  "tls-initial-connection-timeout": "<integer>",
  "port-access-keepalive": "STATUS_SERVER",
  "shared-secret-config": {
    "secret-type": "PLAIN_TEXT",
    "ciphertext-value": "<string>",
    "plaintext-value": "<string>"
  },
  "cppm-password-config": {
    "password-type": "PLAIN_TEXT",
    "ciphertext-value": "<string>",
    "plaintext-value": "<string>"
  },
  "ipsec-ah": {
    "spi": "<long>",
    "authentication-type": "SHA224",
    "authentication-key-type": "PLAIN_TEXT",
    "authentication-key-hexstring": "<string>",
    "authentication-key-cipher-text": "<string>",
    "authentication-key": "<string>"
  },
  "ipsec-esp": {
    "spi": "<long>",
    "authentication-type": "MD5",
    "authentication-key-type": "PLAIN_TEXT",
    "authentication-key-hexstring": "<string>",
    "authentication-key-cipher-text": "<string>",
    "authentication-key": "<string>"
  },
  "drp": {
    "ip": "<string>",
    "vlan": "<integer>",
    "gateway": "<string>"
  }
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

