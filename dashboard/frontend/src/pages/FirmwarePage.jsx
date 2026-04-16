/**
 * Firmware Management Page
 * View firmware compliance, per-device versions, and schedule upgrades
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Tooltip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  SystemUpdate as SystemUpdateIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Upgrade as UpgradeIcon,
} from '@mui/icons-material';
import { firmwareAPI, deviceAPI } from '../services/api';

const DEVICE_TYPES = ['IAP', 'SWITCH', 'GATEWAY', 'CX'];

function FirmwarePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compliance, setCompliance] = useState(null);
  const [devices, setDevices] = useState([]);
  const [versions, setVersions] = useState([]);
  const [search, setSearch] = useState('');
  const [upgradeDialog, setUpgradeDialog] = useState({ open: false, device: null });
  const [selectedVersion, setSelectedVersion] = useState('');
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState('');
  const [versionsLoading, setVersionsLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [complianceData, devicesData] = await Promise.all([
        firmwareAPI.getCompliance().catch(() => null),
        deviceAPI.getAll().catch(() => ({ items: [] })),
      ]);
      setCompliance(complianceData);
      const items = Array.isArray(devicesData)
        ? devicesData
        : devicesData?.result || devicesData?.items || devicesData?.devices || [];
      setDevices(items);
    } catch (err) {
      setError(err.message || 'Failed to load firmware data');
    } finally {
      setLoading(false);
    }
  };

  const openUpgradeDialog = async (device) => {
    setUpgradeDialog({ open: true, device });
    setSelectedVersion('');
    setVersionsLoading(true);
    try {
      const typeMap = { SWITCH: 'SWITCH', AP: 'IAP', GATEWAY: 'GATEWAY' };
      const dtype = typeMap[device.deviceType] || 'IAP';
      const data = await firmwareAPI.getVersions(dtype);
      const list = data?.firmware_list || data?.versions || data?.items || [];
      setVersions(list);
    } catch {
      setVersions([]);
    } finally {
      setVersionsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!upgradeDialog.device || !selectedVersion) return;
    setUpgrading(true);
    try {
      await firmwareAPI.scheduleUpgrade({
        serial: upgradeDialog.device.serialNumber,
        firmware_version: selectedVersion,
      });
      setUpgradeDialog({ open: false, device: null });
      setUpgradeSuccess(`Upgrade scheduled for ${upgradeDialog.device.deviceName || upgradeDialog.device.serialNumber}`);
      setTimeout(() => setUpgradeSuccess(''), 5000);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Upgrade scheduling failed');
      setUpgradeDialog({ open: false, device: null });
    } finally {
      setUpgrading(false);
    }
  };

  const filteredDevices = devices.filter((d) => {
    const q = search.toLowerCase();
    return (
      !q ||
      d.deviceName?.toLowerCase().includes(q) ||
      d.serialNumber?.toLowerCase().includes(q) ||
      d.model?.toLowerCase().includes(q) ||
      d.firmwareVersion?.toLowerCase().includes(q)
    );
  });

  const compliantCount = compliance?.compliant ?? devices.filter((d) => d.firmwareVersion).length;
  const nonCompliantCount = compliance?.non_compliant ?? 0;
  const scheduledCount = compliance?.scheduled ?? 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={28} sx={{ color: '#FF6600' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Firmware Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor device firmware compliance and schedule upgrades
          </Typography>
        </Box>
        <Button startIcon={<RefreshIcon />} onClick={fetchAll} variant="outlined" size="small">
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {upgradeSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setUpgradeSuccess('')}>
          {upgradeSuccess}
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Compliant Devices
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#22C55E' }}>
                    {compliantCount ?? 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 20, color: '#22C55E' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Non-Compliant
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#F59E0B' }}>
                    {nonCompliantCount ?? 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <WarningIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Upgrades Scheduled
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF6600' }}>
                    {scheduledCount}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(255,102,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SystemUpdateIcon sx={{ fontSize: 20, color: '#FF6600' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Device Firmware Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 2.5, pt: 2, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Device Firmware Status
            </Typography>
            <TextField
              size="small"
              placeholder="Search devices…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 260 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch('')}><ClearIcon sx={{ fontSize: 16 }} /></IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Device</TableCell>
                  <TableCell sx={{ width: 100 }}>Type</TableCell>
                  <TableCell sx={{ width: 140 }}>Model</TableCell>
                  <TableCell sx={{ width: 180 }}>Firmware Version</TableCell>
                  <TableCell sx={{ width: 100 }}>Status</TableCell>
                  <TableCell sx={{ width: 120 }} align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDevices.length > 0 ? (
                  filteredDevices.map((device, idx) => (
                    <TableRow key={device.serialNumber || idx} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {device.deviceName || device.serialNumber || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {device.serialNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={device.deviceType || 'N/A'}
                          variant="outlined"
                          sx={{ fontSize: '0.68rem', height: 20, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>
                          {device.model || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                          {device.firmwareVersion || device.softwareVersion || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={device.status || 'Unknown'}
                          color={
                            device.status === 'ONLINE' || device.status === 'Up'
                              ? 'success'
                              : device.status === 'OFFLINE' || device.status === 'Down'
                              ? 'error'
                              : 'default'
                          }
                          sx={{ fontSize: '0.68rem', height: 20, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Schedule firmware upgrade">
                          <span>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<UpgradeIcon sx={{ fontSize: 14 }} />}
                              onClick={() => openUpgradeDialog(device)}
                              disabled={device.status === 'OFFLINE' || !device.serialNumber}
                              sx={{ fontSize: '0.72rem', py: 0.25 }}
                            >
                              Upgrade
                            </Button>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <SystemUpdateIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.08)', mb: 1.5 }} />
                      <Typography variant="body2" color="text.secondary" display="block">
                        {search ? 'No devices match your search' : 'No devices found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialog.open} onClose={() => setUpgradeDialog({ open: false, device: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Firmware Upgrade</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Schedule a firmware upgrade for <strong>{upgradeDialog.device?.deviceName || upgradeDialog.device?.serialNumber}</strong>.
            The device will upgrade during the next maintenance window.
          </DialogContentText>
          {versionsLoading ? (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={24} sx={{ color: '#FF6600' }} />
            </Box>
          ) : (
            <TextField
              select
              fullWidth
              label="Target Firmware Version"
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              size="small"
            >
              {versions.length > 0 ? (
                versions.map((v, i) => (
                  <MenuItem key={i} value={v.firmware_version || v.version || v}>
                    {v.firmware_version || v.version || v}
                    {v.release_date && ` — ${v.release_date}`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  No versions available for this device type
                </MenuItem>
              )}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeDialog({ open: false, device: null })} disabled={upgrading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            variant="contained"
            disabled={upgrading || !selectedVersion}
            sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#E55500' } }}
          >
            {upgrading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Schedule Upgrade'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FirmwarePage;
