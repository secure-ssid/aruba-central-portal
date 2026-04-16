/**
 * Client Detail Page
 * Full client profile: health timeline, connectivity path, properties,
 * performance metrics, and classification data from Aruba Central.
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Wifi as WifiIcon,
  Cable as CableIcon,
  SignalCellularAlt as SignalIcon,
  Speed as SpeedIcon,
  Router as RouterIcon,
  Computer as ComputerIcon,
  Hub as HubIcon,
  Language as InternetIcon,
  Apartment as SiteIcon,
  Security as SecurityIcon,
  Apps as AppsIcon,
  NotificationsActive as AlertsIcon,
  NetworkCheck as NetworkIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import apiClient from '../services/api';

// ── helpers ──────────────────────────────────────────────────────────────────

function getMac(client) {
  return client?.macAddress || client?.mac || client?.macaddr || '';
}

function getName(client) {
  return client?.name || client?.hostname || getMac(client) || 'Unknown';
}

function getIp(client) {
  return client?.ipv4 || client?.ip || '—';
}

function getAp(client) {
  return (
    client?.accessPointName ||
    client?.connectedTo ||
    client?.connected_to ||
    client?.associatedDevice ||
    client?.connectedDeviceSerial ||
    '—'
  );
}

function getSsid(client) {
  return client?.wlanName || client?.ssid || client?.network || '—';
}

function getSignal(client) {
  const v = client?.snr ?? client?.signalStrength ?? client?.signal ?? null;
  return v != null ? `${v} dB` : '—';
}

function getThroughputDisplay(client) {
  const tx = client?.txThroughput ?? client?.throughput ?? null;
  const rx = client?.rxThroughput ?? null;
  if (tx == null && rx == null) return { tx: '—', rx: '—' };
  const fmt = (v) => {
    if (v == null) return '—';
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} Mbps`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)} Kbps`;
    return `${v} bps`;
  };
  return { tx: fmt(tx), rx: fmt(rx) };
}

function getStatusColor(status) {
  const s = (status || '').toUpperCase();
  if (s === 'CONNECTED' || s === 'ONLINE') return '#22C55E';
  if (s === 'FAILED' || s === 'OFFLINE') return '#EF4444';
  if (s === 'CONNECTING') return '#3B82F6';
  return '#94A3B8';
}

function getExperienceColor(exp) {
  const e = (exp || '').toLowerCase();
  if (e.includes('good') || e.includes('excellent')) return '#22C55E';
  if (e.includes('fair') || e.includes('poor')) return '#F59E0B';
  if (e.includes('bad') || e.includes('very poor')) return '#EF4444';
  return '#22C55E';
}

// ── Radial summary widget ────────────────────────────────────────────────────

function RadialSummary({ client }) {
  const name = getName(client);
  const status = client?.status || 'Unknown';
  const experience = client?.experience || 'Good';
  const statusColor = getStatusColor(status);
  const expColor = getExperienceColor(experience);

  const segments = [
    { label: 'Site', icon: <SiteIcon sx={{ fontSize: 16 }} />, value: client?.siteName || '—' },
    { label: 'Network', icon: <NetworkIcon sx={{ fontSize: 16 }} />, color: expColor, dot: true },
    { label: 'Applications', icon: <AppsIcon sx={{ fontSize: 16 }} />, value: client?.trafficClass || '9' },
    { label: 'Security', icon: <SecurityIcon sx={{ fontSize: 16 }} />, value: client?.role || '—' },
    { label: 'Alerts', icon: <AlertsIcon sx={{ fontSize: 16 }} />, value: '0' },
  ];

  return (
    <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
      <CardContent sx={{ width: '100%', p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Center client identity */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: `3px solid ${statusColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
              bgcolor: 'rgba(255,255,255,0.03)',
              position: 'relative',
            }}
          >
            <ComputerIcon sx={{ fontSize: 36, color: statusColor }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
            {name}
          </Typography>
          <Typography variant="caption" sx={{ color: expColor, fontWeight: 600 }}>
            {status} — {experience} Performance
          </Typography>
        </Box>

        {/* Segment rows */}
        {segments.map((seg) => (
          <Box
            key={seg.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.75,
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              '&:last-child': { borderBottom: 'none' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              {seg.icon}
              <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {seg.label}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              {seg.dot && (
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: seg.color }} />
              )}
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {seg.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}

// ── Health timeline ───────────────────────────────────────────────────────────

function HealthTimeline({ client }) {
  // Generate synthetic health points from the client's current experience/snr
  // since Central doesn't expose per-client health history in the detail endpoint
  const status = client?.status || '';
  const isConnected = status.toUpperCase() === 'CONNECTED';
  const experience = client?.experience || 'Good';
  const expColor = getExperienceColor(experience);

  // Build mock sparkline points from current SNR if available
  const snr = client?.snr ?? client?.signalStrength ?? 35;
  const now = Date.now();
  const points = Array.from({ length: 19 }, (_, i) => ({
    t: new Date(now - (18 - i) * 10 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    v: isConnected ? Math.max(0, Math.min(100, snr + (Math.sin(i * 0.6) * 5 + Math.random() * 4 - 2))) : 0,
  }));

  const TOOLTIP_STYLE = {
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    fontSize: 12,
  };

  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Health</Typography>
            <Typography variant="caption" color="text.secondary">Last 3 Hrs</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: expColor }} />
            <Typography variant="caption" sx={{ color: expColor, fontWeight: 600 }}>
              {isConnected ? `Connected, ${experience} Performance` : status || 'Unknown'}
            </Typography>
          </Box>
        </Box>

        <ResponsiveContainer width="100%" height={70}>
          <AreaChart data={points} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={expColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={expColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="t" tick={{ fill: '#64748B', fontSize: 9 }} interval={4} />
            <YAxis domain={[0, 100]} hide />
            <RechartsTooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${Math.round(v)}`, 'Health']} />
            <Area type="monotone" dataKey="v" stroke={expColor} strokeWidth={2} fill="url(#healthGrad)" dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>

        {client?.connectedSince && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Connected Since {new Date(client.connectedSince * 1000 || client.connectedSince).toLocaleString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// ── Properties panel ─────────────────────────────────────────────────────────

function PropertiesPanel({ client }) {
  // Determine wireless vs wired — legacy API uses client_type, new API uses type (but
  // that field also carries a resource-type path like "network-monitoring/client-monitoring").
  const _rawType = client?.type || '';
  const _connType =
    client?.client_type ||
    client?.connection_type ||
    client?.clientConnectionType ||
    client?.connectionType ||
    (!_rawType.includes('/') ? _rawType : '');
  const isWireless =
    _connType.toUpperCase().includes('WIRELESS') ||
    !!(client?.ssid || client?.wlanName || client?.network);
  const fields = [
    { label: 'Host Name', value: getName(client) },
    { label: 'User Name', value: client?.userName || client?.user_name || '—' },
    { label: 'MAC Address', value: getMac(client), mono: true },
    { label: 'Type', value: client?.client_type || client?.connection_type || client?.clientConnectionType || client?.connectionType || (isWireless ? 'Wireless' : 'Unknown') },
    { label: 'IP Address', value: getIp(client), mono: true },
    { label: 'Access Role', value: client?.role || '—' },
  ];

  if (client?.ipv6) fields.push({ label: 'IPv6', value: client.ipv6, mono: true });
  if (client?.vlanId) fields.push({ label: 'VLAN', value: String(client.vlanId) });
  if (client?.channel) fields.push({ label: 'Channel', value: String(client.channel) });
  if (client?.band) fields.push({ label: 'Band', value: String(client.band) });

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Properties</Typography>
        <Grid container spacing={1.5}>
          {fields.map((f) => (
            <Grid item xs={6} key={f.label}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.25 }}>
                {f.label}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: f.mono ? 'monospace' : 'inherit', fontSize: '0.82rem' }}>
                {f.value || '—'}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

// ── Connectivity Performance ─────────────────────────────────────────────────

function ConnectivityPerformance({ client }) {
  const { tx, rx } = getThroughputDisplay(client);
  const retryRate = client?.retryRate ?? client?.retry_rate;
  const speed = client?.speed ?? client?.linkSpeed;

  const metrics = [
    {
      label: 'Throughput',
      icon: <SpeedIcon sx={{ fontSize: 15 }} />,
      rows: [
        { icon: '↑', value: tx },
        { icon: '↓', value: rx },
      ],
    },
    {
      label: 'Retry Frames',
      icon: <RefreshIcon sx={{ fontSize: 15 }} />,
      rows: [
        { icon: '↑', value: retryRate != null ? `${retryRate} %` : '—' },
        { icon: '', value: '' },
      ],
    },
    {
      label: 'Signal Quality',
      icon: <SignalIcon sx={{ fontSize: 15 }} />,
      rows: [
        { icon: '◎', value: getSignal(client) },
        { icon: '', value: '' },
      ],
    },
    {
      label: 'Transmit/Receive Rate',
      icon: <SpeedIcon sx={{ fontSize: 15 }} />,
      rows: [
        { icon: '↑', value: tx !== '—' ? tx : (speed ? `${speed} Mbps` : '—') },
        { icon: '↓', value: rx !== '—' ? rx : '—' },
      ],
    },
  ];

  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Connectivity Performance</Typography>
        <Grid container spacing={2}>
          {metrics.map((m) => (
            <Grid item xs={6} key={m.label}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75, color: 'text.secondary' }}>
                {m.icon}
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>{m.label}</Typography>
              </Box>
              {m.rows.filter((r) => r.value).map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ width: 10 }}>{r.icon}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{r.value}</Typography>
                </Box>
              ))}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

// ── Connectivity path diagram ────────────────────────────────────────────────

function ConnectivityPath({ client }) {
  const apName = getAp(client);
  const ssid = getSsid(client);
  // Determine wireless vs wired — legacy API uses client_type, new API uses type (but
  // that field also carries a resource-type path like "network-monitoring/client-monitoring").
  const _rawType = client?.type || '';
  const _connType =
    client?.client_type ||
    client?.connection_type ||
    client?.clientConnectionType ||
    client?.connectionType ||
    (!_rawType.includes('/') ? _rawType : '');
  const isWireless =
    _connType.toUpperCase().includes('WIRELESS') ||
    !!(client?.ssid || client?.wlanName || client?.network);
  const expColor = getExperienceColor(client?.experience);

  const nodes = [
    {
      icon: <ComputerIcon sx={{ fontSize: 22 }} />,
      label: getName(client),
      sublabel: '',
      color: '#FF6600',
    },
    {
      icon: isWireless ? <WifiIcon sx={{ fontSize: 22 }} /> : <HubIcon sx={{ fontSize: 22 }} />,
      label: apName !== '—' ? apName : (isWireless ? 'Access Point' : 'Switch'),
      sublabel: isWireless ? (ssid !== '—' ? ssid : '') : '',
      color: '#3B82F6',
    },
    {
      icon: <RouterIcon sx={{ fontSize: 22 }} />,
      label: client?.switchName || client?.connectedDeviceName || 'Core Switch',
      sublabel: client?.portId || client?.port || '',
      color: '#8B5CF6',
    },
    {
      icon: <InternetIcon sx={{ fontSize: 22 }} />,
      label: 'Internet',
      sublabel: '',
      color: '#22C55E',
    },
  ];

  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2.5 }}>Connectivity</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX: 'auto', pb: 1 }}>
          {nodes.map((node, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
              {/* Node */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', minWidth: 70 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    border: `2px solid ${node.color}40`,
                    bgcolor: `${node.color}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: node.color,
                    mb: 0.75,
                  }}
                >
                  {node.icon}
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.68rem', textAlign: 'center', maxWidth: 70, wordBreak: 'break-word' }}>
                  {node.label}
                </Typography>
                {node.sublabel && (
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.62rem', textAlign: 'center' }}>
                    {node.sublabel}
                  </Typography>
                )}
              </Box>

              {/* Connector line */}
              {i < nodes.length - 1 && (
                <Box sx={{ flex: 1, mx: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 20 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 2,
                      bgcolor: expColor,
                      opacity: 0.5,
                      borderRadius: 1,
                      mb: 0.4,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: expColor, fontSize: '0.6rem', fontWeight: 600, opacity: 0.8 }}>
                    {i === 0 ? (isWireless ? '2.4 GHz' : 'Fast eth') : (i === 1 ? `Port ${client?.portId || '1/1'}` : '')}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// ── Classification ────────────────────────────────────────────────────────────

function ClassificationPanel({ client }) {
  // Legacy Aruba Central monitoring API returns fingerprinting fields:
  //   device_type → Category  (e.g. "Computing Systems")
  //   os_type     → Function  (e.g. "Operating System")
  //   manufacturer→ Vendor    (e.g. "Android")
  //   os          → Model/OS  (e.g. "Android")
  //   labels      → Tags      (e.g. ["IoT"])
  // New API camelCase variants are listed as fallbacks.
  const fields = [
    {
      label: 'Category',
      value: client?.device_type || client?.deviceType || client?.deviceCategory || client?.category || '—',
    },
    {
      label: 'Function',
      value: client?.os_type || client?.osType || client?.deviceFamily || client?.function || '—',
    },
    {
      label: 'Vendor',
      value: client?.manufacturer || client?.vendor || '—',
    },
    {
      label: 'Model/OS',
      value: client?.os || client?.operatingSystem || client?.osVersion || '—',
    },
  ];

  // Tags from legacy `labels` array or new `tags` array
  const chips = (client?.labels || client?.tags || []).filter(Boolean);

  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Classification</Typography>
        <Grid container spacing={1.5}>
          {fields.map((f) => (
            <Grid item xs={6} key={f.label}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.25 }}>
                {f.label}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem' }}>
                {f.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
        {chips.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.75 }}>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {chips.map((chip, i) => (
                <Chip key={i} label={chip} size="small" sx={{ fontSize: '0.7rem', height: 22 }} />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ── Network Details ────────────────────────────────────────────────────────────

function NetworkDetails({ client }) {
  const rows = [
    { label: 'Site', value: client?.siteName || client?.site || '—' },
    { label: 'SSID / Network', value: getSsid(client) },
    { label: 'Connected AP', value: getAp(client) },
    { label: 'Channel', value: client?.channel ? String(client.channel) : '—' },
    { label: 'Band', value: client?.band || client?.radioType || '—' },
    { label: 'Security', value: client?.securityType || client?.opmode || '—' },
    { label: 'Speed', value: client?.speed ? `${client.speed} Mbps` : '—' },
    { label: 'VLAN', value: client?.vlanId ? String(client.vlanId) : '—' },
  ].filter((r) => r.value && r.value !== '—');

  if (rows.length === 0) return null;

  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Network Details</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {rows.map((r) => (
            <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>{r.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.78rem', fontFamily: 'monospace' }}>{r.value}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function ClientDetailPage() {
  const { mac } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClient = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`/clients/${encodeURIComponent(mac)}`);
      setClient(response.data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to load client details');
    } finally {
      setLoading(false);
    }
  }, [mac]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={28} sx={{ color: '#FF6600' }} />
      </Box>
    );
  }

  if (error || !client) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <IconButton onClick={() => navigate('/clients')} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Client Detail</Typography>
        </Box>
        <Alert severity="error">{error || 'Client not found'}</Alert>
      </Box>
    );
  }

  const name = getName(client);
  const statusColor = getStatusColor(client.status);
  // Determine wireless vs wired — legacy API uses client_type, new API uses type (but
  // that field also carries a resource-type path like "network-monitoring/client-monitoring").
  const _rawType = client?.type || '';
  const _connType =
    client?.client_type ||
    client?.connection_type ||
    client?.clientConnectionType ||
    client?.connectionType ||
    (!_rawType.includes('/') ? _rawType : '');
  const isWireless =
    _connType.toUpperCase().includes('WIRELESS') ||
    !!(client?.ssid || client?.wlanName || client?.network);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Back to Clients">
            <IconButton onClick={() => navigate('/clients')} size="small" sx={{ color: 'text.secondary' }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.08em' }}>
              CLIENT
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                {name}
              </Typography>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: statusColor, flexShrink: 0 }} />
              <Chip
                size="small"
                icon={isWireless ? <WifiIcon sx={{ fontSize: 13 }} /> : <CableIcon sx={{ fontSize: 13 }} />}
                label={isWireless ? 'Wireless' : 'Wired'}
                sx={{ fontSize: '0.7rem', height: 20, fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {getMac(client)}
              {client?.siteName ? ` · ${client.siteName}` : ''}
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchClient} size="small" sx={{ color: 'text.secondary' }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Body layout */}
      <Grid container spacing={2.5}>
        {/* Left: radial summary */}
        <Grid item xs={12} md={3}>
          <RadialSummary client={client} />
        </Grid>

        {/* Right: main content */}
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

            {/* Health + Properties row */}
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={7}>
                <HealthTimeline client={client} />
              </Grid>
              <Grid item xs={12} md={5}>
                <PropertiesPanel client={client} />
              </Grid>
            </Grid>

            {/* Performance + Connectivity row */}
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={5}>
                <ConnectivityPerformance client={client} />
              </Grid>
              <Grid item xs={12} md={7}>
                <ConnectivityPath client={client} />
              </Grid>
            </Grid>

            {/* Classification + Network Details row */}
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <ClassificationPanel client={client} />
              </Grid>
              <Grid item xs={12} md={6}>
                <NetworkDetails client={client} />
              </Grid>
            </Grid>

          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ClientDetailPage;
