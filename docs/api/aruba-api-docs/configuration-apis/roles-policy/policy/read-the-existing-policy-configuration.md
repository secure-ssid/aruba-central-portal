# Read the existing policy configuration

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/policies/:name`

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
  "security-policy": {
    "policy-rule": [
      {
        "condition": {
          "services": {
            "web-category": "GROSS",
            "web-reputation": "SUSPICIOUS",
            "app-category": "TUNNELING",
            "application": "bitseduce",
            "net-service": "<string>",
            "apptag-name": "<string>",
            "apptag-type": "APP_CATEGORY"
          },
          "transport-fields": {
            "source-port": {
              "operator": "COMPARISON_EQ",
              "min": "<integer>",
              "max": "<integer>",
              "group": "<string>"
            },
            "destination-port": {
              "operator": "COMPARISON_RANGE",
              "min": "<integer>",
              "max": "<integer>",
              "group": "<string>"
            },
            "source-port-net-group": "<string>",
            "destination-port-net-group": "<string>",
            "tcp-flags": [
              "TCP_CWR"
            ],
            "established": "false"
          },
          "source": {
            "type": "ADDRESS_ROLE",
            "address-group": "<string>",
            "host-address": {
              "host-ipv4-address": "<string>",
              "host-ipv6-address": "<string>"
            },
            "subnet-address": {
              "network-subnet-address": "<string>"
            },
            "network-address": {
              "network-ipv4-address": "<string>",
              "network-ipv6-address": "<string>"
            },
            "aggregate-info": {
              "agg-roles": [
                {
                  "agg-role": "<string>",
                  "agg-rule-pos": "<long>"
                }
              ]
            },
            "role-options": {
              "options-type": "ADDRESS_LOCAL",
              "host-address": {
                "host-ipv4-address": "<string>",
                "host-ipv6-address": "<string>"
              },
              "network-address": {
                "network-ipv4-address": "<string>",
                "network-ipv6-address": "<string>"
              },
              "net-group": "<string>"
            }
          },
          "destination": {
            "aggregate-info": {
              "agg-roles": [
                {
                  "agg-role": "<string>",
                  "agg-rule-pos": "<long>"
                }
              ]
            },
            "role-options": {
              "options-type": "ADDRESS_ROLE",
              "host-address": {
                "host-ipv4-address": "<string>",
                "host-ipv6-address": "<string>"
              },
              "network-address": {
                "network-ipv4-address": "<string>",
                "network-ipv6-address": "<string>"
              },
              "net-group": "<string>"
            }
          },
          "ethernet-header": {
            "source-mac": "<string>",
            "source-mac-mask": "<string>",
            "destination-mac": "<string>",
            "destination-mac-mask": "<string>",
            "ethertype": "<integer>",
            "ethermask": "<integer>",
            "pcp": "<integer>",
            "vlan": "<integer>"
          },
          "named-condition": {
            "rules-type": "NETWORK_ACL_IPV6",
            "condition-reference": "<string>"
          }
        },
        "action": {
          "redirect": {
            "destination": "REDIRECT_ESI",
            "tunnel-group": "<string>",
            "tunnel": "<long>",
            "esi-group": "<string>",
            "esi-direction": "BOTH"
          },
          "source-nat": {
            "pool": "<string>",
            "vlan": "<integer>"
          },
          "destination-nat": {
            "ip-address": "<string>",
            "port": "<integer>",
            "name": "<string>"
          },
          "destination-route-nat": {
            "ip-address": "<string>",
            "port": "<integer>",
            "name": "<string>"
          },
          "route": {
            "destination-nat": {
              "ip-address": "<string>",
              "port": "<integer>",
              "name": "<string>"
            },
            "source-nat": {
              "pool": "<string>",
              "vlan": "<integer>"
            }
          },
          "packet-marking": {
            "dscp": "CS4",
            "ip-precedence": "<integer>"
          },
          "policing": {
            "type": "POLICING_SR_TCM",
            "committed-info-rate": "<long>",
            "committed-burst-size": "<long>",
            "peak-info-rate": "<long>",
            "peak-burst-size": "<long>",
            "exceed-cir-dscp": "AF32",
            "exceed-action": "ACTION_DROP",
            "exceed-pir-dscp": "<integer>"
          }
        },
        "aggregator": {
          "group-type": "<string>",
          "aggregator-uuid": "<string>"
        },
        "position": "<long>",
        "description": "<string>",
        "devices-applicable": "<string>"
      }
    ]
  },
  "name": "<string>",
  "type": "POLICY_TYPE_SECURITY",
  "dsf-enable": "false",
  "association": "ASSOCIATION_ROLE",
  "description": "<string>"
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

