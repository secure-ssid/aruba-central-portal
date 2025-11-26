# Read existing Passpoint profile.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/passpoint/:name`

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
  "name": "<string>",
  "description": "<string>",
  "anqp-domain-name": [
    {
      "value": "<string>"
    },
    {
      "value": "<string>"
    }
  ],
  "anqp-venue-info": [
    {
      "venue-info-profile-name": "<string>",
      "lang-code": "<string>",
      "venue-name": "<string>",
      "venue-group": "BUSINESS",
      "venue-type": "RESEARCH_AND_DEV_FACILITY",
      "venue-name-hex": "<string>",
      "url": "<string>"
    },
    {
      "venue-info-profile-name": "<string>",
      "lang-code": "<string>",
      "venue-name": "<string>",
      "venue-group": "BUSINESS",
      "venue-type": "RESEARCH_AND_DEV_FACILITY",
      "venue-name-hex": "<string>",
      "url": "<string>"
    }
  ],
  "access-network-type": "PRIVATE",
  "anqp-ip-addr-avail": [
    {
      "ip-addr-avail-profile-name": "<string>",
      "ipv4": "PUBLIC",
      "ipv6": "NOT_AVAILABLE"
    },
    {
      "ip-addr-avail-profile-name": "<string>",
      "ipv4": "PUBLIC",
      "ipv6": "NOT_AVAILABLE"
    }
  ],
  "roam-cons": [
    {
      "oi-value": "<string>"
    },
    {
      "oi-value": "<string>"
    }
  ],
  "query-response-length-limit": "4",
  "internet": "false",
  "h2qp-oper-name": [
    {
      "oper-friendly-profile-name": "<string>",
      "lang-code": "eng",
      "fr-name": "<string>",
      "fr-name-hex": "<string>"
    },
    {
      "oper-friendly-profile-name": "<string>",
      "lang-code": "eng",
      "fr-name": "<string>",
      "fr-name-hex": "<string>"
    }
  ],
  "identity-profile": [
    "<string>",
    "<string>"
  ],
  "release-number": "2",
  "addtl-roam-cons-ois": "<integer>",
  "anqp-domain-id": "<integer>",
  "additional-access-steps": "false",
  "comeback-mode": "false",
  "gas-comeback-delay": "500",
  "group-frame-block": "false",
  "homogeneous-essid": "<string>",
  "osen": "false",
  "osu-nai": "<string>",
  "osu-ssid": "<string>",
  "p2p-cross-connect": "false",
  "p2p-dev-mgmt": "false",
  "pame-bi": "false",
  "qos-map-excp": "<string>",
  "qos-map-range": "<string>",
  "radius-cui-disable": "false",
  "radius-loc-data-disable": "false",
  "venue-group": "BUSINESS",
  "venue-type": "RESEARCH_AND_DEV_FACILITY",
  "anqp-nwk-auth-profile": [
    {
      "nwk-auth-profile-name": "<string>",
      "enable": "true",
      "na-type": "HTTP_REDIRECT",
      "url": "<string>"
    },
    {
      "nwk-auth-profile-name": "<string>",
      "enable": "true",
      "na-type": "HTTP_REDIRECT",
      "url": "<string>"
    }
  ],
  "h2qp-conn-cap-profile": [
    {
      "conn-cap-profile-name": "<string>",
      "enable": "true",
      "icmp": "false",
      "tcp-ftp": "false",
      "tcp-ssh": "false",
      "tcp-http": "false",
      "tcp-tls-vpn": "false",
      "tcp-pptp-vpn": "false",
      "tcp-voip": "false",
      "udp-voip": "false",
      "udp-ipsec-vpn": "false",
      "udp-ike2": "false",
      "esp-port": "false"
    },
    {
      "conn-cap-profile-name": "<string>",
      "enable": "true",
      "icmp": "false",
      "tcp-ftp": "false",
      "tcp-ssh": "false",
      "tcp-http": "false",
      "tcp-tls-vpn": "false",
      "tcp-pptp-vpn": "false",
      "tcp-voip": "false",
      "udp-voip": "false",
      "udp-ipsec-vpn": "false",
      "udp-ike2": "false",
      "esp-port": "false"
    }
  ],
  "h2qp-oper-class-profile": [
    {
      "oper-class-profile-name": "<string>",
      "enable": "true",
      "operating-class-indication": "0"
    },
    {
      "oper-class-profile-name": "<string>",
      "enable": "true",
      "operating-class-indication": "0"
    }
  ],
  "h2qp-wan-metrics-profile": [
    {
      "wan-metrics-profile-name": "<string>",
      "enable": "true",
      "link-status": "LINK_UP",
      "enable-symm-link": "false",
      "at-capacity": "false",
      "uplink-speed": "0",
      "downlink-speed": "0",
      "uplink-load": "0",
      "downlink-load": "0",
      "load-duration": "0"
    },
    {
      "wan-metrics-profile-name": "<string>",
      "enable": "true",
      "link-status": "LINK_UP",
      "enable-symm-link": "false",
      "at-capacity": "false",
      "uplink-speed": "0",
      "downlink-speed": "0",
      "uplink-load": "0",
      "downlink-load": "0",
      "load-duration": "0"
    }
  ]
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

