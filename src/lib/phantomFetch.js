/**
 * 🌀 Phantom Infrastructure: Global Fetch Interceptor
 *
 * Provides invisible capabilities:
 * 1. Request Coalescing (Deduplication of simultaneous identical GET requests)
 * 2. Automatic Retries (Exponential backoff for idempotent methods on 429, 5xx, or network timeouts)
 * 3. Graceful Timeouts (Prevents hanging requests)
 */

if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  const inFlight = new Map();

  const DEFAULT_TIMEOUT_MS = 15000;
  const MAX_RETRIES = 3;

  window.fetch = async function phantomFetch(resource, options = {}) {
    let urlStr;
    let method = 'GET';
    let isRequestObj = false;

    if (resource instanceof Request) {
      urlStr = resource.url;
      method = resource.method || 'GET';
      isRequestObj = true;
    } else {
      urlStr = resource.toString();
      method = (options?.method || 'GET').toUpperCase();
    }

    // 1. Request Coalescing for GET requests
    if (method === 'GET') {
      const cacheKey = urlStr;
      if (inFlight.has(cacheKey)) {
        try {
          const res = await inFlight.get(cacheKey);
          return res.clone();
        } catch (_err) {
          // Fall through to retry if the coalesced request failed
        }
      }
    }

    const isIdempotent = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'].includes(method);

    const executeWithRetry = async () => {
      let lastError;
      let lastResponse;
      const maxAttempts = isIdempotent ? MAX_RETRIES : 1;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const controller = new AbortController();
        const customTimeoutMs = options?.timeout || DEFAULT_TIMEOUT_MS;

        // Dynamically generate a fresh timeout for each attempt
        const timeoutId = setTimeout(() => {
          const err = new Error('AbortError');
          err.name = 'AbortError';
          controller.abort(err);
        }, customTimeoutMs);

        // Inherit external signal if provided
        if (options?.signal) {
          if (options.signal.aborted) {
            controller.abort(options.signal.reason);
          } else {
            options.signal.addEventListener('abort', () => {
              controller.abort(options.signal.reason);
            }, { once: true });
          }
        }

        const attemptOptions = {
          ...options,
          signal: controller.signal
        };

        // Clone Request object if necessary to prevent "body already used" errors
        let attemptResource = resource;
        if (isRequestObj) {
          attemptResource = resource.clone();
        }

        let response;
        try {
          response = await originalFetch(attemptResource, attemptOptions);

          if (response.ok || !isIdempotent || (response.status < 500 && response.status !== 429)) {
            return response;
          }

          lastResponse = response;
          const error = new Error(`Transient HTTP Error: ${response.status}`);
          error.name = 'TransientError';
          throw error;
        } catch (err) {
          lastError = err;

          // Explicitly consume the response body of intermediate failure
          if (response) {
            await response.text().catch((_err) => { /* ignore */ });
          }

          const isAbortError = err.name === 'AbortError' || err.message === 'AbortError';
          const isTransient = err.name === 'TransientError' || isAbortError;

          if (!isTransient || attempt === maxAttempts) {
            // Return final failed Response object instead of throwing
            if (lastResponse) return lastResponse;
            throw err;
          }

          // Sanitize URL for logging
          let safeUrl = urlStr;
          try {
            const parsed = new URL(urlStr, window.location.origin || 'http://localhost');
            safeUrl = parsed.origin + parsed.pathname;
          } catch (_err) { /* ignore */ }

          console.warn(`[Phantom] Retry ${attempt}/${maxAttempts} for ${method} ${safeUrl} due to ${err.name}`);

          // Exponential backoff
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 200));
        } finally {
          // Explicitly clear timeout to prevent memory leaks
          clearTimeout(timeoutId);
        }
      }

      if (lastResponse) return lastResponse;
      throw lastError;
    };

    const promise = executeWithRetry();

    if (method === 'GET') {
      inFlight.set(urlStr, promise);
      promise.finally(() => {
        inFlight.delete(urlStr);
      });
      const res = await promise;
      return res.clone();
    }

    return promise;
  };
}
