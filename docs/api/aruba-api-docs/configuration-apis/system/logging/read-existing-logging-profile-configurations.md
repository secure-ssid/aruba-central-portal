# Read existing logging profile configurations

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/logging`

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
      "module": [
        {
          "type-process-subcategory": "<string>",
          "severity": "INFO",
          "trace": "<string>",
          "entities": {
            "client": "<string>",
            "column": "<string>",
            "table": "<string>",
            "entities-severity": "ERROR",
            "vlan-id": "<integer>",
            "port": "<integer>",
            "ip": "<string>",
            "mac": "<string>",
            "instance": "<string>",
            "vrf": "<string>",
            "ubt-zone": "<string>"
          }
        },
        {
          "type-process-subcategory": "<string>",
          "severity": "MAJOR",
          "trace": "<string>",
          "entities": {
            "client": "<string>",
            "column": "<string>",
            "table": "<string>",
            "entities-severity": "INFO",
            "vlan-id": "<integer>",
            "port": "<integer>",
            "ip": "<string>",
            "mac": "<string>",
            "instance": "<string>",
            "vrf": "<string>",
            "ubt-zone": "<string>"
          }
        }
      ],
      "remote-syslog": [
        {
          "logging-syslog-enable": "<boolean>",
          "host": "<string>",
          "filter-name": "<string>",
          "transport": "UDP",
          "port-number": "<integer>",
          "severity": "INFO",
          "vrf": "<string>",
          "include-auditable-events": "false",
          "tls-auth-mode": "CERTIFICATE",
          "disable": "false",
          "unsecure-tls-renegotiation": "false",
          "rate-limit": {
            "burst": "<long>",
            "interval": "30"
          },
          "mgmt": "false",
          "control-description": "<string>",
          "host-filter": "<string>",
          "smm": "false",
          "format": "BSD_STANDARD",
          "source-interface": "<integer>",
          "tls": "false",
          "type": "AP_DEBUG",
          "local-facility": "LOCAL0"
        },
        {
          "logging-syslog-enable": "<boolean>",
          "host": "<string>",
          "filter-name": "<string>",
          "transport": "UDP",
          "port-number": "<integer>",
          "severity": "INFO",
          "vrf": "<string>",
          "include-auditable-events": "false",
          "tls-auth-mode": "CERTIFICATE",
          "disable": "false",
          "unsecure-tls-renegotiation": "false",
          "rate-limit": {
            "burst": "<long>",
            "interval": "30"
          },
          "mgmt": "false",
          "control-description": "<string>",
          "host-filter": "<string>",
          "smm": "false",
          "format": "BSD_STANDARD",
          "source-interface": "<integer>",
          "tls": "false",
          "type": "NONE",
          "local-facility": "LOCAL0"
        }
      ],
      "filter": [
        {
          "entry": [
            {
              "sequence-number": "<long>",
              "match-event-id": [
                "<long>",
                "<long>"
              ],
              "event-id-range": "<string>",
              "match-severity": {
                "match-severity-key": "NONE",
                "match-severity-value": "CRITICAL"
              },
              "enable": "<boolean>",
              "match-regex": "<string>",
              "action": "PERMIT",
              "default-action": "PERMIT"
            },
            {
              "sequence-number": "<long>",
              "match-event-id": [
                "<long>",
                "<long>"
              ],
              "event-id-range": "<string>",
              "match-severity": {
                "match-severity-key": "LESSER_THAN",
                "match-severity-value": "EMERGENCY"
              },
              "enable": "<boolean>",
              "match-regex": "<string>",
              "action": "PERMIT",
              "default-action": "DENY"
            }
          ],
          "lf-name": "<string>",
          "enable": "false",
          "per-ip": {
            "enable": "<boolean>",
            "event-list": "<long>",
            "system-module": [
              "HPESP_IP",
              "DEV_ONBOARD"
            ],
            "severity": "MAJOR",
            "default-action": "<boolean>",
            "event-action": "DENY"
          }
        },
        {
          "entry": [
            {
              "sequence-number": "<long>",
              "match-event-id": [
                "<long>",
                "<long>"
              ],
              "event-id-range": "<string>",
              "match-severity": {
                "match-severity-key": "LESSER_THAN",
                "match-severity-value": "INFO"
              },
              "enable": "<boolean>",
              "match-regex": "<string>",
              "action": "PERMIT",
              "default-action": "PERMIT"
            },
            {
              "sequence-number": "<long>",
              "match-event-id": [
                "<long>",
                "<long>"
              ],
              "event-id-range": "<string>",
              "match-severity": {
                "match-severity-key": "EQUAL_TO",
                "match-severity-value": "CRITICAL"
              },
              "enable": "<boolean>",
              "match-regex": "<string>",
              "action": "PERMIT",
              "default-action": "PERMIT"
            }
          ],
          "lf-name": "<string>",
          "enable": "false",
          "per-ip": {
            "enable": "<boolean>",
            "event-list": "<long>",
            "system-module": [
              "AMP_SERVER",
              "DT"
            ],
            "severity": "EMERGENCY",
            "default-action": "<boolean>",
            "event-action": "PERMIT"
          }
        }
      ],
      "name": "<string>",
      "description": "<string>",
      "system-module": "COS",
      "priority-description": "<string>",
      "running-config-change": "<boolean>",
      "transmission-interval": "<long>",
      "origin-id": "NONE",
      "command": "<boolean>",
      "prefix": "<string>"
    },
    {
      "module": [
        {
          "type-process-subcategory": "<string>",
          "severity": "DEBUG",
          "trace": "<string>",
          "entities": {
            "client": "<string>",
            "column": "<string>",
            "table": "<string>",
            "entities-severity": "INFO",
            "vlan-id": "<integer>",
            "port": "<string>",
            "ip": "<string>",
            "mac": "<string>",
            "instance": "<string>",
            "vrf": "<string>",
            "ubt-zone": "<string>"
          }
        },
        {
          "type-process-subcategory": "<string>",
          "severity": "EMERGENCY",
          "trace": "<string>",
          "entities": {
            "client": "<string>",
            "column": "<string>",
            "table": "<string>",
            "entities-severity": "INFO",
            "vlan-id": "<integer>",
            "port": "<string>",
            "ip": "<string>",
            "mac": "<string>",
            "instance": "<string>",
            "vrf": "<string>",
            "ubt-zone": "<string>"
          }
        }
      ],
      "remote-syslog": [
        {
          "logging-syslog-enable": "<boolean>",
          "host": "<string>",
          "filter-name": "<string>",
          "transport": "UDP",
          "port-number": "<integer>",
          "severity": "INFO",
          "vrf": "<string>",
          "include-auditable-events": "false",
          "tls-auth-mode": "CERTIFICATE",
          "disable": "false",
          "unsecure-tls-renegotiation": "false",
          "rate-limit": {
            "burst": "<long>",
            "interval": "30"
          },
          "mgmt": "false",
          "control-description": "<string>",
          "host-filter": "<string>",
          "smm": "false",
          "format": "CEF",
          "source-interface": "<integer>",
          "tls": "false",
          "type": "AP_DEBUG",
          "local-facility": "LOCAL0"
        },
        {
          "logging-syslog-enable": "<boolean>",
          "host": "<string>",
          "filter-name": "<string>",
          "transport": "UDP",
          "port-number": "<integer>",
          "severity": "INFO",
          "vrf": "<string>",
          "include-auditable-events": "false",
          "tls-auth-mode": "CERTIFICATE",
          "disable": "false",
          "unsecure-tls-renegotiation": "false",
          "rate-limit": {
            "burst": "<long>",
            "interval": "30"
          },
          "mgmt": "false",
          "control-description": "<string>",
          "host-filter": "<string>",
          "smm": "false",
          "format": "CEF",
          "source-interface": "<integer>",
          "tls": "false",
          "type": "SYSTEM",
          "local-facility": "LOCAL0"
        }
      ],
      "filter": [
        {
          "entry": [
            {
              "sequence-number": "<long>",
              "match-event-id": [
                "<long>",
                "<long>"
              ],
              "event-id-range": "<string>",
              "match-severity": {
                "match-severity-key": "HIGHER_OR_EQUAL_TO",
                "match-severity-value": "CRITICAL"
              },
              "enable": "<boolean>",
              "match-regex": "<string>",
              "action": "PERMIT",
              "default-action": "PERMIT"
            },
            {
              "sequence-number": "<long>",
              "match-event-id": [
                "<long>",
                "<long>"
              ],
              "event-id-range": "<string>",
              "match-severity": {
                "match-severity-key": "HIGHER_OR_EQUAL_TO",
                "match-severity-value": "DEBUG"
              },
              "enable": "<boolean>",
              "match-regex": "<string>",
              "action": "PERMIT",
              "default-action": "PERMIT"
            }
          ],
          "lf-name": "<string>",
          "enable": "false",
          "per-ip": {
            "enable": "<boolean>",
            "event-list": "<long>",
            "system-module": [
              "PIM",
              "PSDETECT"
            ],
            "severity": "WARNING",
            "default-action": "<boolean>",
            "event-action": "DENY"
          }
        },
        {
          "entry": [
            {
              "sequence-number": "<long>",
              "match-event-id": [
                "<long>",
                "<long>"
              ],
              "event-id-range": "<string>",
              "match-severity": {
                "match-severity-key": "HIGHER_OR_EQUAL_TO",
                "match-severity-value": "DEBUG"
              },
              "enable": "<boolean>",
              "match-regex": "<string>",
              "action": "PERMIT",
              "default-action": "PERMIT"
            },
            {
              "sequence-number": "<long>",
              "match-event-id": [
                "<long>",
                "<long>"
              ],
              "event-id-range": "<string>",
              "match-severity": {
                "match-severity-key": "HIGHER_THAN",
                "match-severity-value": "ALERT"
              },
              "enable": "<boolean>",
              "match-regex": "<string>",
              "action": "PERMIT",
              "default-action": "DENY"
            }
          ],
          "lf-name": "<string>",
          "enable": "false",
          "per-ip": {
            "enable": "<boolean>",
            "event-list": "<long>",
            "system-module": [
              "DHCPV6C",
              "SSH"
            ],
            "severity": "ALERT",
            "default-action": "<boolean>",
            "event-action": "DENY"
          }
        }
      ],
      "name": "<string>",
      "description": "<string>",
      "system-module": "CRYPTO",
      "priority-description": "<string>",
      "running-config-change": "<boolean>",
      "transmission-interval": "<long>",
      "origin-id": "NONE",
      "command": "<boolean>",
      "prefix": "<string>"
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

