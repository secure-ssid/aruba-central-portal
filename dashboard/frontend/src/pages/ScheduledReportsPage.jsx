/**
 * Scheduled Reports Manager
 *
 * Create, view, and manage scheduled network reports.
 * Supports immediate report generation and scheduling for
 * recurring delivery. Reports are stored in browser localStorage
 * and can be downloaded as CSV or JSON.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Tooltip,
  Divider,
  Stack,
  Switch,
  FormControlLabel,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as RunIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Schedule as ScheduleIcon,
  Assessment as ReportIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  NetworkCheck as NetworkIcon,
  Wifi as WifiIcon,
  Devices as DevicesIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';
import {
  reportingAPI,
  deviceAPI,
  monitoringAPIv2,
  alertsAPI,
} from '../services/api';

// ─── Report Type Definitions ──────────────────────────────────────────────────

const REPORT_TYPES = [
  {
    id: 'device_inventory',
    label: 'Device Inventory',
    icon: <DevicesIcon />,
    color: '#3B82F6',
    description: 'Full inventory of all managed devices with status and firmware',
    fetch: () => reportingAPI.getDeviceInventory(),
    dataPath: (r) => r?.data?.devices || r?.data || [],
  },
  {
    id: 'wireless_health',
    label: 'Wireless Health',
    icon: <WifiIcon />,
    color: '#10B981',
    description: 'AP health scores, channel utilization, and client counts',
    fetch: (params) => reportingAPI.getWirelessHealth(params),
    dataPath: (r) => r?.data?.aps || r?.data?.items || r?.data || [],
  },
  {
    id: 'network_usage',
    label: 'Network Usage',
    icon: <NetworkIcon />,
    color: '#FF6600',
    description: 'Bandwidth consumption and top talkers by device and SSID',
    fetch: (params) => reportingAPI.getNetworkUsage(params),
    dataPath: (r) => r?.data?.items || r?.data || [],
  },
  {
    id: 'top_aps_usage',
    label: 'Top APs by Usage',
    icon: <WifiIcon />,
    color: '#8B5CF6',
    description: 'Access points ranked by wireless data usage',
    fetch: (params) => reportingAPI.getTopAPsByWirelessUsage(params),
    dataPath: (r) => r?.data?.aps || r?.data?.items || r?.data || [],
  },
  {
    id: 'top_aps_clients',
    label: 'Top APs by Clients',
    icon: <PeopleIcon />,
    color: '#EC4899',
    description: 'Access points ranked by connected client count',
    fetch: (params) => reportingAPI.getTopAPsByClientCount(params),
    dataPath: (r) => r?.data?.aps || r?.data?.items || r?.data || [],
  },
  {
    id: 'top_ssids',
    label: 'Top SSIDs by Usage',
    icon: <WifiIcon />,
    color: '#F59E0B',
    description: 'WLANs ranked by total data consumption',
    fetch: (params) => reportingAPI.getTopSSIDsByUsage(params),
    dataPath: (r) => r?.data?.ssids || r?.data?.items || r?.data || [],
  },
  {
    id: 'alerts_summary',
    label: 'Alerts Summary',
    icon: <SecurityIcon />,
    color: '#EF4444',
    description: 'Active and recent alerts across all network devices',
    fetch: (params) => alertsAPI.getAlerts(params),
    dataPath: (r) => r?.data?.alerts || r?.data?.items || r?.data || [],
  },
  {
    id: 'greenlake_devices',
    label: 'GreenLake Devices',
    icon: <CloudIcon />,
    color: '#06B6D4',
    description: 'Devices enrolled in HPE GreenLake with subscription status',
    fetch: () => reportingAPI.getDevicesWithGreenLake(),
    dataPath: (r) => r?.data?.devices || r?.data || [],
  },
];

const SCHEDULE_OPTIONS = [
  { value: 'none', label: 'No Schedule (Run Once)' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const TIME_RANGE_OPTIONS = [
  { value: '1h', label: 'Last 1 Hour' },
  { value: '3h', label: 'Last 3 Hours' },
  { value: '1d', label: 'Last 24 Hours' },
  { value: '3d', label: 'Last 3 Days' },
  { value: '1w', label: 'Last 7 Days' },
  { value: '1m', label: 'Last 30 Days' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const flattenObject = (obj, prefix = '') => {
  const result = {};
  for (const [key, value] of Object.entries(obj || {})) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value === null || value === undefined) {
      result[newKey] = '';
    } else if (Array.isArray(value)) {
      result[newKey] = value.join('; ');
    } else if (typeof value === 'object') {
      Object.assign(result, flattenObject(value, newKey));
    } else if (typeof value === 'boolean') {
      result[newKey] = value ? 'Yes' : 'No';
    } else {
      result[newKey] = value;
    }
  }
  return result;
};

const exportCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  const flat = data.map((item) => flattenObject(item));
  const keys = [...new Set(flat.flatMap(Object.keys))];
  const header = keys.join(',');
  const rows = flat.map((row) =>
    keys
      .map((k) => {
        const val = String(row[k] ?? '');
        return val.includes(',') || val.includes('"') || val.includes('\n')
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      })
      .join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const exportJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
};

const getNextRun = (schedule) => {
  if (!schedule || schedule === 'none') return null;
  const now = new Date();
  if (schedule === 'daily') {
    const next = new Date(now);
    next.setDate(next.getDate() + 1);
    next.setHours(8, 0, 0, 0);
    return next.toISOString();
  }
  if (schedule === 'weekly') {
    const next = new Date(now);
    next.setDate(next.getDate() + (7 - next.getDay() + 1) % 7 || 7);
    next.setHours(8, 0, 0, 0);
    return next.toISOString();
  }
  if (schedule === 'monthly') {
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 8);
    return next.toISOString();
  }
  return null;
};

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'aruba_scheduled_reports';

const loadReports = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveReports = (reports) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatsCard = ({ label, value, icon, color }) => (
  <Card sx={{ bgcolor: '#111827', border: '1px solid #1F2937' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
      <Box sx={{ color, display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="h5" sx={{ color, fontWeight: 700 }}>{value}</Typography>
        <Typography variant="caption" sx={{ color: '#9CA3AF' }}>{label}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const StatusChip = ({ status }) => {
  const map = {
    completed: { label: 'Completed', color: '#10B981', bg: 'rgba(16,185,129,0.1)', icon: <CheckIcon fontSize="small" /> },
    running:   { label: 'Running',   color: '#FF6600', bg: 'rgba(255,102,0,0.1)',  icon: <CircularProgress size={12} sx={{ color: '#FF6600' }} /> },
    error:     { label: 'Error',     color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  icon: <ErrorIcon fontSize="small" /> },
    pending:   { label: 'Pending',   color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)', icon: <ScheduleIcon fontSize="small" /> },
  };
  const s = map[status] || map.pending;
  return (
    <Chip
      size="small"
      icon={s.icon}
      label={s.label}
      sx={{ color: s.color, bgcolor: s.bg, border: `1px solid ${s.color}40`, '& .MuiChip-icon': { color: s.color } }}
    />
  );
};

// ─── Create Report Dialog ─────────────────────────────────────────────────────

const CreateReportDialog = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [schedule, setSchedule] = useState('none');
  const [timeRange, setTimeRange] = useState('1d');
  const [format, setFormat] = useState('csv');

  const handleCreate = () => {
    if (!name.trim() || !type) return;
    const reportType = REPORT_TYPES.find((r) => r.id === type);
    onCreate({
      id: Date.now().toString(),
      name: name.trim(),
      type,
      typeLabel: reportType?.label,
      schedule,
      timeRange,
      format,
      status: 'pending',
      createdAt: new Date().toISOString(),
      lastRun: null,
      nextRun: getNextRun(schedule),
      resultCount: null,
      error: null,
    });
    setName('');
    setType('');
    setSchedule('none');
    setTimeRange('1d');
    setFormat('csv');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid #1F2937' } }}>
      <DialogTitle sx={{ color: '#F9FAFB', borderBottom: '1px solid #1F2937' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReportIcon sx={{ color: '#FF6600' }} />
          Create Report
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Report Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
            placeholder="e.g. Weekly Wireless Health"
            sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#0A0E1A' } }}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Report Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)} label="Report Type"
              sx={{ bgcolor: '#0A0E1A' }}>
              {REPORT_TYPES.map((rt) => (
                <MenuItem key={rt.id} value={rt.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: rt.color, display: 'flex', fontSize: 16 }}>{rt.icon}</Box>
                    {rt.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {type && (
            <Alert severity="info" sx={{ bgcolor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              {REPORT_TYPES.find((r) => r.id === type)?.description}
            </Alert>
          )}
          <FormControl fullWidth size="small">
            <InputLabel>Time Range</InputLabel>
            <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} label="Time Range"
              sx={{ bgcolor: '#0A0E1A' }}>
              {TIME_RANGE_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Schedule</InputLabel>
            <Select value={schedule} onChange={(e) => setSchedule(e.target.value)} label="Schedule"
              sx={{ bgcolor: '#0A0E1A' }}>
              {SCHEDULE_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Export Format</InputLabel>
            <Select value={format} onChange={(e) => setFormat(e.target.value)} label="Export Format"
              sx={{ bgcolor: '#0A0E1A' }}>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #1F2937', p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#9CA3AF' }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!name.trim() || !type}
          sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#CC4E00' } }}
        >
          Create Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Results Dialog ───────────────────────────────────────────────────────────

const ResultsDialog = ({ open, onClose, report, data }) => {
  if (!report) return null;
  const filename = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth
      PaperProps={{ sx: { bgcolor: '#111827', border: '1px solid #1F2937', maxHeight: '80vh' } }}>
      <DialogTitle sx={{ color: '#F9FAFB', borderBottom: '1px solid #1F2937' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReportIcon sx={{ color: '#FF6600' }} />
            {report.name} — Results ({data?.length ?? 0} records)
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => exportCSV(data, `${filename}.csv`)}
              sx={{ color: '#3B82F6', borderColor: '#3B82F6', '&:hover': { bgcolor: 'rgba(59,130,246,0.1)' } }}
              variant="outlined"
            >
              CSV
            </Button>
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => exportJSON(data, `${filename}.json`)}
              sx={{ color: '#10B981', borderColor: '#10B981', '&:hover': { bgcolor: 'rgba(16,185,129,0.1)' } }}
              variant="outlined"
            >
              JSON
            </Button>
          </Stack>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0, overflow: 'auto' }}>
        {(!data || data.length === 0) ? (
          <Box sx={{ p: 4, textAlign: 'center', color: '#9CA3AF' }}>
            <Typography>No data returned for this report.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {Object.keys(flattenObject(data[0])).slice(0, 10).map((col) => (
                    <TableCell key={col} sx={{ bgcolor: '#1F2937', color: '#9CA3AF', fontSize: 11 }}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(0, 200).map((row, i) => {
                  const flat = flattenObject(row);
                  return (
                    <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(255,102,0,0.04)' } }}>
                      {Object.keys(flattenObject(data[0])).slice(0, 10).map((col) => (
                        <TableCell key={col} sx={{ color: '#D1D5DB', fontSize: 12, borderColor: '#1F2937' }}>
                          {String(flat[col] ?? '—').slice(0, 60)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #1F2937', p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#9CA3AF' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ScheduledReportsPage() {
  const [reports, setReports] = useState(loadReports);
  const [createOpen, setCreateOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [runningIds, setRunningIds] = useState(new Set());

  // Persist to localStorage on change
  useEffect(() => {
    saveReports(reports);
  }, [reports]);

  const handleCreate = useCallback((report) => {
    setReports((prev) => [report, ...prev]);
  }, []);

  const handleDelete = useCallback((id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const runReport = useCallback(async (report) => {
    if (runningIds.has(report.id)) return;

    setRunningIds((prev) => new Set([...prev, report.id]));
    setReports((prev) =>
      prev.map((r) => r.id === report.id ? { ...r, status: 'running', error: null } : r)
    );

    const reportType = REPORT_TYPES.find((rt) => rt.id === report.type);
    if (!reportType) return;

    const timeParams = { duration: report.timeRange };

    try {
      const response = await reportType.fetch(timeParams);
      const data = reportType.dataPath(response);
      const dataArray = Array.isArray(data) ? data : [data];

      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id
            ? {
                ...r,
                status: 'completed',
                lastRun: new Date().toISOString(),
                nextRun: getNextRun(r.schedule),
                resultCount: dataArray.length,
                cachedData: dataArray,
              }
            : r
        )
      );
    } catch (err) {
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id
            ? { ...r, status: 'error', error: err.message || 'Failed to generate report', lastRun: new Date().toISOString() }
            : r
        )
      );
    } finally {
      setRunningIds((prev) => {
        const next = new Set(prev);
        next.delete(report.id);
        return next;
      });
    }
  }, [runningIds]);

  const viewResults = useCallback((report) => {
    setSelectedReport(report);
    setResultsData(report.cachedData || []);
    setResultsOpen(true);
  }, []);

  // Stats
  const total = reports.length;
  const completed = reports.filter((r) => r.status === 'completed').length;
  const scheduled = reports.filter((r) => r.schedule !== 'none').length;
  const errors = reports.filter((r) => r.status === 'error').length;

  return (
    <Box sx={{ p: 3, bgcolor: '#0A0E1A', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#F9FAFB', fontWeight: 700 }}>
            Scheduled Reports
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF', mt: 0.5 }}>
            Create and manage automated network reports with scheduled delivery
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#CC4E00' } }}
        >
          New Report
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatsCard label="Total Reports" value={total} icon={<ReportIcon />} color="#FF6600" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard label="Completed" value={completed} icon={<CheckIcon />} color="#10B981" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard label="Scheduled" value={scheduled} icon={<ScheduleIcon />} color="#3B82F6" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard label="Errors" value={errors} icon={<ErrorIcon />} color="#EF4444" />
        </Grid>
      </Grid>

      {/* Reports Table */}
      <Card sx={{ bgcolor: '#111827', border: '1px solid #1F2937' }}>
        <CardContent sx={{ p: 0 }}>
          {reports.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <ReportIcon sx={{ fontSize: 48, color: '#374151', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#6B7280' }}>No reports yet</Typography>
              <Typography variant="body2" sx={{ color: '#4B5563', mt: 1 }}>
                Create your first report to start monitoring your network
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setCreateOpen(true)}
                sx={{ mt: 2, color: '#FF6600', borderColor: '#FF6600', '&:hover': { bgcolor: 'rgba(255,102,0,0.1)' } }}
              >
                Create Report
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { bgcolor: '#1F2937', color: '#9CA3AF', fontSize: 12, fontWeight: 600 } }}>
                    <TableCell>Report Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Schedule</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Run</TableCell>
                    <TableCell>Next Run</TableCell>
                    <TableCell>Records</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => {
                    const rt = REPORT_TYPES.find((t) => t.id === report.type);
                    const isRunning = runningIds.has(report.id);
                    return (
                      <React.Fragment key={report.id}>
                        <TableRow sx={{
                          '&:hover': { bgcolor: 'rgba(255,102,0,0.04)' },
                          borderBottom: '1px solid #1F2937',
                        }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ color: rt?.color || '#9CA3AF', display: 'flex', fontSize: 16 }}>
                                {rt?.icon}
                              </Box>
                              <Typography sx={{ color: '#F9FAFB', fontWeight: 500 }}>
                                {report.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                              {report.typeLabel}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={SCHEDULE_OPTIONS.find((o) => o.value === report.schedule)?.label || report.schedule}
                              sx={{ bgcolor: report.schedule !== 'none' ? 'rgba(59,130,246,0.1)' : '#1F2937',
                                    color: report.schedule !== 'none' ? '#3B82F6' : '#6B7280',
                                    fontSize: 11 }}
                            />
                          </TableCell>
                          <TableCell>
                            {isRunning ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={14} sx={{ color: '#FF6600' }} />
                                <Typography variant="caption" sx={{ color: '#FF6600' }}>Running…</Typography>
                              </Box>
                            ) : (
                              <StatusChip status={report.status} />
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>
                              {formatDate(report.lastRun)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>
                              {formatDate(report.nextRun)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {report.resultCount !== null ? (
                              <Typography variant="caption" sx={{ color: '#10B981' }}>
                                {report.resultCount.toLocaleString()}
                              </Typography>
                            ) : '—'}
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <Tooltip title="Run Now">
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => runReport(report)}
                                    disabled={isRunning}
                                    sx={{ color: '#FF6600', '&:hover': { bgcolor: 'rgba(255,102,0,0.1)' } }}
                                  >
                                    {isRunning ? <CircularProgress size={16} sx={{ color: '#FF6600' }} /> : <RunIcon fontSize="small" />}
                                  </IconButton>
                                </span>
                              </Tooltip>
                              {report.status === 'completed' && report.cachedData && (
                                <>
                                  <Tooltip title="View Results">
                                    <IconButton
                                      size="small"
                                      onClick={() => viewResults(report)}
                                      sx={{ color: '#3B82F6', '&:hover': { bgcolor: 'rgba(59,130,246,0.1)' } }}
                                    >
                                      <ReportIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title={`Download ${report.format?.toUpperCase() || 'CSV'}`}>
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        const fn = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}`;
                                        if (report.format === 'json') {
                                          exportJSON(report.cachedData, `${fn}.json`);
                                        } else {
                                          exportCSV(report.cachedData, `${fn}.csv`);
                                        }
                                      }}
                                      sx={{ color: '#10B981', '&:hover': { bgcolor: 'rgba(16,185,129,0.1)' } }}
                                    >
                                      <DownloadIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(report.id)}
                                  sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                        {report.status === 'error' && report.error && (
                          <TableRow>
                            <TableCell colSpan={8} sx={{ py: 0, borderBottom: '1px solid #1F2937' }}>
                              <Alert severity="error" sx={{ m: 1, bgcolor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                {report.error}
                              </Alert>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Report Type Reference */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#6B7280', mb: 1.5 }}>
          Available Report Types
        </Typography>
        <Grid container spacing={1.5}>
          {REPORT_TYPES.map((rt) => (
            <Grid item xs={12} sm={6} md={3} key={rt.id}>
              <Card
                sx={{ bgcolor: '#111827', border: '1px solid #1F2937', cursor: 'pointer',
                      '&:hover': { border: `1px solid ${rt.color}40`, bgcolor: '#161d2e' },
                      transition: 'all 0.15s' }}
                onClick={() => setCreateOpen(true)}
              >
                <CardContent sx={{ py: '10px !important', px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: rt.color, display: 'flex' }}>{rt.icon}</Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#F9FAFB', fontWeight: 500 }}>
                        {rt.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        {rt.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dialogs */}
      <CreateReportDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
      <ResultsDialog open={resultsOpen} onClose={() => setResultsOpen(false)} report={selectedReport} data={resultsData} />
    </Box>
  );
}
