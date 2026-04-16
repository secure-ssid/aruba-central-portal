/**
 * Analytics Page
 * Live charts driven by real Aruba Central data:
 *  - Device status / type distribution (from monitoring devices API)
 *  - Alert severity breakdown (from alerts API)
 *  - Sites summary (from sites API)
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { monitoringAPIv2, alertsAPI, configAPI } from '../services/api';

const STATUS_COLORS = {
  ONLINE:  '#22C55E',
  OFFLINE: '#EF4444',
  Unknown: '#64748B',
};

const TYPE_COLORS = {
  SWITCH:  '#3B82F6',
  AP:      '#8B5CF6',
  GATEWAY: '#F59E0B',
  Unknown: '#64748B',
};

const SEVERITY_COLORS = {
  Critical: '#EF4444',
  Major:    '#F59E0B',
  Minor:    '#3B82F6',
  Warning:  '#F97316',
  Unknown:  '#64748B',
};

function StatCard({ title, value, subtitle, loading, color }) {
  return (
    <Card
      sx={{
        border: '1px solid rgba(255,255,255,0.06)',
        background: `linear-gradient(135deg, ${color}08 0%, transparent 100%)`,
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.72rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: 1,
          }}
        >
          {title}
        </Typography>
        {loading ? (
          <Skeleton variant="text" width={60} height={44} />
        ) : (
          <Typography variant="h3" sx={{ fontWeight: 700, color, fontSize: '2rem', lineHeight: 1 }}>
            {value}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75, fontSize: '0.7rem' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, loading, children }) {
  return (
    <Card sx={{ height: '100%', border: '1px solid rgba(255,255,255,0.06)' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'text.secondary',
            fontSize: '0.7rem',
            mb: 2,
          }}
        >
          {title}
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress size={28} sx={{ color: '#FF6600' }} />
          </Box>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

function EmptyChart({ message }) {
  return (
    <Box sx={{ py: 5, textAlign: 'center' }}>
      <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.8rem' }}>
        {message || 'No data available'}
      </Typography>
    </Box>
  );
}

const TOOLTIP_STYLE = {
  background: '#111827',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  fontSize: 12,
};

function AnalyticsPage() {
  const [loading, setLoading]   = useState(true);
  const [devices, setDevices]   = useState([]);
  const [alerts,  setAlerts]    = useState([]);
  const [sites,   setSites]     = useState([]);
  const [error,   setError]     = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [devRes, alertRes, siteRes] = await Promise.allSettled([
        monitoringAPIv2.getDevicesMonitoring(),
        alertsAPI.getAll(null, 1),
        configAPI.getSites(),
      ]);

      if (devRes.status === 'fulfilled') {
        setDevices(devRes.value?.result || devRes.value?.items || devRes.value?.devices || []);
      }
      if (alertRes.status === 'fulfilled') {
        setAlerts(alertRes.value?.alerts || alertRes.value?.items || []);
      }
      if (siteRes.status === 'fulfilled') {
        setSites(siteRes.value?.items || siteRes.value?.sites || []);
      }
      if (devRes.status === 'rejected' && alertRes.status === 'rejected') {
        setError('Failed to load analytics data. Check your connection to Aruba Central.');
      }
      setLoading(false);
    })();
  }, []);

  // ── derived chart data ──────────────────────────────────────────────────────

  const statusData = useMemo(() => {
    const counts = {};
    devices.forEach((d) => {
      const s = d.status || 'Unknown';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [devices]);

  const typeData = useMemo(() => {
    const counts = {};
    devices.forEach((d) => {
      const t = d.deviceType || 'Unknown';
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [devices]);

  const alertData = useMemo(() => {
    const counts = {};
    alerts.forEach((a) => {
      const s = a.severity || a.priority || 'Unknown';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [alerts]);

  const onlineCount  = devices.filter((d) => d.status === 'ONLINE').length;
  const offlineCount = devices.filter((d) => d.status === 'OFFLINE').length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Live infrastructure insights from Aruba Central
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* KPI cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Total Devices"
            value={loading ? '–' : devices.length}
            loading={loading}
            color="#FF6600"
            subtitle="Managed devices"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Online"
            value={loading ? '–' : onlineCount}
            loading={loading}
            color="#22C55E"
            subtitle={
              devices.length
                ? `${Math.round((onlineCount / devices.length) * 100)}% of fleet`
                : 'No devices'
            }
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Offline"
            value={loading ? '–' : offlineCount}
            loading={loading}
            color="#EF4444"
            subtitle="Require attention"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Sites"
            value={loading ? '–' : sites.length}
            loading={loading}
            color="#3B82F6"
            subtitle="Managed locations"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {/* Status pie */}
        <Grid item xs={12} md={4}>
          <ChartCard title="Device Status" loading={loading}>
            {statusData.length === 0 ? (
              <EmptyChart message="No device data" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#64748B'} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: '#94A3B8', fontSize: 12 }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </Grid>

        {/* Device type bar */}
        <Grid item xs={12} md={4}>
          <ChartCard title="Device Types" loading={loading}>
            {typeData.length === 0 ? (
              <EmptyChart message="No device data" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={typeData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} allowDecimals={false} />
                  <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                    {typeData.map((entry) => (
                      <Cell key={entry.name} fill={TYPE_COLORS[entry.name] || '#FF6600'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </Grid>

        {/* Alert severity bar */}
        <Grid item xs={12} md={4}>
          <ChartCard title="Alerts by Severity" loading={loading}>
            {alertData.length === 0 ? (
              <EmptyChart message="No active alerts" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={alertData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} allowDecimals={false} />
                  <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                    {alertData.map((entry) => (
                      <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name] || '#64748B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </Grid>
      </Grid>

      {/* Sites summary */}
      {!loading && sites.length > 0 && (
        <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'text.secondary',
                fontSize: '0.7rem',
                mb: 2,
              }}
            >
              Sites Summary
            </Typography>
            <Grid container spacing={1.5}>
              {sites.map((site) => (
                <Grid item xs={12} sm={6} md={4} key={site.id || site.scopeId}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.06)',
                      bgcolor: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {site.scopeName || site.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {site.city && site.state
                        ? `${site.city}, ${site.state}`
                        : site.address || '–'}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#FF6600', fontWeight: 600, mt: 0.25, display: 'block' }}
                    >
                      {site.deviceCount ?? 0} devices
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default AnalyticsPage;
