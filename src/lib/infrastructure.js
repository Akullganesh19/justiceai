export function initInvisibleInfrastructure() {
  if (typeof window === 'undefined' || !window.fetch) return;

  const originalFetch = window.fetch.bind(window);
  const inFlight = new Map();

  window.fetch = async function (input, init) {
    let url;
    let method = 'GET';
    let inputHeaders;
    let callerSignal;

    if (input instanceof Request) {
      url = input.url;
      method = (init && init.method) ? init.method : input.method || 'GET';
      inputHeaders = (init && init.headers) ? init.headers : input.headers;
      callerSignal = (init && init.signal) ? init.signal : input.signal;
    } else {
      url = typeof input === 'string' || input instanceof URL ? input.toString() : String(input);
      method = (init && init.method) ? init.method : 'GET';
      inputHeaders = init && init.headers;
      callerSignal = init && init.signal;
    }

    if (method.toUpperCase() !== 'GET') {
      return originalFetch(input, init);
    }

    let headersStr = '';
    const headersObj = {};
    if (inputHeaders) {
      if (typeof Headers !== 'undefined' && inputHeaders instanceof Headers) {
        inputHeaders.forEach((value, key) => {
          headersObj[key.toLowerCase()] = value;
        });
      } else if (Array.isArray(inputHeaders)) {
        inputHeaders.forEach(([key, value]) => {
          headersObj[key.toLowerCase()] = value;
        });
      } else if (typeof inputHeaders === 'object') {
        Object.entries(inputHeaders).forEach(([key, value]) => {
          headersObj[key.toLowerCase()] = value;
        });
      }
      const sortedKeys = Object.keys(headersObj).sort();
      headersStr = sortedKeys.map(k => `${k}:${headersObj[k]}`).join('|');
    }

    const cacheKey = `${url}|${headersStr}`;

    if (inFlight.has(cacheKey)) {
      const entry = inFlight.get(cacheKey);
      entry.subscribers++;

      return new Promise((resolve, reject) => {
        const onAbort = () => {
          entry.subscribers--;
          if (callerSignal) callerSignal.removeEventListener('abort', onAbort);
          reject(new DOMException('Aborted', 'AbortError'));

          if (entry.subscribers === 0) {
            entry.controller.abort();
            inFlight.delete(cacheKey);
          }
        };

        if (callerSignal) {
          if (callerSignal.aborted) {
            return onAbort();
          }
          callerSignal.addEventListener('abort', onAbort);
        }

        entry.promise.then(
          (res) => {
            if (callerSignal) callerSignal.removeEventListener('abort', onAbort);
            resolve(res.clone());
          },
          (err) => {
            if (callerSignal) callerSignal.removeEventListener('abort', onAbort);
            reject(err);
          }
        );
      });
    }

    const controller = new AbortController();

    // Construct realInit properly overriding signal
    let realInit;
    if (input instanceof Request) {
      realInit = init ? { ...init, signal: controller.signal } : { signal: controller.signal };
    } else {
      realInit = { ...init, signal: controller.signal };
    }

    const entry = {
      subscribers: 1,
      controller,
      promise: null
    };

    const promise = originalFetch(input, realInit).finally(() => {
      if (inFlight.get(cacheKey) === entry) {
        inFlight.delete(cacheKey);
      }
    });

    entry.promise = promise;
    inFlight.set(cacheKey, entry);

    return new Promise((resolve, reject) => {
      const onAbort = () => {
        entry.subscribers--;
        if (callerSignal) callerSignal.removeEventListener('abort', onAbort);
        reject(new DOMException('Aborted', 'AbortError'));

        if (entry.subscribers === 0) {
          controller.abort();
          inFlight.delete(cacheKey);
        }
      };

      if (callerSignal) {
        if (callerSignal.aborted) {
          return onAbort();
        }
        callerSignal.addEventListener('abort', onAbort);
      }

      promise.then(
        (res) => {
          if (callerSignal) callerSignal.removeEventListener('abort', onAbort);
          resolve(res.clone());
        },
        (err) => {
          if (callerSignal) callerSignal.removeEventListener('abort', onAbort);
          reject(err);
        }
      );
    });
  };
}
