import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inFlight = new Map<string, Promise<Response>>();

export async function dedupedFetch(url: string | URL | Request, options?: RequestInit): Promise<Response> {
  let method = 'GET';
  if (options && options.method) {
    method = options.method.toUpperCase();
  } else if (url instanceof Request) {
    method = url.method.toUpperCase();
  }

  // Extract URL string safely whether it's a string, URL object, or Request object
  const urlString = url instanceof Request ? url.url : url.toString();

  // Create a unique key that includes headers if present (to avoid mixing up authenticated/unauthenticated requests)
  let headersString = '';
  if (options && options.headers) {
    if (options.headers instanceof Headers) {
      const headersObj: Record<string, string> = {};
      options.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      headersString = JSON.stringify(headersObj);
    } else {
      headersString = JSON.stringify(options.headers);
    }
  } else if (url instanceof Request) {
    const headersObj: Record<string, string> = {};
    url.headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    headersString = JSON.stringify(headersObj);
  }

  const cacheKey = `${urlString}|${headersString}`;

  if (method === 'GET') {
    if (inFlight.has(cacheKey)) {
      const promise = inFlight.get(cacheKey)!;
      return promise.then(res => res.clone());
    }

    const promise = fetch(url, options).finally(() => inFlight.delete(cacheKey));
    inFlight.set(cacheKey, promise);
    return promise.then(res => res.clone());
  }

  return fetch(url, options);
}
