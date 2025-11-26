# HPE Aruba Networking Central - Solution Guide

**Last Updated:** November 2025

This comprehensive solution guide provides detailed documentation for implementing and managing HPE Aruba Networking Central, the cloud-native network management platform powered by HPE GreenLake.

## Overview

HPE Aruba Networking Central delivers a unified, AI-powered network management solution for campus, branch, remote, and data center environments. This guide covers the next-generation configuration model, API integration, policy design, and deployment best practices.

## Quick Navigation

### Getting Started
1. [Central Overview](Central.md) - Introduction and navigation guide
2. [Configuration Readiness](Central%20Readiness.md) - Prerequisites and onboarding steps
3. [Central On-Premises](Central%20On-Premises.md) - Installation and deployment guide

### Configuration and Management
4. [Configuration Model](Configuration%20Model.md) - Architecture, scopes, and inheritance
5. [Configuration Example](Configuration%20Example.md) - Practical implementation examples
6. [Policy Configuration](Policy%20Configuration.md) - Policy framework and use cases

### Automation and APIs
7. [Configuration via API](Configuration%20via%20API.md) - REST APIs, SDK, and automation workflows

---

## Detailed Guide Contents

### 1. Central Overview
**File:** [Central.md](Central.md)

A high-level introduction to the HPE Aruba Networking Central Validated Solution Guide series.

**Topics:**
- Overview of Central capabilities
- Guide structure and navigation
- Links to all solution guide documents

**Best For:** First-time users seeking an understanding of available documentation

---

### 2. Configuration Readiness
**File:** [Central Readiness.md](Central%20Readiness.md)

Prerequisites and step-by-step procedures for preparing your environment to adopt the new Central configuration model.

**Topics:**
- HPE GreenLake account setup and device onboarding
- Creating device groups enabled for New Central
- Preprovisioning devices for automated deployment
- Site creation and device assignment
- Device function configuration for switches
- Enabling application visibility and telemetry

**Best For:** Network administrators preparing to migrate to or deploy New Central

**Key Sections:**
- Summary of onboarding steps
- Device group configuration with toggle settings
- Site management and assignment procedures
- Device function assignment for access, aggregation, and core switches

---

### 3. Central On-Premises
**File:** [Central On-Premises.md](Central%20On-Premises.md)

Comprehensive guide for deploying Central On-Premises (COP) clusters for organizations requiring on-site management.

**Topics:**
- Architecture overview and cluster sizing
- Hardware requirements for HPE DL360 Gen11 servers
- Network prerequisites (DNS, NTP, FQDN, firewall rules)
- ISO installation and cluster setup procedures
- Device onboarding for APs, gateways, and switches
- High availability and disaster recovery considerations

**Best For:** Enterprise IT teams deploying on-premises Central infrastructure

**Key Sections:**
- Hardware specifications and resource requirements
- Network architecture diagrams
- Step-by-step installation workflow
- DNS and certificate configuration
- Device provisioning prerequisites

---

### 4. Configuration Model
**File:** [Configuration Model.md](Configuration%20Model.md)

In-depth explanation of Central's configuration architecture, including scopes, element profiles, roles, and inheritance.

**Topics:**
- Configuration objects: element profiles, roles, device functions
- Hierarchy-based scopes: Global, Site Collections, Sites, Device Groups, Devices
- Inheritance and precedence rules
- Profile overrides and local customization
- Practical examples with corporate WLAN scenarios

**Best For:** Network architects and administrators designing scalable configuration strategies

**Key Sections:**
- Element profile categories (System, VLANs & Networks, Security, etc.)
- Scope assignment and inheritance logic
- Device function definitions
- Configuration precedence and override mechanisms
- Use case: Multi-site WLAN deployment with regional customization

---

### 5. Configuration Example
**File:** [Configuration Example.md](Configuration%20Example.md)

Practical step-by-step examples demonstrating how to configure common network scenarios using element profiles.

**Topics:**
- Element profile creation and assignment workflow
- Global profiles: AAA, NTP, DNS, system administration
- Access switch configuration: VLANs, STP, VSF, DHCP snooping
- Uplink port configuration with LAG and LACP
- Port standardization using port profiles
- Bridged WLAN configuration with WPA3

**Best For:** Hands-on practitioners implementing specific network configurations

**Key Sections:**
- AAA authentication profile creation example
- Comprehensive tables of recommended global profiles
- Switch configuration profiles by function
- WLAN profile configuration for bridged mode

---

### 6. Policy Configuration
**File:** [Policy Configuration.md](Policy%20Configuration.md)

Complete guide to Central's intent-based policy framework, covering policies, rules, roles, and enforcement.

**Topics:**
- Understanding policies, rules, and roles
- Comparison between Classic Central and New Central approaches
- Constructing policies with source/destination matching
- Resultant role policy generation
- Policy order and match behavior
- Assigning roles and policies with scopes
- Network device enforcement considerations
- Use cases: Bridged WLAN, Tunneled WLAN, UBT

**Best For:** Security and network teams implementing role-based access control

**Key Sections:**
- Policy framework comparison table
- Rule creation with match criteria (roles, applications, web categories)
- Policy-to-role translation mechanics
- Scope assignment best practices
- Deployment-specific policy enforcement (bridged vs. tunneled WLANs)

---

### 7. Configuration via API
**File:** [Configuration via API.md](Configuration%20via%20API.md)

Comprehensive automation guide covering REST APIs, PyCentral SDK, and Python-based workflows.

**Topics:**
- API-first architecture and REST API fundamentals
- API credentials and authentication with HPE GreenLake
- Base URLs for different Central clusters
- Automation resources: Postman collections, PyCentral SDK, Central-Python-Workflows
- PyCentral SDK directory structure and module hierarchy
- API call models: structured SDK calls vs. direct REST calls
- Deployment template with step-by-step WLAN automation example
- Package installation and Python environment setup

**Best For:** DevOps engineers, automation specialists, and developers

**Key Sections:**
- HTTP verb mapping (GET, POST, PUT/PATCH, DELETE)
- Benefits of Postman and PyCentral SDK
- Authentication and session handling code examples
- Complete WLAN deployment script walkthrough
- Error handling and troubleshooting common API issues
- Python virtual environment setup
- YAML-based configuration input examples

---

## Technology Stack

### Supported Device Types
- **Campus Access Points**: AOS 10 (802.11ax/Wi-Fi 6/6E)
- **Mobility Gateways**: AOS 10 gateways for tunneled traffic and policy enforcement
- **Switches**: AOS-CX switches (access, aggregation, core functions)

### Integration Platforms
- **HPE GreenLake Cloud Platform**: Unified cloud services platform
- **PyCentral SDK**: Python-based automation library
- **REST APIs**: Full CRUD operations for all configuration objects
- **Postman Collections**: Pre-built API request libraries

### Management Capabilities
- Configuration management with element profiles
- Role-based policy enforcement
- Application visibility and telemetry
- Device monitoring and troubleshooting
- Centralized firmware updates
- Alert and event management

---

## Configuration Concepts

### Element Profiles
Reusable configuration templates organized by category:
- **System**: NTP, DNS, switch system, source interface
- **VLANs & Networks**: VLAN, Named VLAN, STP
- **Security**: AAA authentication, authentication servers, UBT
- **Interfaces**: AP uplink, switch interface, port profile, device profile
- **Wireless**: WLAN, radio profiles
- **Routing & Overlays**: Static routing, OSPF, BGP
- **Network Services**: DHCP snooping, LLDP
- **High Availability**: VSF, gateway clusters

### Scopes
Hierarchical organizational structure:
1. **Global**: Organization-wide defaults
2. **Site Collections**: Logical groupings of sites
3. **Sites**: Physical locations
4. **Device Groups**: Functional device groupings
5. **Devices**: Individual device overrides

### Device Functions
Role-based device classification:
- Campus Access Point
- Mobility Gateway
- Access Switch
- Aggregation Switch
- Core Switch
- Bridge (for bridged APs)

### Roles
User and device identity assignments:
- Employee
- Contractor
- Guest
- IoT Device
- BYOD
- Custom roles

---

## Use Cases Covered

### Wireless Deployments
- **Bridged WLAN**: Local AP policy enforcement, VLAN-based segmentation
- **Tunneled WLAN**: Centralized gateway enforcement with GRE tunnels
- **Guest Access**: Portal-based authentication, temporary credentials
- **IoT Segmentation**: Dedicated SSIDs with restricted access

### Wired Deployments
- **User-Based Tunneling (UBT)**: Role-based wired client tunneling to gateways
- **Access Switch Configuration**: Port profiles, VLAN assignment, PoE management
- **Uplink Redundancy**: LAG configuration with LACP
- **Network Segmentation**: VLAN-based micro-segmentation

### Policy Scenarios
- **Internal Access Control**: Employee full access, contractor limited access
- **Internet Filtering**: Web category blocking, application-based policies
- **Application Optimization**: Traffic prioritization, QoS enforcement
- **Compliance Enforcement**: Role-based network restrictions

---

## Best Practices

### Configuration Management
- Apply common settings globally to reduce duplication
- Use site-specific overrides only when necessary
- Leverage inheritance to simplify multi-site deployments
- Document profile assignments and scope relationships
- Test configurations in staging environments before production rollout

### Policy Design
- Define clear role hierarchies before creating policies
- Place specific match rules before broad catch-all rules
- Review policy order to ensure correct evaluation sequence
- Use the References tab to understand which policies apply to each role
- Scope policies globally, scope roles to specific enforcement points

### API Automation
- Prototype workflows in Postman before writing scripts
- Use PyCentral SDK for production automation
- Store credentials securely using environment variables or secret managers
- Validate every configuration change with GET requests
- Implement error handling and retry logic
- Use YAML or JSON for configuration input files
- Integrate API workflows into CI/CD pipelines

### Device Onboarding
- Preprovision devices for large deployments
- Ensure devices are assigned to appropriate device groups
- Configure sites before assigning devices
- Set device functions for switches immediately after onboarding
- Enable telemetry for full visibility

---

## Migration from Classic Central

### Key Differences
- **Configuration Model**: Role-centric → Policy-centric with element profiles
- **Scope Requirements**: Sites optional → Sites mandatory
- **Device Groups**: Classic groups → Central-enabled groups with toggle setting
- **Policy Framework**: Role-embedded ACLs → Intent-based policies referencing roles

### Migration Steps
1. Create Central-enabled device groups with toggle "Allow New Central to overwrite all configurations"
2. Create and assign sites to all devices
3. Move devices from Classic groups to New Central groups (configuration will be cleared)
4. Recreate configurations using element profiles and scopes
5. Define policies and assign to appropriate scopes
6. Set device functions for switches
7. Enable application visibility and telemetry

**Warning**: Moving a device from Classic to New Central erases its existing configuration

---

## Additional Resources

### Official Documentation
- [HPE Aruba Networking Central Online Help](https://www.arubanetworks.com/techdocs/central/)
- [HPE Aruba Networking Developer Hub](https://developer.greenlake.hpe.com)
- [Central API Documentation](https://developer.greenlake.hpe.com)
- [PyCentral SDK on PyPI](https://pypi.org/project/pycentral/)
- [Central-Python-Workflows Repository](https://github.com/aruba/central-python-workflows)

### Video Tutorials
- Preparing Sites for Central
- Switch Telemetry Configuration
- Application Visibility Setup

### Support and Community
- HPE Support Portal
- Aruba Airheads Community
- GitHub Issues for Central-Python-Workflows

---

## Document Metadata

**Source**: HPE Aruba Networking Central | Validated Solution Guide
**Publisher**: Hewlett Packard Enterprise
**Copyright**: © 2024 Hewlett Packard Enterprise Development LP
**Guide URL**: https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/

---

## Version History

| Date | Change Summary |
|------|---------------|
| 24-Oct-25 | Initial Central overview document |
| 12-Nov-25 | Configuration Readiness guide added |
| 04-Nov-25 | Policy Configuration guide added |
| 14-Nov-25 | Configuration via API guide added |
| 17-Nov-25 | Configuration Example guide added |

---

## Contact and Feedback

For questions, feedback, or support regarding HPE Aruba Networking Central:
- Visit the [HPE Support Portal](https://support.hpe.com)
- Join the [Aruba Airheads Community](https://community.arubanetworks.com)
- Contact your HPE Aruba Networking sales representative

---

**Note**: This documentation set reflects the "New Central" configuration model. For Classic Central documentation, refer to the appropriate sections in the Developer Hub.
