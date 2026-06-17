import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMessage } from './claudeApi';

// Mock localStorage to prevent errors since it's used in claudeApi.js
const mockLocalStorage = {
  getItem: vi.fn(),
};
global.localStorage = mockLocalStorage;

describe('claudeApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('sendMessage', () => {
    it('throws custom error message when fetch fails (e.g. network failure)', async () => {
      // Mock global fetch to simulate a network error
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network request failed'));
      global.fetch = mockFetch;

      const conversationHistory = [{ role: 'user', content: 'Hello' }];
      const userMessage = 'Hello';

      // Call sendMessage and expect it to reject with our specific custom error
      await expect(sendMessage(conversationHistory, userMessage)).rejects.toThrowError(
        /Could not reach the JusticeAI backend/
      );

      // Verify fetch was called with the correct URL
      expect(mockFetch).toHaveBeenCalled();
    });

    it('throws error when backend returns non-ok status', async () => {
      // Mock global fetch to simulate a 500 error
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error')
      });
      global.fetch = mockFetch;

      const conversationHistory = [{ role: 'user', content: 'Hello' }];
      const userMessage = 'Hello';

      // It should throw the error which is then caught and wrapped with the custom error
      await expect(sendMessage(conversationHistory, userMessage)).rejects.toThrowError(
        /Could not reach the JusticeAI backend/
      );

      // Also verify the technical details part of the message includes the original error
      await expect(sendMessage(conversationHistory, userMessage)).rejects.toThrowError(
        /Backend returned 500: Internal Server Error/
      );
    });

    it('returns content on successful fetch', async () => {
      // Mock global fetch to simulate a successful response
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: { content: 'Success content' } })
      });
      global.fetch = mockFetch;

      const conversationHistory = [{ role: 'user', content: 'Hello' }];
      const userMessage = 'Hello';

      const result = await sendMessage(conversationHistory, userMessage);
      expect(result).toBe('Success content');
    });
  });
});
