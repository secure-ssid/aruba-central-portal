# Returns stack member details for the given stack-id.

## Request

**Method:** `GET`

**URL:** `{{baseUrl}}/network-monitoring/v1alpha1/stack/:stack-id/members?site-id=2345678`

### Query Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| site-id | 2345678 | ID of the site for which switch-related information is requested. |

### Headers

| Key | Value | Description |
|-----|-------|-------------|
| Accept | application/json |  |

### Response Examples

#### Object containing the stack member information

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
      "id": "stack-12345",
      "type": "stack-members",
      "topology": "Ring",
      "stackType": "Virtual",
      "members": [
        {
          "id": "CN31HKZ0CN",
          "type": "switch",
          "switchLinkType": "BPS",
          "recommendation": [
            "Update firmware",
            "Check connection stability"
          ],
          "switchType": "pvos",
          "stpEnable": true,
          "stpMode": "RSTP",
          "serial": "AP00000001",
          "ipv4": "10.21.78.3",
          "status": "Online",
          "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
          "macAddress": "11:22:33:44:66:60",
          "publicIp": "59.144.73.163",
          "model": "AS-2930M",
          "stackId": "01000c97-5f80e1c0",
          "health": "Poor",
          "healthReasons": {
            "poorReasons": [
              "High packet loss",
              "Frequent disconnections"
            ],
            "fairReasons": [
              "Moderate latency",
              "Occasional errors"
            ],
            "primaryReason": {
              "reasonEnum": "None",
              "typeId": "None",
              "totalReasons": 225
            }
          },
          "siteId": "24833497",
          "upTime": 1702794777,
          "rebootTs": 1627873200,
          "firmwareVersion": "8.6.0.0",
          "deployment": "Standalone",
          "firmwareUpdatedTs": 1627873200,
          "firmwareBackupVersion": "8.5.0.0",
          "firmwareStatus": "Updated",
          "firmwareRecommendedVersion": "8.6.1.0",
          "contact": "admin@company.com",
          "jNumber": "J123456",
          "lastSeen": 1627873200,
          "managementVlan": 1,
          "nativeVlan": 10,
          "configStatus": "Pending",
          "deviceName": "Switch-01",
          "switchRole": "Core",
          "manufacturer": "Aruba",
          "location": "Data Center 1",
          "stackMemberId": 1,
          "stackMemberStatus": "Active",
          "stackMemberPriority": 15,
          "lastConfigChange": 1627873200,
          "lastRestartReason": "Software upgrade"
        },
        {
          "id": "CN31HKZ0CN",
          "type": "switch",
          "switchLinkType": "BPS",
          "recommendation": [
            "Update firmware",
            "Check connection stability"
          ],
          "switchType": "pvos",
          "stpEnable": true,
          "stpMode": "RSTP",
          "serial": "AP00000001",
          "ipv4": "10.21.78.3",
          "status": "Online",
          "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
          "macAddress": "11:22:33:44:66:60",
          "publicIp": "59.144.73.163",
          "model": "AS-2930M",
          "stackId": "01000c97-5f80e1c0",
          "health": "Poor",
          "healthReasons": {
            "poorReasons": [
              "High packet loss",
              "Frequent disconnections"
            ],
            "fairReasons": [
              "Moderate latency",
              "Occasional errors"
            ],
            "primaryReason": {
              "reasonEnum": "None",
              "typeId": "None",
              "totalReasons": 2385
            }
          },
          "siteId": "24833497",
          "upTime": 1702794777,
          "rebootTs": 1627873200,
          "firmwareVersion": "8.6.0.0",
          "deployment": "Standalone",
          "firmwareUpdatedTs": 1627873200,
          "firmwareBackupVersion": "8.5.0.0",
          "firmwareStatus": "Updated",
          "firmwareRecommendedVersion": "8.6.1.0",
          "contact": "admin@company.com",
          "jNumber": "J123456",
          "lastSeen": 1627873200,
          "managementVlan": 1,
          "nativeVlan": 10,
          "configStatus": "Pending",
          "deviceName": "Switch-01",
          "switchRole": "Core",
          "manufacturer": "Aruba",
          "location": "Data Center 1",
          "stackMemberId": 1,
          "stackMemberStatus": "Active",
          "stackMemberPriority": 15,
          "lastConfigChange": 1627873200,
          "lastRestartReason": "Software upgrade"
        }
      ],
      "portLinks": [
        {
          "serial": "CN31HKZ0CN",
          "links": [
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            },
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            }
          ]
        },
        {
          "serial": "CN31HKZ0CN",
          "links": [
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            },
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            }
          ]
        }
      ]
    },
    {
      "id": "stack-12345",
      "type": "stack-members",
      "topology": "Ring",
      "stackType": "Virtual",
      "members": [
        {
          "id": "CN31HKZ0CN",
          "type": "switch",
          "switchLinkType": "BPS",
          "recommendation": [
            "Update firmware",
            "Check connection stability"
          ],
          "switchType": "pvos",
          "stpEnable": true,
          "stpMode": "RSTP",
          "serial": "AP00000001",
          "ipv4": "10.21.78.3",
          "status": "Online",
          "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
          "macAddress": "11:22:33:44:66:60",
          "publicIp": "59.144.73.163",
          "model": "AS-2930M",
          "stackId": "01000c97-5f80e1c0",
          "health": "Poor",
          "healthReasons": {
            "poorReasons": [
              "High packet loss",
              "Frequent disconnections"
            ],
            "fairReasons": [
              "Moderate latency",
              "Occasional errors"
            ],
            "primaryReason": {
              "reasonEnum": "None",
              "typeId": "None",
              "totalReasons": 4273
            }
          },
          "siteId": "24833497",
          "upTime": 1702794777,
          "rebootTs": 1627873200,
          "firmwareVersion": "8.6.0.0",
          "deployment": "Standalone",
          "firmwareUpdatedTs": 1627873200,
          "firmwareBackupVersion": "8.5.0.0",
          "firmwareStatus": "Updated",
          "firmwareRecommendedVersion": "8.6.1.0",
          "contact": "admin@company.com",
          "jNumber": "J123456",
          "lastSeen": 1627873200,
          "managementVlan": 1,
          "nativeVlan": 10,
          "configStatus": "Pending",
          "deviceName": "Switch-01",
          "switchRole": "Core",
          "manufacturer": "Aruba",
          "location": "Data Center 1",
          "stackMemberId": 1,
          "stackMemberStatus": "Active",
          "stackMemberPriority": 15,
          "lastConfigChange": 1627873200,
          "lastRestartReason": "Software upgrade"
        },
        {
          "id": "CN31HKZ0CN",
          "type": "switch",
          "switchLinkType": "BPS",
          "recommendation": [
            "Update firmware",
            "Check connection stability"
          ],
          "switchType": "pvos",
          "stpEnable": true,
          "stpMode": "RSTP",
          "serial": "AP00000001",
          "ipv4": "10.21.78.3",
          "status": "Online",
          "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
          "macAddress": "11:22:33:44:66:60",
          "publicIp": "59.144.73.163",
          "model": "AS-2930M",
          "stackId": "01000c97-5f80e1c0",
          "health": "Poor",
          "healthReasons": {
            "poorReasons": [
              "High packet loss",
              "Frequent disconnections"
            ],
            "fairReasons": [
              "Moderate latency",
              "Occasional errors"
            ],
            "primaryReason": {
              "reasonEnum": "None",
              "typeId": "None",
              "totalReasons": 4599
            }
          },
          "siteId": "24833497",
          "upTime": 1702794777,
          "rebootTs": 1627873200,
          "firmwareVersion": "8.6.0.0",
          "deployment": "Standalone",
          "firmwareUpdatedTs": 1627873200,
          "firmwareBackupVersion": "8.5.0.0",
          "firmwareStatus": "Updated",
          "firmwareRecommendedVersion": "8.6.1.0",
          "contact": "admin@company.com",
          "jNumber": "J123456",
          "lastSeen": 1627873200,
          "managementVlan": 1,
          "nativeVlan": 10,
          "configStatus": "Pending",
          "deviceName": "Switch-01",
          "switchRole": "Core",
          "manufacturer": "Aruba",
          "location": "Data Center 1",
          "stackMemberId": 1,
          "stackMemberStatus": "Active",
          "stackMemberPriority": 15,
          "lastConfigChange": 1627873200,
          "lastRestartReason": "Software upgrade"
        }
      ],
      "portLinks": [
        {
          "serial": "CN31HKZ0CN",
          "links": [
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            },
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            }
          ]
        },
        {
          "serial": "CN31HKZ0CN",
          "links": [
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            },
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            }
          ]
        }
      ]
    }
  ],
  "count": 3
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

#### Device with serial number not found.

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
  "errorCode": "HPE_GL_NETWORK_MONITORING_THREAT_NOT_FOUND",
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

#### Object containing the stack member information

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
      "id": "stack-12345",
      "type": "stack-members",
      "topology": "Ring",
      "stackType": "Virtual",
      "members": [
        {
          "id": "CN31HKZ0CN",
          "type": "switch",
          "switchLinkType": "BPS",
          "recommendation": [
            "Update firmware",
            "Check connection stability"
          ],
          "switchType": "pvos",
          "stpEnable": true,
          "stpMode": "RSTP",
          "serial": "AP00000001",
          "ipv4": "10.21.78.3",
          "status": "Online",
          "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
          "macAddress": "11:22:33:44:66:60",
          "publicIp": "59.144.73.163",
          "model": "AS-2930M",
          "stackId": "01000c97-5f80e1c0",
          "health": "Poor",
          "healthReasons": {
            "poorReasons": [
              "High packet loss",
              "Frequent disconnections"
            ],
            "fairReasons": [
              "Moderate latency",
              "Occasional errors"
            ],
            "primaryReason": {
              "reasonEnum": "None",
              "typeId": "None",
              "totalReasons": 225
            }
          },
          "siteId": "24833497",
          "upTime": 1702794777,
          "rebootTs": 1627873200,
          "firmwareVersion": "8.6.0.0",
          "deployment": "Standalone",
          "firmwareUpdatedTs": 1627873200,
          "firmwareBackupVersion": "8.5.0.0",
          "firmwareStatus": "Updated",
          "firmwareRecommendedVersion": "8.6.1.0",
          "contact": "admin@company.com",
          "jNumber": "J123456",
          "lastSeen": 1627873200,
          "managementVlan": 1,
          "nativeVlan": 10,
          "configStatus": "Pending",
          "deviceName": "Switch-01",
          "switchRole": "Core",
          "manufacturer": "Aruba",
          "location": "Data Center 1",
          "stackMemberId": 1,
          "stackMemberStatus": "Active",
          "stackMemberPriority": 15,
          "lastConfigChange": 1627873200,
          "lastRestartReason": "Software upgrade"
        },
        {
          "id": "CN31HKZ0CN",
          "type": "switch",
          "switchLinkType": "BPS",
          "recommendation": [
            "Update firmware",
            "Check connection stability"
          ],
          "switchType": "pvos",
          "stpEnable": true,
          "stpMode": "RSTP",
          "serial": "AP00000001",
          "ipv4": "10.21.78.3",
          "status": "Online",
          "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
          "macAddress": "11:22:33:44:66:60",
          "publicIp": "59.144.73.163",
          "model": "AS-2930M",
          "stackId": "01000c97-5f80e1c0",
          "health": "Poor",
          "healthReasons": {
            "poorReasons": [
              "High packet loss",
              "Frequent disconnections"
            ],
            "fairReasons": [
              "Moderate latency",
              "Occasional errors"
            ],
            "primaryReason": {
              "reasonEnum": "None",
              "typeId": "None",
              "totalReasons": 2385
            }
          },
          "siteId": "24833497",
          "upTime": 1702794777,
          "rebootTs": 1627873200,
          "firmwareVersion": "8.6.0.0",
          "deployment": "Standalone",
          "firmwareUpdatedTs": 1627873200,
          "firmwareBackupVersion": "8.5.0.0",
          "firmwareStatus": "Updated",
          "firmwareRecommendedVersion": "8.6.1.0",
          "contact": "admin@company.com",
          "jNumber": "J123456",
          "lastSeen": 1627873200,
          "managementVlan": 1,
          "nativeVlan": 10,
          "configStatus": "Pending",
          "deviceName": "Switch-01",
          "switchRole": "Core",
          "manufacturer": "Aruba",
          "location": "Data Center 1",
          "stackMemberId": 1,
          "stackMemberStatus": "Active",
          "stackMemberPriority": 15,
          "lastConfigChange": 1627873200,
          "lastRestartReason": "Software upgrade"
        }
      ],
      "portLinks": [
        {
          "serial": "CN31HKZ0CN",
          "links": [
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            },
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            }
          ]
        },
        {
          "serial": "CN31HKZ0CN",
          "links": [
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            },
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            }
          ]
        }
      ]
    },
    {
      "id": "stack-12345",
      "type": "stack-members",
      "topology": "Ring",
      "stackType": "Virtual",
      "members": [
        {
          "id": "CN31HKZ0CN",
          "type": "switch",
          "switchLinkType": "BPS",
          "recommendation": [
            "Update firmware",
            "Check connection stability"
          ],
          "switchType": "pvos",
          "stpEnable": true,
          "stpMode": "RSTP",
          "serial": "AP00000001",
          "ipv4": "10.21.78.3",
          "status": "Online",
          "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
          "macAddress": "11:22:33:44:66:60",
          "publicIp": "59.144.73.163",
          "model": "AS-2930M",
          "stackId": "01000c97-5f80e1c0",
          "health": "Poor",
          "healthReasons": {
            "poorReasons": [
              "High packet loss",
              "Frequent disconnections"
            ],
            "fairReasons": [
              "Moderate latency",
              "Occasional errors"
            ],
            "primaryReason": {
              "reasonEnum": "None",
              "typeId": "None",
              "totalReasons": 4273
            }
          },
          "siteId": "24833497",
          "upTime": 1702794777,
          "rebootTs": 1627873200,
          "firmwareVersion": "8.6.0.0",
          "deployment": "Standalone",
          "firmwareUpdatedTs": 1627873200,
          "firmwareBackupVersion": "8.5.0.0",
          "firmwareStatus": "Updated",
          "firmwareRecommendedVersion": "8.6.1.0",
          "contact": "admin@company.com",
          "jNumber": "J123456",
          "lastSeen": 1627873200,
          "managementVlan": 1,
          "nativeVlan": 10,
          "configStatus": "Pending",
          "deviceName": "Switch-01",
          "switchRole": "Core",
          "manufacturer": "Aruba",
          "location": "Data Center 1",
          "stackMemberId": 1,
          "stackMemberStatus": "Active",
          "stackMemberPriority": 15,
          "lastConfigChange": 1627873200,
          "lastRestartReason": "Software upgrade"
        },
        {
          "id": "CN31HKZ0CN",
          "type": "switch",
          "switchLinkType": "BPS",
          "recommendation": [
            "Update firmware",
            "Check connection stability"
          ],
          "switchType": "pvos",
          "stpEnable": true,
          "stpMode": "RSTP",
          "serial": "AP00000001",
          "ipv4": "10.21.78.3",
          "status": "Online",
          "ipv6": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
          "macAddress": "11:22:33:44:66:60",
          "publicIp": "59.144.73.163",
          "model": "AS-2930M",
          "stackId": "01000c97-5f80e1c0",
          "health": "Poor",
          "healthReasons": {
            "poorReasons": [
              "High packet loss",
              "Frequent disconnections"
            ],
            "fairReasons": [
              "Moderate latency",
              "Occasional errors"
            ],
            "primaryReason": {
              "reasonEnum": "None",
              "typeId": "None",
              "totalReasons": 4599
            }
          },
          "siteId": "24833497",
          "upTime": 1702794777,
          "rebootTs": 1627873200,
          "firmwareVersion": "8.6.0.0",
          "deployment": "Standalone",
          "firmwareUpdatedTs": 1627873200,
          "firmwareBackupVersion": "8.5.0.0",
          "firmwareStatus": "Updated",
          "firmwareRecommendedVersion": "8.6.1.0",
          "contact": "admin@company.com",
          "jNumber": "J123456",
          "lastSeen": 1627873200,
          "managementVlan": 1,
          "nativeVlan": 10,
          "configStatus": "Pending",
          "deviceName": "Switch-01",
          "switchRole": "Core",
          "manufacturer": "Aruba",
          "location": "Data Center 1",
          "stackMemberId": 1,
          "stackMemberStatus": "Active",
          "stackMemberPriority": 15,
          "lastConfigChange": 1627873200,
          "lastRestartReason": "Software upgrade"
        }
      ],
      "portLinks": [
        {
          "serial": "CN31HKZ0CN",
          "links": [
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            },
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            }
          ]
        },
        {
          "serial": "CN31HKZ0CN",
          "links": [
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            },
            {
              "name": "GigabitEthernet1/0/1",
              "index": 1,
              "status": "Up",
              "adminStatus": "Up",
              "operStatus": "Up",
              "alias": "GE1",
              "errorReason": "None",
              "description": "Uplink to Core Switch",
              "mtu": 1500,
              "speed": 1000,
              "connector": "RJ45",
              "duplex": "Full",
              "lag": "LAG1",
              "vlanMode": "Access",
              "allowedVlans": [
                "VLAN10",
                "VLAN20"
              ],
              "allowedVlanIds": [
                10,
                20
              ],
              "nativeVlan": 1,
              "poeStatus": "Enabled",
              "poeClass": "Class4",
              "portAlignment": "Aligned",
              "serial": "CN31HKZ0CN",
              "peerPort": "GigabitEthernet1/0/24",
              "peerMemberId": 2,
              "uplink": true,
              "type": "GigabitEthernet",
              "module": "1",
              "neighbour": "CoreSwitch",
              "neighbourPort": "GigabitEthernet1/0/24",
              "neighbourFamily": "Aruba",
              "neighbourFunction": "Core",
              "neighbourRole": "Core Switch",
              "neighbourHealth": "Good",
              "neighbourSerial": "CN32HKZ0DN",
              "neighbourType": "Switch",
              "isMultipleNeighbourClients": false,
              "transceiverType": "SFP",
              "transceiverSerial": "SFP123456",
              "transceiverModel": "SFP-1G-LX",
              "transceiverProductNumber": "J4859C",
              "transceiverStatus": "Good",
              "ipv4": "10.1.1.1",
              "stpInstanceType": "RSTP",
              "stpInstanceId": 0,
              "stpPortRole": "Root",
              "stpPortState": "Forwarding",
              "stpPortInconsistent": "None"
            }
          ]
        }
      ]
    }
  ],
  "count": 3
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

#### Device with serial number not found.

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
  "errorCode": "HPE_GL_NETWORK_MONITORING_THREAT_NOT_FOUND",
  "message": "Reason for the error",
  "debugId": "78f002e32e0cefba3d8cc94fa8179342"
}
```
---

