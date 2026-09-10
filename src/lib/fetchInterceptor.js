/**
 * 🌀 Phantom Infrastructure: Request Coalescing
 *
 * This interceptor wraps `window.fetch` to ensure that if multiple identical
 * GET requests are made simultaneously, they are coalesced into a single
 * network request. All callers receive the cloned response.
 *
 * This prevents component render storms from triggering duplicate API calls.
 */

if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  const inFlightRequests = new Map();

  // Instrument for stats, useful for monitoring
  window.__phantomStats = window.__phantomStats || { coalesced: 0 };

  window.fetch = function(...args) {
    let url, method, headersObj = {}, signal;

    // Support signature: fetch(Request) OR fetch(string, options)
    const reqOrUrl = args[0];
    const options = args[1] || {};

    if (reqOrUrl instanceof Request) {
      url = reqOrUrl.url;
      method = reqOrUrl.method || 'GET';

      if (reqOrUrl.headers) {
        reqOrUrl.headers.forEach((value, key) => {
          headersObj[key] = value;
        });
      }

      if (options.headers) {
        const optHeaders = options.headers instanceof Headers
          ? Object.fromEntries(options.headers.entries())
          : options.headers;
        Object.assign(headersObj, optHeaders);
      }

      signal = options.signal || reqOrUrl.signal;
      method = options.method || method;
    } else {
      url = reqOrUrl;
      method = options.method || 'GET';
      signal = options.signal;

      if (options.headers) {
        headersObj = options.headers instanceof Headers
          ? Object.fromEntries(options.headers.entries())
          : options.headers;
      }
    }

    method = method.toUpperCase();

    // Do not coalesce non-GET requests or requests with an AbortSignal
    // (Aborting a shared request would abort it for all consumers)
    if (method !== 'GET' || signal) {
      return originalFetch.apply(this, args);
    }

    // Cache key is combination of URL, method, and serialized headers
    const cacheKey = JSON.stringify({ url, method, headers: headersObj });

    // If identical request is already in flight, return the cloned promise
    if (inFlightRequests.has(cacheKey)) {
      window.__phantomStats.coalesced++;
      return inFlightRequests.get(cacheKey).then(res => res.clone());
    }

    // Otherwise, start a new request
    const fetchPromise = originalFetch.apply(this, args).finally(() => {
      // Remove from in-flight cache when complete (success or fail)
      inFlightRequests.delete(cacheKey);
    });

    // Store in cache
    inFlightRequests.set(cacheKey, fetchPromise);

    // Return a clone to ensure body can be read by all consumers
    return fetchPromise.then(res => res.clone());
  };
}
