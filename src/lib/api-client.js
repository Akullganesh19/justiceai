const inFlight = new Map();

/**
 * A wrapper around native fetch that coalesces identical GET requests.
 * If multiple components request the same URL simultaneously, only one network request is made.
 *
 * @param {RequestInfo | URL} input
 * @param {RequestInit} [init]
 * @returns {Promise<Response>}
 */
export async function dedupedFetch(input, init) {
  // Only deduplicate GET requests
  const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();

  if (method !== 'GET') {
    return fetch(input, init);
  }

  // Handle both Request objects and string URLs
  const urlString = input instanceof Request ? input.url : String(input);

  if (inFlight.has(urlString)) {
    // Await the ongoing request and return a cloned response
    // so multiple consumers can read the body
    const res = await inFlight.get(urlString);
    return res.clone();
  }

  // Create a new promise for the fetch
  const promise = fetch(input, init)
    .then((res) => {
      // Must clone before returning so the promise resolves with a cloneable response
      // But we just return it here and let the map hold the canonical response
      return res;
    })
    .finally(() => {
      // Remove from map once complete (success or fail)
      inFlight.delete(urlString);
    });

  inFlight.set(urlString, promise);

  // Return a cloned response to the initial caller as well
  const res = await promise;
  return res.clone();
}
