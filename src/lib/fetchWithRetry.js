export async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  let lastError;
  let lastResponse;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status >= 500) {
        lastResponse = response;
        throw new Error(`Server Error: ${response.status}`);
      }
      return response;
    } catch (err) {
      lastError = err;
      if (err.name === 'AbortError') {
        throw err;
      }

      const errorCode = err.code || err.cause?.code;
      const isNodeNetworkError = ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'].includes(errorCode);
      // More robust browser network error check
      const isBrowserNetworkError = err instanceof TypeError && (
        err.message === 'Failed to fetch' ||
        err.message === 'Load failed' ||
        err.message.includes('NetworkError')
      );

      if (!isNodeNetworkError && !isBrowserNetworkError && (!err.message || !err.message.includes('Server Error'))) {
        throw err;
      }

      console.warn(`[🧬 Genesis Auto-Recovery] Transient error fetching ${url} (Attempt ${i + 1}/${maxRetries}). Retrying...`, err.message);

      if (i === maxRetries - 1) break;
      await delay(100 * Math.pow(2, i));
    }
  }

  // If we failed because of a 5xx, return the last response so the caller can read the body if they want, or throw.
  // Actually, throwing the lastError keeps the signature identical, but let's just throw lastError.
  throw lastError;
}
