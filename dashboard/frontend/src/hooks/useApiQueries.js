/**
 * React Query hooks for Aruba Central API data.
 *
 * Replaces manual useState/useEffect/setInterval patterns with
 * automatic caching, deduplication, and background refetching.
 * The QueryClient in App.jsx is already configured with sensible
 * defaults (30 s staleTime, 5 min gcTime, retry: 1).
 */

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAlertSSE } from '../components/EventFeedProvider';
import {
  monitoringAPI,
  monitoringAPIv2,
  deviceAPI,
  sitesConfigAPI,
  servicesAPI,
  getClients,
  alertsAPI,
  tokenAPI,
  rateLimitAPI,
  greenlakeUserAPI,
  greenlakeTagsAPI,
  greenlakeDeviceAPI,
  greenlakeSubscriptionsAPI,
  syslogAPI,
} from '../services/api';
import apiClient from '../services/api';

// ── Inventory (stable data — 5 min stale) ─────────────────────────────────

export const useDevices = (options = {}) =>
  useQuery({
    queryKey: ['devices'],
    queryFn: () => deviceAPI.getAll(),
    staleTime: 5 * 60_000,
    ...options,
  });

export const useSwitches = (options = {}) =>
  useQuery({
    queryKey: ['switches'],
    queryFn: () => deviceAPI.getSwitches(),
    staleTime: 5 * 60_000,
    ...options,
  });

export const useAccessPoints = (options = {}) =>
  useQuery({
    queryKey: ['access-points'],
    queryFn: () => deviceAPI.getAccessPoints(),
    staleTime: 5 * 60_000,
    ...options,
  });

export const useGateways = (options = {}) =>
  useQuery({
    queryKey: ['gateways'],
    queryFn: () => monitoringAPIv2.getGatewaysMonitoring(),
    staleTime: 5 * 60_000,
    ...options,
  });

export const useSites = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['sites', params],
    queryFn: () => sitesConfigAPI.getSites(params),
    staleTime: 5 * 60_000,
    ...options,
  });

export const useSubscriptions = (options = {}) =>
  useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => servicesAPI.getSubscriptions(),
    staleTime: 5 * 60_000,
    ...options,
  });

// ── Health / Monitoring (fresher data — 30 s stale, optional polling) ─────

export const useNetworkHealth = (options = {}) =>
  useQuery({
    queryKey: ['network-health'],
    queryFn: () => monitoringAPI.getNetworkHealth(),
    staleTime: 30_000,
    ...options,
  });

export const useServicesHealth = (options = {}) =>
  useQuery({
    queryKey: ['services-health'],
    queryFn: () => servicesAPI.getHealth(),
    staleTime: 30_000,
    ...options,
  });

export const useSitesHealth = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['sites-health', params],
    queryFn: () => monitoringAPIv2.getSitesHealth(params),
    staleTime: 30_000,
    ...options,
  });

export const useSitesDeviceHealth = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['sites-device-health', params],
    queryFn: () => monitoringAPIv2.getSitesDeviceHealth(params),
    staleTime: 30_000,
    ...options,
  });

// ── Clients ───���───────────────────────────────────────────────────────────

// ── Top APs by Bandwidth ─────────────────────────────────────────────────

export const useTopAPsByBandwidth = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['top-aps-bandwidth', params],
    queryFn: () => monitoringAPIv2.getTopAPsByBandwidth(params),
    staleTime: 60_000,
    ...options,
  });

// ── Sites Health Scores ──────────────────────────────────────────────────

export const useSitesHealthScores = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['sites-health-scores', params],
    queryFn: () => monitoringAPIv2.getSitesHealth(params),
    staleTime: 60_000,
    ...options,
  });

export const useClients = (siteId, options = {}) =>
  useQuery({
    queryKey: ['clients', siteId ?? 'all'],
    queryFn: () => getClients(siteId),
    staleTime: 30_000,
    ...options,
  });

// ── Alerts / Notifications ────────────────────────────────────────────────
// Primary: SSE stream pushes real-time alert updates via EventFeedProvider.
// Fallback: React Query polling resumes automatically when SSE disconnects.
// The initial fetch on mount always runs so the user sees data immediately.

export const useAlerts = (options = {}) => {
  const queryClient = useQueryClient();
  const { alerts: sseAlerts, alertsConnected } = useAlertSSE();

  // When SSE delivers new alert data, inject it into React Query cache
  // so every component reading ['alerts'] gets the update for free.
  useEffect(() => {
    if (sseAlerts) {
      queryClient.setQueryData(['alerts'], sseAlerts);
    }
  }, [sseAlerts, queryClient]);

  // Compute fallback polling interval: use caller's refetchInterval if
  // provided, otherwise default to 30s.  When SSE is connected we disable
  // polling entirely so we don't waste API calls.
  const fallbackInterval = options.refetchInterval ?? 30_000;

  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertsAPI.getAll(),
    staleTime: 30_000,
    ...options,
    // Must come AFTER ...options so SSE-connected state always wins.
    refetchInterval: alertsConnected ? false : fallbackInterval,
  });
};

// ── Token / Rate Limit ──────────────���─────────────────────────────────────

export const useTokenInfo = (options = {}) =>
  useQuery({
    queryKey: ['token-info'],
    queryFn: () => tokenAPI.getInfo(),
    staleTime: 30_000,
    ...options,
  });

export const useRateLimit = (options = {}) =>
  useQuery({
    queryKey: ['rate-limit'],
    queryFn: () => rateLimitAPI.getStatus(),
    staleTime: 30_000,
    ...options,
  });

// ── Service Capacity ───────────────────────────────────────────────────────

export const useServiceCapacity = (options = {}) =>
  useQuery({
    queryKey: ['service-capacity'],
    queryFn: () => servicesAPI.getCapacity(),
    staleTime: 5 * 60_000,
    ...options,
  });

// ── GreenLake / HPE Global Layer ──────────────────────────────────────────

export const useGLPermissions = (options = {}) =>
  useQuery({
    queryKey: ['gl-permissions'],
    queryFn: () => apiClient.get('/greenlake/permissions').then(r => r.data),
    staleTime: 5 * 60_000,
    ...options,
  });

export const useGLRolePermissions = (options = {}) =>
  useQuery({
    queryKey: ['gl-role-permissions'],
    queryFn: () => apiClient.get('/greenlake/role-permissions').then(r => r.data),
    staleTime: 5 * 60_000,
    ...options,
  });

export const useGLUsers = ({ filter = null, limit = 100, offset = 0 } = {}, options = {}) =>
  useQuery({
    queryKey: ['gl-users', { filter, limit, offset }],
    queryFn: () => greenlakeUserAPI.list({ filter, limit, offset }),
    staleTime: 30_000,
    ...options,
  });

export const useGLTags = (options = {}) =>
  useQuery({
    queryKey: ['gl-tags'],
    queryFn: () => greenlakeTagsAPI.list().then(r => r?.items || r?.tags || r || []),
    staleTime: 5 * 60_000,
    ...options,
  });

export const useGLDevices = ({ page = 1, limit = 25 } = {}, options = {}) =>
  useQuery({
    queryKey: ['gl-devices', { page, limit }],
    queryFn: () => greenlakeDeviceAPI.list({ offset: (page - 1) * limit, limit }),
    staleTime: 5 * 60_000,
    ...options,
  });

export const useGLSubscriptions = ({ page = 1, limit = 25 } = {}, options = {}) =>
  useQuery({
    queryKey: ['gl-subscriptions', { page, limit }],
    queryFn: () => greenlakeSubscriptionsAPI.list({ offset: (page - 1) * limit, limit }),
    staleTime: 5 * 60_000,
    ...options,
  });

export const useGLLocations = ({ page = 1, limit = 25 } = {}, options = {}) =>
  useQuery({
    queryKey: ['gl-locations', { page, limit }],
    queryFn: () => apiClient.get('/greenlake/locations', { params: { offset: (page - 1) * limit, limit } }).then(r => r.data),
    staleTime: 5 * 60_000,
    ...options,
  });

// ── Local-network syslog pipeline (phase 6) ──────────────────────────────
// The clusterer ticks every ~30s server-side, so refetching once a minute
// keeps the dashboard fresh without over-polling the API.

export const useSyslogAlerts = ({ approvedOnly = true, sinceHours, limit = 50 } = {}, options = {}) => {
  const params = { limit };
  if (approvedOnly) params.approved_only = true;
  if (sinceHours !== undefined) params.since_hours = sinceHours;
  return useQuery({
    queryKey: ['syslog-alerts', params],
    queryFn: () => syslogAPI.getAlerts(params),
    staleTime: 30_000,
    refetchInterval: 60_000,
    ...options,
  });
};

export const useSyslogIncidents = (
  { status, sinceHours, severityMax, anomalyMin, orderBy = 'last_seen', limit = 50 } = {},
  options = {},
) => {
  const params = { limit, order_by: orderBy };
  if (status) params.status = status;
  if (sinceHours !== undefined) params.since_hours = sinceHours;
  if (severityMax !== undefined) params.severity_max = severityMax;
  if (anomalyMin !== undefined) params.anomaly_min = anomalyMin;
  return useQuery({
    queryKey: ['syslog-incidents', params],
    queryFn: () => syslogAPI.getIncidents(params),
    staleTime: 30_000,
    refetchInterval: 60_000,
    ...options,
  });
};

export const useSyslogIncident = (id, options = {}) =>
  useQuery({
    queryKey: ['syslog-incident', id],
    queryFn: () => syslogAPI.getIncident(id),
    enabled: id != null,
    staleTime: 30_000,
    ...options,
  });

export const useSyslogStats = (windowHours = 24, options = {}) =>
  useQuery({
    queryKey: ['syslog-stats', windowHours],
    queryFn: () => syslogAPI.getStats(windowHours),
    staleTime: 30_000,
    refetchInterval: 60_000,
    ...options,
  });
