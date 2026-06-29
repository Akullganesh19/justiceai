/**
 * Invisible Infrastructure: Request Coalescing
 *
 * Intercepts window.fetch to prevent identical, simultaneous network requests.
 * If 5 components mount and request the same config concurrently, only 1 network
 * request is made, and all 5 components receive a clone of the response.
 */

// Extend Window to include our instrumentation
declare global {
  interface Window {
    __PHANTOM_METRICS__: {
      coalescedRequests: number;
      totalFetchesIntercepted: number;
    };
  }
}

export function installInvisibleInfrastructure() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;
  const inFlight = new Map<string, Promise<Response>>();

  // Instrumentation metrics
  window.__PHANTOM_METRICS__ = window.__PHANTOM_METRICS__ || {
    coalescedRequests: 0,
    totalFetchesIntercepted: 0
  };

  // Helper to extract headers into a plain object for serialization
  const extractHeaders = (headers: HeadersInit | Headers | undefined): Record<string, string> => {
    if (!headers) return {};

    if (headers instanceof Headers) {
      const obj: Record<string, string> = {};
      headers.forEach((value, key) => {
        obj[key] = value;
      });
      return obj;
    }

    if (Array.isArray(headers)) {
      const obj: Record<string, string> = {};
      headers.forEach(([key, value]) => {
        obj[key] = value;
      });
      return obj;
    }

    return headers as Record<string, string>;
  };

  window.fetch = async function coalescedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    window.__PHANTOM_METRICS__.totalFetchesIntercepted++;

    // Extract basic method and request properties
    let method = 'GET';
    let urlStr = '';

    let reqHeaders: Record<string, string> = {};
    let credentials = '';
    let cache = '';
    let mode = '';

    if (input instanceof Request) {
      method = input.method;
      urlStr = input.url;
      reqHeaders = extractHeaders(input.headers);
      credentials = input.credentials;
      cache = input.cache;
      mode = input.mode;

      // If there's an init object, it overrides Request properties
      if (init) {
        if (init.method) method = init.method.toUpperCase();
        if (init.headers) {
          reqHeaders = { ...reqHeaders, ...extractHeaders(init.headers) };
        }
        if (init.credentials) credentials = init.credentials;
        if (init.cache) cache = init.cache;
        if (init.mode) mode = init.mode;
      }
    } else {
      urlStr = input.toString();
      if (init) {
        if (init.method) method = init.method.toUpperCase();
        if (init.headers) reqHeaders = extractHeaders(init.headers);
        if (init.credentials) credentials = init.credentials;
        if (init.cache) cache = init.cache;
        if (init.mode) mode = init.mode;
      }
    }

    // Only coalesce GET requests.
    // Also, if a signal is provided, it's safest NOT to coalesce because aborting one
    // might abort others unexpectedly, unless we write complex AbortController merging logic.
    const hasSignal = (input instanceof Request && input.signal) || (init && init.signal);

    if (method !== 'GET' || hasSignal) {
      return originalFetch.call(this, input, init);
    }

    // Build a strictly unique cache key
    const cacheKeyObj = {
      url: urlStr,
      headers: reqHeaders,
      credentials,
      cache,
      mode
    };

    const cacheKey = JSON.stringify(cacheKeyObj);

    if (inFlight.has(cacheKey)) {
      window.__PHANTOM_METRICS__.coalescedRequests++;
      console.debug(`[Phantom] Coalesced duplicate fetch for: ${urlStr}`);
      const response = await inFlight.get(cacheKey)!;
      return response.clone();
    }

    const promise = originalFetch.call(this, input, init)
      .finally(() => {
        inFlight.delete(cacheKey);
      });

    inFlight.set(cacheKey, promise);

    const res = await promise;
    // We clone the response for everyone (including the initiator)
    // so no one locks the single underlying stream.
    return res.clone();
  };
}
