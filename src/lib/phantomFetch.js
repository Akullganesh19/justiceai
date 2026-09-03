export function initPhantomFetch() {
  if (typeof window === 'undefined') return;
  if (window.__phantomFetchInitialized) return;

  const originalFetch = window.fetch;
  const inFlightRequests = new Map();

  window.fetch = async function (input, init = {}) {
    const urlStr = typeof input === 'string' ? input : input.url;
    let safeUrl = urlStr;
    try {
      const u = new URL(urlStr, window.location.origin);
      safeUrl = u.origin + u.pathname;
    } catch (_e) {
      // Ignore URL parsing errors
    }

    const method = (init.method || (input && input.method) || 'GET').toUpperCase();

    // 1. Request Coalescing (Deduplication) for identical GET requests
    if (method === 'GET') {
      // Create a cache key that includes headers to prevent coalescing requests with different credentials/options
      let headersStr = '';
      if (init.headers) {
          try {
             headersStr = JSON.stringify(init.headers);
          } catch (_e) {
             // fallback if headers aren't serializable
             headersStr = 'custom-headers';
          }
      }
      const cacheKey = `${method}:${urlStr}:${headersStr}`;

      if (inFlightRequests.has(cacheKey)) {
        return inFlightRequests.get(cacheKey).then(res => res.clone());
      }

      const fetchPromise = executeFetchWithRetry(input, init, originalFetch, safeUrl, method).finally(() => {
        inFlightRequests.delete(cacheKey);
      });

      inFlightRequests.set(cacheKey, fetchPromise);
      return fetchPromise.then(res => res.clone());
    }

    // Non-GET requests go straight to execute
    return executeFetchWithRetry(input, init, originalFetch, safeUrl, method);
  };

  window.__phantomFetchInitialized = true;
  console.log('[Phantom] Network infrastructure initialized');
}

async function executeFetchWithRetry(input, init, originalFetch, safeUrl, method) {
  const maxRetries = 3;
  let attempt = 0;
  let lastError;

  const isIdempotent = ['GET', 'PUT', 'DELETE'].includes(method);
  const isLLMPost = method === 'POST' && (safeUrl.includes('/api/chat') || safeUrl.includes('/api/embed') || safeUrl.includes('bhashini'));
  const shouldRetry = isIdempotent || isLLMPost;

  // We only set a custom timeout if the user specifically requested it via init.timeout (which isn't standard fetch, but we added it)
  // Otherwise we let it run without a forced timeout so we don't break long requests like LLMs or uploads
  const userTimeoutMs = init.timeout;

  while (attempt <= (shouldRetry ? maxRetries : 0)) {
    const controller = new AbortController();
    let timeoutId;

    if (userTimeoutMs) {
      timeoutId = setTimeout(() => {
        controller.abort(new Error('PhantomTimeout'));
      }, userTimeoutMs);
    }

    // Respect existing user signals
    if (init.signal) {
       if (init.signal.aborted) {
           throw init.signal.reason || new DOMException('Aborted', 'AbortError');
       }
       init.signal.addEventListener('abort', () => {
           controller.abort(init.signal.reason);
       });
    }

    const attemptInit = { ...init, signal: controller.signal };

    try {
      const response = await originalFetch(input, attemptInit);
      if (timeoutId) clearTimeout(timeoutId);

      // Transient errors to retry
      if (shouldRetry && attempt < maxRetries && (!response.ok && (response.status >= 500 || response.status === 429))) {
         await response.text().catch(() => {}); // consume body
         throw new Error(`Transient HTTP Error: ${response.status}`);
      }

      return response;
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      lastError = err;

      // If the abort was caused by the USER, we should NOT retry. We should bubble it up.
      // We only retry network errors or our own internal PhantomTimeouts, or 5xx/429
      const isNetworkError = err.name === 'TypeError' && err.message === 'Failed to fetch';
      const isPhantomTimeout = err.message === 'PhantomTimeout';
      const isTransientHttp = err.message.startsWith('Transient HTTP Error');

      if (shouldRetry && attempt < maxRetries && (isNetworkError || isPhantomTimeout || isTransientHttp)) {
        attempt++;
        const backoff = Math.pow(2, attempt) * 500 + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, backoff));
      } else {
        // If it was a user abort or standard AbortError not triggered by our timeout, just throw it immediately
        throw err;
      }
    }
  }

  throw lastError;
}
