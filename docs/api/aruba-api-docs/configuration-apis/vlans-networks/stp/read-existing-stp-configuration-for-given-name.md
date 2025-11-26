# Read existing STP Configuration for given name.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/stp/:name`

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
  "enable": "<boolean>",
  "bpdu-guard-enable-timer": "<long>",
  "bpdu-throttle": "<integer>",
  "force-version": "STP_COMPATIBLE",
  "config-name": "<string>",
  "config-revision": "<long>",
  "mode": "MSTP",
  "extend-system-id": "<boolean>",
  "forward-delay": "<integer>",
  "hello-time": "<integer>",
  "ignore-pvid-inconsistency": "<boolean>",
  "max-age": "<integer>",
  "max-hops": "<integer>",
  "pathcost-type": "COST_TYPE_LONG",
  "mstp-pathcost": "8021T",
  "rpvst-pathcost": "8021T",
  "cst-log-state-transitions": "false",
  "priority": "8",
  "rpvst-mstp-interconnect-vlan": "<integer>",
  "root": "SECONDARY",
  "transmit-hold-count": "<integer>",
  "traps": [
    "ERRANT_BPDU",
    "ROOT_GUARD"
  ],
  "topology-change-trap": "<boolean>",
  "mstp": [
    {
      "instance-id": "<integer>",
      "priority": "<integer>",
      "vlans": [
        "<integer>",
        "<integer>"
      ],
      "root": "PRIMARY",
      "topology-change-trap": "<boolean>",
      "instance-log-state-transitions": "<boolean>"
    },
    {
      "instance-id": "<integer>",
      "priority": "<integer>",
      "vlans": [
        "<integer>",
        "<integer>"
      ],
      "root": "SECONDARY",
      "topology-change-trap": "<boolean>",
      "instance-log-state-transitions": "<boolean>"
    }
  ],
  "rpvst-auto-enable": "<boolean>",
  "rpvst-auto-priority": "<integer>",
  "rpvst": [
    {
      "vlan": "<integer>",
      "enable": "<boolean>",
      "priority": "<integer>",
      "forward-delay": "<integer>",
      "hello-time": "<integer>",
      "max-age": "<integer>",
      "root": "SECONDARY",
      "topology-change-trap": "<boolean>",
      "vlan-log-state-transitions": "<boolean>"
    },
    {
      "vlan": "<integer>",
      "enable": "<boolean>",
      "priority": "<integer>",
      "forward-delay": "<integer>",
      "hello-time": "<integer>",
      "max-age": "<integer>",
      "root": "PRIMARY",
      "topology-change-trap": "<boolean>",
      "vlan-log-state-transitions": "<boolean>"
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

