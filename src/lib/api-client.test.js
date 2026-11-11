import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dedupedFetch } from './api-client';

const fetchMock = vi.fn();

describe('api-client dedupedFetch', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockImplementation(async (input) => {
      const url = input instanceof Request ? input.url : String(input);
      await new Promise(resolve => setTimeout(resolve, 10));
      return {
        clone: () => ({ url }),
        url
      };
    });

    // Inject mock
    dedupedFetch._originalFetch = fetchMock;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deduplicates simultaneous GET requests', async () => {
    const p1 = dedupedFetch('https://api.example.com/data');
    const p2 = dedupedFetch('https://api.example.com/data');

    const [r1, r2] = await Promise.all([p1, p2]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(r1.url).toBe('https://api.example.com/data');
    expect(r2.url).toBe('https://api.example.com/data');
  });

  it('does not deduplicate non-GET requests', async () => {
    const init = { method: 'POST' };
    const p1 = dedupedFetch('https://api.example.com/data', init);
    const p2 = dedupedFetch('https://api.example.com/data', init);

    await Promise.all([p1, p2]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not deduplicate sequential GET requests', async () => {
    await dedupedFetch('https://api.example.com/data');
    await dedupedFetch('https://api.example.com/data');

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
