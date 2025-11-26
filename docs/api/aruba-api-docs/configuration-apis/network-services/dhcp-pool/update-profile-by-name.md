# Update profile by {name}

## Request

**Method:** `PATCH`

**URL:** `{{baseUrl}}/network-config/v1alpha1/dhcp-pool/:name`

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
  "ipv4-pool": {
    "lease-time": "000:12:00:00",
    "range": [
      {
        "start-ipv4-end-ipv4": "<string>"
      },
      {
        "start-ipv4-end-ipv4": "<string>"
      }
    ],
    "prefix-len": "<integer>",
    "addl-range": [
      {
        "addl-start-ipv4-addl-end-ipv4": "<string>",
        "prefix-len": "<integer>"
      },
      {
        "addl-start-ipv4-addl-end-ipv4": "<string>",
        "prefix-len": "<integer>"
      }
    ],
    "option": [
      {
        "opcode": "<integer>",
        "opcode-type": "HEX",
        "ascii": "<string>",
        "hex": "<string>",
        "ip": [
          "<string>",
          "<string>"
        ]
      },
      {
        "opcode": "<integer>",
        "opcode-type": "IPV6_ADDRESS",
        "ascii": "<string>",
        "hex": "<string>",
        "ip": [
          "<string>",
          "<string>"
        ]
      }
    ],
    "bootfile-name": "<string>",
    "tftp-server-name": "<string>",
    "tftp-server-address": "<string>",
    "next-server": "<string>",
    "default-router": [
      "<string>",
      "<string>"
    ],
    "dns-config-mode": "MANUAL",
    "dns-import": "DEVICE_IP",
    "dns-server": [
      "<string>",
      "<string>"
    ],
    "domain": "<string>",
    "netbios-config-mode": "MANUAL",
    "netbios-import": "DHCP",
    "netbios-node": "PEER_TO_PEER",
    "netbios-server": [
      "<string>",
      "<string>"
    ],
    "vendor-class-identifier": "false",
    "static-binding-ipv4": [
      {
        "hostname": "<string>",
        "ipaddress": "<string>",
        "netmask": "<integer>",
        "mac": "<string>"
      },
      {
        "hostname": "<string>",
        "ipaddress": "<string>",
        "netmask": "<integer>",
        "mac": "<string>"
      }
    ]
  },
  "ipv6-pool": {
    "lease-time": "000:12:00:00",
    "range6": [
      {
        "start-ipv6-end-ipv6": "<string>"
      },
      {
        "start-ipv6-end-ipv6": "<string>"
      }
    ],
    "prefix-len": "<integer>",
    "addl-range6": [
      {
        "addl-start-ipv6-addl-end-ipv6": "<string>",
        "prefix-len": "<integer>"
      },
      {
        "addl-start-ipv6-addl-end-ipv6": "<string>",
        "prefix-len": "<integer>"
      }
    ],
    "option": [
      {
        "opcode": "<integer>",
        "opcode-type": "IPV6_ADDRESS",
        "ascii": "<string>",
        "hex": "<string>",
        "ip": [
          "<string>",
          "<string>"
        ]
      },
      {
        "opcode": "<integer>",
        "opcode-type": "ASCII",
        "ascii": "<string>",
        "hex": "<string>",
        "ip": [
          "<string>",
          "<string>"
        ]
      }
    ],
    "dns-config-mode": "MANUAL",
    "dns-import": "DEVICE_IP",
    "dns-server": [
      "<string>",
      "<string>"
    ],
    "domain": "<string>",
    "vendor-class-en": "<long>",
    "vendor-class-identifier": "<string>",
    "vendor-data-en": "<long>",
    "vendor-data-suboption": "<integer>",
    "vendor-data": "<string>",
    "static-binding-ipv6": [
      {
        "hostname": "<string>",
        "ipaddress": "<string>",
        "client-id": "<string>"
      },
      {
        "hostname": "<string>",
        "ipaddress": "<string>",
        "client-id": "<string>"
      }
    ]
  },
  "name": "<string>",
  "description": "<string>",
  "ip-version": "IPV6"
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

