const inFlightRequests = new Map();

let originalFetch = null;

// Helper to safely stringify Headers objects or raw objects for caching
function serializeHeaders(headersInit) {
  if (!headersInit) return '';
  if (headersInit instanceof Headers) {
    const obj = {};
    headersInit.forEach((val, key) => {
      obj[key] = val;
    });
    return JSON.stringify(obj);
  }
  return JSON.stringify(headersInit);
}

export function setupFetchInterceptor() {
  if (originalFetch) return; // Already setup

  originalFetch = window.fetch;

  window.fetch = async function (input, init = {}) {
    let method = 'GET';
    if (init && init.method) {
      method = init.method.toUpperCase();
    } else if (input && typeof input === 'object' && input.method) {
      method = input.method.toUpperCase();
    }

    // Only coalesce GET requests
    if (method !== 'GET') {
      return originalFetch(input, init);
    }

    // Bypass if AbortSignal is present (complex to deduplicate correctly)
    if (init.signal || (input && typeof input === 'object' && input.signal)) {
      return originalFetch(input, init);
    }

    let urlString = '';
    if (typeof input === 'string') {
      urlString = input;
    } else if (input instanceof URL) {
      urlString = input.toString();
    } else if (input && typeof input === 'object' && input.url) {
      urlString = input.url;
    } else {
      return originalFetch(input, init);
    }

    // Determine headers string for a unique cache key
    let headersStr = '';
    if (init && init.headers) {
      headersStr = serializeHeaders(init.headers);
    } else if (input && typeof input === 'object' && input.headers) {
      headersStr = serializeHeaders(input.headers);
    }

    const cacheKey = `${urlString}|${headersStr}`;

    // If an identical request is in flight, return its cloned promise
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey).then((res) => res.clone());
    }

    const promise = originalFetch(input, init).finally(() => {
      inFlightRequests.delete(cacheKey);
    });

    inFlightRequests.set(cacheKey, promise);

    return promise.then((res) => res.clone());
  };
}
