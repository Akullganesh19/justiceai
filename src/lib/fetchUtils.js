const inFlight = new Map();
const cache = new Map();
const DEFAULT_TTL = 60 * 1000; // 1 minute

/**
 * Enhanced fetch with request coalescing, caching, and stale-while-revalidate.
 *
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options (e.g. method, headers)
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Promise<Response>}
 */
export async function fetchWithCache(url, options = {}, ttl = DEFAULT_TTL) {
  // Only cache GET requests
  const method = options.method ? options.method.toUpperCase() : 'GET';
  if (method !== 'GET') {
    return fetch(url, options);
  }

  const cacheKey = url;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  // 1. If we have a fresh cache, return a clone immediately
  if (cached && now - cached.timestamp < ttl) {
    return cached.response.clone();
  }

  // 2. Stale-while-revalidate: if we have stale cache, serve it, but fetch in background
  if (cached) {
    // Check if background fetch is already happening so we don't start multiple
    if (!inFlight.has(cacheKey)) {
      const backgroundPromise = fetch(url, options)
        .then(res => {
          if (res.ok) {
            cache.set(cacheKey, { response: res.clone(), timestamp: Date.now() });
          }
          return res;
        })
        .catch(_err => {
          // Intentionally swallow error for background refresh but rethrow so waiting coalescers fail properly
          throw _err;
        })
        .finally(() => {
          if (inFlight.get(cacheKey) === backgroundPromise) {
            inFlight.delete(cacheKey);
          }
        });

      // We purposefully don't `await` it because this is SWR, but we store it for coalescing!
      inFlight.set(cacheKey, backgroundPromise);

      // Prevent unhandled promise rejections on the background task since we just spawned it and aren't returning it
      backgroundPromise.catch(() => {});
    }

    // Return stale immediately
    return cached.response.clone();
  }

  // 3. Request Coalescing (No cache exists at all, so we wait for network)
  if (inFlight.has(cacheKey)) {
    const promise = inFlight.get(cacheKey);
    const response = await promise;
    return response.clone();
  }

  // 4. Standard fetch with caching and coalescing
  const promise = fetch(url, options)
    .then(res => {
      if (res.ok) {
        cache.set(cacheKey, { response: res.clone(), timestamp: Date.now() });
      }
      return res;
    })
    .finally(() => {
      inFlight.delete(cacheKey);
    });

  inFlight.set(cacheKey, promise);
  const res = await promise;
  return res.clone();
}

/**
 * Clears the cache completely. Useful for testing or manual invalidation.
 */
export function clearCache() {
  cache.clear();
  inFlight.clear();
}
