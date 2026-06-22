## 2024-05-24 — Resilient Fetch & Bhashini Request Coalescing
**Gap found:** Bhashini voice configurations were fetched synchronously over the network on *every single* translation/ASR request. Third-party cloud LLM API calls (Gemini/DeepSeek) had zero retry logic for transient errors or rate limits.
**Why it existed:** Quick implementation of third-party API integration without a resilient infrastructure layer.
**Built:**
1. `fetchWithRetry`: An invisible network interceptor adding exponential backoff (retries: 3) for all critical external API calls.
2. `getBhashiniConfig`: An intelligent caching layer (1-hour TTL) with Promise-based request coalescing to eliminate duplicate in-flight network requests.
**Hot path affected:** Voice Processing (`/api/voice/process`) and Cloud LLM fallbacks (`callGemini`, `callDeepSeek`).
**Measurable improvement:** Bhashini pipeline config fetches reduced from $N$ (where $N$ = voice requests) to 1 per hour. Zero-latency config resolution on cached/coalesced hits. Reduced failure rate on Gemini/DeepSeek API rate limits.
**Next opportunity:** Investigate Edge Caching or Request Coalescing for local Ollama RAG queries if duplicate questions are frequently asked simultaneously.
