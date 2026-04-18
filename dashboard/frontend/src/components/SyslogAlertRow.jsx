/**
 * Shared single-alert row renderer.
 *
 * Extracted from SyslogAlertsWidget so both the flat and grouped views
 * render an individual alert identically: same chips, same expander,
 * same Acknowledge/Resolve/Dismiss buttons, same troubleshooting list.
 */

import { useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, IconButton, Stack, Tooltip, Typography,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BuildIcon from '@mui/icons-material/Build';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { syslogAPI } from '../services/api';
import {
  severityBand, severityTooltip,
  anomalyBand, anomalyTooltip,
} from './alertLabels';

function formatTs(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  } catch { return iso; }
}

export function AlertRow({ alert, onChanged }) {
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const steps = Array.isArray(alert.troubleshooting) ? alert.troubleshooting : [];

  const [confirmDelete, setConfirmDelete] = useState(false);

  const act = async (fn) => {
    setBusy(true);
    try { await fn(); onChanged?.(); } finally { setBusy(false); }
  };

  const ack      = () => act(() => syslogAPI.setIncidentStatus(alert.incident_id, 'ack'));
  const resolve  = () => act(() => syslogAPI.setIncidentStatus(alert.incident_id, 'resolved'));
  const confirmAndDelete = async () => {
    await act(() => syslogAPI.deleteIncident(alert.incident_id));
    setConfirmDelete(false);
  };

  const resolved = alert.incident_status === 'resolved';
  const acked    = alert.incident_status === 'ack';
  const sevBand  = severityBand(alert.severity);
  const anBand   = anomalyBand(alert.anomaly_score);

  return (
    <Box sx={{ py: 1.25, px: 0.5, opacity: resolved ? 0.55 : 1 }}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        {alert.approved === 1 ? (
          <Tooltip title="A second AI pass has confirmed this summary matches the raw events.">
            <VerifiedIcon fontSize="small" sx={{ color: 'success.main', mt: '2px' }} />
          </Tooltip>
        ) : (
          <Tooltip title="The summary is written but hasn't been double-checked yet. Review it before acting on it.">
            <ErrorOutlineIcon fontSize="small" sx={{ color: 'warning.main', mt: '2px' }} />
          </Tooltip>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
            {alert.summary}
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ mt: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
            {(alert.device_name || alert.device_serial) && (
              <Chip
                size="small"
                label={alert.device_name || alert.device_serial}
                variant="outlined"
              />
            )}
            {alert.event_code && (
              <Chip size="small" label={alert.event_code} variant="outlined" />
            )}
            {alert.severity != null && (
              <Tooltip title={severityTooltip(alert.severity)}>
                <Chip size="small" label={sevBand.label} color={sevBand.color} />
              </Tooltip>
            )}
            {alert.anomaly_score != null && Number(alert.anomaly_score) > 0 && (
              <Tooltip title={anomalyTooltip(alert.anomaly_score)}>
                <Chip size="small" label={anBand.label} color={anBand.color} />
              </Tooltip>
            )}
            <Chip size="small" label={`${alert.event_count} events`} variant="outlined" />
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
                  <Tooltip title="Mark this as seen. The alert stays visible so you can track it.">
                    <Button size="small" variant="outlined"
                      startIcon={<CheckIcon fontSize="small" />}
                      onClick={ack} disabled={busy}>Acknowledge</Button>
                  </Tooltip>
                )}
                {!resolved && (
                  <Tooltip title="Mark as fixed. The alert fades out but is kept for history.">
                    <Button size="small" variant="outlined" color="success"
                      startIcon={<DoneAllIcon fontSize="small" />}
                      onClick={resolve} disabled={busy}>Resolve</Button>
                  </Tooltip>
                )}
                <Tooltip title="Permanently remove this incident + its summary. The original log lines are kept.">
                  <Button size="small" variant="text" color="error"
                    startIcon={<DeleteForeverIcon fontSize="small" />}
                    onClick={() => setConfirmDelete(true)} disabled={busy}>
                    Delete forever
                  </Button>
                </Tooltip>
              </Stack>

              <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <DialogTitle>Delete this incident permanently?</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    The grouped incident and its AI-written summary will be removed.
                    The original log lines stay in the events database — you can
                    re-cluster them later if needed. This cannot be undone.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setConfirmDelete(false)} disabled={busy}>
                    Cancel
                  </Button>
                  <Button onClick={confirmAndDelete} color="error" disabled={busy}
                    startIcon={<DeleteForeverIcon fontSize="small" />}>
                    Delete forever
                  </Button>
                </DialogActions>
              </Dialog>
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

export default AlertRow;
