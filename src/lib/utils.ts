import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Auto-Retry with Exponential Backoff for frontend APIs
export async function fetchWithRetry(url: string | URL | Request, options: RequestInit = {}, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok && (response.status === 429 || response.status >= 500)) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      return response;
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      if (attempt === maxAttempts) {
        console.error(`Failed after ${maxAttempts} attempts: ${url instanceof Request ? url.url : url.toString()}`, { error: err.message });
        throw err;
      }
      const backoff = 100 * Math.pow(2, attempt - 1);
      console.warn(`Attempt ${attempt} failed for ${url instanceof Request ? url.url : url.toString()}. Retrying in ${backoff}ms...`, { error: err.message });
      await new Promise(resolve => setTimeout(resolve, backoff));
    }
  }
  throw new Error("fetchWithRetry failed");
}
