import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BusinessIcon from '@mui/icons-material/Business';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import apiClient from '../services/api';

function WorkspaceStatusChip({ status }) {
  const color =
    status === 'ACTIVE' ? 'success' :
    status === 'PENDING' ? 'warning' :
    status === 'SUSPENDED' ? 'error' :
    'default';
  return <Chip size="small" color={color} label={status || 'UNKNOWN'} />;
}

function GLWorkspacesPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    status: 'ACTIVE',
  });

  // Switch workspace form
  const [switchData, setSwitchData] = useState({
    workspaceId: '',
    clientId: '',
    clientSecret: '',
    customerId: '',
    glClientId: '',
    glClientSecret: '',
  });

  // Token transfer form
  const [transferData, setTransferData] = useState({
    sourceWorkspaceId: '',
    targetWorkspaceId: '',
    subscriptionId: '',
    deviceSerials: '',
  });

  // Menu anchor
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const fetchWorkspaces = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await apiClient.get('/greenlake/workspaces');
      setWorkspaces(resp.data?.items || resp.data?.workspaces || resp.data || []);

      // Try to get current workspace info
      try {
        const currentResp = await apiClient.get('/workspace/info');
        setCurrentWorkspace(currentResp.data);
      } catch (e) {
        console.log('Could not fetch current workspace info');
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await apiClient.post('/greenlake/workspaces', formData);
      setSuccess('Workspace created successfully');
      setCreateOpen(false);
      setFormData({ id: '', name: '', description: '', status: 'ACTIVE' });
      await fetchWorkspaces();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await apiClient.patch(`/greenlake/workspaces/${formData.id}`, {
        name: formData.name,
        description: formData.description,
        status: formData.status,
      });
      setSuccess('Workspace updated successfully');
      setEditOpen(false);
      setFormData({ id: '', name: '', description: '', status: 'ACTIVE' });
      await fetchWorkspaces();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to update workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workspaceId) => {
    if (!window.confirm('Delete this workspace? This action cannot be undone.')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await apiClient.delete(`/greenlake/workspaces/${workspaceId}`);
      setSuccess('Workspace deleted successfully');
      await fetchWorkspaces();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to delete workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        client_id: switchData.clientId,
        client_secret: switchData.clientSecret,
        customer_id: switchData.customerId,
      };

      // Include GreenLake credentials if provided
      if (switchData.glClientId && switchData.glClientSecret) {
        payload.gl_client_id = switchData.glClientId;
        payload.gl_client_secret = switchData.glClientSecret;
      }

      const resp = await apiClient.post('/workspace/switch', payload);
      setSuccess(resp.data.message || 'Workspace switched successfully. Page will reload...');
      setSwitchOpen(false);
      setSwitchData({
        workspaceId: '',
        clientId: '',
        clientSecret: '',
        customerId: '',
        glClientId: '',
        glClientSecret: '',
      });

      // Reload page after successful switch
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to switch workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenTransfer = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        sourceWorkspaceId: transferData.sourceWorkspaceId,
        targetWorkspaceId: transferData.targetWorkspaceId,
        subscriptionId: transferData.subscriptionId,
        deviceSerials: transferData.deviceSerials.split(',').map(s => s.trim()).filter(Boolean),
      };

      await apiClient.post('/greenlake/msp/token-transfer', payload);
      setSuccess('Token transfer completed successfully');
      setTransferOpen(false);
      setTransferData({
        sourceWorkspaceId: '',
        targetWorkspaceId: '',
        subscriptionId: '',
        deviceSerials: '',
      });
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to transfer tokens');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (workspace) => {
    setFormData({
      id: workspace.id || workspace.workspaceId,
      name: workspace.name || workspace.displayName || '',
      description: workspace.description || '',
      status: workspace.status || 'ACTIVE',
    });
    setEditOpen(true);
    setMenuAnchor(null);
  };

  const openSwitchDialog = (workspace) => {
    setSwitchData({
      ...switchData,
      workspaceId: workspace.id || workspace.workspaceId,
    });
    setSwitchOpen(true);
    setMenuAnchor(null);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            MSP Workspaces (GreenLake)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage multi-tenant workspaces and switch between customers
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<TransferWithinAStationIcon />}
            onClick={() => setTransferOpen(true)}
            size="small"
          >
            Transfer Tokens
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Create Workspace
          </Button>
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={fetchWorkspaces} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {currentWorkspace && (
        <Alert severity="info" icon={<BusinessIcon />} sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Current Workspace:</strong> {currentWorkspace.customer_id || 'Unknown'}
            {currentWorkspace.greenlake_updated && ' (GreenLake credentials active)'}
          </Typography>
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Workspace ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && workspaces.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={24} sx={{ my: 2 }} />
                    </TableCell>
                  </TableRow>
                ) : workspaces.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No workspaces found. Create your first workspace to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  workspaces.map((workspace, idx) => {
                    const workspaceId = workspace.id || workspace.workspaceId || workspace.tenantId;
                    const isCurrent = currentWorkspace?.customer_id === workspaceId;

                    return (
                      <TableRow key={workspaceId || idx}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <span>{workspaceId || '-'}</span>
                            {isCurrent && (
                              <Chip
                                size="small"
                                icon={<CheckCircleIcon />}
                                label="Active"
                                color="success"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>{workspace.name || workspace.displayName || '-'}</TableCell>
                        <TableCell>{workspace.description || '-'}</TableCell>
                        <TableCell>
                          <WorkspaceStatusChip status={workspace.status} />
                        </TableCell>
                        <TableCell>
                          {workspace.createdAt
                            ? new Date(workspace.createdAt).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Switch to this workspace">
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => openSwitchDialog(workspace)}
                                disabled={loading || isCurrent}
                              >
                                <SwapHorizIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setMenuAnchor(e.currentTarget);
                              setSelectedWorkspace(workspace);
                            }}
                            disabled={loading}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            if (selectedWorkspace) openEditDialog(selectedWorkspace);
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedWorkspace) {
              const workspaceId = selectedWorkspace.id || selectedWorkspace.workspaceId;
              handleDelete(workspaceId);
              setMenuAnchor(null);
            }
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Workspace Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Workspace</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Workspace Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!formData.name || loading}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Workspace Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Workspace</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Workspace ID"
              fullWidth
              value={formData.id}
              disabled
            />
            <TextField
              label="Workspace Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={!formData.name || loading}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Switch Workspace Dialog */}
      <Dialog open={switchOpen} onClose={() => setSwitchOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Switch Workspace</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
            Switching workspaces will reload the application with new credentials.
          </Alert>
          <Stack spacing={2}>
            <TextField
              label="Client ID (Aruba Central)"
              fullWidth
              value={switchData.clientId}
              onChange={(e) => setSwitchData({ ...switchData, clientId: e.target.value })}
              required
            />
            <TextField
              label="Client Secret (Aruba Central)"
              fullWidth
              type="password"
              value={switchData.clientSecret}
              onChange={(e) => setSwitchData({ ...switchData, clientSecret: e.target.value })}
              required
            />
            <TextField
              label="Customer ID"
              fullWidth
              value={switchData.customerId}
              onChange={(e) => setSwitchData({ ...switchData, customerId: e.target.value })}
              required
            />
            <Divider />
            <Typography variant="subtitle2" color="text.secondary">
              Optional: GreenLake Platform Credentials
            </Typography>
            <TextField
              label="GreenLake Client ID"
              fullWidth
              value={switchData.glClientId}
              onChange={(e) => setSwitchData({ ...switchData, glClientId: e.target.value })}
            />
            <TextField
              label="GreenLake Client Secret"
              fullWidth
              type="password"
              value={switchData.glClientSecret}
              onChange={(e) => setSwitchData({ ...switchData, glClientSecret: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSwitchOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSwitch}
            disabled={!switchData.clientId || !switchData.clientSecret || !switchData.customerId || loading}
          >
            Switch Workspace
          </Button>
        </DialogActions>
      </Dialog>

      {/* Token Transfer Dialog */}
      <Dialog open={transferOpen} onClose={() => setTransferOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>MSP Token Transfer</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            Transfer subscription tokens and devices between customer workspaces.
          </Alert>
          <Stack spacing={2}>
            <TextField
              label="Source Workspace ID"
              fullWidth
              value={transferData.sourceWorkspaceId}
              onChange={(e) => setTransferData({ ...transferData, sourceWorkspaceId: e.target.value })}
              required
            />
            <TextField
              label="Target Workspace ID"
              fullWidth
              value={transferData.targetWorkspaceId}
              onChange={(e) => setTransferData({ ...transferData, targetWorkspaceId: e.target.value })}
              required
            />
            <TextField
              label="Subscription ID"
              fullWidth
              value={transferData.subscriptionId}
              onChange={(e) => setTransferData({ ...transferData, subscriptionId: e.target.value })}
              required
            />
            <TextField
              label="Device Serial Numbers (comma-separated)"
              fullWidth
              multiline
              rows={3}
              placeholder="ABC123,DEF456,GHI789"
              value={transferData.deviceSerials}
              onChange={(e) => setTransferData({ ...transferData, deviceSerials: e.target.value })}
              helperText="Optional: Leave empty to transfer entire subscription"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleTokenTransfer}
            disabled={!transferData.sourceWorkspaceId || !transferData.targetWorkspaceId || !transferData.subscriptionId || loading}
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GLWorkspacesPage;
