/**
 * SyslogAlertsGrouped — rolls multiple alerts for the same
 * (device, client_mac) pair into one expandable super-row.
 *
 * Backed by the same `useSyslogAlerts` hook as `SyslogAlertsWidget`;
 * the grouping is a pure UI rollup on top of the alerts payload.
 * Groups collapse by default showing aggregate chips; clicking expands
 * to reveal every contained alert in full detail.
 *
 * Grouping key:
 *   device_key  = device_serial || device_name || 'unknown'
 *   client_key  = client_mac || ''
 *   group_key   = `${device_key}::${client_key}`
 *
 * If a group contains just one alert, we render the alert inline rather
 * than a collapsed super-row — no point adding a click for no savings.
 */

import { useMemo, useState } from 'react';
import {
  Box,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RefreshIcon from '@mui/icons-material/Refresh';
import DevicesIcon from '@mui/icons-material/Devices';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useQueryClient } from '@tanstack/react-query';

import { useSyslogAlerts } from '../hooks/useApiQueries';
import { AlertRow as InlineAlertRow } from './SyslogAlertRow';

// Lightweight display helpers — just for the group header row.
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
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  } catch { return iso; }
}

function groupKey(alert) {
  const dev = alert.device_serial || alert.device_name || 'unknown';
  const client = (alert.client_mac || '').toLowerCase();
  return `${dev}::${client}`;
}

function groupAlerts(items) {
  /**
   * Deterministic grouping: preserve alert order within a group so the
   * newest-first sort the backend returns is retained after rollup.
   */
  const groups = new Map();
  for (const a of items) {
    const key = groupKey(a);
    if (!groups.has(key)) groups.set(key, { key, alerts: [], sample: a });
    groups.get(key).alerts.push(a);
  }
  // Compute per-group aggregates + sort groups by max anomaly_score desc.
  const out = [];
  for (const g of groups.values()) {
    let totalEvents = 0;
    let worstAnomaly = 0;
    let worstSeverity = 99;
    let latest = '';
    let earliest = '';
    for (const a of g.alerts) {
      totalEvents += Number(a.event_count || 0);
      const ax = Number(a.anomaly_score || 0);
      if (ax > worstAnomaly) worstAnomaly = ax;
      const sv = a.severity ?? 99;
      if (sv < worstSeverity) worstSeverity = sv;
      if (a.last_seen && (!latest || a.last_seen > latest)) latest = a.last_seen;
      if (a.first_seen && (!earliest || a.first_seen < earliest)) earliest = a.first_seen;
    }
    out.push({
      ...g,
      totalEvents,
      worstAnomaly,
      worstSeverity: worstSeverity === 99 ? null : worstSeverity,
      latest, earliest,
      device: g.sample.device_name || g.sample.device_serial || 'unknown device',
      clientMac: g.sample.client_mac || null,
      approvedAll: g.alerts.every((a) => a.approved === 1),
    });
  }
  out.sort((a, b) => b.worstAnomaly - a.worstAnomaly);
  return out;
}

function GroupRow({ group, onChanged }) {
  const [expanded, setExpanded] = useState(false);
  const lonely = group.alerts.length === 1;

  // Single-alert group → just render the underlying row inline so grouping
  // is invisible when it adds no value.
  if (lonely) {
    return <InlineAlertRow alert={group.alerts[0]} onChanged={onChanged} />;
  }

  return (
    <Box sx={{ py: 1.25, px: 0.5 }}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Tooltip title={group.approvedAll ? 'All alerts reviewer-approved' : 'Some alerts pending review'}>
          {group.approvedAll
            ? <VerifiedIcon fontSize="small" sx={{ color: 'success.main', mt: '2px' }} />
            : <ErrorOutlineIcon fontSize="small" sx={{ color: 'warning.main', mt: '2px' }} />}
        </Tooltip>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25, flexWrap: 'wrap' }}>
            <DevicesIcon fontSize="inherit" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {group.device}
            </Typography>
            {group.clientMac && (
              <>
                <Typography variant="caption" color="text.secondary">·</Typography>
                <PersonOutlineIcon fontSize="inherit" sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {group.clientMac}
                </Typography>
              </>
            )}
            <Chip
              size="small"
              label={`${group.alerts.length} alerts`}
              color="default"
              sx={{ ml: 1 }}
            />
          </Stack>

          <Stack direction="row" spacing={0.75} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
            <Chip size="small" label={`${group.totalEvents} events`} variant="outlined" />
            {group.worstSeverity != null && (
              <Chip
                size="small"
                label={`worst: ${SEVERITY_LABEL[group.worstSeverity] ?? `sev${group.worstSeverity}`}`}
                color={severityColor(group.worstSeverity)}
              />
            )}
            {group.worstAnomaly > 0 && (
              <Chip
                size="small"
                label={`anomaly ${group.worstAnomaly.toFixed(1)}`}
                color={anomalyColor(group.worstAnomaly)}
              />
            )}
            {group.earliest && group.latest && (
              <Chip
                size="small"
                label={
                  group.earliest !== group.latest
                    ? `${formatTs(group.earliest)} → ${formatTs(group.latest)}`
                    : formatTs(group.latest)
                }
                variant="outlined"
              />
            )}
          </Stack>

          {expanded && (
            <Box sx={{ mt: 1, pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
              <Stack divider={<Divider flexItem />}>
                {group.alerts.map((a) => (
                  <InlineAlertRow key={a.id} alert={a} onChanged={onChanged} />
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        <IconButton
          size="small"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'collapse group' : 'expand group'}
        >
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Stack>
    </Box>
  );
}

function SyslogAlertsGrouped({
  title = 'Syslog alerts (grouped)',
  approvedOnly = false,
  limit = 100,
  sinceHours,
}) {
  const qc = useQueryClient();
  const { data, isLoading, isError, error, refetch, isFetching } = useSyslogAlerts({
    approvedOnly, limit, sinceHours,
  });
  const items = data?.items ?? [];
  const groups = useMemo(() => groupAlerts(items), [items]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['syslog-alerts'] });
    qc.invalidateQueries({ queryKey: ['syslog-incidents'] });
    qc.invalidateQueries({ queryKey: ['syslog-stats'] });
  };

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
        </Stack>
        <Divider sx={{ mb: 1 }} />

        {isLoading && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {isError && (
          <Typography variant="body2" color="error.main" sx={{ py: 2 }}>
            Failed to load alerts: {error?.message || 'unknown error'}
          </Typography>
        )}
        {!isLoading && !isError && groups.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No alerts in the current window.
          </Typography>
        )}
        {groups.length > 0 && (
          <Stack divider={<Divider flexItem />}>
            {groups.map((g) => (
              <GroupRow key={g.key} group={g} onChanged={invalidate} />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default SyslogAlertsGrouped;
