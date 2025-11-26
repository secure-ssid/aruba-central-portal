# Read existing Protocol Independent Multicast configurations

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/pim-router`

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
          "ssm-enable": "false",
          "join-prune-interval": "60",
          "spt-threshold-disable": "false",
          "active-active": "false",
          "redistribute-static": "false",
          "register-message-limit": "<long>",
          "mroute-limit": "<long>",
          "sources-per-group": "<long>",
          "state-refresh": "60",
          "bfd-all-interfaces-enable": "false",
          "register-policy": "<string>",
          "ssm-range-policy": "<string>",
          "rp-group-policies": [
            {
              "rp-address": "<string>",
              "group-policy": "<string>"
            },
            {
              "rp-address": "<string>",
              "group-policy": "<string>"
            }
          ],
          "register-source-port": {
            "interface-type": "INTF_TUNNEL",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>"
          },
          "vrf-address-family": "<string>",
          "enable": "false",
          "static-rps": [
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            },
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            }
          ],
          "static-rp-policy": {
            "rp-address": "<string>",
            "static-rp-group-policy": "<string>",
            "override-enable": "false"
          },
          "anycast-rp-source-directly-connected": "false",
          "candidate-rp": {
            "enable": "false",
            "interface-type": "INTF_VLAN",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "group-prefixes": [
              "<string>",
              "<string>"
            ],
            "priority": "192",
            "holdtime": "150"
          },
          "candidate-bsr": {
            "enable": "false",
            "interface-type": "INTF_ETHERNET",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "priority": "0",
            "hash-mask-length": "30",
            "bsm-interval": "60"
          },
          "rpf-override": [
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_LOOPBACK",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            },
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_TUNNEL",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            }
          ],
          "static-rps-v6": [
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            },
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            }
          ],
          "static-rp-policy-v6": {
            "rp-address": "<string>",
            "group-policy": "<string>",
            "override-enable": "false"
          },
          "candidate-rp-v6": {
            "enable": "false",
            "interface-type": "INTF_PORT_CHANNEL",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "group-prefixes": [
              "<string>",
              "<string>"
            ],
            "priority": "192",
            "holdtime": "150"
          },
          "candidate-bsr-v6": {
            "enable": "false",
            "interface-type": "INTF_TUNNEL",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "priority": "0",
            "hash-mask-length": "126",
            "bsm-interval": "60"
          },
          "rpf-override-v6": [
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_USB",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            },
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_MANAGEMENT",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            }
          ]
        },
        {
          "ssm-enable": "false",
          "join-prune-interval": "60",
          "spt-threshold-disable": "false",
          "active-active": "false",
          "redistribute-static": "false",
          "register-message-limit": "<long>",
          "mroute-limit": "<long>",
          "sources-per-group": "<long>",
          "state-refresh": "60",
          "bfd-all-interfaces-enable": "false",
          "register-policy": "<string>",
          "ssm-range-policy": "<string>",
          "rp-group-policies": [
            {
              "rp-address": "<string>",
              "group-policy": "<string>"
            },
            {
              "rp-address": "<string>",
              "group-policy": "<string>"
            }
          ],
          "register-source-port": {
            "interface-type": "INTF_TUNNEL",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>"
          },
          "vrf-address-family": "<string>",
          "enable": "false",
          "static-rps": [
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            },
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            }
          ],
          "static-rp-policy": {
            "rp-address": "<string>",
            "static-rp-group-policy": "<string>",
            "override-enable": "false"
          },
          "anycast-rp-source-directly-connected": "false",
          "candidate-rp": {
            "enable": "false",
            "interface-type": "INTF_ETHERNET",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "group-prefixes": [
              "<string>",
              "<string>"
            ],
            "priority": "192",
            "holdtime": "150"
          },
          "candidate-bsr": {
            "enable": "false",
            "interface-type": "INTF_SUBINTERFACE",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "priority": "0",
            "hash-mask-length": "30",
            "bsm-interval": "60"
          },
          "rpf-override": [
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_VLAN",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            },
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_ETHERNET",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            }
          ],
          "static-rps-v6": [
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            },
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            }
          ],
          "static-rp-policy-v6": {
            "rp-address": "<string>",
            "group-policy": "<string>",
            "override-enable": "false"
          },
          "candidate-rp-v6": {
            "enable": "false",
            "interface-type": "INTF_PORT_CHANNEL",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "group-prefixes": [
              "<string>",
              "<string>"
            ],
            "priority": "192",
            "holdtime": "150"
          },
          "candidate-bsr-v6": {
            "enable": "false",
            "interface-type": "INTF_LOOPBACK",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "priority": "0",
            "hash-mask-length": "126",
            "bsm-interval": "60"
          },
          "rpf-override-v6": [
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_SUBINTERFACE",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            },
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_ETHERNET",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            }
          ]
        }
      ]
    },
    {
      "name": "<string>",
      "description": "<string>",
      "router": [
        {
          "ssm-enable": "false",
          "join-prune-interval": "60",
          "spt-threshold-disable": "false",
          "active-active": "false",
          "redistribute-static": "false",
          "register-message-limit": "<long>",
          "mroute-limit": "<long>",
          "sources-per-group": "<long>",
          "state-refresh": "60",
          "bfd-all-interfaces-enable": "false",
          "register-policy": "<string>",
          "ssm-range-policy": "<string>",
          "rp-group-policies": [
            {
              "rp-address": "<string>",
              "group-policy": "<string>"
            },
            {
              "rp-address": "<string>",
              "group-policy": "<string>"
            }
          ],
          "register-source-port": {
            "interface-type": "INTF_TUNNEL",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>"
          },
          "vrf-address-family": "<string>",
          "enable": "false",
          "static-rps": [
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            },
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            }
          ],
          "static-rp-policy": {
            "rp-address": "<string>",
            "static-rp-group-policy": "<string>",
            "override-enable": "false"
          },
          "anycast-rp-source-directly-connected": "false",
          "candidate-rp": {
            "enable": "false",
            "interface-type": "INTF_TUNNEL",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "group-prefixes": [
              "<string>",
              "<string>"
            ],
            "priority": "192",
            "holdtime": "150"
          },
          "candidate-bsr": {
            "enable": "false",
            "interface-type": "INTF_ETHERNET",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "priority": "0",
            "hash-mask-length": "30",
            "bsm-interval": "60"
          },
          "rpf-override": [
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_LOOPBACK",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            },
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_LOOPBACK",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            }
          ],
          "static-rps-v6": [
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            },
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            }
          ],
          "static-rp-policy-v6": {
            "rp-address": "<string>",
            "group-policy": "<string>",
            "override-enable": "false"
          },
          "candidate-rp-v6": {
            "enable": "false",
            "interface-type": "INTF_ETHERNET",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "group-prefixes": [
              "<string>",
              "<string>"
            ],
            "priority": "192",
            "holdtime": "150"
          },
          "candidate-bsr-v6": {
            "enable": "false",
            "interface-type": "INTF_PORT_CHANNEL",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "priority": "0",
            "hash-mask-length": "126",
            "bsm-interval": "60"
          },
          "rpf-override-v6": [
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_MANAGEMENT",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            },
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_TUNNEL",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            }
          ]
        },
        {
          "ssm-enable": "false",
          "join-prune-interval": "60",
          "spt-threshold-disable": "false",
          "active-active": "false",
          "redistribute-static": "false",
          "register-message-limit": "<long>",
          "mroute-limit": "<long>",
          "sources-per-group": "<long>",
          "state-refresh": "60",
          "bfd-all-interfaces-enable": "false",
          "register-policy": "<string>",
          "ssm-range-policy": "<string>",
          "rp-group-policies": [
            {
              "rp-address": "<string>",
              "group-policy": "<string>"
            },
            {
              "rp-address": "<string>",
              "group-policy": "<string>"
            }
          ],
          "register-source-port": {
            "interface-type": "INTF_MANAGEMENT",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>"
          },
          "vrf-address-family": "<string>",
          "enable": "false",
          "static-rps": [
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            },
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            }
          ],
          "static-rp-policy": {
            "rp-address": "<string>",
            "static-rp-group-policy": "<string>",
            "override-enable": "false"
          },
          "anycast-rp-source-directly-connected": "false",
          "candidate-rp": {
            "enable": "false",
            "interface-type": "INTF_USB",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "group-prefixes": [
              "<string>",
              "<string>"
            ],
            "priority": "192",
            "holdtime": "150"
          },
          "candidate-bsr": {
            "enable": "false",
            "interface-type": "INTF_MANAGEMENT",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "priority": "0",
            "hash-mask-length": "30",
            "bsm-interval": "60"
          },
          "rpf-override": [
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_SUBINTERFACE",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            },
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_PORT_CHANNEL",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            }
          ],
          "static-rps-v6": [
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            },
            {
              "rp-address": "<string>",
              "group-address-range": "<string>",
              "override-enable": "false"
            }
          ],
          "static-rp-policy-v6": {
            "rp-address": "<string>",
            "group-policy": "<string>",
            "override-enable": "false"
          },
          "candidate-rp-v6": {
            "enable": "false",
            "interface-type": "INTF_ETHERNET",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "group-prefixes": [
              "<string>",
              "<string>"
            ],
            "priority": "192",
            "holdtime": "150"
          },
          "candidate-bsr-v6": {
            "enable": "false",
            "interface-type": "INTF_LOOPBACK",
            "interface-ethernet": "<string>",
            "interface-vlan": "<integer>",
            "interface-portchannel": "<string>",
            "loopback": "<integer>",
            "sub-interface": "<string>",
            "priority": "0",
            "hash-mask-length": "126",
            "bsm-interval": "60"
          },
          "rpf-override-v6": [
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_LOOPBACK",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
            },
            {
              "source-prefix": "<string>",
              "nexthop-address": "<string>",
              "interface-type": "INTF_ETHERNET",
              "interface-ethernet": "<string>",
              "interface-vlan": "<integer>",
              "interface-portchannel": "<string>",
              "loopback": "<integer>",
              "sub-interface": "<string>"
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

