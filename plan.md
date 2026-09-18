I will create a `fetchWithRetry` utility in `server.js` and apply it to the external API calls (Gemini, DeepSeek, Bhashini, Ollama).

Plan:
1. Define a `fetchWithRetry` function in `server.js` implementing exponential backoff.
2. Replace `fetch` calls in `server.js` with `fetchWithRetry` where external network calls are made:
    - Gemini API call in `callGemini`
    - DeepSeek API call in `callDeepSeek`
    - Bhashini config call
    - Bhashini compute call
    - Ollama chat streaming endpoint (handle `AbortSignal` recreation for retries as instructed in memory)
    - Ollama chat standard endpoint
3. Test the endpoints to verify `fetchWithRetry` works.
4. Run linters and tests.
5. Create journal entry.
6. Commit changes.
