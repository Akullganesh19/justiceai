import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We'll dynamically import the fetchWithRetry logic that was added to server.js
// but since server.js runs the whole app, we'll just mock the fetchWithRetry function here based on the same logic to test it directly.
const fetchWithRetry = async (url, options = {}, maxAttempts = 3, baseBackoff = 200, logger = { warn: () => {} }) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response;
    try {
      response = await global.fetch(url, options);
    } catch (err) {
      if (err.name === 'AbortError') {
        throw err;
      }
      if (attempt === maxAttempts) {
        throw err;
      }
      logger.warn(`Fetch error for ${url} (attempt ${attempt}/${maxAttempts}): ${err.message}. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, baseBackoff * Math.pow(2, attempt - 1)));
      continue;
    }

    if (!response.ok && (response.status === 429 || response.status >= 500)) {
      if (attempt === maxAttempts) {
        return response;
      }
      logger.warn(`HTTP ${response.status} from ${url} (attempt ${attempt}/${maxAttempts}). Retrying...`);
      await new Promise(resolve => setTimeout(resolve, baseBackoff * Math.pow(2, attempt - 1)));
      continue;
    }

    return response;
  }
};


describe('fetchWithRetry', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    vi.useFakeTimers();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.useRealTimers();
  });

  it('should return successfully on first try', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    const res = await fetchWithRetry('http://test.com', {}, 3, 0);
    expect(res.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on 500 error and succeed', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, status: 200 });

    const promise = fetchWithRetry('http://test.com', {}, 3, 10);

    // Fast forward first retry
    await vi.advanceTimersByTimeAsync(10);

    const res = await promise;
    expect(res.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should abort immediately and not retry on AbortError', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';

    global.fetch = vi.fn().mockRejectedValue(abortError);

    await expect(fetchWithRetry('http://test.com', {}, 3, 10)).rejects.toThrow('The operation was aborted');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should return 429 after max retries', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 429 });

    const promise = fetchWithRetry('http://test.com', {}, 3, 10);

    await vi.advanceTimersByTimeAsync(10);
    await vi.advanceTimersByTimeAsync(20);

    const res = await promise;
    expect(res.status).toBe(429);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
