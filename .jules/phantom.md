## 2024-06-26 — Intelligent Bhashini Config Cache & Request Coalescing Added
**Gap found:** The Bhashini voice processing endpoint (\`/api/voice/process\`) was making a redundant HTTP request to fetch pipeline configuration (\`/config\`) *before* every single STT/TTS operation (\`/compute\`). Multiple simultaneous interactions would also fire off duplicate config requests.
**Why it existed:** It was a naive, strictly sequential implementation of the Bhashini API integration, which requires a config to execute inference. The config changes very rarely.
**Built:** An intelligent in-memory cache with TTL (12 hours) and request coalescing (using \`Map\`) for the \`getBhashiniConfig\` function. A \`fetchWithRetry\` wrapper was also added for resilience on cloud API calls.
**Hot path affected:** Every voice interaction (both STT and TTS).
**Measurable improvement:** Reduced latency of voice interactions by eliminating one external HTTP round-trip per request, saving hundreds of milliseconds. Mitigated duplicate network hits when multiple voice components mount/activate simultaneously.
**Next opportunity:** Investigate optimistic UI updates for document analysis or cache static reference data on the frontend using Service Workers.
