# Read interface configurations

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/ethernet-interfaces/:name`

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
  "ptp-lag-role": "SECONDARY",
  "poe": {
    "enabled": "<boolean>",
    "poe-cisco": "false",
    "value": "<integer>",
    "lldp-detect": "<boolean>",
    "allocation-method": "USAGE",
    "priority": "LOW",
    "assigned-class": "<integer>",
    "pd-class-override": "false",
    "pre-std-detect": "false",
    "power-pairs": "ALT_A_AND_B",
    "cycle-timeout": "0"
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
  "split-port-enable": "false",
  "split-port-count": "4",
  "split-port-speed": "PORT_100G",
  "app-aaa-contract": {
    "app": [
      {
        "appname": "banggood",
        "bwc-name": "<string>",
        "direction": "UPSTREAM"
      }
    ]
  },
  "app-category-aaa-contract": {
    "app-category": [
      {
        "category-name": "IM-FILE-TRANSFER",
        "bwc-name": "<string>",
        "direction": "DOWNSTREAM"
      }
    ]
  },
  "exclude-app-contract": {
    "exclude-app": [
      {
        "exclude-app-name": "unassigned-ip-prot-247"
      }
    ]
  },
  "exclude-app-cat-contract": {
    "exclude-app-category": [
      {
        "exclude-app-category-name": "MOBILE-APP-STORE"
      }
    ]
  },
  "aaa-bw-contract": {
    "bw-contract": [
      {
        "bwc-name": "<string>",
        "direction": "UPSTREAM",
        "association": "PER_USER"
      }
    ]
  },
  "lldp": {
    "tlv": {
      "basic": {
        "port-descr": "<boolean>",
        "system-name": "<boolean>",
        "system-descr": "<boolean>",
        "system-cap": "<boolean>",
        "management-addr": "<boolean>"
      },
      "dot1": {
        "port-vlan-id": "<boolean>",
        "port-vlan-name": "<boolean>"
      },
      "dot3tlv": {
        "mac-phy": "<boolean>",
        "poe-plus": "<boolean>",
        "eee": "<boolean>",
        "mfs": "<boolean>"
      },
      "med": {
        "capabilities": "<boolean>",
        "network-policy": "<boolean>",
        "location-id": "<boolean>",
        "poe": "<boolean>"
      },
      "civic-addr": {
        "country-code": "<string>",
        "what": "<integer>",
        "ca-pair": [
          {
            "ca-type": "<integer>",
            "ca-value": "<string>"
          }
        ]
      },
      "host-ipv4-address": "<string>",
      "host-ipv6-address": "<string>"
    }
  },
  "flow-control-mode": "LINK_LEVEL_FLOW_CONTROL",
  "pfc-watchdog": "false",
  "llfc-flow-control": {
    "direction": "NONE",
    "override-negotiation": "<boolean>",
    "llfc-pool-id": "<long>"
  },
  "priority-flow-control": {
    "priority-config": [
      {
        "direction": "TX",
        "priority": "<integer>"
      }
    ]
  },
  "lossless-buffer-based-link-level-flow-control": {
    "xoff-dynamic-threshold-alpha": "<integer>",
    "xoff-static-threshold": "<long>",
    "xon-delta": "<long>",
    "headroom": "<long>"
  },
  "lossless-buffer-based-priority-flow-control": {
    "thresholds": [
      {
        "xoff-dynamic-threshold-alpha": "<integer>",
        "xoff-static-threshold": "<long>",
        "xon-delta": "<long>",
        "headroom": "<long>",
        "priority": "<integer>"
      }
    ]
  },
  "cable-length": "AUTO",
  "link-flap": {
    "action": "NOTIFY_AND_DISABLE",
    "auto-enable": "<long>"
  },
  "excessive-broadcasts": {
    "action": "NOTIFY_AND_DISABLE",
    "auto-enable": "<long>",
    "threshold-units": "PERCENT",
    "threshold-percent": "<integer>",
    "threshold-rate": "<long>"
  },
  "excessive-multicasts": {
    "action": "NOTIFY",
    "auto-enable": "<long>",
    "threshold-units": "PPS",
    "threshold-percent": "<integer>",
    "threshold-rate": "<long>"
  },
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
  "vlan-translate": [
    {
      "origin": "<integer>",
      "translated": "<integer>"
    }
  ],
  "ip": {
    "mtu": "1500",
    "l3-counters": "RX"
  },
  "ipv4": {
    "address": "<string>",
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
        "address": "DHCP_FULL_RAPID_COMMIT",
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
  "lacp": {
    "mode": "ACTIVE",
    "key": "<integer>",
    "port-id": "<integer>",
    "port-priority": "1",
    "timeout": "LONG"
  },
  "mpls": "false",
  "hello-holdtime": "<integer>",
  "session-holdtime": "<integer>",
  "cdp": {
    "enable": "true",
    "mode": "TX_RX"
  },
  "ip-directed-broadcast-enable": "false",
  "sflow": {
    "enable": "false"
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
  "vsx": {
    "shutdown-on-split": "false"
  },
  "qos": {
    "cos": "<integer>",
    "dscp": "<integer>",
    "max-rate-units": "KBPS",
    "egress-rate": "<long>",
    "burst": "<integer>",
    "trust": "DSCP",
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
      "rate-type": "MBPS",
      "bit-rate": "<long>",
      "percentage": "<long>",
      "packet-rate": "<long>"
    },
    "multicast-rate-limit": {
      "rate-type": "MBPS",
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
      "rate-type": "PERCENT",
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
  "ipv4-relay": {
    "bootp-gateway": "<string>",
    "server": [
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
  "ipfix-flow-monitor-in": {
    "ipv4-monitor": "<string>",
    "ipv6-monitor": "<string>"
  },
  "igmp-snooping-eth": {
    "fast-leave-vlan": [
      "<integer>"
    ],
    "forced-fast-leave-vlan": [
      "<integer>"
    ],
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
  "mld-snooping-eth": {
    "fast-leave-vlan": [
      "<integer>"
    ],
    "forced-fast-leave-vlan": [
      "<integer>"
    ],
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
  "pim-bidir": {
    "bidir-enable": "false",
    "hello-interval": "30",
    "hello-delay": "5",
    "lan-prune-delay": "true",
    "override-interval": "2500",
    "propagation-delay": "500"
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
    "link-type": "POINT_TO_POINT_FALSE",
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
        "instance-id": "<integer>"
      }
    ]
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
  "profile-name": "<string>",
  "client-limit": "<integer>",
  "incoming-clients-only": "false",
  "mode": "DISABLE",
  "connect-to-network-device": "false",
  "client-limit-max": "128",
  "update-interval": "1800",
  "dynamic-arp-inspection": {
    "trust": "false"
  },
  "urpf": {
    "ipv4-enable": "DISABLE"
  },
  "aaa": {
    "security-violation": {
      "action": "SHUTDOWN",
      "shutdown-recovery-enable": "false",
      "recovery-timer": "10"
    }
  },
  "port-security": {
    "enable": "false",
    "client-limit": "1",
    "eavesdrop-prevention": "true",
    "learn-mode": "LIMITED_CONTINUOUS",
    "sticky-mac-enable": "false",
    "macs": [
      "<string>"
    ],
    "sticky-macs": [
      {
        "mac": "<string>",
        "vlan": "1"
      }
    ]
  },
  "name": "<string>",
  "description": "<string>",
  "speed": "SPEED_AUTO",
  "port-type": "WAN",
  "trusted": "<boolean>",
  "speed-mode": "INTERFACE_40G",
  "retain-profile-configs": "false",
  "sw-profile": "<string>",
  "gw-profile": "<string>",
  "ap-profile": "<string>",
  "br-profile": "<string>",
  "portchannel-lag": "<string>",
  "alternate-linkup": "false",
  "tunneled-node-port": "false",
  "duplex": "HALF_DUPLEX",
  "jumbo-mtu": "false",
  "isolated-vlans": [
    "<integer>"
  ],
  "forbid-vlans": [
    "<integer>"
  ],
  "port-monitor": {
    "enable": "<boolean>",
    "src-interface-type": "GIGABIT_ETHERNET",
    "src-interface-id": "<string>"
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

