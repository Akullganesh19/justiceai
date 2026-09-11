// src/lib/fetchInterceptor.js
// 🌀 Phantom: Invisible Infrastructure for Request Coalescing

const inFlight = new Map();
const originalFetch = window.fetch;

function getRequestDetails(input, init) {
  let url = '';
  let method = 'GET';
  let headersObj = {};
  let signal = null;

  // Handle Request object
  if (input instanceof Request) {
    url = input.url;
    method = input.method || 'GET';
    signal = input.signal;

    if (input.headers) {
      // In a real browser environment, input.headers is an instance of Headers
      if (typeof input.headers.entries === 'function') {
        headersObj = Object.fromEntries(input.headers.entries());
      }
    }
  } else {
    // Handle string URL or URL object
    url = String(input);
  }

  // Handle options object
  if (init) {
    if (init.method) {
      method = init.method;
    }
    if (init.signal !== undefined) {
      signal = init.signal;
    }
    if (init.headers) {
      if (init.headers instanceof Headers) {
        headersObj = Object.fromEntries(init.headers.entries());
      } else if (Array.isArray(init.headers)) {
        headersObj = Object.fromEntries(init.headers);
      } else {
        headersObj = { ...headersObj, ...init.headers };
      }
    }
  }

  return {
    url,
    method: method.toUpperCase(),
    headers: headersObj,
    signal
  };
}

window.fetch = async function (...args) {
  try {
    const input = args[0];
    const init = args[1];

    const { url, method, headers, signal } = getRequestDetails(input, init);

    // Only coalesce GET requests without an AbortSignal.
    // If a request has an AbortSignal, we should not coalesce it because
    // aborting it would unexpectedly abort the shared request for other consumers.
    if (method === 'GET' && !signal) {
      const cacheKey = JSON.stringify({ url, headers });

      if (inFlight.has(cacheKey)) {
        const promise = inFlight.get(cacheKey);
        const response = await promise;
        // Always return a cloned response to prevent "body already consumed" errors
        return response.clone();
      }

      // Important: Ensure we apply with the original window context
      const fetchPromise = originalFetch.apply(window, args);
      inFlight.set(cacheKey, fetchPromise);

      try {
        const response = await fetchPromise;
        // Return a clone for the first caller too, since subsequent callers get clones
        // Actually, we must return a clone so the original response body is not consumed
        // by the first caller, which would break the clones for other callers.
        return response.clone();
      } finally {
        // Remove the promise from the Map once it settles.
        // It's removed after microtasks, so concurrent synchronous loops will hit the cache.
        inFlight.delete(cacheKey);
      }
    }
  } catch (err) {
    console.error('[Phantom] Fetch interceptor error:', err);
    // Fallback: If anything goes wrong in our interceptor logic, just pass through to original fetch
  }

  return originalFetch.apply(window, args);
};
