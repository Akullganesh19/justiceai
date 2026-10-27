const inFlight = new Map();

/**
 * A wrapper around fetch that coalesces multiple simultaneous requests
 * for the same URL into a single request.
 */
export async function dedupedFetch(url, options = {}) {
  // We only coalesce GET requests
  const method = options.method || 'GET';
  if (method.toUpperCase() !== 'GET') {
    return fetch(url, options);
  }

  // Handle both string URLs and Request objects
  const urlStr = typeof url === 'string' ? url : url.url;
  const cacheKey = urlStr;

  if (inFlight.has(cacheKey)) {
    // Need to clone the response since the body can only be consumed once
    return inFlight.get(cacheKey).then(res => res.clone());
  }

  const promise = fetch(url, options).finally(() => {
    inFlight.delete(cacheKey);
  });

  inFlight.set(cacheKey, promise);

  // Clone the initial response so the promise in the map can still be cloned by others
  return promise.then(res => res.clone());
}
