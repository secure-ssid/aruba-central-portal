# Read Local Management Profiles.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/local-management`

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
      "accounting": {
        "accounting-group": [
          {
            "access-type": "SYSTEM",
            "record-type": "START_STOP",
            "acct-instances": [
              {
                "accounting-method": "SYSLOG",
                "seq-id": "<integer>",
                "mgmt-server-group": "<string>"
              }
            ]
          }
        ],
        "failthrough": "false",
        "acct-session": "UNIQUE",
        "acct-switch-id": "false",
        "periodic-update": "<long>",
        "supress-null-username": "false"
      },
      "authentication": {
        "authentication-group": [
          {
            "session": "CONSOLE",
            "access-group": [
              {
                "access-type": "LOGIN",
                "auth-instances": [
                  {
                    "auth-method": "RADIUS",
                    "seq-id": "<integer>",
                    "mgmt-server-group": "<string>"
                  }
                ],
                "secondary-auth": "NONE",
                "primary-mgmt-auth-server": "<string>",
                "backup-mgmt-auth-server": "<string>"
              }
            ]
          }
        ],
        "default-role": "ROOT",
        "enable": "false",
        "mschapv2": "false",
        "load-balance": "false",
        "failthrough": "false",
        "fail-to-local": "ALL_FAIL",
        "privilege-mode": "false",
        "disable-username": "false"
      },
      "authorization": {
        "authorization-group": [
          {
            "access-type": "DEFAULT",
            "authz-instances": [
              {
                "authorization-method": "NONE",
                "seq-id": "<integer>",
                "mgmt-server-group": "<string>"
              }
            ]
          }
        ],
        "radius": [
          {
            "access-type": "HTTPS_SERVER",
            "instance": [
              "<string>"
            ]
          }
        ],
        "failthrough": "false",
        "access-level": "ALL"
      },
      "webservers": {
        "enable": "true",
        "absolute-session-timeout": "0",
        "bypass-cp-landing-page": "false",
        "captive-portal-cert": "<string>",
        "cipher-suite": [
          "ECDHE_ECDSA_AES128_SHA"
        ],
        "exclude-http-security-headers": "false",
        "idp-cert": "<string>",
        "mgmt-auth": [
          "USERNAME_PASSWORD"
        ],
        "certificate-authorization": "RADIUS",
        "certificate-auth-username": "USER_PRINCIPAL_NAME",
        "session-timeout": "900",
        "ssl-protocol": [
          "TLSV1_2"
        ],
        "switch-cert": "<string>",
        "via-client-cert-port": "8085",
        "https-port-443": "false",
        "max-clients": "<integer>",
        "max-sessions-per-client": "6",
        "management-style": "IMPROVED",
        "listen-port": "BOTH",
        "ssl-port": "443",
        "management-url": "http://h17007.www1.hpe.com/device_help",
        "support-url": "https://www.hpe.com/us/en/networking.html",
        "idle-timeout": "<integer>",
        "enabled-vrfs": [
          "<string>"
        ],
        "access-mode": "READ_WRITE"
      },
      "ssh-server-global-configs": {
        "enable": "true",
        "password-authentication": "true",
        "pubkey-authentication": "true",
        "two-factor-authentication": "RADIUS",
        "certificate-as-authorized-key": "false",
        "enabled-vrfs": [
          "<string>"
        ],
        "ciphers": [
          {
            "priority": "<integer>",
            "algorithm": "AES256_CBC"
          }
        ],
        "host-key-algorithms": [
          {
            "priority": "<integer>",
            "algorithm": "ECDSA_SHA2_NISTP256"
          }
        ],
        "kex-algorithms": [
          {
            "priority": "<integer>",
            "algorithm": "DIFFIE_HELLMAN_GROUP18_SHA512"
          }
        ],
        "macs": [
          {
            "priority": "<integer>",
            "algorithm": "HMAC_SHA1_ETM_OPENSSH_COM"
          }
        ],
        "pubkey-algorithms": [
          {
            "priority": "<integer>",
            "algorithm": "SSH_RSA"
          }
        ],
        "allow-list": {
          "ipv4-allow-list": [
            "<string>"
          ],
          "ipv6-allow-list": [
            "<string>"
          ],
          "allow-list-enable": "false"
        },
        "server-port": "22",
        "timeout": "<integer>",
        "max-auth-attempts": "6",
        "rekey-time": "10",
        "rekey-volume": "1048576",
        "listen-interface": "BOTH",
        "file-transfer": "false"
      },
      "name": "<string>",
      "description": "<string>",
      "console": {
        "enable": "true",
        "baud-rate": "RATE_115200",
        "flow-control": "XON_XOFF",
        "idle-timeout": "<integer>",
        "usb-idle-timeout": "false",
        "local-terminal": "NONE",
        "terminal": "VT100",
        "max-sessions": "7",
        "usb-enable": "true",
        "serviceos-password-prompt": "false",
        "screen-refresh": "<integer>",
        "events": "CRITICAL"
      },
      "audit-period": "<integer>",
      "localauth": "false",
      "bluetooth": "true",
      "hash-mgmt-password": {
        "enable": "true",
        "min-password-length": "1"
      },
      "managed-mode-profile": {
        "server-name": "<string>",
        "automatic": "false",
        "config-filename": "<string>",
        "username": "<string>",
        "password": "<string>",
        "download-method": "FTPS",
        "retry-poll-period": "<long>",
        "debug-mode": "false",
        "sync-day": "thursday",
        "sync-hour": "<integer>",
        "sync-minute": "<long>",
        "sync-window": "3"
      },
      "login": {
        "user-lockout": [
          {
            "session": "CONSOLE",
            "denylist-period": "<long>",
            "threshold": "<long>",
            "lockout": "false"
          }
        ],
        "num-attempts": "<long>",
        "lockout-delay": "<long>"
      },
      "password-complexity": {
        "enable": "false",
        "minimum-length": "<long>",
        "password-aging": "false",
        "password-aging-period": "90",
        "password-alert-before-expiry": "9",
        "password-expired-user-login-attempts": "3",
        "password-expiry-user-login-attempts-period": "30",
        "logon-details": "<boolean>",
        "password-update-interval": "24",
        "history-check": "false",
        "history-count": "<long>",
        "repeat-char-check": "false",
        "repeat-password-check": "false",
        "repeat-username-check": "false",
        "all-repeat-check": "false",
        "min-char-difference": "<long>",
        "numeric-count": "<long>",
        "lowercase-count": "<long>",
        "uppercase-count": "<long>",
        "special-char-count": "<long>",
        "adjacent-char-type-count": "0",
        "certificate-lock-out": "0",
        "certificate-lock-out-time": "3",
        "password-lock-out": "0",
        "password-lock-out-time": "3"
      },
      "telnet-server": {
        "enable": "<boolean>",
        "telnet-server-listen-interface": "BOTH",
        "vrf": [
          "<string>"
        ]
      },
      "tftp-server": {
        "enable": "true",
        "tftp-listen-interface": "BOTH"
      },
      "tftp-client": {
        "enable": "true",
        "blk-size": "<integer>"
      },
      "password-sha256": "false",
      "disable-cipher-type": [
        "AES_CTR"
      ],
      "disable-mac": [
        "HMAC_SHA1_96"
      ],
      "disable-kex": "false",
      "disable-dsa": "false",
      "mgmt-auth-public-key": "true",
      "mgmt-auth-uname-pwd": "true",
      "login-session-timeout": "<long>",
      "login-session-timeout-seconds": "<long>",
      "tracking-range": "<integer>",
      "max-sessions-per-user": "<integer>",
      "banner-message": {
        "enforce-accept": "false",
        "message-delimiter": "<string>",
        "text": "<string>",
        "last-login": "true"
      },
      "banner-exec": {
        "message-delimiter": "<string>",
        "text": "<string>"
      },
      "nae": {
        "cli-authorization": "true"
      }
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

