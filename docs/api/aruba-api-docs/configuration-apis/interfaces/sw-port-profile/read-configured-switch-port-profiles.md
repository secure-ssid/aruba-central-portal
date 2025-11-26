# Read configured switch port profiles

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/sw-port-profiles`

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
      "dhcpv4-snooping": {
        "max-bindings": "<integer>",
        "trust": "false"
      },
      "dhcpv6-snooping": {
        "max-bindings": "<integer>",
        "trust": "false",
        "guard-policy": "<string>"
      },
      "dynamic-arp-inspection": {
        "trust": "false"
      },
      "mode": "DISABLE",
      "connect-to-network-device": "false",
      "client-limit-max": "128",
      "update-interval": "1800",
      "flow-control-mode": "PRIORITY_FLOW_CONTROL",
      "pfc-watchdog": "false",
      "llfc-flow-control": {
        "direction": "TX",
        "override-negotiation": "<boolean>",
        "llfc-pool-id": "<long>"
      },
      "priority-flow-control": {
        "priority-config": [
          {
            "direction": "NONE",
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
      "cable-length": "<long>",
      "link-flap": {
        "action": "NOTIFY",
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
        "l3-counters": "TX"
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
          }
        ],
        "autoconfig": "false",
        "link-local": "<string>",
        "enable-default-link-local": "false",
        "dhcps-profile-name": "<string>"
      },
      "lacp": {
        "mode": "AUTO",
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
        "mode": "RX_ONLY"
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
        "qinq-port-type": "CUSTOMER_NETWORK"
      },
      "vsx": {
        "shutdown-on-split": "false"
      },
      "qos": {
        "cos": "<integer>",
        "dscp": "<integer>",
        "max-rate-units": "PPS",
        "egress-rate": "<long>",
        "burst": "<integer>",
        "trust": "DEVICE_NONE",
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
          "rate-type": "PPS",
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
          "rate-type": "PPS",
          "bit-rate": "<long>",
          "percentage": "<long>",
          "packet-rate": "<long>"
        },
        "icmp-rate-limit": {
          "rate-type": "MBPS",
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
        "link-type": "SHARED",
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
      "profile-name": "<string>",
      "description": "<string>",
      "aaa-profile": "<string>",
      "port-security-policy": "<string>",
      "dhcp-snooping-profile": "<string>",
      "nd-snooping-profile": "<string>",
      "ip-source-lockdown-profile": "<string>",
      "dynamic-arp-inspection-profile": "<string>",
      "client-iptracker-profile": "<string>",
      "dfp-profile": "<string>",
      "poe": {
        "enabled": "<boolean>",
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
      "lldp": {
        "mode": "DISABLE",
        "enable-notification": "<boolean>",
        "top-change-notify": "<boolean>",
        "trap": "<boolean>",
        "med-poe-priority-override": "false",
        "dcbx-disable": "false",
        "dcbx-version": "IEEE",
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
          }
        }
      },
      "isolated-vlans": [
        "<integer>"
      ],
      "forbid-vlans": [
        "<integer>"
      ],
      "lag": {
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
        }
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

