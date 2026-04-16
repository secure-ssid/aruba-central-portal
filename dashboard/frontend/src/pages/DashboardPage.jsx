/**
 * Main Dashboard Page
 * Displays network health, device statistics, and overview
 * Optimized for faster loading with caching and optimistic UI
 */

import { useState, useMemo, useCallback, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Chip,
  CircularProgress,
  Skeleton,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import RouterIcon from '@mui/icons-material/Router';
import WifiIcon from '@mui/icons-material/Wifi';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SyncIcon from '@mui/icons-material/Sync';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/TuneOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNetworkHealth, useDevices, useClients } from '../hooks/useApiQueries';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// localStorage cache utils removed — React Query handles caching automatically

/**
 * Memoized StatsCard component to prevent unnecessary re-renders
 */
const StatsCard = memo(function StatsCard({ title, value, icon: Icon, color, loading, trend, trendValue, subtitle, onClick }) {
  // Map theme color names to actual colors
  const colorMap = useMemo(() => ({
    'primary': '#FF6600',
    'info': '#3B82F6',
    'success': '#22C55E',
    'warning': '#F59E0B',
    'error': '#EF4444',
    'purple': '#8B5CF6',
  }), []);

  const actualColor = colorMap[color] || '#FF6600';

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${actualColor}08 0%, transparent 100%)`,
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          borderColor: `${actualColor}30`,
          boxShadow: `0 8px 24px ${actualColor}12`,
        } : {},
        transition: 'all 0.2s ease',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={60} height={48} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 700, color: actualColor, fontSize: '2rem', lineHeight: 1 }}>
                {value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75, fontSize: '0.7rem' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: `${actualColor}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {Icon && <Icon sx={{ fontSize: 22, color: actualColor }} />}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

/**
 * Quick action link card
 */
const QuickLink = memo(function QuickLink({ title, description, icon: Icon, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.04)',
          '& .quick-arrow': { opacity: 1, transform: 'translateX(0)' },
        },
      }}
    >
      <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {Icon && <Icon sx={{ fontSize: 18, color: '#94A3B8' }} />}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>{title}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{description}</Typography>
      </Box>
      <ArrowForwardIcon className="quick-arrow" sx={{ fontSize: 16, color: '#475569', opacity: 0, transform: 'translateX(-4px)', transition: 'all 0.15s ease' }} />
    </Box>
  );
});

function DashboardPage() {
  const navigate = useNavigate();

  // ── React Query hooks (cache, dedup, and 60 s auto-poll for free) ──
  const healthQuery = useNetworkHealth({ refetchInterval: 60_000 });
  const devicesQuery = useDevices({ refetchInterval: 60_000 });
  const clientsQuery = useClients(undefined, { refetchInterval: 60_000 });

  const loading = healthQuery.isLoading && devicesQuery.isLoading;
  const refreshing = healthQuery.isFetching && !healthQuery.isLoading;
  const error = healthQuery.error?.message || devicesQuery.error?.message || '';
  const [errorDismissed, setErrorDismissed] = useState(false);

  // Derive stats from query data
  const stats = useMemo(() => {
    const h = healthQuery.data || {};
    const d = devicesQuery.data?.items || [];
    const totalDevices = h.total_devices || d.length || 0;
    let switches = h.switches || 0;
    let accessPoints = h.access_points || 0;
    let gateways = 0;

    if (switches === 0 && accessPoints === 0 && d.length > 0) {
      const counts = d.reduce((acc, dev) => {
        const t = dev.deviceType || 'UNKNOWN';
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {});
      switches = counts.SWITCH || 0;
      accessPoints = counts.AP || counts.IAP || counts.ACCESS_POINT || 0;
      gateways = counts.GATEWAY || 0;
    }

    // Client count — filter to connected only
    let clients = 0;
    const cData = clientsQuery.data;
    if (cData) {
      const items = Array.isArray(cData) ? cData : cData.items || [];
      clients = items.filter(c => c.status?.toLowerCase() === 'connected').length;
      if (clients === 0 && (cData.count > 0 || cData.total > 0)) {
        clients = cData.count || cData.total || 0;
      }
    }

    return { totalDevices, switches, accessPoints, gateways, clients };
  }, [healthQuery.data, devicesQuery.data, clientsQuery.data]);

  // Track previous stats for trend arrows
  const prevStatsRef = useRef(null);
  const previousStats = prevStatsRef.current;
  // Update ref after render so trends compare against previous cycle
  useMemo(() => {
    if (healthQuery.dataUpdatedAt) {
      prevStatsRef.current = stats;
    }
  }, [healthQuery.dataUpdatedAt]);

  const lastUpdated = healthQuery.dataUpdatedAt ? new Date(healthQuery.dataUpdatedAt) : null;

  const getTrend = useCallback((current, previous) => {
    if (!previous || previous === 0) return null;
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'flat';
  }, []);

  const getTrendValue = useCallback((current, previous) => {
    if (!previous || previous === 0) return null;
    const diff = current - previous;
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff}`;
  }, []);

  // Memoize trend calculations
  const trends = useMemo(() => ({
    totalDevices: previousStats ? getTrend(stats.totalDevices, previousStats.totalDevices) : null,
    switches: previousStats ? getTrend(stats.switches, previousStats.switches) : null,
    accessPoints: previousStats ? getTrend(stats.accessPoints, previousStats.accessPoints) : null,
    clients: previousStats ? getTrend(stats.clients, previousStats.clients) : null,
  }), [stats, previousStats, getTrend]);

  const trendValues = useMemo(() => ({
    totalDevices: previousStats ? getTrendValue(stats.totalDevices, previousStats.totalDevices) : null,
    switches: previousStats ? getTrendValue(stats.switches, previousStats.switches) : null,
    accessPoints: previousStats ? getTrendValue(stats.accessPoints, previousStats.accessPoints) : null,
    clients: previousStats ? getTrendValue(stats.clients, previousStats.clients) : null,
  }), [stats, previousStats, getTrendValue]);

  const handleRefresh = useCallback(() => {
    healthQuery.refetch();
    devicesQuery.refetch();
    clientsQuery.refetch();
  }, [healthQuery, devicesQuery, clientsQuery]);

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Network Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time overview of your Aruba Central infrastructure
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {refreshing && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CircularProgress size={16} sx={{ color: '#475569' }} />
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                Refreshing
              </Typography>
            </Box>
          )}
          <Tooltip title="Refresh all data">
            <IconButton size="small" onClick={handleRefresh} sx={{ color: '#64748B', '&:hover': { color: '#94A3B8' } }}>
              <RefreshIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && !errorDismissed && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorDismissed(true)}>
          {error}
        </Alert>
      )}

      {/* Stats Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Devices"
            value={stats.totalDevices}
            icon={DevicesIcon}
            color="primary"
            loading={loading}
            trend={trends.totalDevices}
            trendValue={trendValues.totalDevices}
            subtitle="Managed devices"
            onClick={() => navigate('/devices')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Switches"
            value={stats.switches}
            icon={RouterIcon}
            color="info"
            loading={loading}
            trend={trends.switches}
            trendValue={trendValues.switches}
            subtitle="Network switches"
            onClick={() => navigate('/devices?tab=switches')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Access Points"
            value={stats.accessPoints}
            icon={WifiIcon}
            color="purple"
            loading={loading}
            trend={trends.accessPoints}
            trendValue={trendValues.accessPoints}
            subtitle="Wireless APs"
            onClick={() => navigate('/devices?tab=aps')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Connected Clients"
            value={stats.clients}
            icon={PeopleIcon}
            color="success"
            loading={loading}
            trend={trends.clients}
            trendValue={trendValues.clients}
            subtitle="Active sessions"
            onClick={() => navigate('/clients')}
          />
        </Grid>
      </Grid>

      {/* Client Count Note */}
      {(stats.clients) === 0 && !loading && (
        <Alert severity="info" sx={{ mb: 3, '& .MuiAlert-message': { fontSize: '0.85rem' } }}>
          No clients are currently connected. Visit the <strong>Clients</strong> page to view detailed client information by site.
        </Alert>
      )}

      {/* Main content — 3 column layout */}
      <Grid container spacing={2.5}>
        {/* Device Distribution */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%', border: '1px solid rgba(255,255,255,0.06)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', fontSize: '0.7rem' }}>
                  Device Distribution
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                  {stats.totalDevices} total
                </Typography>
              </Box>
              {(() => {
                const total = stats.switches + stats.accessPoints + stats.gateways || 1;
                const items = [
                  { label: 'Switches', value: stats.switches, color: '#3B82F6', icon: <RouterIcon sx={{ fontSize: 16 }} /> },
                  { label: 'Access Points', value: stats.accessPoints, color: '#8B5CF6', icon: <WifiIcon sx={{ fontSize: 16 }} /> },
                  { label: 'Gateways', value: stats.gateways, color: '#F59E0B', icon: <DevicesIcon sx={{ fontSize: 16 }} /> },
                ];
                const pieData = items.filter(i => i.value > 0).map(i => ({ name: i.label, value: i.value, color: i.color }));
                return (
                  <Box>
                    {pieData.length > 0 && (
                      <Box sx={{ height: 120, mb: 2 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={32}
                              outerRadius={52}
                              paddingAngle={3}
                              dataKey="value"
                              isAnimationActive={false}
                            >
                              {pieData.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} opacity={0.85} />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                              formatter={(value, name) => [value, name]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      {items.map((item) => (
                        <Box key={item.label}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ color: item.color, display: 'flex', opacity: 0.85 }}>{item.icon}</Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{item.label}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: item.color, fontSize: '0.85rem' }}>
                                {item.value}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                                ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                              </Typography>
                            </Box>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={total > 0 ? (item.value / total) * 100 : 0}
                            sx={{
                              height: 5,
                              borderRadius: 3,
                              bgcolor: 'rgba(255,255,255,0.04)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                              },
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                );
              })()}
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', border: '1px solid rgba(255,255,255,0.06)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', fontSize: '0.7rem', mb: 2.5 }}>
                System Status
              </Typography>

              {/* Connection quality indicator */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2.5,
                p: 1.5,
                borderRadius: '10px',
                bgcolor: error ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.06)',
                border: error ? '1px solid rgba(239,68,68,0.12)' : '1px solid rgba(34,197,94,0.12)',
              }}>
                <Box sx={{ position: 'relative', display: 'flex' }}>
                  <SignalCellularAltIcon sx={{ fontSize: 28, color: error ? '#EF4444' : '#22C55E' }} />
                  {!error && (
                    <Box sx={{
                      position: 'absolute', top: -1, right: -1, width: 8, height: 8,
                      borderRadius: '50%', bgcolor: '#22C55E',
                      boxShadow: '0 0 6px rgba(34,197,94,0.5)',
                      animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
                    }} />
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: error ? '#EF4444' : '#22C55E' }}>
                    {error ? 'Connection Issue' : 'All Systems Operational'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                    Aruba Central API
                  </Typography>
                </Box>
              </Box>

              {/* Status details */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      API Connection
                    </Typography>
                  </Box>
                  <Chip
                    label={error ? 'Error' : 'Connected'}
                    size="small"
                    color={error ? 'error' : 'success'}
                    variant="outlined"
                    sx={{ fontWeight: 500, fontSize: '0.65rem', height: 22 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Last Updated
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
                    {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SyncIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Auto-refresh
                    </Typography>
                  </Box>
                  <Chip label="60s" size="small" variant="outlined" sx={{ fontWeight: 500, fontSize: '0.65rem', height: 22, color: 'text.secondary', borderColor: 'rgba(255,255,255,0.1)' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Navigation */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', border: '1px solid rgba(255,255,255,0.06)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', fontSize: '0.7rem', mb: 1.5 }}>
                Quick Access
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <QuickLink
                  title="Alerts"
                  description="View active alerts"
                  icon={NotificationsIcon}
                  onClick={() => navigate('/alerts')}
                />
                <QuickLink
                  title="WLANs"
                  description="Manage wireless networks"
                  icon={WifiIcon}
                  onClick={() => navigate('/wlans')}
                />
                <QuickLink
                  title="Configuration"
                  description="Network settings"
                  icon={TuneIcon}
                  onClick={() => navigate('/configuration')}
                />
                <QuickLink
                  title="Settings"
                  description="App preferences"
                  icon={SettingsIcon}
                  onClick={() => navigate('/settings')}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
