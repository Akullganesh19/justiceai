export function initPhantomInfrastructure() {
  if (typeof window === 'undefined' || window._phantomInitialized) return;
  window._phantomInitialized = true;

  const originalFetch = window.fetch;
  const inFlightRequests = new Map();
  const cache = new Map();

  // Stale-While-Revalidate TTL (in ms)
  const TTL = 5 * 60 * 1000; // 5 minutes

  window.fetch = async function (input, init = {}) {
    // We only optimize GET requests that don't explicitly opt out
    const isGet = !init.method || init.method.toUpperCase() === 'GET';
    const noCache = init.cache === 'no-store' || init.cache === 'no-cache';

    // Normalize URL
    let urlStr;
    if (typeof input === 'string') {
      urlStr = input;
    } else if (input instanceof Request) {
      urlStr = input.url;
      // If it's a request object and not a GET, skip
      if (input.method && input.method.toUpperCase() !== 'GET') {
        return originalFetch(input, init);
      }
    } else {
      urlStr = input.toString();
    }

    // Bypass health checks and non-cacheable paths
    if (urlStr.includes('/api/health') || urlStr.includes('/api/chat') || urlStr.includes('/api/embed')) {
        return originalFetch(input, init);
    }

    if (!isGet || noCache) {
      return originalFetch(input, init);
    }

    // Build deterministic cache key (URL + headers)
    const headersKey = init.headers ? JSON.stringify(init.headers) : '';
    const cacheKey = `${urlStr}::${headersKey}`;

    // 1. Check Cache (Stale-While-Revalidate)
    const cachedEntry = cache.get(cacheKey);
    const now = Date.now();

    if (cachedEntry) {
      const isStale = now - cachedEntry.timestamp > TTL;

      if (!isStale) {
        // Cache is fresh, return immediately
        return cachedEntry.response.clone();
      } else {
        // Cache is stale. We will return the stale data, but trigger a background fetch to revalidate
        // Only trigger background fetch if one isn't already in flight
        if (!inFlightRequests.has(cacheKey)) {
          originalFetch(input, init)
            .then(res => {
              if (res.ok) {
                 cache.set(cacheKey, {
                    timestamp: Date.now(),
                    response: res.clone()
                 });
              }
            })
            .catch(_err => {
              console.warn('Phantom Background revalidation failed:', _err);
            });

           // We don't await this, it happens in background
        }

        return cachedEntry.response.clone();
      }
    }

    // 2. Request Coalescing (Deduplication)
    if (inFlightRequests.has(cacheKey)) {
      // Another identical request is already flying, just await it
      const sharedPromise = inFlightRequests.get(cacheKey);
      const response = await sharedPromise;
      // Return a clone so each caller gets an unconsumed body
      return response.clone();
    }

    // 3. Actually Fetch
    const fetchPromise = originalFetch(input, init)
      .then(response => {
        // Only cache successful responses
        if (response.ok) {
           cache.set(cacheKey, {
             timestamp: Date.now(),
             response: response.clone()
           });
        }
        return response;
      })
      .finally(() => {
        // Always clean up the in-flight map
        inFlightRequests.delete(cacheKey);
      });

    inFlightRequests.set(cacheKey, fetchPromise);

    const res = await fetchPromise;
    return res.clone();
  };
}
