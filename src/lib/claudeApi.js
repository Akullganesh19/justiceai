import { SYSTEM_PROMPT } from './systemPrompt';

// Route requests to our local Node.js RAG backend instead of raw Ollama
const RAG_BACKEND_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/chat`;


async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  const isRetryable = (error, response) => {
    if (error) {
      if (error.name === 'AbortError') return false;
      if (error.message && (error.message.includes('fetch failed') || error.message.includes('Network request failed'))) return true;
      return false;
    }
    if (response && !response.ok) {
      const status = response.status;
      return status === 429 || status >= 500;
    }
    return false;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  let attempt = 1;
  while (attempt <= maxRetries) {
    let response = null;
    let error = null;
    try {
      response = await fetch(url, options);
      if (!isRetryable(null, response)) {
        return response;
      }
    } catch (e) {
      error = e;
      if (!isRetryable(e, null)) {
        throw e;
      }
    }

    if (attempt === maxRetries) {
      if (error) throw error;
      return response;
    }

    const delay = 200 * Math.pow(2, attempt - 1);
    const sanitizedUrl = (typeof url === 'string' ? url : url.url || '').split('?')[0];
    console.warn(`Transient error on ${sanitizedUrl}, retrying in ${delay}ms (Attempt ${attempt}/${maxRetries})`);

    await sleep(delay);
    attempt++;
  }
}

export async function sendMessage(conversationHistory, userMessage, options = {}) {
  const { judgePersonality = 'Neutral', mode = 'copilot', jurisdiction = 'National' } = options;

  try {
    const response = await fetchWithRetry(RAG_BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          ...conversationHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        personality: judgePersonality,
        mode: mode,
        jurisdiction: jurisdiction,
        basePrompt: SYSTEM_PROMPT,
        provider: localStorage.getItem('justice_ai_provider') || 'ollama',
        apiKeys: JSON.parse(localStorage.getItem('justice_ai_keys') || '{}')
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.message.content;
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);

    // Re-throw the error so the UI can display it properly
    // instead of silently returning a fake response
    throw new Error(
      `Could not reach the JusticeAI backend. Please ensure:\n` +
        `1. Ollama is running (ollama serve)\n` +
        `2. The backend server is running (node server.js)\n` +
        `\nTechnical details: ${error.message}`,
    );
  }
}
