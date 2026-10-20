export function initFetchCoalescer() {
  if (typeof window === 'undefined') return;
  const originalFetch = window.fetch;
  const inFlight = new Map();
  window.__PHANTOM_COALESCED_COUNT = 0;

  window.fetch = async function (input, init) {
    let method = 'GET';
    let url = '';
    let signal = null;

    if (init && init.method) method = init.method.toUpperCase();
    else if (input && input.method) method = input.method.toUpperCase();

    if (init && init.signal) signal = init.signal;
    else if (input && input.signal) signal = input.signal;

    if (method !== 'GET' || signal) {
      return originalFetch.apply(this, arguments);
    }

    try {
      const tempReq = new Request(input, init);
      url = tempReq.url;
      const headersObj = {};
      tempReq.headers.forEach((val, key) => { headersObj[key] = val; });
      const cacheKey = JSON.stringify({ url, headers: headersObj });

      if (inFlight.has(cacheKey)) {
        window.__PHANTOM_COALESCED_COUNT++;
        const sharedPromise = inFlight.get(cacheKey);
        const res = await sharedPromise;
        return res.clone();
      }

      const promise = originalFetch.apply(this, arguments)
        .then(res => {
          inFlight.delete(cacheKey);
          return res;
        })
        .catch(err => {
          inFlight.delete(cacheKey);
          throw err;
        });

      inFlight.set(cacheKey, promise);
      const res = await promise;
      return res.clone();
    } catch (_) {
      return originalFetch.apply(this, arguments);
    }
  };
}
