# Read configuration of Mesh network topology

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/mesh`

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
  "profile": [
    {
      "name": "<string>",
      "description": "<string>",
      "cluster": [
        {
          "mc-name": "<string>",
          "opmode": "WPA2_PSK",
          "key": "<string>",
          "priority": "1"
        },
        {
          "mc-name": "<string>",
          "opmode": "WPA2_PSK",
          "key": "<string>",
          "priority": "1"
        }
      ],
      "role": "PORTAL",
      "band": "BAND_TYPE_5GHZ",
      "recovery": "<string>",
      "split5g-band-range": "FULL",
      "topology-algorithm": "LOCAL",
      "mobility": "HIGH",
      "a-tx-rates": [
        "RATE_TYPE_36_MPBS",
        "RATE_TYPE_6_MBPS"
      ],
      "max-children": "8",
      "heartbeat-threshold": "10",
      "hop-count": "2",
      "link-threshold": "12",
      "max-retries": "4",
      "mobility-beacon-miss": "16",
      "private-vlan": "0",
      "metric-algorithm": "DISTRIBUTED_TREE_RSSI",
      "optimize-scan-interval": "24",
      "prefer-uplink-radio": "NONE",
      "reselection-mode": "STARTUP_SUBTHRESHOLD",
      "eht-enable": "true",
      "enable": "true",
      "extended-cluster-name": "<string>",
      "extended-cluster-key": "<string>"
    },
    {
      "name": "<string>",
      "description": "<string>",
      "cluster": [
        {
          "mc-name": "<string>",
          "opmode": "WPA3_SAE",
          "key": "<string>",
          "priority": "1"
        },
        {
          "mc-name": "<string>",
          "opmode": "WPA3_SAE",
          "key": "<string>",
          "priority": "1"
        }
      ],
      "role": "PORTAL",
      "band": "BAND_TYPE_5GHZ",
      "recovery": "<string>",
      "split5g-band-range": "FULL",
      "topology-algorithm": "LOCAL",
      "mobility": "<integer>",
      "a-tx-rates": [
        "RATE_TYPE_54_MPBS",
        "RATE_TYPE_6_MBPS"
      ],
      "max-children": "8",
      "heartbeat-threshold": "10",
      "hop-count": "2",
      "link-threshold": "12",
      "max-retries": "4",
      "mobility-beacon-miss": "16",
      "private-vlan": "0",
      "metric-algorithm": "DISTRIBUTED_TREE_RSSI",
      "optimize-scan-interval": "24",
      "prefer-uplink-radio": "NONE",
      "reselection-mode": "STARTUP_SUBTHRESHOLD",
      "eht-enable": "true",
      "enable": "true",
      "extended-cluster-name": "<string>",
      "extended-cluster-key": "<string>"
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

