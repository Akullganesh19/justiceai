import { SYSTEM_PROMPT } from './systemPrompt';

// Route requests to our local Node.js RAG backend instead of raw Ollama
const RAG_BACKEND_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/chat`;

// Genesis: Self-Healing Architecture
// Protects frontend requests to backend with exponential backoff retries
async function withRetry(operationName, fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      // Fast fail on certain errors
      if (err.message && (err.message.includes('401') || err.message.includes('403') || err.message.includes('missing'))) {
        console.error(`[Genesis] ${operationName} failed with unrecoverable error. Fast failing.`);
        throw err;
      }

      if (attempt === maxAttempts) {
        console.error(`[Genesis] ${operationName} failed after ${maxAttempts} attempts. Giving up. Error: ${err.message}`);
        throw err;
      }

      const delayMs = 100 * Math.pow(2, attempt - 1);
      console.warn(`[Genesis] ${operationName} failed (Attempt ${attempt}/${maxAttempts}). Retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

export async function sendMessage(conversationHistory, userMessage, options = {}) {
  const { judgePersonality = 'Neutral', mode = 'copilot', jurisdiction = 'National' } = options;

  try {
    const response = await withRetry('Backend Chat API', async () => {
      const res = await fetch(RAG_BACKEND_URL, {
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

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend returned ${res.status}: ${errorText}`);
      }
      return res;
    });

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
