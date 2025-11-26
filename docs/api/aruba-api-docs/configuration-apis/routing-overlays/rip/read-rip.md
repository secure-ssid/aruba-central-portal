# Read rip

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/rip`

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
          "ether-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "UNKNOWN",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V1_COMPATIBLE_V2",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "interface-name-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "UNKNOWN",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V1",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "interface-name-address-family": "<string>"
            }
          ],
          "lag-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV6",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1_V2",
              "send-type": "V1",
              "receive-type": "V1",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "MD5",
                "password": "<string>"
              },
              "lag-name-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV6",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V1",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "SIMPLE_TEXT",
                "password": "<string>"
              },
              "lag-name-address-family": "<string>"
            }
          ],
          "svi-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV6",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1_V2",
              "send-type": "V1",
              "receive-type": "V1_V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "svi-id-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV6",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1_V2",
              "send-type": "V1",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "SIMPLE_TEXT",
                "password": "<string>"
              },
              "svi-id-address-family": "<string>"
            }
          ],
          "loopback-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV4",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V1",
              "receive-type": "V1",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "loopback-id-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "UNKNOWN",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1",
              "send-type": "V2",
              "receive-type": "V1_V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "SIMPLE_TEXT",
                "password": "<string>"
              },
              "loopback-id-address-family": "<string>"
            }
          ],
          "instance-tag-vrf-proto-type": "<string>",
          "enable": "false",
          "maximum-paths": "4",
          "distance": "120",
          "default-metric": "1",
          "restrict": [
            "<string>",
            "<string>"
          ],
          "auto-summary": "true",
          "redistribute": [
            {
              "redistribute-id": "<integer>",
              "redistribute-type": "BGP",
              "ospf-id": "<integer>",
              "route-map": "<string>"
            },
            {
              "redistribute-id": "<integer>",
              "redistribute-type": "OSPF",
              "ospf-id": "<integer>",
              "route-map": "<string>"
            }
          ],
          "timers": {
            "update": "30",
            "timeout": "180",
            "garbage-collection": "120",
            "invalid-timer": "180",
            "flush": "120"
          },
          "infinity": "16",
          "vlan": "<integer>",
          "loopback": "<integer>"
        },
        {
          "ether-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "UNKNOWN",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V1",
              "receive-type": "V1_V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "interface-name-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV4",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V2",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "SIMPLE_TEXT",
                "password": "<string>"
              },
              "interface-name-address-family": "<string>"
            }
          ],
          "lag-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV4",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1",
              "send-type": "V1_COMPATIBLE_V2",
              "receive-type": "V1_V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "lag-name-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV6",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1",
              "send-type": "V1_COMPATIBLE_V2",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "MD5",
                "password": "<string>"
              },
              "lag-name-address-family": "<string>"
            }
          ],
          "svi-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV4",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1",
              "send-type": "V1_COMPATIBLE_V2",
              "receive-type": "V1",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "MD5",
                "password": "<string>"
              },
              "svi-id-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "UNKNOWN",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1",
              "send-type": "V2",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "SIMPLE_TEXT",
                "password": "<string>"
              },
              "svi-id-address-family": "<string>"
            }
          ],
          "loopback-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV6",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1",
              "send-type": "V1",
              "receive-type": "V1_V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "SIMPLE_TEXT",
                "password": "<string>"
              },
              "loopback-id-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "UNKNOWN",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V1_COMPATIBLE_V2",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "SIMPLE_TEXT",
                "password": "<string>"
              },
              "loopback-id-address-family": "<string>"
            }
          ],
          "instance-tag-vrf-proto-type": "<string>",
          "enable": "false",
          "maximum-paths": "4",
          "distance": "120",
          "default-metric": "1",
          "restrict": [
            "<string>",
            "<string>"
          ],
          "auto-summary": "true",
          "redistribute": [
            {
              "redistribute-id": "<integer>",
              "redistribute-type": "OSPFV3",
              "ospf-id": "<integer>",
              "route-map": "<string>"
            },
            {
              "redistribute-id": "<integer>",
              "redistribute-type": "STATIC_INCLUDE_ALL",
              "ospf-id": "<integer>",
              "route-map": "<string>"
            }
          ],
          "timers": {
            "update": "30",
            "timeout": "180",
            "garbage-collection": "120",
            "invalid-timer": "180",
            "flush": "120"
          },
          "infinity": "16",
          "vlan": "<integer>",
          "loopback": "<integer>"
        }
      ]
    },
    {
      "name": "<string>",
      "description": "<string>",
      "router": [
        {
          "ether-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV4",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V2",
              "receive-type": "V1",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "interface-name-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV6",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V1_COMPATIBLE_V2",
              "receive-type": "V1_V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "interface-name-address-family": "<string>"
            }
          ],
          "lag-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "UNKNOWN",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V2",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "SIMPLE_TEXT",
                "password": "<string>"
              },
              "lag-name-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV4",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1_V2",
              "send-type": "V1_COMPATIBLE_V2",
              "receive-type": "V1",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "MD5",
                "password": "<string>"
              },
              "lag-name-address-family": "<string>"
            }
          ],
          "svi-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "UNKNOWN",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1",
              "send-type": "V1",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "svi-id-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV6",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1_V2",
              "send-type": "V1_COMPATIBLE_V2",
              "receive-type": "V1",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "SIMPLE_TEXT",
                "password": "<string>"
              },
              "svi-id-address-family": "<string>"
            }
          ],
          "loopback-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "UNKNOWN",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1",
              "send-type": "V1_COMPATIBLE_V2",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "SIMPLE_TEXT",
                "password": "<string>"
              },
              "loopback-id-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "UNKNOWN",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1",
              "send-type": "V2",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "MD5",
                "password": "<string>"
              },
              "loopback-id-address-family": "<string>"
            }
          ],
          "instance-tag-vrf-proto-type": "<string>",
          "enable": "false",
          "maximum-paths": "4",
          "distance": "120",
          "default-metric": "1",
          "restrict": [
            "<string>",
            "<string>"
          ],
          "auto-summary": "true",
          "redistribute": [
            {
              "redistribute-id": "<integer>",
              "redistribute-type": "BGP",
              "ospf-id": "<integer>",
              "route-map": "<string>"
            },
            {
              "redistribute-id": "<integer>",
              "redistribute-type": "OSPFV3",
              "ospf-id": "<integer>",
              "route-map": "<string>"
            }
          ],
          "timers": {
            "update": "30",
            "timeout": "180",
            "garbage-collection": "120",
            "invalid-timer": "180",
            "flush": "120"
          },
          "infinity": "16",
          "vlan": "<integer>",
          "loopback": "<integer>"
        },
        {
          "ether-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV4",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1_V2",
              "send-type": "V1",
              "receive-type": "V1",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "interface-name-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV6",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1_V2",
              "send-type": "V1",
              "receive-type": "V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "interface-name-address-family": "<string>"
            }
          ],
          "lag-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "UNKNOWN",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1",
              "send-type": "V2",
              "receive-type": "V1_V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "lag-name-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "UNKNOWN",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V1",
              "receive-type": "V1",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "MD5",
                "password": "<string>"
              },
              "lag-name-address-family": "<string>"
            }
          ],
          "svi-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV4",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V2",
              "receive-type": "V1",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "svi-id-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV4",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V1",
              "receive-type": "V1_V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "NONE",
                "password": "<string>"
              },
              "svi-id-address-family": "<string>"
            }
          ],
          "loopback-interfaces": [
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV6",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V2",
              "send-type": "V1_COMPATIBLE_V2",
              "receive-type": "V1_V2",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "SIMPLE_TEXT",
                "password": "<string>"
              },
              "loopback-id-address-family": "<string>"
            },
            {
              "interface-name": "<string>",
              "lag-name": "<string>",
              "svi-id": "<integer>",
              "loopback-id": "<integer>",
              "address-family": "IPV4",
              "ip-address": "<string>",
              "all-ip": "false",
              "enable": "false",
              "send-disable": "false",
              "receive-disable": "false",
              "all-ip-enable": "false",
              "all-ip-send-disable": "false",
              "all-ip-receive-disable": "false",
              "passive": "false",
              "split-horizon": "true",
              "poison-reverse": "true",
              "triggered": "false",
              "version": "V1",
              "send-type": "V2",
              "receive-type": "V1",
              "metric": "1",
              "timers": {
                "update": "30",
                "timeout": "180",
                "garbage-collection": "120",
                "invalid-timer": "180",
                "flush": "120"
              },
              "authentication": {
                "mode": "SIMPLE_TEXT",
                "password": "<string>"
              },
              "loopback-id-address-family": "<string>"
            }
          ],
          "instance-tag-vrf-proto-type": "<string>",
          "enable": "false",
          "maximum-paths": "4",
          "distance": "120",
          "default-metric": "1",
          "restrict": [
            "<string>",
            "<string>"
          ],
          "auto-summary": "true",
          "redistribute": [
            {
              "redistribute-id": "<integer>",
              "redistribute-type": "CONNECTED",
              "ospf-id": "<integer>",
              "route-map": "<string>"
            },
            {
              "redistribute-id": "<integer>",
              "redistribute-type": "STATIC",
              "ospf-id": "<integer>",
              "route-map": "<string>"
            }
          ],
          "timers": {
            "update": "30",
            "timeout": "180",
            "garbage-collection": "120",
            "invalid-timer": "180",
            "flush": "120"
          },
          "infinity": "16",
          "vlan": "<integer>",
          "loopback": "<integer>"
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

