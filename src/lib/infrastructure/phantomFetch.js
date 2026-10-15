export function initPhantomFetch() {
  const originalFetch = window.fetch;
  const inFlight = new Map();

  window.fetch = async function (input, init) {
    // 1. Determine Method safely
    const method = init?.method || input?.method || 'GET';
    const isGet = typeof method === 'string' && method.toUpperCase() === 'GET';

    // 2. Bypass condition: Not a GET, or uses AbortSignal
    if (!isGet || (init && init.signal) || (input && input.signal)) {
      return originalFetch(input, init);
    }

    // 3. Extract URL
    let url = typeof input === 'string' ? input : input?.url;
    if (!url) {
        return originalFetch(input, init);
    }

    // 4. Extract headers manually
    let headersObj = {};
    const inputHeaders = init?.headers || input?.headers;
    if (inputHeaders) {
        if (inputHeaders instanceof Headers) {
            inputHeaders.forEach((value, key) => {
                headersObj[key] = value;
            });
        } else if (Array.isArray(inputHeaders)) {
            inputHeaders.forEach(([key, value]) => {
                headersObj[key] = value;
            });
        } else if (typeof inputHeaders === 'object') {
            headersObj = { ...inputHeaders };
        }
    }

    // 5. Generate cache key
    const cacheKey = JSON.stringify({ url, headers: headersObj });

    // 6. Request Coalescing
    if (inFlight.has(cacheKey)) {
        console.log(`[Phantom] Coalescing request for: ${url}`);
        const sharedPromise = inFlight.get(cacheKey);
        const response = await sharedPromise;
        return response.clone();
    }

    const fetchPromise = originalFetch(input, init).finally(() => {
        inFlight.delete(cacheKey);
    });

    inFlight.set(cacheKey, fetchPromise);

    const response = await fetchPromise;
    return response.clone();
  };
}
