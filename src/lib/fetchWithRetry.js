export async function fetchWithRetry(url, options = {}, maxAttempts = 3) {
  const { timeout, ...fetchOptions } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let controller;
    let signalToUse = fetchOptions.signal;
    let timeoutId;

    // Handle manual timeout mapping to AbortSignal
    if (timeout && !fetchOptions.signal) {
      controller = new AbortController();
      signalToUse = controller.signal;
      timeoutId = setTimeout(() => {
        const err = new Error('AbortError');
        err.name = 'AbortError';
        controller.abort(err);
      }, timeout);
    }

    try {
      const response = await window.fetch(url, { ...fetchOptions, signal: signalToUse });
      if (timeoutId) clearTimeout(timeoutId);

      // Success or non-retriable client error
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429 && response.status !== 408)) {
        return response;
      }

      // If it's the last attempt, return the response to let caller handle error
      if (attempt === maxAttempts) {
        return response;
      }

      // Explicitly consume body of transient failure to prevent leaks
      await response.text().catch((_err) => {});

      const delay = 500 * Math.pow(2, attempt - 1);
      console.warn(`[Genesis] Transient HTTP ${response.status} on ${url}. Retrying attempt ${attempt + 1}/${maxAttempts} in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));

    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);

      // Do not retry if request was intentionally aborted
      if (fetchOptions.signal?.aborted) {
        throw err;
      }

      if (attempt === maxAttempts) {
        throw err;
      }

      const errorCode = err.code || err.cause?.code || 'UNKNOWN';
      const delay = 500 * Math.pow(2, attempt - 1);
      console.warn(`[Genesis] Network error (${err.name}: ${errorCode}) on ${url}. Retrying attempt ${attempt + 1}/${maxAttempts} in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
