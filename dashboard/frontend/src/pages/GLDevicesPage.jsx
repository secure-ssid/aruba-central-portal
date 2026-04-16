import { useMemo, useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Alert, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, Pagination, Button, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, InputAdornment, Checkbox,
  FormGroup, FormControlLabel, Skeleton, Chip, LinearProgress,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import DevicesIcon from '@mui/icons-material/Devices';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import apiClient from '../services/api';
import GreenLakeNotConfigured, { isGLNotConfiguredError } from '../components/GreenLakeNotConfigured';
import StatusChip from '../components/StatusChip';
import { useGLDevices } from '../hooks/useApiQueries';
import { useQueryClient } from '@tanstack/react-query';

// ─── CSV helpers ─────────────────────────────────────────────────────────────
// Format matches the official HPE GreenLake device import template:
//   Serial_No, MAC_Address, tag:<name>…, Location_Name (Optional), Contact_Id

const FIXED_COLUMNS = [
  { key: 'serial_no',      label: 'Serial_No',                  required: true  },
  { key: 'mac_address',    label: 'MAC_Address',                required: false },
  { key: 'location_name',  label: 'Location_Name (Optional)',   required: false },
  { key: 'contact_id',     label: 'Contact_Id',                 required: false },
];

// Split a CSV line respecting quoted fields
function splitCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuote = !inQuote; }
    else if (ch === ',' && !inQuote) { result.push(cur); cur = ''; }
    else { cur += ch; }
  }
  result.push(cur);
  return result.map((c) => c.trim());
}

function parseCsv(text) {
  // Strip UTF-8 BOM if present
  const clean = text.replace(/^\uFEFF/, '');
  const lines = clean.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const rawHeaders = splitCsvLine(lines[0]);
  const headers = rawHeaders.map((h) => h.trim().replace(/^"|"$/g, ''));

  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const rowRaw = {};
    headers.forEach((h, i) => { rowRaw[h] = cols[i] ?? ''; });

    const serialNo    = rowRaw['Serial_No']   || rowRaw['serial_no']   || rowRaw['Serial No'] || '';
    const macAddress  = rowRaw['MAC_Address'] || rowRaw['mac_address'] || rowRaw['Mac Address'] || '';
    const locationName = rowRaw['Location_Name (Optional)'] || rowRaw['location_name'] || rowRaw['Location_Name'] || '';
    const contactId   = rowRaw['Contact_Id']  || rowRaw['contact_id']  || '';

    // Collect all tag:* columns
    const tags = [];
    headers.forEach((h) => {
      if (h.startsWith('tag:')) {
        const val = rowRaw[h];
        if (val && val !== '<blank>') {
          tags.push({ name: h.slice(4), value: val });
        }
      }
    });

    return { serialNumber: serialNo, macAddress, locationName, contactId, tags };
  }).filter((r) => r.serialNumber);
}

function generateTemplateCsv() {
  // BOM + exact GreenLake format
  const bom = '\uFEFF';
  const header = 'Serial_No,MAC_Address,tag:name1,tag:name2,Location_Name (Optional),Contact_Id';
  const row1   = '1ABC123CD4,11:22:33:44:AA:BB,value1,,Tottenham,user@hpe.com';
  const row2   = '5EFG678HI9,44:33:22:11:BB:AA,,value2,,user@hpe.com';
  return bom + [header, row1, row2].join('\n');
}

// ─── Bulk Import Dialog ───────────────────────────────────────────────────────

function BulkImportDialog({ open, onClose, onSuccess }) {
  const [dragOver, setDragOver]     = useState(false);
  const [parsed, setParsed]         = useState(null);
  const [fileName, setFileName]     = useState('');
  const [importing, setImporting]   = useState(false);
  const [result, setResult]         = useState(null);
  const [parseError, setParseError] = useState('');
  const fileInputRef = useRef(null);

  const reset = () => {
    setParsed(null); setFileName(''); setResult(null); setParseError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const processFile = (file) => {
    if (!file) return;
    setParseError('');
    setResult(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const rows = parseCsv(e.target.result);
      if (rows.length === 0) {
        setParseError('No valid rows found. Make sure the CSV has a "Serial Number" column with data.');
        setParsed(null);
      } else {
        setParsed(rows);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) processFile(file);
    else setParseError('Please drop a .csv file.');
  };

  const handleFileInput = (e) => {
    processFile(e.target.files[0]);
    e.target.value = '';
  };

  const downloadTemplate = () => {
    const csv = generateTemplateCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'device_import_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!parsed || parsed.length === 0) return;
    setImporting(true);
    setResult(null);
    try {
      const res = await apiClient.post('/greenlake/devices/bulk', parsed);
      setResult(res.data);
      if (res.data.success > 0) onSuccess();
    } catch (e) {
      setResult({ success: 0, failed: parsed.length, errors: [{ serial: 'all', error: e.response?.data?.error || e.message }] });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <UploadFileIcon sx={{ color: 'var(--color-primary)' }} />
        Bulk Device Import
      </DialogTitle>
      <DialogContent>
        {/* Drop zone */}
        {!parsed && (
          <Box
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: `2px dashed ${dragOver ? 'var(--color-primary)' : 'var(--border-default)'}`,
              borderRadius: 2,
              py: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              cursor: 'pointer',
              bgcolor: dragOver ? 'rgba(255,102,0,0.04)' : 'transparent',
              transition: 'all 0.2s',
              '&:hover': { borderColor: 'var(--color-primary)', bgcolor: 'rgba(255,102,0,0.04)' },
              mb: 2,
            }}
          >
            <input ref={fileInputRef} type="file" accept=".csv" hidden onChange={handleFileInput} />
            <CloudUploadIcon sx={{ fontSize: 40, color: dragOver ? 'var(--color-primary)' : 'text.disabled' }} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: dragOver ? 'var(--color-primary)' : 'text.secondary' }}>
              Drop an existing CSV file here
            </Typography>
            <Typography variant="caption" color="text.disabled">
              or click to browse — .csv files only
            </Typography>
          </Box>
        )}

        {fileName && parsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <InsertDriveFileIcon sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{fileName}</Typography>
            <Chip label={`${parsed.length} row${parsed.length !== 1 ? 's' : ''}`} size="small" color="primary" variant="outlined" />
            <Button size="small" onClick={reset} sx={{ ml: 'auto' }}>Change file</Button>
          </Box>
        )}

        {parseError && <Alert severity="error" sx={{ mb: 2 }}>{parseError}</Alert>}

        {/* Expected format */}
        {!parsed && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Expected File Format
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {FIXED_COLUMNS.map((c) => (
                      <TableCell key={c.key} sx={{ fontWeight: 700, bgcolor: 'rgba(255,102,0,0.06)', whiteSpace: 'nowrap' }}>
                        {c.label}
                        {c.required && <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Typography>}
                      </TableCell>
                    ))}
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'rgba(255,102,0,0.06)', color: 'text.secondary' }}>tag:name1</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'rgba(255,102,0,0.06)', color: 'text.secondary' }}>tag:name2 …</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>1ABC123CD4</TableCell>
                    <TableCell>11:22:33:44:AA:BB</TableCell>
                    <TableCell>Tottenham</TableCell>
                    <TableCell>user@hpe.com</TableCell>
                    <TableCell>value1</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>5EFG678HI9</TableCell>
                    <TableCell>44:33:22:11:BB:AA</TableCell>
                    <TableCell></TableCell>
                    <TableCell>user@hpe.com</TableCell>
                    <TableCell></TableCell>
                    <TableCell>value2</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 2 }}>
              Add as many <code>tag:&lt;name&gt;</code> columns as needed. Download the template for a ready-to-fill file.
            </Typography>
          </>
        )}

        {/* Preview parsed rows */}
        {parsed && parsed.length > 0 && !result && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Preview ({Math.min(parsed.length, 5)} of {parsed.length} rows)
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'rgba(255,102,0,0.06)' }}>Serial No</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'rgba(255,102,0,0.06)' }}>MAC Address</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'rgba(255,102,0,0.06)' }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'rgba(255,102,0,0.06)' }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'rgba(255,102,0,0.06)' }}>Tags</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parsed.slice(0, 5).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{row.serialNumber}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{row.macAddress || '—'}</TableCell>
                      <TableCell>{row.locationName || '—'}</TableCell>
                      <TableCell>{row.contactId || '—'}</TableCell>
                      <TableCell>
                        {row.tags?.length > 0
                          ? row.tags.map((t) => `${t.name}=${t.value}`).join(', ')
                          : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {parsed.length > 5 && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ color: 'text.disabled', fontStyle: 'italic', textAlign: 'center' }}>
                        …and {parsed.length - 5} more rows
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {importing && <LinearProgress sx={{ mb: 1 }} />}

        {/* Import result */}
        {result && (
          <Box sx={{ mb: 1 }}>
            {result.success > 0 && (
              <Alert severity="success" sx={{ mb: 1 }}>
                Successfully imported {result.success} device{result.success !== 1 ? 's' : ''}.
              </Alert>
            )}
            {result.failed > 0 && (
              <Alert severity="warning">
                {result.failed} device{result.failed !== 1 ? 's' : ''} failed to import.
                {result.errors?.length > 0 && (
                  <Box component="ul" sx={{ mt: 0.5, pl: 2, mb: 0 }}>
                    {result.errors.slice(0, 5).map((e, i) => (
                      <li key={i}><Typography variant="caption">{e.serial}: {e.error}</Typography></li>
                    ))}
                  </Box>
                )}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Button startIcon={<DownloadIcon />} onClick={downloadTemplate} size="small" variant="outlined">
          Download Template
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleClose}>Close</Button>
          {parsed && !result && (
            <Button
              variant="contained"
              onClick={handleImport}
              disabled={importing || parsed.length === 0}
              startIcon={importing ? null : <UploadFileIcon />}
            >
              {importing ? `Importing ${parsed.length} devices…` : `Import ${parsed.length} Device${parsed.length !== 1 ? 's' : ''}`}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function GLDevicesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [sortBy, setSortBy] = useState('model');
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [form, setForm] = useState({ serialNumber: '', model: '', deviceId: '' });
  const [visibleCols, setVisibleCols] = useState({ model: true, serial: true, id: true, status: true, apps: true });
  const [showCols, setShowCols] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [mutationError, setMutationError] = useState('');

  const {
    data,
    error: queryError,
    isLoading: loading,
    refetch,
  } = useGLDevices({ page, limit });

  const notConfigured = queryError ? isGLNotConfiguredError(queryError) : false;
  const error = mutationError || (queryError && !notConfigured
    ? (queryError.response?.data?.error || 'Failed to load devices')
    : '');

  const total = data?.total || 0;

  const devices = useMemo(() => {
    let items = data?.items || data?.devices || [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((d) =>
        (d.model || '').toLowerCase().includes(q) ||
        (d.serialNumber || d.serial || '').toLowerCase().includes(q) ||
        (d.id || d.deviceId || '').toLowerCase().includes(q)
      );
    }
    return [...items].sort((a, b) => {
      const av = ((
        sortBy === 'model'  ? a.model :
        sortBy === 'serial' ? (a.serialNumber || a.serial) :
        sortBy === 'id'     ? (a.id || a.deviceId) :
        sortBy === 'status' ? a.status : ''
      ) || '').toString().toLowerCase();
      const bv = ((
        sortBy === 'model'  ? b.model :
        sortBy === 'serial' ? (b.serialNumber || b.serial) :
        sortBy === 'id'     ? (b.id || b.deviceId) :
        sortBy === 'status' ? b.status : ''
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
    const headers = ['Model', 'Serial', 'Device ID', 'Status', 'Assigned Apps'];
    const exportData = selected.size ? devices.filter((d) => selected.has(d.id || d.deviceId)) : devices;
    const rows = exportData.map((d) => [
      d.model || '',
      d.serialNumber || d.serial || '',
      d.id || d.deviceId || '',
      d.status || '',
      Array.isArray(d.assignedApps) ? d.assignedApps.join(';') : '',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'greenlake_devices.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const invalidateDevices = () => queryClient.invalidateQueries({ queryKey: ['gl-devices'] });

  const submitAdd = async () => {
    setMutationError('');
    try {
      await apiClient.post('/greenlake/devices', form);
      setAddOpen(false);
      setForm({ serialNumber: '', model: '', deviceId: '' });
      invalidateDevices();
    } catch (e) {
      setMutationError(e.response?.data?.error || 'Failed to add device');
    }
  };

  const submitUpdate = async () => {
    setMutationError('');
    try {
      await apiClient.patch('/greenlake/devices', form);
      setEditOpen(false);
      setForm({ serialNumber: '', model: '', deviceId: '' });
      invalidateDevices();
    } catch (e) {
      setMutationError(e.response?.data?.error || 'Failed to update device');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 1, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Devices</Typography>
          <Typography variant="body2" color="text.secondary">GreenLake Platform device inventory</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search model, serial, id"
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
          <Button startIcon={<UploadFileIcon />} onClick={() => setBulkOpen(true)} variant="outlined">Bulk Import</Button>
          <Button startIcon={<AddIcon />} onClick={() => setAddOpen(true)} variant="contained">Add</Button>
          <Button startIcon={<EditIcon />} onClick={() => setEditOpen(true)} variant="outlined">Update</Button>
          <Button onClick={() => setShowCols((v) => !v)} variant="outlined">Columns</Button>
        </Box>
      </Box>

      {showCols && (
        <Box sx={{ mb: 1 }}>
          <FormGroup row>
            <FormControlLabel control={<Checkbox checked={visibleCols.model} onChange={(e) => setVisibleCols({ ...visibleCols, model: e.target.checked })} />} label="Model" />
            <FormControlLabel control={<Checkbox checked={visibleCols.serial} onChange={(e) => setVisibleCols({ ...visibleCols, serial: e.target.checked })} />} label="Serial" />
            <FormControlLabel control={<Checkbox checked={visibleCols.id} onChange={(e) => setVisibleCols({ ...visibleCols, id: e.target.checked })} />} label="Device ID" />
            <FormControlLabel control={<Checkbox checked={visibleCols.status} onChange={(e) => setVisibleCols({ ...visibleCols, status: e.target.checked })} />} label="Status" />
            <FormControlLabel control={<Checkbox checked={visibleCols.apps} onChange={(e) => setVisibleCols({ ...visibleCols, apps: e.target.checked })} />} label="Assigned Apps" />
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
                        indeterminate={selected.size > 0 && selected.size < devices.length}
                        checked={devices.length > 0 && selected.size === devices.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelected(new Set(devices.map((d) => d.id || d.deviceId)));
                          else setSelected(new Set());
                        }}
                      />
                    </TableCell>
                    {visibleCols.model  && <TableCell onClick={() => handleSort('model')}  sx={{ cursor: 'pointer' }}>Model  {sortBy === 'model'  ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>}
                    {visibleCols.serial && <TableCell onClick={() => handleSort('serial')} sx={{ cursor: 'pointer' }}>Serial {sortBy === 'serial' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>}
                    {visibleCols.id     && <TableCell onClick={() => handleSort('id')}     sx={{ cursor: 'pointer' }}>Device ID {sortBy === 'id' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>}
                    {visibleCols.status && <TableCell onClick={() => handleSort('status')} sx={{ cursor: 'pointer' }}>Status {sortBy === 'status' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</TableCell>}
                    {visibleCols.apps   && <TableCell>Assigned Apps</TableCell>}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && [...Array(5)].map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell padding="checkbox"><Skeleton variant="rectangular" width={18} height={18} /></TableCell>
                      {visibleCols.model  && <TableCell><Skeleton /></TableCell>}
                      {visibleCols.serial && <TableCell><Skeleton /></TableCell>}
                      {visibleCols.id     && <TableCell><Skeleton /></TableCell>}
                      {visibleCols.status && <TableCell><Skeleton width={60} /></TableCell>}
                      {visibleCols.apps   && <TableCell><Skeleton /></TableCell>}
                      <TableCell><Skeleton width={36} /></TableCell>
                    </TableRow>
                  ))}
                  {devices.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <DevicesIcon sx={{ fontSize: 40, color: 'var(--border-default)', mb: 1.5 }} />
                        <Typography variant="body2" color="text.secondary" display="block">
                          No devices found
                        </Typography>
                        <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                          Add devices to your GreenLake inventory to get started
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {devices.map((d) => (
                    <TableRow key={d.id || d.deviceId}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.has(d.id || d.deviceId)}
                          onChange={(e) => {
                            const s = new Set(selected);
                            const key = d.id || d.deviceId;
                            if (e.target.checked) s.add(key); else s.delete(key);
                            setSelected(s);
                          }}
                        />
                      </TableCell>
                      {visibleCols.model  && <TableCell>{d.model || '-'}</TableCell>}
                      {visibleCols.serial && <TableCell>{d.serialNumber || d.serial || '-'}</TableCell>}
                      {visibleCols.id     && <TableCell>{d.id || d.deviceId}</TableCell>}
                      {visibleCols.status && <TableCell>{d.status ? <StatusChip status={d.status} /> : '-'}</TableCell>}
                      {visibleCols.apps   && <TableCell>{Array.isArray(d.assignedApps) ? d.assignedApps.join(', ') : '-'}</TableCell>}
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => {
                            setForm({ serialNumber: d.serialNumber || d.serial || '', model: d.model || '', deviceId: d.id || d.deviceId || '' });
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

      {/* Add Device Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Device</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField label="Serial Number" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} />
          <TextField label="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          <TextField label="Device ID" value={form.deviceId} onChange={(e) => setForm({ ...form, deviceId: e.target.value })} helperText="Optional client-supplied id" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={submitAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Update Device Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Update Device</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField label="Serial Number" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} />
          <TextField label="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          <TextField label="Device ID" value={form.deviceId} onChange={(e) => setForm({ ...form, deviceId: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={submitUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Import Dialog */}
      <BulkImportDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onSuccess={() => { invalidateDevices(); setBulkOpen(false); }}
      />
    </Box>
  );
}

export default GLDevicesPage;
