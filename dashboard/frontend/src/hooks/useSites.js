/**
 * Shared hook for loading sites with multi-API fallback.
 *
 * Tries sitesConfigAPI first, falls back to configAPI, then monitoringAPIv2.
 * Returns { sites, loading, error } with normalized site objects that always
 * have `scopeId` and `name` fields.
 */

import { useState, useEffect, useCallback } from 'react';
import { sitesConfigAPI, configAPI, monitoringAPIv2 } from '../services/api';

/**
 * Extract a user-friendly error message from an axios error or generic Error.
 */
function extractErrorMessage(err, fallback = 'Unknown error') {
  if (!err) return fallback;
  if (err.response?.data) {
    const d = err.response.data;
    if (typeof d === 'string') return d;
    if (d.error) return d.error;
    if (d.message) return d.message;
  }
  return err.message || fallback;
}

/**
 * Normalise a raw site object coming from any of the three APIs so that
 * every entry has at least `scopeId` and `name`.
 */
function normalizeSite(raw) {
  return {
    scopeId: raw.scopeId || raw.id || raw.siteId || raw.site_id,
    name:
      raw.scopeName ||
      raw.name ||
      raw.siteName ||
      raw.site_name ||
      raw.displayName ||
      raw.display_name ||
      undefined,
    ...raw,
  };
}

/**
 * Try to extract an array of sites from a response that could be an array
 * or a wrapper object with various key names.
 */
function extractArray(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    return (
      data.items ||
      data.data ||
      data.sites ||
      data.results ||
      []
    );
  }
  return [];
}

/**
 * useSites – load sites with cascading API fallback.
 *
 * @returns {{ sites: Array, loading: boolean, error: string|null, reload: Function }}
 */
export default function useSites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    let lastError = null;

    // --- 1. sitesConfigAPI (Configuration API) --------------------------------
    try {
      let sitesData;
      try {
        sitesData = await sitesConfigAPI.getSites({ limit: 100, offset: 0 });
      } catch (_paramErr) {
        sitesData = await sitesConfigAPI.getSites({});
      }

      let list = extractArray(sitesData)
        .map(normalizeSite)
        .filter((s) => s.scopeId);

      if (list.length > 0) {
        setSites(list);
        setLoading(false);
        return;
      }
      lastError = new Error('Configuration API returned empty result');
    } catch (err) {
      lastError = err;
    }

    // --- 2. configAPI (Central v2 Sites) --------------------------------------
    try {
      const v2Data = await configAPI.getSites();

      let list = extractArray(v2Data).map((raw) =>
        normalizeSite({
          scopeId: raw.site_id || raw.id || raw.scopeId,
          name: raw.site_name || raw.name || raw.display_name,
          siteName: raw.site_name || raw.name || raw.display_name,
          ...raw,
        })
      ).filter((s) => s.scopeId);

      if (list.length > 0) {
        setSites(list);
        setLoading(false);
        return;
      }
    } catch (err) {
      lastError = err;
    }

    // --- 3. monitoringAPIv2.getSitesHealth (Monitoring API) --------------------
    try {
      const healthData = await monitoringAPIv2.getSitesHealth({ limit: 100, offset: 0 });
      const items = extractArray(healthData);

      let list = items.map((item) =>
        normalizeSite({
          scopeId: item.scopeId || item.siteId || item.id,
          name: item.scopeName || item.siteName || item.name || item.displayName,
          siteName: item.scopeName || item.siteName || item.name || item.displayName,
          ...item,
        })
      ).filter((s) => s.scopeId);

      if (list.length > 0) {
        setSites(list);
        setLoading(false);
        return;
      }
    } catch (err) {
      lastError = err;
    }

    // --- All APIs failed ------------------------------------------------------
    setSites([]);
    setError(extractErrorMessage(lastError, 'Failed to load sites from all available APIs'));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { sites, loading, error, reload: load };
}
