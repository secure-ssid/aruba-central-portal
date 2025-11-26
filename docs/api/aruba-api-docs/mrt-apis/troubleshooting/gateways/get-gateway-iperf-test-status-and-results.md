# Get Gateway Iperf test status and results

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-troubleshooting/v1alpha1/gateways/:serial-number/iperf/async-operations/:task-id`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### OK. Returns the status and results of the Gateway Iperf test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T14:02:29.753198552Z",
  "endTime": "2025-05-20T14:03:27.301496079Z",
  "progressPercent": 100,
  "output": {
    "totalTransferredBytesFromReceiver": "9.14 MBytes",
    "senderBandwidth": "9.58 Mbits/sec",
    "iperfServerAddress": "84.17.57.129",
    "receiverBandwidth": "7.67 Mbits/sec",
    "metrics": [
      {
        "id": "[  4]",
        "bandwidthInbps": "53.9 Mbits/sec",
        "transferSizeInBytes": "6.42 MBytes",
        "intervalInSeconds": "0.00-1.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "1.00-2.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "2.00-3.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "3.00-4.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "21.0 Mbits/sec",
        "transferSizeInBytes": "2.50 MBytes",
        "intervalInSeconds": "4.00-5.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "5.00-6.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "6.00-7.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "7.00-8.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "8.00-9.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "21.0 Mbits/sec",
        "transferSizeInBytes": "2.50 MBytes",
        "intervalInSeconds": "9.00-10.00"
      }
    ],
    "totalTransferredBytesFromSender": "11.4 MBytes"
  },
  "status": "COMPLETED",
  "failReason": null,
  "rawOutput": "\nPerf-test: Finished\n\nMay 20 07:02:29 2025\niperf 3.0.11\nLinux Aruba9004-LTE_E3_E9_30 5.10.209 #92514 SMP PREEMPT Tue Apr 22 14:41:40 PDT 2025 x86_64 GNU/Linux\nTime: Tue, 20 May 2025 14:02:30 GMT\nConnecting to host 84.17.57.129, port 5201\n      Cookie: Aruba9004-LTE_E3_E9_30.1747749749.92\n      TCP MSS: 1448 (default)\n[  4] local 10.27.119.178 port 55312 connected to 84.17.57.129 port 5201\nStarting Test: protocol: TCP, 1 streams, 131072 byte blocks, omitting 0 seconds, 10 second test\n[ ID] Interval           Transfer     Bandwidth       Retr  Cwnd\n[  4]   0.00-1.00   sec  6.42 MBytes  53.9 Mbits/sec    3    618 KBytes       \n[  4]   1.00-2.00   sec  0.00 Bytes  0.00 bits/sec   15    618 KBytes       \n[  4]   2.00-3.00   sec  0.00 Bytes  0.00 bits/sec   15    618 KBytes       \n[  4]   3.00-4.00   sec  0.00 Bytes  0.00 bits/sec   15    618 KBytes       \n[  4]   4.00-5.00   sec  2.50 MBytes  21.0 Mbits/sec   10    339 KBytes       \n[  4]   5.00-6.00   sec  0.00 Bytes  0.00 bits/sec   15    339 KBytes       \n[  4]   6.00-7.00   sec  0.00 Bytes  0.00 bits/sec   15    339 KBytes       \n[  4]   7.00-8.00   sec  0.00 Bytes  0.00 bits/sec   16   5.66 KBytes       \n[  4]   8.00-9.00   sec  0.00 Bytes  0.00 bits/sec   92   14.1 KBytes       \n[  4]   9.00-10.00  sec  2.50 MBytes  21.0 Mbits/sec   43    682 KBytes       \n- - - - - - - - - - - - - - - - - - - - - - - - -\nTest Complete. Summary Results:\n[ ID] Interval           Transfer     Bandwidth       Retr\n[  4]   0.00-10.00  sec  11.4 MBytes  9.58 Mbits/sec  239             sender\n[  4]   0.00-10.00  sec  9.14 MBytes  7.67 Mbits/sec                  receiver\nCPU Utilization: local/sender 1.2% (0.1%u/1.1%s), remote/receiver 0.0% (0.0%u/0.0%s)\n\niperf Done.\n"
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

#### OK. Returns the status and results of the Gateway Iperf test.

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json

**Response Body:**

```json
{
  "startTime": "2025-05-20T14:02:29.753198552Z",
  "endTime": "2025-05-20T14:03:27.301496079Z",
  "progressPercent": 100,
  "output": {
    "totalTransferredBytesFromReceiver": "9.14 MBytes",
    "senderBandwidth": "9.58 Mbits/sec",
    "iperfServerAddress": "84.17.57.129",
    "receiverBandwidth": "7.67 Mbits/sec",
    "metrics": [
      {
        "id": "[  4]",
        "bandwidthInbps": "53.9 Mbits/sec",
        "transferSizeInBytes": "6.42 MBytes",
        "intervalInSeconds": "0.00-1.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "1.00-2.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "2.00-3.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "3.00-4.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "21.0 Mbits/sec",
        "transferSizeInBytes": "2.50 MBytes",
        "intervalInSeconds": "4.00-5.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "5.00-6.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "6.00-7.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "7.00-8.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "0.00 bits/sec",
        "transferSizeInBytes": "0.00 Bytes",
        "intervalInSeconds": "8.00-9.00"
      },
      {
        "id": "[  4]",
        "bandwidthInbps": "21.0 Mbits/sec",
        "transferSizeInBytes": "2.50 MBytes",
        "intervalInSeconds": "9.00-10.00"
      }
    ],
    "totalTransferredBytesFromSender": "11.4 MBytes"
  },
  "status": "COMPLETED",
  "failReason": null,
  "rawOutput": "\nPerf-test: Finished\n\nMay 20 07:02:29 2025\niperf 3.0.11\nLinux Aruba9004-LTE_E3_E9_30 5.10.209 #92514 SMP PREEMPT Tue Apr 22 14:41:40 PDT 2025 x86_64 GNU/Linux\nTime: Tue, 20 May 2025 14:02:30 GMT\nConnecting to host 84.17.57.129, port 5201\n      Cookie: Aruba9004-LTE_E3_E9_30.1747749749.92\n      TCP MSS: 1448 (default)\n[  4] local 10.27.119.178 port 55312 connected to 84.17.57.129 port 5201\nStarting Test: protocol: TCP, 1 streams, 131072 byte blocks, omitting 0 seconds, 10 second test\n[ ID] Interval           Transfer     Bandwidth       Retr  Cwnd\n[  4]   0.00-1.00   sec  6.42 MBytes  53.9 Mbits/sec    3    618 KBytes       \n[  4]   1.00-2.00   sec  0.00 Bytes  0.00 bits/sec   15    618 KBytes       \n[  4]   2.00-3.00   sec  0.00 Bytes  0.00 bits/sec   15    618 KBytes       \n[  4]   3.00-4.00   sec  0.00 Bytes  0.00 bits/sec   15    618 KBytes       \n[  4]   4.00-5.00   sec  2.50 MBytes  21.0 Mbits/sec   10    339 KBytes       \n[  4]   5.00-6.00   sec  0.00 Bytes  0.00 bits/sec   15    339 KBytes       \n[  4]   6.00-7.00   sec  0.00 Bytes  0.00 bits/sec   15    339 KBytes       \n[  4]   7.00-8.00   sec  0.00 Bytes  0.00 bits/sec   16   5.66 KBytes       \n[  4]   8.00-9.00   sec  0.00 Bytes  0.00 bits/sec   92   14.1 KBytes       \n[  4]   9.00-10.00  sec  2.50 MBytes  21.0 Mbits/sec   43    682 KBytes       \n- - - - - - - - - - - - - - - - - - - - - - - - -\nTest Complete. Summary Results:\n[ ID] Interval           Transfer     Bandwidth       Retr\n[  4]   0.00-10.00  sec  11.4 MBytes  9.58 Mbits/sec  239             sender\n[  4]   0.00-10.00  sec  9.14 MBytes  7.67 Mbits/sec                  receiver\nCPU Utilization: local/sender 1.2% (0.1%u/1.1%s), remote/receiver 0.0% (0.0%u/0.0%s)\n\niperf Done.\n"
}
```
---

