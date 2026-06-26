import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchWithRetry(url: string | URL | globalThis.Request, options: RequestInit = {}, maxRetries: number = 3): Promise<Response> {
  const baseDelay = 500;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok && (response.status === 429 || response.status >= 500)) {
        if (attempt === maxRetries) return response;
        throw new Error(`Transient HTTP Error ${response.status}`);
      }
      return response;
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      if (attempt === maxRetries) throw err;
      console.warn(`Fetch attempt ${attempt} failed for ${url}... Retrying in ${baseDelay * Math.pow(2, attempt - 1)}ms. Error: ${err.message}`);
      await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
    }
  }
  throw new Error("Unreachable");
}
