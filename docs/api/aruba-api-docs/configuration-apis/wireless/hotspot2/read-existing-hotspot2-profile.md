# Read existing Hotspot2 profile.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/hotspot2/:name`

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
  "enable": "true",
  "release-number": "2",
  "access-network-type": "PRIVATE",
  "addtl-roam-cons-ois": "<integer>",
  "anqp-domain-id": "<integer>",
  "additional-access-steps": "false",
  "comeback-mode": "false",
  "gas-comeback-delay": "500",
  "group-frame-block": "false",
  "homogeneous-essid": "<string>",
  "enable-internet-access": "false",
  "osen": "false",
  "osu-nai": "<string>",
  "osu-ssid": "<string>",
  "p2p-cross-connect": "false",
  "p2p-dev-mgmt": "false",
  "pame-bi": "false",
  "qos-map-excp": "<string>",
  "qos-map-range": "<string>",
  "query-response-length-limit": "4",
  "radius-cui-disable": "false",
  "radius-loc-data-disable": "false",
  "roam-cons-oi-1": "<string>",
  "roam-cons-oi-2": "<string>",
  "roam-cons-oi-3": "<string>",
  "venue-group-type": "BUSINESS_RESEARCH_AND_DEV_FACILITY",
  "advertisement-profile": [
    {
      "profile-type": "ANQP_VENUE_NAME",
      "anqp-3gpp": [
        "<string>",
        "<string>"
      ],
      "anqp-domain-name": [
        "<string>",
        "<string>"
      ],
      "anqp-ip-addr-avail": [
        "<string>",
        "<string>"
      ],
      "anqp-nai-realm": [
        "<string>",
        "<string>"
      ],
      "anqp-nwk-auth": [
        "<string>",
        "<string>"
      ],
      "anqp-roam-cons": [
        "<string>",
        "<string>"
      ],
      "anqp-venue-name": [
        "<string>",
        "<string>"
      ],
      "h2qp-conn-cap": [
        "<string>",
        "<string>"
      ],
      "h2qp-oper-class": [
        "<string>",
        "<string>"
      ],
      "h2qp-oper-name": [
        "<string>",
        "<string>"
      ],
      "h2qp-osu-provider": [
        "<string>",
        "<string>"
      ],
      "h2qp-wan-metrics": [
        "<string>",
        "<string>"
      ]
    },
    {
      "profile-type": "ANQP_IP_ADDR_AVAIL",
      "anqp-3gpp": [
        "<string>",
        "<string>"
      ],
      "anqp-domain-name": [
        "<string>",
        "<string>"
      ],
      "anqp-ip-addr-avail": [
        "<string>",
        "<string>"
      ],
      "anqp-nai-realm": [
        "<string>",
        "<string>"
      ],
      "anqp-nwk-auth": [
        "<string>",
        "<string>"
      ],
      "anqp-roam-cons": [
        "<string>",
        "<string>"
      ],
      "anqp-venue-name": [
        "<string>",
        "<string>"
      ],
      "h2qp-conn-cap": [
        "<string>",
        "<string>"
      ],
      "h2qp-oper-class": [
        "<string>",
        "<string>"
      ],
      "h2qp-oper-name": [
        "<string>",
        "<string>"
      ],
      "h2qp-osu-provider": [
        "<string>",
        "<string>"
      ],
      "h2qp-wan-metrics": [
        "<string>",
        "<string>"
      ]
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

