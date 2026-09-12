/**
 * Global fetch interceptor to coalesce identical GET requests.
 * Invisible infrastructure that ensures if 10 components ask for the same
 * resource at the exact same time, only 1 network request is made.
 */

const inFlightRequests = new Map();

export function injectFetchInterceptor() {
  if (typeof window === 'undefined' || !window.fetch) return;

  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    let url = '';
    let method = 'GET';
    let signal = null;
    let headersObj = null;

    const [resource, options = {}] = args;

    // Handle Request object vs URL string
    if (resource instanceof Request) {
      url = resource.url;
      method = resource.method;
      signal = resource.signal;
      // Convert Headers to plain object if necessary
      if (resource.headers instanceof Headers) {
         headersObj = Object.fromEntries(resource.headers.entries());
      } else {
         headersObj = resource.headers;
      }
    } else {
      url = resource.toString();
      method = options.method || 'GET';
      signal = options.signal;
      if (options.headers instanceof Headers) {
          headersObj = Object.fromEntries(options.headers.entries());
      } else {
          headersObj = options.headers;
      }
    }

    // Only coalesce GET requests without an AbortSignal
    // (Aborting a shared request would unintentionally abort it for all consumers)
    if (method.toUpperCase() === 'GET' && !signal) {
      // Build a cache key that includes headers (e.g. Authorization)
      const cacheKey = JSON.stringify({ url, headers: headersObj });

      if (inFlightRequests.has(cacheKey)) {
        // console.log(`🌀 Phantom: Coalescing fetch request for ${url}`);
        const sharedPromise = inFlightRequests.get(cacheKey);
        const response = await sharedPromise;
        // Always return a cloned response so multiple consumers can read the body
        return response.clone();
      }

      // Start the request
      const fetchPromise = originalFetch.apply(window, args).finally(() => {
        // Clean up when the request completes (success or failure)
        inFlightRequests.delete(cacheKey);
      });

      inFlightRequests.set(cacheKey, fetchPromise);

      const response = await fetchPromise;
      return response.clone();
    }

    // Pass through non-GET requests or requests with signals
    return originalFetch.apply(window, args);
  };
}
