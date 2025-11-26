# Create new route-map with name {name}

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-config/v1alpha1/route-maps/:routeMapName`

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
  "route-map-name": "<string>",
  "profile-description": "<string>",
  "route-map-entry": [
    {
      "set-as-path": {
        "prepend-as": "<string>",
        "last-as-prepend-count": "<integer>",
        "as-exclude": "<long>"
      },
      "set-tag": "<long>",
      "set-community": {
        "community-value-asnn": "<string>",
        "community-value-all": [
          "<string>",
          "<long>"
        ],
        "community-operation": "DELETE"
      },
      "set-community-list": {
        "community-list-operation": "APPEND",
        "name": "<string>"
      },
      "set-origin": "INCOMPLETE",
      "set-local-preference": "<long>",
      "set-metric": "<long>",
      "set-metric-type": "TYPE_2",
      "set-ipv4-nexthop-address": "<string>",
      "set-weight": "<integer>",
      "set-ipv6-nexthop": "<string>",
      "set-dampening": {
        "half-life": "<integer>",
        "reuse-limit": "<integer>",
        "suppress-limit": "<integer>",
        "max-suppress-time": "<integer>",
        "enable": "<boolean>"
      },
      "set-extended-community": {
        "router-mac": "<string>",
        "route-target": [
          "<long>",
          "<long>"
        ]
      },
      "set-local-broadcast-group": "<integer>",
      "match-ipv4-prefix-list": "<string>",
      "match-ipv4-route-source-prefix-list": "<string>",
      "match-as-path-list": "<string>",
      "match-ipv4-nexthop": {
        "ipv4-nexthop-address": "<string>",
        "ipv4-nexthop-addresses": [
          "<string>",
          "<string>"
        ],
        "ipv4-nexthop-prefix-list": "<string>"
      },
      "match-community": "<long>",
      "match-community-list": {
        "community-list-name-community-type": "<string>",
        "community-list-name": "<string>",
        "exact-match": "<boolean>"
      },
      "match-extended-community-list": {
        "community-list-name-community-type": "<string>",
        "exact-match": "<boolean>"
      },
      "match-tag": "<long>",
      "match-tags": [
        "<long>",
        "<long>"
      ],
      "match-loopback-interface": "<integer>",
      "match-vlan-interface": "<integer>",
      "match-portchannel-interface": "<string>",
      "match-tunnel-interface": "<integer>",
      "match-ethernet-interface": "<string>",
      "match-subinterface": "<string>",
      "match-interface-vlans": [
        "<integer>",
        "<integer>"
      ],
      "match-vrf-segment": "<string>",
      "match-local-preference": "<long>",
      "match-metric": "<long>",
      "match-external-route-type": "TYPE_1",
      "match-route-type": "EVPN_TYPE_1",
      "match-source-protocol": "OSPF",
      "match-ipv6-prefix-list": "<string>",
      "match-ipv6-nexthop-address": {
        "ipv6-nexthop-prefix-list": "<string>",
        "ipv6-nexthop-address": "<string>",
        "ipv6-nexthop-addresses": [
          "<string>",
          "<string>"
        ]
      },
      "match-ipv6-route-source-prefix-list": "<string>",
      "match-vni": "<long>",
      "match-origin": "IGP",
      "seq-no-op-type": "<string>",
      "continue": "<long>",
      "description": "<string>"
    },
    {
      "set-as-path": {
        "prepend-as": "<string>",
        "last-as-prepend-count": "<integer>",
        "as-exclude": "<long>"
      },
      "set-tag": "<long>",
      "set-community": {
        "community-value-asnn": "<long>",
        "community-value-all": [
          "<string>",
          "NO_ADVERTISE"
        ],
        "community-operation": "ADDITIVE"
      },
      "set-community-list": {
        "community-list-operation": "APPEND",
        "name": "<string>"
      },
      "set-origin": "IGP",
      "set-local-preference": "<long>",
      "set-metric": "<long>",
      "set-metric-type": "TYPE_1",
      "set-ipv4-nexthop-address": "<string>",
      "set-weight": "<integer>",
      "set-ipv6-nexthop": "<string>",
      "set-dampening": {
        "half-life": "<integer>",
        "reuse-limit": "<integer>",
        "suppress-limit": "<integer>",
        "max-suppress-time": "<integer>",
        "enable": "<boolean>"
      },
      "set-extended-community": {
        "router-mac": "<string>",
        "route-target": [
          "<long>",
          "<long>"
        ]
      },
      "set-local-broadcast-group": "<integer>",
      "match-ipv4-prefix-list": "<string>",
      "match-ipv4-route-source-prefix-list": "<string>",
      "match-as-path-list": "<string>",
      "match-ipv4-nexthop": {
        "ipv4-nexthop-address": "<string>",
        "ipv4-nexthop-addresses": [
          "<string>",
          "<string>"
        ],
        "ipv4-nexthop-prefix-list": "<string>"
      },
      "match-community": "<string>",
      "match-community-list": {
        "community-list-name-community-type": "<string>",
        "community-list-name": "<string>",
        "exact-match": "<boolean>"
      },
      "match-extended-community-list": {
        "community-list-name-community-type": "<string>",
        "exact-match": "<boolean>"
      },
      "match-tag": "<long>",
      "match-tags": [
        "<long>",
        "<long>"
      ],
      "match-loopback-interface": "<integer>",
      "match-vlan-interface": "<integer>",
      "match-portchannel-interface": "<string>",
      "match-tunnel-interface": "<integer>",
      "match-ethernet-interface": "<string>",
      "match-subinterface": "<string>",
      "match-interface-vlans": [
        "<integer>",
        "<integer>"
      ],
      "match-vrf-segment": "<string>",
      "match-local-preference": "<long>",
      "match-metric": "<long>",
      "match-external-route-type": "TYPE_1",
      "match-route-type": "EVPN_TYPE_2",
      "match-source-protocol": "OSPFV3",
      "match-ipv6-prefix-list": "<string>",
      "match-ipv6-nexthop-address": {
        "ipv6-nexthop-prefix-list": "<string>",
        "ipv6-nexthop-address": "<string>",
        "ipv6-nexthop-addresses": [
          "<string>",
          "<string>"
        ]
      },
      "match-ipv6-route-source-prefix-list": "<string>",
      "match-vni": "<long>",
      "match-origin": "EGP",
      "seq-no-op-type": "<string>",
      "continue": "<long>",
      "description": "<string>"
    }
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

