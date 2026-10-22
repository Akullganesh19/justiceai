const inFlight = new Map();

export async function dedupedFetch(url, options = {}) {
  const method = options.method || 'GET';

  // Only deduplicate GET requests
  if (method.toUpperCase() !== 'GET') {
    return fetch(url, options);
  }

  // Create a cache key based on URL and relevant headers
  const cacheKey = JSON.stringify({
    url,
    headers: options.headers || {}
  });

  if (inFlight.has(cacheKey)) {
    // console.log(`[Phantom] Coalesced identical request to: ${url}`);
    return inFlight.get(cacheKey).then(res => res.clone());
  }

  const promise = fetch(url, options).finally(() => {
    inFlight.delete(cacheKey);
  });

  inFlight.set(cacheKey, promise);

  return promise.then(res => res.clone());
}
