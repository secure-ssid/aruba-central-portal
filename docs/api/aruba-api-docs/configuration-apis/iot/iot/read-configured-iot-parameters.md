# Read configured IoT parameters

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/iot`

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
      "radio": [
        {
          "instance-type": "EXTERNAL",
          "radio-name": "<string>",
          "mode": "IOT_RADIO_MODE_OFF",
          "firmware": "SDR",
          "ble-console": "DYNAMIC",
          "ble-opmode": "BEACONING",
          "ble-txpower": "<integer>",
          "zigbee-opmode": "COORDINATOR",
          "zigbee-channel": "<string>",
          "radio-iot-zone": "<string>",
          "zigbee-service-profile": [
            "<string>",
            "<string>"
          ],
          "ble-beacon-profile": [
            "<string>",
            "<string>"
          ]
        },
        {
          "instance-type": "INTERNAL2",
          "radio-name": "<string>",
          "mode": "IOT_RADIO_MODE_ZIGBEE",
          "firmware": "SDR",
          "ble-console": "OFF",
          "ble-opmode": "BEACONING",
          "ble-txpower": "<integer>",
          "zigbee-opmode": "COORDINATOR",
          "zigbee-channel": "<string>",
          "radio-iot-zone": "<string>",
          "zigbee-service-profile": [
            "<string>",
            "<string>"
          ],
          "ble-beacon-profile": [
            "<string>",
            "<string>"
          ]
        }
      ],
      "antenna-gain": "0",
      "iot-zone": "<string>"
    },
    {
      "name": "<string>",
      "description": "<string>",
      "radio": [
        {
          "instance-type": "INTERNAL",
          "radio-name": "<string>",
          "mode": "IOT_RADIO_MODE_BLE",
          "firmware": "SDR",
          "ble-console": "DYNAMIC",
          "ble-opmode": "BEACONING",
          "ble-txpower": "<integer>",
          "zigbee-opmode": "COORDINATOR",
          "zigbee-channel": "<string>",
          "radio-iot-zone": "<string>",
          "zigbee-service-profile": [
            "<string>",
            "<string>"
          ],
          "ble-beacon-profile": [
            "<string>",
            "<string>"
          ]
        },
        {
          "instance-type": "INTERNAL",
          "radio-name": "<string>",
          "mode": "IOT_RADIO_MODE_ZIGBEE",
          "firmware": "DEFAULT",
          "ble-console": "ON",
          "ble-opmode": "BOTH",
          "ble-txpower": "<integer>",
          "zigbee-opmode": "COORDINATOR",
          "zigbee-channel": "<string>",
          "radio-iot-zone": "<string>",
          "zigbee-service-profile": [
            "<string>",
            "<string>"
          ],
          "ble-beacon-profile": [
            "<string>",
            "<string>"
          ]
        }
      ],
      "antenna-gain": "0",
      "iot-zone": "<string>"
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

