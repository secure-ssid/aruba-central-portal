/**
 * Alerts and Events Page
 * Monitor network alerts and system events
 */

import { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert as MuiAlert,
  Button,
  Chip,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  NotificationsNone as NotificationsNoneIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import { alertsAPI } from '../services/api';
import { getErrorMessage } from '../utils/errorUtils';

function AlertsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [alertsData, eventsData] = await Promise.allSettled([
        alertsAPI.getAll(),
        alertsAPI.getEvents(),
      ]);

      if (alertsData.status === 'fulfilled') {
        setAlerts(alertsData.value.alerts || alertsData.value.items || []);
      }

      if (eventsData.status === 'fulfilled') {
        setEvents(eventsData.value.events || eventsData.value.items || []);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load alerts and events'));
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return <ErrorIcon sx={{ fontSize: 18, color: '#EF4444' }} />;
      case 'high':
        return <ErrorIcon sx={{ fontSize: 18, color: '#F97316' }} />;
      case 'medium':
      case 'warning':
        return <WarningIcon sx={{ fontSize: 18, color: '#F59E0B' }} />;
      case 'low':
      case 'info':
        return <InfoIcon sx={{ fontSize: 18, color: '#3B82F6' }} />;
      default:
        return <InfoIcon sx={{ fontSize: 18, color: '#64748B' }} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
      case 'warning':
        return 'warning';
      case 'low':
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const getSeverityBgColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'rgba(239,68,68,0.06)';
      case 'high':
        return 'rgba(249,115,22,0.06)';
      case 'medium':
      case 'warning':
        return 'rgba(245,158,11,0.05)';
      default:
        return 'transparent';
    }
  };

  const criticalCount = alerts.filter(a => a.severity?.toLowerCase() === 'critical').length;
  const warningCount = alerts.filter(a => ['warning', 'medium'].includes(a.severity?.toLowerCase())).length;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={28} sx={{ color: '#FF6600' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Alerts & Events
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor network alerts and system events
          </Typography>
        </Box>
        <Button startIcon={<RefreshIcon />} onClick={fetchData} variant="outlined" size="small">
          Refresh
        </Button>
      </Box>

      {error && (
        <MuiAlert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </MuiAlert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Total Alerts
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF6600' }}>{alerts.length}</Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(255,102,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <WarningIcon sx={{ fontSize: 20, color: '#FF6600' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Critical
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#EF4444' }}>{criticalCount}</Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ErrorIcon sx={{ fontSize: 20, color: '#EF4444' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Warnings
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#F59E0B' }}>{warningCount}</Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <WarningIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, transparent 100%)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
                    Events
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#22C55E' }}>{events.length}</Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 20, color: '#22C55E' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts and Events Tables */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              px: 2.5,
              pt: 1,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                minHeight: 48,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FF6600',
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Alerts
                  {alerts.length > 0 && (
                    <Chip label={alerts.length} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(255,102,0,0.15)', color: '#FF6600' }} />
                  )}
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Events
                  {events.length > 0 && (
                    <Chip label={events.length} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(255,255,255,0.06)', color: 'text.secondary' }} />
                  )}
                </Box>
              }
            />
          </Tabs>

          <Box sx={{ p: 0 }}>
            {tabValue === 0 && (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 140 }}>Severity</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell sx={{ width: 160 }}>Device</TableCell>
                      <TableCell sx={{ width: 180 }}>Timestamp</TableCell>
                      <TableCell sx={{ width: 120 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alerts.length > 0 ? (
                      alerts.map((alert, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            bgcolor: getSeverityBgColor(alert.severity),
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              {getSeverityIcon(alert.severity)}
                              <Chip
                                size="small"
                                label={alert.severity || 'N/A'}
                                color={getSeverityColor(alert.severity)}
                                variant="outlined"
                                sx={{ fontWeight: 600, fontSize: '0.68rem', height: 22, textTransform: 'capitalize' }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>
                              {alert.description || alert.message || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>
                              {alert.device_name || alert.device || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'text.secondary' }}>
                              {alert.timestamp ? new Date(alert.timestamp * 1000).toLocaleString() : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={alert.acknowledged ? 'Acknowledged' : 'Active'}
                              color={alert.acknowledged ? 'default' : 'warning'}
                              variant={alert.acknowledged ? 'outlined' : 'filled'}
                              sx={{ fontWeight: 500, fontSize: '0.68rem', height: 22 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                          <NotificationsNoneIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.08)', mb: 1.5 }} />
                          <Typography variant="body2" color="text.secondary" display="block">
                            No active alerts
                          </Typography>
                          <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                            Your network is running smoothly
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {tabValue === 1 && (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 140 }}>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell sx={{ width: 160 }}>Device</TableCell>
                      <TableCell sx={{ width: 180 }}>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.length > 0 ? (
                      events.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip
                              size="small"
                              label={event.type || 'Event'}
                              variant="outlined"
                              sx={{ fontWeight: 500, fontSize: '0.68rem', height: 22, textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>
                              {event.description || event.message || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>
                              {event.device_name || event.device || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'text.secondary' }}>
                              {event.timestamp ? new Date(event.timestamp * 1000).toLocaleString() : 'N/A'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                          <EventNoteIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.08)', mb: 1.5 }} />
                          <Typography variant="body2" color="text.secondary" display="block">
                            No events recorded
                          </Typography>
                          <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                            System events will appear here
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AlertsPage;
