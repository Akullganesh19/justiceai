import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('fetch coalescer', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('coalesces duplicate fetch calls', async () => {
    const originalFetch = vi.fn().mockResolvedValue(new Response('{}'));
    global.window = { fetch: originalFetch };
    global.Headers = class Headers {
      constructor(init) { this.init = init; }
      forEach(cb) { Object.entries(this.init || {}).forEach(([k, v]) => cb(v, k)); }
    };
    global.Request = class Request {
      constructor(url, init) { this.url = url; Object.assign(this, init); }
    };

    // load coalescer
    await import('./lib/coalescer.js');

    const p1 = window.fetch('/api/test');
    const p2 = window.fetch('/api/test');

    await Promise.all([p1, p2]);

    expect(originalFetch).toHaveBeenCalledTimes(1);
    expect(window.__PHANTOM_METRICS__.coalescedRequests).toBe(1);
  });
});
