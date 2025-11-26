#!/usr/bin/env python3
"""Fetch all cnxconfig JSON specifications from Aruba Central."""

import requests
import json
import time
from pathlib import Path

# Base URL for the JSON specs
BASE_URL = "https://internal-ui.central.arubanetworks.com/cnxconfig/docs"

# List of all available specs
SPECS = [
    "802dot11k-bcn-rpt-req", "802dot11k-rrm-ie", "802dot11k", "aaa-captive-portal",
    "aaa-dot1xauth", "aaa-dot1xsupp", "aaa-macauth", "aaa-profile", "aaa-stateful-dot1x",
    "airgroup-policy", "airgroup-service-definition", "airgroup-system", "alg", "alias",
    "ap-certificate-usage", "ap-port-profile", "ap-system", "ap-uplink", "app-recog-control",
    "aspath-list", "auth-server-global", "auth-server-group", "auth-server", "auth-survivability",
    "bfd", "bgp", "cda-airpass-approval", "cda-auth-profile", "cda-authz-policy",
    "cda-identity-store", "cda-message-provider", "cda-portal-overrides-profile",
    "cda-portal-profile", "cda-portal-skin-profile", "cdp", "certificate-rcp",
    "certificate-store", "certificate", "client-insight", "client-iptracker-interface",
    "client-iptracker", "community-list", "config-checkpoint", "container-network",
    "container", "copp", "countermon", "custom-get-api", "db-observer", "ddns-http",
    "ddns", "device-certificate", "device-info", "device-profile", "devicefingerprinting-interface",
    "devicefingerprinting-profile", "devicefingerprinting", "dhcp-client", "dhcp-pool",
    "dhcp-relay", "dhcp-server", "dhcp-snooping-interface", "dhcp-snooping", "dns",
    "dynamic-arp-inspection-interface", "est", "evpn", "extension-splunk", "extension-vsphere",
    "external-storage", "fault-monitor", "feature-pack", "firewall", "flow-tracking",
    "hardware-module-profile", "hotspot2-anqp-3gpp", "hotspot2-anqp-domain-name",
    "hotspot2-anqp-ip-addr-avail", "hotspot2-anqp-nai-realm", "hotspot2-anqp-nwk-auth",
    "hotspot2-anqp-roam-cons", "hotspot2-anqp-venue-name", "hotspot2-h2qp-conn-cap",
    "hotspot2-h2qp-oper-class", "hotspot2-h2qp-oper-name", "hotspot2-h2qp-osu-provider",
    "hotspot2-h2qp-wan-metrics", "hotspot2", "http-proxy", "ids", "interface-ethernet",
    "interface-loopback", "interface-management", "interface-portchannel", "interface-profile",
    "interface-subinterface", "interface-tunnel-group", "interface-tunnel", "interface-vlan",
    "iot", "ip-binding", "ip-lockdown-interface", "ip-lockdown", "ip-routing",
    "ip-source-interface", "ipm", "ipsla", "job-scheduler", "keychain", "l3-route",
    "lacp", "lldp", "local-management", "location", "logging", "loop-protect",
    "mac-lockout", "macsec", "management-user", "mesh", "mgmd", "mirror-endpoint",
    "mirror", "mka", "msdp", "multicast-dns", "multicast-static-route", "multicast",
    "mvrp", "nae-agent", "nae-lite", "nae-script", "named-vlan", "nd-snooping-interface",
    "nd-snooping", "net-group", "net-service", "ntp", "object-group", "ospfv2",
    "ospfv3", "packet-capture", "passpoint-identity", "passpoint", "persona-assignment",
    "persona-mapping", "pim", "policy-group", "policy", "port-security", "prefix-list",
    "profile-operation", "qos-queue", "qos-schedule", "qos-threshold-profile", "radio",
    "radius-modifiers", "remote-management", "rip", "rmon-alarm", "role-acl", "role-gpid",
    "role", "routemap", "scopemap", "sflow", "smartlink", "snmp", "speed-test",
    "static-mac", "static-neighbor", "static-route", "stp", "sw-port-profile",
    "switch-chassis", "switch-profiles", "switch-stack", "switch-system", "sysmon",
    "system-info", "telemetry", "timerange", "track-object", "traffic-insight", "ubt",
    "ucc", "udp-broadcast-forwarder", "ufd", "usb", "vlan-range", "vlan", "vrf",
    "vrrp-interface", "vrrp", "vsx", "wlan"
]

# Output directory
OUTPUT_DIR = Path("/home/choate/aruba-api-docs/cnxconfig-specs")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def fetch_spec(spec_name):
    """Fetch a single specification JSON file."""
    url = f"{BASE_URL}/{spec_name}.json"
    output_file = OUTPUT_DIR / f"{spec_name}.json"

    try:
        print(f"Fetching {spec_name}...", end=" ")
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        # Parse and pretty-print the JSON
        spec_data = response.json()

        # Save to file
        with open(output_file, 'w') as f:
            json.dump(spec_data, f, indent=2)

        print(f"✓ Saved to {output_file.name}")
        return True

    except requests.exceptions.RequestException as e:
        print(f"✗ Failed: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"✗ Invalid JSON: {e}")
        return False

def main():
    """Fetch all specifications."""
    print(f"Fetching {len(SPECS)} API specifications...")
    print(f"Output directory: {OUTPUT_DIR}\n")

    success_count = 0
    failed_count = 0

    for i, spec in enumerate(SPECS, 1):
        print(f"[{i}/{len(SPECS)}] ", end="")

        if fetch_spec(spec):
            success_count += 1
        else:
            failed_count += 1

        # Small delay to avoid overwhelming the server
        time.sleep(0.1)

    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  ✓ Success: {success_count}")
    print(f"  ✗ Failed:  {failed_count}")
    print(f"  Total:     {len(SPECS)}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
