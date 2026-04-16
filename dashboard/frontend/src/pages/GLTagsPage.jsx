import { useMemo, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Alert, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, Button, TextField, InputAdornment, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, Tooltip, Skeleton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import apiClient from '../services/api';
import GreenLakeNotConfigured, { isGLNotConfiguredError } from '../components/GreenLakeNotConfigured';
import { useGLTags } from '../hooks/useApiQueries';
import { useQueryClient } from '@tanstack/react-query';

function GLTagsPage() {
  const queryClient = useQueryClient();
  const [mutationLoading, setMutationLoading] = useState(false);
  const [mutationError, setMutationError] = useState('');
  const [success, setSuccess] = useState('');
  const [sortBy, setSortBy] = useState('key');
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    key: '',
    value: '',
    resourceType: '',
    resourceId: '',
  });

  const {
    data: rawTags = [],
    error: queryError,
    isLoading: queryLoading,
    refetch,
  } = useGLTags();

  const notConfigured = queryError ? isGLNotConfiguredError(queryError) : false;
  const error = mutationError || (queryError && !notConfigured
    ? (queryError.response?.data?.error || 'Failed to load tags')
    : '');
  const loading = queryLoading || mutationLoading;

  // Client-side filter + sort (derived from cached query data)
  const tags = useMemo(() => {
    let items = [...rawTags];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((t) =>
        (t.key || t.tagKey || '').toLowerCase().includes(q) ||
        (t.value || t.tagValue || '').toLowerCase().includes(q) ||
        (t.resourceType || '').toLowerCase().includes(q) ||
        (t.resourceId || '').toLowerCase().includes(q)
      );
    }
    items.sort((a, b) => {
      const av = (
        (sortBy === 'key'   ? a.key   || a.tagKey   :
         sortBy === 'value' ? a.value || a.tagValue :
         sortBy === 'type'  ? a.resourceType :
         sortBy === 'rid'   ? a.resourceId : '') || ''
      ).toString().toLowerCase();
      const bv = (
        (sortBy === 'key'   ? b.key   || b.tagKey   :
         sortBy === 'value' ? b.value || b.tagValue :
         sortBy === 'type'  ? b.resourceType :
         sortBy === 'rid'   ? b.resourceId : '') || ''
      ).toString().toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return items;
  }, [rawTags, search, sortBy, sortDir]);

  const handleSort = (c) => {
    if (sortBy === c) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(c); setSortDir('asc'); }
  };

  const exportCsv = () => {
    const headers = ['Key', 'Value', 'Resource Type', 'Resource ID'];
    const rows = tags.map((t) => [
      t.key || t.tagKey || '',
      t.value || t.tagValue || '',
      t.resourceType || '',
      t.resourceId || '',
    ]);
    const csv = [
      headers.join(','),
      ...rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'greenlake_tags.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const invalidateTags = () => queryClient.invalidateQueries({ queryKey: ['gl-tags'] });

  const handleCreate = async () => {
    setMutationLoading(true);
    setMutationError('');
    setSuccess('');
    try {
      await apiClient.post('/greenlake/tags', formData);
      setSuccess('Tag created successfully');
      setCreateOpen(false);
      setFormData({ id: '', key: '', value: '', resourceType: '', resourceId: '' });
      invalidateTags();
    } catch (e) {
      setMutationError(e.response?.data?.error || 'Failed to create tag');
    } finally {
      setMutationLoading(false);
    }
  };

  const handleUpdate = async () => {
    setMutationLoading(true);
    setMutationError('');
    setSuccess('');
    try {
      await apiClient.patch(`/greenlake/tags/${formData.id}`, formData);
      setSuccess('Tag updated successfully');
      setEditOpen(false);
      setFormData({ id: '', key: '', value: '', resourceType: '', resourceId: '' });
      invalidateTags();
    } catch (e) {
      setMutationError(e.response?.data?.error || 'Failed to update tag');
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDelete = async (tagId) => {
    if (!window.confirm('Delete this tag?')) return;
    setMutationLoading(true);
    setMutationError('');
    setSuccess('');
    try {
      await apiClient.delete(`/greenlake/tags/${tagId}`);
      setSuccess('Tag deleted successfully');
      invalidateTags();
    } catch (e) {
      setMutationError(e.response?.data?.error || 'Failed to delete tag');
    } finally {
      setMutationLoading(false);
    }
  };

  const openEditDialog = (tag) => {
    setFormData({
      id: tag.id || tag.tagId,
      key: tag.key || tag.tagKey || '',
      value: tag.value || tag.tagValue || '',
      resourceType: tag.resourceType || '',
      resourceId: tag.resourceId || '',
    });
    setEditOpen(true);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Tags
          </Typography>
          <Typography variant="body2" color="text.secondary">
            GreenLake resource tags for organization and filtering
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Create Tag
          </Button>
          <Button startIcon={<DownloadIcon />} onClick={exportCsv} variant="outlined">
            Export CSV
          </Button>
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={() => refetch()} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {notConfigured && <GreenLakeNotConfigured />}

      {!notConfigured && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <TextField
              size="small"
              placeholder="Search tags by key, value, or resource..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>
      )}

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

      {!notConfigured && (
        <Card>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleSort('key')} sx={{ cursor: 'pointer' }}>
                      Key {sortBy === 'key' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                    </TableCell>
                    <TableCell onClick={() => handleSort('value')} sx={{ cursor: 'pointer' }}>
                      Value {sortBy === 'value' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                    </TableCell>
                    <TableCell onClick={() => handleSort('type')} sx={{ cursor: 'pointer' }}>
                      Resource Type {sortBy === 'type' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                    </TableCell>
                    <TableCell onClick={() => handleSort('rid')} sx={{ cursor: 'pointer' }}>
                      Resource ID {sortBy === 'rid' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {queryLoading && [...Array(4)].map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell align="right"><Skeleton width={56} /></TableCell>
                    </TableRow>
                  ))}
                  {!queryLoading && tags.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <LocalOfferIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.08)', mb: 1.5 }} />
                        <Typography variant="body2" color="text.secondary" display="block">
                          No tags found
                        </Typography>
                        <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                          Create your first tag to organize GreenLake resources
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tags.map((tag) => {
                      const tagId = tag.id || tag.tagId;
                      return (
                        <TableRow key={tagId || `${tag.key}-${tag.value}`}>
                          <TableCell>{tag.key || tag.tagKey || '-'}</TableCell>
                          <TableCell>{tag.value || tag.tagValue || '-'}</TableCell>
                          <TableCell>{tag.resourceType || '-'}</TableCell>
                          <TableCell>{tag.resourceId || '-'}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => openEditDialog(tag)}
                                  disabled={loading}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(tagId)}
                                  disabled={loading}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
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
      )}

      {/* Create Tag Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Tag</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Tag Key"
              fullWidth
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              required
            />
            <TextField
              label="Tag Value"
              fullWidth
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              required
            />
            <TextField
              label="Resource Type"
              fullWidth
              value={formData.resourceType}
              onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
              placeholder="e.g., device, subscription, workspace"
            />
            <TextField
              label="Resource ID"
              fullWidth
              value={formData.resourceId}
              onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
              placeholder="Optional resource identifier"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!formData.key || !formData.value || loading}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Tag</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label="Tag ID" fullWidth value={formData.id} disabled />
            <TextField
              label="Tag Key"
              fullWidth
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              required
            />
            <TextField
              label="Tag Value"
              fullWidth
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              required
            />
            <TextField
              label="Resource Type"
              fullWidth
              value={formData.resourceType}
              onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
            />
            <TextField
              label="Resource ID"
              fullWidth
              value={formData.resourceId}
              onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={!formData.key || !formData.value || loading}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GLTagsPage;
