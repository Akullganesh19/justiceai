// 🌀 Phantom Infrastructure Layer
// Invisible Request Coalescing & Stale-While-Revalidate Caching

const originalFetch = window.fetch;
const inFlight = new Map();
const cache = new Map();
const MAX_CACHE_SIZE = 100;

window.__phantomStats = {
  requestsCoalesced: 0,
  cacheHits: 0,
  estimatedTimeSavedMs: 0
};

window.fetch = async function(input, init) {
  const isRequest = input instanceof Request;
  const method = (init?.method || (isRequest ? input.method : 'GET')).toUpperCase();

  // We only coalesce and cache GET requests safely
  if (method !== 'GET') {
    return originalFetch(input, init);
  }

  // Normalize URL string from string, Request, or URL objects
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.href;
  } else if (isRequest) {
    url = input.url;
  }

  // Include simple auth header in cache key if present to prevent mixing users
  let cacheKey = url;

  let authHeader = null;
  if (init?.headers) {
    if (init.headers instanceof Headers) {
      authHeader = init.headers.get('Authorization') || init.headers.get('authorization');
    } else if (typeof init.headers === 'object' && !Array.isArray(init.headers)) {
      authHeader = init.headers.Authorization || init.headers.authorization;
    }
  }

  if (authHeader) cacheKey += `|${authHeader}`;

  if (!url) {
    return originalFetch(input, init);
  }

  const startTime = performance.now();

  // 1. Check Cache (Stale-While-Revalidate)
  if (cache.has(cacheKey)) {
    const { response, timestamp, latency } = cache.get(cacheKey);
    const age = Date.now() - timestamp;
    const isStale = age > 60000; // 1 minute TTL

    if (isStale) {
      // Revalidate in background without blocking
      originalFetch(input, init)
        .then(res => {
          if (res.ok) {
            // Move to end (most recently used)
            cache.delete(cacheKey);
            cache.set(cacheKey, { response: res.clone(), timestamp: Date.now(), latency });
          }
        })
        .catch(err => console.debug('🌀 Phantom: Background revalidation failed', err));
    }

    window.__phantomStats.cacheHits++;
    window.__phantomStats.estimatedTimeSavedMs += latency;
    console.debug(`🌀 Phantom: Cache hit for ${url} (saved ~${Math.round(latency)}ms)`);

    return response.clone();
  }

  // 2. Check In-Flight Requests (Coalescing)
  if (inFlight.has(cacheKey)) {
    window.__phantomStats.requestsCoalesced++;
    console.debug(`🌀 Phantom: Coalesced request for ${url}`);
    const promise = inFlight.get(cacheKey);
    const res = await promise;
    return res.clone();
  }

  // 3. Perform Actual Network Request
  const fetchPromise = originalFetch(input, init)
    .then(res => {
      if (res.ok) {
        const latency = performance.now() - startTime;

        // Enforce max cache size (LRU-like behavior by relying on Map insertion order)
        if (cache.size >= MAX_CACHE_SIZE) {
          const oldestKey = cache.keys().next().value;
          cache.delete(oldestKey);
        }

        cache.set(cacheKey, { response: res.clone(), timestamp: Date.now(), latency });
      }
      return res;
    })
    .finally(() => {
      inFlight.delete(cacheKey);
    });

  inFlight.set(cacheKey, fetchPromise);

  const finalRes = await fetchPromise;
  return finalRes.clone();
};

export default {};
