import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendMessage } from '../claudeApi';
import { SYSTEM_PROMPT } from '../systemPrompt';

describe('claudeApi - sendMessage', () => {
  const originalFetch = global.fetch;
  const originalLocalStorage = global.localStorage;

  beforeEach(() => {
    global.fetch = vi.fn();

    // Mock localStorage
    const store = {
      'justice_ai_provider': 'custom-provider',
      'justice_ai_keys': JSON.stringify({ key1: 'value1' })
    };
    global.localStorage = {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
    };

    // Reset env
    import.meta.env = { VITE_API_URL: 'http://localhost:3001' };
  });

  afterEach(() => {
    global.fetch = originalFetch;
    global.localStorage = originalLocalStorage;
    vi.restoreAllMocks();
  });

  it('should successfully send a message and return the response content', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ message: { content: 'Success response!' } }),
    };
    global.fetch.mockResolvedValue(mockResponse);

    const conversationHistory = [{ role: 'user', content: 'Hello' }];
    const userMessage = 'ignored in code actually'; // userMessage is not used in the body construction if we look closely at the code
    const options = { judgePersonality: 'Strict', mode: 'assistant', jurisdiction: 'State' };

    const result = await sendMessage(conversationHistory, userMessage, options);

    expect(result).toBe('Success response!');
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const fetchArgs = global.fetch.mock.calls[0];
    expect(fetchArgs[0]).toBe('http://localhost:3001/api/chat');
    expect(fetchArgs[1].method).toBe('POST');
    expect(fetchArgs[1].headers).toEqual({ 'Content-Type': 'application/json' });

    const body = JSON.parse(fetchArgs[1].body);
    expect(body).toEqual({
      messages: [{ role: 'user', content: 'Hello' }],
      personality: 'Strict',
      mode: 'assistant',
      jurisdiction: 'State',
      basePrompt: SYSTEM_PROMPT,
      provider: 'custom-provider',
      apiKeys: { key1: 'value1' }
    });
  });

  it('should handle response not ok', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue('Internal Server Error'),
    };
    global.fetch.mockResolvedValue(mockResponse);

    const conversationHistory = [];
    const userMessage = 'test';

    await expect(sendMessage(conversationHistory, userMessage)).rejects.toThrow(
      'Could not reach the JusticeAI backend. Please ensure:\n1. Ollama is running (ollama serve)\n2. The backend server is running (node server.js)\n\nTechnical details: Backend returned 500: Internal Server Error'
    );
  });

  it('should handle fetch throwing an error (e.g. network failure)', async () => {
    global.fetch.mockRejectedValue(new Error('Network disconnected'));

    const conversationHistory = [];
    const userMessage = 'test';

    await expect(sendMessage(conversationHistory, userMessage)).rejects.toThrow(
      'Could not reach the JusticeAI backend. Please ensure:\n1. Ollama is running (ollama serve)\n2. The backend server is running (node server.js)\n\nTechnical details: Network disconnected'
    );
  });
});
