// Multiple simultaneous requests for the same resource → one request
const inFlight = new Map();
export async function dedupedFetch(url, options = {}) {
  // Only deduplicate GET requests
  if (options.method && options.method.toUpperCase() !== 'GET') {
    return fetch(url, options);
  }

  // Create a unique key for the request (url + serialized headers/options if needed)
  // For simplicity, we just use the URL for GET requests as they typically shouldn't have varying bodies
  const cacheKey = url;

  if (inFlight.has(cacheKey)) {
    // Clone the response so multiple consumers can read the body
    return inFlight.get(cacheKey).then(res => res.clone());
  }

  const promise = fetch(url, options)
    .finally(() => inFlight.delete(cacheKey));

  inFlight.set(cacheKey, promise);

  // Clone the response for the original caller too, just in case
  return promise.then(res => res.clone());
}
