import { useMemo, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Alert, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, Pagination, Button, TextField, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Skeleton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import apiClient from '../services/api';
import GreenLakeNotConfigured, { isGLNotConfiguredError } from '../components/GreenLakeNotConfigured';
import StatusChip from '../components/StatusChip';
import { useGLSubscriptions } from '../hooks/useApiQueries';
import { useQueryClient } from '@tanstack/react-query';

function GLSubscriptionsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [sortBy, setSortBy] = useState('type');
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ id: '', type: '', status: '', startDate: '', endDate: '' });
  const [mutationError, setMutationError] = useState('');

  const {
    data,
    error: queryError,
    isLoading: loading,
  } = useGLSubscriptions({ page, limit });

  const notConfigured = queryError ? isGLNotConfiguredError(queryError) : false;
  const error = mutationError || (queryError && !notConfigured
    ? (queryError.response?.data?.error || 'Failed to load subscriptions')
    : '');

  const total = data?.total || 0;

  const subs = useMemo(() => {
    let items = data?.items || data?.subscriptions || [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((s) =>
        (s.type || s.subscriptionType || '').toLowerCase().includes(q) ||
        (s.status || '').toLowerCase().includes(q) ||
        (s.id || '').toLowerCase().includes(q)
      );
    }
    return [...items].sort((a, b) => {
      const av = ((
        sortBy === 'type'   ? (a.type || a.subscriptionType) :
        sortBy === 'status' ? a.status :
        sortBy === 'id'     ? a.id :
        sortBy === 'start'  ? a.startDate :
        sortBy === 'end'    ? a.endDate : ''
      ) || '').toString().toLowerCase();
      const bv = ((
        sortBy === 'type'   ? (b.type || b.subscriptionType) :
        sortBy === 'status' ? b.status :
        sortBy === 'id'     ? b.id :
        sortBy === 'start'  ? b.startDate :
        sortBy === 'end'    ? b.endDate : ''
      ) || '').toString().toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, search, sortBy, sortDir]);

  const handleSort = (c) => {
    if (sortBy === c) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(c); setSortDir('asc'); }
  };

  const exportCsv = () => {
    const headers = ['ID', 'Type', 'Status', 'Start', 'End'];
    const rows = subs.map((s) => [s.id, s.type || s.subscriptionType || '', s.status || '', s.startDate || '', s.endDate || '']);
    const csv = [headers.join(','), ...rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'greenlake_subscriptions.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const invalidateSubs = () => queryClient.invalidateQueries({ queryKey: ['gl-subscriptions'] });

  const submitAdd = async () => {
    setMutationError('');
    try {
      await apiClient.post('/greenlake/subscriptions', { type: form.type, status: form.status, startDate: form.startDate, endDate: form.endDate });
      setAddOpen(false);
      setForm({ id: '', type: '', status: '', startDate: '', endDate: '' });
      invalidateSubs();
    } catch (e) {
      setMutationError(e.response?.data?.error || 'Failed to add subscription');
    }
  };

  const submitEdit = async () => {
    setMutationError('');
    try {
      await apiClient.patch(`/greenlake/subscriptions/${form.id}`, { type: form.type, status: form.status, startDate: form.startDate, endDate: form.endDate });
      setEditOpen(false);
      setForm({ id: '', type: '', status: '', startDate: '', endDate: '' });
      invalidateSubs();
    } catch (e) {
      setMutationError(e.response?.data?.error || 'Failed to update subscription');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 1, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Subscriptions</Typography>
          <Typography variant="body2" color="text.secondary">GreenLake Platform subscription management</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search subscriptions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button startIcon={<DownloadIcon />} onClick={exportCsv} variant="outlined">Export CSV</Button>
          <Button onClick={() => setAddOpen(true)} variant="contained">Add</Button>
          <Button onClick={() => setEditOpen(true)} variant="outlined">Edit</Button>
        </Box>
      </Box>

      {notConfigured && <GreenLakeNotConfigured />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setMutationError('')}>
          {error}
        </Alert>
      )}

      {!notConfigured && (
        <Card>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleSort('type')}   sx={{ cursor: 'pointer' }}>Type   {sortBy === 'type'   ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>
                    <TableCell onClick={() => handleSort('status')} sx={{ cursor: 'pointer' }}>Status {sortBy === 'status' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>
                    <TableCell onClick={() => handleSort('start')}  sx={{ cursor: 'pointer' }}>Start  {sortBy === 'start'  ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>
                    <TableCell onClick={() => handleSort('end')}    sx={{ cursor: 'pointer' }}>End    {sortBy === 'end'    ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>
                    <TableCell onClick={() => handleSort('id')}     sx={{ cursor: 'pointer' }}>ID     {sortBy === 'id'     ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && [...Array(5)].map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton width={70} /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))}
                  {subs.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <AssessmentIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.08)', mb: 1.5 }} />
                        <Typography variant="body2" color="text.secondary" display="block">
                          No subscriptions found
                        </Typography>
                        <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                          GreenLake subscriptions will appear here
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {subs.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.type || s.subscriptionType || '-'}</TableCell>
                      <TableCell>{s.status ? <StatusChip status={s.status} /> : '-'}</TableCell>
                      <TableCell>{s.startDate || '-'}</TableCell>
                      <TableCell>{s.endDate || '-'}</TableCell>
                      <TableCell>{s.id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Pagination
                count={Math.max(1, Math.ceil(total / limit))}
                page={page}
                onChange={(_, p) => setPage(p)}
                size="small"
                color="primary"
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Subscription</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <TextField label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          <TextField label="Start Date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="YYYY-MM-DD" />
          <TextField label="End Date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} placeholder="YYYY-MM-DD" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={submitAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Subscription</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField label="ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} helperText="Enter existing subscription ID" />
          <TextField label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <TextField label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          <TextField label="Start Date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="YYYY-MM-DD" />
          <TextField label="End Date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} placeholder="YYYY-MM-DD" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Close</Button>
          <Button onClick={submitEdit} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GLSubscriptionsPage;
