# Read configured SNMP profiles

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-config/v1alpha1/snmp`

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
      "notify-group": [
        {
          "notify-name": "<string>",
          "tag": "<string>",
          "notify": "INFORM"
        },
        {
          "notify-name": "<string>",
          "tag": "<string>",
          "notify": "INFORM"
        }
      ],
      "target": [
        {
          "params": "<string>",
          "address": "<string>",
          "target-name": "<string>",
          "address-mask": "<string>",
          "filter": "ALL",
          "max-message-size": "1472",
          "udp-port": "162",
          "ports": [
            "<integer>",
            "<integer>"
          ],
          "retries": "3",
          "timeout": "1500",
          "management-interface": "false",
          "tags": [
            "<string>",
            "<string>"
          ]
        },
        {
          "params": "<string>",
          "address": "<string>",
          "target-name": "<string>",
          "address-mask": "<string>",
          "filter": "NOTINFO",
          "max-message-size": "1472",
          "udp-port": "162",
          "ports": [
            "<integer>",
            "<integer>"
          ],
          "retries": "3",
          "timeout": "1500",
          "management-interface": "false",
          "tags": [
            "<string>",
            "<string>"
          ]
        }
      ],
      "group": [
        {
          "group-name-user": "<string>",
          "snmp-version": "V2C"
        },
        {
          "group-name-user": "<string>",
          "snmp-version": "V3"
        }
      ],
      "macsecmib": "ALLOW",
      "switchauthmib": "INCLUDE",
      "ieee8021mib": "BLOCK",
      "param": [
        {
          "user": "<string>",
          "version": "V2C",
          "msg-processing": "V2C",
          "method": "AUTH_PRIV",
          "param-name": "<string>"
        },
        {
          "user": "<string>",
          "version": "V3",
          "msg-processing": "V3",
          "method": "AUTH_NO_PRIV",
          "param-name": "<string>"
        }
      ],
      "v3-community": [
        {
          "v3-community-name": "<string>",
          "security": "<string>",
          "index": "<string>",
          "tag": "<string>"
        },
        {
          "v3-community-name": "<string>",
          "security": "<string>",
          "index": "<string>",
          "tag": "<string>"
        }
      ],
      "name": "<string>",
      "description": "<string>",
      "v1-enable": "true",
      "v2c-enable": "true",
      "v3-enable": "false",
      "trap-enable": "true",
      "inform-queue-length": "250",
      "enable-snmpv3-only": "<boolean>",
      "unique-req-id-enable": "<boolean>",
      "agent-port": "161",
      "auth-privacy-security-level": "<boolean>",
      "auth-security-level": "<boolean>",
      "response-source": "<string>",
      "loopback-interface": "<integer>",
      "trap-interface": "<integer>",
      "stats-enable": "false",
      "snmp-source-controller-ip": "false",
      "trap-source": "<string>",
      "listen": "BOTH",
      "context": [
        {
          "vrf": "<string>",
          "context-name": "<string>",
          "type": "VRF",
          "community": "<string>"
        },
        {
          "vrf": "<string>",
          "context-name": "<string>",
          "type": "OSPFV2",
          "community": "<string>"
        }
      ],
      "view": [
        {
          "type": "INCLUDE",
          "view-name-oid-tree-mask": "<string>"
        },
        {
          "type": "INCLUDE",
          "view-name-oid-tree-mask": "<string>"
        }
      ],
      "community": [
        {
          "community": "<string>",
          "access-level": "RO",
          "policy-ipv4": "<string>",
          "policy-ipv6": "<string>",
          "access-mode": "MANAGER",
          "view-name": "<string>"
        },
        {
          "community": "<string>",
          "access-level": "RW",
          "policy-ipv4": "<string>",
          "policy-ipv6": "<string>",
          "access-mode": "MANAGER",
          "view-name": "<string>"
        }
      ],
      "user": [
        {
          "auth-password": "<string>",
          "privacy-password": "<string>",
          "user-name": "<string>",
          "auth-protocol": "SHA512",
          "auth-pass-text": "PLAINTEXT",
          "auth-pass-cypher": "<string>",
          "privacy-protocol": "DES",
          "priv-pass-cypher": "<string>",
          "access-level": "RW",
          "access-mode": "MANAGER",
          "auth-required": "<boolean>",
          "privacy-required": "<boolean>",
          "view-name": "<string>",
          "context": "<string>"
        },
        {
          "auth-password": "<string>",
          "privacy-password": "<string>",
          "user-name": "<string>",
          "auth-protocol": "SHA384",
          "auth-pass-text": "PLAINTEXT",
          "auth-pass-cypher": "<string>",
          "privacy-protocol": "AES192",
          "priv-pass-cypher": "<string>",
          "access-level": "RW",
          "access-mode": "OPERATOR",
          "auth-required": "<boolean>",
          "privacy-required": "<boolean>",
          "view-name": "<string>",
          "context": "<string>"
        }
      ],
      "remote-user": [
        {
          "auth-password": "<string>",
          "privacy-password": "<string>",
          "engine-id-username": "<string>",
          "engine-id": "<string>",
          "username": "<string>",
          "auth-protocol": "SHA256",
          "privacy-protocol": "DES"
        },
        {
          "auth-password": "<string>",
          "privacy-password": "<string>",
          "engine-id-username": "<string>",
          "engine-id": "<string>",
          "username": "<string>",
          "auth-protocol": "SHA1",
          "privacy-protocol": "AES256"
        }
      ],
      "restricted-access": "false",
      "vrf": [
        "<string>",
        "<string>"
      ],
      "notification-receiver": [
        {
          "inform": "<boolean>",
          "host-port-version-receiver-name-vrf": "<string>",
          "management-interface": "false",
          "trap-level": "NOTINFO",
          "interval": "<long>",
          "retrycount": "<long>",
          "host-engineid": "<string>",
          "trap-profile": "<string>",
          "trap-group": [
            "<string>",
            "<string>"
          ],
          "notification-type": [
            "LLDP_NOTF",
            "ALARM_NOTF"
          ]
        },
        {
          "inform": "<boolean>",
          "host-port-version-receiver-name-vrf": "<string>",
          "management-interface": "false",
          "trap-level": "CRITICAL",
          "interval": "<long>",
          "retrycount": "<long>",
          "host-engineid": "<string>",
          "trap-profile": "<string>",
          "trap-group": [
            "<string>",
            "<string>"
          ],
          "notification-type": [
            "INTERFACE_NOTF",
            "RPVST_NOTF"
          ]
        }
      ],
      "snmp-response-source": [
        {
          "source-ipv4": "<string>",
          "source-ipv6": "<string>",
          "ethernet-interface": "<string>",
          "lag-interface": "<string>",
          "vlan-interface": "<integer>",
          "loopback-interface": "<integer>",
          "vrf": "<string>"
        },
        {
          "source-ipv4": "<string>",
          "source-ipv6": "<string>",
          "ethernet-interface": "<string>",
          "lag-interface": "<string>",
          "vlan-interface": "<integer>",
          "loopback-interface": "<integer>",
          "vrf": "<string>"
        }
      ],
      "snmp-trap-source": [
        {
          "source-ipv4": "<string>",
          "source-ipv6": "<string>",
          "ethernet-interface": "<string>",
          "lag-interface": "<string>",
          "vlan-interface": "<integer>",
          "loopback-interface": "<integer>",
          "vrf": "<string>"
        },
        {
          "source-ipv4": "<string>",
          "source-ipv6": "<string>",
          "ethernet-interface": "<string>",
          "lag-interface": "<string>",
          "vlan-interface": "<integer>",
          "loopback-interface": "<integer>",
          "vrf": "<string>"
        }
      ],
      "vrrp-id": "<integer>"
    },
    {
      "notify-group": [
        {
          "notify-name": "<string>",
          "tag": "<string>",
          "notify": "TRAP"
        },
        {
          "notify-name": "<string>",
          "tag": "<string>",
          "notify": "TRAP"
        }
      ],
      "target": [
        {
          "params": "<string>",
          "address": "<string>",
          "target-name": "<string>",
          "address-mask": "<string>",
          "filter": "ALL",
          "max-message-size": "1472",
          "udp-port": "162",
          "ports": [
            "<integer>",
            "<integer>"
          ],
          "retries": "3",
          "timeout": "1500",
          "management-interface": "false",
          "tags": [
            "<string>",
            "<string>"
          ]
        },
        {
          "params": "<string>",
          "address": "<string>",
          "target-name": "<string>",
          "address-mask": "<string>",
          "filter": "DEBUG",
          "max-message-size": "1472",
          "udp-port": "162",
          "ports": [
            "<integer>",
            "<integer>"
          ],
          "retries": "3",
          "timeout": "1500",
          "management-interface": "false",
          "tags": [
            "<string>",
            "<string>"
          ]
        }
      ],
      "group": [
        {
          "group-name-user": "<string>",
          "snmp-version": "V3"
        },
        {
          "group-name-user": "<string>",
          "snmp-version": "V3"
        }
      ],
      "macsecmib": "ALLOW",
      "switchauthmib": "EXCLUDE",
      "ieee8021mib": "ALLOW",
      "param": [
        {
          "user": "<string>",
          "version": "V3",
          "msg-processing": "V1",
          "method": "AUTH_PRIV",
          "param-name": "<string>"
        },
        {
          "user": "<string>",
          "version": "V1",
          "msg-processing": "V3",
          "method": "AUTH_PRIV",
          "param-name": "<string>"
        }
      ],
      "v3-community": [
        {
          "v3-community-name": "<string>",
          "security": "<string>",
          "index": "<string>",
          "tag": "<string>"
        },
        {
          "v3-community-name": "<string>",
          "security": "<string>",
          "index": "<string>",
          "tag": "<string>"
        }
      ],
      "name": "<string>",
      "description": "<string>",
      "v1-enable": "true",
      "v2c-enable": "true",
      "v3-enable": "false",
      "trap-enable": "true",
      "inform-queue-length": "250",
      "enable-snmpv3-only": "<boolean>",
      "unique-req-id-enable": "<boolean>",
      "agent-port": "161",
      "auth-privacy-security-level": "<boolean>",
      "auth-security-level": "<boolean>",
      "response-source": "<string>",
      "loopback-interface": "<integer>",
      "trap-interface": "<integer>",
      "stats-enable": "false",
      "snmp-source-controller-ip": "false",
      "trap-source": "DEST_IP_ADDRESS",
      "listen": "DATA",
      "context": [
        {
          "vrf": "<string>",
          "context-name": "<string>",
          "type": "OSPFV3",
          "community": "<string>"
        },
        {
          "vrf": "<string>",
          "context-name": "<string>",
          "type": "OSPFV2",
          "community": "<string>"
        }
      ],
      "view": [
        {
          "type": "EXCLUDE",
          "view-name-oid-tree-mask": "<string>"
        },
        {
          "type": "EXCLUDE",
          "view-name-oid-tree-mask": "<string>"
        }
      ],
      "community": [
        {
          "community": "<string>",
          "access-level": "RW",
          "policy-ipv4": "<string>",
          "policy-ipv6": "<string>",
          "access-mode": "MANAGER",
          "view-name": "<string>"
        },
        {
          "community": "<string>",
          "access-level": "RW",
          "policy-ipv4": "<string>",
          "policy-ipv6": "<string>",
          "access-mode": "OPERATOR",
          "view-name": "<string>"
        }
      ],
      "user": [
        {
          "auth-password": "<string>",
          "privacy-password": "<string>",
          "user-name": "<string>",
          "auth-protocol": "SHA1",
          "auth-pass-text": "PLAINTEXT",
          "auth-pass-cypher": "<string>",
          "privacy-protocol": "DES",
          "priv-pass-cypher": "<string>",
          "access-level": "RO",
          "access-mode": "MANAGER",
          "auth-required": "<boolean>",
          "privacy-required": "<boolean>",
          "view-name": "<string>",
          "context": "<string>"
        },
        {
          "auth-password": "<string>",
          "privacy-password": "<string>",
          "user-name": "<string>",
          "auth-protocol": "SHA1",
          "auth-pass-text": "PLAINTEXT",
          "auth-pass-cypher": "<string>",
          "privacy-protocol": "AES256",
          "priv-pass-cypher": "<string>",
          "access-level": "RW",
          "access-mode": "OPERATOR",
          "auth-required": "<boolean>",
          "privacy-required": "<boolean>",
          "view-name": "<string>",
          "context": "<string>"
        }
      ],
      "remote-user": [
        {
          "auth-password": "<string>",
          "privacy-password": "<string>",
          "engine-id-username": "<string>",
          "engine-id": "<string>",
          "username": "<string>",
          "auth-protocol": "SHA384",
          "privacy-protocol": "AES256"
        },
        {
          "auth-password": "<string>",
          "privacy-password": "<string>",
          "engine-id-username": "<string>",
          "engine-id": "<string>",
          "username": "<string>",
          "auth-protocol": "SHA384",
          "privacy-protocol": "DES"
        }
      ],
      "restricted-access": "false",
      "vrf": [
        "<string>",
        "<string>"
      ],
      "notification-receiver": [
        {
          "inform": "<boolean>",
          "host-port-version-receiver-name-vrf": "<string>",
          "management-interface": "false",
          "trap-level": "DEBUG",
          "interval": "<long>",
          "retrycount": "<long>",
          "host-engineid": "<string>",
          "trap-profile": "<string>",
          "trap-group": [
            "<string>",
            "<string>"
          ],
          "notification-type": [
            "SNMP_NOTF",
            "VRRP_NOTF"
          ]
        },
        {
          "inform": "<boolean>",
          "host-port-version-receiver-name-vrf": "<string>",
          "management-interface": "false",
          "trap-level": "DEBUG",
          "interval": "<long>",
          "retrycount": "<long>",
          "host-engineid": "<string>",
          "trap-profile": "<string>",
          "trap-group": [
            "<string>",
            "<string>"
          ],
          "notification-type": [
            "FAN_NOTF",
            "OSPFV3_NOTF"
          ]
        }
      ],
      "snmp-response-source": [
        {
          "source-ipv4": "<string>",
          "source-ipv6": "<string>",
          "ethernet-interface": "<string>",
          "lag-interface": "<string>",
          "vlan-interface": "<integer>",
          "loopback-interface": "<integer>",
          "vrf": "<string>"
        },
        {
          "source-ipv4": "<string>",
          "source-ipv6": "<string>",
          "ethernet-interface": "<string>",
          "lag-interface": "<string>",
          "vlan-interface": "<integer>",
          "loopback-interface": "<integer>",
          "vrf": "<string>"
        }
      ],
      "snmp-trap-source": [
        {
          "source-ipv4": "<string>",
          "source-ipv6": "<string>",
          "ethernet-interface": "<string>",
          "lag-interface": "<string>",
          "vlan-interface": "<integer>",
          "loopback-interface": "<integer>",
          "vrf": "<string>"
        },
        {
          "source-ipv4": "<string>",
          "source-ipv6": "<string>",
          "ethernet-interface": "<string>",
          "lag-interface": "<string>",
          "vlan-interface": "<integer>",
          "loopback-interface": "<integer>",
          "vrf": "<string>"
        }
      ],
      "vrrp-id": "<integer>"
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

