// Phantom: Invisible Request Coalescing
// Deduplicates simultaneous identical network requests
const originalFetch = window.fetch;
const inFlightRequests = new Map();

window.fetch = function(...args) {
  let url = '';
  let method = 'GET';
  let headers = {};
  let signal = null;

  if (args[0] instanceof Request) {
    url = args[0].url;
    method = args[0].method || 'GET';
    headers = Object.fromEntries(args[0].headers.entries());
    signal = args[0].signal;

    // Allow options to override Request object properties
    if (args[1]) {
      if (args[1].method) method = args[1].method;
      if (args[1].headers) {
        const overrideHeaders = args[1].headers instanceof Headers
          ? Object.fromEntries(args[1].headers.entries())
          : args[1].headers;
        headers = { ...headers, ...overrideHeaders };
      }
      if (args[1].signal) signal = args[1].signal;
    }
  } else {
    url = args[0];
    const options = args[1] || {};
    method = options.method || 'GET';
    headers = options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : (options.headers || {});
    signal = options.signal;
  }

  // We only coalesce GET requests
  // Do not coalesce requests with AbortSignals, as aborting one would abort all consumers
  if (method.toUpperCase() !== 'GET' || signal) {
    return originalFetch.apply(window, args);
  }

  // Sanitize url to avoid caching issues with changing query params?
  // No, query params are part of the resource identifier.
  // We should create a cache key from URL and stringified headers to differentiate requests
  const cacheKey = `${url}|${JSON.stringify(headers)}`;

  if (inFlightRequests.has(cacheKey)) {
    // Return a clone of the response so each caller gets a fresh body to read
    return inFlightRequests.get(cacheKey).then(res => res.clone());
  }

  // We need a promise that multiple callers can wait on.
  // The originalFetch promise itself resolves to a Response object.
  // If we just store the originalFetch promise, the first caller gets the original response,
  // and subsequent callers get the original response (which is wrong, as body can only be consumed once).
  // Wait, if the first caller consumes the original response body, the subsequent callers who cloned the ALREADY CONSUMED response will fail?
  // No, if they clone an already consumed response, it might fail.
  // Actually, to safely share a response, the infrastructure MUST clone it for EVERYONE, including the first caller.

  const coalescedPromise = originalFetch.apply(window, args)
    .then(res => {
      // Create a master clone that is kept in the promise.
      // Every consumer (including the first one) gets a clone of this master.
      // But wait, response.clone() doesn't work if the original is read.
      // If we resolve the promise with `res`, and then every consumer does `res.clone()`,
      // the first consumer will do `res.clone()` and read it.
      // The second consumer will do `res.clone()` and read it.
      // The original `res` is NEVER read directly!
      // This is perfect.
      return res;
    })
    .finally(() => {
      // Remove from in-flight requests after a tiny delay to catch immediate subsequent calls
      setTimeout(() => inFlightRequests.delete(cacheKey), 50);
    });

  inFlightRequests.set(cacheKey, coalescedPromise);

  return coalescedPromise.then(res => res.clone());
};
