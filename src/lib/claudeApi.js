import { SYSTEM_PROMPT } from './systemPrompt';

// Route requests to our local Node.js RAG backend instead of raw Ollama
const RAG_BACKEND_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/chat`;


async function fetchWithRetry(url, options = {}, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, options);
      // Don't retry on successful responses or 4xx errors (except 408/429)
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 408 && response.status !== 429)) {
        return response;
      }

      // If it's a 5xx, 408, or 429, we should retry if we have attempts left
      if (attempt === maxAttempts) {
        return response; // Return the last response (even if error) if we're out of attempts
      }

      const delay = 100 * Math.pow(2, attempt - 1);
      console.warn(`⚠️ Backend ${options.method || 'GET'} ${url} failed with status ${response.status}. Retrying in ${delay}ms (Attempt ${attempt}/${maxAttempts})`);
      await new Promise(r => setTimeout(r, delay));
    } catch (err) {
      if (attempt === maxAttempts) throw err;

      const delay = 100 * Math.pow(2, attempt - 1);
      console.warn(`⚠️ Backend ${options.method || 'GET'} ${url} failed with network error: ${err.message}. Retrying in ${delay}ms (Attempt ${attempt}/${maxAttempts})`);
      await new Promise(r => setTimeout(r, delay));
    }
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
