import { useMemo, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Alert, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, Pagination, Button, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, InputAdornment, Checkbox,
  FormGroup, FormControlLabel, Skeleton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import apiClient from '../services/api';
import GreenLakeNotConfigured, { isGLNotConfiguredError } from '../components/GreenLakeNotConfigured';
import { useGLLocations } from '../hooks/useApiQueries';
import { useQueryClient } from '@tanstack/react-query';

function GLLocationsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', addressLine1: '', city: '', countryCode: '' });
  const [visibleCols, setVisibleCols] = useState({ name: true, city: true, country: true, id: true, address: true });
  const [showCols, setShowCols] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [mutationError, setMutationError] = useState('');

  const {
    data,
    error: queryError,
    isLoading: loading,
  } = useGLLocations({ page, limit });

  const notConfigured = queryError ? isGLNotConfiguredError(queryError) : false;
  const error = mutationError || (queryError && !notConfigured
    ? (queryError.response?.data?.error || 'Failed to load locations')
    : '');

  const total = data?.total || 0;

  const locations = useMemo(() => {
    let items = data?.items || data?.locations || [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((l) =>
        (l.name || '').toLowerCase().includes(q) ||
        (l.addressLine1 || l.address1 || '').toLowerCase().includes(q) ||
        (l.city || '').toLowerCase().includes(q) ||
        (l.country || '').toLowerCase().includes(q)
      );
    }
    return [...items].sort((a, b) => {
      const av = ((
        sortBy === 'name'    ? a.name :
        sortBy === 'city'    ? a.city :
        sortBy === 'country' ? a.country :
        sortBy === 'id'      ? a.id : ''
      ) || '').toString().toLowerCase();
      const bv = ((
        sortBy === 'name'    ? b.name :
        sortBy === 'city'    ? b.city :
        sortBy === 'country' ? b.country :
        sortBy === 'id'      ? b.id : ''
      ) || '').toString().toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, search, sortBy, sortDir]);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('asc'); }
  };

  const exportCsv = () => {
    const headers = ['ID', 'Name', 'Address', 'City', 'Country'];
    const exportData = selected.size ? locations.filter((l) => selected.has(l.id)) : locations;
    const rows = exportData.map((l) => [l.id, l.name || '', l.addressLine1 || l.address1 || '', l.city || '', l.country || '']);
    const csv = [headers.join(','), ...rows.map((r) => r.map((x) => `"${String(x || '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'greenlake_locations.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const invalidateLocations = () => queryClient.invalidateQueries({ queryKey: ['gl-locations'] });

  const submitAdd = async () => {
    setMutationError('');
    try {
      await apiClient.post('/greenlake/locations', {
        name: form.name,
        address: { addressLine1: form.addressLine1, city: form.city, countryCode: form.countryCode },
      });
      setAddOpen(false);
      setForm({ id: '', name: '', addressLine1: '', city: '', countryCode: '' });
      invalidateLocations();
    } catch (e) {
      setMutationError(e.response?.data?.error || 'Failed to add location');
    }
  };

  const submitEdit = async () => {
    setMutationError('');
    try {
      await apiClient.patch(`/greenlake/locations/${form.id}`, {
        name: form.name,
        address: { addressLine1: form.addressLine1, city: form.city, countryCode: form.countryCode },
      });
      setEditOpen(false);
      setForm({ id: '', name: '', addressLine1: '', city: '', countryCode: '' });
      invalidateLocations();
    } catch (e) {
      setMutationError(e.response?.data?.error || 'Failed to update location');
    }
  };

  const submitDelete = async () => {
    setMutationError('');
    try {
      await apiClient.delete(`/greenlake/locations/${form.id}`);
      setEditOpen(false);
      setForm({ id: '', name: '', addressLine1: '', city: '', countryCode: '' });
      invalidateLocations();
    } catch (e) {
      setMutationError(e.response?.data?.error || 'Failed to delete location');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 1, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Locations</Typography>
          <Typography variant="body2" color="text.secondary">GreenLake Platform location management</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search locations"
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
          <Button startIcon={<AddIcon />} onClick={() => setAddOpen(true)} variant="contained">Add</Button>
          <Button startIcon={<EditIcon />} onClick={() => setEditOpen(true)} variant="outlined">Edit</Button>
          <Button onClick={() => setShowCols((v) => !v)} variant="outlined">Columns</Button>
        </Box>
      </Box>

      {showCols && (
        <Box sx={{ mb: 1 }}>
          <FormGroup row>
            <FormControlLabel control={<Checkbox checked={visibleCols.name} onChange={(e) => setVisibleCols({ ...visibleCols, name: e.target.checked })} />} label="Name" />
            <FormControlLabel control={<Checkbox checked={visibleCols.city} onChange={(e) => setVisibleCols({ ...visibleCols, city: e.target.checked })} />} label="City" />
            <FormControlLabel control={<Checkbox checked={visibleCols.country} onChange={(e) => setVisibleCols({ ...visibleCols, country: e.target.checked })} />} label="Country" />
            <FormControlLabel control={<Checkbox checked={visibleCols.id} onChange={(e) => setVisibleCols({ ...visibleCols, id: e.target.checked })} />} label="ID" />
            <FormControlLabel control={<Checkbox checked={visibleCols.address} onChange={(e) => setVisibleCols({ ...visibleCols, address: e.target.checked })} />} label="Address" />
          </FormGroup>
        </Box>
      )}

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
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selected.size > 0 && selected.size < locations.length}
                        checked={locations.length > 0 && selected.size === locations.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelected(new Set(locations.map((l) => l.id)));
                          else setSelected(new Set());
                        }}
                      />
                    </TableCell>
                    {visibleCols.name    && <TableCell onClick={() => handleSort('name')}    sx={{ cursor: 'pointer' }}>Name    {sortBy === 'name'    ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>}
                    {visibleCols.city    && <TableCell onClick={() => handleSort('city')}    sx={{ cursor: 'pointer' }}>City    {sortBy === 'city'    ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>}
                    {visibleCols.country && <TableCell onClick={() => handleSort('country')} sx={{ cursor: 'pointer' }}>Country {sortBy === 'country' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>}
                    {visibleCols.id      && <TableCell onClick={() => handleSort('id')}      sx={{ cursor: 'pointer' }}>ID      {sortBy === 'id'      ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>}
                    {visibleCols.address && <TableCell>Address</TableCell>}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && [...Array(5)].map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell padding="checkbox"><Skeleton variant="rectangular" width={18} height={18} /></TableCell>
                      {visibleCols.name    && <TableCell><Skeleton /></TableCell>}
                      {visibleCols.city    && <TableCell><Skeleton width={80} /></TableCell>}
                      {visibleCols.country && <TableCell><Skeleton width={50} /></TableCell>}
                      {visibleCols.id      && <TableCell><Skeleton /></TableCell>}
                      {visibleCols.address && <TableCell><Skeleton /></TableCell>}
                      <TableCell><Skeleton width={36} /></TableCell>
                    </TableRow>
                  ))}
                  {locations.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <LocationOnIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.08)', mb: 1.5 }} />
                        <Typography variant="body2" color="text.secondary" display="block">
                          No locations found
                        </Typography>
                        <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                          Add locations to organize your GreenLake resources
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {locations.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.has(l.id)}
                          onChange={(e) => {
                            const s = new Set(selected);
                            if (e.target.checked) s.add(l.id); else s.delete(l.id);
                            setSelected(s);
                          }}
                        />
                      </TableCell>
                      {visibleCols.name    && <TableCell>{l.name || '-'}</TableCell>}
                      {visibleCols.city    && <TableCell>{l.city || '-'}</TableCell>}
                      {visibleCols.country && <TableCell>{l.country || '-'}</TableCell>}
                      {visibleCols.id      && <TableCell>{l.id}</TableCell>}
                      {visibleCols.address && <TableCell>{l.addressLine1 || l.address1 || '-'}</TableCell>}
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => {
                            setForm({ id: l.id, name: l.name || '', addressLine1: l.addressLine1 || l.address1 || '', city: l.city || '', countryCode: l.country || '' });
                            setEditOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
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
        <DialogTitle>Add Location</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Address" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
          <TextField label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <TextField label="Country Code (ISO2)" value={form.countryCode} onChange={(e) => setForm({ ...form, countryCode: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={submitAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit/Delete Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit/Delete Location</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField label="ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} helperText="Enter existing location ID" />
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Address" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
          <TextField label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <TextField label="Country Code (ISO2)" value={form.countryCode} onChange={(e) => setForm({ ...form, countryCode: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Close</Button>
          <Button onClick={submitEdit}>Update</Button>
          <Button color="error" onClick={submitDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GLLocationsPage;
