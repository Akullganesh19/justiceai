let originalFetch = null;
const inFlightRequests = new Map();

/**
 * Normalizes headers to a sorted string for stable cache keys.
 */
function hashHeaders(headersInit) {
  if (!headersInit) return '';

  let entries = [];
  if (typeof Headers !== 'undefined' && headersInit instanceof Headers) {
    headersInit.forEach((value, key) => entries.push([key, value]));
  } else if (Array.isArray(headersInit)) {
    entries = [...headersInit];
  } else if (typeof headersInit === 'object') {
    entries = Object.entries(headersInit);
  }

  return entries
    .map(([k, v]) => `${k.toLowerCase()}:${v}`)
    .sort()
    .join('|');
}

export function initializePhantomFetch() {
  if (originalFetch) return; // Already initialized

  if (typeof window !== 'undefined' && window.fetch) {
    originalFetch = window.fetch;

    window.fetch = async function phantomFetch(input, init = {}) {
      // Safely extract method without consuming body streams
      const method = (init.method || (input && input.method) || 'GET').toUpperCase();

      // Bypass coalescing for non-GET requests or requests with an AbortSignal
      if (method !== 'GET' || init.signal || (input && input.signal)) {
        return originalFetch(input, init);
      }

      let urlStr;
      let headersStr;

      if (typeof input === 'string' || (typeof URL !== 'undefined' && input instanceof URL)) {
        urlStr = input.toString();
        headersStr = hashHeaders(init.headers);
      } else if (typeof Request !== 'undefined' && input instanceof Request) {
        urlStr = input.url;
        headersStr = hashHeaders(input.headers);
        if (init.headers) {
           headersStr += '|' + hashHeaders(init.headers);
        }
      } else {
        // Fallback for unexpected input types
        return originalFetch(input, init);
      }

      const cacheKey = `${urlStr}[${headersStr}]`;

      if (inFlightRequests.has(cacheKey)) {
        // Await the existing promise and clone the response
        const response = await inFlightRequests.get(cacheKey);
        return response.clone();
      }

      // We don't have this request in flight. Start it.
      const requestPromise = originalFetch(input, init);
      inFlightRequests.set(cacheKey, requestPromise);

      try {
        const response = await requestPromise;
        // We return a clone for this original caller as well
        return response.clone();
      } finally {
        // Clean up when done
        inFlightRequests.delete(cacheKey);
      }
    };
  }
}

export function restorePhantomFetch() {
  if (originalFetch && typeof window !== 'undefined') {
    window.fetch = originalFetch;
    originalFetch = null;
    inFlightRequests.clear();
  }
}
