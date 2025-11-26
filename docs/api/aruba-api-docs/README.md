# HPE Aruba Networking Central API Documentation

This directory contains comprehensive API documentation for HPE Aruba Networking Central, converted from Postman collections to markdown format for easy reference and AI assistant integration.

## Documentation Collections

### 1. [Configuration APIs](./configuration-apis/)

The Configuration APIs are still in Select Availability (SA) and the corresponding APIs are in alpha. This collection covers configuration management for New Central.

**Categories:**
- **Sites** - Site management and configuration
- **Site Collections** - Managing collections of sites
- **Device Groups** - Device group operations
- **Hierarchy** - Organizational hierarchy management
- **Scope Management** - Access scope configuration
- **Central NAC** - Network Access Control configuration
- **Config Management** - Configuration checkpoint and health
- **High Availability** - HA configuration for devices
- **Interfaces** - Network interface configuration (17 subcategories)
- **IoT** - IoT device management
- **Miscellaneous** - Various system configurations (20 subcategories)
- **Named Object** - Network service and alias definitions
- **Network Services** - DHCP, DNS, NAE, and other services (20 subcategories)
- **Roles & Policy** - User roles, policies, and ACLs
- **Routing & Overlays** - L3 routing, BGP, OSPF, VRFs (17 subcategories)
- **Security** - AAA, certificates, firewall, port security (27 subcategories)
- **Services** - Location services
- **System** - System-wide settings and management (25 subcategories)
- **Telemetry** - Device tracking and monitoring (8 subcategories)
- **Tunnels** - Tunnel interface configuration
- **VLANs & Networks** - VLAN and network configuration
- **Wireless** - WLAN, radio, hotspot2.0, passpoint (19 subcategories)

**Total:** ~180+ endpoint categories with CRUD operations

### 2. [MRT APIs](./mrt-apis/)

Monitoring, Reporting, and Troubleshooting APIs for operational visibility and diagnostics.

**Categories:**
- **Monitoring**
  - Access Points (33 endpoints)
  - Application Visibility
  - Clients
  - Devices
  - Firewall Session
  - Gateways (48 endpoints)
  - IDPS
  - FloorPlan (37 endpoints)
  - Site Health
  - Switch
- **Reporting** - Analytics and reporting endpoints
- **Services**
  - Location (15 endpoints)
  - Firmware
- **Troubleshooting**
  - AOS-S Switches (17 endpoints)
  - Access Points (26 endpoints)
  - CX Switches (19 endpoints)
  - Gateways (25 endpoints)
- **Authentication** - API authentication endpoints

**Total:** ~215+ monitoring and troubleshooting endpoints

## File Structure

Each API endpoint is documented in its own markdown file with the following structure:

- **Request details** - HTTP method, URL, parameters
- **Headers** - Required and optional headers
- **Request body** - JSON payload examples
- **Query parameters** - URL parameters with descriptions
- **Response examples** - Sample responses with status codes

## Usage with AI Assistants

These markdown files are optimized for reference by AI coding assistants (Claude, Cursor, etc.). You can:

1. Point your AI assistant to specific API categories
2. Search for endpoints by name or functionality
3. Copy request/response examples directly into your code
4. Understand API structure and relationships

## Statistics

- **Total markdown files:** 1,501
- **Configuration APIs:** ~1,350 files
- **MRT APIs:** ~151 files
- **Total API endpoints:** ~1,800+

## Quick Navigation

### Configuration APIs
- [README - Full Index](./configuration-apis/README.md)
- [Sites](./configuration-apis/sites/)
- [Interfaces](./configuration-apis/interfaces/)
- [Security](./configuration-apis/security/)
- [Wireless](./configuration-apis/wireless/)
- [Routing & Overlays](./configuration-apis/routing-overlays/)

### MRT APIs
- [README - Full Index](./mrt-apis/README.md)
- [Monitoring](./mrt-apis/monitoring/)
- [Troubleshooting](./mrt-apis/troubleshooting/)
- [Services](./mrt-apis/services/)

## Source

Documentation generated from:
- **Configuration APIs** - Postman Collection v2.1
- **MRT APIs** - Postman Collection v2.1
- **Workspace:** HPE Aruba Networking / New HPE Aruba Networking Central

Last updated: 2025-11-21

## Notes

- Configuration APIs are in alpha/Select Availability (SA) stage
- Some APIs may require specific access tokens or permissions
- Refer to [HPE Aruba Networking Developer Hub](https://developer.arubanetworks.com/central/) for authentication setup
- Base URL varies by geographical cluster where your account is registered
