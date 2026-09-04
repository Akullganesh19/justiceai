// src/lib/phantomFetch.js

// Request coalescing for GET requests
const inFlight = new Map();

export function installPhantomFetch() {
  if (typeof window !== 'undefined' && window.fetch && !window.fetch.__isPhantom) {
    const originalFetch = window.fetch;

    window.fetch = async function(...args) {
      let url, method, options;
      let requestObj = null;

      // Handle Request object vs String URL
      if (args[0] instanceof Request) {
        requestObj = args[0];
        url = requestObj.url;
        method = requestObj.method || 'GET';
        options = args[1] || {};

        // Options override Request
        method = options.method || method;
      } else {
        url = args[0];
        options = args[1] || {};
        method = options.method || 'GET';
      }

      method = method.toUpperCase();

      // We only safely coalesce GET requests to prevent issues with POST/PUT/DELETE mutations
      if (method !== 'GET') {
        return originalFetch.apply(window, args);
      }

      // Safe check for URL stringification
      const urlString = typeof url === 'string' ? url : (url.url || url.toString());

      // If there is an AbortSignal, we cannot safely coalesce, because one caller aborting
      // would abort the shared promise for the other caller.
      const signal = options.signal || (requestObj && requestObj.signal);
      if (signal) {
         return originalFetch.apply(window, args);
      }

      // Generate cache key for coalescing based on URL, headers, credentials, and mode
      let optionsHeaders = options.headers || (requestObj && requestObj.headers);
      let headersKey = '';
      if (optionsHeaders) {
        try {
          const headersObj = new Headers(optionsHeaders);
          headersKey = [...headersObj.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}:${v}`)
            .join('|');
        } catch (_e) {
          // Ignore
        }
      }

      const credentials = options.credentials || (requestObj && requestObj.credentials) || 'same-origin';
      const mode = options.mode || (requestObj && requestObj.mode) || 'cors';

      const cacheKey = `${method}:${urlString}:${headersKey}:${credentials}:${mode}`;

      // 1. Request Coalescing
      // If a request for the exact same URL + headers + options is already in flight, reuse its promise
      if (inFlight.has(cacheKey)) {
        const promise = inFlight.get(cacheKey);
        // Clone the response from the shared promise so multiple callers don't consume the same body
        const response = await promise;
        return response.clone();
      }

      // 2. Make the actual request
      const fetchPromise = originalFetch.apply(window, args)
        .finally(() => {
          inFlight.delete(cacheKey);
        });

      inFlight.set(cacheKey, fetchPromise);

      const response = await fetchPromise;
      return response.clone();
    };

    window.fetch.__isPhantom = true;
  }
}
