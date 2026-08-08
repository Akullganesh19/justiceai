export async function fetchWithRetry(url, options = {}, retryOptions = {}) {
  const {
    maxAttempts = 3,
    baseDelay = 200,
    retryNonIdempotent = false,
    timeout = 30000,
  } = retryOptions;

  const method = (options.method || 'GET').toUpperCase();
  const idempotentMethods = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'];
  const isIdempotent = idempotentMethods.includes(method);

  if (!isIdempotent && !retryNonIdempotent) {
    // If not idempotent and not explicitly allowed, do not retry
    const signal = timeout ? AbortSignal.timeout(timeout) : undefined;
    return fetch(url, { ...options, signal });
  }

  const cleanUrl = url.split('?')[0];
  let lastResponse = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const signal = timeout ? AbortSignal.timeout(timeout) : undefined;
      let currentOptions = { ...options, signal };

      // Clone Request if it's passed as first argument, but we are using url (string)
      // If body is a stream, it might be consumed. For this app, JSON bodies are used.

      const response = await fetch(url, currentOptions);

      // Check if response is successful or if it's a client error (don't retry 4xx except 429)
      if (response.ok) {
        return response;
      }

      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          return response; // Return early for client errors like 400, 401, 404
      }

      lastResponse = response;

      if (attempt === maxAttempts) {
        console.warn(`[Genesis] Exhausted ${maxAttempts} attempts for ${cleanUrl}. Status: ${response.status}`);
        return response;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`[Genesis] Attempt ${attempt} failed for ${cleanUrl} (${response.status}). Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));

    } catch (err) {
      if (attempt === maxAttempts) {
        console.error(`[Genesis] Exhausted ${maxAttempts} attempts for ${cleanUrl}. Error: ${err.message}`);
        throw err;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`[Genesis] Attempt ${attempt} failed for ${cleanUrl} (${err.message}). Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }

  return lastResponse;
}
