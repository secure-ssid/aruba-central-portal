# Update profile by {name}

## Request

**Method:** `PATCH`

**URL:** `{{baseUrl}}/network-config/v1alpha1/static-route/:name`

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
  "name": "<string>",
  "description": "<string>",
  "ipv4": [
    {
      "prefix-vrf-nexthop-id": "<string>",
      "forwarding-type": "TUNNEL",
      "next-hop-alias": "<string>",
      "next-hop": "<string>",
      "interface": {
        "nexthop-interface-type": "SUB_INTERFACE",
        "ethernet": "<string>",
        "lag": "<string>",
        "sub-interface": "<string>",
        "svi": "<integer>",
        "tunnel-id": "<integer>"
      },
      "nullroute": "false",
      "reject": "false",
      "vpn-tunnel": "<string>",
      "ipsec-map": "<string>",
      "cluster": "<string>",
      "bfd": "false",
      "enable-logging": "false",
      "vlan-id": "<integer>",
      "distance": "1",
      "tag": "<long>",
      "next-hop-ip": "<string>",
      "use-forwarding-address": "false",
      "metric": "1",
      "name": "<string>"
    },
    {
      "prefix-vrf-nexthop-id": "<string>",
      "forwarding-type": "INTERFACE",
      "next-hop-alias": "<string>",
      "next-hop": "<string>",
      "interface": {
        "nexthop-interface-type": "TUNNEL",
        "ethernet": "<string>",
        "lag": "<string>",
        "sub-interface": "<string>",
        "svi": "<integer>",
        "tunnel-id": "<integer>"
      },
      "nullroute": "false",
      "reject": "false",
      "vpn-tunnel": "<string>",
      "ipsec-map": "<string>",
      "cluster": "<string>",
      "bfd": "false",
      "enable-logging": "false",
      "vlan-id": "<integer>",
      "distance": "1",
      "tag": "<long>",
      "next-hop-ip": "<string>",
      "use-forwarding-address": "false",
      "metric": "1",
      "name": "<string>"
    }
  ],
  "ipv6": [
    {
      "prefix-vrf-nexthop-id": "<string>",
      "prefix": "<string>",
      "vrf": "<string>",
      "nexthop-id": "<integer>",
      "forwarding-type": "IPSECMAP",
      "next-hop-alias": "<string>",
      "next-hop": "<string>",
      "interface": {
        "nexthop-interface-type": "SUB_INTERFACE",
        "ethernet": "<string>",
        "lag": "<string>",
        "sub-interface": "<string>",
        "svi": "<integer>",
        "tunnel-id": "<integer>"
      },
      "nullroute": "false",
      "reject": "false",
      "source-interface": {
        "source-interface-type": "SVI",
        "ethernet": "<string>",
        "lag": "<string>",
        "sub-interface": "<string>",
        "svi": "<integer>",
        "tunnel-id": "<integer>"
      },
      "enable-logging": "false",
      "vlan-id": "<integer>",
      "distance": "1",
      "tag": "<long>",
      "ipsec-map": "<string>",
      "metric": "1",
      "nexthop-linklocal": "<string>",
      "metric-linklocal": "1",
      "tunnel-id": "<integer>",
      "name": "<string>"
    },
    {
      "prefix-vrf-nexthop-id": "<string>",
      "prefix": "<string>",
      "vrf": "<string>",
      "nexthop-id": "<integer>",
      "forwarding-type": "REJECT",
      "next-hop-alias": "<string>",
      "next-hop": "<string>",
      "interface": {
        "nexthop-interface-type": "SVI",
        "ethernet": "<string>",
        "lag": "<string>",
        "sub-interface": "<string>",
        "svi": "<integer>",
        "tunnel-id": "<integer>"
      },
      "nullroute": "false",
      "reject": "false",
      "source-interface": {
        "source-interface-type": "SUB_INTERFACE",
        "ethernet": "<string>",
        "lag": "<string>",
        "sub-interface": "<string>",
        "svi": "<integer>",
        "tunnel-id": "<integer>"
      },
      "enable-logging": "false",
      "vlan-id": "<integer>",
      "distance": "1",
      "tag": "<long>",
      "ipsec-map": "<string>",
      "metric": "1",
      "nexthop-linklocal": "<string>",
      "metric-linklocal": "1",
      "tunnel-id": "<integer>",
      "name": "<string>"
    }
  ],
  "default-gateway": [
    {
      "dg-name": "<string>",
      "forwarding-type": "PPPOE",
      "ipv4-address-alias": "<string>",
      "ipv4-address": "<string>",
      "dhcp": "false",
      "pppoe": "false",
      "metric": "1"
    },
    {
      "dg-name": "<string>",
      "forwarding-type": "NEXTHOP",
      "ipv4-address-alias": "<string>",
      "ipv4-address": "<string>",
      "dhcp": "false",
      "pppoe": "false",
      "metric": "1"
    }
  ],
  "ipv6-default-gateway": [
    {
      "ipv6-dg-name": "<string>",
      "ipv6-address-alias": "<string>",
      "ipv6-address": "<string>",
      "metric": "1"
    },
    {
      "ipv6-dg-name": "<string>",
      "ipv6-address-alias": "<string>",
      "ipv6-address": "<string>",
      "metric": "1"
    }
  ],
  "route-gc-interval": "30"
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

