# Create a new WLAN SSID profile by unique name

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-config/v1alpha1/wlan-ssids/:ssid`

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
  "dmo": {
    "enable": "false",
    "channel-utilization-threshold": "90",
    "clients-threshold": "6"
  },
  "broadcast-filter-ipv4": "BCAST_FILTER_ARP",
  "broadcast-filter-ipv6": "FILTER_NONE",
  "local-proxy-ns": "false",
  "optimize-mcast-rate": "false",
  "ssid-utf8": "false",
  "essid": {
    "use-alias": "false",
    "alias": "<string>",
    "name": "<string>"
  },
  "advertise-location": "false",
  "advertise-apname": "false",
  "allowed-5ghz-radio": "ALL_5G",
  "cdc": "false",
  "disable-on-6ghz-mesh": "false",
  "dot11k": "false",
  "dot11k-profile-name": "<string>",
  "dot11r": "false",
  "auth-failure-code": "DYNAMIC",
  "dot11r-key-duration": "3600",
  "dot11r-ondemand-keyfetch": "true",
  "dtim-period": "1",
  "ftm-responder": "false",
  "hide-ssid": "false",
  "short-preamble": "true",
  "auth-req-thresh": "0",
  "explicit-ageout-client": "false",
  "inactivity-timeout": "1000",
  "local-probe-req-thresh": "0",
  "max-clients-threshold": "64",
  "max-retries": "4",
  "mbo": "false",
  "mobility-domain-id": "<long>",
  "mfp-capable": "false",
  "mfp-required": "false",
  "qbss-load": "false",
  "rf-band": "24GHZ_5GHZ",
  "refresh-direction": "RX_TX",
  "rrm-quiet-ie": "false",
  "rts-threshold": "2333",
  "high-throughput": {
    "enable": "true",
    "ba-amsdu": "true",
    "ldpc": "true",
    "mpdu-agg": "true",
    "rx-ampdu-agg": "true",
    "short-guard-intvl-20MHz": "true",
    "short-guard-intvl-40MHz": "true",
    "short-guard-intvl-80MHz": "true",
    "stbc-rx-streams": "1",
    "stbc-tx-streams": "1",
    "supported-mcs-set": [
      "<integer>"
    ],
    "temporal-diversity": "false",
    "very-high-throughput": "true",
    "vht-mu-txbf": "true",
    "vht-supported-mcs-map": "<string>",
    "vht-txbf-explicit": "true"
  },
  "g-legacy-rates": {
    "basic-rates": [
      "RATE_36MB"
    ],
    "beacon-rate": "RATE_18MB",
    "max-tx-rate": "RATE_5DOT5MB",
    "min-tx-rate": "RATE_18MB",
    "tx-rates": [
      "RATE_5DOT5MB"
    ]
  },
  "a-legacy-rates": {
    "basic-rates": [
      "RATE_6MB"
    ],
    "beacon-rate": "RATE_12MB",
    "max-tx-rate": "RATE_9MB",
    "min-tx-rate": "RATE_36MB",
    "tx-rates": [
      "RATE_12MB"
    ]
  },
  "high-efficiency": {
    "duration-based-rts": "1023",
    "guard-interval": "INTERVAL_ALL",
    "mu-mimo": "true",
    "mu-ofdma": "true",
    "ul-mu-mimo": "false",
    "supported-mcs-map": "<string>",
    "txbf": "true",
    "individual-twt": "true",
    "dynamic-fragmentation-level": "LEVEL_0"
  },
  "extremely-high-throughput": {
    "enable": "true",
    "mlo": "false",
    "supported-mcs-map": "<string>",
    "beacon-protection": "false",
    "sae-sub-mode": "LEGACY_MODE"
  },
  "wmm-cfg": {
    "ap-best-effort": {
      "aifsn": "3",
      "ecwmin": "4",
      "ecwmax": "6",
      "txop": "0",
      "acm": "0"
    },
    "ap-background": {
      "aifsn": "3",
      "ecwmin": "4",
      "ecwmax": "6",
      "txop": "0",
      "acm": "0"
    },
    "ap-video": {
      "aifsn": "3",
      "ecwmin": "4",
      "ecwmax": "6",
      "txop": "0",
      "acm": "0"
    },
    "ap-voice": {
      "aifsn": "3",
      "ecwmin": "4",
      "ecwmax": "6",
      "txop": "0",
      "acm": "0"
    },
    "sta-best-effort": {
      "aifsn": "3",
      "ecwmin": "4",
      "ecwmax": "6",
      "txop": "0",
      "acm": "0"
    },
    "sta-background": {
      "aifsn": "3",
      "ecwmin": "4",
      "ecwmax": "6",
      "txop": "0",
      "acm": "0"
    },
    "sta-video": {
      "aifsn": "3",
      "ecwmin": "4",
      "ecwmax": "6",
      "txop": "0",
      "acm": "0"
    },
    "sta-voice": {
      "aifsn": "3",
      "ecwmin": "4",
      "ecwmax": "6",
      "txop": "0",
      "acm": "0"
    },
    "enable": "true",
    "uapsd": "true",
    "background-dscp": [
      "<integer>"
    ],
    "best-effort-dscp": [
      "<integer>"
    ],
    "video-dscp": [
      "<integer>"
    ],
    "voice-dscp": [
      "<integer>"
    ],
    "tspec": "false",
    "tspec-bandwidth": "2000"
  },
  "qos-management": {
    "scs": "false"
  },
  "advertise-timing": "false",
  "dot11v": "false",
  "allowed-6ghz-radio": "ALL_6GHZ",
  "advertise-location-identifier": {
    "enable": "false",
    "http-enabled-location-delivery": "<string>",
    "supl-server": "<string>"
  },
  "advertise-location-civic": "false",
  "mac-authentication": "false",
  "dot1x-timer-idrequest-period": "5",
  "l2-auth-failthrough": "false",
  "personal-security": {
    "passphrase-format": "HEX",
    "wpa-passphrase": "<string>",
    "wep-key-size": "64BIT",
    "wep-key-index": "<integer>",
    "wep-key": "<string>",
    "mpsk-cloud-auth": "false",
    "mpsk-local-profile": "<string>"
  },
  "captive-portal-type": "EXTERNAL_CP",
  "captive-portal": "<string>",
  "exclude-uplink": [
    "WIFI"
  ],
  "called-station-id": {
    "type": "AP_MAC_ADDRESS",
    "mac-address-delimiter": "NONE",
    "upper-case": "false",
    "include-ssid": "false",
    "include-ssid-delimiter": "<string>"
  },
  "internal-auth-server": "INTERNAL_SERVER",
  "primary-auth-server": "<string>",
  "backup-auth-server": "<string>",
  "auth-server-group": "<string>",
  "cloud-auth": "false",
  "radius-accounting": "false",
  "radius-interim-accounting-interval": "<integer>",
  "primary-acct-server": "<string>",
  "backup-acct-server": "<string>",
  "acct-server-group": "<string>",
  "cp-accounting-mode": "USER_AUTHENTICATION",
  "assignment-rules": {
    "assignment-rule": [
      {
        "sequence-id": "<long>",
        "attribute": "ARUBA_AIRGROUP_USER_NAME",
        "attribute-str": "<string>",
        "operator": "CONTAINS",
        "operand": "<string>",
        "assign-action": "ASSIGN_ROLE",
        "vlan": "<string>",
        "role": "<string>"
      }
    ]
  },
  "wpa3-transition-mode-enable": "true",
  "pmk-cache-delete-on-leave": "false",
  "opp-key-caching": "false",
  "wpa-key-period": "1500",
  "wpa-key-retries": "3",
  "denylist-sco-attack": "false",
  "captive-portal-landing-page-delay": "1",
  "captive-portal-proxy-server": {
    "ip": "<string>",
    "port": "<long>"
  },
  "airpass": "false",
  "passpoint": "<string>",
  "wispr": "false",
  "denylist": "false",
  "mac-authentication-delimiter": "NONE",
  "mac-authentication-upper-case": "false",
  "max-authentication-failures": "<integer>",
  "auth-survivability": "false",
  "priority-use-local-cache": "false",
  "external-server": "false",
  "enforce-dhcp": "false",
  "pan": "false",
  "termination": "false",
  "vlan-selector": "VLAN_RANGES",
  "vlan-name": "<string>",
  "vlan-id-range": [
    "<string>"
  ],
  "out-of-service": "INTERNET_DOWN",
  "deny-inter-user-bridging": "false",
  "client-isolation": "false",
  "deny-local-routing": "false",
  "max-ipv4-users": "1",
  "content-filtering": "false",
  "work-without-uplink": "false",
  "ssid": "<string>",
  "description": "<string>",
  "enable": "true",
  "forward-mode": "FORWARD_MODE_BRIDGE",
  "cluster-preemption": "false",
  "bandwidth-limit": "<integer>",
  "time-range": {
    "name": [
      "<string>"
    ],
    "enable": "false"
  },
  "hotspot-profile": "<string>",
  "mbssid-group-profile": "<string>",
  "zone": [
    "<string>"
  ]
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

