/**
 * 🌀 Phantom: Invisible Infrastructure - Request Coalescing
 *
 * Intercepts global fetch to prevent identical simultaneous GET requests.
 * If Component A and Component B both mount and fetch `/api/health` at the same time,
 * only one network request is made. Both components receive a cloned response.
 */

let initialized = false;
const inFlight = new Map();

export function initRequestCoalescing() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const originalFetch = window.fetch;

  window.fetch = function (input, init) {
    try {
      // Safely determine method
      const method = init?.method || (input instanceof Request ? input.method : 'GET');

      // Only coalesce GET requests
      if (method.toUpperCase() !== 'GET') {
        return originalFetch.apply(this, arguments);
      }

      // Do not coalesce if an AbortSignal is present (one caller aborting could affect others)
      if (init?.signal || (input instanceof Request && input.signal && input.signal.aborted !== undefined)) {
        return originalFetch.apply(this, arguments);
      }

      // Extract URL
      let url;
      if (typeof input === 'string') url = input;
      else if (input instanceof URL) url = input.toString();
      else if (input instanceof Request) url = input.url;
      else url = String(input);

      // Extract headers to use as part of the cache key
      let headersObj = {};
      if (init?.headers) {
        if (init.headers instanceof Headers) {
          init.headers.forEach((v, k) => (headersObj[k] = v));
        } else {
          headersObj = { ...init.headers };
        }
      } else if (input instanceof Request) {
        input.headers.forEach((v, k) => (headersObj[k] = v));
      }

      const cacheKey = `${url}|${JSON.stringify(headersObj)}`;

      if (inFlight.has(cacheKey)) {
        // console.debug(`🌀 Phantom: Coalescing request to ${url}`);
        return inFlight.get(cacheKey).then((res) => res.clone());
      }

      const promise = originalFetch.apply(this, arguments).finally(() => {
        inFlight.delete(cacheKey);
      });

      inFlight.set(cacheKey, promise);

      return promise.then((res) => res.clone());
    } catch {
      // Fallback to original fetch if coalescing logic fails to prevent blocking user
      return originalFetch.apply(this, arguments);
    }
  };
}
