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
  Collapse,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  SwapHoriz as SwapHorizIcon,
  Info as InfoIcon,
  Public as PublicIcon,
  Check as CheckIcon,
  Cloud as CloudIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  HelpOutline as HelpIcon,
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
  const [showClusters, setShowClusters] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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
      setWorkspaceError('Unable to fetch workspace information.');
    }
  };

  const fetchClusterInfo = async () => {
    try {
      setClusterError('');
      const info = await clusterAPI.getInfo();
      setClusterInfo(info);
    } catch (err) {
      console.error('Failed to fetch cluster info:', err);
      setClusterError('Unable to fetch cluster information.');
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
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setError(err.message || 'Failed to switch workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your workspace and Aruba Central connection settings
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Current Workspace Info */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <InfoIcon sx={{ mr: 1, color: 'var(--color-primary)', fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight={600}>Current Workspace</Typography>
              </Box>

              {currentWorkspace ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Customer ID</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                      {currentWorkspace.customer_id}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Base URL</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.78rem', wordBreak: 'break-all' }}>
                      {currentWorkspace.base_url}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Region</Typography>
                    <Typography variant="body2">{currentWorkspace.region || 'US West'}</Typography>
                  </Box>
                </Box>
              ) : workspaceError ? (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  <Typography variant="caption">{workspaceError}</Typography>
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: 'var(--color-primary)' }} />
                  <Typography variant="caption" color="text.secondary">Loading...</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Switch Workspace Form */}
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <SwapHorizIcon sx={{ mr: 1, color: 'var(--color-primary)', fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight={600}>Switch Workspace</Typography>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 1.5 }}>{success}</Alert>}

              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Client ID"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="API client ID"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Client Secret"
                    type={showSecret ? 'text' : 'password'}
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="API client secret"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowSecret(!showSecret)} edge="end" size="small">
                            {showSecret ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Customer ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="Customer ID"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Base URL"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://apigw-uswest4.central.arubanetworks.com"
                    helperText="Regional API base URL"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSwitchWorkspace}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={14} /> : <SwapHorizIcon />}
                  >
                    {loading ? 'Switching...' : 'Switch Workspace'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* GreenLake Credentials */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CloudIcon sx={{ mr: 1, color: '#FF6600', fontSize: 18 }} />
                  <Typography variant="subtitle2" fontWeight={600}>HPE GreenLake API Credentials</Typography>
                </Box>
                {glConfigured !== null && (
                  <Chip
                    icon={glConfigured ? <CheckIcon /> : undefined}
                    label={glConfigured ? 'Configured' : 'Not Configured'}
                    size="small"
                    color={glConfigured ? 'success' : 'default'}
                    sx={{ height: 22, fontSize: '0.7rem' }}
                  />
                )}
              </Box>

              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                Separate from Aruba Central credentials — used for GLP device and subscription management.
              </Typography>

              {glError && <Alert severity="error" sx={{ mb: 1.5 }}>{glError}</Alert>}
              {glSuccess && <Alert severity="success" sx={{ mb: 1.5 }}>{glSuccess}</Alert>}

              <Grid container spacing={1.5} alignItems="flex-end">
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="GL Client ID"
                    value={glClientId}
                    onChange={(e) => setGlClientId(e.target.value)}
                    placeholder="GreenLake client ID"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="GL Client Secret"
                    type={showGlSecret ? 'text' : 'password'}
                    value={glClientSecret}
                    onChange={(e) => setGlClientSecret(e.target.value)}
                    placeholder="GreenLake client secret"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowGlSecret(!showGlSecret)} edge="end" size="small">
                            {showGlSecret ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="GL API Base URL"
                    value={glApiBase}
                    onChange={(e) => setGlApiBase(e.target.value)}
                    helperText="Leave as default unless using regional endpoint"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSaveGLCredentials}
                    disabled={glLoading}
                    startIcon={glLoading ? <CircularProgress size={14} /> : <CloudIcon />}
                  >
                    {glLoading ? 'Saving...' : 'Save GreenLake Credentials'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Regional Clusters - collapsible */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.5,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
                onClick={() => setShowClusters(!showClusters)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PublicIcon sx={{ mr: 1, color: 'var(--color-primary)', fontSize: 18 }} />
                  <Typography variant="subtitle2" fontWeight={600}>Regional Clusters & Base URLs</Typography>
                </Box>
                {showClusters ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </Box>

              <Collapse in={showClusters}>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Alert severity="info" sx={{ mb: 2, py: 0.5 }}>
                    <Typography variant="caption">
                      <strong>Important:</strong> Using the wrong base URL will cause authentication failures.
                      Check your Aruba Central dashboard URL to identify your region.
                    </Typography>
                  </Alert>

                  {clusterInfo ? (
                    <>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ py: 0.75, fontWeight: 600, fontSize: '0.75rem' }}>Region</TableCell>
                              <TableCell sx={{ py: 0.75, fontWeight: 600, fontSize: '0.75rem' }}>Base URL</TableCell>
                              <TableCell sx={{ py: 0.75, fontWeight: 600, fontSize: '0.75rem' }}>Description</TableCell>
                              <TableCell align="center" sx={{ py: 0.75, fontWeight: 600, fontSize: '0.75rem' }}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {clusterInfo.available_clusters.map((cluster, idx) => {
                              const isCurrent = currentWorkspace?.base_url === cluster.base_url;
                              return (
                                <TableRow key={idx} sx={{ backgroundColor: isCurrent ? 'rgba(255, 102, 0, 0.06)' : 'transparent' }}>
                                  <TableCell sx={{ py: 0.75 }}>
                                    <Typography variant="caption" fontWeight={isCurrent ? 600 : 400}>
                                      {cluster.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ py: 0.75 }}>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                      {cluster.base_url}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ py: 0.75 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      {cluster.description}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 0.75 }}>
                                    {isCurrent && (
                                      <Chip
                                        icon={<CheckIcon />}
                                        label="Active"
                                        size="small"
                                        color="success"
                                        sx={{ height: 20, fontSize: '0.68rem' }}
                                      />
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Box sx={{ mt: 1.5, textAlign: 'center' }}>
                        <Link href={clusterInfo.documentation} target="_blank" rel="noopener" variant="caption">
                          View Aruba Central API Getting Started Guide
                        </Link>
                      </Box>
                    </>
                  ) : clusterError ? (
                    <Alert severity="warning"><Typography variant="caption">{clusterError}</Typography></Alert>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} sx={{ color: 'var(--color-primary)' }} />
                      <Typography variant="caption" color="text.secondary">Loading cluster information...</Typography>
                    </Box>
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Grid>

        {/* Help - collapsible */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.5,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
                onClick={() => setShowHelp(!showHelp)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HelpIcon sx={{ mr: 1, color: 'var(--color-primary)', fontSize: 18 }} />
                  <Typography variant="subtitle2" fontWeight={600}>How to Get API Credentials</Typography>
                </Box>
                {showHelp ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </Box>

              <Collapse in={showHelp}>
                <Divider />
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Box component="ol" sx={{ pl: 2, my: 0 }}>
                    {[
                      'Log in to your Aruba Central instance',
                      <>Navigate to <strong>Account Home → API Gateway → My Apps & Tokens</strong></>,
                      'Create a new application or use an existing one',
                      <>Copy the <strong>Client ID</strong>, <strong>Client Secret</strong>, and <strong>Customer ID</strong></>,
                      'Paste the credentials above and click "Switch Workspace"',
                    ].map((step, i) => (
                      <Typography key={i} component="li" variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                        {step}
                      </Typography>
                    ))}
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    <strong>Note:</strong> Default API rate limits are 5000 calls per day and 7 calls per second.
                    Your actual limits may vary based on your Aruba Central subscription.
                  </Typography>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SettingsPage;
