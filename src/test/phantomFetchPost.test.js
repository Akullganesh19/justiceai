import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initializePhantomFetch } from '../lib/phantom/fetchInterceptor.js';

describe('Phantom Fetch Interceptor - POST Safety', () => {
  let originalFetch;
  let OriginalRequest;

  beforeEach(() => {
    originalFetch = vi.fn().mockImplementation(async (input, init) => {
      // If the body stream was consumed when it shouldn't have been, Request parsing might fail later
      // But we just verify it gets called with correct arguments
      return { clone: () => ({ json: async () => ({ success: true }) }) };
    });

    OriginalRequest = global.Request;

    global.window = {
      fetch: originalFetch,
      Request: class Request {
        constructor(input, init) {
          if (init && init.body && init.body.locked) {
            throw new Error("Failed to construct 'Request': Cannot construct a Request with a ReadableStream that has already been used.");
          }
          this.url = typeof input === 'string' ? input : input.url;
          this.method = init?.method || 'GET';
          this.signal = init?.signal;
          this.headers = new Map();
          if (init?.body) {
              this.body = init.body;
              this.body.locked = true; // Simulating locking
          }
        }
      }
    };

    delete global.window.__PHANTOM_FETCH_ACTIVE__;
  });

  afterEach(() => {
    delete global.window;
    global.Request = OriginalRequest;
  });

  it('safely bypasses POST requests without constructing a new Request that might consume the body', async () => {
    initializePhantomFetch();

    const url = 'https://api.example.com/data';
    const init = { method: 'POST', body: { locked: false, read: () => {} } }; // Simulated stream

    const p1 = window.fetch(url, init);

    await Promise.all([p1]);

    expect(originalFetch).toHaveBeenCalledTimes(1);
    expect(originalFetch).toHaveBeenCalledWith(url, init);
  });
});
