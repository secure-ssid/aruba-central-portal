# Get details of gateway uplink

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/gateways/:serial-number/uplinks/:link-tag`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Object containing information about the uplink connected to gateway.


**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "vlanId": 4095,
  "linkTag": "Airtel-IND",
  "health": "Good",
  "healthReasons": [
    "GOOD_PERFORMANCE"
  ],
  "publicIpAddress": "220.227.124.242",
  "privateIpAddress": "10.27.103.87",
  "status": "Up",
  "transport": "Internet",
  "uplinkType": "Active",
  "portName": "Cellular",
  "portSpeed": null,
  "portDuplex": null,
  "wanBackup": "Disabled",
  "modem": {
    "type": "USB",
    "manufacturer": "HPE Aruba Networking",
    "modemSerial": "TWP3L38017",
    "softwareVersion": "21.00.00.00",
    "simState": "Uplink not configured",
    "imei": "869710030202679",
    "imsi": "404450628809754",
    "connectionStatus": "Connected",
    "accessTechnology": "FDD LTE",
    "band": "LTE BAND 3",
    "actSimDetected": "IND airtel",
    "actSimType": "Don't Skip",
    "actSimPhoneNum": "Not Available",
    "standbySim": "Not Detected",
    "cellId": "BC13314 [197210900]",
    "physicalCellId": "303",
    "apn": "Not Available",
    "plmn": "40440",
    "roamingService": "Enabled",
    "gpsStatus": "ON",
    "gpsCoordinates": ", "
  },
  "id": "CG0021253/uplinks/Airtel-IND",
  "type": "network-monitoring/gateway-monitoring"
}
```
---

#### Invalid input received.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 400,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INVALID_INPUT",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 401,
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Forbidden: Access is denied.


**Status:** 403 Forbidden

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 403,
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Not Found error

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 404,
  "errorCode": "HPE_GL_ERROR_NOT_FOUND",
  "message": "Not Found",
  "debugId": "abc-123-456"
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 429,
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Internal server error.


**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 500,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INTERNAL_SERVER_ERROR",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Internal server error.


**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 500,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INTERNAL_SERVER_ERROR",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Invalid input received.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 400,
  "errorCode": "HPE_GL_NETWORK_MONITORING_INVALID_INPUT",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Forbidden: Access is denied.


**Status:** 403 Forbidden

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 403,
  "errorCode": "HPE_GL_ERROR_FORBIDDEN",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Object containing information about the uplink connected to gateway.


**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "vlanId": 4095,
  "linkTag": "Airtel-IND",
  "health": "Good",
  "healthReasons": [
    "GOOD_PERFORMANCE"
  ],
  "publicIpAddress": "220.227.124.242",
  "privateIpAddress": "10.27.103.87",
  "status": "Up",
  "transport": "Internet",
  "uplinkType": "Active",
  "portName": "Cellular",
  "portSpeed": null,
  "portDuplex": null,
  "wanBackup": "Disabled",
  "modem": {
    "type": "USB",
    "manufacturer": "HPE Aruba Networking",
    "modemSerial": "TWP3L38017",
    "softwareVersion": "21.00.00.00",
    "simState": "Uplink not configured",
    "imei": "869710030202679",
    "imsi": "404450628809754",
    "connectionStatus": "Connected",
    "accessTechnology": "FDD LTE",
    "band": "LTE BAND 3",
    "actSimDetected": "IND airtel",
    "actSimType": "Don't Skip",
    "actSimPhoneNum": "Not Available",
    "standbySim": "Not Detected",
    "cellId": "BC13314 [197210900]",
    "physicalCellId": "303",
    "apn": "Not Available",
    "plmn": "40440",
    "roamingService": "Enabled",
    "gpsStatus": "ON",
    "gpsCoordinates": ", "
  },
  "id": "CG0021253/uplinks/Airtel-IND",
  "type": "network-monitoring/gateway-monitoring"
}
```
---

#### Not Found error

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 404,
  "errorCode": "HPE_GL_ERROR_NOT_FOUND",
  "message": "Not Found",
  "debugId": "abc-123-456"
}
```
---

#### Unauthorized request.

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 401,
  "errorCode": "HPE_GL_ERROR_UNAUTHORIZED",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

#### Too Many Requests. Rate limit exceeded.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "httpStatusCode": 429,
  "errorCode": "HPE_GL_ERROR_TOO_MANY_REQUESTS",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

