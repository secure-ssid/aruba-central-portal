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
  IconButton,
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

const VERDICT_COLOR = { benign: 'success', warning: 'warning', critical: 'error' };

function ProblemCard({ row, onStatus, onDismiss, onOpenLogs }) {
  const [expanded, setExpanded] = useState(false);
  const sevBand = severityBand(row.severity);
  const anomBand = anomalyBand(row.anomaly_score);
  const verdictColor = VERDICT_COLOR[row.verdict] || sevBand.color;

  const label =
    row.summary ||
    `${row.device_name || row.device_serial || 'Unknown device'} — ${row.event_code || 'event'} (${row.event_count})`;

  const hasBenign = row.benign_items?.length > 0;
  const hasReal   = row.real_items?.length > 0;
  const hasSteps  = row.troubleshooting?.length > 0;

  return (
    <Card sx={{ mb: 1, borderLeft: 4, borderColor: `${verdictColor}.main` }}>
      <CardContent sx={{ py: 1.25, '&:last-child': { pb: 1.25 } }}>
        {/* ── Collapsed: just 2 lines ── */}
        <Stack direction="row" alignItems="center" spacing={1.5}
               sx={{ cursor: 'pointer' }} onClick={() => setExpanded((v) => !v)}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600}
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {label}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 0.25 }}>
              <Tooltip title={severityTooltip(row.severity)}>
                <Chip size="small" color={sevBand.color} label={sevBand.label} sx={{ height: 18, fontSize: '0.68rem' }} />
              </Tooltip>
              {row.verdict && (
                <Chip size="small" color={verdictColor} variant="outlined"
                      label={row.verdict} sx={{ height: 18, fontSize: '0.68rem' }} />
              )}
              {row.device_category && (
                <Typography variant="caption" color="text.secondary">{row.device_category}</Typography>
              )}
              <Typography variant="caption" color="text.disabled">
                · {row.device_name || row.device_serial || 'unknown'}
                · {row.event_count} events
                · {formatRelative(row.first_seen)}
              </Typography>
            </Stack>
          </Box>
          <Stack direction="row" spacing={0.5} onClick={(e) => e.stopPropagation()}>
            <Tooltip title="Acknowledge">
              <span>
                <Button size="small" variant="outlined" color="primary"
                        disabled={row.status === 'ack'}
                        onClick={() => onStatus(row.incident_id, 'ack')}
                        sx={{ minWidth: 0, px: 1 }}>
                  Ack
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Resolve — mark fixed">
              <span>
                <Button size="small" variant="outlined" color="success"
                        disabled={row.status === 'resolved'}
                        onClick={() => onStatus(row.incident_id, 'resolved')}
                        sx={{ minWidth: 0, px: 1 }}>
                  Resolve
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Dismiss and delete">
              <span>
                <Button size="small" variant="text" color="error"
                        onClick={() => onDismiss(row.incident_id)}
                        sx={{ minWidth: 0, px: 0.5 }}>
                  <DoDisturbIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
            <IconButton size="small" onClick={() => setExpanded((v) => !v)}>
              {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          </Stack>
        </Stack>

        {/* ── Expanded: full breakdown ── */}
        <Collapse in={expanded} unmountOnExit>
          <Divider sx={{ my: 1.25 }} />
          {hasBenign && (
            <Box sx={{ mb: 1.25 }}>
              <Typography variant="caption" fontWeight={700} color="success.main"
                          sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Benign / expected
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, my: 0.5 }}>
                {row.benign_items.map((item, i) => (
                  <li key={i}><Typography variant="body2" color="text.secondary">{item}</Typography></li>
                ))}
              </Box>
            </Box>
          )}
          {hasReal && (
            <Box sx={{ mb: 1.25 }}>
              <Typography variant="caption" fontWeight={700} color="warning.main"
                          sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Needs attention
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, my: 0.5 }}>
                {row.real_items.map((item, i) => (
                  <li key={i}><Typography variant="body2">{item}</Typography></li>
                ))}
              </Box>
            </Box>
          )}
          {hasSteps && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary"
                          sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Fix steps
              </Typography>
              <Box component="ol" sx={{ pl: 2.5, my: 0.5 }}>
                {row.troubleshooting.map((step, i) => (
                  <li key={i}><Typography variant="body2">{step}</Typography></li>
                ))}
              </Box>
            </Box>
          )}
          {!hasBenign && !hasReal && !hasSteps && (
            <Typography variant="body2" color="text.secondary">
              No AI analysis yet — re-scan or wait for the next cluster tick.
            </Typography>
          )}
          <Button size="small" startIcon={<LaunchIcon />} sx={{ mt: 0.5 }}
                  onClick={() => onOpenLogs(row.incident_id)}>
            View raw logs
          </Button>
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
