/**
 * GreenLake Not Configured Banner
 * Shown on GL pages when the backend lacks GL_RBAC_CLIENT_ID / GL_RBAC_CLIENT_SECRET
 */

import { Box, Typography, Button } from '@mui/material';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import SettingsIcon from '@mui/icons-material/Settings';

export function isGLNotConfiguredError(err) {
  const msg = err?.response?.data?.error || '';
  return msg.includes('not configured');
}

export default function GreenLakeNotConfigured() {
  return (
    <Box
      sx={{
        mt: 2,
        p: 4,
        borderRadius: '10px',
        border: '1px solid rgba(245,158,11,0.15)',
        bgcolor: 'rgba(245,158,11,0.04)',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '12px',
          bgcolor: 'rgba(245,158,11,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        <CloudOffIcon sx={{ fontSize: 28, color: 'var(--color-warning)' }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
        GreenLake Integration Not Configured
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 420, mx: 'auto', lineHeight: 1.6 }}>
        This feature requires GreenLake RBAC credentials. Set the{' '}
        <Typography component="code" variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-warning)', bgcolor: 'rgba(245,158,11,0.08)', px: 0.5, py: 0.15, borderRadius: '4px' }}>
          GL_RBAC_CLIENT_ID
        </Typography>{' '}
        and{' '}
        <Typography component="code" variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-warning)', bgcolor: 'rgba(245,158,11,0.08)', px: 0.5, py: 0.15, borderRadius: '4px' }}>
          GL_RBAC_CLIENT_SECRET
        </Typography>{' '}
        environment variables and restart the backend.
      </Typography>
      <Button
        variant="outlined"
        size="small"
        startIcon={<SettingsIcon sx={{ fontSize: 16 }} />}
        sx={{
          borderColor: 'rgba(245,158,11,0.3)',
          color: 'var(--color-warning)',
          fontWeight: 600,
          fontSize: '0.75rem',
          '&:hover': {
            borderColor: 'rgba(245,158,11,0.5)',
            bgcolor: 'rgba(245,158,11,0.06)',
          },
        }}
        href="/settings"
      >
        Go to Settings
      </Button>
    </Box>
  );
}
