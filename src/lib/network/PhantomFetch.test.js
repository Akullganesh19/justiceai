import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initializePhantomFetch, restorePhantomFetch } from './PhantomFetch';

describe('PhantomFetch Request Coalescing', () => {
  let mockOriginalFetch;

  beforeEach(() => {
    // Setup a mock window fetch before initialization
    mockOriginalFetch = vi.fn().mockImplementation(async (url, _init) => {
      // Simulate network delay to ensure promises are held in-flight
      await new Promise(resolve => setTimeout(resolve, 50));
      return {
        url: url.toString(),
        ok: true,
        clone: function() {
          return { ...this };
        }
      };
    });
    global.window = { fetch: mockOriginalFetch };

    // Initialize the interceptor
    initializePhantomFetch();
  });

  afterEach(() => {
    restorePhantomFetch();
    delete global.window;
  });

  it('coalesces multiple simultaneous identical GET requests into a single network call', async () => {
    const url = 'https://api.example.com/data';

    // Fire three requests simultaneously
    const req1 = window.fetch(url);
    const req2 = window.fetch(url);
    const req3 = window.fetch(url);

    const [res1, res2, res3] = await Promise.all([req1, req2, req3]);

    // They should all resolve correctly
    expect(res1.url).toBe(url);
    expect(res2.url).toBe(url);
    expect(res3.url).toBe(url);

    // But the underlying fetch should only have been called ONCE
    expect(mockOriginalFetch).toHaveBeenCalledTimes(1);
  });

  it('does not coalesce requests with different URLs', async () => {
    const req1 = window.fetch('https://api.example.com/data1');
    const req2 = window.fetch('https://api.example.com/data2');

    await Promise.all([req1, req2]);

    expect(mockOriginalFetch).toHaveBeenCalledTimes(2);
  });

  it('does not coalesce requests with different headers', async () => {
    const url = 'https://api.example.com/data';

    const req1 = window.fetch(url, { headers: { 'Authorization': 'Bearer 1' } });
    const req2 = window.fetch(url, { headers: { 'Authorization': 'Bearer 2' } });

    await Promise.all([req1, req2]);

    // Because headers differ, cache keys differ
    expect(mockOriginalFetch).toHaveBeenCalledTimes(2);
  });

  it('bypasses coalescing for non-GET methods', async () => {
    const url = 'https://api.example.com/data';

    const req1 = window.fetch(url, { method: 'POST', body: 'data' });
    const req2 = window.fetch(url, { method: 'POST', body: 'data' });

    await Promise.all([req1, req2]);

    // POST requests should never be coalesced
    expect(mockOriginalFetch).toHaveBeenCalledTimes(2);
  });

  it('bypasses coalescing if an AbortSignal is present', async () => {
    const url = 'https://api.example.com/data';
    const controller = new AbortController();

    const req1 = window.fetch(url, { signal: controller.signal });
    const req2 = window.fetch(url, { signal: controller.signal });

    await Promise.all([req1, req2]);

    // Requests with an AbortSignal should be bypassed to avoid cancellation cross-talk
    expect(mockOriginalFetch).toHaveBeenCalledTimes(2);
  });
});
