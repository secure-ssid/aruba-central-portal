# Get CX Switch Http test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/cx/:serial-number/http/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the CX Switch Http test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "failReason": null,
  "status": "COMPLETED",
  "startTime": "2025-05-21T09:03:10.639546402Z",
  "endTime": "2025-05-21T09:03:51.160435814Z",
  "output": {
    "destination": "https://switch1.google.com",
    "statistics": {
      "destinationAddressUnreachableCount": 0,
      "dnsResolutionFailures": 0,
      "probesTimedOut": 0,
      "probesTransmitted": 2,
      "transmissionError": 0,
      "socketReceiveError": 0,
      "bindError": 0,
      "dnsFormatError": null,
      "dnsServerFailure": null,
      "dnsNonExistentDomain": null,
      "dnsNotImplemented": null,
      "dnsQueryRefused": null,
      "dnsNameExists": null,
      "dnsRrsetExists": null,
      "dnsNotAuthoritative": null,
      "dnsNotZone": null,
      "dhcpFailed": null,
      "dhcpNoOffer": null,
      "dhcpNack": null
    },
    "results": {
      "packetsTransmitted": 1,
      "packetsReceived": 1,
      "minimumRttInMilliseconds": 0,
      "maximumRttInMilliseconds": 0,
      "averageRttInMilliseconds": 0,
      "httpTransactionRttInMilliseconds": null,
      "dnsRttInMilliseconds": 0,
      "dnsError": null,
      "httpError": null,
      "resolvedIp": null,
      "dhcpServerIp": null
    }
  },
  "progressPercent": 100
}
```
---

#### Bad Request. Validation errors in the request body or parameters, or invalid parameters for the specific device.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_BAD_REQUEST",
  "message": "Validation errors - packetSize must be between 10 and 2000"
}
```
---

#### Unauthorized. Authentication credentials are required or invalid.

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_UNAUTHORIZED",
  "message": "Authentication required."
}
```
---

#### Not Found. The specified async task ID or device serial was not found for this operation type.

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_TASK_NOT_FOUND",
  "message": "Async operation task not found: c7a3f2d1-e8a9-4b7c-8d1e-0f9a3b2c1d0e"
}
```
---

#### Too Many Requests. The user has sent too many requests in a given amount of time.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_TOO_MANY_REQUESTS",
  "message": "Rate limit exceeded."
}
```
---

#### Internal Server Error. An unexpected error occurred on the server.

**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred."
}
```
---

#### Too Many Requests. The user has sent too many requests in a given amount of time.

**Status:** 429 Too Many Requests

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_TOO_MANY_REQUESTS",
  "message": "Rate limit exceeded."
}
```
---

#### Internal Server Error. An unexpected error occurred on the server.

**Status:** 500 Internal Server Error

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred."
}
```
---

#### Bad Request. Validation errors in the request body or parameters, or invalid parameters for the specific device.

**Status:** 400 Bad Request

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_BAD_REQUEST",
  "message": "Validation errors - packetSize must be between 10 and 2000"
}
```
---

#### OK. Returns the status and results of the CX Switch Http test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "failReason": null,
  "status": "COMPLETED",
  "startTime": "2025-05-21T09:03:10.639546402Z",
  "endTime": "2025-05-21T09:03:51.160435814Z",
  "output": {
    "destination": "https://switch1.google.com",
    "statistics": {
      "destinationAddressUnreachableCount": 0,
      "dnsResolutionFailures": 0,
      "probesTimedOut": 0,
      "probesTransmitted": 2,
      "transmissionError": 0,
      "socketReceiveError": 0,
      "bindError": 0,
      "dnsFormatError": null,
      "dnsServerFailure": null,
      "dnsNonExistentDomain": null,
      "dnsNotImplemented": null,
      "dnsQueryRefused": null,
      "dnsNameExists": null,
      "dnsRrsetExists": null,
      "dnsNotAuthoritative": null,
      "dnsNotZone": null,
      "dhcpFailed": null,
      "dhcpNoOffer": null,
      "dhcpNack": null
    },
    "results": {
      "packetsTransmitted": 1,
      "packetsReceived": 1,
      "minimumRttInMilliseconds": 0,
      "maximumRttInMilliseconds": 0,
      "averageRttInMilliseconds": 0,
      "httpTransactionRttInMilliseconds": null,
      "dnsRttInMilliseconds": 0,
      "dnsError": null,
      "httpError": null,
      "resolvedIp": null,
      "dhcpServerIp": null
    }
  },
  "progressPercent": 100
}
```
---

#### Not Found. The specified async task ID or device serial was not found for this operation type.

**Status:** 404 Not Found

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_TASK_NOT_FOUND",
  "message": "Async operation task not found: c7a3f2d1-e8a9-4b7c-8d1e-0f9a3b2c1d0e"
}
```
---

#### Unauthorized. Authentication credentials are required or invalid.

**Status:** 401 Unauthorized

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "errorCode": "HPE_GRAVITY_UNAUTHORIZED",
  "message": "Authentication required."
}
```
---

