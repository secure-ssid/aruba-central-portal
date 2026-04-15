/**
 * GreenLake Not Configured Banner
 * Shown on GL pages when the backend lacks GL_RBAC_CLIENT_ID / GL_RBAC_CLIENT_SECRET
 */

import { Box, Alert, AlertTitle, Typography } from '@mui/material';
import CloudOffIcon from '@mui/icons-material/CloudOff';

export function isGLNotConfiguredError(err) {
  const msg = err?.response?.data?.error || '';
  return msg.includes('not configured');
}

export default function GreenLakeNotConfigured() {
  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity="warning" icon={<CloudOffIcon />}>
        <AlertTitle>GreenLake Integration Not Configured</AlertTitle>
        <Typography variant="body2">
          This feature requires GreenLake RBAC credentials to be configured on the server.
          Set the <strong>GL_RBAC_CLIENT_ID</strong> and <strong>GL_RBAC_CLIENT_SECRET</strong>{' '}
          environment variables and restart the backend container.
        </Typography>
      </Alert>
    </Box>
  );
}
