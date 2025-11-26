# Get an IDPS threat's details


## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/threats/:id?site-id=12345&timestamp=1730259294489`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| site-id | 12345 | ID of the Site for which Threat detail information is requested
 |
| timestamp | 1730259294489 | The timestamp of the threat occurrence for which threat detail information is requested. |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Object containing information about the threat, such as affected products, attack target, category, CVE reference, description, device MAC, device type, threat ID, impact, malware family, MITRE tags, severity, signature ID, signature name, site ID, site n

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "affectedProducts": "Android",
  "attackTarget": "Client_Endpoint",
  "category": "MOBILE_MALWARE",
  "cveReference": "CVE-2007-0015",
  "description": "Android Mobile Malware is software that is used specifically to compromise the Android operating system",
  "destCity": "New York",
  "deviceMac": "20:4c:03:d3:2b:58",
  "deviceType": "GATEWAY",
  "id": "threat~1734212641997~0~29310-7",
  "impact": "Compromised Workstation",
  "malwareFamily": "Android_SmsThief",
  "mitreTags": [
    {
      "mitreTacticName": "Initial_Access",
      "mitreTechniqueName": "Exploit_Public_Facing_Application"
    },
    {
      "mitreTacticName": "Lateral_Movement",
      "mitreTechniqueName": "Exploitation_Of_Remote_Services"
    }
  ],
  "severity": "Critical",
  "signatureId": 2826904,
  "signatureName": "Trojan-Spy.AndroidOS.SmsThief.fe SMS/Contact Exfil via SMTP",
  "siteId": "9902688897",
  "siteName": "CN-BROOKE-IDPS",
  "srcCity": "Belfast",
  "srcIp": "80.0.0.11",
  "summary": "This alert is triggered when traffic matching a known Command and Control pattern is observed",
  "type": "network-monitoring/idps",
  "userName": "user1"
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

#### Object containing information about the threat, such as affected products, attack target, category, CVE reference, description, device MAC, device type, threat ID, impact, malware family, MITRE tags, severity, signature ID, signature name, site ID, site n

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "affectedProducts": "Android",
  "attackTarget": "Client_Endpoint",
  "category": "MOBILE_MALWARE",
  "cveReference": "CVE-2007-0015",
  "description": "Android Mobile Malware is software that is used specifically to compromise the Android operating system",
  "destCity": "New York",
  "deviceMac": "20:4c:03:d3:2b:58",
  "deviceType": "GATEWAY",
  "id": "threat~1734212641997~0~29310-7",
  "impact": "Compromised Workstation",
  "malwareFamily": "Android_SmsThief",
  "mitreTags": [
    {
      "mitreTacticName": "Initial_Access",
      "mitreTechniqueName": "Exploit_Public_Facing_Application"
    },
    {
      "mitreTacticName": "Lateral_Movement",
      "mitreTechniqueName": "Exploitation_Of_Remote_Services"
    }
  ],
  "severity": "Critical",
  "signatureId": 2826904,
  "signatureName": "Trojan-Spy.AndroidOS.SmsThief.fe SMS/Contact Exfil via SMTP",
  "siteId": "9902688897",
  "siteName": "CN-BROOKE-IDPS",
  "srcCity": "Belfast",
  "srcIp": "80.0.0.11",
  "summary": "This alert is triggered when traffic matching a known Command and Control pattern is observed",
  "type": "network-monitoring/idps",
  "userName": "user1"
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

