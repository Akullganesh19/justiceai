// fetchInterceptor.js
// Invisible infrastructure: Request Coalescing
// Prevents identical simultaneous GET requests from hitting the network multiple times.

const originalFetch = window.fetch;
const inFlightRequests = new Map();

window.fetch = async function (input, init) {
  // Only coalesce GET requests without bodies
  // Check method correctly whether it's in init or Request object
  let method = 'GET';
  if (init?.method) {
    method = init.method.toUpperCase();
  } else if (input instanceof Request && input.method) {
    method = input.method.toUpperCase();
  }

  if (method !== 'GET') {
    return originalFetch(input, init);
  }

  // Generate a unique key for the request
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof Request) {
    url = input.url;
  } else if (input instanceof URL) {
    url = input.toString();
  } else {
    // Fallback if input is something unexpected
    return originalFetch(input, init);
  }

  // Properly extract headers for cache key, supporting plain objects and Headers objects
  let headersKey = '';
  const headersObj = {};

  const extractHeaders = (h) => {
    if (h instanceof Headers) {
      h.forEach((value, key) => { headersObj[key] = value; });
    } else if (typeof h === 'object' && h !== null) {
      Object.assign(headersObj, h);
    }
  };

  if (input instanceof Request && input.headers) {
    extractHeaders(input.headers);
  }
  if (init?.headers) {
    extractHeaders(init.headers);
  }

  if (Object.keys(headersObj).length > 0) {
    try {
      // Sort keys to ensure consistent JSON stringification
      const sortedHeaders = Object.keys(headersObj).sort().reduce((acc, key) => {
        acc[key] = headersObj[key];
        return acc;
      }, {});
      headersKey = JSON.stringify(sortedHeaders);
    } catch {
      // Ignore serialization errors
    }
  }

  const requestKey = `${url}|${headersKey}`;

  // If a request for this exact resource is already in flight, return its cloned promise
  if (inFlightRequests.has(requestKey)) {
    // console.debug(`[Phantom] Coalesced duplicate fetch for: ${url}`);
    const promise = inFlightRequests.get(requestKey);
    // Clone the response so each caller gets a fresh stream to read
    return promise.then((res) => res.clone());
  }

  // Abort handling: If the caller provided a signal, we must respect it,
  // but we shouldn't fail other coalesced requests if just one caller aborts.
  // Real coalescing with distinct aborts is complex, so if a signal is provided,
  // we bypass coalescing to ensure correct abort semantics for that specific caller.
  const hasSignal = (init?.signal) || (input instanceof Request && input.signal);
  if (hasSignal) {
    return originalFetch(input, init);
  }

  // Otherwise, initiate the request and track it
  const fetchPromise = originalFetch(input, init).finally(() => {
    // Remove from map once the request completes (success or failure)
    inFlightRequests.delete(requestKey);
  });

  inFlightRequests.set(requestKey, fetchPromise);

  // Return a cloned response for the original caller
  return fetchPromise.then((res) => res.clone());
};
