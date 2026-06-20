## 2024-11-20 — Resilient Network Fetch with Exponential Backoff
**Gap found:** Third-party API calls (Gemini, DeepSeek, Bhashini) used native `fetch` with no retry logic, failing immediately on transient network errors or rate limits (429/5xx).
**Why it existed:** Initial implementation optimized for simplicity over resilience.
**Built:** A `fetchWithRetry` wrapper implementing exponential backoff with jitter, specifically targeting transient errors (429, 500, 502, 503, 504) and network failures.
**Hot path affected:** LLM fallback chains (Gemini, DeepSeek) and voice processing pipelines (Bhashini).
**Measurable improvement:** Reduced failure rate for API calls under load or poor network conditions; improved overall app reliability without any UI changes.
**Next opportunity:** Implement stale-while-revalidate caching for frequently accessed, slowly changing reference data.
