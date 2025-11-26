# Generate Access Token

## Request

**Method:** `POST`

**URL:** `https://sso.common.cloud.hpe.com/as/token.oauth2`

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Content-Type | application/x-www-form-urlencoded |  |

### Request Body

**URL Encoded:**

- **grant_type**: client_credentials
- **client_id**: {{client_id}}
- **client_secret**: {{client_secret}}

