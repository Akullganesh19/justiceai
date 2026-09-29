import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initFetchCoalescer } from './fetchCoalescer';

describe('Fetch Coalescer', () => {
  let originalFetchMock;
  let originalWindowFetch;

  beforeEach(() => {
    // Reset state
    window._fetchCoalescerInitialized = false;
    originalWindowFetch = window.fetch;

    // Mock the original fetch
    originalFetchMock = vi.fn().mockImplementation(async (req) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 50));
      return new Response(JSON.stringify({ data: 'test' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });

    window.fetch = originalFetchMock;
  });

  afterEach(() => {
    window.fetch = originalWindowFetch;
  });

  it('coalesces multiple identical GET requests into a single network call', async () => {
    initFetchCoalescer();

    const p1 = window.fetch('https://api.example.com/data');
    const p2 = window.fetch('https://api.example.com/data');

    const [res1, res2] = await Promise.all([p1, p2]);

    expect(originalFetchMock).toHaveBeenCalledTimes(1);

    const text1 = await res1.text();
    const text2 = await res2.text();

    expect(text1).toBe(JSON.stringify({ data: 'test' }));
    expect(text2).toBe(JSON.stringify({ data: 'test' }));
  });

  it('does not coalesce POST requests', async () => {
    initFetchCoalescer();

    const p1 = window.fetch('https://api.example.com/data', { method: 'POST' });
    const p2 = window.fetch('https://api.example.com/data', { method: 'POST' });

    await Promise.all([p1, p2]);

    expect(originalFetchMock).toHaveBeenCalledTimes(2);
  });

  it('bypasses coalescing if an AbortSignal is explicitly passed', async () => {
    initFetchCoalescer();

    const controller1 = new AbortController();
    const controller2 = new AbortController();

    const p1 = window.fetch('https://api.example.com/data', { signal: controller1.signal });
    const p2 = window.fetch('https://api.example.com/data', { signal: controller2.signal });

    await Promise.all([p1, p2]);

    expect(originalFetchMock).toHaveBeenCalledTimes(2);
  });
});
