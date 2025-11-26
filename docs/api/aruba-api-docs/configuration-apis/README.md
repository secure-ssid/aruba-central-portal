# Configuration APIs

This guide explains how to get started with using Configuration APIs of New Central.

> Configuration is still in Select Availability (SA); therefore, the corresponding APIs are still in alpha. They are intended for familiarity with the new API, and to deploy configuration for lab and customer environments where applicable and appropriate. Contact your local HPE Aruba Networking representative for more information. 
  

## Prerequisites

Before proceeding, ensure you have valid API client credentials (client_id and client_secret) for HPE Aruba Networking Central

## Setting Up the Environment

1. In your workspace, go to the **Environments** tab in Postman.
    
2. Select the **New HPE Aruba Networking Central ENV** & click the checkmark icon to set it as the active environment.
    
3. Configure the following variables
    

- **baseUrl -** This URL will be based on the geographical cluster in which your Central account is provisioned. Please check the table below to see the Base URL corresponding to your HPE Aruba Networking Central account cluster:
    

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

- **client_id & client_secret** - Enter your API client credentials for new Central. These are required for OAuth 2.0 authentication to securely make API requests to new Central API Gateway. You can find steps to generate API client credentials [here.](https://developer.arubanetworks.com/new-central/docs/generating-and-managing-access-tokens#create-client-credentials)
    

# Authentication Setup

Central uses OAuth 2.0 for secure API authentication, and the Postman collections leverages this to simplify token management. Once the above mentioned environment variables are configured, you can generate and store access tokens automatically.

1. After configuring the **New HPE Aruba Networking Central ENV** variables, ensure the environment is active.
    
2. In either collection, open the Auth folder and click “**Get New Access Token**.”
    
3. Postman will use OAuth 2.0 to request a new token from Central and automatically save the token.
    
4. Once the request succeeds, your token is ready for use. You can immediately make API calls to Central from the Postman collection.
    

## Making API Calls

To make an API request:

1. Select the API Endpoint you want to test
    
2. Review the API details like request body, parameters, method etc & update it as required
    
3. Click **Send** to execute the API call
    
4. Inspect the response to verify the API response
    

## Making API Calls

### Example API Request

This example demonstrates how to make an API call to retrieve data of sites -

1. Select the `Get sites` endpoint in the Sites folder within the Scope Management category in the Postman collection
    
2. Ensure that **New** **HPE Aruba Networking Central ENV** has been set as the active environment with variables `baseUrl` & `bearerToken` correctly set in .
    
3. Optionally configure API parameters in the **Params** tab - filter, sort, limit, next
    
4. Click **Send** to make the API request
    

### Example Response

``` json
{
    "total": 2,
    "response": {
        "message": "success",
        "status": "SUCCESS",
        "code": "SCOPE-LIST-SITES-SUCCESS-001"
    },
    "offset": null,
    "count": 2,
    "items": [
        {
            "longitude": -121.3171679,
            "latitude": 38.7851464,
            "state": "California",
            "collectionId": null,
            "type": "network-config/sites",
            "id": "3xxxxxxxxxxx",
            "scopeId": "3xxxxxxxxxxx",
            "scopeName": "Test-Site-1",
            "timezone": {
                "timezoneId": "America/Los_Angeles",
                "timezoneName": "Pacific Standard Time",
                "rawOffset": -28800000
            },
            "deviceCount": 23,
            "city": "Roseville",
            "collectionName": null,
            "image": null,
            "country": "United States",
            "zipcode": "94757",
            "address": "8000 Foothills Blvd"
        },
        {
            "longitude": -121.9788586,
            "latitude": 37.4192348,
            "state": "California",
            "collectionId": null,
            "type": "network-config/sites",
            "id": "4xxxxxxxxxxx",
            "scopeId": "4xxxxxxxxxxx",
            "scopeName": "Test-Site-2",
            "timezone": {
                "timezoneId": "America/Los_Angeles",
                "timezoneName": "PDT",
                "rawOffset": -25200000
            },
            "deviceCount": 10,
            "city": "San Jose",
            "collectionName": null,
            "image": {
                "contentType": "",
                "name": ""
            },
            "country": "United States",
            "zipcode": "95002",
            "address": "6280 America Center Dr"
        },
    ]
}

 ```

## Support

For issues or feedback related to the Monitoring APIs, please reach out to the Automation team via our team PDL [aruba-automation@hpe.com](https://mailto:aruba-automation@hpe.com)

## API Documentation

- [Scope Management](./scope-management/)
- [Application Experience](./application-experience/)
- [Central NAC](./central-nac/)
- [Central NAC Service](./central-nac-service/)
- [Config Management](./config-management/)
- [Configuration Health](./configuration-health/)
- [Extensions](./extensions/)
- [High Availability](./high-availability/)
- [Interface](./interface/)
- [Interface Security](./interface-security/)
- [Interfaces](./interfaces/)
- [IoT](./iot/)
- [Miscellaneous](./miscellaneous/)
- [Named Object](./named-object/)
- [Network Services](./network-services/)
- [Roles & Policy](./roles-policy/)
- [Routing & Overlays](./routing-overlays/)
- [Security](./security/)
- [Services](./services/)
- [System](./system/)
- [Telemetry](./telemetry/)
- [Tunnels](./tunnels/)
- [VLANs & Networks](./vlans-networks/)
- [Wireless](./wireless/)
