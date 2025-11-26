# Read existing BGP router configuration

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/bgp`

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
      "router": [
        {
          "as-vrf": "<string>",
          "router-id": "<string>",
          "route-reflector-cluster-id": "<long>",
          "disable": "<boolean>",
          "max-as-limit": "32",
          "enable-snmp-traps": "false",
          "fast-external-fallover": "true",
          "enable-bgp-update-group": "false",
          "aggregate-address-split-horizon": "true",
          "as-notation": "DOTTED",
          "open-on-accept": "false",
          "client-to-client-reflection": "true",
          "allow-own-as": "<integer>",
          "nonstop": "false",
          "log-neighbor-state-changes": "false",
          "log-neighbor-state-changes-prefix-list": "<string>",
          "use-multiple-paths": {
            "maximum-paths": "4"
          },
          "global-afi-safi": [
            {
              "address-family": "IPV6_UNICAST",
              "global-ipv4-unicast": {
                "bgp-dampening": {
                  "half-life": "<integer>",
                  "reuse-limit": "<integer>",
                  "suppress-limit": "<integer>",
                  "max-suppress-time": "<integer>",
                  "enable": "<boolean>",
                  "route-map": "<string>"
                },
                "network": [
                  {
                    "prefix": "<string>",
                    "route-map": "<string>"
                  }
                ],
                "redistribute": [
                  {
                    "route-type": "LOCAL_LOOPBACK",
                    "ospf-id": "<integer>",
                    "route-map": "<string>"
                  }
                ],
                "aggregate-address-sources": [
                  "CLOUD_OVERLAY"
                ],
                "aggregate-address": [
                  {
                    "address": "<string>",
                    "as-set": "<boolean>",
                    "summary-only": "<boolean>",
                    "advertise-map": "<string>",
                    "attribute-map": "<string>",
                    "suppress-map": "<string>"
                  }
                ],
                "maximum-paths": "4"
              },
              "global-ipv6-unicast": {
                "bgp-dampening": {
                  "half-life": "<integer>",
                  "reuse-limit": "<integer>",
                  "suppress-limit": "<integer>",
                  "max-suppress-time": "<integer>",
                  "enable": "<boolean>",
                  "route-map": "<string>"
                },
                "network": [
                  {
                    "prefix": "<string>",
                    "route-map": "<string>"
                  }
                ],
                "redistribute": [
                  {
                    "route-type": "LOCAL_LOOPBACK",
                    "ospf-id": "<integer>",
                    "route-map": "<string>",
                    "import-metric": "false"
                  }
                ],
                "aggregate-address": [
                  {
                    "address": "<string>",
                    "as-set": "<boolean>",
                    "summary-only": "<boolean>",
                    "advertise-map": "<string>",
                    "attribute-map": "<string>",
                    "suppress-map": "<string>"
                  }
                ],
                "maximum-paths": "4"
              }
            }
          ],
          "neighbor": [
            {
              "peer-as": "<long>",
              "enabled": "true",
              "local-as": "<long>",
              "local-as-mode": "NO_PREPEND",
              "auth-password": "<string>",
              "remove-private-as": "false",
              "description": "<string>",
              "fall-over": "false",
              "fall-over-bfd": "false",
              "ignore-leading-as": "false",
              "weight": "0",
              "use-med": "true",
              "as-override": "false",
              "route-refresh-capability": "false",
              "graceful-restart-capability": "false",
              "dynamic-capability": "false",
              "ebgp-multihop-ttl-enable": "false",
              "ebgp-multihop-ttl": "1",
              "ttl-security-hops": "<integer>",
              "afi-safi": [
                {
                  "address-family": "L2VPN_EVPN",
                  "ipv4-unicast": {
                    "enabled": "false",
                    "route-reflector-client": "<boolean>",
                    "send-community": {
                      "send-community-enable": "<boolean>",
                      "type": "STANDARD"
                    },
                    "allow-own-as": "<integer>",
                    "apply-route-map": [
                      {
                        "route-map": "<string>",
                        "direction": "OUTBOUND"
                      }
                    ],
                    "add-paths": {
                      "direction": "BOTH",
                      "send-max": "1"
                    },
                    "minimum-advertisement-interval": "<long>",
                    "next-hop-self": "false",
                    "orf-capability": "BOTH",
                    "orf": [
                      {
                        "prefix-list": "<string>",
                        "direction": "INBOUND"
                      }
                    ],
                    "inbound-soft-reconfiguration": "false"
                  },
                  "ipv6-unicast": {
                    "enabled": "false",
                    "route-reflector-client": "<boolean>",
                    "send-community": {
                      "send-community-enable": "<boolean>",
                      "type": "STANDARD"
                    },
                    "allow-own-as": "<integer>",
                    "apply-route-map": [
                      {
                        "route-map": "<string>",
                        "direction": "INBOUND"
                      }
                    ],
                    "add-paths": {
                      "direction": "RECEIVE",
                      "send-max": "1"
                    },
                    "minimum-advertisement-interval": "<long>",
                    "next-hop-self": "false",
                    "orf-capability": "BOTH",
                    "orf": [
                      {
                        "prefix-list": "<string>",
                        "direction": "INBOUND"
                      }
                    ],
                    "inbound-soft-reconfiguration": "false"
                  },
                  "l2vpn-evpn": {
                    "enabled": "false",
                    "route-reflector-client": "<boolean>",
                    "send-community": {
                      "send-community-enable": "<boolean>",
                      "type": "EXTENDED"
                    },
                    "allow-own-as": "<integer>",
                    "apply-route-map": [
                      {
                        "route-map": "<string>",
                        "direction": "OUTBOUND"
                      }
                    ],
                    "next-hop-self": "false",
                    "next-hop-unchanged": "false"
                  },
                  "vpnv4": {
                    "enabled": "false",
                    "route-reflector-client": "<boolean>",
                    "send-community": {
                      "send-community-enable": "<boolean>",
                      "type": "BOTH"
                    },
                    "allow-own-as": "<integer>",
                    "apply-route-map": [
                      {
                        "route-map": "<string>",
                        "direction": "INBOUND"
                      }
                    ]
                  }
                }
              ],
              "neighbor-id": "<string>",
              "peer-group": "<string>",
              "slow-peer": "false"
            }
          ],
          "peer-group": [
            {
              "enabled": "true",
              "local-as": "<long>",
              "local-as-mode": "NO_PREPEND",
              "auth-password": "<string>",
              "remove-private-as": "false",
              "description": "<string>",
              "fall-over": "false",
              "fall-over-bfd": "false",
              "ignore-leading-as": "false",
              "weight": "0",
              "use-med": "true",
              "as-override": "false",
              "route-refresh-capability": "false",
              "graceful-restart-capability": "false",
              "dynamic-capability": "false",
              "ebgp-multihop-ttl-enable": "false",
              "ebgp-multihop-ttl": "1",
              "ttl-security-hops": "<integer>",
              "afi-safi": [
                {
                  "address-family": "IPV6_UNICAST",
                  "ipv4-unicast": {
                    "route-reflector-client": "<boolean>",
                    "send-community": {
                      "send-community-enable": "<boolean>",
                      "type": "BOTH"
                    },
                    "allow-own-as": "<integer>",
                    "apply-route-map": [
                      {
                        "route-map": "<string>",
                        "direction": "INBOUND"
                      }
                    ],
                    "add-paths": {
                      "direction": "RECEIVE",
                      "send-max": "1"
                    },
                    "minimum-advertisement-interval": "<long>",
                    "next-hop-self": "false",
                    "orf-capability": "BOTH",
                    "orf": [
                      {
                        "prefix-list": "<string>",
                        "direction": "INBOUND"
                      }
                    ],
                    "inbound-soft-reconfiguration": "false"
                  },
                  "ipv6-unicast": {
                    "route-reflector-client": "<boolean>",
                    "send-community": {
                      "send-community-enable": "<boolean>",
                      "type": "STANDARD"
                    },
                    "allow-own-as": "<integer>",
                    "apply-route-map": [
                      {
                        "route-map": "<string>",
                        "direction": "OUTBOUND"
                      }
                    ],
                    "add-paths": {
                      "direction": "SEND",
                      "send-max": "1"
                    },
                    "minimum-advertisement-interval": "<long>",
                    "next-hop-self": "false",
                    "orf-capability": "BOTH",
                    "orf": [
                      {
                        "prefix-list": "<string>",
                        "direction": "INBOUND"
                      }
                    ],
                    "inbound-soft-reconfiguration": "false"
                  },
                  "l2vpn-evpn": {
                    "route-reflector-client": "<boolean>",
                    "send-community": {
                      "send-community-enable": "<boolean>",
                      "type": "EXTENDED"
                    },
                    "allow-own-as": "<integer>",
                    "apply-route-map": [
                      {
                        "route-map": "<string>",
                        "direction": "INBOUND"
                      }
                    ],
                    "next-hop-self": "false",
                    "next-hop-unchanged": "false"
                  },
                  "vpnv4": {
                    "route-reflector-client": "<boolean>",
                    "send-community": {
                      "send-community-enable": "<boolean>",
                      "type": "STANDARD"
                    },
                    "allow-own-as": "<integer>",
                    "apply-route-map": [
                      {
                        "route-map": "<string>",
                        "direction": "OUTBOUND"
                      }
                    ]
                  }
                }
              ],
              "peer-group-name": "<string>",
              "peer-as": "<long>",
              "listen-parameters": [
                {
                  "ip-range": "<string>",
                  "as-range": "<string>",
                  "max-limit": "<integer>"
                }
              ]
            }
          ]
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

