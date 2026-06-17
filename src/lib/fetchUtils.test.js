import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWithCache, clearCache } from './fetchUtils';

describe('fetchWithCache', () => {
  let originalFetch;

  beforeEach(() => {
    vi.useFakeTimers();
    clearCache();
    originalFetch = global.fetch;
  });

  afterEach(() => {
    vi.useRealTimers();
    global.fetch = originalFetch;
    clearCache();
  });

  it('should coalesce multiple identical simultaneous requests', async () => {
    let fetchCallCount = 0;
    global.fetch = vi.fn().mockImplementation((url) => {
      fetchCallCount++;
      return new Promise((resolve) => {
        setTimeout(() => resolve(new Response('mock data', { status: 200 })), 100);
      });
    });

    const p1 = fetchWithCache('http://example.com/api/data');
    const p2 = fetchWithCache('http://example.com/api/data');
    const p3 = fetchWithCache('http://example.com/api/data');

    vi.advanceTimersByTime(150);

    const [r1, r2, r3] = await Promise.all([p1, p2, p3]);

    expect(fetchCallCount).toBe(1);
    expect(await r1.text()).toBe('mock data');
    expect(await r2.text()).toBe('mock data');
    expect(await r3.text()).toBe('mock data');
  });

  it('should return cached response if within TTL', async () => {
    let fetchCallCount = 0;
    global.fetch = vi.fn().mockImplementation((url) => {
      fetchCallCount++;
      return Promise.resolve(new Response('mock data ' + fetchCallCount, { status: 200 }));
    });

    const r1 = await fetchWithCache('http://example.com/api/ttl');
    expect(await r1.text()).toBe('mock data 1');

    vi.advanceTimersByTime(1000); // within TTL

    const r2 = await fetchWithCache('http://example.com/api/ttl');
    expect(await r2.text()).toBe('mock data 1');
    expect(fetchCallCount).toBe(1);
  });

  it('should implement stale-while-revalidate', async () => {
    let fetchCallCount = 0;
    global.fetch = vi.fn().mockImplementation((url) => {
      fetchCallCount++;
      return new Promise((resolve) => {
        setTimeout(() => resolve(new Response('mock data ' + fetchCallCount, { status: 200 })), 50);
      });
    });

    // 1. Initial request
    const p1 = fetchWithCache('http://example.com/api/swr');
    vi.advanceTimersByTime(100);
    const r1 = await p1;
    expect(await r1.text()).toBe('mock data 1');
    expect(fetchCallCount).toBe(1);

    // 2. Advance time past TTL (TTL is 60s)
    vi.advanceTimersByTime(61 * 1000);

    // 3. Stale request - should return cached immediately and fetch in background
    const p2 = fetchWithCache('http://example.com/api/swr');
    const r2 = await p2;
    // It returns stale data instantly
    expect(await r2.text()).toBe('mock data 1');

    vi.advanceTimersByTime(100); // Allow background fetch to complete

    // We need to wait for all the `.then` chains attached to the fetch in fetchUtils to execute
    // so cache is updated correctly.
    await new Promise(resolve => process.nextTick(resolve));
    await new Promise(resolve => process.nextTick(resolve));
    await new Promise(resolve => process.nextTick(resolve));

    expect(fetchCallCount).toBe(2);

    // 5. Next request should get fresh data
    const p3 = fetchWithCache('http://example.com/api/swr');
    const r3 = await p3;
    expect(await r3.text()).toBe('mock data 2');
    expect(fetchCallCount).toBe(2);
  });

  it('should not cache POST requests', async () => {
    let fetchCallCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      fetchCallCount++;
      return Promise.resolve(new Response('ok', { status: 200 }));
    });

    await fetchWithCache('http://example.com/api/post', { method: 'POST' });
    await fetchWithCache('http://example.com/api/post', { method: 'POST' });

    expect(fetchCallCount).toBe(2);
  });
});
