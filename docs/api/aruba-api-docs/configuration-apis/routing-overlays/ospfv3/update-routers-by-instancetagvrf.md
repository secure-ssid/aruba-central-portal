# Update routers by {instanceTagVrf}

## Request

**Method:** `PATCH`

**URL:** `{{baseUrl}}/network-config/v1alpha1/ospfv3/:instanceTagVrf`

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
  "description": "<string>",
  "instance-tag-vrf": "<string>",
  "router-id": "<string>",
  "profile-mode": "ADVANCE",
  "areas": [
    {
      "ether-interfaces": [
        {
          "interface-name": "<string>",
          "lag-name": "<string>",
          "sub-interface-name": "<string>",
          "svi-id": "<integer>",
          "loopback-id": "<integer>",
          "tunnel-id": "<integer>",
          "hello-interval": "10",
          "dead-interval": "40",
          "retransmit-interval": "5",
          "transit-delay": "1",
          "cost": "<long>",
          "priority": "1",
          "passive": "false",
          "disable": "false",
          "network": "POINT_TO_POINT",
          "bfd": "false",
          "authentication": "false",
          "spi-id": "<long>",
          "authentication-type": "SHA",
          "key-type": "HEX_STRING",
          "auth-key": "<string>",
          "auth-cipher-key": "<string>",
          "auth-key-null": "<boolean>",
          "security-disable": "false",
          "encryption": "false",
          "encryption-type": "AES",
          "encryption-key-type": "PLAIN_TEXT",
          "encryption-key": "<string>",
          "encr-cipher-key": "<string>"
        }
      ],
      "lag-interfaces": [
        {
          "interface-name": "<string>",
          "lag-name": "<string>",
          "sub-interface-name": "<string>",
          "svi-id": "<integer>",
          "loopback-id": "<integer>",
          "tunnel-id": "<integer>",
          "hello-interval": "10",
          "dead-interval": "40",
          "retransmit-interval": "5",
          "transit-delay": "1",
          "cost": "<long>",
          "priority": "1",
          "passive": "false",
          "disable": "false",
          "network": "BROADCAST",
          "bfd": "false",
          "authentication": "false",
          "spi-id": "<long>",
          "authentication-type": "SHA",
          "key-type": "PLAIN_TEXT",
          "auth-key": "<string>",
          "auth-cipher-key": "<string>",
          "auth-key-null": "<boolean>",
          "security-disable": "false",
          "encryption": "false",
          "encryption-type": "AES",
          "encryption-key-type": "HEX_STRING",
          "encryption-key": "<string>",
          "encr-cipher-key": "<string>"
        }
      ],
      "sub-interfaces": [
        {
          "interface-name": "<string>",
          "lag-name": "<string>",
          "sub-interface-name": "<string>",
          "svi-id": "<integer>",
          "loopback-id": "<integer>",
          "tunnel-id": "<integer>",
          "hello-interval": "10",
          "dead-interval": "40",
          "retransmit-interval": "5",
          "transit-delay": "1",
          "cost": "<long>",
          "priority": "1",
          "passive": "false",
          "disable": "false",
          "network": "BROADCAST",
          "bfd": "false",
          "authentication": "false",
          "spi-id": "<long>",
          "authentication-type": "MD5",
          "key-type": "HEX_STRING",
          "auth-key": "<string>",
          "auth-cipher-key": "<string>",
          "auth-key-null": "<boolean>",
          "security-disable": "false",
          "encryption": "false",
          "encryption-type": "AES",
          "encryption-key-type": "HEX_STRING",
          "encryption-key": "<string>",
          "encr-cipher-key": "<string>"
        }
      ],
      "svi-interfaces": [
        {
          "interface-name": "<string>",
          "lag-name": "<string>",
          "sub-interface-name": "<string>",
          "svi-id": "<integer>",
          "loopback-id": "<integer>",
          "tunnel-id": "<integer>",
          "hello-interval": "10",
          "dead-interval": "40",
          "retransmit-interval": "5",
          "transit-delay": "1",
          "cost": "<long>",
          "priority": "1",
          "passive": "false",
          "disable": "false",
          "network": "POINT_TO_POINT",
          "bfd": "false",
          "authentication": "false",
          "spi-id": "<long>",
          "authentication-type": "MD5",
          "key-type": "HEX_STRING",
          "auth-key": "<string>",
          "auth-cipher-key": "<string>",
          "auth-key-null": "<boolean>",
          "security-disable": "false",
          "encryption": "false",
          "encryption-type": "AES",
          "encryption-key-type": "HEX_STRING",
          "encryption-key": "<string>",
          "encr-cipher-key": "<string>"
        }
      ],
      "loopback-interfaces": [
        {
          "interface-name": "<string>",
          "lag-name": "<string>",
          "sub-interface-name": "<string>",
          "svi-id": "<integer>",
          "loopback-id": "<integer>",
          "tunnel-id": "<integer>",
          "hello-interval": "10",
          "dead-interval": "40",
          "retransmit-interval": "5",
          "transit-delay": "1",
          "cost": "<long>",
          "priority": "1",
          "passive": "false",
          "disable": "false",
          "network": "POINT_TO_POINT",
          "bfd": "false",
          "authentication": "false",
          "spi-id": "<long>",
          "authentication-type": "MD5",
          "key-type": "HEX_STRING",
          "auth-key": "<string>",
          "auth-cipher-key": "<string>",
          "auth-key-null": "<boolean>",
          "security-disable": "false",
          "encryption": "false",
          "encryption-type": "AES",
          "encryption-key-type": "PLAIN_TEXT",
          "encryption-key": "<string>",
          "encr-cipher-key": "<string>"
        }
      ],
      "tunnel-interfaces": [
        {
          "interface-name": "<string>",
          "lag-name": "<string>",
          "sub-interface-name": "<string>",
          "svi-id": "<integer>",
          "loopback-id": "<integer>",
          "tunnel-id": "<integer>",
          "hello-interval": "10",
          "dead-interval": "40",
          "retransmit-interval": "5",
          "transit-delay": "1",
          "cost": "<long>",
          "priority": "1",
          "passive": "false",
          "disable": "false",
          "network": "BROADCAST",
          "bfd": "false",
          "authentication": "false",
          "spi-id": "<long>",
          "authentication-type": "MD5",
          "key-type": "CIPHER_TEXT",
          "auth-key": "<string>",
          "auth-cipher-key": "<string>",
          "auth-key-null": "<boolean>",
          "security-disable": "false",
          "encryption": "false",
          "encryption-type": "NULL",
          "encryption-key-type": "PLAIN_TEXT",
          "encryption-key": "<string>",
          "encr-cipher-key": "<string>"
        }
      ]
    }
  ],
  "default-metric": "<long>",
  "distance": [
    {
      "route-type": "ROUTE_ALL",
      "all": "110",
      "inter-area": "110",
      "intra-area": "110",
      "external": "110"
    }
  ],
  "max-metric": {
    "router-lsa": "false",
    "include-stub": "false",
    "on-startup": "600"
  },
  "passive-interface-default": "false",
  "redistribute-routes": [
    {
      "redistribute-id": "<integer>",
      "redistribute-type": "CONNECTED",
      "id": "<integer>",
      "route-map": "<string>"
    }
  ],
  "maximum-paths": "4",
  "protocol-disable": "<boolean>",
  "graceful-restart-cfg": {
    "restart-interval": "120",
    "ignore-lost-interface": "false",
    "helper-strict-lsa-check": "true",
    "helper": "true"
  },
  "trap-enable": "<boolean>",
  "reference-bandwidth": "100000",
  "default-info-originate": {
    "originate": "<boolean>",
    "metric": "<long>",
    "always": "<boolean>",
    "always-metric": "<long>"
  },
  "timers": [
    {
      "timer-id": "<integer>",
      "spf-throttle": {
        "start-time": "<long>",
        "hold-time": "<long>",
        "max-wait-time": "<long>"
      },
      "lsa-throttle": {
        "start-time": "5000",
        "hold-time": "0",
        "max-wait-time": "0"
      },
      "lsa-arrival": "1000"
    }
  ],
  "active-backbone-stub": "false",
  "summary-aggregate-route": [
    {
      "prefix": "<string>",
      "no-advertise": "false",
      "tag": "<long>"
    }
  ],
  "route-filter": [
    {
      "prefix-name": "<string>",
      "direction": "IN"
    }
  ],
  "snmpv3": {
    "context-name": "<string>",
    "community": "<string>"
  },
  "restrict-routes": [
    "<string>"
  ],
  "bfd-enable": "false",
  "metric-type": "TYPE2",
  "reference-cost": "<long>",
  "distribute-filter": [
    {
      "prefix": "<string>"
    }
  ],
  "ipsec-rollover": "60",
  "nonstop": "false",
  "logging": {
    "neighbour-adjacency": "true",
    "detail": "false"
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

