/**
 * Shared hook for loading device inventory from multiple endpoints.
 *
 * Fetches devices, switches, APs, and gateways in parallel via
 * Promise.allSettled, deduplicates by serial number, and returns
 * a normalised list.
 *
 * @param {{ deviceType?: string }} options
 *   Optional filter – 'AP', 'SWITCH', 'GATEWAY', or null for all.
 * @returns {{ devices: Array, loading: boolean, error: string|null, reload: Function }}
 */

import { useState, useEffect, useCallback } from 'react';
import { deviceAPI, monitoringAPIv2 } from '../services/api';

function extractList(data, ...keys) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    for (const key of keys) {
      if (Array.isArray(data[key])) return data[key];
    }
    return (
      data.result ||
      data.items ||
      data.devices ||
      data.data ||
      []
    );
  }
  return [];
}

export default function useDeviceInventory({ deviceType = null } = {}) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);

      const [devicesData, switchesData, apsData, gatewaysData] =
        await Promise.allSettled([
          deviceAPI.getAll(),
          deviceAPI.getSwitches(),
          deviceAPI.getAccessPoints(),
          monitoringAPIv2.getGatewaysMonitoring(),
        ]);
      if (signal?.aborted) return;

      let allDevices = [];

      // All devices
      if (devicesData.status === 'fulfilled') {
        allDevices.push(...extractList(devicesData.value, 'devices'));
      }

      // Switches
      if (switchesData.status === 'fulfilled') {
        allDevices.push(...extractList(switchesData.value, 'switches'));
      }

      // Access Points
      if (apsData.status === 'fulfilled') {
        allDevices.push(...extractList(apsData.value, 'aps'));
      }

      // Gateways – normalise to common shape
      if (gatewaysData.status === 'fulfilled') {
        const gwItems = extractList(gatewaysData.value, 'gateways');
        const normalized = gwItems.map((g) => ({
          serial: g.serialNumber || g.serial || g.id,
          serialNumber: g.serialNumber || g.serial,
          name:
            g.deviceName ||
            g.name ||
            g.hostname ||
            `Gateway ${g.serialNumber || g.serial || g.id}`,
          deviceName: g.deviceName || g.name || g.hostname,
          type: 'GATEWAY',
          deviceType: 'GATEWAY',
          model: g.model || g.platformModel || g.platform || '',
          ...g,
        }));
        allDevices.push(...normalized);
      }

      // Deduplicate by serial
      const deviceMap = new Map();
      allDevices.forEach((device) => {
        const serial =
          device.serial || device.serialNumber || device.device_id || device.id;
        if (serial && !deviceMap.has(serial)) {
          deviceMap.set(serial, device);
        }
      });

      // Canonical type normalisation — Central API returns namespace strings like
      // "network-monitoring/access-point-monitoring"; map them to short canonical form.
      function canonicalType(raw) {
        if (!raw) return 'UNKNOWN';
        const r = raw.toLowerCase();
        if (r === 'ap' || r === 'access_point' || r.includes('access-point') || r.includes('access_point')) return 'AP';
        if (r === 'switch' || r.includes('switch')) return 'SWITCH';
        if (r === 'gateway' || r.includes('gateway')) return 'GATEWAY';
        return raw.toUpperCase();
      }

      // Optional type filter
      let list = Array.from(deviceMap.values());
      if (deviceType) {
        list = list.filter((d) => {
          const raw = d.device_type || d.type || d.deviceType;
          return canonicalType(raw) === deviceType.toUpperCase();
        });
      }

      // Normalise
      list = list
        .map((device) => {
          const serial =
            device.serial ||
            device.serialNumber ||
            device.device_id ||
            device.id;
          const type = canonicalType(
            device.device_type || device.type || device.deviceType
          );
          return {
            serial,
            serialNumber: device.serialNumber || device.serial || serial,
            name:
              device.name ||
              device.deviceName ||
              device.device_name ||
              device.display_name ||
              device.hostname ||
              `Device ${serial}`,
            deviceName:
              device.deviceName ||
              device.name ||
              device.device_name ||
              device.display_name,
            type,
            deviceType: type,
            model: device.model || device.platform || device.platformModel || '',
            ...device,
          };
        })
        .filter((d) => d.serial);

      setDevices(list);
    } catch (err) {
      console.error('Failed to load device inventory:', err);
      setError('Failed to load devices. Please check your API configuration.');
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, [deviceType]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { devices, loading, error, reload: load };
}
