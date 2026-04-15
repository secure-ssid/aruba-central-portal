import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import apiClient from '../services/api';
import UserTable from './users/UserTable';
import UserEditBar from './users/UserEditBar';
import RoleManagementBar from './users/RoleManagementBar';
import { InviteUserDialog, CreateGroupDialog, ManageGroupDialog } from './users/UserDialogs';

function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [updateGiven, setUpdateGiven] = useState('');
  const [updateFamily, setUpdateFamily] = useState('');
  const [updateDisplay, setUpdateDisplay] = useState('');
  const [sortBy, setSortBy] = useState('username');
  const [sortDir, setSortDir] = useState('asc');
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [roleToAdd, setRoleToAdd] = useState('');
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [renameGroupOpen, setRenameGroupOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [renameGroupName, setRenameGroupName] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        offset: (page - 1) * limit,
        limit,
      };
      if (search.trim()) {
        params.filter = `username eq '${search.trim()}'`;
      }
      // SCIM list users
      const resp = await apiClient.get('/greenlake/scim/users', { params: { startIndex: params.offset || 0, count: params.limit || 25 } });
      let items = resp.data?.Resources || [];
      // client-side sort
      items = [...items].sort((a, b) => {
        const aU = a.userName || a.username || '';
        const bU = b.userName || b.username || '';
        const aFirst = a.name?.givenName || a.firstName || '';
        const bFirst = b.name?.givenName || b.firstName || '';
        const aLast = a.name?.familyName || a.lastName || '';
        const bLast = b.name?.familyName || b.lastName || '';
        const aCreated = a.meta?.created || a.createdAt || '';
        const bCreated = b.meta?.created || b.createdAt || '';
        const aLogin = a.meta?.lastLogin || a.lastLogin || '';
        const bLogin = b.meta?.lastLogin || b.lastLogin || '';
        const av = (sortBy === 'username' ? aU :
                    sortBy === 'firstName' ? aFirst :
                    sortBy === 'lastName' ? aLast :
                    sortBy === 'lastLogin' ? aLogin :
                    sortBy === 'createdAt' ? aCreated : '').toString().toLowerCase();
        const bv = (sortBy === 'username' ? bU :
                    sortBy === 'firstName' ? bFirst :
                    sortBy === 'lastName' ? bLast :
                    sortBy === 'lastLogin' ? bLogin :
                    sortBy === 'createdAt' ? bCreated : '').toString().toLowerCase();
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
      setUsers(items);
      setTotal(resp.data?.totalResults || resp.data?.total || 0);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sortBy, sortDir]);

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  const exportCsv = () => {
    const headers = ['Email','Status','First Name','Last Name','Last Login','Created'];
    const rows = users.map((u) => [
      u.username || '',
      u.userStatus || '',
      u.firstName || '',
      u.lastName || '',
      u.lastLogin || '',
      u.createdAt || '',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'greenlake_users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const inviteUser = async () => {
    try {
      // SCIM create user
      const payload = {
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
        userName: inviteEmail,
        displayName: inviteEmail,
        emails: [{ primary: true, value: inviteEmail }],
      };
      await apiClient.post('/greenlake/scim/users', payload);
      setInviteOpen(false);
      setInviteEmail('');
      setPage(1);
      fetchUsers();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to invite user');
    }
  };

  const updateUser = async () => {
    if (!selectedUserId) return;
    try {
      const ops = [];
      if (updateDisplay) {
        ops.push({ op: 'replace', path: 'displayName', value: updateDisplay });
      }
      if (updateGiven || updateFamily) {
        const nameObj = {};
        if (updateGiven) nameObj.givenName = updateGiven;
        if (updateFamily) nameObj.familyName = updateFamily;
        ops.push({ op: 'replace', path: 'name', value: nameObj });
      }
      if (ops.length === 0) return;
      await apiClient.patch(`/greenlake/scim/users/${selectedUserId}`, {
        schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
        Operations: ops
      });
      fetchUsers();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to update user');
    }
  };

  const deleteUser = async () => {
    if (!selectedUserId) return;
    try {
      await apiClient.delete(`/greenlake/scim/users/${selectedUserId}`);
      setSelectedUserId('');
      fetchUsers();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to delete user');
    }
  };

  // Load groups once
  useEffect(() => {
    (async () => {
      try {
        const resp = await apiClient.get('/greenlake/scim/groups', { params: { count: 200 } });
        const resources = resp.data?.Resources || resp.data?.items || [];
        setGroups(resources);
      } catch (e) {
        // best-effort
      }
    })();
  }, []);

  // Load selected user's groups
  useEffect(() => {
    if (!selectedUserId) {
      setUserGroups([]);
      return;
    }
    (async () => {
      try {
        const resp = await apiClient.get(`/greenlake/scim/users/${selectedUserId}/groups`);
        const resources = resp.data?.Resources || resp.data?.items || [];
        setUserGroups(resources);
      } catch (e) {
        setUserGroups([]);
      }
    })();
  }, [selectedUserId]);

  const addRole = async () => {
    if (!selectedUserId || !roleToAdd) return;
    try {
      // SCIM PATCH add member
      const payload = {
        schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
        Operations: [
          {
            op: 'add',
            path: 'members',
            value: [{ value: selectedUserId }],
          },
        ],
      };
      await apiClient.patch(`/greenlake/scim/groups/${roleToAdd}`, payload);
      // refresh memberships
      const resp = await apiClient.get(`/greenlake/scim/users/${selectedUserId}/groups`);
      setUserGroups(resp.data?.Resources || []);
      setRoleToAdd('');
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to add role');
    }
  };

  const removeRole = async (groupId) => {
    if (!selectedUserId || !groupId) return;
    try {
      const payload = {
        schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
        Operations: [
          {
            op: 'remove',
            path: `members[value eq "${selectedUserId}"]`,
          },
        ],
      };
      await apiClient.patch(`/greenlake/scim/groups/${groupId}`, payload);
      const resp = await apiClient.get(`/greenlake/scim/users/${selectedUserId}/groups`);
      setUserGroups(resp.data?.Resources || []);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to remove role');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            GL Users
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Users from HPE GreenLake Identity
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search by email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (setPage(1), fetchUsers())}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" onClick={() => setInviteOpen(true)}>Invite User</Button>
          <Button variant="outlined" onClick={exportCsv}>Export CSV</Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <RoleManagementBar
            groups={groups}
            userGroups={userGroups}
            roleToAdd={roleToAdd}
            onRoleToAddChange={setRoleToAdd}
            selectedUserId={selectedUserId}
            onAddRole={addRole}
            onRemoveRole={removeRole}
          />
          <UserEditBar
            users={users}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
            updateGiven={updateGiven}
            onUpdateGiven={setUpdateGiven}
            updateFamily={updateFamily}
            onUpdateFamily={setUpdateFamily}
            updateDisplay={updateDisplay}
            onUpdateDisplay={setUpdateDisplay}
            onUpdate={updateUser}
            onDelete={deleteUser}
          />
          <UserTable
            users={users}
            loading={loading}
            total={total}
            page={page}
            limit={limit}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={handleSort}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      {/* Quick actions for Groups */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button variant="outlined" onClick={() => setNewGroupOpen(true)}>Create Role</Button>
        <Button variant="outlined" onClick={() => setRenameGroupOpen(true)}>Manage Roles</Button>
      </Box>

      <InviteUserDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        email={inviteEmail}
        onEmailChange={setInviteEmail}
        onInvite={inviteUser}
      />

      <CreateGroupDialog
        open={newGroupOpen}
        onClose={() => setNewGroupOpen(false)}
        groupName={newGroupName}
        onGroupNameChange={setNewGroupName}
        onCreate={async () => {
          try {
            await apiClient.post('/greenlake/scim/groups', {
              schemas: ['urn:ietf:params:scim:schemas:core:2.0:Group'],
              displayName: newGroupName,
            });
            setNewGroupOpen(false);
            setNewGroupName('');
            const resp = await apiClient.get('/greenlake/scim/groups', { params: { count: 200 } });
            setGroups(resp.data?.Resources || []);
          } catch (e) {
            setError(e.response?.data?.error || 'Failed to create group');
          }
        }}
      />

      <ManageGroupDialog
        open={renameGroupOpen}
        onClose={() => setRenameGroupOpen(false)}
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        renameGroupName={renameGroupName}
        onRenameGroupNameChange={setRenameGroupName}
        onDelete={async () => {
          if (!selectedGroupId) return;
          try {
            await apiClient.delete(`/greenlake/scim/groups/${selectedGroupId}`);
            setSelectedGroupId('');
            const resp = await apiClient.get('/greenlake/scim/groups', { params: { count: 200 } });
            setGroups(resp.data?.Resources || []);
          } catch (e) {
            setError(e.response?.data?.error || 'Failed to delete group');
          }
        }}
        onRename={async () => {
          if (!selectedGroupId || !renameGroupName) return;
          try {
            await apiClient.patch(`/greenlake/scim/groups/${selectedGroupId}`, {
              schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
              Operations: [{ op: 'replace', path: 'displayName', value: renameGroupName }],
            });
            setRenameGroupName('');
            const resp = await apiClient.get('/greenlake/scim/groups', { params: { count: 200 } });
            setGroups(resp.data?.Resources || []);
          } catch (e) {
            setError(e.response?.data?.error || 'Failed to rename group');
          }
        }}
        onClone={async () => {
          if (!selectedGroupId || !renameGroupName) return;
          try {
            const src = await apiClient.get(`/greenlake/scim/groups/${selectedGroupId}`);
            const members = src.data?.members || [];
            const created = await apiClient.post('/greenlake/scim/groups', {
              schemas: ['urn:ietf:params:scim:schemas:core:2.0:Group'],
              displayName: renameGroupName,
            });
            const newGroupId = created.data?.id;
            if (newGroupId && members.length) {
              await apiClient.patch(`/greenlake/scim/groups/${newGroupId}`, {
                schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
                Operations: [{ op: 'add', path: 'members', value: members.map((m) => ({ value: m.value })) }],
              });
            }
            setRenameGroupName('');
            const resp = await apiClient.get('/greenlake/scim/groups', { params: { count: 200 } });
            setGroups(resp.data?.Resources || []);
          } catch (e) {
            setError(e.response?.data?.error || 'Failed to clone group');
          }
        }}
      />
    </Box>
  );
}

export default UsersPage;
