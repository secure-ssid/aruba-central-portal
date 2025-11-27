/**
 * Reporting Page
 * Comprehensive network reporting with multiple report types
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
  Stack,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  NetworkCheck as NetworkHealthIcon,
  People as ClientsIcon,
  Wifi as WifiIcon,
  Security as SecurityIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Router as RouterIcon,
  Devices as DevicesIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import {
  reportingAPI,
  deviceAPI,
  monitoringAPIv2,
  alertsAPI,
  configAPI,
  firmwareAPI,
} from '../services/api';

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Format bytes to human-readable
function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Format uptime seconds to human-readable
function formatUptime(seconds) {
  if (!seconds) return 'N/A';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// Status chip component
function StatusChip({ status }) {
  const config = {
    Up: { color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
    Down: { color: 'error', icon: <ErrorIcon fontSize="small" /> },
    Warning: { color: 'warning', icon: <WarningIcon fontSize="small" /> },
    Unknown: { color: 'default', icon: null },
  };
  const cfg = config[status] || config.Unknown;
  return (
    <Chip
      size="small"
      label={status}
      color={cfg.color}
      icon={cfg.icon}
      sx={{ minWidth: 80 }}
    />
  );
}

// Metric card component
function MetricCard({ title, value, subtitle, icon, trend, color = 'primary.main' }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'rgba(255, 102, 0, 0.1)',
              color: 'primary.main',
            }}
          >
            {icon}
          </Box>
        </Box>
        {trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend >= 0 ? (
              <TrendingUpIcon fontSize="small" color="success" />
            ) : (
              <TrendingDownIcon fontSize="small" color="error" />
            )}
            <Typography
              variant="caption"
              color={trend >= 0 ? 'success.main' : 'error.main'}
              sx={{ ml: 0.5 }}
            >
              {Math.abs(trend)}% from last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// Health bar component
function HealthBar({ value, label }) {
  const getColor = (val) => {
    if (val >= 90) return 'success';
    if (val >= 70) return 'warning';
    return 'error';
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption">{label}</Typography>
        <Typography variant="caption" fontWeight="bold">
          {value}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        color={getColor(value)}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
}

function ReportingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [timeframe, setTimeframe] = useState('1d');
  const [siteFilter, setSiteFilter] = useState('');
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Report data states
  const [networkHealth, setNetworkHealth] = useState(null);
  const [clientAnalytics, setClientAnalytics] = useState(null);
  const [wlanPerformance, setWlanPerformance] = useState(null);
  const [securityData, setSecurityData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);

  // Load sites for filtering
  useEffect(() => {
    const loadSites = async () => {
      try {
        const data = await configAPI.getSites();
        setSites(data.sites || data.items || []);
      } catch (err) {
        console.error('Failed to load sites:', err);
      }
    };
    loadSites();
  }, []);

  // Load report data based on active tab
  const loadReportData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      switch (activeTab) {
        case 0: // Network Health
          await loadNetworkHealthReport();
          break;
        case 1: // Client Analytics
          await loadClientAnalyticsReport();
          break;
        case 2: // WLAN Performance
          await loadWlanPerformanceReport();
          break;
        case 3: // Security
          await loadSecurityReport();
          break;
        case 4: // Inventory
          await loadInventoryReport();
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Failed to load report data:', err);
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, [activeTab, timeframe, siteFilter]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  // Network Health Report
  const loadNetworkHealthReport = async () => {
    const [wirelessHealth, devices, topAPs] = await Promise.all([
      reportingAPI.getWirelessHealth(siteFilter || null).catch(() => null),
      deviceAPI.getAll().catch(() => ({ devices: [] })),
      reportingAPI.getTopAPsByClientCount(siteFilter || null, 10).catch(() => ({ aps: [] })),
    ]);

    const deviceList = devices.devices || devices.items || [];
    const aps = deviceList.filter((d) => d.device_type === 'IAP' || d.device_type === 'AP');
    const switches = deviceList.filter((d) => d.device_type === 'switch' || d.device_type === 'SWITCH' || d.device_type === 'CX');
    const gateways = deviceList.filter((d) => d.device_type === 'GATEWAY' || d.device_type === 'gateway');

    const upDevices = deviceList.filter((d) => d.status === 'Up').length;
    const downDevices = deviceList.filter((d) => d.status === 'Down').length;

    setNetworkHealth({
      totalDevices: deviceList.length,
      upDevices,
      downDevices,
      aps: {
        total: aps.length,
        up: aps.filter((d) => d.status === 'Up').length,
        down: aps.filter((d) => d.status === 'Down').length,
      },
      switches: {
        total: switches.length,
        up: switches.filter((d) => d.status === 'Up').length,
        down: switches.filter((d) => d.status === 'Down').length,
      },
      gateways: {
        total: gateways.length,
        up: gateways.filter((d) => d.status === 'Up').length,
        down: gateways.filter((d) => d.status === 'Down').length,
      },
      healthScore: deviceList.length > 0 ? Math.round((upDevices / deviceList.length) * 100) : 0,
      wirelessHealth: wirelessHealth,
      topAPs: topAPs.aps || topAPs.items || [],
      deviceList: deviceList.slice(0, 20), // Top 20 for the table
    });
  };

  // Client Analytics Report
  const loadClientAnalyticsReport = async () => {
    const [topClients, topAPs, networkUsage] = await Promise.all([
      reportingAPI.getTopAPsByClientCount(siteFilter || null, 10).catch(() => ({ aps: [] })),
      reportingAPI.getTopAPsByWirelessUsage(siteFilter || null, 10).catch(() => ({ aps: [] })),
      reportingAPI.getNetworkUsage(siteFilter || null, timeframe).catch(() => null),
    ]);

    // Calculate total clients from top APs
    const apsWithClients = topClients.aps || topClients.items || [];
    const totalClients = apsWithClients.reduce((sum, ap) => sum + (ap.client_count || 0), 0);

    setClientAnalytics({
      totalClients,
      topAPsByClients: apsWithClients,
      topAPsByUsage: topAPs.aps || topAPs.items || [],
      networkUsage,
      avgClientsPerAP: apsWithClients.length > 0
        ? Math.round(totalClients / apsWithClients.length)
        : 0,
    });
  };

  // WLAN Performance Report
  const loadWlanPerformanceReport = async () => {
    const [topSSIDs, topAPs, wlans] = await Promise.all([
      reportingAPI.getTopSSIDsByUsage(siteFilter || null, 10).catch(() => ({ ssids: [] })),
      reportingAPI.getTopAPsByWirelessUsage(siteFilter || null, 10).catch(() => ({ aps: [] })),
      monitoringAPIv2.getWLANsMonitoring().catch(() => ({ wlans: [] })),
    ]);

    const wlanList = wlans.wlans || wlans.items || [];

    setWlanPerformance({
      totalWLANs: wlanList.length,
      topSSIDs: topSSIDs.ssids || topSSIDs.items || [],
      topAPs: topAPs.aps || topAPs.items || [],
      wlanList: wlanList.slice(0, 20),
      totalBandwidth: (topAPs.aps || []).reduce(
        (sum, ap) => sum + (ap.tx_bytes || 0) + (ap.rx_bytes || 0),
        0
      ),
    });
  };

  // Security Report
  const loadSecurityReport = async () => {
    const [idpsEvents, firewallSessions, alerts] = await Promise.all([
      monitoringAPIv2.getIDPSEvents().catch(() => ({ events: [] })),
      monitoringAPIv2.getFirewallSessions().catch(() => ({ sessions: [] })),
      alertsAPI.getAll('critical', 50).catch(() => ({ alerts: [] })),
    ]);

    const eventList = idpsEvents.events || idpsEvents.items || [];
    const sessionList = firewallSessions.sessions || firewallSessions.items || [];
    const alertList = alerts.alerts || alerts.items || [];

    // Categorize alerts by severity
    const criticalAlerts = alertList.filter((a) => a.severity === 'critical' || a.severity === 'CRITICAL');
    const warningAlerts = alertList.filter((a) => a.severity === 'warning' || a.severity === 'WARNING');

    setSecurityData({
      idpsEvents: eventList.slice(0, 20),
      totalIDPSEvents: eventList.length,
      firewallSessions: sessionList.slice(0, 20),
      totalFirewallSessions: sessionList.length,
      alerts: alertList.slice(0, 20),
      criticalCount: criticalAlerts.length,
      warningCount: warningAlerts.length,
      threatLevel: criticalAlerts.length > 5 ? 'High' : criticalAlerts.length > 0 ? 'Medium' : 'Low',
    });
  };

  // Inventory Report
  const loadInventoryReport = async () => {
    const [devices, firmware] = await Promise.all([
      reportingAPI.getDeviceInventory().catch(() => ({ devices: [] })),
      firmwareAPI.getCompliance().catch(() => ({ devices: [] })),
    ]);

    const deviceList = devices.devices || devices.items || [];
    const firmwareList = firmware.devices || firmware.items || [];

    // Group devices by type
    const byType = {};
    deviceList.forEach((d) => {
      const type = d.device_type || 'Unknown';
      if (!byType[type]) byType[type] = [];
      byType[type].push(d);
    });

    // Group devices by firmware version
    const byFirmware = {};
    deviceList.forEach((d) => {
      const version = d.firmware_version || d.swarm_version || 'Unknown';
      if (!byFirmware[version]) byFirmware[version] = 0;
      byFirmware[version]++;
    });

    // Calculate compliance
    const compliantDevices = firmwareList.filter((d) => d.compliance === 'compliant' || d.upgrade_required === false).length;
    const complianceRate = firmwareList.length > 0
      ? Math.round((compliantDevices / firmwareList.length) * 100)
      : 100;

    setInventoryData({
      totalDevices: deviceList.length,
      devicesByType: byType,
      devicesByFirmware: Object.entries(byFirmware)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      complianceRate,
      firmwareList: firmwareList.slice(0, 20),
      deviceList: deviceList.slice(0, 50),
    });
  };

  // Export report as CSV
  const handleExport = () => {
    let csvContent = '';
    let filename = '';

    switch (activeTab) {
      case 0:
        if (networkHealth?.deviceList) {
          csvContent = 'Name,Serial,Type,Status,IP Address,Site\n';
          networkHealth.deviceList.forEach((d) => {
            csvContent += `"${d.name || ''}","${d.serial || ''}","${d.device_type || ''}","${d.status || ''}","${d.ip_address || ''}","${d.site || ''}"\n`;
          });
          filename = 'network_health_report.csv';
        }
        break;
      case 1:
        if (clientAnalytics?.topAPsByClients) {
          csvContent = 'AP Name,Serial,Client Count,Site\n';
          clientAnalytics.topAPsByClients.forEach((ap) => {
            csvContent += `"${ap.name || ''}","${ap.serial || ''}","${ap.client_count || 0}","${ap.site || ''}"\n`;
          });
          filename = 'client_analytics_report.csv';
        }
        break;
      case 2:
        if (wlanPerformance?.topSSIDs) {
          csvContent = 'SSID,Clients,TX Bytes,RX Bytes\n';
          wlanPerformance.topSSIDs.forEach((ssid) => {
            csvContent += `"${ssid.name || ssid.ssid || ''}","${ssid.client_count || 0}","${ssid.tx_bytes || 0}","${ssid.rx_bytes || 0}"\n`;
          });
          filename = 'wlan_performance_report.csv';
        }
        break;
      case 3:
        if (securityData?.alerts) {
          csvContent = 'Time,Type,Severity,Description\n';
          securityData.alerts.forEach((a) => {
            csvContent += `"${a.timestamp || ''}","${a.type || ''}","${a.severity || ''}","${a.description || a.message || ''}"\n`;
          });
          filename = 'security_report.csv';
        }
        break;
      case 4:
        if (inventoryData?.deviceList) {
          csvContent = 'Name,Serial,Type,Model,Firmware,Status\n';
          inventoryData.deviceList.forEach((d) => {
            csvContent += `"${d.name || ''}","${d.serial || ''}","${d.device_type || ''}","${d.model || ''}","${d.firmware_version || ''}","${d.status || ''}"\n`;
          });
          filename = 'inventory_report.csv';
        }
        break;
      default:
        return;
    }

    if (csvContent) {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }
  };

  const tabLabels = [
    { label: 'Network Health', icon: <NetworkHealthIcon /> },
    { label: 'Client Analytics', icon: <ClientsIcon /> },
    { label: 'WLAN Performance', icon: <WifiIcon /> },
    { label: 'Security', icon: <SecurityIcon /> },
    { label: 'Inventory', icon: <InventoryIcon /> },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive network reporting and analytics
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} label="Timeframe">
              <MenuItem value="1h">Last Hour</MenuItem>
              <MenuItem value="1d">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Site</InputLabel>
            <Select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} label="Site">
              <MenuItem value="">All Sites</MenuItem>
              {sites.map((site) => (
                <MenuItem key={site.site_id || site.id} value={site.site_id || site.id}>
                  {site.site_name || site.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Refresh">
            <IconButton onClick={loadReportData} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export CSV">
            <IconButton onClick={handleExport} disabled={loading}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Card>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { minHeight: 64 },
          }}
        >
          {tabLabels.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
          ))}
        </Tabs>

        {loading && <LinearProgress />}

        <CardContent>
          {/* Network Health Tab */}
          <TabPanel value={activeTab} index={0}>
            {networkHealth ? (
              <Box>
                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Health Score"
                      value={`${networkHealth.healthScore}%`}
                      subtitle={`${networkHealth.upDevices} of ${networkHealth.totalDevices} devices up`}
                      icon={<NetworkHealthIcon />}
                      color={networkHealth.healthScore >= 90 ? 'success.main' : networkHealth.healthScore >= 70 ? 'warning.main' : 'error.main'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Access Points"
                      value={networkHealth.aps.total}
                      subtitle={`${networkHealth.aps.up} up, ${networkHealth.aps.down} down`}
                      icon={<WifiIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Switches"
                      value={networkHealth.switches.total}
                      subtitle={`${networkHealth.switches.up} up, ${networkHealth.switches.down} down`}
                      icon={<DevicesIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Gateways"
                      value={networkHealth.gateways.total}
                      subtitle={`${networkHealth.gateways.up} up, ${networkHealth.gateways.down} down`}
                      icon={<RouterIcon />}
                    />
                  </Grid>
                </Grid>

                {/* Health Bars */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Device Health by Type
                        </Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                          <HealthBar
                            label="Access Points"
                            value={networkHealth.aps.total > 0 ? Math.round((networkHealth.aps.up / networkHealth.aps.total) * 100) : 100}
                          />
                          <HealthBar
                            label="Switches"
                            value={networkHealth.switches.total > 0 ? Math.round((networkHealth.switches.up / networkHealth.switches.total) * 100) : 100}
                          />
                          <HealthBar
                            label="Gateways"
                            value={networkHealth.gateways.total > 0 ? Math.round((networkHealth.gateways.up / networkHealth.gateways.total) * 100) : 100}
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Top APs by Client Count
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>AP Name</TableCell>
                                <TableCell>Serial</TableCell>
                                <TableCell align="right">Clients</TableCell>
                                <TableCell>Site</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {networkHealth.topAPs.slice(0, 5).map((ap, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{ap.name || ap.ap_name || 'N/A'}</TableCell>
                                  <TableCell>{ap.serial}</TableCell>
                                  <TableCell align="right">{ap.client_count || 0}</TableCell>
                                  <TableCell>{ap.site || 'N/A'}</TableCell>
                                </TableRow>
                              ))}
                              {networkHealth.topAPs.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={4} align="center">
                                    No data available
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Device List */}
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Device Status Overview
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Serial</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>IP Address</TableCell>
                            <TableCell>Site</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {networkHealth.deviceList.map((device, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{device.name || 'N/A'}</TableCell>
                              <TableCell>{device.serial}</TableCell>
                              <TableCell>{device.device_type}</TableCell>
                              <TableCell>
                                <StatusChip status={device.status} />
                              </TableCell>
                              <TableCell>{device.ip_address || 'N/A'}</TableCell>
                              <TableCell>{device.site || 'N/A'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              !loading && (
                <Typography color="text.secondary" align="center">
                  No network health data available
                </Typography>
              )
            )}
          </TabPanel>

          {/* Client Analytics Tab */}
          <TabPanel value={activeTab} index={1}>
            {clientAnalytics ? (
              <Box>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <MetricCard
                      title="Total Clients"
                      value={clientAnalytics.totalClients}
                      subtitle="Connected across all APs"
                      icon={<ClientsIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MetricCard
                      title="Avg Clients per AP"
                      value={clientAnalytics.avgClientsPerAP}
                      subtitle="Distribution metric"
                      icon={<SpeedIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MetricCard
                      title="Top APs Reporting"
                      value={clientAnalytics.topAPsByClients.length}
                      subtitle="APs with client data"
                      icon={<WifiIcon />}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Top APs by Client Count
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>AP Name</TableCell>
                                <TableCell align="right">Clients</TableCell>
                                <TableCell>Site</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {clientAnalytics.topAPsByClients.map((ap, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{ap.name || ap.ap_name || 'N/A'}</TableCell>
                                  <TableCell align="right">{ap.client_count || 0}</TableCell>
                                  <TableCell>{ap.site || 'N/A'}</TableCell>
                                </TableRow>
                              ))}
                              {clientAnalytics.topAPsByClients.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={3} align="center">
                                    No client data available
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Top APs by Bandwidth Usage
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>AP Name</TableCell>
                                <TableCell align="right">TX</TableCell>
                                <TableCell align="right">RX</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {clientAnalytics.topAPsByUsage.map((ap, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{ap.name || ap.ap_name || 'N/A'}</TableCell>
                                  <TableCell align="right">{formatBytes(ap.tx_bytes)}</TableCell>
                                  <TableCell align="right">{formatBytes(ap.rx_bytes)}</TableCell>
                                </TableRow>
                              ))}
                              {clientAnalytics.topAPsByUsage.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={3} align="center">
                                    No usage data available
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              !loading && (
                <Typography color="text.secondary" align="center">
                  No client analytics data available
                </Typography>
              )
            )}
          </TabPanel>

          {/* WLAN Performance Tab */}
          <TabPanel value={activeTab} index={2}>
            {wlanPerformance ? (
              <Box>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <MetricCard
                      title="Total WLANs"
                      value={wlanPerformance.totalWLANs}
                      subtitle="Configured SSIDs"
                      icon={<WifiIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MetricCard
                      title="Total Bandwidth"
                      value={formatBytes(wlanPerformance.totalBandwidth)}
                      subtitle="Across all APs"
                      icon={<TrendingUpIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MetricCard
                      title="Active SSIDs"
                      value={wlanPerformance.topSSIDs.length}
                      subtitle="With traffic data"
                      icon={<SpeedIcon />}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Top SSIDs by Usage
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>SSID</TableCell>
                                <TableCell align="right">Clients</TableCell>
                                <TableCell align="right">TX</TableCell>
                                <TableCell align="right">RX</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {wlanPerformance.topSSIDs.map((ssid, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{ssid.name || ssid.ssid || 'N/A'}</TableCell>
                                  <TableCell align="right">{ssid.client_count || 0}</TableCell>
                                  <TableCell align="right">{formatBytes(ssid.tx_bytes)}</TableCell>
                                  <TableCell align="right">{formatBytes(ssid.rx_bytes)}</TableCell>
                                </TableRow>
                              ))}
                              {wlanPerformance.topSSIDs.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={4} align="center">
                                    No SSID data available
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Top APs by Wireless Usage
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>AP Name</TableCell>
                                <TableCell align="right">TX</TableCell>
                                <TableCell align="right">RX</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {wlanPerformance.topAPs.map((ap, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{ap.name || ap.ap_name || 'N/A'}</TableCell>
                                  <TableCell align="right">{formatBytes(ap.tx_bytes)}</TableCell>
                                  <TableCell align="right">{formatBytes(ap.rx_bytes)}</TableCell>
                                </TableRow>
                              ))}
                              {wlanPerformance.topAPs.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={3} align="center">
                                    No AP usage data available
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* WLAN List */}
                {wlanPerformance.wlanList.length > 0 && (
                  <Card sx={{ mt: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        All Configured WLANs
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>SSID Name</TableCell>
                              <TableCell>Security</TableCell>
                              <TableCell>Band</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {wlanPerformance.wlanList.map((wlan, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{wlan.name || wlan.ssid || 'N/A'}</TableCell>
                                <TableCell>{wlan.security || wlan.type || 'N/A'}</TableCell>
                                <TableCell>{wlan.band || 'All'}</TableCell>
                                <TableCell>
                                  <Chip
                                    size="small"
                                    label={wlan.enabled === false ? 'Disabled' : 'Enabled'}
                                    color={wlan.enabled === false ? 'default' : 'success'}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                )}
              </Box>
            ) : (
              !loading && (
                <Typography color="text.secondary" align="center">
                  No WLAN performance data available
                </Typography>
              )
            )}
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={activeTab} index={3}>
            {securityData ? (
              <Box>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Threat Level"
                      value={securityData.threatLevel}
                      subtitle={`${securityData.criticalCount} critical alerts`}
                      icon={<SecurityIcon />}
                      color={
                        securityData.threatLevel === 'High'
                          ? 'error.main'
                          : securityData.threatLevel === 'Medium'
                          ? 'warning.main'
                          : 'success.main'
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Critical Alerts"
                      value={securityData.criticalCount}
                      subtitle="Requires attention"
                      icon={<ErrorIcon />}
                      color="error.main"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="IDPS Events"
                      value={securityData.totalIDPSEvents}
                      subtitle="Intrusion detection"
                      icon={<WarningIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Firewall Sessions"
                      value={securityData.totalFirewallSessions}
                      subtitle="Active sessions"
                      icon={<StorageIcon />}
                    />
                  </Grid>
                </Grid>

                {/* Alerts Table */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Recent Security Alerts
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Severity</TableCell>
                            <TableCell>Description</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {securityData.alerts.map((alert, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                {alert.timestamp
                                  ? new Date(alert.timestamp).toLocaleString()
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>{alert.type || 'N/A'}</TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  label={alert.severity || 'unknown'}
                                  color={
                                    alert.severity === 'critical' || alert.severity === 'CRITICAL'
                                      ? 'error'
                                      : alert.severity === 'warning' || alert.severity === 'WARNING'
                                      ? 'warning'
                                      : 'default'
                                  }
                                />
                              </TableCell>
                              <TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {alert.description || alert.message || 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))}
                          {securityData.alerts.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                No security alerts
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>

                {/* IDPS Events */}
                {securityData.idpsEvents.length > 0 && (
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        IDPS Events
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Time</TableCell>
                              <TableCell>Threat</TableCell>
                              <TableCell>Source</TableCell>
                              <TableCell>Destination</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {securityData.idpsEvents.map((event, idx) => (
                              <TableRow key={idx}>
                                <TableCell>
                                  {event.timestamp
                                    ? new Date(event.timestamp).toLocaleString()
                                    : 'N/A'}
                                </TableCell>
                                <TableCell>{event.threat_name || event.type || 'N/A'}</TableCell>
                                <TableCell>{event.src_ip || 'N/A'}</TableCell>
                                <TableCell>{event.dst_ip || 'N/A'}</TableCell>
                                <TableCell>
                                  <Chip
                                    size="small"
                                    label={event.action || 'detected'}
                                    color={event.action === 'blocked' ? 'error' : 'warning'}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                )}
              </Box>
            ) : (
              !loading && (
                <Typography color="text.secondary" align="center">
                  No security data available
                </Typography>
              )
            )}
          </TabPanel>

          {/* Inventory Tab */}
          <TabPanel value={activeTab} index={4}>
            {inventoryData ? (
              <Box>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Devices"
                      value={inventoryData.totalDevices}
                      subtitle="In inventory"
                      icon={<DevicesIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Firmware Compliance"
                      value={`${inventoryData.complianceRate}%`}
                      subtitle="Devices on target version"
                      icon={<CheckCircleIcon />}
                      color={inventoryData.complianceRate >= 90 ? 'success.main' : 'warning.main'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Device Types"
                      value={Object.keys(inventoryData.devicesByType).length}
                      subtitle="Categories"
                      icon={<StorageIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Firmware Versions"
                      value={inventoryData.devicesByFirmware.length}
                      subtitle="Unique versions"
                      icon={<ScheduleIcon />}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                  {/* Devices by Type */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Devices by Type
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Device Type</TableCell>
                                <TableCell align="right">Count</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(inventoryData.devicesByType).map(([type, devices], idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{type}</TableCell>
                                  <TableCell align="right">{devices.length}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Devices by Firmware */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Devices by Firmware Version
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Firmware Version</TableCell>
                                <TableCell align="right">Count</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {inventoryData.devicesByFirmware.map(([version, count], idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{version}</TableCell>
                                  <TableCell align="right">{count}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Full Device Inventory */}
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Device Inventory
                    </Typography>
                    <TableContainer sx={{ maxHeight: 400 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Serial</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Model</TableCell>
                            <TableCell>Firmware</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {inventoryData.deviceList.map((device, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{device.name || 'N/A'}</TableCell>
                              <TableCell>{device.serial}</TableCell>
                              <TableCell>{device.device_type}</TableCell>
                              <TableCell>{device.model || 'N/A'}</TableCell>
                              <TableCell>{device.firmware_version || device.swarm_version || 'N/A'}</TableCell>
                              <TableCell>
                                <StatusChip status={device.status} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              !loading && (
                <Typography color="text.secondary" align="center">
                  No inventory data available
                </Typography>
              )
            )}
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ReportingPage;
