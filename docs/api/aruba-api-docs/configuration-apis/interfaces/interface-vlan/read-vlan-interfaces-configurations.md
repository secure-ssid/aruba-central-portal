# Read VLAN interface(s) configurations

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/vlan-interfaces`

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
      "pppoe": {
        "max-segment-size": "1452",
        "nat-gateway-address": "<string>",
        "password": "<string>",
        "secret": "<string>",
        "service-name": "<string>",
        "username": "<string>"
      },
      "ip": {
        "mtu": "1500",
        "l3-counters": "RX_TX"
      },
      "ipv4": {
        "address": "<string>",
        "address-alias": "<string>",
        "secondary-ip-alias": "<string>",
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
        "option-82": "<boolean>",
        "route-redistribute": "false",
        "forwarding": "true",
        "suppress-arp": "true",
        "vrf-forwarding": "<string>",
        "dhcps-profile-name": "<string>"
      },
      "ipv6": {
        "enable": "false",
        "addresses-alias": "<string>",
        "addresses": [
          {
            "address": "DHCP_FULL_RAPID_COMMIT",
            "eui64": "false",
            "tag": "0"
          },
          {
            "address": "DHCP_FULL",
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
        "link-local-alias": "<string>",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "dhcps-profile-name": "<string>"
      },
      "ip-directed-broadcast-enable": "false",
      "policy": {
        "access-list-in": "<string>",
        "access-list-out": "<string>"
      },
      "vsx": {
        "shutdown-on-split": "false"
      },
      "active-gateway": {
        "ipv4-address": [
          "<string>",
          "<string>"
        ],
        "mac-address-v4": "<string>",
        "extended-mac-address-v4": "false",
        "ipv6-address": [
          "<string>",
          "<string>"
        ],
        "mac-address-v6": "<string>",
        "extended-mac-address-v6": "false",
        "virtual-gw-l3-src-mac-enable": "false"
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
      "pim-sparse-vlan": {
        "vsx-virtual-neighbor-ipv4": "false",
        "vsx-virtual-neighbor-ipv6": "false"
      },
      "pim-dense-vlan": {
        "enable": "false"
      },
      "pim-bidir": {
        "bidir-enable": "false",
        "hello-interval": "30",
        "hello-delay": "5",
        "lan-prune-delay": "true",
        "override-interval": "2500",
        "propagation-delay": "500"
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
      "dhcpv6-client-auth": {
        "mode": "MD5",
        "key-chain": "<string>"
      },
      "id": "<integer>",
      "is-valid": "true",
      "enable": "<boolean>",
      "description": "<string>",
      "bandwidth-contract": "<string>",
      "bcmc-optimization": "false",
      "mm-auth-lease-time": "<integer>",
      "oper-state-up": "false",
      "ip-neighbor-flood-enable": "false",
      "jumbo": "false",
      "ntp-ipv6-multicast": "false",
      "disable-layer3": "false",
      "vrf-forwarding": "<string>",
      "tcp-adj-mss": "1460",
      "ip-access-group-in": "<string>",
      "qos": {
        "dscp": "<integer>",
        "priority": "<integer>"
      },
      "mdns-sd": {
        "mdns-profile": "<string>",
        "enable": "false",
        "apply-profile": "<string>"
      },
      "vrrp": {
        "vrrp-profile-apply": "<string>",
        "dual-active-forwarding": "false"
      }
    },
    {
      "urpf": {
        "ipv4-enable": "DISABLE"
      },
      "pppoe": {
        "max-segment-size": "1452",
        "nat-gateway-address": "<string>",
        "password": "<string>",
        "secret": "<string>",
        "service-name": "<string>",
        "username": "<string>"
      },
      "ip": {
        "mtu": "1500",
        "l3-counters": "RX_TX"
      },
      "ipv4": {
        "address": "<string>",
        "address-alias": "<string>",
        "secondary-ip-alias": "<string>",
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
        "option-82": "<boolean>",
        "route-redistribute": "false",
        "forwarding": "true",
        "suppress-arp": "true",
        "vrf-forwarding": "<string>",
        "dhcps-profile-name": "<string>"
      },
      "ipv6": {
        "enable": "false",
        "addresses-alias": "<string>",
        "addresses": [
          {
            "address": "DHCP_FULL_RAPID_COMMIT",
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
        "link-local-alias": "<string>",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "dhcps-profile-name": "<string>"
      },
      "ip-directed-broadcast-enable": "false",
      "policy": {
        "access-list-in": "<string>",
        "access-list-out": "<string>"
      },
      "vsx": {
        "shutdown-on-split": "false"
      },
      "active-gateway": {
        "ipv4-address": [
          "<string>",
          "<string>"
        ],
        "mac-address-v4": "<string>",
        "extended-mac-address-v4": "false",
        "ipv6-address": [
          "<string>",
          "<string>"
        ],
        "mac-address-v6": "<string>",
        "extended-mac-address-v6": "false",
        "virtual-gw-l3-src-mac-enable": "false"
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
      "pim-sparse-vlan": {
        "vsx-virtual-neighbor-ipv4": "false",
        "vsx-virtual-neighbor-ipv6": "false"
      },
      "pim-dense-vlan": {
        "enable": "false"
      },
      "pim-bidir": {
        "bidir-enable": "false",
        "hello-interval": "30",
        "hello-delay": "5",
        "lan-prune-delay": "true",
        "override-interval": "2500",
        "propagation-delay": "500"
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
      "dhcpv6-client-auth": {
        "mode": "MD5",
        "key-chain": "<string>"
      },
      "id": "<integer>",
      "is-valid": "true",
      "enable": "<boolean>",
      "description": "<string>",
      "bandwidth-contract": "<string>",
      "bcmc-optimization": "false",
      "mm-auth-lease-time": "<integer>",
      "oper-state-up": "false",
      "ip-neighbor-flood-enable": "false",
      "jumbo": "false",
      "ntp-ipv6-multicast": "false",
      "disable-layer3": "false",
      "vrf-forwarding": "<string>",
      "tcp-adj-mss": "1460",
      "ip-access-group-in": "<string>",
      "qos": {
        "dscp": "<integer>",
        "priority": "<integer>"
      },
      "mdns-sd": {
        "mdns-profile": "<string>",
        "enable": "false",
        "apply-profile": "<string>"
      },
      "vrrp": {
        "vrrp-profile-apply": "<string>",
        "dual-active-forwarding": "false"
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

