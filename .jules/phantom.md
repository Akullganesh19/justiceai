## 2024-10-25 — Request Coalescing

**Gap found:** The frontend components (IntelligenceSelectionTerminal, FloatingVoiceButton, AIChatPage, claudeApi) were using native `fetch` naively.
**Why it existed:** Native `fetch` does not automatically deduplicate simultaneous identical requests, and no API client abstraction was built.
**Built:** A `dedupedFetch` wrapper in `src/lib/api-client.js` that intercepts GET requests, stores the promise in a `Map`, and returns `res.clone()` to multiple callers, effectively coalescing identical concurrent requests.
**Hot path affected:** Voice configuration requests (`/api/voice/config`) and server health checks (`/api/health`).
**Measurable improvement:** Prevents duplicate identical API calls from hitting the backend server when multiple components mount or update simultaneously.
**Next opportunity:** Implement a true TTL caching layer for rarely-changing API responses (e.g., config endpoints).
