# Create a new DNS profile

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-config/v1alpha1/dns/:name`

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
  "lookup": "true",
  "redirect-dns": "false",
  "redirect-dns-vlans": "NONE",
  "dhcp": "true",
  "cache-size": "150",
  "domain": [
    {
      "name": "<string>",
      "vrf": "<string>"
    },
    {
      "name": "<string>",
      "vrf": "<string>"
    }
  ],
  "domain-list": [
    {
      "vrf": "<string>",
      "name": [
        "<string>",
        "<string>"
      ]
    },
    {
      "vrf": "<string>",
      "name": [
        "<string>",
        "<string>"
      ]
    }
  ],
  "resolver-alias": "<string>",
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
  ],
  "redirect": {
    "server": [
      {
        "domain-ip": "<string>",
        "priority": "<integer>"
      },
      {
        "domain-ip": "<string>",
        "priority": "<integer>"
      }
    ]
  },
  "static-host": [
    {
      "vrf": "<string>",
      "host-ip": [
        {
          "hostname": "<string>",
          "host-ip": [
            "<string>",
            "<string>"
          ]
        },
        {
          "hostname": "<string>",
          "host-ip": [
            "<string>",
            "<string>"
          ]
        }
      ]
    },
    {
      "vrf": "<string>",
      "host-ip": [
        {
          "hostname": "<string>",
          "host-ip": [
            "<string>",
            "<string>"
          ]
        },
        {
          "hostname": "<string>",
          "host-ip": [
            "<string>",
            "<string>"
          ]
        }
      ]
    }
  ],
  "split-dns": {
    "enterprise-domain": [
      "<string>",
      "<string>"
    ]
  },
  "name": "<string>",
  "description": "<string>"
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

