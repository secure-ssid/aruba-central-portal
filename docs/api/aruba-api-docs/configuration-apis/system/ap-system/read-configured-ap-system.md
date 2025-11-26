# Read configured ap system

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/ap-system`

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
      "gps": {
        "state": "AUTO",
        "dynamic-model": "STATIONARY",
        "sampling-interval": "10",
        "height": "0",
        "min-samples": "30",
        "max-samples": "100",
        "retry": "false",
        "ellipse-report-interval": "360",
        "enable": "false",
        "indoor-sp-location": "false",
        "max-relay-distance": "500"
      },
      "lci": {
        "location": {
          "latitude": "0",
          "longitude": "0",
          "altitude-type": "METERS",
          "altitude": "0",
          "datum": "NAD83_NAVD88_3"
        },
        "uncertainty": {
          "latitude": "0",
          "longitude": "0",
          "altitude": "0"
        },
        "floor": {
          "move": "EXPECT_TO_MOVE",
          "number": "<string>",
          "height": "<string>",
          "uncertainty": "<string>"
        }
      },
      "barometer": {
        "enable": "true"
      },
      "name": "<string>",
      "description": "<string>",
      "timezone": {
        "name": "none",
        "hour-offset": "0",
        "minute-offset": "0"
      },
      "summer-time": {
        "timezone": "<string>",
        "start-week": "FOURTH",
        "start-day": "friday",
        "start-month": "january",
        "start-hour": "<string>",
        "end-week": "FOURTH",
        "end-day": "everyday",
        "end-month": "october",
        "end-hour": "<string>"
      },
      "location": "<string>",
      "led": "true",
      "led-override": "false",
      "country-code": "<string>",
      "virtual-controller-name": "<string>",
      "virtual-controller-ip": "<string>",
      "virtual-controller-ipv6": "<string>",
      "virtual-controller-vlan": {
        "vlan": "<integer>",
        "mask": "<string>",
        "gateway": "<string>"
      },
      "virtual-controller-dnsip": "<string>",
      "allow-new-aps": "<boolean>",
      "country-code-alias": "<string>",
      "vc-name-alias": "<string>",
      "vc-ip-alias": "<string>",
      "vc-ipv6-alias": "<string>",
      "vc-vlan-alias": "<string>",
      "vc-dnsip-alias": "<string>",
      "allow-new-aps-alias": "<string>",
      "allowed-ap": [
        "<string>",
        "<string>"
      ],
      "swarm-mode": {
        "mode": "STANDALONE",
        "reboot": "<boolean>"
      },
      "conductor": "<boolean>",
      "restricted-access": [
        {
          "subnet": "<string>",
          "subnet-mask": "<string>"
        },
        {
          "subnet": "<string>",
          "subnet-mask": "<string>"
        }
      ],
      "extended-ssid": "true",
      "mas-integration": "<boolean>",
      "itm": "false",
      "dynamic-cpu-mgmt": "AUTO",
      "disable-factory-reset": "false",
      "firsthop-security": "false",
      "drt-upgrade-disable": "false",
      "usb-port-disable": "false",
      "usb-power-override": "false",
      "poe-power-optimization-enable": "false",
      "application-monitoring": "false",
      "airslice-policy": "false",
      "mtu": "1300",
      "dhcp-option82-xml": "DEFAULT_DHCPOPT82_2_XML",
      "dhcp-option82-xml-vlan-list": "<string>",
      "out-of-service-hold-on-time": "30",
      "lacp": "AUTO",
      "enet-vlan": "<integer>",
      "advertise-location": "false",
      "voip-qos-trusted": "false",
      "deny-local-routing": "false",
      "ip-mode": "IPV4_ONLY",
      "aaa": {
        "aaa-dns-query-interval": "15",
        "dot1x-eap-frag-mtu": "<long>",
        "auth-failure-denylist-time": "3600",
        "rfc-3576-server-udp-port": "3799",
        "wlan-wpa3-dh-groups": "DIFFIE_HELLMAN_GRP_19",
        "denylist-time": "3600",
        "preference-of-san-over-cn": "false",
        "onboard-event-connection-record": "true",
        "pmk-cache-timeout": "8",
        "max-pmk-cache-threshold": "<long>",
        "auth-survivability-cachetime": "24",
        "radius-termination-action": "false",
        "dynamic-radius-proxy": "false",
        "dynamic-tacacs-proxy": "false"
      },
      "module": [
        {
          "type-process-subcategory": "<string>",
          "severity": "NOTICE"
        },
        {
          "type-process-subcategory": "<string>",
          "severity": "MAJOR"
        }
      ],
      "cluster-security": {
        "dtls": "<boolean>",
        "allow-low-assurance-devices": "<boolean>",
        "allow-non-dtls-members": "true"
      },
      "zonename": [
        "<string>",
        "<string>"
      ],
      "advanced-zone": "false",
      "tx-blanking": "true",
      "recovery-ssid-backoff-time": "3",
      "content-filtering": "false",
      "advertise-ap-health-ie": "true"
    },
    {
      "gps": {
        "state": "AUTO",
        "dynamic-model": "STATIONARY",
        "sampling-interval": "10",
        "height": "0",
        "min-samples": "30",
        "max-samples": "100",
        "retry": "false",
        "ellipse-report-interval": "360",
        "enable": "false",
        "indoor-sp-location": "false",
        "max-relay-distance": "500"
      },
      "lci": {
        "location": {
          "latitude": "0",
          "longitude": "0",
          "altitude-type": "FLOORS",
          "altitude": "0",
          "datum": "NAD83_MLLW"
        },
        "uncertainty": {
          "latitude": "0",
          "longitude": "0",
          "altitude": "0"
        },
        "floor": {
          "move": "UNKNOWN",
          "number": "<string>",
          "height": "<string>",
          "uncertainty": "<string>"
        }
      },
      "barometer": {
        "enable": "true"
      },
      "name": "<string>",
      "description": "<string>",
      "timezone": {
        "name": "none",
        "hour-offset": "0",
        "minute-offset": "0"
      },
      "summer-time": {
        "timezone": "<string>",
        "start-week": "SECOND",
        "start-day": "wednesday",
        "start-month": "february",
        "start-hour": "<string>",
        "end-week": "THIRD",
        "end-day": "monday",
        "end-month": "september",
        "end-hour": "<string>"
      },
      "location": "<string>",
      "led": "true",
      "led-override": "false",
      "country-code": "<string>",
      "virtual-controller-name": "<string>",
      "virtual-controller-ip": "<string>",
      "virtual-controller-ipv6": "<string>",
      "virtual-controller-vlan": {
        "vlan": "<integer>",
        "mask": "<string>",
        "gateway": "<string>"
      },
      "virtual-controller-dnsip": "<string>",
      "allow-new-aps": "<boolean>",
      "country-code-alias": "<string>",
      "vc-name-alias": "<string>",
      "vc-ip-alias": "<string>",
      "vc-ipv6-alias": "<string>",
      "vc-vlan-alias": "<string>",
      "vc-dnsip-alias": "<string>",
      "allow-new-aps-alias": "<string>",
      "allowed-ap": [
        "<string>",
        "<string>"
      ],
      "swarm-mode": {
        "mode": "CLUSTER",
        "reboot": "<boolean>"
      },
      "conductor": "<boolean>",
      "restricted-access": [
        {
          "subnet": "<string>",
          "subnet-mask": "<string>"
        },
        {
          "subnet": "<string>",
          "subnet-mask": "<string>"
        }
      ],
      "extended-ssid": "true",
      "mas-integration": "<boolean>",
      "itm": "false",
      "dynamic-cpu-mgmt": "AUTO",
      "disable-factory-reset": "false",
      "firsthop-security": "false",
      "drt-upgrade-disable": "false",
      "usb-port-disable": "false",
      "usb-power-override": "false",
      "poe-power-optimization-enable": "false",
      "application-monitoring": "false",
      "airslice-policy": "false",
      "mtu": "1300",
      "dhcp-option82-xml": "DEFAULT_DHCPOPT82_2_XML",
      "dhcp-option82-xml-vlan-list": "<string>",
      "out-of-service-hold-on-time": "30",
      "lacp": "AUTO",
      "enet-vlan": "<integer>",
      "advertise-location": "false",
      "voip-qos-trusted": "false",
      "deny-local-routing": "false",
      "ip-mode": "IPV4_PREFER",
      "aaa": {
        "aaa-dns-query-interval": "15",
        "dot1x-eap-frag-mtu": "<long>",
        "auth-failure-denylist-time": "3600",
        "rfc-3576-server-udp-port": "3799",
        "wlan-wpa3-dh-groups": "DIFFIE_HELLMAN_GRP_19",
        "denylist-time": "3600",
        "preference-of-san-over-cn": "false",
        "onboard-event-connection-record": "true",
        "pmk-cache-timeout": "8",
        "max-pmk-cache-threshold": "<long>",
        "auth-survivability-cachetime": "24",
        "radius-termination-action": "false",
        "dynamic-radius-proxy": "false",
        "dynamic-tacacs-proxy": "false"
      },
      "module": [
        {
          "type-process-subcategory": "<string>",
          "severity": "NOTICE"
        },
        {
          "type-process-subcategory": "<string>",
          "severity": "WARNING"
        }
      ],
      "cluster-security": {
        "dtls": "<boolean>",
        "allow-low-assurance-devices": "<boolean>",
        "allow-non-dtls-members": "true"
      },
      "zonename": [
        "<string>",
        "<string>"
      ],
      "advanced-zone": "false",
      "tx-blanking": "true",
      "recovery-ssid-backoff-time": "3",
      "content-filtering": "false",
      "advertise-ap-health-ie": "true"
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

