/**
 * SyslogAlertsWidget — compact list of LLM-written, reviewer-approved
 * alerts derived from local-network syslog. Drops into the Dashboard
 * and the Alerts page as a side-by-side view with Central's alerts.
 *
 * Data path: useSyslogAlerts → /api/syslog/alerts?approved_only=true
 * Clusterer + writer + reviewer run server-side every ~30s (phases 2-5),
 * so this widget just polls once a minute.
 */

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link as RouterLink } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useSyslogAlerts } from '../hooks/useApiQueries';
import { AlertRow } from './SyslogAlertRow';


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
