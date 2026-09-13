import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('fetchInterceptor', () => {
  let originalFetch;

  beforeEach(() => {
    vi.resetModules();

    // Set up basic mock environment
    originalFetch = vi.fn();
    global.window = {
      fetch: originalFetch
    };

    global.Request = class Request {
      constructor(url, init = {}) {
        this.url = url;
        this.method = init.method || 'GET';
        this.signal = init.signal;
        this.headers = new global.Headers(init.headers);
      }
    };

    global.Headers = class Headers {
      constructor(init = {}) {
        this.map = new Map(Object.entries(init));
      }
      entries() {
        return this.map.entries();
      }
    };

    global.Response = class Response {
      constructor(body) {
        this.body = body;
      }
      clone() {
        return new Response(this.body);
      }
    };
  });

  it('coalesces identical GET requests', async () => {
    // Import interceptor logic (mutates window.fetch)
    await import('../lib/fetchInterceptor.js');

    const mockResponse = new global.Response('data');

    // Simulate slow network request
    let resolveNetwork;
    const networkPromise = new Promise(resolve => {
      resolveNetwork = resolve;
    });

    originalFetch.mockImplementationOnce(() => networkPromise);

    // Call intercepted fetch twice concurrently
    const promise1 = window.fetch('https://api.example.com/data');
    const promise2 = window.fetch('https://api.example.com/data');

    // Resolve network request
    resolveNetwork(mockResponse);

    const res1 = await promise1;
    const res2 = await promise2;

    // Ensure actual fetch was only called once
    expect(originalFetch).toHaveBeenCalledTimes(1);

    // Both responses should be clones
    expect(res1.body).toBe('data');
    expect(res2.body).toBe('data');
    expect(res1).not.toBe(res2); // Should be distinct clones
  });
});
