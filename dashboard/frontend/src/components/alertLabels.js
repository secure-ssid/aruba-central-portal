/**
 * Plain-English labels for severity + anomaly score.
 *
 * The raw RFC 5424 severities and z-score-ish anomaly numbers are fine
 * for engineers but confusing for first-week help-desk viewers. These
 * helpers translate to words + colors a non-technical user can read,
 * while keeping the underlying number available in a tooltip.
 */

// ─────────────────── severity ───────────────────

const SEVERITY_BUCKETS = [
  { max: 2, label: 'Critical', color: 'error'    },
  { max: 3, label: 'Error',    color: 'error'    },
  { max: 4, label: 'Warning',  color: 'warning'  },
  { max: 6, label: 'Info',     color: 'info'     },
  { max: 7, label: 'Debug',    color: 'default'  },
];

const RFC5424_LABEL = [
  'emergency', 'alert', 'critical', 'error',
  'warning', 'notice', 'info', 'debug',
];

export function severityBand(sev) {
  if (sev == null) return { label: 'Unknown', color: 'default', raw: null };
  const bucket = SEVERITY_BUCKETS.find((b) => sev <= b.max)
                 ?? SEVERITY_BUCKETS[SEVERITY_BUCKETS.length - 1];
  return { label: bucket.label, color: bucket.color, raw: sev };
}

export function severityTooltip(sev) {
  if (sev == null) return 'Severity not reported by the device.';
  const name = RFC5424_LABEL[sev] ?? `severity ${sev}`;
  return `RFC 5424 severity ${sev} — "${name}"`;
}

// ─────────────────── anomaly score ───────────────────

export function anomalyBand(score) {
  const n = Number(score) || 0;
  if (n >= 5)   return { label: 'Major spike',   color: 'error',   icon: 'exclamation', raw: n };
  if (n >= 2)   return { label: 'Unusual spike', color: 'warning', icon: 'up-arrow',    raw: n };
  return          { label: 'Normal volume', color: 'default', icon: 'flat',        raw: n };
}

export function anomalyTooltip(score) {
  const n = Number(score) || 0;
  if (n <= 0) return 'No spike detected — this device is logging at its usual rate.';
  const xRate = Math.max(1, Math.round(n));
  return `Anomaly score ${n.toFixed(1)} — this burst is roughly ${xRate}× the baseline for this device.`;
}

// ─────────────────── general helpers ───────────────────

export const SEVERITY_ORDER = [0, 1, 2, 3, 4, 5, 6, 7];
