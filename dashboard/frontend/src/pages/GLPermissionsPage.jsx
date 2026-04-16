import { useState } from 'react';
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
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import apiClient from '../services/api';
import GreenLakeNotConfigured, { isGLNotConfiguredError } from '../components/GreenLakeNotConfigured';
import { useGLPermissions, useGLRolePermissions } from '../hooks/useApiQueries';
import { useQueryClient } from '@tanstack/react-query';

// Permission categories and definitions
const PERMISSION_CATEGORIES = {
  workspace: {
    name: 'Workspace Management',
    icon: '🏢',
    permissions: [
      { id: 'workspace.view', name: 'View Workspaces', description: 'View workspace information' },
      { id: 'workspace.create', name: 'Create Workspaces', description: 'Create new workspaces/tenants' },
      { id: 'workspace.update', name: 'Update Workspaces', description: 'Modify workspace settings' },
      { id: 'workspace.delete', name: 'Delete Workspaces', description: 'Remove workspaces' },
      { id: 'workspace.switch', name: 'Switch Workspaces', description: 'Change active workspace context' },
    ],
  },
  users: {
    name: 'User Management',
    icon: '👥',
    permissions: [
      { id: 'users.view', name: 'View Users', description: 'View user accounts' },
      { id: 'users.invite', name: 'Invite Users', description: 'Send user invitations' },
      { id: 'users.update', name: 'Update Users', description: 'Modify user information' },
      { id: 'users.delete', name: 'Delete Users', description: 'Remove user accounts' },
      { id: 'users.impersonate', name: 'Impersonate Users', description: 'Act as another user' },
    ],
  },
  roles: {
    name: 'Role & Permission Management',
    icon: '🛡️',
    permissions: [
      { id: 'roles.view', name: 'View Roles', description: 'View role definitions' },
      { id: 'roles.assign', name: 'Assign Roles', description: 'Assign roles to users' },
      { id: 'roles.create', name: 'Create Roles', description: 'Create custom roles' },
      { id: 'roles.update', name: 'Update Roles', description: 'Modify role permissions' },
      { id: 'roles.delete', name: 'Delete Roles', description: 'Remove custom roles' },
    ],
  },
  devices: {
    name: 'Device Management',
    icon: '📱',
    permissions: [
      { id: 'devices.view', name: 'View Devices', description: 'View device inventory' },
      { id: 'devices.add', name: 'Add Devices', description: 'Add devices to inventory' },
      { id: 'devices.update', name: 'Update Devices', description: 'Modify device information' },
      { id: 'devices.delete', name: 'Delete Devices', description: 'Remove devices' },
      { id: 'devices.subscribe', name: 'Subscribe Devices', description: 'Subscribe devices to services' },
    ],
  },
  subscriptions: {
    name: 'Subscription Management',
    icon: '📋',
    permissions: [
      { id: 'subscriptions.view', name: 'View Subscriptions', description: 'View subscription details' },
      { id: 'subscriptions.create', name: 'Create Subscriptions', description: 'Create new subscriptions' },
      { id: 'subscriptions.update', name: 'Update Subscriptions', description: 'Modify subscriptions' },
      { id: 'subscriptions.transfer', name: 'Transfer Subscriptions', description: 'Transfer between workspaces (MSP)' },
    ],
  },
};

function PermissionChip({ permission, granted }) {
  return (
    <Chip
      size="small"
      icon={granted ? <CheckCircleIcon /> : <LockIcon />}
      label={permission}
      color={granted ? 'success' : 'default'}
      variant={granted ? 'filled' : 'outlined'}
    />
  );
}

function GLPermissionsPage() {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState('');
  const [success, setSuccess] = useState('');
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [],
  });
  const [createLoading, setCreateLoading] = useState(false);

  const {
    data: permissionsData,
    error: permissionsQueryError,
    isLoading: permissionsLoading,
    refetch: refetchPermissions,
  } = useGLPermissions();

  const { data: rolePermissions = {} } = useGLRolePermissions();

  const permissions = permissionsData?.permissions || permissionsData || [];
  const notConfigured = permissionsQueryError ? isGLNotConfiguredError(permissionsQueryError) : false;
  const error = mutationError || (permissionsQueryError && !notConfigured
    ? (permissionsQueryError.response?.data?.error || 'Failed to load permissions')
    : '');
  const loading = permissionsLoading || createLoading;

  const handleCreateRole = async () => {
    setCreateLoading(true);
    setMutationError('');
    setSuccess('');
    try {
      await apiClient.post('/greenlake/custom-roles', newRole);
      setSuccess('Custom role created successfully');
      setCreateRoleOpen(false);
      setNewRole({ name: '', description: '', permissions: [] });
      queryClient.invalidateQueries({ queryKey: ['gl-permissions'] });
    } catch (e) {
      setMutationError(e.response?.data?.error || 'Failed to create role');
    } finally {
      setCreateLoading(false);
    }
  };

  const togglePermission = (permissionId) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const allPermissions = Object.values(PERMISSION_CATEGORIES).flatMap(cat =>
    cat.permissions.map(p => p.id)
  );

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Permissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            GreenLake granular permissions for platform access
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateRoleOpen(true)}
          >
            Create Custom Role
          </Button>
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={() => refetchPermissions()} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {notConfigured && <GreenLakeNotConfigured />}

      {!notConfigured && <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2">
          Permissions are granular access controls that determine what actions users can perform.
          Permissions are grouped into roles for easier management. Platform roles (Admin/Operator/Observer)
          have predefined permission sets, but you can create custom roles with specific permissions.
        </Typography>
      </Alert>}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setMutationError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Permission Categories */}
      {!notConfigured && <Stack spacing={2}>
        {Object.entries(PERMISSION_CATEGORIES).map(([categoryKey, category]) => (
          <Accordion key={categoryKey} defaultExpanded={categoryKey === 'workspace'}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h6" sx={{ fontSize: 24 }}>
                  {category.icon}
                </Typography>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {category.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {category.permissions.length} permissions
                  </Typography>
                </Box>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Permission</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell>Operator</TableCell>
                      <TableCell>Observer</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {category.permissions.map(permission => {
                      // Determine which roles have this permission
                      const adminHas = permission.id.includes('view') || permission.id.includes('create') || permission.id.includes('update') || permission.id.includes('delete') || permission.id.includes('assign') || permission.id.includes('switch') || permission.id.includes('subscribe') || permission.id.includes('transfer');
                      const operatorHas = permission.id.includes('view') || permission.id.includes('update') || permission.id.includes('assign') || permission.id.includes('subscribe');
                      const observerHas = permission.id.includes('view');

                      return (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <SecurityIcon fontSize="small" color="action" />
                              <Typography variant="body2" fontWeight={500}>
                                {permission.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {permission.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <PermissionChip permission="Admin" granted={adminHas} />
                          </TableCell>
                          <TableCell>
                            <PermissionChip permission="Operator" granted={operatorHas} />
                          </TableCell>
                          <TableCell>
                            <PermissionChip permission="Observer" granted={observerHas} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>}

      {/* Permission Summary */}
      {!notConfigured && <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Permission Summary by Role
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Total Permissions</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>Create</TableCell>
                  <TableCell>Update</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Chip size="small" label="👑 Administrator" color="error" />
                  </TableCell>
                  <TableCell>
                    <strong>{allPermissions.length}</strong> / {allPermissions.length}
                  </TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Chip size="small" label="⚙️ Operator" color="warning" />
                  </TableCell>
                  <TableCell>
                    <strong>{allPermissions.filter(p => p.includes('view') || p.includes('update') || p.includes('assign') || p.includes('subscribe')).length}</strong> / {allPermissions.length}
                  </TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>⚠️ Limited</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>❌</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Chip size="small" label="👁️ Observer" color="info" />
                  </TableCell>
                  <TableCell>
                    <strong>{allPermissions.filter(p => p.includes('view')).length}</strong> / {allPermissions.length}
                  </TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>❌</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>}

      {/* Create Custom Role Dialog */}
      <Dialog open={createRoleOpen} onClose={() => setCreateRoleOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Custom Role</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Role Name"
              fullWidth
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
            />
            <Divider />
            <Typography variant="subtitle2">
              Select Permissions ({newRole.permissions.length} selected)
            </Typography>
            {Object.entries(PERMISSION_CATEGORIES).map(([categoryKey, category]) => (
              <Box key={categoryKey}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  {category.icon} {category.name}
                </Typography>
                <List dense>
                  {category.permissions.map(permission => (
                    <ListItem key={permission.id} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={newRole.permissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={permission.name}
                        secondary={permission.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateRoleOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateRole}
            disabled={!newRole.name || newRole.permissions.length === 0 || loading}
          >
            Create Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GLPermissionsPage;
