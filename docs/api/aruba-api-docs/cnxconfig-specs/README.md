# Aruba Central CNXConfig API Specifications

This directory contains the complete collection of OpenAPI 3.0.0 specifications for Aruba Central's network configuration APIs.

## Overview

**Total Specifications:** 196
**Source:** https://internal-ui.central.arubanetworks.com/cnxconfig/docs
**Base URL:** `/network-config/v1alpha1`
**Last Updated:** 2025-11-22

## API Categories

### Wireless (WLANs & APs)
- `wlan.json` - WLAN/SSID configuration
- `radio.json` - Radio profiles and settings
- `ap-system.json`, `ap-port-profile.json`, `ap-uplink.json` - Access Point configuration
- `802dot11k*.json` - 802.11k radio resource management
- `mesh.json` - Wireless mesh networking

### Authentication & Access Control (AAA)
- `aaa-*.json` - AAA profiles, dot1x, MAC auth, captive portal
- `auth-server*.json` - RADIUS and authentication servers
- `role.json`, `role-gpid.json`, `role-acl.json` - User roles and policies
- `policy.json`, `policy-group.json` - Access policies

### Hotspot 2.0 (Passpoint)
- `hotspot2*.json` - Hotspot 2.0 / Passpoint configuration
- `passpoint*.json` - Passpoint identity and settings

### Guest Access & Captive Portal
- `cda-*.json` - Central Device Authentication (captive portal, authorization policies, identity stores)
- `aaa-captive-portal.json` - Captive portal AAA settings

### VLANs & Layer 2
- `vlan.json`, `vlan-range.json`, `named-vlan.json` - VLAN configuration
- `interface-vlan.json` - VLAN interfaces
- `stp.json` - Spanning Tree Protocol
- `lacp.json` - Link Aggregation Control Protocol

### Routing & Layer 3
- `ip-routing.json`, `static-route.json`, `l3-route.json` - IP routing
- `bgp.json` - Border Gateway Protocol
- `ospfv2.json`, `ospfv3.json` - OSPF routing
- `rip.json` - RIP routing
- `vrf.json` - Virtual Routing and Forwarding
- `vrrp*.json` - Virtual Router Redundancy Protocol

### Network Services
- `dhcp-*.json` - DHCP server, client, relay, snooping
- `dns.json` - DNS configuration
- `ntp.json` - Network Time Protocol
- `snmp.json` - SNMP monitoring
- `logging.json` - Syslog and logging

### Multicast
- `multicast*.json` - Multicast routing and configuration
- `pim.json` - Protocol Independent Multicast
- `mgmd.json` - Multicast Group Membership Discovery
- `msdp.json` - Multicast Source Discovery Protocol

### Security & Firewall
- `firewall.json` - Firewall rules and policies
- `ids.json` - Intrusion Detection System
- `macsec.json` - MAC Security (802.1AE)
- `port-security.json` - Port security settings
- `ip-lockdown*.json` - IP lockdown features
- `dhcp-snooping*.json` - DHCP snooping protection
- `dynamic-arp-inspection*.json` - ARP inspection
- `nd-snooping*.json` - Neighbor Discovery snooping

### Interfaces
- `interface-*.json` - Ethernet, loopback, management, tunnel, subinterface, VLAN, port-channel interfaces
- `sw-port-profile.json` - Switch port profiles

### Quality of Service (QoS)
- `qos-*.json` - QoS queues, schedules, thresholds

### Monitoring & Diagnostics
- `mirror*.json` - Port mirroring
- `packet-capture.json` - Packet capture
- `sflow.json` - sFlow monitoring
- `flow-tracking.json` - Flow tracking
- `telemetry.json` - Telemetry data
- `client-insight.json`, `traffic-insight.json` - Network insights
- `nae-*.json` - Network Analytics Engine
- `speed-test.json` - Network speed testing
- `ipsla.json` - IP SLA monitoring

### System Configuration
- `system-info.json` - System information
- `device-info.json`, `device-profile.json`, `device-certificate.json` - Device management
- `management-user.json` - User management
- `local-management.json`, `remote-management.json` - Management access
- `switch-system.json`, `switch-chassis.json`, `switch-stack.json` - Switch systems

### Scope & Assignment
- `scopemap.json` - **Scope map assignments (critical for WLAN/role deployment)**
- `persona-mapping.json`, `persona-assignment.json` - Device persona mapping

### IoT & Application Services
- `iot.json` - IoT configuration
- `airgroup-*.json` - AirGroup service discovery
- `ucc.json` - Unified Communications & Collaboration
- `ubt.json` - User-Based Tunneling
- `devicefingerprinting*.json` - Device fingerprinting

### Containers & Extensions
- `container*.json` - Container networking
- `extension-*.json` - Extensions (Splunk, vSphere)

### Certificates & PKI
- `certificate*.json` - Certificate management
- `est.json` - Enrollment over Secure Transport

### Advanced Features
- `evpn.json` - Ethernet VPN
- `vsx.json` - Virtual Switching Extension
- `bfd.json` - Bidirectional Forwarding Detection
- `keychain.json` - Authentication key chains
- `alg.json` - Application Layer Gateway
- `location.json` - Location services

### Utilities & Tools
- `alias.json` - Command aliases
- `custom-get-api.json` - Custom GET APIs
- `job-scheduler.json` - Scheduled jobs
- `config-checkpoint.json` - Configuration checkpoints
- `profile-operation.json` - Profile operations

## Common API Pattern

All `/network-config/v1alpha1` endpoints follow a consistent pattern:

### Query Parameters for POST/PATCH/DELETE:
```
object_type=LOCAL|SHARED    # LOCAL for scope-specific, SHARED for library
scope_id=<scope_id>         # MANDATORY if object_type=LOCAL
persona=<persona>           # MANDATORY if object_type=LOCAL (e.g., CAMPUS_AP)
```

### Query Parameters for GET:
```
view_type=LIBRARY|LOCAL     # LIBRARY for shared, LOCAL for scoped
object_type=LOCAL|SHARED    # Filter by object type
scope_id=<scope_id>         # REQUIRED for view_type=LOCAL
persona=<persona>           # Filter by persona
effective=true|false        # Hierarchically merged config
detailed=true|false         # Include annotations
limit=<number>              # Pagination limit
offset=<number>             # Pagination offset
```

### Device Personas:
- `CAMPUS_AP` - Campus Access Points (bridged mode)
- `MOBILITY_GW` - Mobility Gateway (tunneled mode)
- `ACCESS_SWITCH` - Access Switches
- `CORE_SWITCH` - Core Switches
- `AOSS_AGG_SWITCH` - AOS-S Aggregation Switch
- And more...

## Usage Examples

### Reading a WLAN Configuration:
```
GET /network-config/v1alpha1/wlan-ssids/Corp-WiFi?view_type=LOCAL&scope_id=54819475093&persona=CAMPUS_AP
```

### Creating a Scope Map Assignment:
```
POST /network-config/v1alpha1/scope-maps/54819475093/CAMPUS_AP/wlan-ssids~2FCorp-WiFi?object_type=LOCAL&scope_id=54819475093&persona=CAMPUS_AP

Body:
{
  "scope-name": "54819475093",
  "scope-id": 54819475093,
  "persona": "CAMPUS_AP",
  "resource": "wlan-ssids/Corp-WiFi"
}
```

### Creating a Role:
```
POST /network-config/v1alpha1/roles/employee-role?object_type=SHARED

Body:
{
  "name": "employee-role",
  "description": "Employee access role",
  "vlan-parameters": {
    "access-vlan": 100
  }
}
```

## Key Files for WLAN Deployment

For WLAN wizard implementation, these are the most critical specs:

1. **scopemap.json** - Scope map assignments (assigns resources to sites/scopes)
2. **wlan.json** - WLAN/SSID configuration
3. **role.json** - User role configuration
4. **role-gpid.json** - Role Group Policy ID (required before scope assignment)
5. **aaa-profile.json** - AAA authentication profiles
6. **named-vlan.json** - Named VLANs for AP groups
7. **persona-mapping.json** - Device type to function mapping

## Standard Response Codes

All APIs return consistent HTTP status codes:
- `200` - Successful operation
- `400` - Bad request / Invalid payload
- `401` - Unauthorized / Authentication failure
- `403` - Forbidden / Capability rule fail
- `404` - Not found / Resource missing
- `406` - Not acceptable / Invalid format
- `408` - Request timeout
- `412` - Precondition failed
- `429` - Rate limit exceeded
- `500` - Internal server error

## Rate Limiting

All responses include rate limit headers:
- `X-RateLimit-Limit` - Request limit per hour
- `X-RateLimit-Remaining` - Requests left in current window
- `X-RateLimit-Reset` - UTC timestamp when window resets

## Notes

- All specifications are in OpenAPI 3.0.0 format
- Generated from YANG data models
- Base URLs are relative to the Aruba Central API endpoint
- Authentication via Bearer token required for all requests
- Supports both SHARED (library) and LOCAL (scope-specific) objects
