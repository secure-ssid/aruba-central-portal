# MRT APIs

This guide explains how to get started with using MRT APIs of New Central. These APIs are alpha-stage and not ready for production, so use them only in test environments.

## Prerequisites

Before proceeding, ensure you have valid API client credentials (client_id and client_secret) for HPE Aruba Networking Central

## Setting Up Your Environment

### Step 1: Update Variables in the Environment

To make any API calls to new Central in this collection, set **New** **HPE Aruba Networking Central ENV** as the active environment & update **baseUrl**, **client_id**, and **client_secret** variables with valid values. The collection uses Postman's OAuth 2.0 authentication, so you'll need to generate access tokens after setting up the environment. Here is what these variables refer to:

- **baseUrl -** Domain Base URL for HPE Aruba Networking Central API Gateway based on the geographical cluster where your account is registered. Please check the table below to see the Base URL corresponding to your HPE Aruba Networking Central account cluster:
    

| **Cluster** | **Base URL** |
| --- | --- |
| Internal | internal.api.central.arubanetworks.com |
| US-1 | us1.api.central.arubanetworks.com |
| US-2 | us2.api.central.arubanetworks.com |
| US-WEST-4 | us4.api.central.arubanetworks.com |
| US-WEST-5 | us5.api.central.arubanetworks.com |
| US-East1 | us6.api.central.arubanetworks.com |
| Canada-1 | cn1.api.central.arubanetworks.com |
| EU-1 | ge1.api.central.arubanetworks.com |
| EU-Central2 | ge2.api.central.arubanetworks.com |
| EU-Central3 | ge3.api.central.arubanetworks.com |
| APAC-1 | in.api.central.arubanetworks.com |
| APAC-EAST1 | jp1.api.central.arubanetworks.com |
| APAC-SOUTH1 | au1.api.central.arubanetworks.com |

- **client_id & client_secret** - enter your API client credentials for new Central. These are required for OAuth 2.0 authentication to securely make API requests to New HPE Aruba Networking Central API Gateway.
    

To make an API request:

1. Select the API Endpoint you want to test
    
2. Review the API details like request body, parameters, method etc & update it as required
    
3. Click Send to execute the API call
    
4. Inspect the response to verify the API response
    

# Authentication Setup

Central uses OAuth 2.0 for secure API authentication, and the Postman collections leverages this to simplify token management. Once the above mentioned environment variables are configured, you can generate and store access tokens automatically.

1. After configuring the **New HPE Aruba Networking Central ENV** variables, ensure the environment is active.
    
2. In either collection, open the Auth folder and click “**Get New Access Token**.”
    
3. Postman will use OAuth 2.0 to request a new token from Central and automatically save the token.
    
4. Once the request succeeds, your token is ready for use. You can immediately make API calls to Central from the Postman collection.
    

## Making API Calls

### Example API Request

This example demonstrates how to make an API call to retrieve monitoring data for Devices -

1. Select the `Get a list of devices` endpoint in the Devices folder in the Postman collection
    
2. Ensure that **New** **HPE Aruba Networking Central ENV** has been set as the active environment with variables `baseUrl` & `bearerToken` correctly set in .
    
3. Optionally configure API parameters in the **Params** tab - filter, sort, limit, next
    
4. Click **Send** to make the API request
    

### Example Response

``` json
{
    "items": [
        {
            "deviceName": "AP-2-2",
            "model": "AP-515",
            "partNumber": "Q9H63A",
            "ipv4": "192.167.102.7",
            "serialNumber": "Pxxxxxxxxx",
            "ipv6": "",
            "softwareVersion": "10.6.0.2_90095",
            "status": "ONLINE",
            "deviceType": "ACCESS_POINT",
            "siteId": "24xxxxxxxxx",
            "uptimeInMillis": 1280159964,
            "lastSeenAt": null,
            "buildingId": "",
            "floorId": "",
            "deployment": "Campus",
            "type": "network-monitoring/device-monitoring",
            "macAddress": "2x:xx:xx:xx:xx:xx",
            "id": "Pxxxxxxxxx",
            "persona": "Campus",
            "role": "-"
        },
        {
            "deviceName": "Automation-Central-01",
            "model": "CX-6300M",
            "partNumber": "JL662A",
            "ipv4": "192.168.0.119",
            "serialNumber": "Sxxxxxxxxx",
            "ipv6": null,
            "softwareVersion": "FL.10.07.0010",
            "status": "ONLINE",
            "deviceType": "SWITCH",
            "siteId": "7xxxxxxxxx",
            "uptimeInMillis": 3099690671,
            "lastSeenAt": null,
            "buildingId": null,
            "floorId": null,
            "deployment": "Standalone",
            "type": "network-monitoring/device-monitoring",
            "macAddress": "2x:xx:xx:xx:xx:xx",
            "id": "Sxxxxxxxxx",
            "persona": null,
            "role": null
        },
        {
            "deviceName": "GW-3-1",
            "model": "A9004",
            "partNumber": "R1B20A",
            "ipv4": "192.168.0.103",
            "serialNumber": "Txxxxxxxxx",
            "ipv6": "",
            "softwareVersion": "8.6.0.4-2.2.0.7_80444",
            "status": "ONLINE",
            "deviceType": "GATEWAY",
            "siteId": "7xxxxxxxxx",
            "uptimeInMillis": 2311730617,
            "lastSeenAt": null,
            "buildingId": null,
            "floorId": null,
            "deployment": "Standalone",
            "type": "network-monitoring/device-monitoring",
            "macAddress": "2x:xx:xx:xx:xx:xx",
            "id": "Txxxxxxxxx",
            "persona": null,
            "role": null
        }
    ],
    "total": 3,
    "count": 3,
    "next": null
}

 ```

## Support

For issues or feedback related to the Monitoring APIs, please reach out to the Automation team via our team PDL [aruba-automation@hpe.com](https://mailto:aruba-automation@hpe.com)

## API Documentation

- [Monitoring](./monitoring/)
- [Reporting](./reporting/)
- [Services](./services/)
- [Troubleshooting](./troubleshooting/)
- [Authentication](./authentication/)
