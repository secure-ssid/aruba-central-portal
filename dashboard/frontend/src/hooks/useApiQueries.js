/**
 * React Query hooks for Aruba Central API data.
 *
 * Replaces manual useState/useEffect/setInterval patterns with
 * automatic caching, deduplication, and background refetching.
 * The QueryClient in App.jsx is already configured with sensible
 * defaults (30 s staleTime, 5 min gcTime, retry: 1).
 */

import { useQuery } from '@tanstack/react-query';
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
} from '../services/api';

// ── Inventory (stable data — 5 min stale) ─────────────────────────────────

export const useDevices = (options = {}) =>
  useQuery({
    queryKey: ['devices'],
    queryFn: () => deviceAPI.getAll(),
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

export const useClients = (siteId, options = {}) =>
  useQuery({
    queryKey: ['clients', siteId ?? 'all'],
    queryFn: () => getClients(siteId),
    staleTime: 30_000,
    ...options,
  });

// ── Alerts / Notifications ────────────────────────────────────────────────

export const useAlerts = (options = {}) =>
  useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertsAPI.getAll(),
    staleTime: 30_000,
    ...options,
  });

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

// ── Service Capacity ───────────���──────────────────────────────────────────

export const useServiceCapacity = (options = {}) =>
  useQuery({
    queryKey: ['service-capacity'],
    queryFn: () => servicesAPI.getCapacity(),
    staleTime: 5 * 60_000,
    ...options,
  });
