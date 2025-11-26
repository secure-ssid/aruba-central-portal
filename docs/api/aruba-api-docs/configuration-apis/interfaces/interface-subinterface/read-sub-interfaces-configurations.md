# Read sub-interface(s) configurations

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/sub-interfaces`

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
  "interface": [
    {
      "urpf": {
        "ipv4-enable": "DISABLE"
      },
      "ip": {
        "mtu": "1500",
        "l3-counters": "RX_TX"
      },
      "arp": {
        "timeout": "1800",
        "neighbor": [
          {
            "address": "<string>",
            "mac-address": "<string>"
          },
          {
            "address": "<string>",
            "mac-address": "<string>"
          }
        ],
        "proxy": "false",
        "local-proxy": "false",
        "process-grat": "true"
      },
      "nd": {
        "timeout": "1800",
        "neighbor": [
          {
            "address": "<string>",
            "mac-address": "<string>"
          },
          {
            "address": "<string>",
            "mac-address": "<string>"
          }
        ],
        "local-proxy": "false"
      },
      "ipv4": {
        "address": "<string>",
        "secondary-ip": [
          "<string>",
          "<string>"
        ],
        "dhcp-client-id": "<string>",
        "filter-broadcast-helper": "false",
        "helper-address": [
          "<string>",
          "<string>"
        ],
        "proxy-arp": "CLIENT",
        "nat-inside": "false",
        "nat-outside": "false",
        "route-redistribute": "false",
        "forwarding": "true",
        "suppress-arp": "true",
        "vrf-forwarding": "<string>",
        "dhcps-profile-name": "<string>"
      },
      "ipv6": {
        "enable": "false",
        "addresses": [
          {
            "address": "<string>",
            "eui64": "false",
            "tag": "0"
          },
          {
            "address": "<string>",
            "eui64": "false",
            "tag": "0"
          }
        ],
        "prefix-delegation-mode": "CLIENT",
        "pd-address": {
          "pd-address-name": "<string>",
          "subnet-host-id": "<string>"
        },
        "pd-client-name": "<string>",
        "dhcp-pool-name": "<string>",
        "filter-multicast-helper": "false",
        "helper": [
          {
            "address": "<string>",
            "source": "<string>"
          },
          {
            "address": "<string>",
            "source": "<string>"
          }
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "dhcps-profile-name": "<string>"
      },
      "policy": {
        "access-list-in": "<string>",
        "access-list-out": "<string>"
      },
      "ipv4-relay": {
        "bootp-gateway": "<string>",
        "server": [
          {
            "ip-vrf": "<string>"
          },
          {
            "ip-vrf": "<string>"
          }
        ]
      },
      "pim-sparse": {
        "hello-delay": "5",
        "hello-interval": "30",
        "override-interval": "2500",
        "propagation-delay": "500",
        "lan-prune-delay-disable": "false",
        "dr-priority": "1",
        "datapath-auto-include": "false"
      },
      "pim6-sparse": {
        "hello-delay": "5",
        "hello-interval": "30",
        "override-interval": "2500",
        "propagation-delay": "500",
        "lan-prune-delay-disable": "false",
        "dr-priority": "1",
        "datapath-auto-include": "false"
      },
      "boundary-acl": "<string>",
      "pim-dense": {
        "hello-delay": "5",
        "hello-interval": "30",
        "override-interval": "2500",
        "propagation-delay": "500",
        "lan-prune-delay-disable": "false",
        "graft-retry-interval": "3",
        "max-graft-retries": "3",
        "bfd-enable": "false"
      },
      "pim6-dense": {
        "hello-delay": "5",
        "hello-interval": "30",
        "override-interval": "2500",
        "propagation-delay": "500",
        "lan-prune-delay-disable": "false",
        "graft-retry-interval": "3",
        "max-graft-retries": "3",
        "bfd-enable": "false"
      },
      "igmp": {
        "static-group": [
          "<string>",
          "<string>"
        ],
        "querier-enable": "true",
        "query-interval": "125",
        "last-member-query-interval": "1",
        "robustness": "2",
        "query-max-response-time": "10",
        "policy-in": "<string>",
        "ssm-map-policy-in": "<string>"
      },
      "mld": {
        "static-group": [
          "<string>",
          "<string>"
        ],
        "querier-enable": "true",
        "query-interval": "125",
        "last-member-query-interval": "1",
        "robustness": "2",
        "query-max-response-time": "10",
        "policy-in": "<string>",
        "ssm-map-policy-in": "<string>"
      },
      "parent-name-id": "<string>",
      "description": "<string>",
      "routing": "<boolean>",
      "enable": "false",
      "encapsulation-vlan-id": "<integer>",
      "vrf-forwarding": "<string>",
      "vrrp": {
        "vrrp-profile-apply": "<string>"
      }
    },
    {
      "urpf": {
        "ipv4-enable": "DISABLE"
      },
      "ip": {
        "mtu": "1500",
        "l3-counters": "RX_TX"
      },
      "arp": {
        "timeout": "1800",
        "neighbor": [
          {
            "address": "<string>",
            "mac-address": "<string>"
          },
          {
            "address": "<string>",
            "mac-address": "<string>"
          }
        ],
        "proxy": "false",
        "local-proxy": "false",
        "process-grat": "true"
      },
      "nd": {
        "timeout": "1800",
        "neighbor": [
          {
            "address": "<string>",
            "mac-address": "<string>"
          },
          {
            "address": "<string>",
            "mac-address": "<string>"
          }
        ],
        "local-proxy": "false"
      },
      "ipv4": {
        "address": "<string>",
        "secondary-ip": [
          "<string>",
          "<string>"
        ],
        "dhcp-client-id": "<string>",
        "filter-broadcast-helper": "false",
        "helper-address": [
          "<string>",
          "<string>"
        ],
        "proxy-arp": "GATEWAY",
        "nat-inside": "false",
        "nat-outside": "false",
        "route-redistribute": "false",
        "forwarding": "true",
        "suppress-arp": "true",
        "vrf-forwarding": "<string>",
        "dhcps-profile-name": "<string>"
      },
      "ipv6": {
        "enable": "false",
        "addresses": [
          {
            "address": "NO_DHCP",
            "eui64": "false",
            "tag": "0"
          },
          {
            "address": "<string>",
            "eui64": "false",
            "tag": "0"
          }
        ],
        "prefix-delegation-mode": "ADDRESS",
        "pd-address": {
          "pd-address-name": "<string>",
          "subnet-host-id": "<string>"
        },
        "pd-client-name": "<string>",
        "dhcp-pool-name": "<string>",
        "filter-multicast-helper": "false",
        "helper": [
          {
            "address": "<string>",
            "source": "<string>"
          },
          {
            "address": "<string>",
            "source": "<string>"
          }
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "dhcps-profile-name": "<string>"
      },
      "policy": {
        "access-list-in": "<string>",
        "access-list-out": "<string>"
      },
      "ipv4-relay": {
        "bootp-gateway": "<string>",
        "server": [
          {
            "ip-vrf": "<string>"
          },
          {
            "ip-vrf": "<string>"
          }
        ]
      },
      "pim-sparse": {
        "hello-delay": "5",
        "hello-interval": "30",
        "override-interval": "2500",
        "propagation-delay": "500",
        "lan-prune-delay-disable": "false",
        "dr-priority": "1",
        "datapath-auto-include": "false"
      },
      "pim6-sparse": {
        "hello-delay": "5",
        "hello-interval": "30",
        "override-interval": "2500",
        "propagation-delay": "500",
        "lan-prune-delay-disable": "false",
        "dr-priority": "1",
        "datapath-auto-include": "false"
      },
      "boundary-acl": "<string>",
      "pim-dense": {
        "hello-delay": "5",
        "hello-interval": "30",
        "override-interval": "2500",
        "propagation-delay": "500",
        "lan-prune-delay-disable": "false",
        "graft-retry-interval": "3",
        "max-graft-retries": "3",
        "bfd-enable": "false"
      },
      "pim6-dense": {
        "hello-delay": "5",
        "hello-interval": "30",
        "override-interval": "2500",
        "propagation-delay": "500",
        "lan-prune-delay-disable": "false",
        "graft-retry-interval": "3",
        "max-graft-retries": "3",
        "bfd-enable": "false"
      },
      "igmp": {
        "static-group": [
          "<string>",
          "<string>"
        ],
        "querier-enable": "true",
        "query-interval": "125",
        "last-member-query-interval": "1",
        "robustness": "2",
        "query-max-response-time": "10",
        "policy-in": "<string>",
        "ssm-map-policy-in": "<string>"
      },
      "mld": {
        "static-group": [
          "<string>",
          "<string>"
        ],
        "querier-enable": "true",
        "query-interval": "125",
        "last-member-query-interval": "1",
        "robustness": "2",
        "query-max-response-time": "10",
        "policy-in": "<string>",
        "ssm-map-policy-in": "<string>"
      },
      "parent-name-id": "<string>",
      "description": "<string>",
      "routing": "<boolean>",
      "enable": "false",
      "encapsulation-vlan-id": "<integer>",
      "vrf-forwarding": "<string>",
      "vrrp": {
        "vrrp-profile-apply": "<string>"
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

