const originalFetch = window.fetch;
const inFlight = new Map();
window.__PHANTOM_METRICS__ = { coalescedRequests: 0 };

function normalizeHeaders(headers) {
  if (!headers) return '';
  const entries = [];
  if (headers instanceof Headers) {
    headers.forEach((value, key) => entries.push([key.toLowerCase(), value]));
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => entries.push([key.toLowerCase(), value]));
  } else if (typeof headers === 'object') {
    Object.entries(headers).forEach(([key, value]) => entries.push([key.toLowerCase(), value]));
  }
  return entries.sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => `${k}:${v}`).join('|');
}

window.fetch = async function (input, init = {}) {
  let url;
  let method = 'GET';
  let headers = init.headers;
  let body = init.body;
  let signal = init.signal;

  if (input instanceof Request) {
    url = input.url;
    method = input.method || 'GET';
    if (!headers) headers = input.headers;
    if (!body && input.body) body = input.body;
    if (!signal && input.signal) signal = input.signal;
  } else {
    url = input.toString();
    method = init.method || 'GET';
  }

  // Only coalesce GET requests without bodies
  if (method.toUpperCase() !== 'GET' || body) {
    return originalFetch(input, init);
  }

  const headersStr = normalizeHeaders(headers);
  const cacheKey = `${url}:::${headersStr}`;

  if (inFlight.has(cacheKey)) {
    window.__PHANTOM_METRICS__.coalescedRequests++;
    const flight = inFlight.get(cacheKey);
    flight.subscribers++;

    return new Promise((resolve, reject) => {
      const abortHandler = () => {
        flight.subscribers--;
        reject(new DOMException('Aborted', 'AbortError'));

        // If all subscribers have aborted, abort the underlying fetch
        if (flight.subscribers === 0) {
          flight.controller.abort();
          inFlight.delete(cacheKey);
        }
      };

      if (signal) {
        if (signal.aborted) {
          return reject(new DOMException('Aborted', 'AbortError'));
        }
        signal.addEventListener('abort', abortHandler);
      }

      flight.promise
        .then(response => {
          if (signal) signal.removeEventListener('abort', abortHandler);
          resolve(response.clone());
        })
        .catch(err => {
          if (signal) signal.removeEventListener('abort', abortHandler);
          reject(err);
        });
    });
  }

  // First request for this cacheKey, create the flight
  const controller = new AbortController();
  const flight = {
    subscribers: 1,
    controller,
    promise: null
  };

  const mergedInit = { ...init, signal: controller.signal };

  flight.promise = originalFetch(input, mergedInit)
    .then(response => {
      inFlight.delete(cacheKey);
      return response;
    })
    .catch(err => {
      inFlight.delete(cacheKey);
      throw err;
    });

  inFlight.set(cacheKey, flight);

  return new Promise((resolve, reject) => {
    const abortHandler = () => {
      flight.subscribers--;
      reject(new DOMException('Aborted', 'AbortError'));

      if (flight.subscribers === 0) {
        flight.controller.abort();
        inFlight.delete(cacheKey);
      }
    };

    if (signal) {
      if (signal.aborted) {
        return reject(new DOMException('Aborted', 'AbortError'));
      }
      signal.addEventListener('abort', abortHandler);
    }

    flight.promise
      .then(response => {
        if (signal) signal.removeEventListener('abort', abortHandler);
        resolve(response.clone());
      })
      .catch(err => {
        if (signal) signal.removeEventListener('abort', abortHandler);
        reject(err);
      });
  });
};
