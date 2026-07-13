/**
 * Request Coalescing Infrastructure
 * Intercepts duplicate concurrent GET requests to the same URL and coalesces them
 * into a single network request.
 */

const originalFetch = window.fetch.bind(window);
const inFlight = new Map();

window.fetch = function customFetch(input, init = {}) {
  const isRequestObj = input instanceof Request;

  const url = isRequestObj ? input.url : String(input);
  const method = (init.method || (isRequestObj ? input.method : 'GET')).toUpperCase();

  // Only coalesce GET requests
  if (method !== 'GET') {
    return originalFetch(input, init);
  }

  // Construct a cache key. For simplicity, we use the URL.
  // In a more complex scenario, we'd include Vary headers or similar, but for
  // basic coalescing, identical GET URLs are typically safe to coalesce.
  const cacheKey = url;

  if (inFlight.has(cacheKey)) {
    console.debug(`[Phantom] Coalescing concurrent GET request to: ${cacheKey}`);
    const flight = inFlight.get(cacheKey);
    flight.subscribers++;

    return new Promise((resolve, reject) => {
      let aborted = false;
      const handleAbort = () => {
        aborted = true;
        reject(new DOMException('Aborted', 'AbortError'));
        flight.subscribers--;
        if (flight.subscribers === 0) {
          flight.controller.abort();
        }
      };

      if (init.signal) {
        if (init.signal.aborted) return handleAbort();
        init.signal.addEventListener('abort', handleAbort);
      }

      flight.promise
        .then(res => {
          if (!aborted) resolve(res.clone());
        })
        .catch(err => {
          if (!aborted) reject(err);
        })
        .finally(() => {
          if (init.signal) {
            init.signal.removeEventListener('abort', handleAbort);
          }
        });
    });
  }

  const controller = new AbortController();
  const flight = { subscribers: 1, controller };

  // Create a new init object with our coalesced signal
  // If the user provided a signal, it will be handled by our promise wrapper above/below
  // The underlying fetch only aborts when ALL subscribers abort.
  const fetchInit = { ...init, signal: controller.signal };

  const promise = originalFetch(input, fetchInit).finally(() => {
    inFlight.delete(cacheKey);
  });

  flight.promise = promise;
  inFlight.set(cacheKey, flight);

  return new Promise((resolve, reject) => {
    let aborted = false;
    const handleAbort = () => {
      aborted = true;
      reject(new DOMException('Aborted', 'AbortError'));
      flight.subscribers--;
      if (flight.subscribers === 0) {
        flight.controller.abort();
      }
    };

    if (init.signal) {
      if (init.signal.aborted) return handleAbort();
      init.signal.addEventListener('abort', handleAbort);
    }

    promise
      .then(res => {
        if (!aborted) resolve(res.clone());
      })
      .catch(err => {
        if (!aborted) reject(err);
      })
      .finally(() => {
        if (init.signal) {
          init.signal.removeEventListener('abort', handleAbort);
        }
      });
  });
};
