let originalFetch = null;
const inFlightRequests = new Map();

export function initFetchCoalescer() {
  if (typeof window === 'undefined') return;
  if (window._fetchCoalescerInitialized) return;

  originalFetch = window.fetch;
  window._fetchCoalescerInitialized = true;

  window.fetch = async function (input, init) {
    const request = new Request(input, init);

    // Only coalesce GET requests
    if (request.method !== 'GET') {
      return originalFetch.call(this, request);
    }

    // Bypass if there's an abort signal (that isn't the default one without aborted state explicitly requested)
    if (init?.signal || (input instanceof Request && input.signal)) {
      return originalFetch.call(this, request);
    }

    // Construct a cache key based on URL and Headers
    const url = request.url;

    // Manually extract headers since JSON.stringify on Headers is {}
    const headersObj = {};
    request.headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    const cacheKey = `${url}|${JSON.stringify(headersObj)}`;

    if (inFlightRequests.has(cacheKey)) {
      console.debug(`🌀 Phantom: Coalesced duplicate fetch for ${url}`);
      // Return a cloned response so both callers can read the body (e.g. .json(), .text())
      const promise = inFlightRequests.get(cacheKey);
      return promise.then(res => res.clone());
    }

    const promise = originalFetch.call(this, request)
      .finally(() => {
        inFlightRequests.delete(cacheKey);
      });

    inFlightRequests.set(cacheKey, promise);

    return promise.then(res => res.clone());
  };

  console.log('🌀 Phantom: Global fetch coalescer initialized');
}
