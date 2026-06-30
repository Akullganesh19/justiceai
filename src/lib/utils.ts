import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}





const inFlightRequests = new Map<string, Promise<Response>>();

export async function coalescedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  // Safe abort chaining bypass
  if (init?.signal) {
    return fetch(input, init);
  }

  // To check if a Request object explicitly had an abort signal attached,
  // we cannot just check `input.signal` because it is always present.
  // The simplest reliable way is to just skip coalescing if it's a Request object,
  // since the main usage in our app is via string URLs + init objects.
  if (input instanceof Request) {
    return fetch(input, init);
  }

  const urlStr = input instanceof URL ? input.toString() : (typeof input === 'string' ? input : input.url);
  const method = init?.method?.toUpperCase() || 'GET';

  // Only safely coalesce GET requests to prevent swallowing non-idempotent mutations like POST/PUT/DELETE
  if (method !== 'GET') {
    return fetch(input, init);
  }

  // Bypass if body is present (even though GETs shouldn't typically have bodies, handle it safely)
  if (init?.body) {
    return fetch(input, init);
  }

  let headersObj: Record<string, string> = {};
  if (init?.headers) {
    if (init.headers instanceof Headers) {
      init.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
    } else if (Array.isArray(init.headers)) {
      init.headers.forEach(([key, value]) => {
        headersObj[key] = value;
      });
    } else {
      Object.entries(init.headers).forEach(([key, value]) => {
        headersObj[key] = String(value);
      });
    }
  }

  const cacheKeyObj = {
    url: urlStr,
    method,
    headers: headersObj,
    credentials: init?.credentials,
    cache: init?.cache
  };

  const cacheKey = JSON.stringify(cacheKeyObj);

  if (inFlightRequests.has(cacheKey)) {
    const res = await inFlightRequests.get(cacheKey)!;
    return res.clone();
  }

  const promise = fetch(input, init)
    .then(res => {
      inFlightRequests.delete(cacheKey);
      return res;
    })
    .catch(err => {
      inFlightRequests.delete(cacheKey);
      if (err.name === 'AbortError') throw err;
      throw err;
    });

  inFlightRequests.set(cacheKey, promise);

  const res = await promise;
  return res.clone();
}
