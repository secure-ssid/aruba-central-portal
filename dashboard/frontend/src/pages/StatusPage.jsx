/**
 * System Status Page
 * Displays backend health, token status, device summary, recent alerts, and API health
 * Auto-refreshes every 60 seconds
 */

import { useState, useMemo, useCallback, memo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Skeleton,
  IconButton,
  Tooltip,
  LinearProgress,
  Button,
  Alert,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import TimerIcon from '@mui/icons-material/Timer';
import DnsIcon from '@mui/icons-material/Dns';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LinkIcon from '@mui/icons-material/Link';
import DevicesIcon from '@mui/icons-material/Devices';
import WifiIcon from '@mui/icons-material/Wifi';
import RouterIcon from '@mui/icons-material/Router';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import { healthAPI, tokenAPI } from '../services/api';
import { useDevices, useAlerts, useTokenInfo } from '../hooks/useApiQueries';

// ─── Constants ──────────────────────────────────────────────────────────────

// NOTE: hex values required here because they are used with opacity suffixes (e.g. `${GREEN}30`)
const ACCENT = '#FF6600';
const GREEN = '#22C55E';
const RED = '#EF4444';
const ORANGE = '#F59E0B';
const YELLOW = '#FCD34D';
const BLUE = '#3B82F6';

const REFRESH_INTERVAL = 60000; // 60 seconds

// localStorage caching removed — React Query handles all caching automatically

// ─── Severity helpers ───────────────────────────────────────────────────────

const severityConfig = {
  critical: { color: RED, icon: ErrorIcon, label: 'Critical' },
  major: { color: ORANGE, icon: WarningAmberIcon, label: 'Major' },
  minor: { color: YELLOW, icon: WarningAmberIcon, label: 'Minor' },
  warning: { color: ORANGE, icon: WarningAmberIcon, label: 'Warning' },
  info: { color: BLUE, icon: InfoIcon, label: 'Info' },
};

function getSeverity(alert) {
  const sev = (alert.severity || alert.level || 'info').toLowerCase();
  return severityConfig[sev] || severityConfig.info;
}

// ─── Status Indicator ───────────────────────────────────────────────────────

const StatusDot = memo(function StatusDot({ ok, size = 12 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: ok ? GREEN : RED,
        boxShadow: `0 0 ${size / 2}px ${ok ? GREEN : RED}80`,
        flexShrink: 0,
      }}
    />
  );
});

// ─── Health Card ────────────────────────────────────────────────────────────

const HealthCard = memo(function HealthCard({ title, icon: Icon, status, details, loading, error, onRetry }) {
  const isOk = status === 'ok' || status === 'healthy' || status === 'connected' || status === true;

  return (
    <Card
      sx={{
        height: '100%',
        border: `1px solid ${isOk && !loading && !error ? GREEN : error ? RED : '#475569'}30`,
        background: loading
          ? 'transparent'
          : `linear-gradient(135deg, ${isOk && !error ? GREEN : error ? RED : '#475569'}08 0%, transparent 100%)`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {Icon && <Icon sx={{ color: ACCENT, fontSize: 24 }} />}
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>
          {!loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StatusDot ok={isOk && !error} />
              <Typography variant="caption" sx={{ color: isOk && !error ? GREEN : RED, fontWeight: 600 }}>
                {error ? 'Error' : isOk ? 'Healthy' : 'Unhealthy'}
              </Typography>
            </Box>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="70%" />
          </Box>
        ) : error ? (
          <Box>
            <Typography variant="body2" color="error" sx={{ mb: 1 }}>
              {error}
            </Typography>
            {onRetry && (
              <Button size="small" variant="outlined" color="error" onClick={onRetry} startIcon={<RefreshIcon />}>
                Retry
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {details.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: item.color || 'text.primary' }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

// ─── Device Summary Card ────────────────────────────────────────────────────

const DeviceSummaryCard = memo(function DeviceSummaryCard({ title, icon: Icon, total, up, down, color, loading }) {
  const upPct = total > 0 ? Math.round((up / total) * 100) : 0;

  return (
    <Card
      sx={{
        height: '100%',
        border: `1px solid ${color || ACCENT}30`,
        background: `linear-gradient(135deg, ${color || ACCENT}08 0%, transparent 100%)`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          {Icon && <Icon sx={{ color: color || ACCENT, fontSize: 24 }} />}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        {loading ? (
          <Box>
            <Skeleton variant="text" width="40%" height={48} />
            <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4, mt: 1 }} />
            <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
          </Box>
        ) : (
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: color || ACCENT, mb: 1 }}>
              {total}
            </Typography>

            {total > 0 && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={upPct}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: `${RED}30`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: GREEN,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 36, textAlign: 'right' }}>
                    {upPct}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: GREEN }}>
                    {up} Up
                  </Typography>
                  <Typography variant="caption" sx={{ color: RED }}>
                    {down} Down
                  </Typography>
                </Box>
              </>
            )}

            {total === 0 && (
              <Typography variant="caption" color="text.secondary">
                No devices found
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

// ─── Main StatusPage ────────────────────────────────────────────────────────

export default function StatusPage() {
  const queryClient = useQueryClient();

  // ── React Query hooks — shared cache with Dashboard, TopBar, etc. ──
  // Health endpoint is StatusPage-specific, so we define a local query.
  const healthQuery = useQuery({
    queryKey: ['backend-health'],
    queryFn: async () => {
      const t0 = performance.now();
      const data = await healthAPI.check();
      data._responseTime = Math.round(performance.now() - t0);
      return data;
    },
    staleTime: 30_000,
    refetchInterval: REFRESH_INTERVAL,
  });

  // Shared hooks — these reuse the cache from DashboardPage, TopBar, etc.
  const tokenQuery = useTokenInfo({ refetchInterval: REFRESH_INTERVAL });
  const devicesQuery = useDevices({ refetchInterval: REFRESH_INTERVAL });
  const alertsQuery = useAlerts({ refetchInterval: REFRESH_INTERVAL });

  // Derive simple variables that the rest of the component uses
  const health = healthQuery.data ?? null;
  const tokenInfo = tokenQuery.data ?? null;
  const devices = devicesQuery.data ?? null;
  const alerts = alertsQuery.data ?? null;

  const healthLoading = healthQuery.isLoading;
  const tokenLoading = tokenQuery.isLoading;
  const devicesLoading = devicesQuery.isLoading;
  const alertsLoading = alertsQuery.isLoading;

  const healthError = healthQuery.error?.message || '';
  const tokenError = tokenQuery.error?.message || '';
  const devicesError = devicesQuery.error?.message || '';
  const alertsError = alertsQuery.error?.message || '';

  const apiResponseTime = health?._responseTime ?? null;
  const refreshing = healthQuery.isFetching || devicesQuery.isFetching;
  const lastRefresh = healthQuery.dataUpdatedAt ? new Date(healthQuery.dataUpdatedAt) : null;

  const fetchAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['backend-health'] });
    queryClient.invalidateQueries({ queryKey: ['token-info'] });
    queryClient.invalidateQueries({ queryKey: ['devices'] });
    queryClient.invalidateQueries({ queryKey: ['alerts'] });
  }, [queryClient]);

  // Keep individual retry handlers for the HealthCard retry buttons
  const fetchHealth = useCallback(() => queryClient.invalidateQueries({ queryKey: ['backend-health'] }), [queryClient]);
  const fetchTokenInfo = useCallback(() => queryClient.invalidateQueries({ queryKey: ['token-info'] }), [queryClient]);
  const fetchDevices = useCallback(() => queryClient.invalidateQueries({ queryKey: ['devices'] }), [queryClient]);
  const fetchAlerts = useCallback(() => queryClient.invalidateQueries({ queryKey: ['alerts'] }), [queryClient]);

  // ── Derived: device aggregates ────────────────────────────────────────

  const deviceSummary = useMemo(() => {
    const items = devices?.items || devices?.devices || (Array.isArray(devices) ? devices : []);
    const total = items.length;

    const byType = { AP: [], SWITCH: [], GATEWAY: [] };
    items.forEach((d) => {
      const t = (d.device_type || d.deviceType || d.aruba_device_type || '').toUpperCase();
      if (t.includes('AP') || t.includes('IAP') || t === 'ACCESS_POINT') {
        byType.AP.push(d);
      } else if (t.includes('SWITCH') || t === 'CX' || t === 'AOS_S') {
        byType.SWITCH.push(d);
      } else if (t.includes('GATEWAY') || t.includes('CONTROLLER') || t === 'VPNC') {
        byType.GATEWAY.push(d);
      }
    });

    const countUp = (arr) =>
      arr.filter((d) => {
        const s = (d.status || d.device_status || '').toLowerCase();
        return s === 'up' || s === 'online' || s === 'green';
      }).length;

    return {
      total,
      aps: { total: byType.AP.length, up: countUp(byType.AP), down: byType.AP.length - countUp(byType.AP) },
      switches: { total: byType.SWITCH.length, up: countUp(byType.SWITCH), down: byType.SWITCH.length - countUp(byType.SWITCH) },
      gateways: { total: byType.GATEWAY.length, up: countUp(byType.GATEWAY), down: byType.GATEWAY.length - countUp(byType.GATEWAY) },
    };
  }, [devices]);

  // ── Derived: alerts list ──────────────────────────────────────────────

  const alertsList = useMemo(() => {
    const raw = alerts?.items || alerts?.alerts || (Array.isArray(alerts) ? alerts : []);
    return raw.slice(0, 10);
  }, [alerts]);

  // ── Derived: health details ───────────────────────────────────────────

  const healthDetails = useMemo(() => {
    if (!health) return [];
    const details = [];
    if (health.version) details.push({ label: 'Version', value: health.version });
    if (health.status) details.push({ label: 'Status', value: health.status, color: health.status === 'ok' || health.status === 'healthy' ? GREEN : RED });
    if (health.client_status) details.push({ label: 'Client Status', value: health.client_status });
    if (health.central_status) details.push({ label: 'Central Status', value: health.central_status });
    if (health.uptime) details.push({ label: 'Uptime', value: health.uptime });
    if (health.timestamp) details.push({ label: 'Timestamp', value: new Date(health.timestamp).toLocaleTimeString() });
    // Fallback: show raw keys if we got nothing recognizable
    if (details.length === 0) {
      Object.entries(health).forEach(([k, v]) => {
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          details.push({ label: k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), value: String(v) });
        }
      });
    }
    return details;
  }, [health]);

  // ── Derived: token details ────────────────────────────────────────────

  const tokenDetails = useMemo(() => {
    if (!tokenInfo) return [];
    const details = [];

    // Expiry
    if (tokenInfo.expires_at || tokenInfo.expiry || tokenInfo.token_expiry) {
      const exp = tokenInfo.expires_at || tokenInfo.expiry || tokenInfo.token_expiry;
      const expDate = new Date(typeof exp === 'number' && exp < 1e12 ? exp * 1000 : exp);
      details.push({ label: 'Expires At', value: expDate.toLocaleString() });

      const remaining = expDate - Date.now();
      if (remaining > 0) {
        const mins = Math.floor(remaining / 60000);
        const hrs = Math.floor(mins / 60);
        const remMins = mins % 60;
        details.push({
          label: 'Time Remaining',
          value: hrs > 0 ? `${hrs}h ${remMins}m` : `${mins}m`,
          color: mins < 10 ? RED : mins < 30 ? ORANGE : GREEN,
        });
      } else {
        details.push({ label: 'Time Remaining', value: 'Expired', color: RED });
      }
    }

    if (tokenInfo.token_type) details.push({ label: 'Token Type', value: tokenInfo.token_type });
    if (tokenInfo.scope) details.push({ label: 'Scope', value: tokenInfo.scope });
    if (tokenInfo.client_id) details.push({ label: 'Client ID', value: `...${tokenInfo.client_id.slice(-8)}` });

    // Fallback
    if (details.length === 0) {
      Object.entries(tokenInfo).forEach(([k, v]) => {
        if (typeof v === 'string' || typeof v === 'number') {
          details.push({ label: k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), value: String(v) });
        }
      });
    }
    return details;
  }, [tokenInfo]);

  // ── Derived: connection status ────────────────────────────────────────

  const connectionOk = !healthError && health;
  const connectionDetails = useMemo(() => {
    const details = [
      {
        label: 'Status',
        value: connectionOk ? 'Connected' : 'Disconnected',
        color: connectionOk ? GREEN : RED,
      },
    ];
    if (health?.base_url || health?.region) {
      if (health.base_url) details.push({ label: 'Base URL', value: health.base_url });
      if (health.region) details.push({ label: 'Region', value: health.region });
    }
    if (lastRefresh) {
      details.push({ label: 'Last Check', value: lastRefresh.toLocaleTimeString() });
    }
    details.push({ label: 'Auto-refresh', value: '60s' });
    return details;
  }, [connectionOk, health, lastRefresh]);

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            System Status
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time health monitoring of backend services, tokens, and device infrastructure
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {refreshing && <CircularProgress size={20} />}
          <Tooltip title="Refresh now">
            <IconButton onClick={fetchAll} disabled={refreshing} sx={{ color: ACCENT }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {lastRefresh && (
            <Typography variant="caption" color="text.secondary">
              Updated {lastRefresh.toLocaleTimeString()}
            </Typography>
          )}
        </Box>
      </Box>

      {/* ─── Section 1: System Health Cards ───────────────────────────── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <HealthCard
            title="Backend Status"
            icon={DnsIcon}
            status={health?.status || (healthError ? 'error' : 'unknown')}
            details={healthDetails}
            loading={healthLoading}
            error={healthError}
            onRetry={fetchHealth}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HealthCard
            title="Token Status"
            icon={VpnKeyIcon}
            status={tokenInfo && !tokenError ? 'ok' : tokenError ? 'error' : 'unknown'}
            details={tokenDetails}
            loading={tokenLoading}
            error={tokenError}
            onRetry={fetchTokenInfo}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HealthCard
            title="Connection to Aruba Central"
            icon={LinkIcon}
            status={connectionOk ? 'connected' : 'disconnected'}
            details={connectionDetails}
            loading={healthLoading}
            error=""
          />
        </Grid>
      </Grid>

      {/* ─── Section 2: Device Summary ────────────────────────────────── */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Device Summary
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DeviceSummaryCard
            title="Total Devices"
            icon={DevicesIcon}
            total={deviceSummary.total}
            up={deviceSummary.aps.up + deviceSummary.switches.up + deviceSummary.gateways.up}
            down={deviceSummary.aps.down + deviceSummary.switches.down + deviceSummary.gateways.down}
            color={ACCENT}
            loading={devicesLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DeviceSummaryCard
            title="Access Points"
            icon={WifiIcon}
            total={deviceSummary.aps.total}
            up={deviceSummary.aps.up}
            down={deviceSummary.aps.down}
            color={BLUE}
            loading={devicesLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DeviceSummaryCard
            title="Switches"
            icon={RouterIcon}
            total={deviceSummary.switches.total}
            up={deviceSummary.switches.up}
            down={deviceSummary.switches.down}
            color="#8B5CF6"
            loading={devicesLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DeviceSummaryCard
            title="Gateways"
            icon={SecurityIcon}
            total={deviceSummary.gateways.total}
            up={deviceSummary.gateways.up}
            down={deviceSummary.gateways.down}
            color="#06B6D4"
            loading={devicesLoading}
          />
        </Grid>
      </Grid>

      {/* Device error */}
      {devicesError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button size="small" color="inherit" onClick={fetchDevices}>
              Retry
            </Button>
          }
        >
          {devicesError}
        </Alert>
      )}

      {/* ─── Section 3: Recent Alerts ─────────────────────────────────── */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Recent Alerts
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {alertsLoading ? (
            <Box sx={{ p: 3 }}>
              {[...Array(5)].map((_, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="20%" sx={{ ml: 'auto' }} />
                </Box>
              ))}
            </Box>
          ) : alertsError ? (
            <Box sx={{ p: 3 }}>
              <Alert
                severity="error"
                action={
                  <Button size="small" color="inherit" onClick={fetchAlerts}>
                    Retry
                  </Button>
                }
              >
                {alertsError}
              </Alert>
            </Box>
          ) : alertsList.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 48, color: GREEN, mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                No recent alerts
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: 40 }}>Sev</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 180 }}>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alertsList.map((alert, idx) => {
                    const sev = getSeverity(alert);
                    const SevIcon = sev.icon;
                    const msg =
                      alert.description || alert.message || alert.alert_text || alert.details || alert.name || 'Alert';
                    const ts = alert.timestamp || alert.created_at || alert.time || alert.raised_at;
                    const tsDisplay = ts
                      ? new Date(typeof ts === 'number' && ts < 1e12 ? ts * 1000 : ts).toLocaleString()
                      : '-';

                    return (
                      <TableRow key={alert.id || idx} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell>
                          <Tooltip title={sev.label}>
                            <SevIcon sx={{ color: sev.color, fontSize: 20 }} />
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {msg}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {tsDisplay}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* ─── Section 4: API Health ────────────────────────────────────── */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        API Health
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {/* Response time */}
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <SpeedIcon sx={{ color: ACCENT }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Response Time
                </Typography>
              </Box>
              {apiResponseTime !== null ? (
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: apiResponseTime < 500 ? GREEN : apiResponseTime < 1500 ? ORANGE : RED,
                    }}
                  >
                    {apiResponseTime}
                    <Typography component="span" variant="body2" sx={{ ml: 0.5 }}>
                      ms
                    </Typography>
                  </Typography>
                  <Chip
                    label={apiResponseTime < 500 ? 'Fast' : apiResponseTime < 1500 ? 'Moderate' : 'Slow'}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor:
                        apiResponseTime < 500
                          ? `${GREEN}20`
                          : apiResponseTime < 1500
                          ? `${ORANGE}20`
                          : `${RED}20`,
                      color: apiResponseTime < 500 ? GREEN : apiResponseTime < 1500 ? ORANGE : RED,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              ) : (
                <Skeleton variant="text" width={80} height={48} />
              )}
            </Grid>

            {/* Base URL */}
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <DnsIcon sx={{ color: ACCENT }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Configured Base URL
                </Typography>
              </Box>
              {health ? (
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    p: 1,
                    borderRadius: 1,
                    wordBreak: 'break-all',
                  }}
                >
                  {health.base_url || health.api_url || health.central_url || 'Not reported'}
                </Typography>
              ) : healthLoading ? (
                <Skeleton variant="text" width="100%" />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Unavailable
                </Typography>
              )}
            </Grid>

            {/* Region */}
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <TimerIcon sx={{ color: ACCENT }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Region / Cluster
                </Typography>
              </Box>
              {health ? (
                <Box>
                  <Chip
                    label={health.region || health.cluster || health.datacenter || 'Default'}
                    size="small"
                    sx={{
                      backgroundColor: `${ACCENT}20`,
                      color: ACCENT,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              ) : healthLoading ? (
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 2 }} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Unavailable
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
