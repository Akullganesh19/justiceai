export function setupFetchInterceptor() {
  if (globalThis.__fetchInterceptorSetup) return;
  globalThis.__fetchInterceptorSetup = true;

  const originalFetch = globalThis.fetch;

  globalThis.fetch = async function (input, init = {}) {
    let urlStr = '';
    if (typeof input === 'string') {
      urlStr = input;
    } else if (input instanceof Request) {
      urlStr = input.url;
    } else if (input && input.toString) {
      urlStr = input.toString();
    }

    let method = (init.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const isIdempotent = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'].includes(method);

    const maxAttempts = init.retries !== undefined ? init.retries : (isIdempotent ? 3 : 1);
    const baseDelay = 200;
    const customTimeout = init.timeout;

    // Cache the original body if it's a string, buffer or plain object so we can reuse it.
    // Streams / FormData are harder, but we'll try our best.
    const originalBody = init.body;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      let currentInit = { ...init };
      let currentInput = input;

      if (input instanceof Request) {
        currentInput = input.clone();
      }

      if (attempt > 1 && originalBody) {
        currentInit.body = originalBody;
      }

      delete currentInit.retries;
      delete currentInit.timeout;

      if (customTimeout) {
        currentInit.signal = AbortSignal.timeout(customTimeout);
      }

      try {
        const response = await originalFetch(currentInput, currentInit);

        if (response.ok) {
          return response;
        }

        const isRetryableStatus = [408, 429, 500, 502, 503, 504].includes(response.status);
        if (!isRetryableStatus || attempt === maxAttempts) {
          return response;
        }

        // Wait and retry
        // Must consume or cancel response to avoid memory leaks in Node
        if (response.body && typeof response.body.cancel === 'function') {
           response.body.cancel().catch(() => {});
        } else {
           await response.text().catch(() => {});
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        const sanitizedUrl = urlStr ? urlStr.split('?')[0] : 'unknown-url';
        console.warn(`[Genesis] Request to ${sanitizedUrl} returned ${response.status}. Retrying in ${delay}ms... (Attempt ${attempt}/${maxAttempts})`);

        await new Promise(resolve => setTimeout(resolve, delay));

      } catch (error) {
        // Stop retrying if the request was intentionally aborted
        if (error.name === 'AbortError') {
           throw error;
        }

        // Network errors
        if (attempt === maxAttempts) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        const sanitizedUrl = urlStr ? urlStr.split('?')[0] : 'unknown-url';
        console.warn(`[Genesis] Request to ${sanitizedUrl} failed (${error.message}). Retrying in ${delay}ms... (Attempt ${attempt}/${maxAttempts})`);

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };
}
