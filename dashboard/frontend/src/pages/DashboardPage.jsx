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
} from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import RouterIcon from '@mui/icons-material/Router';
import WifiIcon from '@mui/icons-material/Wifi';
import PeopleIcon from '@mui/icons-material/People';
import { useNetworkHealth, useDevices, useClients } from '../hooks/useApiQueries';

// localStorage cache utils removed — React Query handles caching automatically

/**
 * Memoized StatsCard component to prevent unnecessary re-renders
 */
const StatsCard = memo(function StatsCard({ title, value, icon: Icon, color, loading, trend, trendValue, subtitle, onClick }) {
  // Map theme color names to actual colors
  const colorMap = useMemo(() => ({
    'primary': '#FF6600',
    'info': '#2196f3',
    'success': '#4caf50',
    'warning': '#FF6600',
    'error': '#f44336',
  }), []);

  const actualColor = colorMap[color] || '#FF6600';

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${actualColor}15 0%, ${actualColor}05 100%)`,
        border: `1px solid ${actualColor}30`,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        } : {},
        transition: 'all 0.3s ease',
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={60} height={60} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 700, color: actualColor }}>
                {value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary" display="block">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              backgroundColor: `${actualColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Icon && <Icon sx={{ fontSize: 32, color: actualColor }} />}
          </Box>
        </Box>
      </CardContent>
    </Card>
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

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Network Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time overview of your Aruba Central network infrastructure
          </Typography>
        </Box>
        {refreshing && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="caption" color="text.secondary">
              Refreshing...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Error Alert */}
      {error && !errorDismissed && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorDismissed(true)}>
          {error}
        </Alert>
      )}

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Devices"
            value={stats.totalDevices}
            icon={DevicesIcon}
            color="primary"
            loading={false}
            trend={trends.totalDevices}
            trendValue={trendValues.totalDevices}
            subtitle="View all devices"
            onClick={() => navigate('/devices')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Switches"
            value={stats.switches}
            icon={RouterIcon}
            color="info"
            loading={false}
            trend={trends.switches}
            trendValue={trendValues.switches}
            subtitle="Network switches"
            onClick={() => navigate('/devices')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Access Points"
            value={stats.accessPoints}
            icon={WifiIcon}
            color="primary"
            loading={false}
            trend={trends.accessPoints}
            trendValue={trendValues.accessPoints}
            subtitle="Wireless APs"
            onClick={() => navigate('/devices')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Clients"
            value={stats.clients}
            icon={PeopleIcon}
            color="success"
            loading={false}
            trend={trends.clients}
            trendValue={trendValues.clients}
            subtitle="Connected clients"
            onClick={() => navigate('/clients')}
          />
        </Grid>
      </Grid>

      {/* Client Count Note */}
      {(stats.clients) === 0 && !loading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No clients are currently connected. Visit the <strong>Clients</strong> page to view detailed client information by site.
        </Alert>
      )}

      {/* Device Type Breakdown */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Device Type Breakdown
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'rgba(255, 102, 0, 0.1)', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">Switches</Typography>
                <Typography variant="h6" sx={{ color: '#FF6600' }}>{stats.switches}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'rgba(255, 102, 0, 0.1)', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">Access Points</Typography>
                <Typography variant="h6" sx={{ color: '#FF6600' }}>{stats.accessPoints}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'rgba(255, 102, 0, 0.1)', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">Gateways</Typography>
                <Typography variant="h6" sx={{ color: '#FF6600' }}>{stats.gateways}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                API Connection
              </Typography>
              <Chip label="Connected" size="small" color="success" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body2">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Auto-refresh
              </Typography>
              <Chip label="60s" size="small" variant="outlined" />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DashboardPage;
