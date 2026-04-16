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

// NOTE: hex values required here because color is used with hex opacity suffixes (e.g. `${color}20`)
const DEFAULT_COLOR_MAP = {
  // Device / interface health
  Up:       '#22C55E',
  up:       '#22C55E',
  Down:     '#EF4444',
  down:     '#EF4444',
  online:   '#22C55E',
  Online:   '#22C55E',
  offline:  '#EF4444',
  Offline:  '#EF4444',
  'Up/Up':  '#22C55E',
  // GL account states
  ACTIVE:     '#22C55E',
  UNVERIFIED: '#F59E0B',
  DISABLED:   '#94A3B8',
  SUSPENDED:  '#EF4444',
  // Task / job states
  completed: '#10B981',
  Completed: '#10B981',
  running:   '#FF6600',
  Running:   '#FF6600',
  error:     '#EF4444',
  Error:     '#EF4444',
  pending:   '#9CA3AF',
  Pending:   '#9CA3AF',
  // Generic
  active:    '#22C55E',
  inactive:  '#94A3B8',
  warning:   '#F59E0B',
  Warning:   '#F59E0B',
  critical:  '#EF4444',
  Critical:  '#EF4444',
};

function StatusChip({ status, colorMap, icon, sx = {}, ...props }) {
  const map = colorMap ? { ...DEFAULT_COLOR_MAP, ...colorMap } : DEFAULT_COLOR_MAP;
  const color = map[status] || '#94A3B8';

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
