/**
 * Helper to retry a given async function (e.g., fetch) with exponential backoff.
 * Re-throws the final error if all attempts fail.
 */
export async function fetchWithRetry(url, options = {}, retries = 3, baseDelay = 100) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      // standard fetch doesn't throw on HTTP errors (e.g., 500), but we want to retry 5xx errors
      if (!response.ok && response.status >= 500) {
        if (attempt === retries) {
          // If max attempts reached, we return the response to let the caller handle it.
          // Because normal fetch doesn't throw on 5xx, we shouldn't throw either.
          return response;
        }
        // Throw an error here to trigger the catch block and retry.
        throw new Error(`HTTP Error: ${response.status}`);
      }

      // If it's a 4xx error or successful (2xx, 3xx), return immediately.
      return response;
    } catch (err) {
      // It's a network failure or a thrown 5xx error
      if (attempt === retries) {
        throw err;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`[fetchWithRetry] Attempt ${attempt} failed for ${url}. Retrying in ${delay}ms...`, err.message);

      await new Promise((resolve) => {
        let id;
        id = setTimeout(() => {
          clearTimeout(id);
          resolve();
        }, delay);
      });
    }
  }
}
