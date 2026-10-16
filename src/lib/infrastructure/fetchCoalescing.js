/* global process */
// Request Coalescing Infrastructure
// Transparently deduplicates identical in-flight GET requests
// Reduces network traffic and server load for concurrent requests

const inFlightRequests = new Map();
let originalFetch = null;

export function initFetchCoalescing() {
  if (typeof window === 'undefined' || !window.fetch) return;

  // Prevent double initialization
  if (originalFetch) return;

  // Capture original fetch at initialization time (important for mocking)
  originalFetch = window.fetch;

  window.fetch = async function coalescedFetch(input, init) {
    // Determine method safely (don't consume Request object)
    let method = 'GET';
    if (init && init.method) {
      method = init.method.toUpperCase();
    } else if (input && input.method) {
      method = input.method.toUpperCase();
    }

    // Only coalesce GET requests without an AbortSignal
    if (method !== 'GET' || (init && init.signal) || (input && input.signal)) {
      return originalFetch(input, init);
    }

    let urlStr = '';
    if (typeof input === 'string') {
      urlStr = input;
    } else if (input instanceof URL) {
      urlStr = input.toString();
    } else if (input && typeof input.url === 'string') {
      urlStr = input.url;
    }

    if (!urlStr) {
      return originalFetch(input, init);
    }

    // Attempt to extract headers safely
    let headersStr = '';
    try {
      const extractHeaders = (h) => {
        if (!h) return {};
        if (h instanceof Headers) {
          const res = {};
          h.forEach((val, key) => { res[key] = val; });
          return res;
        }
        return h;
      };

      const headers = {
        ...extractHeaders(input && input.headers),
        ...extractHeaders(init && init.headers)
      };
      headersStr = JSON.stringify(headers);
    } catch {
      // If we can't serialize headers cleanly, bail out of coalescing
      return originalFetch(input, init);
    }

    // Create a stable cache key
    const cacheKey = `${method}:${urlStr}:${headersStr}`;

    if (inFlightRequests.has(cacheKey)) {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[Phantom] Coalesced duplicate fetch for: ${urlStr}`);
      }
      const sharedPromise = inFlightRequests.get(cacheKey);
      // Wait for the shared promise, then return a clone so each caller gets a fresh stream
      const response = await sharedPromise;
      return response.clone();
    }

    const fetchPromise = originalFetch(input, init)
      .finally(() => {
        inFlightRequests.delete(cacheKey);
      });

    inFlightRequests.set(cacheKey, fetchPromise);

    // Wait for the original fetch, then return a clone
    const response = await fetchPromise;
    return response.clone();
  };
}
