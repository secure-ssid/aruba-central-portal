/**
 * Gateway WAN/VPN Dashboard
 * Monitoring and troubleshooting for gateways, WAN interfaces, and VPN tunnels
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
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
  CircularProgress,
  Alert,
  Button,
  Stack,
  Collapse,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RouterIcon from '@mui/icons-material/Router';
import HubIcon from '@mui/icons-material/Hub';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SpeedIcon from '@mui/icons-material/Speed';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import CloseIcon from '@mui/icons-material/Close';

import { monitoringAPIv2, apiClient } from '../services/api';
import StatusChip from '../components/StatusChip';
import { formatUptime, formatBytes } from '../utils/formatUtils';

// ─── Stats Card ───────────────────────────────────────────────────────────────

function StatCard({ title, value, icon, color = '#FF6600', loading }) {
  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>
              {title}
            </Typography>
            {loading ? (
              <CircularProgress size={20} sx={{ mt: 0.5, color }} />
            ) : (
              <Typography variant="h4" sx={{ fontWeight: 700, color, lineHeight: 1.2, mt: 0.5 }}>
                {value ?? '—'}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
              border: `1px solid ${color}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── WAN Status Tab ───────────────────────────────────────────────────────────

function WANStatusTab({ serial }) {
  const [wanInterfaces, setWanInterfaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await apiClient.get(`/config/gateways/${serial}/wan-interfaces`);
        const data = res.data;
        setWanInterfaces(data?.wan_interfaces || data?.interfaces || data?.data || data || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load WAN interfaces');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [serial]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={28} sx={{ color: '#FF6600' }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="warning" sx={{ mt: 1 }}>{error}</Alert>;
  }

  if (!wanInterfaces.length) {
    return <Alert severity="info" sx={{ mt: 1 }}>No WAN interface data available.</Alert>;
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Interface</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>IP Address</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wanInterfaces.map((iface, idx) => (
            <TableRow key={idx} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
              <TableCell sx={{ fontWeight: 500, color: '#F1F5F9' }}>
                {iface.name || iface.interface_name || `Interface ${idx + 1}`}
              </TableCell>
              <TableCell sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                {iface.type || iface.wan_type || '—'}
              </TableCell>
              <TableCell sx={{ color: '#94A3B8', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                {iface.ip_address || iface.ip || '—'}
              </TableCell>
              <TableCell>
                <StatusChip status={iface.status || iface.link_status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─── VPN Tunnels Tab ──────────────────────────────────────────────────────────

function VPNTunnelsTab({ serial }) {
  const [tunnels, setTunnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError('');
        // Try monitoring tunnels first, fall back to config tunnels
        const [monRes, cfgRes] = await Promise.allSettled([
          monitoringAPIv2.getGatewayTunnels(serial),
          apiClient.get(`/config/gateways/${serial}/wan-tunnels`),
        ]);

        let tunnelList = [];
        if (monRes.status === 'fulfilled') {
          const d = monRes.value;
          tunnelList = d?.tunnels || d?.data || d || [];
        } else if (cfgRes.status === 'fulfilled') {
          const d = cfgRes.value.data;
          tunnelList = d?.tunnels || d?.wan_tunnels || d?.data || d || [];
        }
        setTunnels(Array.isArray(tunnelList) ? tunnelList : []);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load tunnel data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [serial]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={28} sx={{ color: '#FF6600' }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="warning" sx={{ mt: 1 }}>{error}</Alert>;
  }

  if (!tunnels.length) {
    return <Alert severity="info" sx={{ mt: 1 }}>No VPN tunnel data available.</Alert>;
  }

  const maxBytes = Math.max(...tunnels.map((t) => Math.max(t.rx_bytes || 0, t.tx_bytes || 0)), 1);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tunnel Name</TableCell>
            <TableCell>Peer</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Uptime</TableCell>
            <TableCell sx={{ minWidth: 160 }}>RX / TX</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tunnels.map((tunnel, idx) => {
            const rxPct = ((tunnel.rx_bytes || 0) / maxBytes) * 100;
            const txPct = ((tunnel.tx_bytes || 0) / maxBytes) * 100;
            return (
              <TableRow key={idx} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                <TableCell sx={{ fontWeight: 500, color: '#F1F5F9', fontSize: '0.85rem' }}>
                  {tunnel.name || tunnel.tunnel_name || `Tunnel ${idx + 1}`}
                </TableCell>
                <TableCell sx={{ color: '#94A3B8', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  {tunnel.peer_ip || tunnel.peer || tunnel.remote_ip || '—'}
                </TableCell>
                <TableCell>
                  <StatusChip status={tunnel.status || tunnel.state} />
                </TableCell>
                <TableCell sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                  {formatUptime(tunnel.uptime)}
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.25}>
                        <Typography variant="caption" sx={{ color: '#3B82F6', fontSize: '0.65rem' }}>
                          RX {formatBytes(tunnel.rx_bytes)}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={rxPct}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: 'rgba(59,130,246,0.15)',
                          '& .MuiLinearProgress-bar': { bgcolor: '#3B82F6', borderRadius: 2 },
                        }}
                      />
                    </Box>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.25}>
                        <Typography variant="caption" sx={{ color: '#22C55E', fontSize: '0.65rem' }}>
                          TX {formatBytes(tunnel.tx_bytes)}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={txPct}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: 'rgba(34,197,94,0.15)',
                          '& .MuiLinearProgress-bar': { bgcolor: '#22C55E', borderRadius: 2 },
                        }}
                      />
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─── Gateway Detail Panel ─────────────────────────────────────────────────────

function GatewayDetailPanel({ serial }) {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box
      sx={{
        bgcolor: '#0D1220',
        border: '1px solid rgba(255,102,0,0.15)',
        borderRadius: 2,
        p: 2,
        mt: 0.5,
      }}
    >
      <Tabs
        value={tabValue}
        onChange={(_, v) => setTabValue(v)}
        sx={{
          mb: 2,
          minHeight: 36,
          '& .MuiTab-root': { minHeight: 36, fontSize: '0.8rem', textTransform: 'none', fontWeight: 500 },
          '& .MuiTabs-indicator': { backgroundColor: '#FF6600' },
          '& .Mui-selected': { color: '#FF6600 !important' },
        }}
      >
        <Tab label="WAN Status" />
        <Tab label="VPN Tunnels" />
      </Tabs>

      {tabValue === 0 && <WANStatusTab serial={serial} />}
      {tabValue === 1 && <VPNTunnelsTab serial={serial} />}
    </Box>
  );
}

// ─── Troubleshoot Dialog ──────────────────────────────────────────────────────

function TroubleshootDialog({ open, onClose, serial, type }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !serial || !type) return;
    setResult(null);
    setError('');
    const run = async () => {
      try {
        setLoading(true);
        const endpoint = type === 'iperf'
          ? `/troubleshoot/gateways/${serial}/iperf`
          : `/troubleshoot/gateways/${serial}/pingsweep`;
        const res = await apiClient.post(endpoint, {});
        setResult(res.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Test failed');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [open, serial, type]);

  const title = type === 'iperf' ? 'iPerf Bandwidth Test' : 'Ping Sweep';

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#111827',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          pb: 1.5,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {type === 'iperf' ? <SpeedIcon sx={{ color: '#FF6600' }} /> : <NetworkCheckIcon sx={{ color: '#FF6600' }} />}
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            {title}
          </Typography>
          <Chip
            size="small"
            label={`Serial: ${serial}`}
            sx={{ bgcolor: 'rgba(255,102,0,0.12)', color: '#FF8C42', fontSize: '0.7rem' }}
          />
        </Stack>
        {!loading && (
          <IconButton size="small" onClick={onClose} sx={{ color: '#64748B' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {loading && (
          <Stack alignItems="center" spacing={2} py={4}>
            <CircularProgress sx={{ color: '#FF6600' }} />
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Running {title}...
            </Typography>
          </Stack>
        )}

        {!loading && error && (
          <Alert severity="error">{error}</Alert>
        )}

        {!loading && result && !error && (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>Test completed successfully</Alert>
            <Paper
              component="pre"
              sx={{
                p: 2,
                bgcolor: '#0A0E1A',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 1.5,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#94A3B8',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                maxHeight: 360,
                overflowY: 'auto',
              }}
            >
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.07)', px: 2.5, py: 1.5 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Gateway Row ──────────────────────────────────────────────────────────────

function GatewayRow({ gateway, onAction }) {
  const [expanded, setExpanded] = useState(false);

  const serial = gateway.serial || gateway.device_id;
  const name = gateway.name || gateway.hostname || serial;
  const model = gateway.model || gateway.platform || '—';
  const site = gateway.site || gateway.site_name || '—';
  const status = gateway.status || (gateway.is_connected ? 'Up' : 'Down');
  const uptime = gateway.uptime_seconds ?? gateway.uptime ?? null;
  const wanIp = gateway.ip_address || gateway.wan_ip || gateway.public_ip_address || '—';

  return (
    <>
      <TableRow
        hover
        sx={{
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
          bgcolor: expanded ? 'rgba(255,102,0,0.04)' : 'transparent',
          transition: 'background-color 0.15s',
        }}
      >
        {/* Expand toggle */}
        <TableCell sx={{ width: 40, pr: 0 }}>
          <IconButton size="small" onClick={() => setExpanded((v) => !v)} sx={{ color: '#64748B' }}>
            {expanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </IconButton>
        </TableCell>

        <TableCell onClick={() => setExpanded((v) => !v)} sx={{ fontWeight: 500, color: '#F1F5F9' }}>
          {name}
        </TableCell>
        <TableCell onClick={() => setExpanded((v) => !v)} sx={{ color: '#94A3B8', fontSize: '0.8rem', fontFamily: 'monospace' }}>
          {serial}
        </TableCell>
        <TableCell onClick={() => setExpanded((v) => !v)} sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
          {model}
        </TableCell>
        <TableCell onClick={() => setExpanded((v) => !v)} sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
          {site}
        </TableCell>
        <TableCell onClick={() => setExpanded((v) => !v)}>
          <StatusChip status={status} />
        </TableCell>
        <TableCell onClick={() => setExpanded((v) => !v)} sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
          {formatUptime(typeof uptime === 'number' ? uptime : null)}
        </TableCell>
        <TableCell onClick={() => setExpanded((v) => !v)} sx={{ color: '#94A3B8', fontSize: '0.85rem', fontFamily: 'monospace' }}>
          {wanIp}
        </TableCell>

        {/* Action buttons */}
        <TableCell>
          <Stack direction="row" spacing={0.75}>
            <Tooltip title="iPerf Bandwidth Test">
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => { e.stopPropagation(); onAction(serial, 'iperf'); }}
                startIcon={<SpeedIcon sx={{ fontSize: 14 }} />}
                sx={{
                  fontSize: '0.7rem',
                  py: 0.3,
                  px: 1,
                  borderColor: 'rgba(255,102,0,0.4)',
                  color: '#FF8C42',
                  '&:hover': { borderColor: '#FF6600', bgcolor: 'rgba(255,102,0,0.08)' },
                }}
              >
                iPerf
              </Button>
            </Tooltip>
            <Tooltip title="Ping Sweep">
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => { e.stopPropagation(); onAction(serial, 'pingsweep'); }}
                startIcon={<NetworkCheckIcon sx={{ fontSize: 14 }} />}
                sx={{
                  fontSize: '0.7rem',
                  py: 0.3,
                  px: 1,
                  borderColor: 'rgba(59,130,246,0.4)',
                  color: '#60A5FA',
                  '&:hover': { borderColor: '#3B82F6', bgcolor: 'rgba(59,130,246,0.08)' },
                }}
              >
                Ping
              </Button>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>

      {/* Expanded detail row */}
      <TableRow>
        <TableCell colSpan={9} sx={{ p: 0, border: 0 }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ px: 2, pb: 2 }}>
              {serial && <GatewayDetailPanel serial={serial} />}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GatewayWANPage() {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Troubleshoot dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSerial, setDialogSerial] = useState('');
  const [dialogType, setDialogType] = useState('');

  const fetchGateways = useCallback(async () => {
    try {
      setError('');
      const res = await monitoringAPIv2.getGatewaysMonitoring();
      const list = res?.gateways || res?.data || res || [];
      setGateways(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load gateways');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGateways();
  }, [fetchGateways]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchGateways, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchGateways]);

  const handleAction = (serial, type) => {
    setDialogSerial(serial);
    setDialogType(type);
    setDialogOpen(true);
  };

  // Derived stats
  const total = gateways.length;
  const online = gateways.filter((g) => {
    const s = g.status || (g.is_connected ? 'Up' : 'Down');
    return s === 'Up' || s === 'up' || s === 'online';
  }).length;
  const offline = total - online;

  // Active tunnels: sum from any gateway that has tunnel_count or similar
  const activeTunnels = gateways.reduce((acc, g) => {
    return acc + (g.tunnel_count || g.active_tunnels || g.vpn_tunnel_count || 0);
  }, 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0A0E1A' }}>
      {/* ── Page Header ── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FF6600 0%, #FF8C42 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255,102,0,0.35)',
              }}
            >
              <VpnLockIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9' }}>
              Gateway WAN / VPN
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Monitor WAN interfaces and VPN tunnel health across all gateways
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF6600' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#FF6600' },
                }}
              />
            }
            label={
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                Auto-refresh (30s)
              </Typography>
            }
          />
          <Tooltip title="Refresh now">
            <IconButton
              onClick={() => { setLoading(true); fetchGateways(); }}
              disabled={loading}
              sx={{
                color: '#FF6600',
                border: '1px solid rgba(255,102,0,0.3)',
                borderRadius: '8px',
                '&:hover': { bgcolor: 'rgba(255,102,0,0.08)' },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* ── Stats Cards ── */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Gateways"
            value={loading ? null : total}
            icon={<DevicesOtherIcon />}
            color="#FF6600"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Online"
            value={loading ? null : online}
            icon={<CheckCircleIcon />}
            color="#22C55E"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Offline"
            value={loading ? null : offline}
            icon={<ErrorOutlineIcon />}
            color="#EF4444"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Tunnels"
            value={loading ? null : activeTunnels}
            icon={<HubIcon />}
            color="#3B82F6"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* ── Gateway Table ── */}
      <Card>
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <RouterIcon sx={{ color: '#FF6600', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
            Gateways
          </Typography>
          {!loading && (
            <Chip
              size="small"
              label={total}
              sx={{ ml: 0.5, bgcolor: 'rgba(255,102,0,0.12)', color: '#FF8C42', fontSize: '0.7rem', height: 18 }}
            />
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#FF6600' }} />
          </Box>
        ) : gateways.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <RouterIcon sx={{ fontSize: 48, color: '#1C2333', mb: 1 }} />
            <Typography variant="body2" sx={{ color: '#475569' }}>
              No gateways found
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 40 }} />
                  <TableCell>Name</TableCell>
                  <TableCell>Serial</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Site</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Uptime</TableCell>
                  <TableCell>WAN IP</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gateways.map((gw, idx) => (
                  <GatewayRow
                    key={gw.serial || gw.device_id || idx}
                    gateway={gw}
                    onAction={handleAction}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* ── Troubleshoot Dialog ── */}
      <TroubleshootDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        serial={dialogSerial}
        type={dialogType}
      />
    </Box>
  );
}
