import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}




const _originalFetch = typeof window !== 'undefined' ? window.fetch : globalThis.fetch;
const inFlightRequests = new Map<string, Promise<Response>>();

/**
 * Coalesced fetch that deduplicates identical concurrent GET requests.
 * Invisible infrastructure that makes the app feel faster by preventing
 * duplicate network requests when multiple components request the same data.
 */
export function coalescedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const fetchFn = _originalFetch || fetch;

  // Skip if it's a Request object (harder to inspect safely, especially the signal)
  if (typeof Request !== 'undefined' && input instanceof Request) {
    return fetchFn(input, init);
  }

  // Only coalesce simple GET requests without bodies
  const method = init?.method?.toUpperCase() || 'GET';
  if (method !== 'GET' || init?.body) {
    return fetchFn(input, init);
  }

  // Skip if caller provided a custom abort signal (prevents unsafe abort chaining)
  if (init?.signal) {
    return fetchFn(input, init);
  }

  const url = input.toString();
  // We MUST include headers in the cache key. Two requests to the same URL
  // with different auth tokens or content types are NOT the same request.
  let headersKey = '{}';
  if (init?.headers) {
    try {
      const headersObj = new Headers(init.headers as HeadersInit);
      // Sort keys to ensure consistent JSON stringification
      const sortedHeaders = [...headersObj.entries()].sort();
      headersKey = JSON.stringify(sortedHeaders);
    } catch (e) {
      headersKey = JSON.stringify(init.headers);
    }
  }
  const cacheKey = `${url}|${headersKey}`;

  if (inFlightRequests.has(cacheKey)) {
    // Clone the response so each caller gets their own readable stream
    return inFlightRequests.get(cacheKey)!.then(res => res.clone());
  }

  const promise = fetchFn(input, init).finally(() => {
    // Clean up once the request completes (success or failure)
    inFlightRequests.delete(cacheKey);
  });

  inFlightRequests.set(cacheKey, promise);

  // Clone for the original caller too
  return promise.then(res => res.clone());
}
