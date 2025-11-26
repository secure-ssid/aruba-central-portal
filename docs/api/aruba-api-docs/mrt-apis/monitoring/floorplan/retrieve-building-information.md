# Retrieve building information

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/sitemaps/:site-id/buildings`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Returns the Building information

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "items": [
    {
      "id": "3b5b-0e6c-4b73-9f6e-4e895a080190",
      "type": "feature",
      "buildingId": "123a-aad7-4070-8a19-fd6b8e1ff012",
      "floors": [
        {
          "id": "string",
          "type": "feature",
          "floorId": "a0de790f-fe40-e11a-4679-5587c762ca27",
          "properties": {
            "name": "string",
            "ordinal": 1807.1018005116234,
            "length": 6867.013289965674,
            "breadth": 5047.105416553366,
            "buildingId": "1bdf3423-c751-9dcc-61cd-db19ee727648",
            "siteId": "cd1530fd-4e6c-356d-9985-6ece0a5a01b2"
          },
          "tenantId": "string"
        },
        {
          "id": "string",
          "type": "feature",
          "floorId": "aebd17b6-1024-d09b-d072-fa68e7a47ed3",
          "properties": {
            "name": "string",
            "ordinal": 311.58402853326714,
            "length": 4476.765538448762,
            "breadth": 6617.412281425199,
            "buildingId": "ccc7fa08-2562-c5a8-44bf-6b156ef41cab",
            "siteId": "d745be2b-92f6-b331-90a0-e32e599df1a6"
          },
          "tenantId": "string"
        }
      ],
      "properties": {
        "name": "string"
      }
    },
    {
      "id": "3b5b-0e6c-4b73-9f6e-4e895a080190",
      "type": "feature",
      "buildingId": "123a-aad7-4070-8a19-fd6b8e1ff012",
      "floors": [
        {
          "id": "string",
          "type": "feature",
          "floorId": "6ddd024c-3002-0d73-1192-3a8ba2e07a78",
          "properties": {
            "name": "string",
            "ordinal": 2459.986449016507,
            "length": 4700.280239914751,
            "breadth": 8459.877671643833,
            "buildingId": "abac5434-1e57-3fc6-24c8-661b53770746",
            "siteId": "341b50b7-4e7b-297f-3677-37469219a26a"
          },
          "tenantId": "string"
        },
        {
          "id": "string",
          "type": "feature",
          "floorId": "c4971ca2-fc7c-4509-816d-ab4273be4503",
          "properties": {
            "name": "string",
            "ordinal": 7601.140944032074,
            "length": 5312.593094385507,
            "breadth": 2394.277906980371,
            "buildingId": "eb241efd-7804-ed47-b9df-cd935afafdc6",
            "siteId": "6e94a0f3-2b45-ad26-d297-12268fe3c0d3"
          },
          "tenantId": "string"
        }
      ],
      "properties": {
        "name": "string"
      }
    }
  ],
  "count": 1
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

#### Returns the Building information

**Status:** 200 OK

**Response Headers:**

- `Content-Type`: application/json
- `X-RateLimit-Limit`: 
- `X-RateLimit-Remaining`: 
- `X-RateLimit-Reset`: 

**Response Body:**

```json
{
  "items": [
    {
      "id": "3b5b-0e6c-4b73-9f6e-4e895a080190",
      "type": "feature",
      "buildingId": "123a-aad7-4070-8a19-fd6b8e1ff012",
      "floors": [
        {
          "id": "string",
          "type": "feature",
          "floorId": "a0de790f-fe40-e11a-4679-5587c762ca27",
          "properties": {
            "name": "string",
            "ordinal": 1807.1018005116234,
            "length": 6867.013289965674,
            "breadth": 5047.105416553366,
            "buildingId": "1bdf3423-c751-9dcc-61cd-db19ee727648",
            "siteId": "cd1530fd-4e6c-356d-9985-6ece0a5a01b2"
          },
          "tenantId": "string"
        },
        {
          "id": "string",
          "type": "feature",
          "floorId": "aebd17b6-1024-d09b-d072-fa68e7a47ed3",
          "properties": {
            "name": "string",
            "ordinal": 311.58402853326714,
            "length": 4476.765538448762,
            "breadth": 6617.412281425199,
            "buildingId": "ccc7fa08-2562-c5a8-44bf-6b156ef41cab",
            "siteId": "d745be2b-92f6-b331-90a0-e32e599df1a6"
          },
          "tenantId": "string"
        }
      ],
      "properties": {
        "name": "string"
      }
    },
    {
      "id": "3b5b-0e6c-4b73-9f6e-4e895a080190",
      "type": "feature",
      "buildingId": "123a-aad7-4070-8a19-fd6b8e1ff012",
      "floors": [
        {
          "id": "string",
          "type": "feature",
          "floorId": "6ddd024c-3002-0d73-1192-3a8ba2e07a78",
          "properties": {
            "name": "string",
            "ordinal": 2459.986449016507,
            "length": 4700.280239914751,
            "breadth": 8459.877671643833,
            "buildingId": "abac5434-1e57-3fc6-24c8-661b53770746",
            "siteId": "341b50b7-4e7b-297f-3677-37469219a26a"
          },
          "tenantId": "string"
        },
        {
          "id": "string",
          "type": "feature",
          "floorId": "c4971ca2-fc7c-4509-816d-ab4273be4503",
          "properties": {
            "name": "string",
            "ordinal": 7601.140944032074,
            "length": 5312.593094385507,
            "breadth": 2394.277906980371,
            "buildingId": "eb241efd-7804-ed47-b9df-cd935afafdc6",
            "siteId": "6e94a0f3-2b45-ad26-d297-12268fe3c0d3"
          },
          "tenantId": "string"
        }
      ],
      "properties": {
        "name": "string"
      }
    }
  ],
  "count": 1
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

