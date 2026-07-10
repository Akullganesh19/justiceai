/**
 * Request Coalescing (Request Deduplication)
 *
 * Intercepts `fetch` calls. If multiple requests for the same URL and headers
 * are fired concurrently (e.g. from different components rendering at the same time),
 * this infrastructure merges them into a single network request.
 *
 * 1. Checks if a GET request with the identical cacheKey (url, headers, mode) is already in flight.
 * 2. If yes, it returns the shared Promise, cloned, so each caller gets their own Response object.
 * 3. Handles AbortController independently, preventing one caller's abort from killing the shared request.
 *
 * Phantom 🌀
 */

if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  const originalFetch = window.fetch.bind(window);
  const inFlightRequests = new Map();

  window.fetch = function (input, init) {
    let url = '';
    let method = 'GET';
    let isCoalescable = true;
    let headers = null;
    let credentials = null;
    let mode = null;
    let signal = init?.signal;

    // Check if input is a Request object and guard against test environments
    if (typeof Request !== 'undefined' && input instanceof Request) {
      url = input.url;
      method = init?.method || input.method || 'GET';
      headers = init?.headers || input.headers;
      credentials = init?.credentials || input.credentials;
      mode = init?.mode || input.mode;
      signal = init?.signal || input.signal;
    } else {
      url = typeof input === 'string' ? input : input?.toString();
      if (init) {
        method = init.method || 'GET';
        headers = init.headers;
        credentials = init.credentials;
        mode = init.mode;
      }
    }

    // We only coalesce GET requests
    if (method.toUpperCase() !== 'GET') {
      isCoalescable = false;
    }

    if (!isCoalescable) {
      return originalFetch(input, init);
    }

    // Normalize headers for the cache key
    let headersKey = '';
    if (headers) {
      if (typeof Headers !== 'undefined' && headers instanceof Headers) {
        const headerEntries = [];
        headers.forEach((value, key) => {
          headerEntries.push(`${key}:${value}`);
        });
        headersKey = headerEntries.sort().join('|');
      } else if (Array.isArray(headers)) {
        headersKey = headers.map(h => `${h[0]}:${h[1]}`).sort().join('|');
      } else if (typeof headers === 'object') {
        const headerEntries = Object.entries(headers).map(([k, v]) => `${k}:${v}`);
        headersKey = headerEntries.sort().join('|');
      }
    }

    const cacheKey = JSON.stringify({
      url,
      headers: headersKey,
      credentials: credentials || 'omit',
      mode: mode || 'cors'
    });

    if (inFlightRequests.has(cacheKey)) {
      // Coalesce! Return the shared promise, but cloned for this specific caller.
      const sharedPromise = inFlightRequests.get(cacheKey);

      return new Promise((resolve, reject) => {
        if (signal) {
          if (signal.aborted) {
            return reject(new DOMException('Aborted', 'AbortError'));
          }
          signal.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        }

        sharedPromise
          .then((res) => resolve(res.clone()))
          .catch(reject);
      });
    }

    // First caller creates the shared request.
    // We strip the specific caller's signal so it doesn't abort the shared request.
    let sharedInput = input;
    let sharedInit = init ? { ...init } : {};

    if (sharedInit.signal) {
        delete sharedInit.signal;
    }

    if (typeof Request !== 'undefined' && input instanceof Request) {
        sharedInput = new Request(input.url, {
            method: input.method,
            headers: input.headers,
            body: input.body,
            mode: input.mode,
            credentials: input.credentials,
            cache: input.cache,
            redirect: input.redirect,
            referrer: input.referrer,
            integrity: input.integrity,
            // Explicitly not copying the signal
        });
    }

    const fetchPromise = originalFetch(sharedInput, sharedInit)
      .finally(() => {
        inFlightRequests.delete(cacheKey);
      });

    inFlightRequests.set(cacheKey, fetchPromise);

    return new Promise((resolve, reject) => {
      if (signal) {
        if (signal.aborted) {
          return reject(new DOMException('Aborted', 'AbortError'));
        }
        signal.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }

      fetchPromise
        .then((res) => resolve(res.clone()))
        .catch(reject);
    });
  };
}
