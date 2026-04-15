/**
 * Shared formatting utilities for display values across the dashboard.
 */

/**
 * Format uptime from seconds to a human-readable string.
 * @param {number} seconds - Uptime in seconds
 * @returns {string} e.g. "3d 4h", "12h 5m", "45m"
 */
export function formatUptime(seconds) {
  if (!seconds && seconds !== 0) return '—';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Format uptime from milliseconds to a human-readable string.
 * @param {number} ms - Uptime in milliseconds
 * @returns {string} e.g. "3d 4h 5m"
 */
export function formatUptimeMs(ms) {
  if (!ms) return 'N/A';
  return formatUptime(Math.floor(ms / 1000));
}

/**
 * Format a byte count to a human-readable string.
 * @param {number} bytes
 * @returns {string} e.g. "1.5 MB", "256 KB"
 */
export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Format bits-per-second to a human-readable string.
 * @param {number} bps
 * @returns {string} e.g. "12.3 Mbps"
 */
export function formatBps(bps) {
  if (!bps && bps !== 0) return '—';
  if (bps === 0) return '0 bps';
  const units = ['bps', 'Kbps', 'Mbps', 'Gbps'];
  const i = Math.min(Math.floor(Math.log(bps) / Math.log(1000)), units.length - 1);
  return `${(bps / Math.pow(1000, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Format a Unix timestamp (seconds) to a locale date/time string.
 * @param {number} ts - Seconds since epoch
 * @returns {string}
 */
export function formatTimestamp(ts) {
  if (!ts) return '—';
  return new Date(ts * 1000).toLocaleString();
}
