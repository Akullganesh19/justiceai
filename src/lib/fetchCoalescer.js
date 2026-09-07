/**
 * 🌀 Phantom Infrastructure: Request Coalescing
 *
 * Invisible middleware that intercepts `window.fetch`.
 * If multiple identical GET requests are made simultaneously,
 * it deduplicates them into a single network request,
 * broadcasting the cloned response to all callers.
 */

if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  const inFlight = new Map();

  window.fetch = async function (resource, options = {}) {
    let url;
    let method = 'GET';
    let headersObj = {};
    let signal = options?.signal;

    // Normalize Request object vs String URL
    if (resource instanceof Request) {
      url = resource.url;
      method = resource.method;
      if (resource.headers) {
        headersObj = Object.fromEntries(resource.headers.entries());
      }
      signal = resource.signal || signal;
    } else {
      url = resource.toString();
      if (options?.method) method = options.method.toUpperCase();
      if (options?.headers) {
        if (options.headers instanceof Headers) {
          headersObj = Object.fromEntries(options.headers.entries());
        } else {
          headersObj = { ...options.headers };
        }
      }
    }

    // Only coalesce GET requests. Bypass if an AbortSignal is present
    // because aborting one shared request would break it for other consumers.
    if (method !== 'GET' || signal) {
      return originalFetch.apply(window, [resource, options]);
    }

    // Construct a cache key that includes URL and relevant headers (e.g. auth)
    // to avoid merging requests that target the same endpoint but require different context.
    const cacheKey = JSON.stringify({ url, headers: headersObj });

    if (inFlight.has(cacheKey)) {
      // Coalesce request!
      const promise = inFlight.get(cacheKey);
      const response = await promise;
      // Always clone the response so each caller gets an unconsumed body
      return response.clone();
    }

    // First time seeing this request - execute it and track it
    const promise = originalFetch.apply(window, [resource, options]);
    inFlight.set(cacheKey, promise);

    try {
      const response = await promise;
      inFlight.delete(cacheKey);
      return response.clone();
    } catch (err) {
      inFlight.delete(cacheKey);
      throw err;
    }
  };
}
