/**
 * Devices Page
 * Displays and manages network devices
 */

import { useState, useMemo, useCallback, memo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useDebouncedValue from '../hooks/useDebouncedValue';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { List } from 'react-window';
import { useDevices, useSwitches, useAccessPoints, useGateways } from '../hooks/useApiQueries';
import DataTableFilter from '../components/DataTableFilter';
import {
  exportToCSV,
  exportToJSON,
  formatDevicesForExport,
  generateFilename,
} from '../utils/exportUtils';

/** Threshold: use virtualized rendering when filtered rows exceed this count. */
const VIRTUALIZE_THRESHOLD = 200;
const ROW_HEIGHT = 64;

/** URL ?tab= values, index-aligned with MUI Tabs (0–3). */
const DEVICE_TAB_KEYS = ['all', 'switches', 'aps', 'gateways'];

function deviceTabIndexFromSearch(tabParam) {
  if (tabParam == null || tabParam === '') return 0;
  const idx = DEVICE_TAB_KEYS.indexOf(String(tabParam).toLowerCase());
  return idx >= 0 ? idx : 0;
}

function DevicesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabValue = deviceTabIndexFromSearch(searchParams.get('tab'));

  const handleDeviceTabChange = (_e, newValue) => {
    const key = DEVICE_TAB_KEYS[newValue];
    if (newValue === 0) {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ tab: key }, { replace: true });
    }
  };

  // ── React Query hooks — share cache with DashboardPage & prefetch ────
  const devicesQuery = useDevices();
  const switchesQuery = useSwitches();
  const apsQuery = useAccessPoints();
  const gatewaysQuery = useGateways();

  // Derive lists from query data (memoized to avoid re-renders)
  const devices = useMemo(() => {
    const d = devicesQuery.data;
    return (
      d?.devices ||
      d?.items ||
      d?.result ||
      (Array.isArray(d) ? d : [])
    );
  }, [devicesQuery.data]);

  const switches = useMemo(() => {
    const s = switchesQuery.data;
    return (
      s?.switches ||
      s?.items ||
      s?.result ||
      (Array.isArray(s) ? s : [])
    );
  }, [switchesQuery.data]);

  const accessPoints = useMemo(() => {
    const a = apsQuery.data;
    return a?.aps || a?.items || a?.result || (Array.isArray(a) ? a : []);
  }, [apsQuery.data]);

  const gateways = useMemo(() => {
    const g = gatewaysQuery.data;
    const gwItems =
      g?.items || g?.gateways || g?.result || (Array.isArray(g) ? g : []);
    return gwItems.map((gw) => ({
      deviceName: gw.deviceName || gw.name || gw.hostname || 'N/A',
      serialNumber: gw.serialNumber || gw.serial || gw.id || '',
      model: gw.model || gw.platformModel || gw.platform || '',
      macAddress: gw.macAddress || gw.mac || '',
      status: gw.status || gw.deviceStatus || gw.state || '',
      ipv4: gw.ipv4 || gw.ipAddress || gw.ip || '',
      ipv6: gw.ipv6 || '',
      deviceType: gw.deviceType || 'Gateway',
    }));
  }, [gatewaysQuery.data]);

  const loading = devicesQuery.isLoading && switchesQuery.isLoading;
  const error = devicesQuery.error?.message || switchesQuery.error?.message || apsQuery.error?.message || '';

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, 250);
  const [sortBy, setSortBy] = useState('name');
  const [statusFilter, setStatusFilter] = useState(null);

  const getStatusColor = (status) => {
    if (!status) return 'default';
    const statusLower = status.toLowerCase();
    if (statusLower === 'up' || statusLower === 'online') return 'success';
    if (statusLower === 'down' || statusLower === 'offline') return 'error';
    return 'warning';
  };

  const getCurrentDeviceList = () => {
    if (tabValue === 1) return switches;
    if (tabValue === 2) return accessPoints;
    if (tabValue === 3) return gateways;
    return devices;
  };

  const handleExportCSV = () => {
    const currentList = getCurrentDeviceList();
    const filtered = filterAndSortDevices(currentList);
    const formatted = formatDevicesForExport(
      filtered.map((d) => ({
        serial: d.serialNumber,
        name: d.deviceName,
        model: d.model,
        device_type: d.deviceType,
        status: d.status,
        ip_address: d.ipv4,
        macaddr: d.macAddress,
        firmware_version: d.firmwareVersion,
        site: d.site,
        group_name: d.group,
      }))
    );
    const filename = generateFilename('devices', 'csv');
    exportToCSV(formatted, filename);
  };

  const handleExportJSON = () => {
    const currentList = getCurrentDeviceList();
    const filtered = filterAndSortDevices(currentList);
    const filename = generateFilename('devices', 'json');
    exportToJSON(filtered, filename);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'status') {
      setStatusFilter(value);
    } else if (key === null) {
      // Clear all filters
      setStatusFilter(null);
    }
  };

  const getActiveFilters = () => {
    const filters = [];
    if (statusFilter) {
      filters.push({ key: 'status', label: 'Status', value: statusFilter });
    }
    return filters;
  };

  const filterAndSortDevices = (deviceList) => {
    let filtered = deviceList;

    // Apply search filter (debounced to avoid per-keystroke re-renders)
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (device) =>
          device.deviceName?.toLowerCase().includes(term) ||
          device.serialNumber?.toLowerCase().includes(term) ||
          device.model?.toLowerCase().includes(term) ||
          device.macAddress?.toLowerCase().includes(term) ||
          device.ipv4?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((device) => device.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.deviceName || '').localeCompare(b.deviceName || '');
        case 'serial':
          return (a.serialNumber || '').localeCompare(b.serialNumber || '');
        case 'model':
          return (a.model || '').localeCompare(b.model || '');
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        case 'ip':
          return (a.ipv4 || '').localeCompare(b.ipv4 || '');
        default:
          return 0;
      }
    });

    return sorted;
  };

  /** Memoized virtual row renderer for large device lists. */
  const DeviceVirtualRow = memo(function DeviceVirtualRow({ index, style, data }) {
    const device = data[index];
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle, rgba(224,224,224,1))',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
        role="row"
        onClick={() => navigate(`/devices/${device.serialNumber}`)}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <div style={{ flex: 2, padding: '6px 16px', overflow: 'hidden' }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {device.deviceName || 'N/A'}
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block" noWrap>
            {device.deviceType}
          </Typography>
        </div>
        <div style={{ flex: 1.5, padding: '6px 16px', overflow: 'hidden' }}>
          <Typography variant="body2" fontFamily="monospace" noWrap>
            {device.serialNumber || 'N/A'}
          </Typography>
        </div>
        <div style={{ flex: 1, padding: '6px 16px', overflow: 'hidden' }}>
          <Typography variant="body2" noWrap>{device.model || 'N/A'}</Typography>
        </div>
        <div style={{ flex: 1.5, padding: '6px 16px', overflow: 'hidden' }}>
          <Typography variant="body2" fontFamily="monospace" noWrap>
            {device.macAddress || 'N/A'}
          </Typography>
        </div>
        <div style={{ flex: 1, padding: '6px 16px' }}>
          <Chip
            label={device.status || 'Unknown'}
            size="small"
            color={getStatusColor(device.status)}
          />
        </div>
        <div style={{ flex: 1.5, padding: '6px 16px', overflow: 'hidden' }}>
          <Typography variant="body2" fontFamily="monospace" noWrap>
            {device.ipv4 || 'N/A'}
          </Typography>
          {device.ipv6 && (
            <Typography variant="caption" color="textSecondary" display="block" noWrap>
              {device.ipv6}
            </Typography>
          )}
        </div>
      </div>
    );
  });

  const renderDeviceTable = (deviceList, type = 'general') => {
    const filtered = filterAndSortDevices(deviceList);

    if (filtered.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            {debouncedSearch ? 'No devices match your search' : 'No devices found'}
          </Typography>
        </Box>
      );
    }

    const useVirtualized = filtered.length > VIRTUALIZE_THRESHOLD;

    return (
      <TableContainer>
        {/* Sticky table header */}
        <Table sx={useVirtualized ? { tableLayout: 'fixed' } : undefined}>
          <TableHead>
            <TableRow>
              <TableCell sx={useVirtualized ? { width: '22%' } : undefined}>Name</TableCell>
              <TableCell sx={useVirtualized ? { width: '16%' } : undefined}>Serial Number</TableCell>
              <TableCell sx={useVirtualized ? { width: '11%' } : undefined}>Model</TableCell>
              <TableCell sx={useVirtualized ? { width: '16%' } : undefined}>MAC Address</TableCell>
              <TableCell sx={useVirtualized ? { width: '11%' } : undefined}>Status</TableCell>
              <TableCell sx={useVirtualized ? { width: '16%' } : undefined}>IP Address</TableCell>
            </TableRow>
          </TableHead>
          {!useVirtualized && (
            <TableBody>
              {filtered.map((device, index) => (
                <TableRow
                  key={device.serialNumber || index}
                  hover
                  onClick={() => navigate(`/devices/${device.serialNumber}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {device.deviceName || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block">
                      {device.deviceType}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {device.serialNumber || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{device.model || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {device.macAddress || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={device.status || 'Unknown'}
                      size="small"
                      color={getStatusColor(device.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {device.ipv4 || 'N/A'}
                    </Typography>
                    {device.ipv6 && (
                      <Typography variant="caption" color="textSecondary" display="block">
                        {device.ipv6}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>

        {/* Virtualized body for large lists */}
        {useVirtualized && (
          <List
            height={Math.min(filtered.length * ROW_HEIGHT, 600)}
            itemCount={filtered.length}
            itemSize={ROW_HEIGHT}
            width="100%"
            itemData={filtered}
            overscanCount={10}
          >
            {DeviceVirtualRow}
          </List>
        )}
      </TableContainer>
    );
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Network Devices
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all devices in your network
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filter and Search Bar */}
      <DataTableFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        sortOptions={[
          { key: 'name', label: 'Sort by Name' },
          { key: 'serial', label: 'Sort by Serial Number' },
          { key: 'model', label: 'Sort by Model' },
          { key: 'status', label: 'Sort by Status' },
          { key: 'ip', label: 'Sort by IP Address' },
        ]}
        currentSort={sortBy}
        onSortChange={setSortBy}
        filterOptions={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'Up', label: 'Online/Up' },
              { value: 'Down', label: 'Offline/Down' },
            ],
          },
        ]}
        activeFilters={getActiveFilters()}
        onFilterChange={handleFilterChange}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        placeholder="Search devices by name, serial, model, or MAC address..."
      />

      {/* Device Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleDeviceTabChange}>
            <Tab label={`All Devices (${devices.length})`} />
            <Tab label={`Switches (${switches.length})`} />
            <Tab label={`Access Points (${accessPoints.length})`} />
            <Tab label={`Gateways (${gateways.length})`} />
          </Tabs>
        </Box>

        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {tabValue === 0 && renderDeviceTable(devices, 'all')}
              {tabValue === 1 && renderDeviceTable(switches, 'switches')}
              {tabValue === 2 && renderDeviceTable(accessPoints, 'aps')}
              {tabValue === 3 && renderDeviceTable(gateways, 'gateways')}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default DevicesPage;
