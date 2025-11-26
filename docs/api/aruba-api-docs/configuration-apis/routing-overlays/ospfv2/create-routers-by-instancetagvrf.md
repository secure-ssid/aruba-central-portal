# Create routers by {instanceTagVrf}

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-config/v1alpha1/ospfv2/:instanceTagVrf`

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
  "profile-mode": "BASIC",
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
          "ospf-ip-address": "<string>",
          "ignore-mtu": "false",
          "authentication": "MESSAGE_DIGEST",
          "keychain-key": "<string>",
          "password-type": "PLAIN_TEXT",
          "password": "<string>",
          "ciphertext-password": "<string>",
          "authentication-key-id": "<integer>",
          "sha-password-type": "PLAIN_TEXT",
          "sha-password": "<string>",
          "sha-cipher-password": "<string>",
          "md-key-id": "<integer>",
          "md-password-type": "PLAIN_TEXT",
          "md-password": "<string>",
          "md-cipherpassword": "<string>",
          "hello-interval": "10",
          "dead-interval": "40",
          "retransmit-interval": "5",
          "transit-delay": "1",
          "cost": "<long>",
          "priority": "1",
          "passive": "false",
          "shutdown": "false",
          "network": "BROADCAST",
          "bfd": "false",
          "summary-address": [
            {
              "prefix": "<string>",
              "route-type": "STATIC",
              "no-advertise": "false",
              "tag": "<long>",
              "cost": "<long>"
            }
          ],
          "auto-summary-address": [
            {
              "prefix": "<string>",
              "auto-aggregate": [
                {
                  "route-type": "STATIC",
                  "aggregate-list-name": "<string>"
                }
              ]
            }
          ]
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
          "ospf-ip-address": "<string>",
          "ignore-mtu": "false",
          "authentication": "HMAC_SHA_256",
          "keychain-key": "<string>",
          "password-type": "PLAIN_TEXT",
          "password": "<string>",
          "ciphertext-password": "<string>",
          "authentication-key-id": "<integer>",
          "sha-password-type": "PLAIN_TEXT",
          "sha-password": "<string>",
          "sha-cipher-password": "<string>",
          "md-key-id": "<integer>",
          "md-password-type": "PLAIN_TEXT",
          "md-password": "<string>",
          "md-cipherpassword": "<string>",
          "hello-interval": "10",
          "dead-interval": "40",
          "retransmit-interval": "5",
          "transit-delay": "1",
          "cost": "<long>",
          "priority": "1",
          "passive": "false",
          "shutdown": "false",
          "network": "POINT_TO_POINT",
          "bfd": "false",
          "summary-address": [
            {
              "prefix": "<string>",
              "route-type": "RAPNG",
              "no-advertise": "false",
              "tag": "<long>",
              "cost": "<long>"
            }
          ],
          "auto-summary-address": [
            {
              "prefix": "<string>",
              "auto-aggregate": [
                {
                  "route-type": "STATIC",
                  "aggregate-list-name": "<string>"
                }
              ]
            }
          ]
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
          "ospf-ip-address": "<string>",
          "ignore-mtu": "false",
          "authentication": "MESSAGE_DIGEST",
          "keychain-key": "<string>",
          "password-type": "PLAIN_TEXT",
          "password": "<string>",
          "ciphertext-password": "<string>",
          "authentication-key-id": "<integer>",
          "sha-password-type": "PLAIN_TEXT",
          "sha-password": "<string>",
          "sha-cipher-password": "<string>",
          "md-key-id": "<integer>",
          "md-password-type": "PLAIN_TEXT",
          "md-password": "<string>",
          "md-cipherpassword": "<string>",
          "hello-interval": "10",
          "dead-interval": "40",
          "retransmit-interval": "5",
          "transit-delay": "1",
          "cost": "<long>",
          "priority": "1",
          "passive": "false",
          "shutdown": "false",
          "network": "BROADCAST",
          "bfd": "false",
          "summary-address": [
            {
              "prefix": "<string>",
              "route-type": "RAPNG",
              "no-advertise": "false",
              "tag": "<long>",
              "cost": "<long>"
            }
          ],
          "auto-summary-address": [
            {
              "prefix": "<string>",
              "auto-aggregate": [
                {
                  "route-type": "BGP",
                  "aggregate-list-name": "<string>"
                }
              ]
            }
          ]
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
          "ospf-ip-address": "<string>",
          "ignore-mtu": "false",
          "authentication": "NULL",
          "keychain-key": "<string>",
          "password-type": "PLAIN_TEXT",
          "password": "<string>",
          "ciphertext-password": "<string>",
          "authentication-key-id": "<integer>",
          "sha-password-type": "PLAIN_TEXT",
          "sha-password": "<string>",
          "sha-cipher-password": "<string>",
          "md-key-id": "<integer>",
          "md-password-type": "PLAIN_TEXT",
          "md-password": "<string>",
          "md-cipherpassword": "<string>",
          "hello-interval": "10",
          "dead-interval": "40",
          "retransmit-interval": "5",
          "transit-delay": "1",
          "cost": "<long>",
          "priority": "1",
          "passive": "false",
          "shutdown": "false",
          "network": "POINT_TO_POINT",
          "bfd": "false",
          "summary-address": [
            {
              "prefix": "<string>",
              "route-type": "STATIC",
              "no-advertise": "false",
              "tag": "<long>",
              "cost": "<long>"
            }
          ],
          "auto-summary-address": [
            {
              "prefix": "<string>",
              "auto-aggregate": [
                {
                  "route-type": "STATIC",
                  "aggregate-list-name": "<string>"
                }
              ]
            }
          ]
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
          "ospf-ip-address": "<string>",
          "ignore-mtu": "false",
          "authentication": "HMAC_SHA_512",
          "keychain-key": "<string>",
          "password-type": "PLAIN_TEXT",
          "password": "<string>",
          "ciphertext-password": "<string>",
          "authentication-key-id": "<integer>",
          "sha-password-type": "PLAIN_TEXT",
          "sha-password": "<string>",
          "sha-cipher-password": "<string>",
          "md-key-id": "<integer>",
          "md-password-type": "PLAIN_TEXT",
          "md-password": "<string>",
          "md-cipherpassword": "<string>",
          "hello-interval": "10",
          "dead-interval": "40",
          "retransmit-interval": "5",
          "transit-delay": "1",
          "cost": "<long>",
          "priority": "1",
          "passive": "false",
          "shutdown": "false",
          "network": "BROADCAST",
          "bfd": "false",
          "summary-address": [
            {
              "prefix": "<string>",
              "route-type": "CFGSET",
              "no-advertise": "false",
              "tag": "<long>",
              "cost": "<long>"
            }
          ],
          "auto-summary-address": [
            {
              "prefix": "<string>",
              "auto-aggregate": [
                {
                  "route-type": "OVERLAY",
                  "aggregate-list-name": "<string>"
                }
              ]
            }
          ]
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
          "ospf-ip-address": "<string>",
          "ignore-mtu": "false",
          "authentication": "KEYCHAIN",
          "keychain-key": "<string>",
          "password-type": "PLAIN_TEXT",
          "password": "<string>",
          "ciphertext-password": "<string>",
          "authentication-key-id": "<integer>",
          "sha-password-type": "PLAIN_TEXT",
          "sha-password": "<string>",
          "sha-cipher-password": "<string>",
          "md-key-id": "<integer>",
          "md-password-type": "PLAIN_TEXT",
          "md-password": "<string>",
          "md-cipherpassword": "<string>",
          "hello-interval": "10",
          "dead-interval": "40",
          "retransmit-interval": "5",
          "transit-delay": "1",
          "cost": "<long>",
          "priority": "1",
          "passive": "false",
          "shutdown": "false",
          "network": "BROADCAST",
          "bfd": "false",
          "summary-address": [
            {
              "prefix": "<string>",
              "route-type": "RAPNG",
              "no-advertise": "false",
              "tag": "<long>",
              "cost": "<long>"
            }
          ],
          "auto-summary-address": [
            {
              "prefix": "<string>",
              "auto-aggregate": [
                {
                  "route-type": "CONNECTED",
                  "aggregate-list-name": "<string>"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "default-metric": "<long>",
  "distance": [
    {
      "route-type": "ROUTE_INTRA_AREA",
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
  "rfc1583-compatibility": "<boolean>",
  "redistribute-routes": [
    {
      "redistribute-id": "<integer>",
      "redistribute-type": "CONNECTED",
      "ospf-id": "<integer>",
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
  "trap-enable": "false",
  "reference-bandwidth": "100000",
  "default-information-origin": {
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
  "backbone-stub-default-route": "false",
  "summary-address": [
    {
      "prefix": "<string>",
      "route-type": "CFGSET",
      "no-advertise": "false",
      "tag": "<long>",
      "cost": "<long>"
    }
  ],
  "exclude-network": "<string>",
  "distribute-filter": [
    {
      "prefix-name": "<string>",
      "direction": "OUT"
    }
  ],
  "snmpv3": {
    "context-name": "<string>",
    "community": "<string>"
  },
  "bfd": "false",
  "restrict-routes": [
    {
      "restrict": "<string>"
    }
  ],
  "metric-type": "TYPE2",
  "reference-cost": "<long>",
  "nonstop": "false",
  "logging": {
    "neighbour-adjacency": "true",
    "detail": "false"
  },
  "distribute-list": [
    {
      "prefix": "<string>"
    }
  ]
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

