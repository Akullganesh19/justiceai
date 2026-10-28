const inFlight = new Map();

/**
 * A fetch wrapper that coalesces identical simultaneous GET requests.
 * Prevents multiple components from making the same network call at the same time.
 */
export async function dedupedFetch(input, init = {}) {
  // Only deduplicate GET requests
  const method = init.method ? init.method.toUpperCase() : 'GET';
  if (method !== 'GET') {
    return fetch(input, init);
  }

  // Handle Request objects properly
  const url = input instanceof Request ? input.url : input.toString();

  if (inFlight.has(url)) {
    console.debug(`[dedupedFetch] Coalescing request to ${url}`);
    const promise = inFlight.get(url);
    const response = await promise;
    // Always clone the response so multiple consumers don't get "body already consumed"
    return response.clone();
  }

  const promise = fetch(input, init)
    .finally(() => {
      inFlight.delete(url);
    });

  inFlight.set(url, promise);

  const response = await promise;
  // Clone the response for the first caller too, so it matches what subsequent callers get
  return response.clone();
}
