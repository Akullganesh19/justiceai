// 🌀 Phantom: Request Coalescing Interceptor
// Multiple simultaneous identical GET requests become a single network request.
// Invisible to callers. Massively reduces network chatter under load.

// Ensure we maintain a reference to the actual original fetch globally for the lifecycle
const inFlightRequests = new Map();

export function initializePhantomFetch() {
  if (typeof window === 'undefined') return;
  if (window.__PHANTOM_FETCH_ACTIVE__) return;

  const _originalFetch = window.fetch;

  window.fetch = function phantomFetch(input, init) {
    // Determine method safely without fully instantiating a new Request which would consume body streams
    let method = 'GET';
    if (init && init.method) {
      method = init.method.toUpperCase();
    } else if (input && input.method) {
      method = input.method.toUpperCase();
    }

    // 1. Only coalesce GET requests. Mutations (POST/PUT/DELETE) must be distinct.
    if (method !== 'GET') {
      return _originalFetch.call(window, input, init);
    }

    // 2. If caller provided an AbortSignal, bypass coalescing.
    // Coalescing abortable requests safely is complex since one abort shouldn't abort others.
    if ((init && init.signal) || (input && input.signal)) {
      return _originalFetch.call(window, input, init);
    }

    // 3. For GET requests, we can safely create a Request to normalize URL and headers
    let request;
    try {
      request = new window.Request(input, init);
    } catch {
      // Fallback for tests
      request = {
        url: typeof input === 'string' ? input : input.url,
        method: method,
        signal: init?.signal || input.signal,
        headers: new Map(Object.entries(init?.headers || {}))
      };
    }

    // 4. Generate stable cache key based on URL and Headers
    const headersObj = {};
    if (request.headers && typeof request.headers.forEach === 'function') {
      request.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
    } else if (init?.headers) {
      Object.entries(init.headers).forEach(([key, value]) => {
         headersObj[key.toLowerCase()] = value;
      });
    }

    // Sort keys to ensure consistent JSON stringification
    const sortedHeaders = Object.keys(headersObj).sort().reduce((acc, key) => {
      acc[key] = headersObj[key];
      return acc;
    }, {});

    const cacheKey = `GET:${request.url}:${JSON.stringify(sortedHeaders)}`;

    // 5. Coalesce!
    if (inFlightRequests.has(cacheKey)) {
      // Return a cloned response so both callers can consume the stream (e.g. .json() or .text())
      return inFlightRequests.get(cacheKey).then(res => res && typeof res.clone === 'function' ? res.clone() : res);
    }

    // 6. Execute actual fetch
    const fetchPromise = (async () => {
      try {
        const response = await _originalFetch.call(window, input, init);
        return response;
      } finally {
        // Use setTimeout to ensure all synchronous consumers get the cache hit before deletion
        setTimeout(() => inFlightRequests.delete(cacheKey), 0);
      }
    })();

    inFlightRequests.set(cacheKey, fetchPromise);

    // Return a clone to the original caller as well, so the stored promise can be cloned for others
    return fetchPromise.then(res => res && typeof res.clone === 'function' ? res.clone() : res);
  };

  window.__PHANTOM_FETCH_ACTIVE__ = true;
  console.log('🌀 Phantom: Request Coalescing Active');
}
