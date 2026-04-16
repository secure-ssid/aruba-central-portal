/**
 * Alerts Page — Aruba Central style
 * Severity/status toggle chips · search · multi-column table · slide-in detail panel
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert as MuiAlert,
  Button,
  Chip,
  TablePagination,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  Checkbox,
  Divider,
  Drawer,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  NotificationsNone as NotificationsNoneIcon,
  DoneAll as DoneAllIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { alertsAPI } from '../services/api';
import { getErrorMessage } from '../utils/errorUtils';

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtDate(ts) {
  if (!ts) return '—';
  // ts is unix seconds from backend
  const d = new Date(ts * 1000);
  return d.toLocaleString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function fmtDuration(fromTs, toTs) {
  if (!fromTs) return '—';
  const end = toTs ? toTs * 1000 : Date.now();
  const ms = end - fromTs * 1000;
  if (ms < 0) return '—';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

const SEV_ORDER = ['critical', 'major', 'minor', 'warning', 'info'];

const SEV_COLOR = {
  critical: '#EF4444',
  major:    '#F97316',
  minor:    '#F59E0B',
  warning:  '#F59E0B',
  info:     '#3B82F6',
};

const SEV_BG = {
  critical: 'rgba(239,68,68,0.08)',
  major:    'rgba(249,115,22,0.06)',
  minor:    'rgba(245,158,11,0.05)',
  warning:  'rgba(245,158,11,0.05)',
  info:     'rgba(59,130,246,0.05)',
};

// ─── Detail Panel ────────────────────────────────────────────────────────────

function DetailPanel({ alert, onClose, onAcknowledge, acknowledging }) {
  if (!alert) return null;

  const isActive = !alert.acknowledged && (alert.status || '').toLowerCase() === 'active';
  const sev = (alert.severity || 'info').toLowerCase();

  const rows = [
    { label: 'Summary',       value: alert.summary || alert.description || '—' },
    { label: 'First Occurred', value: fmtDate(alert.timestamp) },
    { label: 'Last Occurred',  value: fmtDate(alert.updatedTimestamp || alert.timestamp) },
    { label: 'Status',         value: alert.status || '—' },
    { label: 'Category',       value: alert.category || '—' },
    { label: 'Device Type',    value: alert.deviceType || '—' },
    { label: 'Site',           value: alert.siteName || '—' },
    { label: 'Priority',       value: alert.priority || '—' },
  ];

  return (
    <Drawer
      anchor="right"
      open={!!alert}
      onClose={onClose}
      variant="persistent"
      sx={{
        width: 340,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 340,
          boxSizing: 'border-box',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'background.paper',
          backgroundImage: 'none',
          top: 64, // below app bar
          height: 'calc(100% - 64px)',
        },
      }}
    >
      <Box sx={{ p: 2.5, height: '100%', overflow: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 1 }}>
            <Typography variant="caption" sx={{ color: SEV_COLOR[sev] || '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.62rem' }}>
              {sev} alert
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, mt: 0.25 }}>
              {alert.description || alert.name || 'Alert'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
              {alert.summary || ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <IconButton size="small" onClick={onClose} sx={{ color: '#64748B' }}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Tooltip title="Copy alert ID">
              <IconButton size="small" onClick={() => navigator.clipboard?.writeText(alert.id || '')} sx={{ color: '#64748B' }}>
                <ContentCopyIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Severity bar */}
        <Box sx={{ height: 3, borderRadius: 2, bgcolor: SEV_COLOR[sev] || '#475569', mb: 2.5, opacity: 0.7 }} />

        {/* Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {rows.map(({ label, value }) => (
            <Box key={label}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.25, fontSize: '0.82rem', color: '#CBD5E1' }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.06)' }} />

        {/* Actions */}
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
          Actions
        </Typography>
        <Box sx={{ mt: 1.5 }}>
          {isActive ? (
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={acknowledging ? <CircularProgress size={14} /> : <DoneAllIcon />}
              disabled={acknowledging || !alert.id}
              onClick={() => onAcknowledge(alert.id)}
              sx={{ borderColor: '#22C55E', color: '#22C55E', '&:hover': { borderColor: '#22C55E', bgcolor: 'rgba(34,197,94,0.08)' } }}
            >
              Mark as Closed
            </Button>
          ) : (
            <Chip label="Closed" size="small" sx={{ bgcolor: 'rgba(100,116,139,0.12)', color: '#64748B', fontWeight: 600 }} />
          )}
        </Box>
      </Box>
    </Drawer>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

function AlertsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [alertsTotal, setAlertsTotal] = useState(0);
  const [alertsPage, setAlertsPage] = useState(1);

  const [events, setEvents] = useState([]);

  // Selection
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [checkedIds, setCheckedIds] = useState(new Set());

  // Filters
  const [severityOn, setSeverityOn] = useState({ critical: true, major: true, minor: true, warning: true, info: false });
  const [statusOn, setStatusOn] = useState({ active: false, deferred: false, cleared: false });
  const [search, setSearch] = useState('');

  // Acknowledge
  const [acknowledging, setAcknowledging] = useState(new Set());

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchAlerts = useCallback(async (page) => {
    try {
      setLoading(true);
      setError('');
      const data = await alertsAPI.getAll(undefined, page);
      const list = data.alerts || data.items || (Array.isArray(data) ? data : []);
      setAlerts(list);
      setAlertsTotal(data.total || data.count || 0);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load alerts'));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await alertsAPI.getEvents();
      setEvents(data.events || data.items || []);
    } catch (_) {}
  }, []);

  useEffect(() => { fetchAlerts(alertsPage); }, [alertsPage, fetchAlerts]);
  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // ── Acknowledge ────────────────────────────────────────────────────────────

  const handleAcknowledge = useCallback(async (alertId) => {
    setAcknowledging((p) => new Set(p).add(alertId));
    try {
      await alertsAPI.acknowledge(alertId);
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: 'Cleared', acknowledged: true } : a)));
      setSelectedAlert((prev) => prev?.id === alertId ? { ...prev, status: 'Cleared', acknowledged: true } : prev);
    } catch (_) {}
    finally {
      setAcknowledging((p) => { const n = new Set(p); n.delete(alertId); return n; });
    }
  }, []);

  // ── Derived counts ─────────────────────────────────────────────────────────

  const sevCounts = useMemo(() => {
    const c = { critical: 0, major: 0, minor: 0, warning: 0, info: 0 };
    alerts.forEach((a) => {
      const s = (a.severity || 'info').toLowerCase();
      if (s in c) c[s]++;
    });
    return c;
  }, [alerts]);

  const statusCounts = useMemo(() => {
    const c = { active: 0, deferred: 0, cleared: 0 };
    alerts.forEach((a) => {
      const s = (a.status || '').toLowerCase();
      if (s === 'active') c.active++;
      else if (s === 'deferred') c.deferred++;
      else if (s === 'cleared' || a.acknowledged) c.cleared++;
    });
    return c;
  }, [alerts]);

  // ── Filtered rows ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const anyStatusOn = Object.values(statusOn).some(Boolean);
    return alerts.filter((a) => {
      const sev = (a.severity || 'info').toLowerCase();
      if (!severityOn[sev]) return false;
      if (anyStatusOn) {
        const st = (a.status || '').toLowerCase();
        const isCleared = st === 'cleared' || a.acknowledged;
        const isActive = st === 'active';
        if (statusOn.active && !isActive) return false;
        if (statusOn.cleared && !isCleared) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return (
          (a.description || a.name || '').toLowerCase().includes(q) ||
          (a.summary || '').toLowerCase().includes(q) ||
          (a.siteName || '').toLowerCase().includes(q) ||
          (a.deviceType || '').toLowerCase().includes(q) ||
          (a.category || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [alerts, severityOn, statusOn, search]);

  // ── Checkbox helpers ───────────────────────────────────────────────────────

  const toggleCheck = (id) => setCheckedIds((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allChecked = filtered.length > 0 && filtered.every((a) => checkedIds.has(a.id));
  const toggleAll = () => setCheckedIds(allChecked ? new Set() : new Set(filtered.map((a) => a.id)));

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ display: 'flex', gap: 0 }}>
      {/* Main content */}
      <Box sx={{ flex: 1, minWidth: 0, mr: selectedAlert ? '340px' : 0, transition: 'margin 0.25s ease' }}>

        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Alerts</Typography>
            <Typography variant="body2" color="text.secondary">
              Network alerts and events from Aruba Central
            </Typography>
          </Box>
          <Button
            startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
            onClick={() => fetchAlerts(alertsPage)}
            variant="outlined"
            size="small"
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {error && (
          <MuiAlert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</MuiAlert>
        )}

        {/* Filter chips */}
        <Box sx={{ mb: 2 }}>
          {/* Severity row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', mr: 0.5 }}>Severity</Typography>
            {SEV_ORDER.map((sev) => {
              const on = severityOn[sev];
              const count = sevCounts[sev] || 0;
              return (
                <Chip
                  key={sev}
                  label={`${sev.charAt(0).toUpperCase() + sev.slice(1)} (${count})`}
                  size="small"
                  onClick={() => setSeverityOn((p) => ({ ...p, [sev]: !p[sev] }))}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    bgcolor: on ? `${SEV_COLOR[sev]}20` : 'rgba(255,255,255,0.04)',
                    color: on ? SEV_COLOR[sev] : '#64748B',
                    border: `1px solid ${on ? SEV_COLOR[sev] + '50' : 'rgba(255,255,255,0.08)'}`,
                    '& .MuiChip-label': { px: 1 },
                  }}
                  icon={on ? <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: SEV_COLOR[sev], ml: '8px !important', flexShrink: 0 }} /> : undefined}
                />
              );
            })}
          </Box>

          {/* Status row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', mr: 0.5 }}>Status</Typography>
            {[
              { key: 'active',   label: 'Active',   count: statusCounts.active,   color: '#EF4444' },
              { key: 'deferred', label: 'Deferred', count: statusCounts.deferred, color: '#F59E0B' },
              { key: 'cleared',  label: 'Cleared',  count: statusCounts.cleared,  color: '#22C55E' },
            ].map(({ key, label, count, color }) => {
              const on = statusOn[key];
              return (
                <Chip
                  key={key}
                  label={`${label} (${count})`}
                  size="small"
                  variant={on ? 'filled' : 'outlined'}
                  onClick={() => setStatusOn((p) => ({ ...p, [key]: !p[key] }))}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    bgcolor: on ? `${color}20` : 'transparent',
                    color: on ? color : '#64748B',
                    borderColor: on ? `${color}50` : 'rgba(255,255,255,0.08)',
                    '& .MuiChip-label': { px: 1 },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* Search + selection count */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search alerts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#64748B' }} /></InputAdornment>,
            }}
            sx={{ width: 280 }}
          />
          {checkedIds.size > 0 && (
            <Typography variant="caption" color="text.secondary">
              {checkedIds.size} of {filtered.length} selected
            </Typography>
          )}
          {checkedIds.size === 0 && (
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.72rem' }}>
              {filtered.length} of {alertsTotal} alerts
            </Typography>
          )}
        </Box>

        {/* Table */}
        <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={28} sx={{ color: '#FF6600' }} />
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 600, fontSize: '0.78rem', color: '#94A3B8', borderBottom: '1px solid rgba(255,255,255,0.06)', py: 1.25 } }}>
                    <TableCell padding="checkbox" sx={{ width: 40, pl: 1.5 }}>
                      <Checkbox
                        size="small"
                        checked={allChecked}
                        indeterminate={checkedIds.size > 0 && !allChecked}
                        onChange={toggleAll}
                        sx={{ color: '#475569', '&.Mui-checked': { color: '#FF6600' }, '&.MuiCheckbox-indeterminate': { color: '#FF6600' } }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: 6 }} />
                    <TableCell>Name</TableCell>
                    <TableCell sx={{ width: 100 }}>Status</TableCell>
                    <TableCell sx={{ width: 170 }}>First Occurred</TableCell>
                    <TableCell sx={{ width: 120 }}>Duration</TableCell>
                    <TableCell sx={{ width: 100 }}>Category</TableCell>
                    <TableCell sx={{ width: 120 }}>Device</TableCell>
                    <TableCell sx={{ width: 52 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length > 0 ? filtered.map((alert, idx) => {
                    const sev = (alert.severity || 'info').toLowerCase();
                    const isActive = !alert.acknowledged && (alert.status || '').toLowerCase() === 'active';
                    const isSelected = selectedAlert?.id === alert.id;
                    const isChecked = checkedIds.has(alert.id);

                    return (
                      <TableRow
                        key={alert.id || idx}
                        onClick={() => setSelectedAlert(isSelected ? null : alert)}
                        sx={{
                          cursor: 'pointer',
                          bgcolor: isSelected
                            ? 'rgba(255,102,0,0.06)'
                            : isChecked
                            ? 'rgba(255,255,255,0.02)'
                            : SEV_BG[sev] || 'transparent',
                          '&:hover': { bgcolor: isSelected ? 'rgba(255,102,0,0.08)' : 'rgba(255,255,255,0.03)' },
                          '& td': { borderBottom: '1px solid rgba(255,255,255,0.04)', py: 1 },
                          '&:last-child td': { borderBottom: 0 },
                        }}
                      >
                        <TableCell padding="checkbox" sx={{ pl: 1.5 }} onClick={(e) => { e.stopPropagation(); toggleCheck(alert.id); }}>
                          <Checkbox
                            size="small"
                            checked={isChecked}
                            sx={{ color: '#475569', '&.Mui-checked': { color: '#FF6600' } }}
                          />
                        </TableCell>
                        {/* Severity color bar */}
                        <TableCell sx={{ p: 0, width: 6 }}>
                          <Box sx={{ width: 4, height: 36, bgcolor: SEV_COLOR[sev] || '#475569', borderRadius: '0 2px 2px 0', opacity: 0.8 }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', mb: 0.25 }}>
                            {alert.description || alert.name || 'Alert'}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }} noWrap>
                            {alert.summary ? `${alert.summary.slice(0, 60)}${alert.summary.length > 60 ? '…' : ''}` : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={alert.status || 'Unknown'}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.68rem',
                              height: 20,
                              bgcolor: isActive ? 'rgba(239,68,68,0.1)' : 'rgba(100,116,139,0.1)',
                              color: isActive ? '#EF4444' : '#64748B',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#94A3B8' }}>
                            {fmtDate(alert.timestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            {fmtDuration(alert.timestamp, alert.updatedTimestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            {alert.category || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            {alert.deviceType || alert.siteName || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ pr: 1 }} onClick={(e) => e.stopPropagation()}>
                          {isActive && alert.id && (
                            <Tooltip title="Mark as closed">
                              <IconButton
                                size="small"
                                disabled={acknowledging.has(alert.id)}
                                onClick={() => handleAcknowledge(alert.id)}
                                sx={{ color: '#475569', '&:hover': { color: '#22C55E' } }}
                              >
                                {acknowledging.has(alert.id)
                                  ? <CircularProgress size={14} />
                                  : <DoneAllIcon sx={{ fontSize: 16 }} />}
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 8, border: 0 }}>
                        <NotificationsNoneIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.08)', mb: 1.5 }} />
                        <Typography variant="body2" color="text.secondary" display="block">
                          No alerts match the current filters
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {alertsTotal > PAGE_SIZE && (
            <TablePagination
              component="div"
              count={alertsTotal}
              page={alertsPage - 1}
              onPageChange={(_e, p) => { setAlertsPage(p + 1); setSelectedAlert(null); setCheckedIds(new Set()); }}
              rowsPerPage={PAGE_SIZE}
              rowsPerPageOptions={[PAGE_SIZE]}
              sx={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            />
          )}
        </Card>
      </Box>

      {/* Detail panel */}
      <DetailPanel
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onAcknowledge={handleAcknowledge}
        acknowledging={acknowledging.has(selectedAlert?.id)}
      />
    </Box>
  );
}

export default AlertsPage;
