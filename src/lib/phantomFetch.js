/**
 * 🌀 Phantom Infrastructure: Request Coalescing
 * Intercepts window.fetch to deduplicate identical in-flight GET requests.
 */

if (typeof window !== 'undefined' && !window.__PHANTOM_METRICS__) {
  window.__PHANTOM_METRICS__ = { coalescedRequests: 0 };
}

if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  const inFlight = new Map();

  window.fetch = async function (...args) {
    let url;
    let method = 'GET';
    let headersObj = {};
    let signal = null;

    const [resource, config] = args;

    if (typeof window.Request !== 'undefined' && resource instanceof window.Request) {
      url = resource.url;
      method = resource.method || 'GET';
      signal = resource.signal;
      if (resource.headers && typeof resource.headers.entries === 'function') {
        headersObj = Object.fromEntries(resource.headers.entries());
      }
    } else {
      url = resource.toString();
    }

    if (config) {
      if (config.method) method = config.method;
      if (config.signal) signal = config.signal;
      if (config.headers) {
        if (typeof window.Headers !== 'undefined' && config.headers instanceof window.Headers) {
          headersObj = { ...headersObj, ...Object.fromEntries(config.headers.entries()) };
        } else {
          headersObj = { ...headersObj, ...config.headers };
        }
      }
    }

    // Only coalesce GET requests without an AbortSignal
    if (method.toUpperCase() === 'GET' && !signal) {
      const cacheKey = JSON.stringify({ url, headers: headersObj });

      if (inFlight.has(cacheKey)) {
        window.__PHANTOM_METRICS__.coalescedRequests++;
        const promise = inFlight.get(cacheKey);
        return promise.then(res => res.clone());
      }

      const fetchPromise = originalFetch.apply(window, args)
        .then(response => {
          inFlight.delete(cacheKey);
          return response;
        })
        .catch(error => {
          inFlight.delete(cacheKey);
          throw error;
        });

      inFlight.set(cacheKey, fetchPromise);
      return fetchPromise.then(res => res.clone());
    }

    return originalFetch.apply(window, args);
  };
}
