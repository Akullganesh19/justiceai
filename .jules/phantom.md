## 2025-06-25 — Invisible Request Coalescing & Retries
**Gap found:** Bhashini Config API was fetched naively on every STT/TTS request, blocking inference. Third-party APIs (Gemini, DeepSeek, Ollama) failed loudly on transient errors or rate limits.
**Why it existed:** Quick implementation optimized for getting features working over robust error handling.
**Built:**
1. `fetchWithRetry` wrapper for robust network calls to all external APIs (with AbortSignal handling).
2. TTL Cache and Request Coalescing logic for the `getBhashiniConfig` call, preventing Thundering Herds and duplicated config requests.
**Hot path affected:** Every user voice interaction and every LLM API chat completion.
**Measurable improvement:** Saved ~100-300ms latency on all Bhashini API interactions by skipping redundant config calls. Handled transient 500s/429s without surfacing errors to the user.
**Next opportunity:** Implement stale-while-revalidate for background refreshing of reference data.
