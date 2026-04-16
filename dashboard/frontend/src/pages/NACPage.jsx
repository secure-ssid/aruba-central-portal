/**
 * NAC (Network Access Control) Page
 * MAC registration management — list, add, delete
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  PhoneAndroid as MacIcon,
  CheckCircle as EnabledIcon,
  Cancel as DisabledIcon,
} from '@mui/icons-material';
import { nacAPI } from '../services/api';

const EMPTY_FORM = { macAddress: '', displayName: '', enable: true };

function NACPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [addDialog, setAddDialog] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, reg: null });
  const [deleting, setDeleting] = useState(false);
  const [snack, setSnack] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await nacAPI.getMacRegistrations({ limit: 100 });
      setRegistrations(data?.items || data?.registrations || []);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to load MAC registrations');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return registrations;
    const q = search.toLowerCase();
    return registrations.filter(
      (r) =>
        r.macAddress?.toLowerCase().includes(q) ||
        r.displayName?.toLowerCase().includes(q) ||
        r.id?.toLowerCase().includes(q)
    );
  }, [registrations, search]);

  const handleAdd = async () => {
    if (!form.macAddress.trim()) return;
    setSaving(true);
    try {
      await nacAPI.addMacRegistration({
        macAddress: form.macAddress.trim(),
        displayName: form.displayName.trim() || undefined,
        enable: form.enable,
      });
      setSnack('MAC registration added');
      setAddDialog(false);
      setForm(EMPTY_FORM);
      await fetchRegistrations();
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to add registration');
      setAddDialog(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.reg) return;
    setDeleting(true);
    try {
      await nacAPI.deleteMacRegistration(deleteDialog.reg.id);
      setSnack('MAC registration deleted');
      setDeleteDialog({ open: false, reg: null });
      await fetchRegistrations();
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to delete registration');
      setDeleteDialog({ open: false, reg: null });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={28} sx={{ color: '#FF6600' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Network Access Control
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage MAC address registrations for network access
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<RefreshIcon />} onClick={fetchRegistrations} variant="outlined" size="small">
            Refresh
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={() => { setForm(EMPTY_FORM); setAddDialog(true); }}
            variant="contained"
            size="small"
            sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#E55500' } }}
          >
            Add MAC
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Total Registrations
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF6600' }}>
                    {registrations.length}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(255,102,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MacIcon sx={{ fontSize: 20, color: '#FF6600' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Enabled
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#22C55E' }}>
                    {registrations.filter((r) => r.enable !== false).length}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <EnabledIcon sx={{ fontSize: 20, color: '#22C55E' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Auto-Created
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {registrations.filter((r) => r.autoCreated).length}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MacIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search + Table */}
      <Card>
        <CardContent sx={{ p: 2, pb: '8px !important' }}>
          <TextField
            size="small"
            placeholder="Search by MAC, name, or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 0, width: 320 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>MAC Address</TableCell>
                  <TableCell>Display Name</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell sx={{ width: 100 }}>Status</TableCell>
                  <TableCell sx={{ width: 80 }}>Source</TableCell>
                  <TableCell sx={{ width: 60 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((reg, idx) => (
                    <TableRow key={reg.id || idx} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '0.82rem' }}>
                          {reg.macAddress || 'N/A'}
                        </Typography>
                        {reg.id && (
                          <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace', fontSize: '0.68rem' }}>
                            {reg.id}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={reg.displayName ? 'text.primary' : 'text.disabled'}>
                          {reg.displayName || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {reg.staticTags && reg.staticTags.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {reg.staticTags.slice(0, 3).map((tag, ti) => (
                              <Chip key={ti} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                            ))}
                            {reg.staticTags.length > 3 && (
                              <Chip label={`+${reg.staticTags.length - 3}`} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
                            )}
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.disabled">—</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={reg.enable !== false ? 'Enabled' : 'Disabled'}
                          color={reg.enable !== false ? 'success' : 'default'}
                          variant="outlined"
                          sx={{ fontSize: '0.68rem', height: 20, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {reg.autoCreated ? 'Auto' : 'Manual'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Delete registration">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteDialog({ open: true, reg })}
                            sx={{ color: 'text.secondary', '&:hover': { color: '#EF4444' } }}
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <MacIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.08)', mb: 1.5 }} />
                      <Typography variant="body2" color="text.secondary" display="block">
                        {search ? 'No registrations match your search' : 'No MAC registrations found'}
                      </Typography>
                      {!search && (
                        <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                          Click "Add MAC" to register a device
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add MAC Registration</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="MAC Address"
              value={form.macAddress}
              onChange={(e) => setForm({ ...form, macAddress: e.target.value })}
              size="small"
              fullWidth
              placeholder="e.g., AA:BB:CC:DD:EE:FF"
              helperText="Colon- or hyphen-separated MAC address"
            />
            <TextField
              label="Display Name (optional)"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              size="small"
              fullWidth
              placeholder="e.g., Printer-Floor2"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog(false)} disabled={saving}>Cancel</Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            disabled={saving || !form.macAddress.trim()}
            sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#E55500' } }}
          >
            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, reg: null })} maxWidth="xs" fullWidth>
        <DialogTitle>Delete MAC Registration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove registration for{' '}
            <strong>{deleteDialog.reg?.macAddress}</strong>
            {deleteDialog.reg?.displayName ? ` (${deleteDialog.reg.displayName})` : ''}? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, reg: null })} disabled={deleting}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack('')}
        message={snack}
      />
    </Box>
  );
}

export default NACPage;
