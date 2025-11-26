# Central Configuration Readiness

**Date:** 12-Nov-25
**Breadcrumb:** [Central](Central.md) / Configuration Readiness

## Overview

Prerequisites needed to ensure an optimal experience with new HPE Aruba Networking Central may be familiar, since they mirror the device registration and licensing procedure for Classic Central. Additionally, the steps for creating device groups and sites lay the necessary groundwork to build the hierarchy within new HPE Aruba Networking Central.

The information provided here is not intended as an exhaustive reference. For more details, use the links in the Related Content list at the upper right of this page or contact HPE Aruba Networking for additional assistance.

## Related Content

- [Central Online Help](https://www.arubanetworks.com/techdocs/central/)
- [Video - Preparing Sites for Central](https://www.arubanetworks.com/techdocs/central/latest/content/videos/sites.htm)
- [Switch Telemetry Prerequisites](https://www.arubanetworks.com/techdocs/central/latest/content/nms/switch-cx/switch-telemetry-prereq.htm)
- [Switch Application Visibility](https://www.arubanetworks.com/techdocs/central/latest/content/nms/switch-cx/switch-app-visibility.htm)
- [Access Point Application Visibility](https://www.arubanetworks.com/techdocs/central/latest/content/nms/device-mgmt/aps/ap-app-visibility.htm)
- [Gateway Application Visibility](https://www.arubanetworks.com/techdocs/central/latest/content/gateways/cfg/gw-app-visibility.htm)

## Table of Contents

- [Central Configuration Readiness](#central-configuration-readiness)
- [Summary of Steps](#summary-of-steps)
- [HPE Greenlake Account and Device Onboarding](#hpe-greenlake-account-and-device-onboarding)
- [Device Groups](#device-groups)
- [Preprovision New Devices](#preprovision-new-devices)
- [Sites](#sites)
  - [Preparing Sites for Central](#preparing-sites-for-central)
  - [Creating Sites](#creating-sites)
  - [Assign Devices to a Site](#assign-devices-to-a-site)
- [Device Function Configuration (Switches)](#device-function-configuration-switches)
- [Enable Application Visibility and Telemetry](#enable-application-visibility-and-telemetry)

---

## Summary of Steps

The steps needed to onboard and activate devices in new HPE Aruba Networking Central are summarized as follows:

![Onboarding Process Flow: Device Onboarding → Device Groups → Preprovisioning → Sites → Device Functions → Application Visibility and Telemetry](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

In **Device Onboarding**, an HPE Greenlake Account must be created if not already present. Devices are added to inventory, assigned to the Central service, and assigned a subscription/license. When a **Device Group** is created using the instructions later in this document, it enables the device group for Central, with the appropriate device types and device roles selected. **Preprovisioning**, used for deploying large numbers of new devices only, automates the assignment of devices to groups. Devices intended to be pre-provisioned must remain offline until preprovisioning is configured. Device onboarding (step 1) and creation of the device group (step 2) must be completed in advance of preprovisioning.

**Sites** provide an additional way to build hierarchy for ease of network management and configuration. Sites are now required in the new Central, unlike Classic Central, where they were optional. Location details must be added for each site and devices must be assigned to a site before they can be configured. **Device Function** is a mandatory step for switches that defines core, aggregation, or access switch function in the network. This configuration is managed when the toggle is set to "New Central", as described below. **Application Visibility and Telemetry** is necessary for full traffic visibility. Configure the feature for gateways, access points, and switches.

---

## HPE Greenlake Account and Device Onboarding

HPE Greenlake Cloud Platform provides unified management for cloud and as-a-service solutions, including HPE Aruba Networking Central. It unifies security, visibility, and management in a scalable, cloud-native solution.

For existing deployments currently configured in Central, an HPE Greenlake Account has already been obtained, and devices may be onboarded.

For new deployments, or for customers new to HPE Aruba Networking Central and the HPE Greenlake platform, please visit the [GreenLake Platform](https://www.hpe.com/us/en/greenlake.html) section, which provides further instructions to obtain an HPE Greenlake account, onboard network devices, assign them to the Central service, and assign license/subscription keys.

---

## Device Groups

For compatibility with the newest version of HPE Aruba Networking Central, devices must be added to groups that support the latest capabilities. These device groups provide a succinct path to organizing network infrastructure to streamline configuration hierarchy and inheritance.

Devices must be assigned to a device group that supports Central configuration, enabling Central to manage configuration intent for the device. Devices that remain in Classic groups can still be monitored in Central, but cannot receive configuration from Central.

In the example that follows, a **Device Group** named *Test Group* is created and enabled for new HPE Aruba Networking Central. This device group will be enabled for access points, gateways, and switches of the AOS-CX type only.

**Step 1** Log into [HPE GreenLake](https://common.cloud.hpe.com/) and launch **Aruba Central**.

**Step 2** Verify the **New Central toggle** in the upper right corner is in the **Off** position.

**Step 3** On the **Overview** page, select **Organization** in the **Maintain** section.

![Central Overview - Organization](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Step 4** On the Network Structure tab, select **Groups**.

**Step 5** Select the + (plus sign) in the upper right hand section of the **Groups** screen to add and configure a new group.

![Add Group Screen](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Step 6** On the **Add Group** page, complete the following and click **Next**:

- **Name:** *Test Group*

- **Allow New Central to overwrite all configurations for this group**: *Toggle to the on position*. This key parameter makes the devices and group available and configurable in New Central.

- **Group will contain:** Select *Access points, Gateways, and Switches*

![Add Group Configuration](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Step 7** On the **Add Group** page, complete the following and select **Add**:

- **Architecture**: *ArubaOS 10*

- **Network Role**: *Campus/Branch*

- **Gateway Network Role**: *Mobility* for Gateways (Branch is not fully supported at this time.)

- **Type of Switches**: *AOS-CX only* (For this example.)

![Add Group - Architecture and Roles](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Step 8** The group is now available to add devices.

![Test Group Created](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Note:** After a device is added to a Central Device Group, it is no longer configurable or available in Classic Central. Also, the device loses all prior configuration when moved from a Classic Central group to a new HPE Aruba Networking Central Device Group.

---

## Preprovision New Devices

For new deployments, it is possible to preprovision devices so they are assigned automatically to a group upon deployment to the network. Preprovisioning is helpful for large quantities of devices, such as APs, that are destined for a single group for similar configuration.

Three requirements for preprovisioning are:

- The device must be powered off and not yet connected to the network. *(If the device is connected to the network, it is not available for pre-provisioning. It is placed in the "default" Device Group, and can be manually moved to the desired Central Device Group from the Groups page at any time.)*

- The device must be properly onboarded per the instructions above in the **Greenlake Account and Device Onboarding** section.

- The Group to which the device will belong must be created per the instructions above in the **Device Groups** section.

A Device can be preprovisioned to a device group created for the new HPE Aruba Networking Central as follows:

**Step 1** Open a web browser, log into Central, and navigate to the main **Overview** page. The **New Central** toggle in the upper right corner must be set to the **Off** position.

**Step 2** In the lower left, select **Organization** in the **Maintain** section.

![Overview Page - Organization](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Step 3** On the Network Structure tab, select **Device Preprovisioning**.

![Device Preprovisioning](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Step 4** In the **Device List**, select one or more unassigned devices to preprovision. Devices already assigned to a group are not selectable. Use the **Clear** option to reset the current selection if needed before proceeding.

**Step 5** After device(s) are selected, click the double arrow icon at the right of the list.

**Step 6** On the **Assign Group** page, select the target **Destination group**, review the **Destination group settings**, and select **Move**.

![Assign Group](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Step 7** Power on the network device. After connecting to Central, devices acquire the configuration elements defined for the Device Group.

---

## Sites

Sites are mandatory in new HPE Aruba Networking Central. A site defines a location where managed devices are physically installed. Sites can contain APs, gateways, and switches. Sites can be organized by single building, co-located buildings, or a logical grouping of buildings. Sites can be used for monitoring, and defining the scope of alerts, events, and insights. Sites also play an important role in defining configuration hierarchy to streamline configuration efforts.

*The video below walks through the steps detailed in this section.*

### Preparing Sites for Central

![Video Placeholder: Preparing Sites for New Central](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

Because Sites are optional in Classic Central, some customer workspaces may have devices assigned to Groups and not Sites. In other cases, Sites may be only partially implemented.

If a Classic Central instance has no Site configured or the Site list is incomplete, use the following steps to create and assign devices to them.

**Note:** Customers with fully configured sites are encouraged to skip these steps and immediately begin to explore the new HPE Aruba Networks Central interface.

### Creating Sites

The previous version of HPE Aruba Networking Central uses Sites to group devices at the same geographical location for Gateway clustering and to group APs and switches in the same location for monitoring and reporting purposes. Use this procedure to create sites.

**Step 1** Open a web browser, log into Central, and navigate to the main **Overview** page.

**Step 2** On the lower left, select **Organization** in the **Maintain** section. On the **Network Structure** tab, click the large number in the **Sites** tile.

**Step 3** When the Manage Sites page appears, scroll to the bottom, click **New Site** on the lower left, and complete the **Create New Site** fields, as shown below.

- **Site Name**: *USWH1*
- **Street Address**: *8000 Foothills Blvd*
- **City**: *Roseville*
- **Country**: *United States*
- **State or Province**: *California*
- **Zip/Postal Code**: *95747*

![Manage Sites Page](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Step 4** Repeat steps for additional sites.

### Assign Devices to a Site

Follow these steps to move Central-managed devices to the newly created site(s).

**Step 1** Return to the **Manage Sites** page by opening a web browser, logging into Central, and navigating to the main **Overview** page.

**Step 2** In the left navigation pane, select **Organization** in the **Maintain** section. On the **Network Structure** tab, click on the large number in the **Sites** tile.

**Step 3** On the **Manage Sites** page, filter for the devices. Select and drag them to the corresponding site on the left, the click **yes** to confirm the action, as shown below.

![Manage Sites - Assign Devices](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Step 4** Repeat the above steps until all devices are assigned to their corresponding sites and the **Unassigned** number of devices display 0 in the **Device Count** column.

![Sites - All Devices Assigned](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

After completing the above steps, sites and devices appear as expected in new Central public preview.

---

## Device Function Configuration (Switches)

For switches, an additional configuration step is required to further classify it as Core, Aggregation, or Access. The Device Function, in combination with Scope, can be used to govern how profiles are applied to devices. For example, profiles related to AAA Authentication can be applied to Access Switches for UBT capability, but not to Core and Aggregation switches. Or, the Device Function can be used if there is an OSPF configuration that applies only to Core or Aggregation switches.

Use these steps to assign Device Functions:

**Step 1** Toggle the **New Central** slider in the upper right corner of the Central Dashboard to the On position (move right):

![New Central Toggle](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Step 2** On the Network Overview Dashboard, click the large number in the Device Inventory tile.

**Step 3** On the Device Inventory display, note that the Device Function for Campus Access Points and Mobility Gateways present in the network have been auto-assigned. For switches, the Device Function column is blank and requires assignment. In the example below, the list is filtered by the device Serial Number. However, devices also can be filtered by Model, Type, Name, or Site.

![Device Inventory - Filter by Serial](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Step 4** Check one or more Switch Devices to assign (multi-select is supported), and hover the cursor over the far right of the line to display the triple dots **(...)** .

**Step 5** Click the triple dots, then click **Assign**.

![Device Inventory - Assign Function](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

**Step 6** Select the Device Function and click **Assign**.

![Device Assignment Dialog](https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/)

---

## Enable Application Visibility and Telemetry

Some changes may be required to switch, AP, and/or gateway configurations in order to display full traffic visibility within new Central.

To enable CX switch telemetry, first consult the complete list of requirements as provided on the [Pre-requisites for New Central](https://www.arubanetworks.com/techdocs/central/latest/content/nms/switch-cx/switch-telemetry-prereq.htm) page. Detailed configuration steps are provided on the [Configuring Prerequisites for Switch Telemetry](https://www.arubanetworks.com/techdocs/central/latest/content/nms/switch-cx/switch-telemetry-config.htm) page.

To enable application visibility across the campus, see:

- [Configuring Application Visibility for Switches](https://www.arubanetworks.com/techdocs/central/latest/content/nms/switch-cx/switch-app-visibility.htm) for details on required CX configuration.

- [Configuring Application Visibility for Access Points](https://www.arubanetworks.com/techdocs/central/latest/content/nms/device-mgmt/aps/ap-app-visibility.htm) for details on required AP configuration.

- [Configuring Application Visibility for Gateways](https://www.arubanetworks.com/techdocs/central/latest/content/gateways/cfg/gw-app-visibility.htm) for details on required gateway configuration.

---

**Source:** HPE Aruba Networking Central | Validated Solution Guide
**URL:** https://arubanetworking.hpe.com/techdocs/VSG/docs/002-central/central-010-readiness/
**Copyright:** © Copyright 2024 Hewlett Packard Enterprise Development LP
