# Create port channel interface configurations

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-config/v1alpha1/portchannels/:name`

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
  "policy": {
    "access-list-in": "<string>",
    "access-list-out": "<string>"
  },
  "policy-vlan-config": {
    "policy-access-group": [
      {
        "access-group-vlan-session": "<string>",
        "access-group-vlan-id": "<integer>"
      }
    ]
  },
  "urpf": {
    "ipv4-enable": "DISABLE"
  },
  "stp": {
    "enable": "true",
    "bpdu-filter": "<boolean>",
    "bpdu-guard": "<boolean>",
    "loop-guard": "<boolean>",
    "pvst-filter": "<boolean>",
    "pvst-guard": "<boolean>",
    "root-guard": "<boolean>",
    "rpvst-filter": "<boolean>",
    "rpvst-guard": "<boolean>",
    "tcn-guard": "<boolean>",
    "native-vlan-ieee-bpdu": "false",
    "admin-edge-port": "<boolean>",
    "admin-edge-port-trunk": "<boolean>",
    "cost": "<long>",
    "priority": "<integer>",
    "hello-time": "<integer>",
    "link-type": "POINT_TO_POINT",
    "auto-edge": "<boolean>",
    "rpvst": [
      {
        "cost": "0",
        "priority": "8",
        "vlan-id": "<integer>"
      }
    ],
    "mstp": [
      {
        "cost": "0",
        "priority": "8",
        "instance-id": "<string>"
      }
    ]
  },
  "aaa-lag": {
    "security-violation": {
      "action": "NONE",
      "shutdown-recovery-enable": "false",
      "recovery-timer": "10"
    }
  },
  "vlan-translate": [
    {
      "origin": "<integer>",
      "translated": "<integer>"
    }
  ],
  "qos": {
    "cos": "<integer>",
    "dscp": "<integer>",
    "max-rate-units": "PERCENT",
    "egress-rate": "<long>",
    "burst": "<integer>",
    "trust": "DOT1P",
    "minimum-bandwidth": {
      "bandwidth": [
        {
          "qindex": "<integer>",
          "qvalue": "<integer>",
          "strict": "<boolean>"
        }
      ]
    },
    "broadcast-rate-limit": {
      "rate-type": "PERCENT",
      "bit-rate": "<long>",
      "percentage": "<long>",
      "packet-rate": "<long>"
    },
    "multicast-rate-limit": {
      "rate-type": "PERCENT",
      "bit-rate": "<long>",
      "percentage": "<long>",
      "packet-rate": "<long>"
    },
    "unknown-unicast-rate-limit": {
      "rate-type": "KBPS",
      "bit-rate": "<long>",
      "percentage": "<long>",
      "packet-rate": "<long>"
    },
    "icmp-rate-limit": {
      "rate-type": "KBPS",
      "bit-rate": "<long>",
      "percentage": "<long>",
      "packet-rate": "<long>"
    },
    "queue-rate-limit": {
      "queue-limit": [
        {
          "index": "<integer>",
          "value": "<integer>"
        }
      ]
    }
  },
  "lacp": {
    "mode": "AUTO",
    "mad-passthrough": "<boolean>",
    "min-active-links": "<integer>",
    "enable-timer": "<long>",
    "fallback": "false",
    "fallback-static": "false",
    "rate": "SLOW",
    "port-id": "<integer>",
    "port-priority": "1"
  },
  "cdp": {
    "enable": "true",
    "mode": "TX_ONLY_ON_VOICE_RX"
  },
  "qinq": {
    "selective-qinq": [
      {
        "customer-vlans": [
          "<string>"
        ],
        "service-vlan": "<integer>"
      }
    ],
    "qinq-port-type": "PROVIDER_NETWORK"
  },
  "switchport": {
    "interface-mode": "TRUNK",
    "native-vlan": "<integer>",
    "tag": "false",
    "access-vlan": "<integer>",
    "trunk-vlan-all": "false",
    "trunk-vlan-ranges": [
      "<string>"
    ]
  },
  "ip": {
    "mtu": "1500",
    "l3-counters": "TX"
  },
  "ipv4": {
    "address": "NONE",
    "secondary-ip": [
      "<string>"
    ],
    "dhcp-client-id": "<string>",
    "filter-broadcast-helper": "false",
    "helper-address": [
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
        "address": "DHCP_FULL",
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
      }
    ],
    "autoconfig": "false",
    "link-local": "<string>",
    "enable-default-link-local": "false",
    "dhcps-profile-name": "<string>"
  },
  "arp": {
    "timeout": "1800",
    "neighbor": [
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
      }
    ],
    "local-proxy": "false"
  },
  "ip-directed-broadcast-enable": "false",
  "sflow": {
    "enable": "false"
  },
  "vsx": {
    "shutdown-on-split": "false"
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
      }
    ]
  },
  "ipfix-flow-monitor-in": {
    "ipv4-monitor": "<string>",
    "ipv6-monitor": "<string>"
  },
  "dhcpv4-snooping": {
    "max-bindings": "<integer>",
    "trust": "false"
  },
  "dhcpv6-snooping": {
    "max-bindings": "<integer>",
    "trust": "false",
    "guard-policy": "<string>"
  },
  "nd-snooping": {
    "max-bindings": "<integer>",
    "ra-guard-policy": "<string>",
    "trust": "false"
  },
  "ip-source-lockdown": {
    "ipv4": "false",
    "ipv6": "false"
  },
  "mode": "AUTO",
  "connect-to-network-device": "false",
  "client-limit-max": "128",
  "update-interval": "1800",
  "dynamic-arp-inspection": {
    "trust": "false"
  },
  "profile-name": "<string>",
  "client-limit": "<integer>",
  "incoming-clients-only": "false",
  "igmp-snooping-lag": {
    "auto-vlan": [
      "<integer>"
    ],
    "blocked-vlan": [
      "<integer>"
    ],
    "forward-vlan": [
      "<integer>"
    ]
  },
  "mld-snooping-lag": {
    "auto-vlan": [
      "<integer>"
    ],
    "blocked-vlan": [
      "<integer>"
    ],
    "forward-vlan": [
      "<integer>"
    ]
  },
  "ptp": {
    "clock-source-only": "false",
    "default-log-announce-interval": "1",
    "dot1as-log-announce-interval": "0",
    "aes67-log-announce-interval": "1",
    "aes-r16-log-announce-interval": "1",
    "smpte-log-announce-interval": "-2",
    "g-8275-2-log-announce-interval": "0",
    "default-announce-receipt-timeout": "3",
    "dot1as-announce-receipt-timeout": "3",
    "aes67-announce-receipt-timeout": "3",
    "aes-r16-announce-receipt-timeout": "3",
    "smpte-announce-receipt-timeout": "3",
    "g-8275-1-announce-receipt-timeout": "3",
    "g-8275-2-announce-receipt-timeout": "3",
    "default-log-sync-interval": "0",
    "dot1as-log-sync-interval": "-3",
    "aes67-log-sync-interval": "-3",
    "smpte-log-sync-interval": "-3",
    "g-8275-2-log-sync-interval": "0",
    "sync-receipt-timeout": "3",
    "g-8275-1-sync-receipt-timeout": "5",
    "g-8275-2-sync-receipt-timeout": "5",
    "default-log-min-delay-req-interval": "0",
    "aes67-log-min-delay-req-interval": "0",
    "aes-r16-log-min-delay-req-interval": "0",
    "smpte-log-min-delay-req-interval": "-3",
    "default-log-min-pdelay-req-interval": "0",
    "dot1as-log-min-pdelay-req-interval": "0",
    "aes67-log-min-pdelay-req-interval": "0",
    "aes-r16-log-min-pdelay-req-interval": "0",
    "smpte-log-min-pdelay-req-interval": "-3",
    "g-8275-2-log-min-delay-req-interval": "0",
    "neighbor-prop-delay-threshold": "800",
    "vlan": [
      "<string>"
    ],
    "enable": "false",
    "peer-unicast-ip-address": [
      "<string>"
    ],
    "ip-dscp-event": "<integer>",
    "ip-dscp-general": "<integer>"
  },
  "name": "<string>",
  "port-list": [
    "<string>"
  ],
  "enable": "<boolean>",
  "description": "<string>",
  "jumbo-mtu": "false",
  "routing": "<boolean>",
  "vrf-forwarding": "<string>",
  "mac-notify-traps": [
    "MOVED"
  ],
  "trusted": "false",
  "trusted-vlans": [
    "<string>"
  ],
  "pvlan-port-mode": "PROMISCUOUS",
  "isolated-vlans": [
    "<integer>"
  ],
  "forbid-vlans": [
    "<integer>"
  ],
  "macsec-policy": "<string>",
  "mka-policy": "<string>",
  "vrrp": {
    "vrrp-profile-apply": "<string>"
  },
  "retain-port-profile-configs": "false",
  "sw-profile-alias": "<string>",
  "sw-profile": "<string>"
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

