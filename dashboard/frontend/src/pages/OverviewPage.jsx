/**
 * OverviewPage — plain-English problem summary landing page.
 *
 * One row per open/ack incident, ordered by anomaly score. Each row
 * shows the LLM summary (or fallback label), affected device/client
 * count, severity + anomaly chips, and the first suggested fix.
 * Click-to-expand reveals the full troubleshooting steps and deep-links
 * to the raw logs on /syslog.
 *
 * Deliberately does NOT show raw logs on the landing view — users
 * scanning the list are looking for "what's broken, how do I fix it",
 * not a firehose. Raw logs are one click away via the expander.
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import LaunchIcon from '@mui/icons-material/Launch';

import { useSyslogOverview, useSyslogLLMMetrics } from '../hooks/useApiQueries';
import { syslogAPI } from '../services/api';
import {
  severityBand, severityTooltip,
  anomalyBand, anomalyTooltip,
} from '../components/alertLabels';
import { useQueryClient } from '@tanstack/react-query';

const SEVERITY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: 'Critical', severityMax: 3 },
  { key: 'warning', label: 'Warnings', severityMax: 4 },
];

function formatRelative(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diffSec = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.round(diffHr / 24)}d ago`;
}

function ProblemCard({ row, onStatus, onDismiss, onOpenLogs }) {
  const [expanded, setExpanded] = useState(false);
  const sevBand = severityBand(row.severity);
  const anomBand = anomalyBand(row.anomaly_score);
  const label =
    row.summary ||
    `${row.device_name || row.device_serial || 'Unknown device'} — ${row.event_code || 'event'} (${row.event_count})`;

  return (
    <Card sx={{ mb: 1.5 }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
              {label}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 0.5, mb: 0.5 }}>
              <Tooltip title={severityTooltip(row.severity)}>
                <Chip size="small" color={sevBand.color} label={sevBand.label} />
              </Tooltip>
              {row.anomaly_score != null && row.anomaly_score >= 2 && (
                <Tooltip title={anomalyTooltip(row.anomaly_score)}>
                  <Chip size="small" color={anomBand.color} variant="outlined"
                        label={`anomaly ${Number(row.anomaly_score).toFixed(1)}`} />
                </Tooltip>
              )}
              <Typography variant="caption" color="text.secondary">
                {row.device_name || row.device_serial || 'unknown'}
                {row.client_mac ? ` · client ${row.client_mac}` : ''}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                · {row.event_count} events
              </Typography>
              <Typography variant="caption" color="text.secondary">
                · started {formatRelative(row.first_seen)}
              </Typography>
              {!row.has_llm_summary && (
                <Chip size="small" variant="outlined" label="pending AI summary"
                      sx={{ borderStyle: 'dashed' }} />
              )}
            </Stack>
            {row.suggested_fix && (
              <Typography variant="body2" color="text.secondary"
                          sx={{ overflow: 'hidden', textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap' }}>
                Suggested: {row.suggested_fix}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Acknowledge — hide from Overview while you work on it">
              <span>
                <Button size="small" color="primary" variant="outlined"
                        disabled={row.status === 'ack'}
                        startIcon={<CheckCircleOutlineIcon />}
                        onClick={() => onStatus(row.incident_id, 'ack')}>
                  Ack
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Resolve — mark fixed">
              <span>
                <Button size="small" color="success" variant="outlined"
                        disabled={row.status === 'resolved'}
                        onClick={() => onStatus(row.incident_id, 'resolved')}>
                  Resolve
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Dismiss and delete this incident">
              <span>
                <Button size="small" color="error" variant="text"
                        startIcon={<DoDisturbIcon />}
                        onClick={() => onDismiss(row.incident_id)}>
                  Dismiss
                </Button>
              </span>
            </Tooltip>
            <Tooltip title={expanded ? 'Hide details' : 'Show steps & raw logs'}>
              <Button size="small" onClick={() => setExpanded((v) => !v)}
                      endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
                Details
              </Button>
            </Tooltip>
          </Stack>
        </Stack>
        <Collapse in={expanded} unmountOnExit>
          <Divider sx={{ my: 1.5 }} />
          {row.troubleshooting && row.troubleshooting.length > 0 ? (
            <Box component="ol" sx={{ pl: 2.5, my: 0 }}>
              {row.troubleshooting.map((step, i) => (
                <li key={i}>
                  <Typography variant="body2">{step}</Typography>
                </li>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No troubleshooting steps yet — run the clusterer or wait for the
              next AI summary window.
            </Typography>
          )}
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Button size="small" startIcon={<LaunchIcon />}
                    onClick={() => onOpenLogs(row.incident_id)}>
              View raw logs
            </Button>
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default function OverviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [severityFilter, setSeverityFilter] = useState('all');
  const [search, setSearch] = useState('');

  const active = SEVERITY_FILTERS.find((f) => f.key === severityFilter) || SEVERITY_FILTERS[0];
  const { data: metricsData } = useSyslogLLMMetrics(1);
  const callsToday = metricsData?.calls_today ?? null;
  const dailyCap = metricsData?.daily_cap ?? 200;
  const quotaRemaining = metricsData?.quota_remaining ?? null;

  const { data, isLoading, isFetching, refetch } = useSyslogOverview({
    sinceHours: 24,
    limit: 100,
    severityMax: active.severityMax,
  });

  const rows = data?.items || [];
  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) => {
      return [r.summary, r.device_name, r.device_serial, r.client_mac,
              r.event_code, r.suggested_fix]
        .some((v) => v && String(v).toLowerCase().includes(q));
    });
  }, [rows, search]);

  const critical = rows.filter((r) => (r.severity ?? 7) <= 3).length;
  const pendingAI = rows.filter((r) => !r.has_llm_summary).length;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['syslog-overview'] });
    queryClient.invalidateQueries({ queryKey: ['syslog-incidents'] });
  };

  const handleStatus = async (id, status) => {
    await syslogAPI.setIncidentStatus(id, status);
    invalidate();
  };
  const handleDismiss = async (id) => {
    await syslogAPI.deleteIncident(id);
    invalidate();
  };
  const handleOpenLogs = (id) => {
    navigate(`/syslog?incident=${id}`);
  };
  const handleRescan = async () => {
    try {
      await syslogAPI.runCluster();
    } finally {
      invalidate();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Overview</Typography>
          <Typography variant="body2" color="text.secondary">
            Current network problems, sorted by severity. Click a row for fix steps.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<RefreshIcon />}
                  onClick={handleRescan} disabled={isFetching}>
            Re-scan
          </Button>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
        <Chip label={`${rows.length} open`} color="primary" />
        {critical > 0 && <Chip label={`${critical} critical`} color="error" />}
        {pendingAI > 0 && (
          <Chip label={`${pendingAI} pending AI`} variant="outlined"
                sx={{ borderStyle: 'dashed' }} />
        )}
        <Box sx={{ flexGrow: 1 }} />
        <ToggleButtonGroup
          size="small" exclusive value={severityFilter}
          onChange={(_, v) => v && setSeverityFilter(v)}
        >
          {SEVERITY_FILTERS.map((f) => (
            <ToggleButton key={f.key} value={f.key}>{f.label}</ToggleButton>
          ))}
        </ToggleButtonGroup>
        <TextField
          size="small" placeholder="Search…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 220 }}
        />
      </Stack>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 && rows.length === 0 ? (
        <Alert severity="success" sx={{ my: 2 }}>
          No open problems in the last 24 hours. Your network is quiet.
        </Alert>
      ) : filtered.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No problems match "{search}". Clear the search or change the filter.
        </Alert>
      ) : (
        <Box>
          {filtered.map((row) => (
            <ProblemCard
              key={row.incident_id}
              row={row}
              onStatus={handleStatus}
              onDismiss={handleDismiss}
              onOpenLogs={handleOpenLogs}
            />
          ))}
        </Box>
      )}
      {callsToday !== null && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title={`${quotaRemaining} AI summaries remaining today (${dailyCap} daily cap). Duplicate and low-signal events are skipped automatically.`}>
            <Chip
              size="small"
              variant="outlined"
              label={`AI summaries today: ${callsToday} / ${dailyCap}`}
              color={quotaRemaining === 0 ? 'error' : quotaRemaining < 20 ? 'warning' : 'default'}
              sx={{ opacity: 0.7 }}
            />
          </Tooltip>
        </Box>
      )}
    </Container>
  );
}
