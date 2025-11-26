# Read L2-VLAN

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/layer2-vlan/:vlan`

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
  "private-vlan-type": "PRIMARY",
  "private-vlan-association": "<integer>",
  "isolated-vlan": "<integer>",
  "community-vlan": [
    "<integer>",
    "<integer>"
  ],
  "client-ip-tracker-enable": "false",
  "igmp": {
    "static-group": [
      "<string>",
      "<string>"
    ],
    "fastleave-eth-interfaces": [
      "<string>",
      "<string>"
    ],
    "forced-fastleave-eth-interfaces": [
      "<string>",
      "<string>"
    ],
    "auto-eth-interfaces": [
      "<string>",
      "<string>"
    ],
    "block-eth-interfaces": [
      "<string>",
      "<string>"
    ],
    "forward-eth-interfaces": [
      "<string>",
      "<string>"
    ],
    "querier-enable": "true",
    "last-member-query-interval": "1",
    "robustness": "2",
    "query-max-response-time": "10",
    "policy-in": "<string>",
    "preprogram-starg-flow": "false"
  },
  "mld": {
    "static-group": [
      "<string>",
      "<string>"
    ],
    "fastleave-eth-interfaces": [
      "<string>",
      "<string>"
    ],
    "forced-fastleave-eth-interfaces": [
      "<string>",
      "<string>"
    ],
    "auto-eth-interfaces": [
      "<string>",
      "<string>"
    ],
    "block-eth-interfaces": [
      "<string>",
      "<string>"
    ],
    "forward-eth-interfaces": [
      "<string>",
      "<string>"
    ],
    "querier-enable": "true",
    "last-member-query-interval": "1",
    "robustness": "2",
    "query-max-response-time": "10",
    "policy-in": "<string>",
    "preprogram-starg-flow": "false"
  },
  "dhcpv4-snooping": {
    "enable": "false",
    "ip-binding-enable": "true"
  },
  "dhcpv6-snooping": {
    "enable": "false",
    "allow-bindings-on-trusted-ports": "false",
    "ip-binding-enable": "true",
    "guard-policy": "<string>"
  },
  "nd-snooping": {
    "nd-guard": "false",
    "ra-guard": "false",
    "ra-guard-log": "false",
    "ra-drop": "false",
    "allow-bindings-on-trusted-ports": "false",
    "prefix-list": [
      "<string>",
      "<string>"
    ],
    "ra-guard-policy": "<string>",
    "enable": "false",
    "prefix": [
      "<string>",
      "<string>"
    ]
  },
  "dynamic-arp-inspection": {
    "enable": "false"
  },
  "destination-guard": {
    "enable": "false"
  },
  "access-list-in": "<string>",
  "access-list-out": "<string>",
  "vlan": "<integer>",
  "description-alias": "<string>",
  "name": "<string>",
  "vrf": "<string>",
  "qinq-svlan": "<boolean>",
  "voice-enable-alias": "<string>"
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

