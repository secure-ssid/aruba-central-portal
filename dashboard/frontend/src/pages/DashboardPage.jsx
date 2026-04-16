/**
 * Dashboard: unified Overview + Monitoring in one page.
 * ?view=monitor jumps straight to the Monitoring tab.
 */

import { useState, useMemo, useCallback, useRef, memo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Skeleton,
  LinearProgress,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import RouterIcon from '@mui/icons-material/Router';
import WifiIcon from '@mui/icons-material/Wifi';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/TuneOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNetworkHealth, useDevices, useClients } from '../hooks/useApiQueries';
import SettingsPage from './SettingsPage';
import StatusPage from './StatusPage';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const StatsCard = memo(function StatsCard({ title, value, icon: Icon, color, loading, subtitle, onClick }) {
  const colorMap = useMemo(() => ({
    primary: '#FF6600',
    info: '#3B82F6',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    purple: '#8B5CF6',
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
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: `${actualColor}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {Icon && <Icon sx={{ fontSize: 22, color: actualColor }} />}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

const QuickLink = memo(function QuickLink({ title, description, icon: Icon, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: '8px', cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.04)', '& .quick-arrow': { opacity: 1, transform: 'translateX(0)' } },
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
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tabIndex = tabParam === 'settings' ? 1 : tabParam === 'status' ? 2 : 0;
  const [tabValue, setTabValue] = useState(tabIndex);

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    const tabMap = { 1: 'settings', 2: 'status' };
    setSearchParams(tabMap[newValue] ? { tab: tabMap[newValue] } : {}, { replace: true });
  };

  const healthQuery = useNetworkHealth({ refetchInterval: 60_000 });
  const devicesQuery = useDevices({ refetchInterval: 60_000 });
  const clientsQuery = useClients(undefined, { refetchInterval: 60_000 });


  const loading = healthQuery.isLoading && devicesQuery.isLoading;
  const refreshing = healthQuery.isFetching && !healthQuery.isLoading;
  const error = healthQuery.error?.message || devicesQuery.error?.message || '';
  const [errorDismissed, setErrorDismissed] = useState(false);

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

  const prevStatsRef = useRef(null);
  useMemo(() => { if (healthQuery.dataUpdatedAt) prevStatsRef.current = stats; }, [healthQuery.dataUpdatedAt]);

  const handleRefresh = useCallback(() => {
    healthQuery.refetch();
    devicesQuery.refetch();
    clientsQuery.refetch();
  }, [healthQuery, devicesQuery, clientsQuery]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Network Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time overview of your Aruba Central infrastructure
          </Typography>
        </Box>
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} >
            {refreshing && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CircularProgress size={16} sx={{ color: '#475569' }} />
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>Refreshing</Typography>
              </Box>
            )}
            <Tooltip title="Refresh all data">
              <IconButton size="small" onClick={handleRefresh} sx={{ color: '#64748B', '&:hover': { color: '#94A3B8' } }}>
                <RefreshIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.9rem', minHeight: 40 },
          '& .Mui-selected': { color: '#FF6600' },
          '& .MuiTabs-indicator': { backgroundColor: '#FF6600' },
        }}
      >
        <Tab label="Overview" />
        <Tab label="Settings" />
        <Tab label="Status" />
      </Tabs>

      {/* Settings Tab */}
      {tabValue === 1 && <SettingsPage />}

      {/* Status Tab */}
      {tabValue === 2 && <StatusPage />}

      {/* Overview Tab */}
      {tabValue === 0 && <>
        {error && !errorDismissed && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorDismissed(true)}>{error}</Alert>
        )}

          {/* KPI cards */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatsCard title="Total Devices" value={stats.totalDevices} icon={DevicesIcon} color="primary" loading={loading} subtitle="Managed devices" onClick={() => navigate('/devices')} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatsCard title="Switches" value={stats.switches} icon={RouterIcon} color="info" loading={loading} subtitle="Network switches" onClick={() => navigate('/devices?tab=switches')} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatsCard title="Access Points" value={stats.accessPoints} icon={WifiIcon} color="purple" loading={loading} subtitle="Wireless APs" onClick={() => navigate('/devices?tab=aps')} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatsCard title="Connected Clients" value={stats.clients} icon={PeopleIcon} color="success" loading={loading} subtitle="Active sessions" onClick={() => navigate('/clients')} />
            </Grid>
          </Grid>

          {stats.clients === 0 && !loading && (
            <Alert severity="info" sx={{ mb: 3, '& .MuiAlert-message': { fontSize: '0.85rem' } }}>
              No clients currently connected. Visit <strong>Clients</strong> for detailed information by site.
            </Alert>
          )}

          {/* Distribution + Quick Access */}
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%', border: '1px solid rgba(255,255,255,0.06)' }}>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', fontSize: '0.7rem' }}>
                      Device Distribution
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>{stats.totalDevices} total</Typography>
                  </Box>
                  {(() => {
                    const total = stats.switches + stats.accessPoints + stats.gateways || 1;
                    const items = [
                      { label: 'Switches',      value: stats.switches,     color: '#3B82F6', icon: <RouterIcon sx={{ fontSize: 16 }} /> },
                      { label: 'Access Points', value: stats.accessPoints, color: '#8B5CF6', icon: <WifiIcon sx={{ fontSize: 16 }} /> },
                      { label: 'Gateways',      value: stats.gateways,     color: '#F59E0B', icon: <DevicesIcon sx={{ fontSize: 16 }} /> },
                    ];
                    const pieData = items.filter(i => i.value > 0).map(i => ({ name: i.label, value: i.value, color: i.color }));
                    return (
                      <Box>
                        {pieData.length > 0 && (
                          <Box sx={{ height: 120, mb: 2 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={52} paddingAngle={3} dataKey="value" isAnimationActive={false}>
                                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} opacity={0.85} />)}
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
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: item.color, fontSize: '0.85rem' }}>{item.value}</Typography>
                                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                                    ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                                  </Typography>
                                </Box>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={total > 0 ? (item.value / total) * 100 : 0}
                                sx={{
                                  height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)',
                                  '& .MuiLinearProgress-bar': { borderRadius: 3, background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` },
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

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', border: '1px solid rgba(255,255,255,0.06)' }}>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', fontSize: '0.7rem', mb: 1.5 }}>
                    Quick Access
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                    <QuickLink title="Alerts" description="View active alerts" icon={NotificationsIcon} onClick={() => navigate('/alerts')} />
                    <QuickLink title="WLANs" description="Manage wireless networks" icon={WifiIcon} onClick={() => navigate('/wlans')} />
                    <QuickLink title="Configuration" description="Network settings" icon={TuneIcon} onClick={() => navigate('/configuration')} />
                    <QuickLink title="Settings" description="Workspace & credentials" icon={SettingsIcon} onClick={() => handleTabChange(null, 1)} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      </>}
    </Box>
  );
}

export default DashboardPage;
