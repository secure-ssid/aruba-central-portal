import { useState, useEffect } from 'react';
import { Alert, Collapse, Box, Typography } from '@mui/material';
import { useEventFeed } from './EventFeedProvider';

const CRITICAL_TYPES = new Set(['device_down', 'ap_down', 'gateway_down', 'tunnel_down']);
const HIGH_SEVERITY = new Set(['critical', 'high', 'major']);
const BANNER_TTL_MS = 60_000; // Auto-dismiss after 60s

function getBannerSeverity(event) {
  const sev = event.severity?.toLowerCase() || '';
  if (HIGH_SEVERITY.has(sev) || CRITICAL_TYPES.has(event.type)) return 'error';
  if (sev === 'warning' || sev === 'medium') return 'warning';
  return null;
}

export default function NetworkHealthBanner() {
  const { events } = useEventFeed();
  const [dismissed, setDismissed] = useState(false);
  const [shownEventId, setShownEventId] = useState(null);

  // Find the most recent critical/warning event
  const triggerEvent = events.find((e) => getBannerSeverity(e) !== null);
  const muiSeverity = triggerEvent ? getBannerSeverity(triggerEvent) : null;

  useEffect(() => {
    if (!triggerEvent) return;
    const id = triggerEvent.id || triggerEvent.ts;
    if (id !== shownEventId) {
      setDismissed(false);
      setShownEventId(id);
    }
  }, [triggerEvent, shownEventId]);

  // Auto-dismiss
  useEffect(() => {
    if (!triggerEvent || dismissed) return;
    const timer = setTimeout(() => setDismissed(true), BANNER_TTL_MS);
    return () => clearTimeout(timer);
  }, [triggerEvent, dismissed]);

  const show = !!triggerEvent && !dismissed;

  return (
    <Collapse in={show}>
      <Box sx={{ px: 2, pt: 1 }}>
        <Alert
          severity={muiSeverity || 'warning'}
          onClose={() => setDismissed(true)}
          sx={{ borderRadius: 1, fontSize: '0.8rem' }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
            {triggerEvent?.type?.replace(/_/g, ' ') || 'Network event detected'}
            {triggerEvent?.device && ` — ${triggerEvent.device}`}
            {triggerEvent?.site && ` (${triggerEvent.site})`}
          </Typography>
        </Alert>
      </Box>
    </Collapse>
  );
}
