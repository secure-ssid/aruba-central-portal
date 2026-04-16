/**
 * Audit Log Page
 * View and search platform audit logs with pagination, sorting, and filtering
 */

import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  CircularProgress,
  Alert,
  Button,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  HistoryEdu as AuditIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { servicesAPI } from '../services/api';

const ROWS_PER_PAGE_OPTIONS = [25, 50, 100];

/**
 * Format a timestamp for display.
 * Handles Unix seconds, milliseconds, and ISO strings.
 */
const formatTimestamp = (ts) => {
  if (!ts) return 'N/A';
  let date;
  if (typeof ts === 'number') {
    // If timestamp looks like milliseconds (> year 2100 in seconds), keep as-is
    // Otherwise treat as seconds and convert to ms
    date = new Date(ts > 1e12 ? ts : ts * 1000);
  } else if (typeof ts === 'string') {
    date = new Date(ts);
  } else {
    return 'N/A';
  }
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Extract a field value from an audit log entry, trying multiple key names
 */
const getField = (log, ...keys) => {
  for (const key of keys) {
    if (log[key] !== undefined && log[key] !== null && log[key] !== '') {
      return log[key];
    }
  }
  return null;
};

/**
 * Get a color for an action type chip
 */
const getActionColor = (action) => {
  if (!action) return 'default';
  const lower = action.toLowerCase();
  if (lower.includes('create') || lower.includes('add') || lower.includes('post')) return 'success';
  if (lower.includes('delete') || lower.includes('remove')) return 'error';
  if (lower.includes('update') || lower.includes('modify') || lower.includes('put') || lower.includes('patch')) return 'warning';
  if (lower.includes('login') || lower.includes('auth')) return 'info';
  return 'default';
};

/**
 * Extract unique action types from logs for filter dropdown
 */
const getUniqueActions = (logs) => {
  const actions = new Set();
  for (const log of logs) {
    const action = getField(log, 'action', 'operation', 'event_type', 'eventType', 'type', 'method');
    if (action) actions.add(action);
  }
  return Array.from(actions).sort();
};

function AuditLogPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [orderBy, setOrderBy] = useState('timestamp');
  const [order, setOrder] = useState('desc');
  const [searchText, setSearchText] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  // Fetch audit logs — fetch a larger batch and handle client-side pagination/sorting
  const {
    data: rawData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => servicesAPI.getAuditLogs(500, 0),
    staleTime: 30_000,
  });

  // Normalize logs from various response formats
  const allLogs = useMemo(() => {
    if (!rawData) return [];
    const items = rawData.logs || rawData.items || rawData.data || rawData.audit_logs || [];
    if (!Array.isArray(items)) return [];
    return items.map((log) => ({
      _raw: log,
      timestamp: getField(log, 'timestamp', 'ts', 'created_at', 'createdAt', 'time', 'raisedAt'),
      user: getField(log, 'user', 'username', 'user_name', 'userName', 'email', 'actor', 'performed_by'),
      action: getField(log, 'action', 'operation', 'event_type', 'eventType', 'type', 'method'),
      target: getField(log, 'target', 'resource', 'object', 'entity', 'path', 'endpoint', 'device'),
      details: getField(log, 'details', 'description', 'message', 'summary', 'info', 'reason'),
      ipAddress: getField(log, 'ip_address', 'ipAddress', 'ip', 'source_ip', 'sourceIp', 'client_ip'),
    }));
  }, [rawData]);

  const uniqueActions = useMemo(() => getUniqueActions(allLogs), [allLogs]);

  // Apply filters and search
  const filteredLogs = useMemo(() => {
    let logs = allLogs;

    if (actionFilter) {
      logs = logs.filter((l) => l.action === actionFilter);
    }

    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      logs = logs.filter((l) =>
        (l.user || '').toLowerCase().includes(lower) ||
        (l.action || '').toLowerCase().includes(lower) ||
        (l.target || '').toLowerCase().includes(lower) ||
        (l.details || '').toLowerCase().includes(lower) ||
        (l.ipAddress || '').toLowerCase().includes(lower)
      );
    }

    return logs;
  }, [allLogs, actionFilter, searchText]);

  // Sort
  const sortedLogs = useMemo(() => {
    const sorted = [...filteredLogs];
    sorted.sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      // Handle timestamp comparison
      if (orderBy === 'timestamp') {
        aVal = aVal ? (typeof aVal === 'number' ? aVal : new Date(aVal).getTime()) : 0;
        bVal = bVal ? (typeof bVal === 'number' ? bVal : new Date(bVal).getTime()) : 0;
      } else {
        aVal = (aVal || '').toString().toLowerCase();
        bVal = (bVal || '').toString().toLowerCase();
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredLogs, orderBy, order]);

  // Paginate
  const paginatedLogs = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedLogs.slice(start, start + rowsPerPage);
  }, [sortedLogs, page, rowsPerPage]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setActionFilter('');
    setPage(0);
  };

  const hasFilters = searchText.trim() !== '' || actionFilter !== '';

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" role="status" aria-live="polite">
        <CircularProgress size={28} sx={{ color: 'var(--color-primary)' }} aria-label="Loading audit logs" />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Audit Log
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review platform activity, user actions, and configuration changes
          </Typography>
        </Box>
        <Button startIcon={<RefreshIcon />} onClick={() => refetch()} variant="outlined" size="small">
          Refresh
        </Button>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.message || 'Failed to load audit logs'}
        </Alert>
      )}

      {/* Summary Card */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Total Entries
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                    {allLogs.length}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(255,102,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AuditIcon sx={{ fontSize: 20, color: 'var(--color-primary)' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Filtered Results
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-secondary)' }}>
                    {filteredLogs.length}
                  </Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FilterIcon sx={{ fontSize: 20, color: 'var(--color-secondary)' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search logs..."
              aria-label="Search audit logs"
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setPage(0); }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'var(--text-muted)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280 }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="action-filter-label">Action Type</InputLabel>
              <Select
                labelId="action-filter-label"
                label="Action Type"
                value={actionFilter}
                onChange={(e) => { setActionFilter(e.target.value); setPage(0); }}
                aria-label="Filter by action type"
              >
                <MenuItem value="">All Actions</MenuItem>
                {uniqueActions.map((action) => (
                  <MenuItem key={action} value={action}>{action}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {hasFilters && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                variant="outlined"
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small" aria-label="Audit log entries">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 180 }}>
                    <TableSortLabel
                      active={orderBy === 'timestamp'}
                      direction={orderBy === 'timestamp' ? order : 'asc'}
                      onClick={() => handleSort('timestamp')}
                    >
                      Timestamp
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ width: 160 }}>
                    <TableSortLabel
                      active={orderBy === 'user'}
                      direction={orderBy === 'user' ? order : 'asc'}
                      onClick={() => handleSort('user')}
                    >
                      User
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ width: 140 }}>
                    <TableSortLabel
                      active={orderBy === 'action'}
                      direction={orderBy === 'action' ? order : 'asc'}
                      onClick={() => handleSort('action')}
                    >
                      Action
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ width: 200 }}>
                    <TableSortLabel
                      active={orderBy === 'target'}
                      direction={orderBy === 'target' ? order : 'asc'}
                      onClick={() => handleSort('target')}
                    >
                      Target
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell sx={{ width: 140 }}>
                    <TableSortLabel
                      active={orderBy === 'ipAddress'}
                      direction={orderBy === 'ipAddress' ? order : 'asc'}
                      onClick={() => handleSort('ipAddress')}
                    >
                      IP Address
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log, index) => (
                    <TableRow key={`${log.timestamp}-${index}`} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                          {formatTimestamp(log.timestamp)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          {log.user || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {log.action ? (
                          <Chip
                            size="small"
                            label={log.action}
                            color={getActionColor(log.action)}
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22, textTransform: 'capitalize' }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">N/A</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {log.target || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.details || ''}>
                          {log.details || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                          {log.ipAddress || 'N/A'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <AuditIcon sx={{ fontSize: 40, color: 'var(--border-default)', mb: 1.5 }} />
                      <Typography variant="body2" color="text.secondary" display="block">
                        {hasFilters ? 'No audit logs match your filters' : 'No audit logs available'}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                        {hasFilters ? 'Try adjusting your search or filter criteria' : 'Audit log entries will appear here when available'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {sortedLogs.length > 0 && (
            <TablePagination
              component="div"
              count={sortedLogs.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              sx={{ borderTop: '1px solid var(--border-subtle)' }}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default AuditLogPage;
