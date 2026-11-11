const inFlight = new Map();

export async function dedupedFetch(input, init) {
  const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();

  // Always use the current window.fetch for original call
  // unless we are recursive (prevent infinite loop if we are window.fetch)
  // Actually, we can just capture the real fetch during setupApiClient
  const fetchToUse = dedupedFetch._originalFetch || (typeof window !== 'undefined' ? window.fetch : fetch);

  if (method !== 'GET') {
    return fetchToUse(input, init);
  }

  const url = input instanceof Request ? input.url : String(input);
  const cacheKey = url;

  if (inFlight.has(cacheKey)) {
    const response = await inFlight.get(cacheKey);
    return response.clone();
  }

  const fetchPromise = fetchToUse(input, init).finally(() => {
    inFlight.delete(cacheKey);
  });

  inFlight.set(cacheKey, fetchPromise);

  const response = await fetchPromise;
  return response.clone();
}

// Store it for testing
dedupedFetch._originalFetch = typeof window !== 'undefined' ? window.fetch : null;

export function setupApiClient() {
  if (typeof window !== 'undefined' && window.fetch !== dedupedFetch) {
    dedupedFetch._originalFetch = window.fetch;
    window.fetch = dedupedFetch;
  }
}
