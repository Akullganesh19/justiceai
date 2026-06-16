/**
 * A caching and coalescing fetch utility.
 * It deduplicates simultaneous requests and caches GET requests.
 * Uses a Stale-While-Revalidate strategy to return fast but stay fresh.
 */

const inFlight = new Map();
const cache = new Map();

// Default TTL of 60 seconds
const DEFAULT_TTL = 60000;

export async function fetchWithCache(url, options = {}, ttl = DEFAULT_TTL) {
  const method = (options.method || 'GET').toUpperCase();

  // Only cache and coalesce GET requests
  if (method !== 'GET') {
    return fetch(url, options);
  }

  const cacheKey = url;

  // 1. Check valid cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    const now = Date.now();

    // Stale-While-Revalidate: If it's stale, fire a background refresh
    if (now > cached.expires) {
      if (!inFlight.has(cacheKey)) {
        // Fire and forget, catching errors to avoid unhandled rejections
        refreshCache(url, options, ttl).catch(err => {
          console.warn(`Background refresh failed for ${url}:`, err);
        });
      }
    }

    // Always return the cached version immediately (fast path)
    return cached.response.clone();
  }

  // 2. Coalesce in-flight requests (if it's already fetching, just wait for that promise)
  if (inFlight.has(cacheKey)) {
    return inFlight.get(cacheKey).then(res => res.clone());
  }

  // 3. Make actual request if not in cache or in-flight
  return refreshCache(url, options, ttl).then(res => res.clone());
}

/**
 * Internal helper to actually hit the network, update the cache, and manage in-flight status.
 */
function refreshCache(url, options, ttl) {
  const cacheKey = url;

  const promise = fetch(url, options)
    .then(response => {
      // Only cache successful responses
      if (response.ok) {
        // Clone before putting in cache because bodies can only be read once
        const toCache = response.clone();
        cache.set(cacheKey, {
          response: toCache,
          expires: Date.now() + ttl
        });
      }
      return response;
    })
    .catch(err => {
      // If a background refresh fails, we might want to keep the stale data
      // For now, we just pass the error along if someone is waiting for it
      throw err;
    })
    .finally(() => {
      inFlight.delete(cacheKey);
    });

  inFlight.set(cacheKey, promise);
  return promise;
}

export function clearCache() {
  cache.clear();
}
