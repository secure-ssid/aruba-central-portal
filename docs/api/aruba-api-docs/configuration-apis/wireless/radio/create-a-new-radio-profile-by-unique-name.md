# Create a new radio profile by unique name.

## Request

**Method:** `POST`

**URL:** `{{baseUrl}}/network-config/v1alpha1/radios/:name`

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
  "recovery-mode": "AUTO",
  "radio-modes": [
    {
      "ap-model": "<string>",
      "radio-1st": "BAND_24GHZ",
      "radio-2nd": "BAND_5GHZ",
      "radio-3rd": "BAND_NONE"
    }
  ],
  "enable-external-antennas": "false",
  "antenna-type": "<string>",
  "additional-rf-connectors-or-loss": "false",
  "device": [
    {
      "radio-type": "RADIO_6G",
      "channel-for-2dot4GHz": "CHAN_7P",
      "channel-for-5GHz": "CHAN_100S",
      "channel-for-2nd-5GHz": "CHAN_132P",
      "channel-for-6GHz": "ZERO_CHAN_FOR_6GHZ",
      "channel-for-2nd-6GHz": "CHAN_69_6GHZ_320MHz_1",
      "power": "-127",
      "antenna-gain": "0",
      "additional-loss": "0",
      "effective-gain": "0",
      "antenna-pol": "0"
    }
  ],
  "dynamic-ant": "WIDE",
  "rf-zone": "<string>",
  "ant-direction-mode": "ANT_OMNI",
  "name": "<string>",
  "description": "<string>",
  "radio": [
    {
      "profile": "RADIO_6G",
      "radio-type": "DOT11_6GHZ_TYPE",
      "mode": "ACCESS",
      "enable": "true",
      "legacy-only": "false",
      "ieee802dot11h": "false",
      "advertise-ap-name": "false",
      "beacon-interval": "100",
      "channel-switch-announcement-count": "2",
      "background-spectrum-monitoring": "false",
      "basic-rates": [
        "RATE_54MB"
      ],
      "tx-rates": [
        "RATE_12MB"
      ],
      "beacon-rate": "RATE_6MB",
      "dot11b-protection": "true",
      "iot-coexistence": "true",
      "max-distance": "0",
      "dot11k": "false",
      "mbo": "false",
      "rrm-ie-profile-name": "<string>",
      "dpp-configurator-connectivity": "false",
      "ftm-scan-enable": "false",
      "ftm-scan-ratio": "3",
      "intolerance-40MHz": "false",
      "honor-40MHz-intolerance": "true",
      "csd-override": "false",
      "very-high-throughput": {
        "enable": "true",
        "vht-bw-signaling": "false",
        "vht-txbf-sounding-interval": "0"
      },
      "high-efficiency": {
        "duration-based-rts": "1023",
        "guard-interval": "INTERVAL_ALL",
        "mu-mimo": "true",
        "mu-ofdma": "true",
        "ul-mu-mimo": "false",
        "supported-mcs-map": "<string>",
        "txbf": "true",
        "individual-twt": "true",
        "dynamic-fragmentation-level": "LEVEL_0"
      },
      "extremely-high-throughput": {
        "mu-mimo": "true",
        "ul-mu-mimo": "false",
        "mu-ofdma": "true",
        "txbf": "true"
      },
      "smart-antenna": "false",
      "arm-wids-override": "DYNAMIC",
      "rts-mode": "DEFAULT",
      "frame-bursting-mode": "DYNAMIC",
      "cdc": "false",
      "afc-mode": "LPI",
      "psc-channel-assignment-only": "false",
      "ftm-wider-bandwidth": "false",
      "arm-control": {
        "channels-for-2dot4GHz": [
          "CHAN_9"
        ],
        "channels-for-5GHz": [
          "CHAN_169"
        ],
        "channels-for-6GHz": [
          "CHAN_169_6GHZ"
        ],
        "min-channel-bandwidth": "BW_320MHZ",
        "max-channel-bandwidth": "BW_160MHZ",
        "active-scan": "false",
        "aggressive-scan": "true",
        "backoff-time": "240",
        "channel-quality-aware-arm": "false",
        "channel-quality-threshold": "70",
        "channel-quality-wait-time": "120",
        "error-rate-threshold": "70",
        "error-rate-wait-time": "90",
        "high-noise-backoff-time": "720",
        "ideal-coverage-index": "6",
        "free-channel-index": "25",
        "scanning": "true",
        "zero-wait-dfs": "false",
        "radar-backoff-time": "720",
        "max-tx-power": "21",
        "min-tx-power": "15",
        "scan-interval": "10",
        "ps-aware-scan": "false",
        "init-scan-mode": "false",
        "voip-aware-scan": "true",
        "video-aware-scan": "true"
      },
      "interference-immunity": "2",
      "cell-size-reduction": "0",
      "zone": "<string>"
    }
  ],
  "installation-type": "AUTOMATIC",
  "utb-filter-block": "UTB_6GHZ"
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

