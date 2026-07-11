import { SYSTEM_PROMPT } from './systemPrompt';

// Route requests to our local Node.js RAG backend instead of raw Ollama
const RAG_BACKEND_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/chat`;

async function fetchWithRetry(url, options, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, options);

      // Retry on 5xx server errors
      if (!response.ok && response.status >= 500 && attempt < maxAttempts) {
        console.warn(`⚠️ [Genesis Recovery] Backend returned ${response.status}. Retrying... (Attempt ${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt - 1)));
        continue;
      }

      return response;
    } catch (err) {
      if (attempt === maxAttempts) {
        console.error(`🚨 [Genesis Exhausted] Failed to connect to backend after ${maxAttempts} attempts.`);
        throw err;
      }
      console.warn(`⚠️ [Genesis Recovery] Network error: ${err.message}. Retrying... (Attempt ${attempt}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt - 1)));
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
