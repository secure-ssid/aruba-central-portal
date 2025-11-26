# Create alias by {name}

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-config/v1alpha1/aliases/:name`

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
  "type": "ALIAS_VRRP_PRIORITY",
  "default-value": {
    "host-address-value": {
      "host-ipv4-address": "<string>",
      "host-ipv6-address": "<string>"
    },
    "hostname-value": {
      "hostname": "<string>"
    },
    "network-address-value": {
      "network-ipv4-address": "<string>",
      "network-ipv6-address": "<string>"
    },
    "vlan-value": {
      "vlan-id-ranges": [
        "<string>",
        "<string>"
      ]
    },
    "essid-value": {
      "name": "<string>"
    },
    "bfd-echo-source-address": {
      "name": "<string>"
    },
    "ipv4-system-vlan-value": {
      "vlan-id": "<integer>"
    },
    "ipv4-prefix-value": {
      "prefix": "<string>"
    },
    "ipv6-prefix-value": {
      "prefix": "<string>"
    },
    "ipv4-address-type-value": {
      "ipv4-address": "NO_DHCP"
    },
    "ipv6-address-type-value": {
      "ipv6-addresses": [
        {
          "address": "<string>",
          "eui64": "false",
          "tag": "0"
        },
        {
          "address": "DHCP",
          "eui64": "false",
          "tag": "0"
        }
      ]
    },
    "ipv6-link-local-address-value": {
      "ipv6-link-local-address": "<string>"
    },
    "report-rssi-type-value": {
      "type": "UNASSOCIATED_AND_ASSOCIATED_CLIENTS"
    },
    "feature-control": {
      "enable": "false"
    },
    "ipv4-address-value": {
      "address": "<string>"
    },
    "ipv6-address-value": {
      "address": "<string>"
    },
    "next-hop-ipv4": {
      "hop-address": "<string>"
    },
    "next-hop-ipv6": {
      "hop-address": "<string>"
    },
    "identity-profile-control": {
      "enable": "false"
    },
    "ipv4-addresses-value": {
      "ip-addresses": [
        "<string>",
        "<string>"
      ]
    },
    "ntp-server-list-value": {
      "servers": [
        {
          "address": "<string>",
          "tx-mode": "IBURST",
          "burst": "SINGLE",
          "iburst": "ALWAYS",
          "key-identifier": "<long>",
          "max-poll": "10",
          "min-poll": "6",
          "mgmt-interface": "false",
          "prefer": "false",
          "version": "<integer>"
        },
        {
          "address": "<string>",
          "tx-mode": "IBURST",
          "burst": "SINGLE",
          "iburst": "ALWAYS",
          "key-identifier": "<long>",
          "max-poll": "10",
          "min-poll": "6",
          "mgmt-interface": "false",
          "prefer": "false",
          "version": "<integer>"
        }
      ]
    },
    "ntp-auth-global-value": {
      "authenticate": "false"
    },
    "ntp-auth-list-value": {
      "authentication-profile": [
        {
          "key-identifier": "<long>",
          "key-hash": "MD5",
          "key-value": "<string>",
          "key-trusted": "false",
          "ciphertext": {
            "key-value": "<string>"
          }
        },
        {
          "key-identifier": "<long>",
          "key-hash": "SHA1",
          "key-value": "<string>",
          "key-trusted": "false",
          "ciphertext": {
            "key-value": "<string>"
          }
        }
      ]
    },
    "dns-resolver-value": {
      "resolver": [
        {
          "vrf": "<string>",
          "name-server": [
            {
              "priority": "<integer>",
              "ip": "<string>",
              "vlan": "<integer>",
              "management-interface": "false"
            },
            {
              "priority": "<integer>",
              "ip": "<string>",
              "vlan": "<integer>",
              "management-interface": "false"
            }
          ]
        },
        {
          "vrf": "<string>",
          "name-server": [
            {
              "priority": "<integer>",
              "ip": "<string>",
              "vlan": "<integer>",
              "management-interface": "false"
            },
            {
              "priority": "<integer>",
              "ip": "<string>",
              "vlan": "<integer>",
              "management-interface": "false"
            }
          ]
        }
      ]
    },
    "priority-value": {
      "priority": "<integer>"
    },
    "vlan-description-value": {
      "description": "<string>"
    },
    "vc-country-code-value": {
      "country-code": "<string>"
    },
    "vc-name-value": {
      "virtual-controller-name": "<string>"
    },
    "vc-ip-value": {
      "virtual-controller-ip": "<string>"
    },
    "vc-ipv6-value": {
      "virtual-controller-ipv6": "<string>"
    },
    "vc-vlan-value": {
      "vlan": "<integer>",
      "mask": "<string>",
      "gateway": "<string>"
    },
    "vc-dnsip-value": {
      "virtual-controller-dnsip": "<string>"
    },
    "allow-new-aps-value": {
      "allow-new-aps": "<boolean>"
    },
    "voice-enable-value": {
      "voice-enable": "false"
    },
    "ipv4-relay-value": {
      "server": [
        {
          "ip-vrf": "<string>"
        },
        {
          "ip-vrf": "<string>"
        }
      ]
    },
    "ipv6-relay-value": {
      "ucast-server": [
        "<string>",
        "<string>"
      ]
    },
    "ip-address-value": {
      "address": "<string>"
    }
  }
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

