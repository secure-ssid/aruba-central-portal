# Central On-Premises

**Date:** 17-Nov-25
**Breadcrumb:** [Central](Central.md) / Central On-Premises

## Overview

HPE Aruba Networking Central On-Premises (COP) is a variant of HPE Aruba Networking Central, a cloud management platform for the security-first, AI-powered network and security solutions developed for HPE customers of various sizes in a range of industries. COP enables easy, efficient network management by combining industry-leading functionality with an intuitive user interface, allowing network administrators and help desk staff to support and control the on-premises network. This chapter outlines the procedure to set up and install COP and provides step-by-step guidance to add devices to the deployment.

## Table of Contents

- [Central On-Premises](#central-on-premises)
- [Requirements](#requirements)
  - [Hardware Requirements](#hardware-requirements)
  - [Network Requirements](#network-requirements)
  - [FQDN and IP Address Requirements](#fqdn-and-ip-address-requirements)
- [ISO Installation](#iso-installation)
- [Network Interface Setup](#network-interface-setup)
- [Software Package Installation](#software-package-installation)
- [Cluster Setup](#cluster-setup)
- [Create Sites](#create-sites)
- [Device Onboarding](#device-onboarding)
  - [Enable Auto-Provisioning and Auto-Subscribe](#enable-auto-provisioning-and-auto-subscribe)
  - [AP Onboarding Prerequisites](#ap-onboarding-prerequisites)
  - [Mobility Gateway Onboarding Prerequisites](#mobility-gateway-onboarding-prerequisites)
  - [AOS-CX Switch Onboarding Prerequisites](#aos-cx-switch-onboarding-prerequisites)
  - [Assign Device to Site and Device Function](#assign-device-to-site-and-device-function)
- [Configuration and MRT](#configuration-and-mrt)

---

## Requirements

This section highlights the hardware and network requirements for the successful installation of COP.

### Hardware Requirements

COP can be purchased as an appliance, pre-installed from the factory, to ensure that servers meet hardware requirements. COP is deployed as a cluster with a minimum of 3 nodes. Supported cluster sizes include 3, 5, 7, 9 and 11.

For custom installations, the table below specifies COP hardware requirements for HPE servers. COP installation is supported only on select models of HPE servers. Exact requirements may vary by server model.

| Server Model | CPU Requirement | RAM Requirement | Memory Requirement | RAID Configuration | Network Adapter | Internal Storage Speed |
|--------------|----------------|-----------------|--------------------|--------------------|-----------------|----------------------|
| HPE DL360 Gen 10 server | 40 physical cores | 512 GB RAM | 3.49 TB | RAID 0 | Intel Ethernet 10Gb 2-port 562SFP+ Adapter for HPE | 10G |
| HPE DL360 Gen 11 server | 24 physical cores | 512 GB RAM | 8 TB | RAID 6 | Intel E810-XXVDA2 Ethernet 10/25G 2-port SFP28 OCP3 Adapter for HPE | 10G |

**Note:** COP supports deployments that include a mix of HPE DL360 Gen 10 and Gen 11 servers.

COP requires 10 Gbps network operation and supports only the following cables and transceivers:

| SKU | Description |
|-----|-------------|
| J9281D | HPE Aruba Networking 10Gb SFP+ to SFP+ 1m Direct Attach Cable |
| J9283D | HPE Aruba Networking 10Gb SFP+ to SFP+ 3m Direct Attach Cable |
| J9285D | HPE Aruba Networking 10Gb SFP+ to SFP+ 7m Direct Attach Cable |
| J9150D | HPE Aruba Networking 10G SFP+ LC SR 300m OM3 MMF Transceiver |

Before proceeding with the integrated-lights-out (iLO) based installation, the COP server must meet the following minimum requirements:

- **NIC version**: 11.1.1
- **ROM**: 2.68
- **iLO**: 2.72
- Servers are TPM-provisioned.
- All hard drives are SSDs. Installation is not supported for HDDs or hybrid drives.

### Network Requirements

Required network steps to build a cluster successfully using a pre-installed appliance or custom server include:

- Connect all COP appliance iLO interfaces to the management network.
- Verify that iLO interfaces have a DHCP address and default IP gateway.
- Verify that all COP appliances are physically connected to the same datacenter using 10G DAC or optical connections.
- Assign all cluster uplink ports to the same VLAN. Cluster members require Layer 2 adjacency.
- Ensure that the NTP server is reachable by the COP appliances on the 10G connected network, as configured in the [Cluster Setup](#cluster-setup) procedure.

### FQDN and IP Address Requirements

A fully-qualified DNS name (FQDN) is required for each COP appliance and for the COP cluster's virtual IP (VIP) address. All FQDNs must be resolvable by COP managed devices (access points, gateways, and switches). COP also requires four additional FQDNs that support cluster operations and resolve to the cluster's VIP.

The following table provides sample DNS values for a five node cluster:

| Node | FQDN | IP Address |
|------|------|------------|
| Cluster Virtual-IP | cop.owllab.net | 100.100.13.9 |
| Node 1 | cop-1.owllab.net | 100.100.13.10 |
| Node 2 | cop-2.owllab.net | 100.100.13.11 |
| Node 3 | cop-3.owllab.net | 100.100.13.12 |
| Node 4 | cop-4.owllab.net | 100.100.13.13 |
| Node 5 | cop-5.owllab.net | 100.100.13.14 |

The following table provides examples of the four additional cluster-level FQDNs using *<cluster_fqdn>* as a variable:

| FQDN Format | Purpose | Example |
|-------------|---------|---------|
| <cluster_fqdn> | Central-UI home page access from the browser | cop.owllab.net |
| central-<cluster_fqdn> | Central-UI NMS page access from the browser | central-cop.owllab.net |
| apigw-<cluster_fqdn> | Central NBAPI access from applications | apigw-cop.owllab.net |
| ccs-user-api-<cluster_fqdn> | Central-UI API access | ccs-user-api-cop.owllab.net |
| sso-<cluster_fqdn> | Central-UI authentication page access | sso-cop.owllab.net |

**Note:** The primary cluster FQDN is a standard PTR record pointing to the cluster VIP. The remaining cluster-level FQDNs are CNAME alias records that point to the primary cluster FQDN.

---

## ISO Installation

When using appliances with pre-installed COP, skip this section and proceed to [Network Interface Setup](#network-interface-setup).

This procedure outlines the steps to upload and install the ISO image on a custom server. This process also can be used to upgrade to a newer version of COP. Contact your HPE Aruba Networking sales representative or partner to obtain access to the ISO image.

For fast and reliable installation, host the ISO image on an HTTP/HTTPS server reachable via the iLO network connection. Alternatively, upload the ISO image from a local device using the local PC option.

**Step 1** Open a web browser and connect to the iLO using its IP address. Login with administrator credentials for a custom server, or with **copilo** credentials on a COP appliance. The **copilo** credentials are:

- **Username:** *copilo*
- **Password:** *< server-serial-number >*

**Step 2** On the left pane, click the command line and select **HTML5 Console**.

![iLO Console Menu](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 3** Right-click the **Virtual Media** icon at the top left, select **CD/DVD**, then click **Virtual Media URL**.

![Virtual Media Menu](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 4** Enter the location of the ISO image on the remote web server. Click **Apply**.

![Virtual Media URL Dialog](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 5** Reboot the server by clicking the **Power** icon at the top right section of the main screen and selecting **Cold Boot**.

![Power Menu](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 6** Wait for the server to complete the boot sequence. COP installation begins automatically upon successful boot.

![Installation Progress Screen](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

The ISO installation process takes about an hour to complete.

---

## Network Interface Setup

This section details the steps to configure the permanent network settings for a COP appliance. This process is repeated for each appliance added to the cluster.

**Note:** This procedure applies to both pre-installed appliances and custom server installations.

**Step 1** Open a web browser and connect to the COP appliance iLO. Login using administrator credentials or **copilo** credentials.

**Step 2** On the left pane, click the command line and select **HTML5 Console**.

![iLO Console Selection](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 3** Login to the console with following credentials:

- **Username**: *copadmin*
- **Password**: *< serial number of the appliance >*

![Console Login Screen](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 4** Navigate to **System Configuration > Network Setup** and select **Permanent (Network Settings)**.

![Network Setup Menu](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 5** Enter the following information as prompted.

- **Interface name**: *ens1f1*
- **IP address**: *100.100.13.10*
- **Subnet mask**: *255.255.255.240*
- **Gateway**: *100.100.13.1*
- **DNS**: *10.2.120.198*
- **Secondary DNS**: *10.2.120.199*
- **COP Hostname/FQDN**: *cop-1.owllab.net*
- **Timezone**: *UTC*

![Network Configuration Output](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Note:** The interface name may vary depending on the appliance and interface used for the 10G uplink. To find the active interface, go to the **System Information** section on the iLO Web UI.

---

## Software Package Installation

When using appliances with pre-installed COP, skip this section and proceed to [Cluster Setup](#cluster-setup).

The following process installs the COP software package. For fast and reliable installation, host the software package on an HTTP/HTTPS server reachable via the COP network interface. Before proceeding with this section, verify that the network interface configuration is complete. This process is repeated for each appliance to be added to the cluster.

**Step 1** Login to the COP appliance CLI menu and select **File Operations**.

![File Operations Menu](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 2** Select **3. Upload via (HTTP/HTTPS)**.

**Step 3** Enter the full file path to file on the web server. Press ENTER.

**Step 4** Verify the checksum to ensure that the file package downloaded successfully. Press ENTER to continue.

![Upload Progress](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 5** Go back to the main menu, then select **Install COP Software**.

**Step 6** Enter the option to choose the tarball file. This begins the installation process.

![Install COP Software Menu](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 7** Press ENTER and reboot the appliance when the installation is done.

**Caution:** Do not reboot the appliance until the installation is complete.

---

## Cluster Setup

Following COP software installation, a cluster is built for scaling and redundancy. Before proceeding, verify that the FQDNs defined in the [FQDN and IP Address Requirements](#fqdn-and-ip-address-requirements) section resolve properly.

**Step 1** Lauch the web UI on any COP appliance by entering the URL in the following format.

- **Format**: https://<COP server IP address>:4343 (e.g., https://100.100.13.10:4343)

**Step 2** At the login prompt, enter the the following credentials:

- **Username**: *copadmin*
- **Password**: *< serial number of the appliance >*

**Step 3** On the **Node Addition** page, click the + icon to add hosts.

![Node Addition Screen](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 4** Enter the FQDN for another COP appliance and click **Add to cluster** at the bottom of the page. Repeat this process for each server.

![Add Node Dialog](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 5** When the server list is complete, click **Next**.

![Complete Node List](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 6** On the **Version Selection** page, select the cluster software version from the dropdown and click **Next**.

![Version Selection](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 7** On the **Cluster Details** page, enter the following values and click **Next**.

- **Cluster FQDN**: *cop.owllab.net*
- **POD IP Range**: *10.240.0.0/16*
- **Service IP range**: *10.239.0.0/23*
- **NTP server**: *10.2.120.198*
- **Secure NTP**: *unselected*

![Cluster Details Form](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Note:** The Pod IP range must be a subnet with a mask of /16 and the Cluster IP must be a subnet with mask /23. Ensure that these IP ranges do not conflict. These IP ranges must be reserved for the internal COP cluster network and should not be routable to an external network.

**Step 8** Enter the password for the cluster and CLI username. Click **Finish**.

![Password Configuration](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

---

## Create Sites

To monitor and configure devices on COP, the devices must be added to a Central site. This procedure creates a site.

**Step 1** Login to COP and go to the configuration view.

![COP Network Overview](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 2** On the left navigation menu, select **Sites**, then click **Create Site**.

![Sites Menu](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 3** Enter the site details and click **Save**.

- **Name**: *RSVCP-COP*
- **Address**: *8000 Foothills Blvd*
- **City**: *Roseville*
- **Country**: *United States*
- **State/Province**: *California*
- **Postal Code**: *95747*

![Create Site Form](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

---

## Device Onboarding

Devices must be onboarded to GreenLake before they can be managed by COP. There are two methods available to add devices to GreenLake:

- **Manual Provisioning**: Devices are added to the GreenLake database individually by entering a device serial number and MAC address, or by uploading a list of devices in a CSV file. Manual provisioning is used to onboard switches and mobility gateways. Refer to the [Add Devices to GreenLake Inventory](https://support.hpe.com/hpesc/public/docDisplay?docId=sd00003147en_us) section of the GreenLake Platform chapter of this guide.

- **Auto-Provisioning:** When auto provisioning is enabled, APs are onboarded to GreenLake using a pre-shared key (PSK). The PSK is configured manually in GreenLake and provided to APs using a vendor-specific DHCP option.

In addition to the provisioning methods above, auto subscription ensures that onboarded devices are automatically assigned an appropriate subscription.

### Enable Auto-Provisioning and Auto-Subscribe

This section describes the procedure to configure auto-provisioning and auto-subscription for COP.

**Step 1** Login to the COP instance and click the **Greenlake Services** icon on the top right corner.

![COP Dashboard](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 2** Select the **Devices** tab at the top.

![Devices Tab](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 3** On the left menu, click **Auto-Provisioning**. In the **Pre-Shared Keys** tile, click **Add Key**.

![Auto-Provisioning Menu](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 4** Enter the name and pre-shared key as shown below, then click **Create**.

- **Name**: employee_key
- **Pre-Shared Key**: *123456*
- **Confirm Key**: *123456*

![Create Pre-Shared Key](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Note:** The PSK name is referenced in the DHCP option provided to access points.

**Step 5** On the left menu, click **Auto-Subscribe**, then click **Add**.

![Auto-Subscribe Menu](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 6** Select *Access Points* from the **Device Type** dropdown and select the appropriate **Subscription Tier**. Click **Configure Device**.

![Set Up Auto-Subscribe](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 7** Repeat steps 5 and 6 to add auto-subscribe for mobility gateways.

### AP Onboarding Prerequisites

APs must meet minimum firmware requirements before onboarding, as described in the [Supported Devices](https://www.arubanetworks.com/techdocs/central/latest/content/nms/device-mgmt/supported-devices.htm) section of Central online help.

When auto-provisioning APs, DHCP servers must support the following vendor-specific options:

- Option **043 Vendor Specific Info**: This option provides auto-provisioned APs with the PSK and COP virtual IP required for auto-provisioning in the following format: *psk-name,cop-cluster-vip,psk*. It is sent by the server in DHCP offers and acknowledgements.

- Option **060 Vendor Class Identifier**: To onboard AOS-10 access points to COP, option 060 must be set for DHCP offers and acknowledgments with a value of *ArubaAP* to process option 043 correctly.

Refer to the AOS-10 [Server Configuration](https://www.arubanetworks.com/techdocs/ArubaOS_10_Latest/Content/deploy-guides/arubaos-10-setup-guide/server-configuration.htm) guide to configure the DHCP options above. An example configuration of DHCP option 43 on a Windows DHCP server is shown below:

![DHCP Option 043 Configuration](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

### Mobility Gateway Onboarding Prerequisites

Mobility Gateways are onboarded to COP using manual provisioning. The gateway must meet minimum firmware requirements before onboarding, as described in the [Supported Devices](https://www.arubanetworks.com/techdocs/central/latest/content/nms/device-mgmt/supported-devices.htm) section of Central online help.

The gateway should use *full-setup* configuration mode. An example configuration on the gateway is shown below:

![Gateway Full-Setup Configuration](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

### AOS-CX Switch Onboarding Prerequisites

AOS-CX switches are onboarded using manual provisioning. Switches must meet minimum firmware requirements before onboarding, as described in the [Supported Devices](https://www.arubanetworks.com/techdocs/central/latest/content/nms/device-mgmt/supported-devices.htm) section of Central online help.

Using the switch CLI, the Central location must be changed from the default value to the COP cluster's virtual IP.

```
aruba>central
  location-override 100.100.13.9 vrf mgmt
```

### Assign Device to Site and Device Function

This procedures assigns a device function and site to a device, which is required to fully manage a device in COP.

**Step 1** Login to COP and click the number representing the total number of devices in the **Device Inventory** tile.

![Network Overview Dashboard](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 2** Select the checkbox left of each device to be assigned, then click **Assign**.

![Device Inventory Selection](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Step 3** Select the **Device Function** and **Site** to be assigned, then click **Assign**.

![Device Assignment Dialog](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/)

**Note:** COP supports assigning multiple device functions in a single step. For switches, ensure that switches with the same function are selected together.

---

## Configuration and MRT

This chapter describes the procedure to set up a Central On-Premises (COP) cluster using either a custom server installation or pre-installed COP appliances. After deployment, devices are added to sites and assigned device functions. For details on device monitoring in COP, refer to the Monitoring with Central section. For device configuration, refer to the [Configuration Model](Configuration%20Model.md) section.

---

**Source:** HPE Aruba Networking Central | Validated Solution Guide
**URL:** https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-090-central-on-premises/
**Copyright:** © Copyright 2024 Hewlett Packard Enterprise Development LP
