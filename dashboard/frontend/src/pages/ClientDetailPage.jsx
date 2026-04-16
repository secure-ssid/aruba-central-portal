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
  const v = client?.snr ?? client?.signalStrength ?? client?.rssi ?? client?.signal_db ?? client?.signal ?? null;
  return v != null ? `${v} dB` : '—';
}

function getThroughputDisplay(client) {
  const tx = client?.txThroughput ?? client?.txBytes ?? client?.throughput ?? client?.tx_throughput ?? null;
  const rx = client?.rxThroughput ?? client?.rxBytes ?? client?.rx_throughput ?? null;
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
    { label: 'Site',         icon: <SiteIcon    sx={{ fontSize: 16 }} />, value: client?.siteName || '—' },
    { label: 'Network',      icon: <NetworkIcon sx={{ fontSize: 16 }} />, color: expColor, dot: true },
    { label: 'Applications', icon: <AppsIcon    sx={{ fontSize: 16 }} />, value: client?.trafficClass != null ? String(client.trafficClass) : '—' },
    { label: 'Security',     icon: <SecurityIcon sx={{ fontSize: 16 }} />, value: client?.role || client?.securityType || '—' },
    { label: 'Alerts',       icon: <AlertsIcon  sx={{ fontSize: 16 }} />, value: client?.alertCount != null ? String(client.alertCount) : '—' },
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

// ── Connection Info (replaces fake sparkline) ─────────────────────────────────

function formatDuration(seconds) {
  if (seconds < 60)    return `${seconds}s`;
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
}

function ConnectionInfo({ client }) {
  const status = client?.status || 'Unknown';
  const statusColor = getStatusColor(status);
  const experience = client?.experience;
  const expColor = getExperienceColor(experience || '');

  let connectedAt = '—';
  let duration = '—';
  const raw = client?.connectedSince;
  if (raw) {
    const ts = typeof raw === 'number' ? (raw > 1e10 ? raw : raw * 1000) : new Date(raw).getTime();
    if (!isNaN(ts)) {
      connectedAt = new Date(ts).toLocaleString();
      duration = formatDuration(Math.max(0, Math.floor((Date.now() - ts) / 1000)));
    }
  }

  const rows = [
    { label: 'Status',           value: status,                                        color: statusColor },
    { label: 'Experience',       value: experience || '—',                             color: experience ? expColor : undefined },
    { label: 'Connected Since',  value: connectedAt },
    { label: 'Session Duration', value: duration },
    { label: 'Signal (SNR)',     value: getSignal(client) },
    { label: 'IP Address',       value: getIp(client), mono: true },
    { label: 'Failure Stage',    value: client?.failureStage || client?.failure_stage || null },
    { label: 'Auth Type',        value: client?.authType || client?.auth_type || null },
  ].filter(r => r.value && r.value !== '—' && r.value !== null);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Connection</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.875 }}>
          {rows.map(r => (
            <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.25 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>{r.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.78rem', fontFamily: r.mono ? 'monospace' : 'inherit', color: r.color || 'text.primary' }}>
                {r.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// ── Mobility Trail (roaming history) ──────────────────────────────────────────

function MobilityTrail({ mac, isWireless }) {
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isWireless || !mac) return;
    setLoading(true);
    apiClient.get(`/clients/${encodeURIComponent(mac)}/mobility-trail`)
      .then(res => {
        const d = res.data;
        const items = d?.items || d?.trail || d?.mobility_trail || d?.mobilityTrail
                   || (Array.isArray(d) ? d : []);
        setTrail(items);
      })
      .catch(() => setTrail([]))
      .finally(() => setLoading(false));
  }, [mac, isWireless]);

  if (!isWireless) return null;
  if (loading) return (
    <Card>
      <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={20} sx={{ color: '#FF6600' }} />
      </CardContent>
    </Card>
  );
  if (!trail || trail.length === 0) return null;

  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
          Roaming History
          <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 1 }}>
            {trail.length} hop{trail.length !== 1 ? 's' : ''}
          </Typography>
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {trail.map((hop, i) => {
            const apName = hop.apName || hop.ap_name || hop.associatedDevice || hop.connectedTo
                        || hop.accessPointName || hop.deviceName || hop.serial || '—';
            const ts = hop.timestamp || hop.ts || hop.time || hop.connectedAt || hop.lastSeen;
            let timeStr = '';
            if (ts) {
              const t = typeof ts === 'number' && ts < 1e10 ? ts * 1000 : ts;
              timeStr = new Date(t).toLocaleString();
            }
            return (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.875, borderBottom: i < trail.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#3B82F6' }}>{i + 1}</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.78rem', display: 'block' }} noWrap>{apName}</Typography>
                  {timeStr && <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.66rem' }}>{timeStr}</Typography>}
                </Box>
                {hop.duration != null && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontFamily: 'monospace', flexShrink: 0 }}>
                    {hop.duration}s
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
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
  const retryRate = client?.retryRate ?? client?.retry_rate ?? client?.retryPct ?? client?.txRetryRate ?? client?.txRetries;
  const speed = client?.speed ?? client?.linkSpeed ?? client?.link_speed ?? client?.maxSpeed;

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
  // New API (network-monitoring v1 / v1alpha1) fields used as fallbacks:
  //   clientConnectionType → Category  (e.g. "Wireless", "Wired")
  //   authentication       → Function  (e.g. "Captive Portal")
  //   keyManagement        → Function  (e.g. "WPA2_PSK")
  //   capabilities         → Model/OS  (e.g. "802.11gn")
  const _safeStr = (v) => (v && !String(v).includes('/') ? String(v) : null);
  const fields = [
    {
      label: 'Category',
      value: client?.device_type || client?.deviceType || client?.deviceCategory || client?.category
          || _safeStr(client?.clientConnectionType)
          || _safeStr(client?.type)
          || '—',
    },
    {
      label: 'Function',
      value: client?.os_type || client?.osType || client?.deviceFamily || client?.function
          || client?.authentication
          || client?.keyManagement
          || '—',
    },
    {
      label: 'Vendor',
      value: client?.manufacturer || client?.vendor || '—',
    },
    {
      label: 'Model/OS',
      value: client?.os || client?.operatingSystem || client?.osVersion
          || client?.capabilities
          || '—',
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

            {/* Connection + Properties row */}
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={5}>
                <ConnectionInfo client={client} />
              </Grid>
              <Grid item xs={12} md={7}>
                <PropertiesPanel client={client} />
              </Grid>
            </Grid>

            {/* Connectivity path */}
            <ConnectivityPath client={client} />

            {/* Performance + Classification row */}
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={5}>
                <ConnectivityPerformance client={client} />
              </Grid>
              <Grid item xs={12} md={7}>
                <ClassificationPanel client={client} />
              </Grid>
            </Grid>

            {/* Network Details + Mobility Trail row */}
            <Grid container spacing={2.5}>
              {isWireless ? (
                <>
                  <Grid item xs={12} md={5}>
                    <NetworkDetails client={client} />
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <MobilityTrail mac={getMac(client)} isWireless={isWireless} />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <NetworkDetails client={client} />
                </Grid>
              )}
            </Grid>

          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ClientDetailPage;
