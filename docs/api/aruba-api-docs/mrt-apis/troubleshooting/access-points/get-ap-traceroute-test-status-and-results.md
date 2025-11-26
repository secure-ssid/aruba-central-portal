# Get AP Traceroute test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/aps/:serial-number/traceroute/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the AP Traceroute test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T13:14:29.148912180Z",
  "progressPercent": 100,
  "output": {
    "resolvedIp": "142.251.46.164",
    "hops": [
      {
        "hop": "1",
        "probes": [
          {
            "responseTimeMilliseconds": "33.799 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.113.225"
          },
          {
            "responseTimeMilliseconds": "0.942 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.113.225"
          },
          {
            "responseTimeMilliseconds": "0.897 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.113.225"
          }
        ]
      },
      {
        "hop": "2",
        "probes": [
          {
            "responseTimeMilliseconds": "0.890 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.113.1"
          },
          {
            "responseTimeMilliseconds": "399.632 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.113.1"
          },
          {
            "responseTimeMilliseconds": "0.887 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.113.1"
          }
        ]
      },
      {
        "hop": "3",
        "probes": [
          {
            "responseTimeMilliseconds": "0.890 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.70.2"
          },
          {
            "responseTimeMilliseconds": "0.795 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.70.2"
          },
          {
            "responseTimeMilliseconds": "997.445 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.70.2"
          }
        ]
      },
      {
        "hop": "4",
        "probes": [
          {
            "responseTimeMilliseconds": "0.889 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.66.2"
          },
          {
            "responseTimeMilliseconds": "0.889 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.66.2"
          },
          {
            "responseTimeMilliseconds": "0.801 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.66.2"
          }
        ]
      },
      {
        "hop": "5",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "6",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "7",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "8",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "9",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "10",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "11",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "12",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "13",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "14",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "15",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "16",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "17",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "18",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "19",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "20",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "21",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "22",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "23",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "24",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "25",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "26",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "27",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "28",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "29",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "30",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      }
    ],
    "destination": "www.google.com"
  },
  "failReason": null,
  "status": "COMPLETED",
  "rawOutput": "\nCOMMAND=traceroute www.google.com\ntraceroute to 142.251.46.164 (142.251.46.164), 30 hops max, 38 byte packets\n 1  10.27.113.225  33.799 ms  0.942 ms  0.897 ms\n 2  10.27.113.1  0.890 ms  399.632 ms  0.887 ms\n 3  10.27.70.2  0.890 ms  0.795 ms  997.445 ms\n 4  10.27.66.2  0.889 ms  0.889 ms  0.801 ms\n 5  * * *\n 6  * * *\n 7  * * *\n 8  * * *\n 9  * * *\n10  * * *\n11  * * *\n12  * * *\n13  * * *\n14  * * *\n15  * * *\n16  * * *\n17  * * *\n18  * * *\n19  * * *\n20  * * *\n21  * * *\n22  * * *\n23  * * *\n24  * * *\n25  * * *\n26  * * *\n27  * * *\n28  * * *\n29  * * *\n30  * * *\n",
  "endTime": "2025-05-20T13:17:07.358841792Z"
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

#### OK. Returns the status and results of the AP Traceroute test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T13:14:29.148912180Z",
  "progressPercent": 100,
  "output": {
    "resolvedIp": "142.251.46.164",
    "hops": [
      {
        "hop": "1",
        "probes": [
          {
            "responseTimeMilliseconds": "33.799 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.113.225"
          },
          {
            "responseTimeMilliseconds": "0.942 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.113.225"
          },
          {
            "responseTimeMilliseconds": "0.897 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.113.225"
          }
        ]
      },
      {
        "hop": "2",
        "probes": [
          {
            "responseTimeMilliseconds": "0.890 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.113.1"
          },
          {
            "responseTimeMilliseconds": "399.632 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.113.1"
          },
          {
            "responseTimeMilliseconds": "0.887 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.113.1"
          }
        ]
      },
      {
        "hop": "3",
        "probes": [
          {
            "responseTimeMilliseconds": "0.890 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.70.2"
          },
          {
            "responseTimeMilliseconds": "0.795 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.70.2"
          },
          {
            "responseTimeMilliseconds": "997.445 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.70.2"
          }
        ]
      },
      {
        "hop": "4",
        "probes": [
          {
            "responseTimeMilliseconds": "0.889 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.66.2"
          },
          {
            "responseTimeMilliseconds": "0.889 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.66.2"
          },
          {
            "responseTimeMilliseconds": "0.801 ms",
            "ipAddress": "null",
            "reverseDnsResolution": "10.27.66.2"
          }
        ]
      },
      {
        "hop": "5",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "6",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "7",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "8",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "9",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "10",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "11",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "12",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "13",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "14",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "15",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "16",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "17",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "18",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "19",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "20",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "21",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "22",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "23",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "24",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "25",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "26",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "27",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "28",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "29",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      },
      {
        "hop": "30",
        "probes": [
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          },
          {
            "responseTimeMilliseconds": "*",
            "ipAddress": "null",
            "reverseDnsResolution": "null"
          }
        ]
      }
    ],
    "destination": "www.google.com"
  },
  "failReason": null,
  "status": "COMPLETED",
  "rawOutput": "\nCOMMAND=traceroute www.google.com\ntraceroute to 142.251.46.164 (142.251.46.164), 30 hops max, 38 byte packets\n 1  10.27.113.225  33.799 ms  0.942 ms  0.897 ms\n 2  10.27.113.1  0.890 ms  399.632 ms  0.887 ms\n 3  10.27.70.2  0.890 ms  0.795 ms  997.445 ms\n 4  10.27.66.2  0.889 ms  0.889 ms  0.801 ms\n 5  * * *\n 6  * * *\n 7  * * *\n 8  * * *\n 9  * * *\n10  * * *\n11  * * *\n12  * * *\n13  * * *\n14  * * *\n15  * * *\n16  * * *\n17  * * *\n18  * * *\n19  * * *\n20  * * *\n21  * * *\n22  * * *\n23  * * *\n24  * * *\n25  * * *\n26  * * *\n27  * * *\n28  * * *\n29  * * *\n30  * * *\n",
  "endTime": "2025-05-20T13:17:07.358841792Z"
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

