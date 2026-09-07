const origFetch = window.fetch;
const inFlightRequests = new Map();

/**
 * Creates a unique cache key for a request based on URL and specific headers
 * (like Authorization).
 */
function getCacheKey(url, options = {}) {
  // Use a URL object to normalize the URL
  let parsedUrl;
  try {
    parsedUrl = new URL(url, window.location.origin).toString();
  } catch (_e) {
    parsedUrl = url;
  }

  const method = (options.method || 'GET').toUpperCase();

  // We only coalesce GET requests
  if (method !== 'GET') {
    return null;
  }

  const keyParts = [method, parsedUrl];

  if (options.headers) {
    let headersObj = options.headers;
    if (options.headers instanceof Headers) {
      headersObj = Object.fromEntries(options.headers.entries());
    }

    // Include auth headers in the key so we don't mix up requests for different users
    if (headersObj['Authorization'] || headersObj['authorization']) {
       keyParts.push(headersObj['Authorization'] || headersObj['authorization']);
    }
  }

  return keyParts.join('|');
}

/**
 * Intercepts window.fetch to coalesce identical, simultaneous GET requests.
 */
window.fetch = async function(...args) {
  let url;
  let options = {};

  if (args[0] instanceof Request) {
    const req = args[0];
    url = req.url;
    options.method = req.method;
    options.headers = req.headers;
    options.signal = req.signal;
    if (args[1]) {
      options = { ...options, ...args[1] };
    }
  } else {
    url = args[0];
    options = args[1] || {};
  }

  // Bypass coalescing if an abort signal is provided.
  if (options.signal) {
    return origFetch.apply(window, args);
  }

  const cacheKey = getCacheKey(url, options);

  // If we can't or shouldn't cache this request, pass it through
  if (!cacheKey) {
    return origFetch.apply(window, args);
  }

  // Check if there is already an identical request in flight
  if (inFlightRequests.has(cacheKey)) {
    const response = await inFlightRequests.get(cacheKey);
    return response.clone();
  }

  const fetchPromise = origFetch.apply(window, args);
  inFlightRequests.set(cacheKey, fetchPromise);

  try {
    const response = await fetchPromise;
    return response.clone();
  } finally {
    inFlightRequests.delete(cacheKey);
  }
};
