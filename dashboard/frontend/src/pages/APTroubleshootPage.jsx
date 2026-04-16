/**
 * AP Troubleshooting Toolkit
 * Comprehensive diagnostic tools for access points
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  Build as BuildIcon,
  NetworkCheck as NetworkCheckIcon,
  Speed as SpeedIcon,
  Dns as DnsIcon,
  Http as HttpIcon,
  PersonRemove as PersonRemoveIcon,
  Radio as RadioIcon,
  BugReport as BugReportIcon,
  PowerSettingsNew as PowerIcon,
  LocationSearching as LocateIcon,
  ContentCopy as CopyIcon,
  Route as RouteIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { apiClient, monitoringAPIv2, troubleshootAPI } from '../services/api';
import StatusChip from '../components/StatusChip';

function ResultPanel({ result, loading, error }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      typeof result === 'string' ? result : JSON.stringify(result, null, 2)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!loading && !result && !error) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ mb: 1.5 }} />
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
          <CircularProgress size={18} sx={{ color: '#FF6600' }} />
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Running...
          </Typography>
        </Box>
      )}
      {error && !loading && (
        <Alert severity="error" sx={{ fontSize: '0.8rem' }}>
          {error}
        </Alert>
      )}
      {result && !loading && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <Tooltip title={copied ? 'Copied!' : 'Copy'}>
              <IconButton size="small" onClick={handleCopy} sx={{ color: '#64748B' }}>
                <CopyIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Paper
            sx={{
              p: 2,
              backgroundColor: '#0A0E1A',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 2,
              overflowX: 'auto',
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            <Typography
              component="pre"
              sx={{
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: '0.75rem',
                color: '#CBD5E1',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                m: 0,
              }}
            >
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

// ─── AP Info Card ─────────────────────────────────────────────────────────────

function APInfoCard({ ap, loading }) {
  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            {[...Array(8)].map((_, i) => (
              <Grid item xs={6} sm={3} key={i}>
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={28} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  if (!ap) return null;

  const fields = [
    { label: 'Name', value: ap.name || ap.hostname || '—' },
    { label: 'Serial', value: ap.serial || '—' },
    { label: 'Model', value: ap.model || '—' },
    { label: 'Site', value: ap.site || '—' },
    { label: 'Status', value: <StatusChip status={ap.status} /> },
    { label: 'IP Address', value: ap.ip_address || '—' },
    { label: 'MAC Address', value: ap.macaddr || ap.mac || '—' },
    { label: 'Firmware', value: ap.firmware_version || ap.swarm_master_ip || '—' },
  ];

  return (
    <Card sx={{ mb: 3, border: '1px solid rgba(255,102,0,0.2)', boxShadow: '0 0 20px rgba(255,102,0,0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <WifiIcon sx={{ color: '#FF6600', fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
            Access Point Details
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {fields.map(({ label, value }) => (
            <Grid item xs={6} sm={3} key={label}>
              <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
              </Typography>
              <Box sx={{ mt: 0.25 }}>
                {typeof value === 'string' ? (
                  <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 500, fontFamily: label === 'Serial' || label === 'MAC Address' || label === 'IP Address' ? '"JetBrains Mono", monospace' : 'inherit', fontSize: label === 'Serial' || label === 'MAC Address' ? '0.75rem' : 'inherit' }}>
                    {value}
                  </Typography>
                ) : (
                  value
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

// ─── Tool Card ────────────────────────────────────────────────────────────────

function ToolCard({ icon, title, description, children, accentColor = '#FF6600' }) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: `${accentColor}30` },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '9px',
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#F1F5F9', lineHeight: 1.2 }}>
              {title}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
              {description}
            </Typography>
          </Box>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

// ─── Radio Stats Display ──────────────────────────────────────────────────────

function RadioStatsDisplay({ data }) {
  const radios = data?.radios || data?.data?.radios || (Array.isArray(data) ? data : null);

  if (!radios || radios.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: '#64748B', mt: 1 }}>
        No radio data available
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 1.5, backgroundColor: '#0A0E1A', border: '1px solid rgba(255,255,255,0.07)' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {['Radio', 'Band', 'Channel', 'Tx Power', 'Noise', 'Clients', 'Util%'].map((h) => (
              <TableCell key={h} sx={{ color: '#64748B', fontSize: '0.68rem', py: 0.75 }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {radios.map((r, i) => (
            <TableRow key={i}>
              <TableCell sx={{ color: '#CBD5E1', fontSize: '0.75rem', py: 0.75 }}>{r.index ?? i}</TableCell>
              <TableCell sx={{ color: '#CBD5E1', fontSize: '0.75rem', py: 0.75 }}>{r.band || r.radio_band || '—'}</TableCell>
              <TableCell sx={{ color: '#CBD5E1', fontSize: '0.75rem', py: 0.75, fontFamily: 'monospace' }}>{r.channel || '—'}</TableCell>
              <TableCell sx={{ color: '#CBD5E1', fontSize: '0.75rem', py: 0.75 }}>{r.tx_power != null ? `${r.tx_power} dBm` : '—'}</TableCell>
              <TableCell sx={{ color: '#CBD5E1', fontSize: '0.75rem', py: 0.75 }}>{r.noise_floor != null ? `${r.noise_floor} dBm` : '—'}</TableCell>
              <TableCell sx={{ color: '#CBD5E1', fontSize: '0.75rem', py: 0.75 }}>{r.num_clients ?? r.clients ?? '—'}</TableCell>
              <TableCell sx={{ color: '#CBD5E1', fontSize: '0.75rem', py: 0.75 }}>{r.channel_utilization ?? r.utilization ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─── Speed Test Display ───────────────────────────────────────────────────────

function SpeedTestDisplay({ data }) {
  if (!data) return null;

  const dl = data.download_speed ?? data.download ?? data.rx_throughput;
  const ul = data.upload_speed ?? data.upload ?? data.tx_throughput;
  const latency = data.latency ?? data.rtt;

  return (
    <Box sx={{ mt: 1.5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {dl != null && (
        <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', flex: 1, minWidth: 80 }}>
          <Typography variant="h6" sx={{ color: '#22C55E', fontWeight: 700, fontFamily: 'monospace' }}>
            {typeof dl === 'number' ? dl.toFixed(1) : dl}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem' }}>
            Download Mbps
          </Typography>
        </Box>
      )}
      {ul != null && (
        <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', flex: 1, minWidth: 80 }}>
          <Typography variant="h6" sx={{ color: '#3B82F6', fontWeight: 700, fontFamily: 'monospace' }}>
            {typeof ul === 'number' ? ul.toFixed(1) : ul}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem' }}>
            Upload Mbps
          </Typography>
        </Box>
      )}
      {latency != null && (
        <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', flex: 1, minWidth: 80 }}>
          <Typography variant="h6" sx={{ color: '#F59E0B', fontWeight: 700, fontFamily: 'monospace' }}>
            {typeof latency === 'number' ? latency.toFixed(0) : latency}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem' }}>
            Latency ms
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── HTTP Test Display ────────────────────────────────────────────────────────

function HTTPTestDisplay({ data }) {
  if (!data) return null;

  const status = data.status_code ?? data.http_status ?? data.code;
  const latency = data.latency ?? data.response_time ?? data.time_ms;
  const isOk = status >= 200 && status < 400;

  return (
    <Box sx={{ mt: 1.5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {status != null && (
        <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, backgroundColor: isOk ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${isOk ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, flex: 1, minWidth: 80 }}>
          <Typography variant="h6" sx={{ color: isOk ? '#22C55E' : '#EF4444', fontWeight: 700, fontFamily: 'monospace' }}>
            {status}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem' }}>
            Status Code
          </Typography>
        </Box>
      )}
      {latency != null && (
        <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', flex: 1, minWidth: 80 }}>
          <Typography variant="h6" sx={{ color: '#F59E0B', fontWeight: 700, fontFamily: 'monospace' }}>
            {typeof latency === 'number' ? latency.toFixed(0) : latency}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem' }}>
            Latency ms
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function APTroubleshootPage() {
  // AP selection
  const [apList, setApList] = useState([]);
  const [apListLoading, setApListLoading] = useState(false);
  const [selectedAP, setSelectedAP] = useState(null);
  const [manualSerial, setManualSerial] = useState('');
  const [apDetails, setApDetails] = useState(null);
  const [apDetailsLoading, setApDetailsLoading] = useState(false);

  // Per-tool state: { loading, result, error }
  const mkTool = () => ({ loading: false, result: null, error: null });
  const [tools, setTools] = useState({
    locate: mkTool(),
    reboot: mkTool(),
    ping: mkTool(),
    traceroute: mkTool(),
    speedtest: mkTool(),
    nslookup: mkTool(),
    httptest: mkTool(),
    disconnect: mkTool(),
    radiostats: mkTool(),
    diagnostics: mkTool(),
  });

  // Input values
  const [pingHost, setPingHost] = useState('8.8.8.8');
  const [tracerouteHost, setTracerouteHost] = useState('8.8.8.8');
  const [dnsName, setDnsName] = useState('google.com');
  const [httpUrl, setHttpUrl] = useState('https://www.google.com');
  const [clientMac, setClientMac] = useState('');

  // Confirm dialogs
  const [rebootConfirmOpen, setRebootConfirmOpen] = useState(false);
  const [disconnectConfirmOpen, setDisconnectConfirmOpen] = useState(false);

  // Fetch AP list on mount
  useEffect(() => {
    fetchAPList();
  }, []);

  // When AP selection changes, fetch details
  useEffect(() => {
    const serial = selectedAP?.serial || manualSerial;
    if (serial) {
      fetchAPDetails(serial);
    } else {
      setApDetails(null);
    }
  }, [selectedAP, manualSerial]);

  const fetchAPList = async () => {
    try {
      setApListLoading(true);
      const res = await monitoringAPIv2.getAPsMonitoring({ limit: 500 });
      const aps = res.result || res.aps || res.items || res.data || [];
      setApList(aps);
    } catch (err) {
      console.error('Failed to fetch APs:', err);
    } finally {
      setApListLoading(false);
    }
  };

  const fetchAPDetails = async (serial) => {
    try {
      setApDetailsLoading(true);
      const res = await monitoringAPIv2.getAPMonitoringDetails(serial);
      setApDetails(res);
    } catch (err) {
      console.error('Failed to fetch AP details:', err);
      setApDetails(null);
    } finally {
      setApDetailsLoading(false);
    }
  };

  const getSerial = () => selectedAP?.serial || manualSerial;

  const updateTool = (key, patch) => {
    setTools((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const runTool = async (key, fn) => {
    const serial = getSerial();
    if (!serial) {
      toast.error('Please select or enter an AP first');
      return;
    }
    updateTool(key, { loading: true, result: null, error: null });
    try {
      const result = await fn(serial);
      updateTool(key, { result, loading: false });
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.error || err?.message || 'Operation failed';
      updateTool(key, { error: msg, loading: false });
    }
  };

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleLocate = () => {
    runTool('locate', async (serial) => {
      const res = await apiClient.post(`/troubleshoot/aps/${serial}/locate`);
      toast.success('Locate signal sent — LED blink initiated');
      return res.data;
    });
  };

  const handleReboot = async () => {
    setRebootConfirmOpen(false);
    const serial = getSerial();
    if (!serial) { toast.error('Please select or enter an AP first'); return; }
    updateTool('reboot', { loading: true, result: null, error: null });
    try {
      const res = await apiClient.post(`/troubleshoot/aps/${serial}/reboot`);
      toast.success('Reboot command sent');
      updateTool('reboot', { result: res.data, loading: false });
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.error || err?.message || 'Reboot failed';
      updateTool('reboot', { error: msg, loading: false });
      toast.error(msg);
    }
  };

  const handlePing = () => {
    if (!pingHost) { toast.error('Enter a host to ping'); return; }
    runTool('ping', async (serial) => {
      const res = await apiClient.post('/troubleshoot/ping', {
        host: pingHost,
        device_type: 'IAP',
        device_serial: serial,
      });
      return res.data;
    });
  };

  const handleTraceroute = () => {
    if (!tracerouteHost) { toast.error('Enter a host for traceroute'); return; }
    runTool('traceroute', async (serial) => {
      const res = await apiClient.post('/troubleshoot/traceroute', {
        host: tracerouteHost,
        device_type: 'IAP',
        device_serial: serial,
      });
      return res.data;
    });
  };

  const handleSpeedTest = () => {
    runTool('speedtest', async (serial) => {
      const res = await apiClient.post(`/troubleshoot/aps/${serial}/speedtest`);
      return res.data;
    });
  };

  const handleNSLookup = () => {
    if (!dnsName) { toast.error('Enter a domain for DNS lookup'); return; }
    runTool('nslookup', async (serial) => {
      const res = await apiClient.post(`/troubleshoot/aps/${serial}/nslookup`, { domain: dnsName });
      return res.data;
    });
  };

  const handleHTTPTest = () => {
    if (!httpUrl) { toast.error('Enter a URL for HTTP test'); return; }
    runTool('httptest', async (serial) => {
      const res = await apiClient.post(`/troubleshoot/aps/${serial}/http-test`, { url: httpUrl });
      return res.data;
    });
  };

  const handleDisconnect = async () => {
    setDisconnectConfirmOpen(false);
    if (!clientMac) { toast.error('Enter a client MAC address'); return; }
    runTool('disconnect', async (serial) => {
      const res = await apiClient.post(`/troubleshoot/aps/${serial}/disconnect-user`, { mac_address: clientMac });
      toast.success('Client disconnection command sent');
      return res.data;
    });
  };

  const handleRadioStats = () => {
    runTool('radiostats', async (serial) => {
      const res = await troubleshootAPI.getAPRadioStats(serial);
      return res;
    });
  };

  const handleDiagnostics = () => {
    runTool('diagnostics', async (serial) => {
      const res = await troubleshootAPI.getAPDiagnostics(serial);
      return res;
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const serial = getSerial();

  return (
    <Box sx={{ maxWidth: 1400 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF6600 0%, #FF8C42 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(255,102,0,0.35)',
            }}
          >
            <BuildIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9', lineHeight: 1.2 }}>
              AP Troubleshooting Toolkit
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Comprehensive diagnostic tests for access points
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* AP Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#94A3B8', mb: 2, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Select Access Point
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={apList}
                loading={apListLoading}
                value={selectedAP}
                onChange={(_, val) => { setSelectedAP(val); setManualSerial(''); }}
                getOptionLabel={(ap) => `${ap.name || ap.hostname || 'AP'} — ${ap.serial}`}
                filterOptions={(options, { inputValue }) => {
                  const q = inputValue.toLowerCase();
                  return options.filter(
                    (ap) =>
                      (ap.name || ap.hostname || '').toLowerCase().includes(q) ||
                      (ap.serial || '').toLowerCase().includes(q) ||
                      (ap.site || '').toLowerCase().includes(q)
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search by name, serial, or site"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {apListLoading && <CircularProgress size={16} sx={{ mr: 1 }} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, ap) => (
                  <Box component="li" {...props} sx={{ py: 1 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {ap.name || ap.hostname || 'Unknown AP'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', fontFamily: 'monospace' }}>
                        {ap.serial} · {ap.site || 'No site'} · <StatusChip status={ap.status} />
                      </Typography>
                    </Box>
                  </Box>
                )}
                isOptionEqualToValue={(a, b) => a.serial === b.serial}
                sx={{ '& .MuiInputBase-root': { backgroundColor: '#0A0E1A' } }}
              />
            </Grid>
            <Grid item xs={12} md={1} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#475569' }}>or</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Enter serial manually"
                value={manualSerial}
                onChange={(e) => { setManualSerial(e.target.value); setSelectedAP(null); }}
                size="small"
                fullWidth
                sx={{ '& .MuiInputBase-root': { backgroundColor: '#0A0E1A', fontFamily: 'monospace' } }}
                placeholder="e.g. CNXXXXXXXX"
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Tooltip title="Refresh AP list">
                <IconButton onClick={fetchAPList} disabled={apListLoading} sx={{ color: '#64748B' }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* AP Info Card */}
      <APInfoCard ap={apDetails} loading={apDetailsLoading && !!serial} />

      {/* Tools Grid */}
      {!serial && (
        <Alert
          severity="info"
          icon={<InfoIcon />}
          sx={{ mb: 3, backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          Select or enter an AP serial above to enable diagnostic tools.
        </Alert>
      )}

      <Grid container spacing={2.5}>

        {/* 1. Locate AP */}
        <Grid item xs={12} sm={6} lg={4}>
          <ToolCard
            icon={<LocateIcon sx={{ color: '#FF6600', fontSize: 18 }} />}
            title="Locate AP"
            description="Blink the AP LED to physically locate it"
          >
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleLocate}
              disabled={!serial || tools.locate.loading}
              startIcon={tools.locate.loading ? <CircularProgress size={14} color="inherit" /> : <LocateIcon />}
            >
              {tools.locate.loading ? 'Sending...' : 'Blink LED'}
            </Button>
            <ResultPanel
              result={tools.locate.result}
              loading={tools.locate.loading}
              error={tools.locate.error}
            />
          </ToolCard>
        </Grid>

        {/* 2. Reboot AP */}
        <Grid item xs={12} sm={6} lg={4}>
          <ToolCard
            icon={<PowerIcon sx={{ color: '#EF4444', fontSize: 18 }} />}
            title="Reboot AP"
            description="Remotely reboot the access point"
            accentColor="#EF4444"
          >
            <Button
              variant="outlined"
              size="small"
              fullWidth
              color="error"
              onClick={() => {
                if (!serial) { toast.error('Please select or enter an AP first'); return; }
                setRebootConfirmOpen(true);
              }}
              disabled={!serial || tools.reboot.loading}
              startIcon={tools.reboot.loading ? <CircularProgress size={14} color="inherit" /> : <PowerIcon />}
            >
              {tools.reboot.loading ? 'Rebooting...' : 'Reboot AP'}
            </Button>
            <ResultPanel
              result={tools.reboot.result}
              loading={tools.reboot.loading}
              error={tools.reboot.error}
            />
          </ToolCard>
        </Grid>

        {/* 3. Ping Test */}
        <Grid item xs={12} sm={6} lg={4}>
          <ToolCard
            icon={<NetworkCheckIcon sx={{ color: '#22C55E', fontSize: 18 }} />}
            title="Ping Test"
            description="Send ICMP pings from this AP to a target"
            accentColor="#22C55E"
          >
            <TextField
              label="Target host or IP"
              value={pingHost}
              onChange={(e) => setPingHost(e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: 1.5, '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.85rem' } }}
              placeholder="8.8.8.8"
              onKeyDown={(e) => e.key === 'Enter' && handlePing()}
            />
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handlePing}
              disabled={!serial || tools.ping.loading}
              startIcon={tools.ping.loading ? <CircularProgress size={14} color="inherit" /> : <NetworkCheckIcon />}
            >
              {tools.ping.loading ? 'Running...' : 'Run Ping'}
            </Button>
            <ResultPanel
              result={tools.ping.result}
              loading={tools.ping.loading}
              error={tools.ping.error}
            />
          </ToolCard>
        </Grid>

        {/* 4. Traceroute */}
        <Grid item xs={12} sm={6} lg={4}>
          <ToolCard
            icon={<RouteIcon sx={{ color: '#3B82F6', fontSize: 18 }} />}
            title="Traceroute"
            description="Trace the network path to a destination"
            accentColor="#3B82F6"
          >
            <TextField
              label="Target host or IP"
              value={tracerouteHost}
              onChange={(e) => setTracerouteHost(e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: 1.5, '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.85rem' } }}
              placeholder="8.8.8.8"
              onKeyDown={(e) => e.key === 'Enter' && handleTraceroute()}
            />
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleTraceroute}
              disabled={!serial || tools.traceroute.loading}
              startIcon={tools.traceroute.loading ? <CircularProgress size={14} color="inherit" /> : <RouteIcon />}
              sx={{ background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)', boxShadow: '0 4px 14px rgba(59,130,246,0.3)', '&:hover': { background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)' } }}
            >
              {tools.traceroute.loading ? 'Running...' : 'Run Traceroute'}
            </Button>
            <ResultPanel
              result={tools.traceroute.result}
              loading={tools.traceroute.loading}
              error={tools.traceroute.error}
            />
          </ToolCard>
        </Grid>

        {/* 5. Speed Test */}
        <Grid item xs={12} sm={6} lg={4}>
          <ToolCard
            icon={<SpeedIcon sx={{ color: '#F59E0B', fontSize: 18 }} />}
            title="Speed Test"
            description="Measure AP download and upload throughput"
            accentColor="#F59E0B"
          >
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleSpeedTest}
              disabled={!serial || tools.speedtest.loading}
              startIcon={tools.speedtest.loading ? <CircularProgress size={14} color="inherit" /> : <SpeedIcon />}
              sx={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)', color: '#1C1A0A', boxShadow: '0 4px 14px rgba(245,158,11,0.3)', '&:hover': { background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' } }}
            >
              {tools.speedtest.loading ? 'Running...' : 'Run Speed Test'}
            </Button>
            {tools.speedtest.result && !tools.speedtest.loading && (
              <SpeedTestDisplay data={tools.speedtest.result} />
            )}
            <ResultPanel
              result={
                tools.speedtest.result && !tools.speedtest.loading
                  ? (tools.speedtest.result.download_speed == null &&
                     tools.speedtest.result.upload_speed == null
                     ? tools.speedtest.result
                     : null)
                  : null
              }
              loading={tools.speedtest.loading}
              error={tools.speedtest.error}
            />
          </ToolCard>
        </Grid>

        {/* 6. DNS Lookup */}
        <Grid item xs={12} sm={6} lg={4}>
          <ToolCard
            icon={<DnsIcon sx={{ color: '#A78BFA', fontSize: 18 }} />}
            title="DNS Lookup"
            description="Resolve a domain name from this AP"
            accentColor="#A78BFA"
          >
            <TextField
              label="Domain name"
              value={dnsName}
              onChange={(e) => setDnsName(e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: 1.5, '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.85rem' } }}
              placeholder="google.com"
              onKeyDown={(e) => e.key === 'Enter' && handleNSLookup()}
            />
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleNSLookup}
              disabled={!serial || tools.nslookup.loading}
              startIcon={tools.nslookup.loading ? <CircularProgress size={14} color="inherit" /> : <DnsIcon />}
              sx={{ background: 'linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%)', color: '#1A0E2A', boxShadow: '0 4px 14px rgba(167,139,250,0.3)', '&:hover': { background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)', color: '#fff' } }}
            >
              {tools.nslookup.loading ? 'Resolving...' : 'Run Lookup'}
            </Button>
            <ResultPanel
              result={tools.nslookup.result}
              loading={tools.nslookup.loading}
              error={tools.nslookup.error}
            />
          </ToolCard>
        </Grid>

        {/* 7. HTTP Test */}
        <Grid item xs={12} sm={6} lg={4}>
          <ToolCard
            icon={<HttpIcon sx={{ color: '#06B6D4', fontSize: 18 }} />}
            title="HTTP Test"
            description="Test HTTP reachability and measure response time"
            accentColor="#06B6D4"
          >
            <TextField
              label="URL"
              value={httpUrl}
              onChange={(e) => setHttpUrl(e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: 1.5, '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.82rem' } }}
              placeholder="https://www.google.com"
              onKeyDown={(e) => e.key === 'Enter' && handleHTTPTest()}
            />
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleHTTPTest}
              disabled={!serial || tools.httptest.loading}
              startIcon={tools.httptest.loading ? <CircularProgress size={14} color="inherit" /> : <HttpIcon />}
              sx={{ background: 'linear-gradient(135deg, #06B6D4 0%, #67E8F9 100%)', color: '#001820', boxShadow: '0 4px 14px rgba(6,182,212,0.3)', '&:hover': { background: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)', color: '#fff' } }}
            >
              {tools.httptest.loading ? 'Testing...' : 'Run HTTP Test'}
            </Button>
            {tools.httptest.result && !tools.httptest.loading && (
              <HTTPTestDisplay data={tools.httptest.result} />
            )}
            <ResultPanel
              result={
                tools.httptest.result && !tools.httptest.loading
                  ? ((tools.httptest.result.status_code == null && tools.httptest.result.http_status == null)
                     ? tools.httptest.result
                     : null)
                  : null
              }
              loading={tools.httptest.loading}
              error={tools.httptest.error}
            />
          </ToolCard>
        </Grid>

        {/* 8. Disconnect Client */}
        <Grid item xs={12} sm={6} lg={4}>
          <ToolCard
            icon={<PersonRemoveIcon sx={{ color: '#F97316', fontSize: 18 }} />}
            title="Disconnect Client"
            description="Force disconnect a wireless client by MAC address"
            accentColor="#F97316"
          >
            <TextField
              label="Client MAC address"
              value={clientMac}
              onChange={(e) => setClientMac(e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: 1.5, '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.85rem' } }}
              placeholder="aa:bb:cc:dd:ee:ff"
            />
            <Button
              variant="outlined"
              size="small"
              fullWidth
              color="warning"
              onClick={() => {
                if (!serial) { toast.error('Please select or enter an AP first'); return; }
                if (!clientMac) { toast.error('Enter a client MAC address'); return; }
                setDisconnectConfirmOpen(true);
              }}
              disabled={!serial || tools.disconnect.loading}
              startIcon={tools.disconnect.loading ? <CircularProgress size={14} color="inherit" /> : <PersonRemoveIcon />}
            >
              {tools.disconnect.loading ? 'Disconnecting...' : 'Disconnect Client'}
            </Button>
            <ResultPanel
              result={tools.disconnect.result}
              loading={tools.disconnect.loading}
              error={tools.disconnect.error}
            />
          </ToolCard>
        </Grid>

        {/* 9. Radio Stats */}
        <Grid item xs={12} sm={6} lg={4}>
          <ToolCard
            icon={<RadioIcon sx={{ color: '#34D399', fontSize: 18 }} />}
            title="Radio Statistics"
            description="Current radio channel, power, noise, and client counts"
            accentColor="#34D399"
          >
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleRadioStats}
              disabled={!serial || tools.radiostats.loading}
              startIcon={tools.radiostats.loading ? <CircularProgress size={14} color="inherit" /> : <RadioIcon />}
              sx={{ background: 'linear-gradient(135deg, #34D399 0%, #6EE7B7 100%)', color: '#001A0E', boxShadow: '0 4px 14px rgba(52,211,153,0.3)', '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #34D399 100%)', color: '#fff' } }}
            >
              {tools.radiostats.loading ? 'Fetching...' : 'Get Radio Stats'}
            </Button>
            {tools.radiostats.result && !tools.radiostats.loading && (
              <RadioStatsDisplay data={tools.radiostats.result} />
            )}
            {tools.radiostats.error && !tools.radiostats.loading && (
              <Alert severity="error" sx={{ mt: 1.5, fontSize: '0.78rem' }}>{tools.radiostats.error}</Alert>
            )}
          </ToolCard>
        </Grid>

        {/* 10. AP Diagnostics */}
        <Grid item xs={12} lg={8}>
          <ToolCard
            icon={<BugReportIcon sx={{ color: '#EC4899', fontSize: 18 }} />}
            title="AP Diagnostics"
            description="Full diagnostic data including associations, uptime, memory, CPU, and more"
            accentColor="#EC4899"
          >
            <Button
              variant="contained"
              size="small"
              onClick={handleDiagnostics}
              disabled={!serial || tools.diagnostics.loading}
              startIcon={tools.diagnostics.loading ? <CircularProgress size={14} color="inherit" /> : <BugReportIcon />}
              sx={{ background: 'linear-gradient(135deg, #EC4899 0%, #F9A8D4 100%)', color: '#1A0010', boxShadow: '0 4px 14px rgba(236,72,153,0.3)', '&:hover': { background: 'linear-gradient(135deg, #BE185D 0%, #EC4899 100%)', color: '#fff' } }}
            >
              {tools.diagnostics.loading ? 'Fetching...' : 'Run Full Diagnostics'}
            </Button>
            <ResultPanel
              result={tools.diagnostics.result}
              loading={tools.diagnostics.loading}
              error={tools.diagnostics.error}
            />
          </ToolCard>
        </Grid>

      </Grid>

      {/* Reboot Confirmation Dialog */}
      <Dialog
        open={rebootConfirmOpen}
        onClose={() => setRebootConfirmOpen(false)}
        PaperProps={{ sx: { backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)' } }}
      >
        <DialogTitle sx={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PowerIcon />
          Confirm AP Reboot
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#94A3B8' }}>
            This will remotely reboot access point{' '}
            <Box component="span" sx={{ fontFamily: 'monospace', color: '#F1F5F9', fontWeight: 600 }}>
              {apDetails?.name || serial}
            </Box>
            {' '}({serial}). All connected clients will be temporarily disconnected. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRebootConfirmOpen(false)} sx={{ color: '#64748B' }}>
            Cancel
          </Button>
          <Button onClick={handleReboot} color="error" variant="contained">
            Reboot AP
          </Button>
        </DialogActions>
      </Dialog>

      {/* Disconnect Client Confirmation Dialog */}
      <Dialog
        open={disconnectConfirmOpen}
        onClose={() => setDisconnectConfirmOpen(false)}
        PaperProps={{ sx: { backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)' } }}
      >
        <DialogTitle sx={{ color: '#F97316', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonRemoveIcon />
          Confirm Client Disconnect
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#94A3B8' }}>
            Disconnect client{' '}
            <Box component="span" sx={{ fontFamily: 'monospace', color: '#F1F5F9', fontWeight: 600 }}>
              {clientMac}
            </Box>
            {' '}from AP{' '}
            <Box component="span" sx={{ fontFamily: 'monospace', color: '#F1F5F9', fontWeight: 600 }}>
              {apDetails?.name || serial}
            </Box>
            ? The client will need to re-authenticate.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDisconnectConfirmOpen(false)} sx={{ color: '#64748B' }}>
            Cancel
          </Button>
          <Button onClick={handleDisconnect} color="warning" variant="contained">
            Disconnect Client
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
