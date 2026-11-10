const inFlight = new Map();
const originalFetch = typeof window !== 'undefined' ? window.fetch : null;

export function setupApiClient() {
  if (typeof window === 'undefined' || !window.fetch) return;
  if (window.fetch.name === 'dedupedFetch') return; // Prevent double-wrapping

  window.fetch = async function dedupedFetch(input, init) {
    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();

    // Only coalesce GET requests
    if (method !== 'GET') {
      return originalFetch(input, init);
    }

    // Correctly handle Request objects vs strings for cache key
    const urlString = input instanceof Request ? input.url : String(input);
    const cacheKey = urlString;

    if (inFlight.has(cacheKey)) {
      const response = await inFlight.get(cacheKey);
      return response.clone();
    }

    const promise = originalFetch(input, init).finally(() => inFlight.delete(cacheKey));
    inFlight.set(cacheKey, promise);

    const response = await promise;
    return response.clone();
  };
}
