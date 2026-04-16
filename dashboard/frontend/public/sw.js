/**
 * Service Worker — Aruba Central Dashboard
 *
 * Strategy:
 *   - Static assets (JS, CSS, images, fonts): Cache-first, fallback to network
 *   - API calls (/api/): Network-first, no caching (real-time data)
 *   - HTML navigation: Network-first with offline fallback
 *
 * The cache name includes a version string so stale caches can be evicted
 * on deploy by bumping the version.
 */

const CACHE_NAME = 'aruba-central-v1';

// Static assets to pre-cache on install (app shell)
const PRECACHE_URLS = [
  '/',
  '/index.html',
];

// ── Install: pre-cache the app shell ────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  // Activate immediately instead of waiting for existing tabs to close
  self.skipWaiting();
});

// ── Activate: clean up old caches ───────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

// ── Fetch: routing strategy ─────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (POST, PUT, etc.)
  if (request.method !== 'GET') return;

  // Skip API requests — always go to network for real-time data
  if (url.pathname.startsWith('/api/')) return;

  // Skip WebSocket and SSE connections
  if (request.headers.get('Accept')?.includes('text/event-stream')) return;

  // Static assets (JS chunks, CSS, images, fonts): cache-first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML navigation requests: network-first with offline fallback
  if (request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Everything else: network-first
  event.respondWith(networkFirstWithFallback(request));
});

// ── Helpers ─────────────────────────────────────────────────────────────────

function isStaticAsset(pathname) {
  return /\.(js|css|png|jpg|jpeg|svg|gif|ico|woff2?|ttf|eot)$/i.test(pathname)
    || pathname.startsWith('/js/')
    || pathname.startsWith('/assets/')
    || pathname.startsWith('/images/')
    || pathname.startsWith('/fonts/');
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline and not cached — return generic offline response
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // For navigation requests, serve the cached index.html (SPA fallback)
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/index.html');
      if (fallback) return fallback;
    }

    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}
