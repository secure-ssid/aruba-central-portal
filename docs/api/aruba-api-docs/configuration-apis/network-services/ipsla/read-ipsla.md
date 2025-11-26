# Read ipsla

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/ipsla`

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
      "responder-sessions": [
        {
          "responder-port": "<integer>",
          "responder-type": "RESP_UDP_JITTER",
          "responder-name": "<string>",
          "responder-ipv4-address": "<string>",
          "responder-vrf": "<string>",
          "ipv6-responder-enable": "<boolean>",
          "responder-source": {
            "ipv4-address": "<string>",
            "ipv6-address": "<string>",
            "interface-ethernet": "<string>",
            "interface-portchannel": "<string>",
            "interface-vlan": "<integer>",
            "interface-loopback": "<integer>",
            "interface-tunnel": "<integer>",
            "interface-subinterface": "<string>"
          }
        },
        {
          "responder-port": "<integer>",
          "responder-type": "RESP_UDP_ECHO",
          "responder-name": "<string>",
          "responder-ipv4-address": "<string>",
          "responder-vrf": "<string>",
          "ipv6-responder-enable": "<boolean>",
          "responder-source": {
            "ipv4-address": "<string>",
            "ipv6-address": "<string>",
            "interface-ethernet": "<string>",
            "interface-portchannel": "<string>",
            "interface-vlan": "<integer>",
            "interface-loopback": "<integer>",
            "interface-tunnel": "<integer>",
            "interface-subinterface": "<string>"
          }
        }
      ],
      "source-sessions": [
        {
          "http": {
            "request-type": "GET",
            "url": "<string>",
            "cache-enable": "<boolean>",
            "raw-payload": "<string>",
            "proxy-url": "<string>",
            "version": "HTTP_1_0"
          },
          "schedule": {
            "start": "NOW",
            "start-value": "<string>",
            "stop": "REPEAT",
            "repetitions": "<long>",
            "stop-value": "<string>"
          },
          "thresholds": [
            {
              "metric-type": "SD_JITTER_POS",
              "upper-limit": "<long>",
              "lower-limit": "<long>",
              "type": "IMMEDIATE",
              "count": "<long>",
              "action": "LOG"
            },
            {
              "metric-type": "PACKET_LOSS",
              "upper-limit": "<long>",
              "lower-limit": "<long>",
              "type": "IMMEDIATE",
              "count": "<long>",
              "action": "LOG"
            }
          ],
          "voip": {
            "advantage-factor": "<long>",
            "codec-type": "G_729A"
          },
          "source-name": "<string>",
          "vrf": "<string>",
          "enable": "<boolean>",
          "type": "TCP_CONNECT",
          "history-size": "<long>",
          "payload-size": "<long>",
          "tos": "<long>",
          "frequency": "<long>",
          "destination-ipv4": "<string>",
          "destination-ipv6": "<string>",
          "destination-port": "<integer>",
          "destination-hostname": "<string>",
          "domain-name-server-ipv4": "<string>",
          "domain-name-server-ipv6": "<string>",
          "num-of-packets": "<long>",
          "packet-interval": "<long>",
          "source": {
            "ipv4-address": "<string>",
            "ipv6-address": "<string>",
            "interface-ethernet": "<string>",
            "interface-portchannel": "<string>",
            "interface-vlan": "<integer>",
            "interface-loopback": "<integer>",
            "interface-tunnel": "<integer>",
            "interface-subinterface": "<string>",
            "port": "<integer>"
          }
        },
        {
          "http": {
            "request-type": "GET",
            "url": "<string>",
            "cache-enable": "<boolean>",
            "raw-payload": "<string>",
            "proxy-url": "<string>",
            "version": "HTTP_1_1"
          },
          "schedule": {
            "start": "START_TIME",
            "start-value": "<string>",
            "stop": "REPEAT",
            "repetitions": "<long>",
            "stop-value": "<string>"
          },
          "thresholds": [
            {
              "metric-type": "TEST_COMPLETION",
              "upper-limit": "<long>",
              "lower-limit": "<long>",
              "type": "AGGREGATED",
              "count": "<long>",
              "action": "NONE"
            },
            {
              "metric-type": "SD_JITTER_POS",
              "upper-limit": "<long>",
              "lower-limit": "<long>",
              "type": "CONSECUTIVE",
              "count": "<long>",
              "action": "LOG"
            }
          ],
          "voip": {
            "advantage-factor": "<long>",
            "codec-type": "G_729A"
          },
          "source-name": "<string>",
          "vrf": "<string>",
          "enable": "<boolean>",
          "type": "ICMP_ECHO",
          "history-size": "<long>",
          "payload-size": "<long>",
          "tos": "<long>",
          "frequency": "<long>",
          "destination-ipv4": "<string>",
          "destination-ipv6": "<string>",
          "destination-port": "<integer>",
          "destination-hostname": "<string>",
          "domain-name-server-ipv4": "<string>",
          "domain-name-server-ipv6": "<string>",
          "num-of-packets": "<long>",
          "packet-interval": "<long>",
          "source": {
            "ipv4-address": "<string>",
            "ipv6-address": "<string>",
            "interface-ethernet": "<string>",
            "interface-portchannel": "<string>",
            "interface-vlan": "<integer>",
            "interface-loopback": "<integer>",
            "interface-tunnel": "<integer>",
            "interface-subinterface": "<string>",
            "port": "<integer>"
          }
        }
      ],
      "wan": {
        "sla-destination": "SLA_DESTINATION_TUNNEL",
        "probe-mode": "HTTPS",
        "probe-destination": {
          "destination-type": "SLA_DEST_FQDN",
          "ip": "<string>",
          "uri": "<string>"
        },
        "sla-behavior": "SLA_BEHAVIOR_PERFORMANCE",
        "latency": "<integer>",
        "packet-loss": "<integer>"
      },
      "name": "<string>",
      "description": "<string>"
    },
    {
      "responder-sessions": [
        {
          "responder-port": "<integer>",
          "responder-type": "RESP_UDP_ECHO",
          "responder-name": "<string>",
          "responder-ipv4-address": "<string>",
          "responder-vrf": "<string>",
          "ipv6-responder-enable": "<boolean>",
          "responder-source": {
            "ipv4-address": "<string>",
            "ipv6-address": "<string>",
            "interface-ethernet": "<string>",
            "interface-portchannel": "<string>",
            "interface-vlan": "<integer>",
            "interface-loopback": "<integer>",
            "interface-tunnel": "<integer>",
            "interface-subinterface": "<string>"
          }
        },
        {
          "responder-port": "<integer>",
          "responder-type": "RESP_TCP_CONNECT",
          "responder-name": "<string>",
          "responder-ipv4-address": "<string>",
          "responder-vrf": "<string>",
          "ipv6-responder-enable": "<boolean>",
          "responder-source": {
            "ipv4-address": "<string>",
            "ipv6-address": "<string>",
            "interface-ethernet": "<string>",
            "interface-portchannel": "<string>",
            "interface-vlan": "<integer>",
            "interface-loopback": "<integer>",
            "interface-tunnel": "<integer>",
            "interface-subinterface": "<string>"
          }
        }
      ],
      "source-sessions": [
        {
          "http": {
            "request-type": "GET",
            "url": "<string>",
            "cache-enable": "<boolean>",
            "raw-payload": "<string>",
            "proxy-url": "<string>",
            "version": "HTTP_1_1"
          },
          "schedule": {
            "start": "START_TIME",
            "start-value": "<string>",
            "stop": "STOP_TIME",
            "repetitions": "<long>",
            "stop-value": "<string>"
          },
          "thresholds": [
            {
              "metric-type": "RTT",
              "upper-limit": "<long>",
              "lower-limit": "<long>",
              "type": "IMMEDIATE",
              "count": "<long>",
              "action": "NONE"
            },
            {
              "metric-type": "DST_TO_SRC_TIME",
              "upper-limit": "<long>",
              "lower-limit": "<long>",
              "type": "AGGREGATED",
              "count": "<long>",
              "action": "LOG"
            }
          ],
          "voip": {
            "advantage-factor": "<long>",
            "codec-type": "G_711U"
          },
          "source-name": "<string>",
          "vrf": "<string>",
          "enable": "<boolean>",
          "type": "HTTPS",
          "history-size": "<long>",
          "payload-size": "<long>",
          "tos": "<long>",
          "frequency": "<long>",
          "destination-ipv4": "<string>",
          "destination-ipv6": "<string>",
          "destination-port": "<integer>",
          "destination-hostname": "<string>",
          "domain-name-server-ipv4": "<string>",
          "domain-name-server-ipv6": "<string>",
          "num-of-packets": "<long>",
          "packet-interval": "<long>",
          "source": {
            "ipv4-address": "<string>",
            "ipv6-address": "<string>",
            "interface-ethernet": "<string>",
            "interface-portchannel": "<string>",
            "interface-vlan": "<integer>",
            "interface-loopback": "<integer>",
            "interface-tunnel": "<integer>",
            "interface-subinterface": "<string>",
            "port": "<integer>"
          }
        },
        {
          "http": {
            "request-type": "RAW",
            "url": "<string>",
            "cache-enable": "<boolean>",
            "raw-payload": "<string>",
            "proxy-url": "<string>",
            "version": "HTTP_1_1"
          },
          "schedule": {
            "start": "NOW",
            "start-value": "<string>",
            "stop": "STOP_TIME",
            "repetitions": "<long>",
            "stop-value": "<string>"
          },
          "thresholds": [
            {
              "metric-type": "MOS",
              "upper-limit": "<long>",
              "lower-limit": "<long>",
              "type": "CONSECUTIVE",
              "count": "<long>",
              "action": "NONE"
            },
            {
              "metric-type": "SRC_TO_DST_TIME",
              "upper-limit": "<long>",
              "lower-limit": "<long>",
              "type": "AGGREGATED",
              "count": "<long>",
              "action": "NONE"
            }
          ],
          "voip": {
            "advantage-factor": "<long>",
            "codec-type": "G_729A"
          },
          "source-name": "<string>",
          "vrf": "<string>",
          "enable": "<boolean>",
          "type": "DHCP",
          "history-size": "<long>",
          "payload-size": "<long>",
          "tos": "<long>",
          "frequency": "<long>",
          "destination-ipv4": "<string>",
          "destination-ipv6": "<string>",
          "destination-port": "<integer>",
          "destination-hostname": "<string>",
          "domain-name-server-ipv4": "<string>",
          "domain-name-server-ipv6": "<string>",
          "num-of-packets": "<long>",
          "packet-interval": "<long>",
          "source": {
            "ipv4-address": "<string>",
            "ipv6-address": "<string>",
            "interface-ethernet": "<string>",
            "interface-portchannel": "<string>",
            "interface-vlan": "<integer>",
            "interface-loopback": "<integer>",
            "interface-tunnel": "<integer>",
            "interface-subinterface": "<string>",
            "port": "<integer>"
          }
        }
      ],
      "wan": {
        "sla-destination": "SLA_DESTINATION_MANUAL",
        "probe-mode": "UDP_JITTER",
        "probe-destination": {
          "destination-type": "SLA_DEST_FQDN",
          "ip": "<string>",
          "uri": "<string>"
        },
        "sla-behavior": "SLA_BEHAVIOR_LIVENESS",
        "latency": "<integer>",
        "packet-loss": "<integer>"
      },
      "name": "<string>",
      "description": "<string>"
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

