/**
 * Settings Page Component
 * Manage workspace settings and switch between workspaces
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  SwapHoriz as SwapHorizIcon,
  Info as InfoIcon,
  Public as PublicIcon,
  Check as CheckIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';
import { workspaceAPI, clusterAPI } from '../services/api';
import { DEFAULT_API_BASE_URL } from '../config/apiEndpoints';

function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [clusterInfo, setClusterInfo] = useState(null);
  const [clusterError, setClusterError] = useState('');
  const [workspaceError, setWorkspaceError] = useState('');

  // Form state
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [baseUrl, setBaseUrl] = useState(DEFAULT_API_BASE_URL);
  const [showSecret, setShowSecret] = useState(false);

  // GreenLake credentials state
  const [glClientId, setGlClientId] = useState('');
  const [glClientSecret, setGlClientSecret] = useState('');
  const [glApiBase, setGlApiBase] = useState('https://global.api.greenlake.hpe.com');
  const [showGlSecret, setShowGlSecret] = useState(false);
  const [glLoading, setGlLoading] = useState(false);
  const [glError, setGlError] = useState('');
  const [glSuccess, setGlSuccess] = useState('');
  const [glConfigured, setGlConfigured] = useState(null);

  useEffect(() => {
    fetchWorkspaceInfo();
    fetchClusterInfo();
    fetchGLStatus();
  }, []);

  const fetchWorkspaceInfo = async () => {
    try {
      setWorkspaceError('');
      const info = await workspaceAPI.getInfo();
      setCurrentWorkspace(info);
    } catch (err) {
      console.error('Failed to fetch workspace info:', err);
      setWorkspaceError('Unable to fetch workspace information. The backend may not be connected.');
    }
  };

  const fetchClusterInfo = async () => {
    try {
      setClusterError('');
      const info = await clusterAPI.getInfo();
      setClusterInfo(info);
    } catch (err) {
      console.error('Failed to fetch cluster info:', err);
      setClusterError('Unable to fetch cluster information. The backend may not be configured.');
    }
  };

  const fetchGLStatus = async () => {
    try {
      const status = await workspaceAPI.getGLStatus();
      setGlConfigured(status.configured);
      if (status.api_base) setGlApiBase(status.api_base);
    } catch (err) {
      console.error('Failed to fetch GL status:', err);
    }
  };

  const handleSaveGLCredentials = async () => {
    if (!glClientId || !glClientSecret) {
      setGlError('Client ID and Client Secret are required');
      return;
    }

    setGlLoading(true);
    setGlError('');
    setGlSuccess('');

    try {
      const response = await workspaceAPI.saveGLCredentials(glClientId, glClientSecret, glApiBase);
      setGlSuccess(response.message || 'GreenLake credentials saved successfully');
      setGlConfigured(true);
      setGlClientId('');
      setGlClientSecret('');
    } catch (err) {
      setGlError(err.message || 'Failed to save GreenLake credentials');
    } finally {
      setGlLoading(false);
    }
  };

  const handleSwitchWorkspace = async () => {
    if (!clientId || !clientSecret || !customerId) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await workspaceAPI.switch(clientId, clientSecret, customerId, baseUrl);
      setSuccess(response.message || 'Workspace switched successfully! Reloading...');

      // Reload the page to reflect new workspace
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to switch workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your workspace and Aruba Central connection settings
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Current Workspace Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InfoIcon sx={{ mr: 1, color: '#FF6600' }} />
                <Typography variant="h6">Current Workspace</Typography>
              </Box>

              {currentWorkspace ? (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Customer ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {currentWorkspace.customer_id}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Base URL
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {currentWorkspace.base_url}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Region
                    </Typography>
                    <Typography variant="body1">
                      {currentWorkspace.region || 'US West'}
                    </Typography>
                  </Box>
                </Box>
              ) : workspaceError ? (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  {workspaceError}
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: '#FF6600' }} />
                  <Typography variant="body2" color="text.secondary">Loading workspace info...</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Switch Workspace Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SwapHorizIcon sx={{ mr: 1, color: '#FF6600' }} />
                <Typography variant="h6">Switch Workspace</Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter new workspace credentials to switch to a different Aruba Central workspace
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="Enter your API client ID"
              />

              <TextField
                fullWidth
                label="Client Secret"
                type={showSecret ? 'text' : 'password'}
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="Enter your API client secret"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowSecret(!showSecret)}
                        edge="end"
                      >
                        {showSecret ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="Enter your customer ID"
              />

              <TextField
                fullWidth
                label="Base URL"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                sx={{ mb: 3 }}
                placeholder="e.g., https://apigw-uswest4.central.arubanetworks.com"
                helperText="Aruba Central API base URL for your region"
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSwitchWorkspace}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SwapHorizIcon />}
              >
                {loading ? 'Switching Workspace...' : 'Switch Workspace'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* GreenLake API Credentials */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CloudIcon sx={{ mr: 1, color: '#FF6600' }} />
              <Typography variant="h6">GreenLake API Credentials</Typography>
            </Box>
            {glConfigured !== null && (
              <Chip
                icon={glConfigured ? <CheckIcon /> : undefined}
                label={glConfigured ? 'Configured' : 'Not Configured'}
                size="small"
                color={glConfigured ? 'success' : 'default'}
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            HPE GreenLake API credentials for GreenLake Lifecycle Platform (GLP) device and subscription management.
            These are separate from Aruba Central credentials.
          </Typography>

          {glError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {glError}
            </Alert>
          )}

          {glSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {glSuccess}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GL Client ID"
                value={glClientId}
                onChange={(e) => setGlClientId(e.target.value)}
                placeholder="Enter GreenLake client ID"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GL Client Secret"
                type={showGlSecret ? 'text' : 'password'}
                value={glClientSecret}
                onChange={(e) => setGlClientSecret(e.target.value)}
                placeholder="Enter GreenLake client secret"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowGlSecret(!showGlSecret)} edge="end">
                        {showGlSecret ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="GL API Base URL"
                value={glApiBase}
                onChange={(e) => setGlApiBase(e.target.value)}
                placeholder="https://global.api.greenlake.hpe.com"
                helperText="Leave as default unless your HPE account uses a regional endpoint"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSaveGLCredentials}
                disabled={glLoading}
                startIcon={glLoading ? <CircularProgress size={20} /> : <CloudIcon />}
              >
                {glLoading ? 'Saving...' : 'Save GreenLake Credentials'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* Regional Cluster Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PublicIcon sx={{ mr: 1, color: '#FF6600' }} />
            <Typography variant="h6">Regional Clusters & Base URLs</Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Important: Using the wrong base URL will cause authentication failures!
            </Typography>
            <Typography variant="body2">
              Find your correct regional cluster base URL below. Check your Aruba Central dashboard URL to identify your region.
            </Typography>
          </Alert>

          {clusterInfo ? (
            <Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Region</strong></TableCell>
                      <TableCell><strong>Base URL</strong></TableCell>
                      <TableCell><strong>Description</strong></TableCell>
                      <TableCell align="center"><strong>Current</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clusterInfo.available_clusters.map((cluster, idx) => {
                      const isCurrent = currentWorkspace?.base_url === cluster.base_url;
                      return (
                        <TableRow key={idx} sx={{ backgroundColor: isCurrent ? 'rgba(255, 102, 0, 0.1)' : 'transparent' }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={isCurrent ? 600 : 400}>
                              {cluster.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                              {cluster.base_url}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {cluster.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {isCurrent && (
                              <Chip
                                icon={<CheckIcon />}
                                label="Active"
                                size="small"
                                color="success"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255, 102, 0, 0.05)', borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  How to Find Your Cluster:
                </Typography>
                <Box component="ul" sx={{ pl: 2, my: 1 }}>
                  <Typography component="li" variant="body2" paragraph>
                    {clusterInfo.how_to_find.step1}
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    {clusterInfo.how_to_find.step2}
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    {clusterInfo.how_to_find.step3}
                  </Typography>
                  <Typography component="li" variant="body2">
                    {clusterInfo.how_to_find.step4}
                  </Typography>
                </Box>
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {clusterInfo.how_to_find.note}
                </Alert>
              </Box>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link
                  href={clusterInfo.documentation}
                  target="_blank"
                  rel="noopener"
                  variant="body2"
                >
                  View Aruba Central API Getting Started Guide
                </Link>
              </Box>
            </Box>
          ) : clusterError ? (
            <Alert severity="warning" sx={{ mt: 1 }}>
              {clusterError}
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, gap: 1 }}>
              <CircularProgress size={20} sx={{ color: '#FF6600' }} />
              <Typography variant="body2" color="text.secondary">Loading cluster information...</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            How to Get API Credentials
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            To switch workspaces, you'll need API credentials from Aruba Central:
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2" paragraph>
              Log in to your Aruba Central instance
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              Navigate to <strong>Account Home → API Gateway → My Apps & Tokens</strong>
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              Create a new application or use an existing one
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              Copy the <strong>Client ID</strong>, <strong>Client Secret</strong>, and <strong>Customer ID</strong>
            </Typography>
            <Typography component="li" variant="body2">
              Paste the credentials above and click "Switch Workspace"
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> Default API rate limits are 5000 calls per day and 7 calls per second.
            Your actual limits may vary based on your Aruba Central subscription.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SettingsPage;
