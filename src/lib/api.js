// Request coalescing and caching layer (Phantom Infrastructure)

const inFlight = new Map();
const cache = new Map();

// Configuration for caching
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function phantomFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const bodyStr = options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : '';
  const key = `${method}|${url}|${bodyStr}`;

  // 1. Intelligent Cache Layer (Stale-While-Revalidate for GET requests)
  if (method === 'GET' && cache.has(key)) {
    const cachedEntry = cache.get(key);
    const isStale = Date.now() - cachedEntry.timestamp > CACHE_TTL_MS;

    if (!isStale) {
      // Return fresh cache immediately
      return cachedEntry.response.clone();
    } else {
      // Stale-while-revalidate: trigger background fetch but return stale immediately
      fetchAndCache(url, options, key).catch((_err) => {
        // Silently swallow background revalidation errors to avoid polluting console
      });
      return cachedEntry.response.clone();
    }
  }

  // 2. Request Coalescing (Deduplicate simultaneous identical requests)
  if (inFlight.has(key)) {
    try {
      const res = await inFlight.get(key);
      return res.clone();
    } catch (_err) {
      // If the in-flight request fails, fall through to try again
    }
  }

  // 3. Normal Fetch (and Cache if GET)
  const promise = fetchAndCache(url, options, key);
  inFlight.set(key, promise);

  try {
    const res = await promise;
    return res.clone();
  } finally {
    // Keep in flight for a tiny bit longer to catch rapid concurrent requests
    setTimeout(() => {
      if (inFlight.get(key) === promise) {
        inFlight.delete(key);
      }
    }, 50);
  }
}

async function fetchAndCache(url, options, key) {
  const method = (options.method || 'GET').toUpperCase();
  const response = await fetch(url, options);

  if (method === 'GET' && response.ok) {
    // Only cache successful GET requests
    cache.set(key, {
      response: response.clone(),
      timestamp: Date.now()
    });
  }

  return response;
}
