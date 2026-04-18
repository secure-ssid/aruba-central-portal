/**
 * Dashboard: unified Overview + Monitoring in one page.
 * Overview tab = KPI cards + device health donut + type/alert charts + sites.
 * ?tab=settings / ?tab=status deep-link to sub-tabs.
 */

import { useState, useMemo, useCallback, memo, useEffect } from 'react';
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
  Chip,
} from '@mui/material';
import DevicesIcon    from '@mui/icons-material/Devices';
import RouterIcon     from '@mui/icons-material/Router';
import WifiIcon       from '@mui/icons-material/Wifi';
import PeopleIcon     from '@mui/icons-material/People';
import RefreshIcon    from '@mui/icons-material/Refresh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HubIcon        from '@mui/icons-material/Hub';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import {
  useNetworkHealth, useDevices, useClients, useAlerts, useSites,
} from '../hooks/useApiQueries';
import SettingsPage from './SettingsPage';
import StatusPage   from './StatusPage';

// ─── Colour palette ───────────────────────────────────────────────────────────
const C = {
  primary: '#FF6600',
  blue:    '#3B82F6',
  purple:  '#8B5CF6',
  green:   '#22C55E',
  red:     '#EF4444',
  amber:   '#F59E0B',
  teal:    '#14B8A6',
  muted:   '#64748B',
};

const SEVERITY_COLORS = {
  Critical: C.red,
  Major:    C.amber,
  Minor:    C.blue,
  Warning:  '#F97316',
  Unknown:  C.muted,
};

const TYPE_COLORS = {
  SWITCH:   C.blue,
  AP:       C.purple,
  IAP:      C.purple,
  GATEWAY:  C.amber,
  Unknown:  C.muted,
};

const TOOLTIP_STYLE = {
  background: '#111827',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  fontSize: 12,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = memo(function StatCard({ title, value, icon: Icon, color = C.primary, loading, subtitle, onClick }) {
  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}0A 0%, transparent 100%)`,
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': onClick ? { transform: 'translateY(-2px)', borderColor: `${color}30`, boxShadow: `0 8px 24px ${color}12` } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.7rem', fontWeight: 600, mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={50} height={44} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 700, color, fontSize: '1.75rem', lineHeight: 1 }}>
                {value ?? '–'}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, fontSize: '0.68rem' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ width: 38, height: 38, borderRadius: '10px', backgroundColor: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {Icon && <Icon sx={{ fontSize: 20, color }} />}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

function ChartCard({ title, subtitle, loading, children, action }) {
  return (
    <Card sx={{ height: '100%', border: '1px solid rgba(255,255,255,0.06)' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', fontSize: '0.7rem' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>{subtitle}</Typography>
            )}
          </Box>
          {action}
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress size={24} sx={{ color: C.primary }} />
          </Box>
        ) : children}
      </CardContent>
    </Card>
  );
}

function EmptyChart({ message = 'No data available' }) {
  return (
    <Box sx={{ py: 5, textAlign: 'center' }}>
      <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.8rem' }}>{message}</Typography>
    </Box>
  );
}

function DonutGauge({ pct, loading, label = 'Online' }) {
  const safeP = Math.max(0, Math.min(100, pct || 0));
  const data = [
    { name: label, value: safeP, color: safeP >= 90 ? C.green : safeP >= 70 ? C.amber : C.red },
    { name: 'Other', value: 100 - safeP, color: 'rgba(255,255,255,0.05)' },
  ];
  const gaugeColor = data[0].color;
  return (
    <Box sx={{ position: 'relative', height: 180 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={58} outerRadius={76}
            startAngle={90} endAngle={-270}
            paddingAngle={safeP < 100 ? 2 : 0}
            dataKey="value"
            isAnimationActive={false}
            stroke="none"
          >
            {data.map((entry) => <Cell key={entry.name} fill={entry.color} stroke="none" />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
        {loading ? (
          <CircularProgress size={20} sx={{ color: C.green }} />
        ) : (
          <>
            <Typography sx={{ fontWeight: 700, color: gaugeColor, lineHeight: 1, fontSize: '1.75rem' }}>{safeP}%</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{label}</Typography>
          </>
        )}
      </Box>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam  = searchParams.get('tab');
  const tabIndex  = tabParam === 'settings' ? 1 : tabParam === 'status' ? 2 : 0;
  const [tabValue, setTabValue] = useState(tabIndex);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [lastUpdated, setLastUpdated]       = useState(null);

  const handleTabChange = (_, v) => {
    setTabValue(v);
    const map = { 1: 'settings', 2: 'status' };
    setSearchParams(map[v] ? { tab: map[v] } : {}, { replace: true });
  };

  // ── Data ────────────────────────────────────────────────────────────────────
  const healthQuery  = useNetworkHealth({ refetchInterval: 60_000 });
  const devicesQuery = useDevices({ refetchInterval: 60_000 });
  const clientsQuery = useClients(undefined, { refetchInterval: 60_000 });
  const alertsQuery  = useAlerts({ refetchInterval: 60_000 });
  const sitesQuery   = useSites({}, { refetchInterval: 300_000 });

  const loading    = healthQuery.isLoading && devicesQuery.isLoading;
  const refreshing = (healthQuery.isFetching || devicesQuery.isFetching) && !loading;
  const error      = healthQuery.error?.message || devicesQuery.error?.message || '';

  useEffect(() => {
    if (healthQuery.dataUpdatedAt) setLastUpdated(new Date(healthQuery.dataUpdatedAt));
  }, [healthQuery.dataUpdatedAt]);

  // ── Derived stats ───────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const h = healthQuery.data || {};
    const d = devicesQuery.data?.items || [];
    const total = h.total_devices || d.length || 0;

    let switches = h.switches || 0;
    let aps      = h.access_points || 0;
    let gateways = 0;

    const typeCounts = d.reduce((acc, dev) => {
      const t = dev.deviceType || 'UNKNOWN';
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});

    if (switches === 0 && aps === 0 && d.length > 0) {
      switches = typeCounts.SWITCH || 0;
      aps      = typeCounts.AP || typeCounts.IAP || 0;
      gateways = typeCounts.GATEWAY || 0;
    }

    const online  = d.filter(dv => dv.status === 'Up' || dv.status === 'ONLINE').length;
    const offline = d.filter(dv => dv.status === 'Down' || dv.status === 'OFFLINE').length;
    const healthPct = total > 0 ? Math.round(((total - offline) / total) * 100) : 0;

    let clients = 0;
    const cd = clientsQuery.data;
    if (cd) {
      const items = Array.isArray(cd) ? cd : cd.items || [];
      clients = items.filter(c => c.status?.toLowerCase() === 'connected').length;
      if (clients === 0 && (cd.count > 0 || cd.total > 0)) clients = cd.count || cd.total || 0;
    }

    return { total, switches, aps, gateways, online, offline, healthPct, clients, typeCounts };
  }, [healthQuery.data, devicesQuery.data, clientsQuery.data]);

  const sites = useMemo(
    () => sitesQuery.data?.items || sitesQuery.data?.sites || [],
    [sitesQuery.data]
  );

  const typeChartData = useMemo(() => {
    const d = devicesQuery.data?.items || [];
    const counts = {};
    d.forEach(dv => {
      const t = dv.deviceType || 'Unknown';
      counts[t] = (counts[t] || 0) + 1;
    });
    // Fallback to stats if no raw items yet
    if (Object.keys(counts).length === 0 && (stats.switches + stats.aps + stats.gateways > 0)) {
      if (stats.switches)  counts['SWITCH']  = stats.switches;
      if (stats.aps)       counts['AP']      = stats.aps;
      if (stats.gateways)  counts['GATEWAY'] = stats.gateways;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [devicesQuery.data, stats]);

  const alertChartData = useMemo(() => {
    const items = alertsQuery.data?.alerts || alertsQuery.data?.items || [];
    const counts = {};
    items.forEach(a => {
      const s = a.severity || a.priority || 'Unknown';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [alertsQuery.data]);

  const alertsLoading = alertsQuery.isLoading;
  const sitesLoading  = sitesQuery.isLoading;

  const handleRefresh = useCallback(() => {
    healthQuery.refetch();
    devicesQuery.refetch();
    clientsQuery.refetch();
    alertsQuery.refetch();
    sitesQuery.refetch();
  }, [healthQuery, devicesQuery, clientsQuery, alertsQuery, sitesQuery]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Network Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time overview of your HPE Central infrastructure
          </Typography>
          {lastUpdated && !loading && (
            <Typography variant="caption" sx={{ color: 'var(--text-disabled)', fontSize: '0.67rem', mt: 0.25, display: 'block' }}>
              Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </Typography>
          )}
        </Box>
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {refreshing && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CircularProgress size={14} sx={{ color: '#475569' }} />
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>Refreshing</Typography>
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
          '& .Mui-selected': { color: C.primary },
          '& .MuiTabs-indicator': { backgroundColor: C.primary },
        }}
      >
        <Tab label="Overview" />
        <Tab label="Settings" />
        <Tab label="Status" />
      </Tabs>

      {tabValue === 1 && <SettingsPage />}
      {tabValue === 2 && <StatusPage />}

      {tabValue === 0 && (
        <>
          {refreshing && (
            <LinearProgress sx={{ mb: 2, borderRadius: 1, '& .MuiLinearProgress-bar': { bgcolor: C.primary } }} />
          )}
          {error && !errorDismissed && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorDismissed(true)}>{error}</Alert>
          )}

          {/* ── Row 1: fleet overview (4 cards) ─────────────────────────── */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6} sm={3}>
              <StatCard title="Total Devices" value={stats.total} icon={DevicesIcon} color={C.primary} loading={loading}
                subtitle="Managed devices" onClick={() => navigate('/devices')} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard title="Online" value={stats.online || (stats.total - stats.offline) || '–'} icon={CheckCircleOutlineIcon} color={C.green} loading={loading}
                subtitle={stats.total > 0 ? `${stats.healthPct}% of fleet` : undefined} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard title="Offline" value={stats.offline} icon={ErrorOutlineIcon} color={C.red} loading={loading}
                subtitle="Require attention" onClick={() => navigate('/devices')} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard title="Active Clients" value={stats.clients} icon={PeopleIcon} color={C.teal} loading={loading}
                subtitle="Connected sessions" onClick={() => navigate('/clients')} />
            </Grid>
          </Grid>

          {/* ── Row 2: device type breakdown (4 cards) ──────────────────── */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <StatCard title="Switches" value={stats.switches} icon={RouterIcon} color={C.blue} loading={loading}
                subtitle="Network switches" onClick={() => navigate('/devices?tab=switches')} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard title="Access Points" value={stats.aps} icon={WifiIcon} color={C.purple} loading={loading}
                subtitle="Wireless APs" onClick={() => navigate('/devices?tab=aps')} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard title="Gateways" value={stats.gateways || 0} icon={HubIcon} color={C.amber} loading={loading}
                subtitle="SD-WAN gateways" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard title="Sites" value={sitesLoading ? undefined : sites.length} icon={LocationOnIcon} color={C.blue} loading={sitesLoading}
                subtitle="Managed locations" onClick={() => navigate('/sites')} />
            </Grid>
          </Grid>

          {/* ── Row 3: charts ───────────────────────────────────────────── */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Device health donut */}
            <Grid item xs={12} md={4}>
              <ChartCard title="Device Health" subtitle="Availability across fleet" loading={loading}>
                <DonutGauge pct={stats.healthPct} loading={loading} />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                  {[
                    { label: 'Online', color: C.green, value: stats.online || stats.total - stats.offline },
                    { label: 'Offline', color: C.red,  value: stats.offline },
                  ].map(item => (
                    <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {item.label} <strong style={{ color: 'var(--text-primary)' }}>{item.value ?? '–'}</strong>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </ChartCard>
            </Grid>

            {/* Devices by type – horizontal bars */}
            <Grid item xs={12} md={4}>
              <ChartCard title="Devices by Type" subtitle="Distribution across device types" loading={loading && typeChartData.length === 0}>
                {typeChartData.length === 0 ? (
                  <EmptyChart message="No device type data" />
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={typeChartData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: C.muted, fontSize: 11 }} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} width={68} />
                      <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false} maxBarSize={20}>
                        {typeChartData.map((entry) => (
                          <Cell key={entry.name} fill={TYPE_COLORS[entry.name] || C.primary} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </Grid>

            {/* Alerts by severity */}
            <Grid item xs={12} md={4}>
              <ChartCard
                title="Alerts by Severity"
                subtitle={alertChartData.length > 0 ? `${alertChartData.reduce((s, d) => s + d.value, 0)} total` : undefined}
                loading={alertsLoading}
                action={
                  <Chip
                    label="View all"
                    size="small"
                    onClick={() => navigate('/notifications')}
                    sx={{ fontSize: '0.65rem', height: 20, cursor: 'pointer', bgcolor: 'rgba(255,102,0,0.1)', color: C.primary, border: 'none' }}
                  />
                }
              >
                {alertChartData.length === 0 ? (
                  <EmptyChart message="No active alerts" />
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={alertChartData} margin={{ top: 0, right: 10, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} />
                      <YAxis tick={{ fill: C.muted, fontSize: 11 }} allowDecimals={false} />
                      <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false} maxBarSize={36}>
                        {alertChartData.map((entry) => (
                          <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name] || C.muted} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </Grid>
          </Grid>

        </>
      )}
    </Box>
  );
}

export default DashboardPage;
