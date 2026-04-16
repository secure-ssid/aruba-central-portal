import { Chip } from '@mui/material';

/**
 * Shared StatusChip — covers device health, interface state, GL account state, and task state.
 *
 * Usage:
 *   <StatusChip status="Up" />
 *   <StatusChip status="ACTIVE" />
 *   <StatusChip status="completed" />
 *   // Custom color override:
 *   <StatusChip status="custom" colorMap={{ custom: '#A855F7' }} />
 *   // With an icon:
 *   <StatusChip status="Up" icon={<CheckCircleIcon sx={{ fontSize: 14 }} />} />
 */

const DEFAULT_COLOR_MAP = {
  // Device / interface health
  Up:       'var(--color-success)',
  up:       'var(--color-success)',
  Down:     'var(--color-error)',
  down:     'var(--color-error)',
  online:   'var(--color-success)',
  Online:   'var(--color-success)',
  offline:  'var(--color-error)',
  Offline:  'var(--color-error)',
  'Up/Up':  'var(--color-success)',
  // GL account states
  ACTIVE:     'var(--color-success)',
  UNVERIFIED: 'var(--color-warning)',
  DISABLED:   'var(--text-secondary)',
  SUSPENDED:  'var(--color-error)',
  // Task / job states
  completed: '#10B981',
  Completed: '#10B981',
  running:   'var(--color-primary)',
  Running:   'var(--color-primary)',
  error:     'var(--color-error)',
  Error:     'var(--color-error)',
  pending:   '#9CA3AF',
  Pending:   '#9CA3AF',
  // Generic
  active:    'var(--color-success)',
  inactive:  'var(--text-secondary)',
  warning:   'var(--color-warning)',
  Warning:   'var(--color-warning)',
  critical:  'var(--color-error)',
  Critical:  'var(--color-error)',
};

function StatusChip({ status, colorMap, icon, sx = {}, ...props }) {
  const map = colorMap ? { ...DEFAULT_COLOR_MAP, ...colorMap } : DEFAULT_COLOR_MAP;
  const color = map[status] || 'var(--text-secondary)';

  return (
    <Chip
      size="small"
      label={status || 'Unknown'}
      icon={icon}
      sx={{
        backgroundColor: `${color}20`,
        color,
        border: `1px solid ${color}40`,
        fontWeight: 600,
        fontSize: '0.7rem',
        '& .MuiChip-icon': { color },
        ...sx,
      }}
      {...props}
    />
  );
}

export default StatusChip;
