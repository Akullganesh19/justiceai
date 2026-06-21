## 2024-05-24 — Robust Fetch Wrapper with Exponential Backoff
**Gap found:** Third-party API calls (Gemini, DeepSeek, Bhashini) were using naive `fetch` directly, causing requests to immediately fail on transient network issues or rate limits (HTTP 429/5xx).
**Why it existed:** Quick initial implementation without accounting for cloud provider flakiness or rate limits in production.
**Built:** A `fetchWithRetry` wrapper that automatically retries failing requests (up to 3 times) with exponential backoff (starting at 500ms).
**Hot path affected:** LLM fallback logic and voice transcription/synthesis proxy endpoints.
**Measurable improvement:** Reduced occurrence of 5xx and 429 errors bubbled up to the user; higher overall success rate for complex LLM routing.
**Next opportunity:** Implement request coalescing/deduplication for duplicate simultaneous API calls.