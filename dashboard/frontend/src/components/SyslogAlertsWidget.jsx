/**
 * SyslogAlertsWidget — compact list of LLM-written, reviewer-approved
 * alerts derived from local-network syslog. Drops into the Dashboard
 * and the Alerts page as a side-by-side view with Central's alerts.
 *
 * Data path: useSyslogAlerts → /api/syslog/alerts?approved_only=true
 * Clusterer + writer + reviewer run server-side every ~30s (phases 2-5),
 * so this widget just polls once a minute.
 */

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RefreshIcon from '@mui/icons-material/Refresh';
import BuildIcon from '@mui/icons-material/Build';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Link as RouterLink } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useSyslogAlerts } from '../hooks/useApiQueries';
import { syslogAPI } from '../services/api';

// RFC 5424 severity (lower = more severe)
const SEVERITY_LABEL = {
  0: 'emerg', 1: 'alert', 2: 'crit', 3: 'error',
  4: 'warn', 5: 'notice', 6: 'info', 7: 'debug',
};

function severityColor(sev) {
  if (sev == null) return 'default';
  if (sev <= 2) return 'error';
  if (sev === 3) return 'error';
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
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  } catch {
    return iso;
  }
}

function AlertRow({ alert, onChanged }) {
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const steps = Array.isArray(alert.troubleshooting) ? alert.troubleshooting : [];

  const act = async (fn) => {
    setBusy(true);
    try {
      await fn();
      onChanged?.();
    } finally {
      setBusy(false);
    }
  };

  const ack = () => act(() => syslogAPI.setIncidentStatus(alert.incident_id, 'ack'));
  const resolve = () => act(() => syslogAPI.setIncidentStatus(alert.incident_id, 'resolved'));
  const dismiss = () => act(() => syslogAPI.deleteIncident(alert.incident_id));

  const resolved = alert.incident_status === 'resolved';
  const acked = alert.incident_status === 'ack';

  return (
    <Box sx={{ py: 1.25, px: 0.5, opacity: resolved ? 0.55 : 1 }}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        {alert.approved === 1 ? (
          <Tooltip title="Reviewer-approved">
            <VerifiedIcon fontSize="small" sx={{ color: 'success.main', mt: '2px' }} />
          </Tooltip>
        ) : (
          <Tooltip title="Pending review">
            <ErrorOutlineIcon fontSize="small" sx={{ color: 'warning.main', mt: '2px' }} />
          </Tooltip>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
            {alert.summary}
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ mt: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
            {alert.device_serial && (
              <Chip size="small" label={alert.device_serial} variant="outlined" />
            )}
            {alert.event_code && (
              <Chip size="small" label={alert.event_code} variant="outlined" />
            )}
            {alert.severity != null && (
              <Chip
                size="small"
                label={SEVERITY_LABEL[alert.severity] ?? `sev${alert.severity}`}
                color={severityColor(alert.severity)}
              />
            )}
            {alert.anomaly_score != null && Number(alert.anomaly_score) > 0 && (
              <Chip
                size="small"
                label={`anomaly ${Number(alert.anomaly_score).toFixed(1)}`}
                color={anomalyColor(alert.anomaly_score)}
              />
            )}
            <Chip size="small" label={`${alert.event_count} events`} variant="outlined" />
            {/* Event window: when the device actually logged the events, not
                when we persisted the alert row. Far more useful for triage. */}
            <Chip
              size="small"
              label={
                alert.first_seen && alert.last_seen && alert.first_seen !== alert.last_seen
                  ? `${formatTs(alert.first_seen)} → ${formatTs(alert.last_seen)}`
                  : formatTs(alert.last_seen || alert.first_seen || alert.created_at)
              }
              variant="outlined"
            />
            {alert.incident_status && (
              <Chip
                size="small"
                label={alert.incident_status}
                color={resolved ? 'success' : acked ? 'info' : 'warning'}
                variant="outlined"
              />
            )}
          </Stack>

          {expanded && (
            <Box sx={{ mt: 1.25, pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
              {steps.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
                    <BuildIcon fontSize="inherit" sx={{ color: 'primary.main' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      How to troubleshoot
                    </Typography>
                  </Stack>
                  <Box component="ol" sx={{ pl: 2.5, m: 0 }}>
                    {steps.map((step, i) => (
                      <Typography key={i} component="li" variant="caption" sx={{ lineHeight: 1.5 }}>
                        {step}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}
              {alert.first_seen && (
                <Typography variant="caption" display="block" color="text.secondary">
                  window: {formatTs(alert.first_seen)} → {formatTs(alert.last_seen)}
                </Typography>
              )}
              {alert.review_notes && (
                <Typography variant="caption" display="block" color="text.secondary">
                  review: {alert.review_notes}
                </Typography>
              )}

              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {!acked && !resolved && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CheckIcon fontSize="small" />}
                    onClick={ack}
                    disabled={busy}
                  >
                    Acknowledge
                  </Button>
                )}
                {!resolved && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    startIcon={<DoneAllIcon fontSize="small" />}
                    onClick={resolve}
                    disabled={busy}
                  >
                    Resolve
                  </Button>
                )}
                <Button
                  size="small"
                  variant="text"
                  color="error"
                  startIcon={<DeleteOutlineIcon fontSize="small" />}
                  onClick={dismiss}
                  disabled={busy}
                >
                  Dismiss
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
        <IconButton
          size="small"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'collapse' : 'expand'}
        >
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Stack>
    </Box>
  );
}

function SyslogAlertsWidget({
  title = 'Syslog Alerts',
  approvedOnly = true,
  limit = 10,
  sinceHours,
  showLink = true,
}) {
  const qc = useQueryClient();
  const { data, isLoading, isError, error, refetch, isFetching } = useSyslogAlerts({
    approvedOnly,
    limit,
    sinceHours,
  });

  // Any mutation on a row invalidates the alert + incident caches so the
  // list repaints without waiting for the next poll tick.
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['syslog-alerts'] });
    qc.invalidateQueries({ queryKey: ['syslog-incidents'] });
    qc.invalidateQueries({ queryKey: ['syslog-stats'] });
  };

  const items = data?.items ?? [];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
            {title}
          </Typography>
          <Tooltip title="Refresh">
            <span>
              <IconButton size="small" onClick={() => refetch()} disabled={isFetching}>
                {isFetching ? <CircularProgress size={16} /> : <RefreshIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
          {showLink && (
            <Typography
              component={RouterLink}
              to="/syslog"
              variant="caption"
              sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              View all
            </Typography>
          )}
        </Stack>
        <Divider sx={{ mb: 1 }} />

        {isLoading && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {isError && (
          <Typography variant="body2" color="error.main" sx={{ py: 2 }}>
            Failed to load syslog alerts: {error?.message || 'unknown error'}
          </Typography>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No alerts yet. Point a device's syslog at this server and wait for a
            spike — the pipeline will cluster, score, and summarize automatically.
          </Typography>
        )}

        {!isLoading && items.length > 0 && (
          <Stack divider={<Divider flexItem />}>
            {items.map((alert) => (
              <AlertRow key={alert.id} alert={alert} onChanged={invalidate} />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default SyslogAlertsWidget;
