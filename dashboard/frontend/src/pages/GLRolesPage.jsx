import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import ShieldIcon from '@mui/icons-material/Shield';
import { greenlakeRoleAPI } from '../services/api';

const PLATFORM_ROLES = [
  {
    id: 'administrator',
    name: 'Administrator',
    description: 'Full platform management - can manage workspaces, users, subscriptions, devices',
    permissions: ['View', 'Edit', 'Delete'],
    color: 'error',
    icon: '👑',
  },
  {
    id: 'operator',
    name: 'Operator',
    description: 'Day-to-day operations - can configure but not delete critical resources',
    permissions: ['View', 'Edit'],
    color: 'warning',
    icon: '⚙️',
  },
  {
    id: 'observer',
    name: 'Observer',
    description: 'Read-only access - monitoring, reporting, auditing',
    permissions: ['View'],
    color: 'info',
    icon: '👁️',
  },
];

function RoleChip({ role }) {
  const roleInfo = PLATFORM_ROLES.find(r => r.id === role || r.name === role);
  return (
    <Chip
      size="small"
      color={roleInfo?.color || 'default'}
      label={roleInfo ? `${roleInfo.icon} ${roleInfo.name}` : role}
      icon={<ShieldIcon />}
    />
  );
}

function RoleInfoCard({ role }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Typography variant="h2" sx={{ fontSize: 32 }}>
            {role.icon}
          </Typography>
          <Box flex={1}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {role.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {role.description}
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              {role.permissions.map(perm => (
                <Chip key={perm} size="small" label={perm} variant="outlined" />
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function GLRolesPage() {
  const [loading, setLoading] = useState(false);
  const [roleAssignments, setRoleAssignments] = useState([]);
  const [error, setError] = useState('');
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      // Load role assignments from backend
      const data = await greenlakeRoleAPI.listAssignments();
      setRoleAssignments(data.assignments || []);
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load role assignments');
      // Graceful fallback for demo
      setRoleAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await greenlakeRoleAPI.listUsers();
      setUsers(data.items || []);
    } catch (e) {
      console.error('Failed to load users:', e);
      setUsers([]);
    }
  };

  useEffect(() => {
    load();
    loadUsers();
  }, []);

  const handleAssignRole = async () => {
    if (!selectedRole || !selectedUser) return;
    setLoading(true);
    setError('');
    try {
      await greenlakeRoleAPI.assignRole({
        userId: selectedUser,
        roleId: selectedRole,
      });
      setAssignOpen(false);
      setSelectedRole('');
      setSelectedUser('');
      await load();
    } catch (e) {
      setError(e?.response?.data?.error || 'Role assignment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignRole = async (assignmentId) => {
    if (!window.confirm('Remove this role assignment?')) return;
    setLoading(true);
    setError('');
    try {
      await greenlakeRoleAPI.unassignRole(assignmentId);
      await load();
    } catch (e) {
      setError(e?.response?.data?.error || 'Role unassignment failed');
    } finally {
      setLoading(false);
    }
  };

  // Group assignments by role
  const assignmentsByRole = PLATFORM_ROLES.map(role => {
    const assignments = roleAssignments.filter(
      a => a.roleId === role.id || a.roleName === role.name
    );
    return { ...role, assignments };
  });

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            GreenLake Platform Roles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage HPE GreenLake platform role assignments
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setAssignOpen(true)}
          >
            Assign Role
          </Button>
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={load} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Two-Tier Role System
        </Typography>
        <Typography variant="body2">
          Platform roles control access to GreenLake infrastructure (workspaces, users, devices).
          Users also need <strong>Service roles</strong> (Aruba Central Administrator, etc.) to
          access network features. See{' '}
          <Typography component="span" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
            docs/GREENLAKE_ROLES.md
          </Typography>{' '}
          for details.
        </Typography>
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {PLATFORM_ROLES.map(role => {
          const assignments = assignmentsByRole.find(r => r.id === role.id)?.assignments || [];
          return (
            <Card key={role.id}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h3" sx={{ fontSize: 28 }}>
                        {role.icon}
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {role.name}
                      </Typography>
                      <Chip size="small" label={`${assignments.length} users`} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      {role.description}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {role.permissions.map(perm => (
                      <Chip key={perm} size="small" label={perm} variant="outlined" />
                    ))}
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {assignments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    No users assigned to this role
                  </Typography>
                ) : (
                  <List dense>
                    {assignments.map(assignment => (
                      <ListItem key={assignment.id}>
                        <ListItemText
                          primary={assignment.username || assignment.userId}
                          secondary={assignment.assignedAt ? `Assigned: ${new Date(assignment.assignedAt).toLocaleDateString()}` : ''}
                        />
                        <ListItemSecondaryAction>
                          <Tooltip title="Remove role">
                            <span>
                              <IconButton
                                edge="end"
                                size="small"
                                color="error"
                                onClick={() => handleUnassignRole(assignment.id)}
                                disabled={loading}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Role Comparison
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>View Resources</TableCell>
                  <TableCell>Modify Resources</TableCell>
                  <TableCell>Delete Resources</TableCell>
                  <TableCell>Manage Users</TableCell>
                  <TableCell>Manage Workspaces</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell><RoleChip role="administrator" /></TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><RoleChip role="operator" /></TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>⚠️ Limited</TableCell>
                  <TableCell>⚠️ Limited</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><RoleChip role="observer" /></TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>❌</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Platform Role</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select User</InputLabel>
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                label="Select User"
              >
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username || user.email || user.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Select Role"
              >
                {PLATFORM_ROLES.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span>{role.icon}</span>
                      <span>{role.name}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedRole && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Role Information:
                </Typography>
                <RoleInfoCard role={PLATFORM_ROLES.find(r => r.id === selectedRole)} />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAssignRole}
            disabled={!selectedUser || !selectedRole || loading}
          >
            Assign Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
