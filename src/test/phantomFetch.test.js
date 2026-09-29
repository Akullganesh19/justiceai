import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initializePhantomFetch } from '../lib/phantom/fetchInterceptor.js';

describe('Phantom Fetch Interceptor', () => {
  let originalFetch;
  let OriginalRequest;

  beforeEach(() => {
    // Return a mocked Response object to satisfy Request/Response in jsdom
    originalFetch = vi.fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return { clone: () => ({ json: async () => ({ success: true }) }) };
    });

    OriginalRequest = global.Request;

    // Set a global window for the interceptor
    global.window = {
      fetch: originalFetch,
      Request: class Request {
        constructor(input, init) {
          this.url = typeof input === 'string' ? input : input.url;
          this.method = init?.method || 'GET';
          this.signal = init?.signal;
          this.headers = new Map();
        }
      }
    };

    // Reset global state
    delete global.window.__PHANTOM_FETCH_ACTIVE__;
  });

  afterEach(() => {
    delete global.window;
    global.Request = OriginalRequest;
  });

  it('coalesces multiple identical concurrent GET requests', async () => {
    initializePhantomFetch();

    const url = 'https://api.example.com/data';

    // Fire 3 simultaneous requests
    const p1 = window.fetch(url);
    const p2 = window.fetch(url);
    const p3 = window.fetch(url);

    await Promise.all([p1, p2, p3]);

    // originalFetch should only be called ONCE
    expect(originalFetch).toHaveBeenCalledTimes(1);
  });

  it('does not coalesce non-GET requests', async () => {
    initializePhantomFetch();

    const url = 'https://api.example.com/data';
    const init = { method: 'POST', body: 'test' };

    const p1 = window.fetch(url, init);
    const p2 = window.fetch(url, init);

    await Promise.all([p1, p2]);

    // POST requests are not coalesced
    expect(originalFetch).toHaveBeenCalledTimes(2);
  });

  it('does not coalesce requests with AbortSignal', async () => {
    initializePhantomFetch();

    const url = 'https://api.example.com/data';

    const controller1 = new AbortController();
    const controller2 = new AbortController();

    const p1 = window.fetch(url, { signal: controller1.signal });
    const p2 = window.fetch(url, { signal: controller2.signal });

    await Promise.all([p1, p2]);

    expect(originalFetch).toHaveBeenCalledTimes(2);
  });
});
