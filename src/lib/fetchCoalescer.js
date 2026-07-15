const originalFetch = window.fetch;
const inFlight = new Map();

function serializeHeaders(headers) {
  if (!headers) return {};
  const normalized = {};

  // Checking for headers being defined since we can't reliably use instanceof Headers across contexts
  if (typeof headers.forEach === 'function') {
    headers.forEach((value, key) => {
      normalized[key.toLowerCase()] = value;
    });
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      normalized[key.toLowerCase()] = value;
    });
  } else {
    for (const [key, value] of Object.entries(headers)) {
      normalized[key.toLowerCase()] = value;
    }
  }

  return Object.keys(normalized).sort().reduce((acc, key) => {
    acc[key] = normalized[key];
    return acc;
  }, {});
}

function getCacheKey(url, method, headers) {
  if (method.toUpperCase() !== 'GET') {
    return null;
  }

  const headersObj = serializeHeaders(headers);
  // We MUST include the query string in the cache key for correctness!
  // Normalization here just means we strip the hash fragment.
  const urlWithoutHash = url.split('#')[0];

  return JSON.stringify({
    url: urlWithoutHash,
    method: method.toUpperCase(),
    headers: headersObj
  });
}

window.fetch = function coalescedFetch(input, init) {
  let url, method, headers, signal;

  if (typeof input === 'object' && input !== null && 'url' in input) {
    url = input.url;
    method = init?.method || input.method || 'GET';
    headers = init?.headers || input.headers;
    signal = init?.signal || input.signal;
  } else {
    url = typeof input === 'string' ? input : String(input);
    method = init?.method || 'GET';
    headers = init?.headers;
    signal = init?.signal;
  }

  const key = getCacheKey(url, method, headers);
  if (!key) {
    return originalFetch(input, init);
  }

  if (inFlight.has(key)) {
    const entry = inFlight.get(key);
    entry.subscribers++;

    return new Promise((resolve, reject) => {
      const abortHandler = () => {
        entry.subscribers--;
        reject(new DOMException('Aborted', 'AbortError'));

        if (entry.subscribers === 0 && entry.controller) {
          entry.controller.abort();
          inFlight.delete(key);
        }
      };

      if (signal) {
        if (signal.aborted) {
          return reject(new DOMException('Aborted', 'AbortError'));
        }
        signal.addEventListener('abort', abortHandler);
      }

      entry.promise.then(response => {
        if (signal) signal.removeEventListener('abort', abortHandler);
        resolve(response.clone());
      }).catch(err => {
        if (signal) signal.removeEventListener('abort', abortHandler);
        reject(err);
      });
    });
  }

  const controller = new AbortController();

  // To avoid stripping configurations when input is a Request object,
  // we pass the original input directly to the native fetch if no signal manipulation
  // was required, OR we reconstruct it preserving all possible properties if we MUST inject a signal.
  // Actually, instead of reconstructing init, we can just use `new Request(input, { ...init, signal: controller.signal })`.

  const finalInit = { ...init };

  // Always bind the abort controller's signal
  finalInit.signal = controller.signal;

  // We construct a new Request to ensure all original Request properties (like integrity, referrer, etc.) are maintained,
  // while overriding the signal.
  const fetchRequest = new Request(input, finalInit);

  const entry = {
    subscribers: 1,
    controller: controller,
    promise: null
  };

  const promise = originalFetch(fetchRequest).then(response => {
    inFlight.delete(key);
    return response;
  }).catch(err => {
    inFlight.delete(key);
    throw err;
  });

  entry.promise = promise;
  inFlight.set(key, entry);

  return new Promise((resolve, reject) => {
    const abortHandler = () => {
      entry.subscribers--;
      reject(new DOMException('Aborted', 'AbortError'));

      if (entry.subscribers === 0) {
        controller.abort();
        inFlight.delete(key);
      }
    };

    if (signal) {
      if (signal.aborted) {
        return reject(new DOMException('Aborted', 'AbortError'));
      }
      signal.addEventListener('abort', abortHandler);
    }

    promise.then(response => {
      if (signal) signal.removeEventListener('abort', abortHandler);
      resolve(response.clone());
    }).catch(err => {
      if (signal) signal.removeEventListener('abort', abortHandler);
      reject(err);
    });
  });
};
