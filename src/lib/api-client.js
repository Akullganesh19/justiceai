const inFlight = new Map();

export async function dedupedFetch(url, options = {}) {
  // We only coalesce GET requests
  if (options.method && options.method.toUpperCase() !== 'GET') {
    return fetch(url, options);
  }

  // Handle URL object or Request object for cache key
  const cacheKey = url instanceof Request ? url.url : url.toString();

  if (inFlight.has(cacheKey)) {
    // Return a clone of the response to prevent "body already consumed" errors
    const res = await inFlight.get(cacheKey);
    return res.clone();
  }

  const promise = fetch(url, options).finally(() => inFlight.delete(cacheKey));
  inFlight.set(cacheKey, promise);

  const res = await promise;
  return res.clone();
}
