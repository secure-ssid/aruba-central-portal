# Read configured stacks

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/stacks`

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
  "stack": [
    {
      "platform": "PLATFORM_3810",
      "auto-stack": "false",
      "secondary-member": "<integer>",
      "egress-shape": "<boolean>",
      "split-detection-method": "VLAN",
      "split-detection": {
        "detection-mode": "MGMT",
        "lldp-ipv4-address": "<string>",
        "lldp-snmp-community": "<string>",
        "vlan": "<integer>"
      },
      "members": [
        {
          "use-auto-stacking-ports": "false",
          "links": {
            "link1": {
              "interfaces": [
                "<string>",
                "<string>"
              ],
              "description": "<string>"
            },
            "link2": {
              "interfaces": [
                "<string>",
                "<string>"
              ],
              "description": "<string>"
            }
          },
          "flex-module-A": "JL083A",
          "flex-module-B": "JL078A",
          "oobm-member": {
            "vsf-mode": "<boolean>",
            "enable": "<boolean>",
            "ipv6-enable": "<boolean>",
            "ipv4-address": "<string>",
            "ipv6-address": "DHCP_FULL",
            "anycast": "<boolean>",
            "eui64": "false",
            "autoconfig": "false",
            "link-local": "<string>",
            "default-gateway-ipv4": "<string>",
            "default-gateway-ipv6": "<string>",
            "speed-duplex": "AUTO"
          },
          "serial": "<string>",
          "priority": "<integer>",
          "mac": "<string>",
          "hw-profile": "<string>"
        },
        {
          "use-auto-stacking-ports": "false",
          "links": {
            "link1": {
              "interfaces": [
                "<string>",
                "<string>"
              ],
              "description": "<string>"
            },
            "link2": {
              "interfaces": [
                "<string>",
                "<string>"
              ],
              "description": "<string>"
            }
          },
          "flex-module-A": "JL081A",
          "flex-module-B": "JL078A",
          "oobm-member": {
            "vsf-mode": "<boolean>",
            "enable": "<boolean>",
            "ipv6-enable": "<boolean>",
            "ipv4-address": "<string>",
            "ipv6-address": "<string>",
            "anycast": "<boolean>",
            "eui64": "false",
            "autoconfig": "false",
            "link-local": "<string>",
            "default-gateway-ipv4": "<string>",
            "default-gateway-ipv6": "<string>",
            "speed-duplex": "AUTO"
          },
          "serial": "<string>",
          "priority": "<integer>",
          "mac": "<string>",
          "hw-profile": "<string>"
        }
      ],
      "name": "<string>",
      "description": "<string>",
      "stack-id": "<string>",
      "port-speed": "SPEED_2_5GB",
      "domain-id": "<long>",
      "split-policy": "ALL_FRAGMENTS_UP"
    },
    {
      "platform": "PLATFORM_2930M",
      "auto-stack": "false",
      "secondary-member": "<integer>",
      "egress-shape": "<boolean>",
      "split-detection-method": "LLDP",
      "split-detection": {
        "detection-mode": "MGMT",
        "lldp-ipv4-address": "<string>",
        "lldp-snmp-community": "<string>",
        "vlan": "<integer>"
      },
      "members": [
        {
          "use-auto-stacking-ports": "false",
          "links": {
            "link1": {
              "interfaces": [
                "<string>",
                "<string>"
              ],
              "description": "<string>"
            },
            "link2": {
              "interfaces": [
                "<string>",
                "<string>"
              ],
              "description": "<string>"
            }
          },
          "flex-module-A": "JL081A",
          "flex-module-B": "JL079A",
          "oobm-member": {
            "vsf-mode": "<boolean>",
            "enable": "<boolean>",
            "ipv6-enable": "<boolean>",
            "ipv4-address": "NONE",
            "ipv6-address": "DHCP",
            "anycast": "<boolean>",
            "eui64": "false",
            "autoconfig": "false",
            "link-local": "<string>",
            "default-gateway-ipv4": "<string>",
            "default-gateway-ipv6": "<string>",
            "speed-duplex": "FULL_10MB"
          },
          "serial": "<string>",
          "priority": "<integer>",
          "mac": "<string>",
          "hw-profile": "<string>"
        },
        {
          "use-auto-stacking-ports": "false",
          "links": {
            "link1": {
              "interfaces": [
                "<string>",
                "<string>"
              ],
              "description": "<string>"
            },
            "link2": {
              "interfaces": [
                "<string>",
                "<string>"
              ],
              "description": "<string>"
            }
          },
          "flex-module-A": "JL081A",
          "flex-module-B": "JL079A",
          "oobm-member": {
            "vsf-mode": "<boolean>",
            "enable": "<boolean>",
            "ipv6-enable": "<boolean>",
            "ipv4-address": "<string>",
            "ipv6-address": "<string>",
            "anycast": "<boolean>",
            "eui64": "false",
            "autoconfig": "false",
            "link-local": "<string>",
            "default-gateway-ipv4": "<string>",
            "default-gateway-ipv6": "<string>",
            "speed-duplex": "FULL_10MB"
          },
          "serial": "<string>",
          "priority": "<integer>",
          "mac": "<string>",
          "hw-profile": "<string>"
        }
      ],
      "name": "<string>",
      "description": "<string>",
      "stack-id": "<string>",
      "port-speed": "SPEED_100MB",
      "domain-id": "<long>",
      "split-policy": "ALL_FRAGMENTS_UP"
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

