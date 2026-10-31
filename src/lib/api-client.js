const inFlight = new Map();
const originalFetch = typeof window !== 'undefined' ? window.fetch : globalThis.fetch;

export async function dedupedFetch(input, init) {
  const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();

  if (method !== 'GET') {
    return originalFetch(input, init);
  }

  const url = input instanceof Request ? input.url : String(input);
  const cacheKey = `${method}:${url}`;

  if (inFlight.has(cacheKey)) {
    const res = await inFlight.get(cacheKey);
    return res.clone();
  }

  const promise = originalFetch(input, init);
  inFlight.set(cacheKey, promise);

  try {
    const res = await promise;
    return res.clone();
  } finally {
    inFlight.delete(cacheKey);
  }
}

export function setupApiClient() {
  if (typeof window !== 'undefined') {
    window.fetch = dedupedFetch;
  }
}
