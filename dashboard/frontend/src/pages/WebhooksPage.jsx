/**
 * Webhook Management Page
 * Create, view, update, and delete Aruba Central webhooks
 */

import { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Key as KeyIcon,
  Webhook as WebhookIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { webhookAPI } from '../services/api';

const EMPTY_FORM = { name: '', url: '', secret: '' };

function WebhooksPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [webhooks, setWebhooks] = useState([]);
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'create', webhook: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, webhook: null });
  const [deleting, setDeleting] = useState(false);
  const [rotateDialog, setRotateDialog] = useState({ open: false, webhook: null });
  const [rotating, setRotating] = useState(false);
  const [rotatedKey, setRotatedKey] = useState('');
  const [snack, setSnack] = useState('');

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await webhookAPI.list();
      setWebhooks(data?.webhooks || data?.items || []);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormDialog({ open: true, mode: 'create', webhook: null });
  };

  const openEdit = (webhook) => {
    const existingUrl = webhook.url || (Array.isArray(webhook.urls) ? webhook.urls[0] : webhook.urls) || '';
    setForm({ name: webhook.name || '', url: existingUrl, secret: '' });
    setFormDialog({ open: true, mode: 'edit', webhook });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.url.trim()) return;
    setSaving(true);
    try {
      // Aruba Central webhooks API accepts urls as an array
      const payload = { name: form.name, urls: [form.url], url: form.url };
      if (form.secret) payload.secret = form.secret;
      if (formDialog.mode === 'create') {
        await webhookAPI.create(payload);
        setSnack('Webhook created');
      } else {
        await webhookAPI.update(formDialog.webhook.id, payload);
        setSnack('Webhook updated');
      }
      setFormDialog({ open: false, mode: 'create', webhook: null });
      await fetchWebhooks();
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Save failed');
      setFormDialog({ open: false, mode: 'create', webhook: null });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.webhook) return;
    setDeleting(true);
    try {
      await webhookAPI.delete(deleteDialog.webhook.id);
      setSnack('Webhook deleted');
      setDeleteDialog({ open: false, webhook: null });
      await fetchWebhooks();
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Delete failed');
      setDeleteDialog({ open: false, webhook: null });
    } finally {
      setDeleting(false);
    }
  };

  const handleRotate = async () => {
    if (!rotateDialog.webhook) return;
    setRotating(true);
    setRotatedKey('');
    try {
      const res = await webhookAPI.rotateKey(rotateDialog.webhook.id);
      setRotatedKey(res?.secret || res?.key || JSON.stringify(res));
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Key rotation failed');
      setRotateDialog({ open: false, webhook: null });
    } finally {
      setRotating(false);
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
            Webhooks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage Aruba Central event push subscriptions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<RefreshIcon />} onClick={fetchWebhooks} variant="outlined" size="small">
            Refresh
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={openCreate}
            variant="contained"
            size="small"
            sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#E55500' } }}
          >
            Add Webhook
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Summary Card */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Configured Webhooks
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF6600' }}>
                    {webhooks.length}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(255,102,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <WebhookIcon sx={{ fontSize: 20, color: '#FF6600' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Webhooks Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell sx={{ width: 120 }}>Status</TableCell>
                  <TableCell sx={{ width: 140 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {webhooks.length > 0 ? (
                  webhooks.map((wh, idx) => (
                    <TableRow key={wh.id || idx} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {wh.name || wh.id || 'Unnamed'}
                        </Typography>
                        {wh.id && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                            {wh.id}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.82rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {wh.url || (Array.isArray(wh.urls) ? wh.urls[0] : wh.urls) || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={wh.status || wh.state || 'Active'}
                          color={wh.status === 'inactive' ? 'default' : 'success'}
                          variant="outlined"
                          sx={{ fontSize: '0.68rem', height: 20, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="Edit webhook">
                            <IconButton size="small" onClick={() => openEdit(wh)} sx={{ color: 'text.secondary', '&:hover': { color: '#FF6600' } }}>
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Rotate secret key">
                            <IconButton
                              size="small"
                              onClick={() => { setRotateDialog({ open: true, webhook: wh }); setRotatedKey(''); }}
                              sx={{ color: 'text.secondary', '&:hover': { color: '#3B82F6' } }}
                            >
                              <KeyIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete webhook">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteDialog({ open: true, webhook: wh })}
                              sx={{ color: 'text.secondary', '&:hover': { color: '#EF4444' } }}
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <WebhookIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.08)', mb: 1.5 }} />
                      <Typography variant="body2" color="text.secondary" display="block">
                        No webhooks configured
                      </Typography>
                      <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                        Click "Add Webhook" to receive Aruba Central push events
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, mode: 'create', webhook: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{formDialog.mode === 'create' ? 'Add Webhook' : 'Edit Webhook'}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              size="small"
              fullWidth
              placeholder="e.g., My Alert Receiver"
            />
            <TextField
              label="URL"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              size="small"
              fullWidth
              placeholder="https://your-server.com/webhook"
            />
            <TextField
              label="Secret (optional)"
              value={form.secret}
              onChange={(e) => setForm({ ...form, secret: e.target.value })}
              size="small"
              fullWidth
              type="password"
              placeholder="Leave blank to keep existing"
              helperText="Used for HMAC-SHA256 signature verification"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialog({ open: false, mode: 'create', webhook: null })} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !form.name.trim() || !form.url.trim()}
            sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#E55500' } }}
          >
            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : formDialog.mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, webhook: null })} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Webhook</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete webhook <strong>{deleteDialog.webhook?.name || deleteDialog.webhook?.id}</strong>? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, webhook: null })} disabled={deleting}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rotate Key Dialog */}
      <Dialog open={rotateDialog.open} onClose={() => { setRotateDialog({ open: false, webhook: null }); setRotatedKey(''); }} maxWidth="sm" fullWidth>
        <DialogTitle>Rotate Webhook Key</DialogTitle>
        <DialogContent>
          {!rotatedKey ? (
            <DialogContentText>
              Rotate the secret key for <strong>{rotateDialog.webhook?.name}</strong>? You will need to update your receiver with the new key immediately.
            </DialogContentText>
          ) : (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>Copy this key now — it will not be shown again.</Alert>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: '#0A0E1A', borderRadius: 1, border: '1px solid rgba(255,255,255,0.07)' }}>
                <Typography sx={{ fontFamily: 'monospace', fontSize: '0.8rem', flex: 1, wordBreak: 'break-all' }}>
                  {rotatedKey}
                </Typography>
                <Tooltip title="Copy">
                  <IconButton size="small" onClick={() => navigator.clipboard.writeText(rotatedKey)} sx={{ color: 'text.secondary' }}>
                    <CopyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {!rotatedKey ? (
            <>
              <Button onClick={() => setRotateDialog({ open: false, webhook: null })} disabled={rotating}>Cancel</Button>
              <Button onClick={handleRotate} variant="contained" color="warning" disabled={rotating}>
                {rotating ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Rotate Key'}
              </Button>
            </>
          ) : (
            <Button onClick={() => { setRotateDialog({ open: false, webhook: null }); setRotatedKey(''); }} variant="contained">
              Done
            </Button>
          )}
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

export default WebhooksPage;
