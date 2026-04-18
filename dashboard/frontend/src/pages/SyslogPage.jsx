/**
 * SyslogPage — full view of the local-network syslog pipeline.
 *
 * Three panels:
 *   1. Stats strip (24h totals, severity breakdown)
 *   2. Alerts (approved + pending, with review notes)
 *   3. Incidents table (sortable by anomaly, drill-down to raw events)
 *
 * No new endpoints — consumes the /api/syslog/* routes shipped in
 * phases 1-5. Kept in one file intentionally; this is one screen's
 * worth of UI, not a sub-app.
 */

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import SyslogAlertsWidget from '../components/SyslogAlertsWidget';
import SyslogAlertsGrouped from '../components/SyslogAlertsGrouped';
import {
  useSyslogAlerts,
  useSyslogIncidents,
  useSyslogStats,
} from '../hooks/useApiQueries';
import { syslogAPI } from '../services/api';
import { useQueryClient } from '@tanstack/react-query';

const SEVERITY_LABEL = {
  0: 'emerg', 1: 'alert', 2: 'crit', 3: 'error',
  4: 'warn', 5: 'notice', 6: 'info', 7: 'debug',
};

function severityColor(sev) {
  if (sev == null) return 'default';
  if (sev <= 3) return 'error';
  if (sev === 4) return 'warning';
  if (sev === 5) return 'info';
  return 'default';
}

function anomalyColor(score) {
  const n = Number(score) || 0;
  if (n >= 5) return 'error';
  if (n >= 2) return 'warning';
  return 'default';
}

function formatTs(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  } catch {
    return iso;
  }
}

// ── Stats strip ─────────────────────────────────────────────────────────

function StatsStrip() {
  const { data, isLoading } = useSyslogStats(24);

  if (isLoading || !data) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent><CircularProgress size={20} /></CardContent>
      </Card>
    );
  }

  const bySev = data.by_severity || {};
  const topCode = (data.top_event_codes || [])[0];
  const topDevice = (data.top_devices || [])[0];

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
          <Box>
            <Typography variant="caption" color="text.secondary">Events (24h)</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>{data.total}</Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="caption" color="text.secondary">By severity</Typography>
            <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
              {Object.entries(bySev).sort().map(([sev, n]) => (
                <Chip
                  key={sev}
                  size="small"
                  label={`${SEVERITY_LABEL[sev] ?? `sev${sev}`} ${n}`}
                  color={severityColor(Number(sev))}
                />
              ))}
              {Object.keys(bySev).length === 0 && (
                <Typography variant="body2" color="text.secondary">—</Typography>
              )}
            </Stack>
          </Box>
          {topCode && (
            <>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="caption" color="text.secondary">Top event code</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {topCode.event_code} <Typography component="span" variant="caption" color="text.secondary">({topCode.n})</Typography>
                </Typography>
              </Box>
            </>
          )}
          {topDevice && (
            <>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="caption" color="text.secondary">Noisiest device</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {topDevice.device_name || topDevice.device_serial} <Typography component="span" variant="caption" color="text.secondary">({topDevice.n})</Typography>
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

// ── Incidents table ──────────────────────────────────────────────────────

function IncidentsTable() {
  const qc = useQueryClient();
  const [orderBy, setOrderBy] = useState('anomaly_score');
  const [status, setStatus] = useState('');
  const [busyId, setBusyId] = useState(null);

  const { data, isLoading, isError } = useSyslogIncidents({
    orderBy,
    status: status || undefined,
    limit: 100,
  });

  const rows = data?.items ?? [];

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['syslog-alerts'] });
    qc.invalidateQueries({ queryKey: ['syslog-incidents'] });
    qc.invalidateQueries({ queryKey: ['syslog-stats'] });
  };

  const actOn = async (id, fn) => {
    setBusyId(id);
    try { await fn(); invalidate(); } finally { setBusyId(null); }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
            Incidents
          </Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="sort-label">Sort by</InputLabel>
            <Select
              labelId="sort-label"
              label="Sort by"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
            >
              <MenuItem value="anomaly_score">Anomaly score</MenuItem>
              <MenuItem value="last_seen">Most recent</MenuItem>
              <MenuItem value="first_seen">First seen</MenuItem>
              <MenuItem value="severity">Severity</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="ack">Acknowledged</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {isLoading && <CircularProgress size={24} />}
        {isError && (
          <Alert severity="error">Failed to load incidents.</Alert>
        )}
        {!isLoading && rows.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No incidents yet.
          </Typography>
        )}

        {rows.length > 0 && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Device</TableCell>
                  <TableCell>Event code</TableCell>
                  <TableCell align="right">Events</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell align="right">Anomaly</TableCell>
                  <TableCell>First → last</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => {
                  const disabled = busyId === r.id;
                  return (
                  <TableRow key={r.id} hover sx={{ opacity: r.status === 'resolved' ? 0.55 : 1 }}>
                    <TableCell>{r.device_name || r.device_serial || <Typography component="span" variant="caption" color="text.secondary">unknown</Typography>}</TableCell>
                    <TableCell>{r.event_code || <Typography component="span" variant="caption" color="text.secondary">—</Typography>}</TableCell>
                    <TableCell align="right">{r.event_count}</TableCell>
                    <TableCell>
                      {r.severity != null ? (
                        <Chip
                          size="small"
                          label={SEVERITY_LABEL[r.severity] ?? `sev${r.severity}`}
                          color={severityColor(r.severity)}
                        />
                      ) : '—'}
                    </TableCell>
                    <TableCell align="right">
                      {r.anomaly_score != null ? (
                        <Chip
                          size="small"
                          label={Number(r.anomaly_score).toFixed(1)}
                          color={anomalyColor(r.anomaly_score)}
                        />
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {formatTs(r.first_seen)} → {formatTs(r.last_seen)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={r.status}
                        color={r.status === 'open' ? 'warning' : r.status === 'resolved' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        {r.status === 'open' && (
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => actOn(r.id, () => syslogAPI.setIncidentStatus(r.id, 'ack'))}
                            disabled={disabled}
                          >
                            Ack
                          </Button>
                        )}
                        {r.status !== 'resolved' && (
                          <Button
                            size="small"
                            variant="text"
                            color="success"
                            onClick={() => actOn(r.id, () => syslogAPI.setIncidentStatus(r.id, 'resolved'))}
                            disabled={disabled}
                          >
                            Resolve
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="text"
                          color="error"
                          onClick={() => actOn(r.id, () => syslogAPI.deleteIncident(r.id))}
                          disabled={disabled}
                        >
                          Dismiss
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ── Page shell ───────────────────────────────────────────────────────────

function SyslogPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState(0);
  const [running, setRunning] = useState(false);

  const handleRunCluster = async () => {
    setRunning(true);
    try {
      await syslogAPI.runCluster();
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['syslog-alerts'] }),
        qc.invalidateQueries({ queryKey: ['syslog-incidents'] }),
        qc.invalidateQueries({ queryKey: ['syslog-stats'] }),
      ]);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Events
          </Typography>
          <Typography variant="body2" color="text.secondary">
            LAN syslog + Aruba Central events → clustered incidents → LLM-written, reviewer-approved alerts.
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          startIcon={running ? <CircularProgress size={14} /> : <PlayArrowIcon />}
          onClick={handleRunCluster}
          disabled={running}
        >
          Cluster now
        </Button>
        <Button
          size="small"
          variant="text"
          startIcon={<RefreshIcon />}
          onClick={() => {
            qc.invalidateQueries({ queryKey: ['syslog-alerts'] });
            qc.invalidateQueries({ queryKey: ['syslog-incidents'] });
            qc.invalidateQueries({ queryKey: ['syslog-stats'] });
          }}
        >
          Refresh
        </Button>
      </Stack>

      <StatsStrip />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Grouped by device / client" />
        <Tab label="Pending review" />
        <Tab label="Approved alerts" />
        <Tab label="All incidents" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SyslogAlertsGrouped
              title="Alerts grouped by device / client"
              approvedOnly={false}
              limit={200}
              sinceHours={24}
            />
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SyslogAlertsWidget
              title="Pending review"
              approvedOnly={false}
              limit={50}
              showLink={false}
            />
          </Grid>
        </Grid>
      )}

      {tab === 2 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SyslogAlertsWidget
              title="Approved alerts (24h)"
              approvedOnly
              limit={50}
              sinceHours={24}
              showLink={false}
            />
          </Grid>
        </Grid>
      )}

      {tab === 3 && <IncidentsTable />}
    </Container>
  );
}

export default SyslogPage;
