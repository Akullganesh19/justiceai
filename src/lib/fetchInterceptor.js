const originalFetch = window.fetch;
const inFlightRequests = new Map();

window.fetch = async function (...args) {
  const [resource, config] = args;

  let url = '';
  let method = 'GET';
  let headersObj = {};
  let signal = null;

  if (resource instanceof Request) {
    url = resource.url;
    method = resource.method || 'GET';
    signal = resource.signal;
    if (resource.headers) {
      headersObj = Object.fromEntries(resource.headers.entries());
    }
  } else {
    url = resource.toString();
  }

  if (config) {
    if (config.method) method = config.method;
    if (config.signal) signal = config.signal;
    if (config.headers) {
      if (config.headers instanceof Headers) {
        headersObj = { ...headersObj, ...Object.fromEntries(config.headers.entries()) };
      } else {
        headersObj = { ...headersObj, ...config.headers };
      }
    }
  }

  // Only coalesce GET requests without an abort signal
  if (method.toUpperCase() === 'GET' && !signal) {
    // Construct cache key based on URL and headers
    const headerKeys = Object.keys(headersObj).sort();
    let headerStr = '';
    for (const key of headerKeys) {
      headerStr += `${key}:${headersObj[key]}|`;
    }
    const cacheKey = `GET|${url}|${headerStr}`;

    if (inFlightRequests.has(cacheKey)) {
      const pendingPromise = inFlightRequests.get(cacheKey);
      const res = await pendingPromise;
      return res.clone();
    }

    const fetchPromise = originalFetch.apply(window, args);
    inFlightRequests.set(cacheKey, fetchPromise);

    try {
      const response = await fetchPromise;
      // We must clone the response before returning it so multiple consumers
      // can read the body. However, the first consumer (the one that created the promise)
      // also needs a clone because the promise resolution itself might be awaited by multiple
      // interceptors or subsequent handlers, but typically we resolve the promise with the original,
      // and each awaiter gets the same Response object.
      // Wait, Promise resolves with the original Response. If multiple people await `pendingPromise`,
      // they all get the SAME Response object. The first one to call `.json()` will consume it!
      // Therefore, the Promise stored in `inFlightRequests` MUST resolve with a Response that is meant to be cloned,
      // or we just store a promise that resolves to a cloneable response.
      // Actually, if we just return `response.clone()` here, what happens to the original promise?
      // Wait! `fetchPromise` is just `originalFetch`. It resolves with a single `Response`.
      // If we await `fetchPromise` and it returns `response`, we can return `response.clone()` here.
      // What about other waiters? They are awaiting `pendingPromise` (which is `fetchPromise`), so they ALSO get `response`!
      // And they also do `return res.clone()` (see the `if (inFlightRequests.has(cacheKey))` block above).
      // So EVERY consumer gets a cloned response! This is perfect!
      return response.clone();
    } finally {
      // Remove from inflight once completed (success or failure)
      inFlightRequests.delete(cacheKey);
    }
  }

  // For non-GET or requests with signals, proceed normally
  return originalFetch.apply(window, args);
};
