// src/lib/api-client.js

/**
 * Request Coalescing (Deduplication) for Fetch API.
 * Multiple simultaneous GET requests to the same URL return the exact same Promise,
 * saving network requests and preventing redundant backend hits.
 */
const inFlight = new Map();

/**
 * A drop-in replacement for `fetch` that coalesces identical simultaneous GET requests.
 * @param {string|Request} url - The URL or Request object to fetch
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<Response>}
 */
export async function dedupedFetch(url, options = {}) {
  // Only deduplicate GET requests (default method is GET)
  const method = (options.method || 'GET').toUpperCase();
  if (method !== 'GET') {
    return fetch(url, options);
  }

  // Generate a cache key. For simplicity, we just use the stringified URL.
  // In a more complex scenario, you might include headers or specific query params.
  const key = typeof url === 'string' ? url : (url.url || url.toString());

  if (inFlight.has(key)) {
    // If a request to this URL is already in flight, wait for it and clone the response
    const promise = inFlight.get(key);
    const res = await promise;
    // We MUST clone the response because body can only be consumed once
    return res.clone();
  }

  // Create a new request promise
  const promise = fetch(url, options);
  inFlight.set(key, promise);

  try {
    const res = await promise;
    // Return a clone for the original caller, keeping the original response in the promise
    // so subsequent awaiters also get a valid clone
    return res.clone();
  } finally {
    // Clean up the map once the request finishes (success or fail)
    inFlight.delete(key);
  }
}

/**
 * Advanced wrapper incorporating request deduplication and a retry mechanism
 * for robustness against transient network failures.
 */
export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 300) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await dedupedFetch(url, options);
      if (!res.ok && res.status >= 500 && i < retries - 1) {
        // Retry on 5xx errors
        await new Promise(r => setTimeout(r, backoff * Math.pow(2, i)));
        continue;
      }
      return res; // let calling function handle 4xx errors instead of throwing immediately
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, backoff * Math.pow(2, i)));
    }
  }
}
