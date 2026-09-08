/**
 * Phantom: Global Request Coalescing
 * Intercepts fetch requests to deduplicate concurrent identical GET requests.
 */
export function initFetchInterceptor() {
  if (typeof window === 'undefined' || !window.fetch) return;

  const originalFetch = window.fetch;
  const inFlightRequests = new Map();

  window.fetch = async function (...args) {
    let url = args[0];
    let method = 'GET';
    let headers = {};
    let signal = null;
    let config = args[1] || {};

    if (url instanceof Request) {
      method = url.method;
      if (url.headers) {
        headers = Object.fromEntries(url.headers.entries());
      }
      signal = url.signal;
      url = url.url;
    } else {
      method = config.method || 'GET';
      if (config.headers) {
        headers = config.headers instanceof Headers
          ? Object.fromEntries(config.headers.entries())
          : { ...config.headers };
      }
      signal = config.signal;
    }

    // Only coalesce GET requests that do NOT have an AbortSignal
    // Aborting a coalesced request would abort it for all consumers
    if (method.toUpperCase() !== 'GET' || signal) {
      return originalFetch.apply(window, args);
    }

    // Create a cache key based on URL and Headers
    const cacheKey = JSON.stringify({ url, headers });

    if (inFlightRequests.has(cacheKey)) {
      // Coalesce! Wait for the in-flight request to resolve and clone the response
      return inFlightRequests.get(cacheKey).then(res => res.clone());
    }

    // No in-flight request, make a new one
    const promise = originalFetch.apply(window, args).finally(() => {
      // Clean up the in-flight map when the request finishes (success or fail)
      inFlightRequests.delete(cacheKey);
    });

    // Store the promise in the map
    inFlightRequests.set(cacheKey, promise);

    // Return a clone to the original caller too, so everyone gets a fresh response body
    return promise.then(res => res.clone());
  };
}

// Auto-initialize if imported in a browser environment
initFetchInterceptor();
