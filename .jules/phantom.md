## 2024-06-19 — Request Coalescing

**Gap found:** The frontend `claudeApi.js` `sendMessage` function lacked request coalescing, allowing duplicate identical requests to hit the backend during rapid UI updates or unintended double renders.
**Why it existed:** The original implementation naively fired a network request for every call without checking if an identical request was already in flight, likely prioritizing simplicity over robust state management.
**Built:** An `inFlightRequests` Map in `claudeApi.js` that tracks active fetch promises using a stringified request payload as the key. Duplicate requests wait on the existing promise and return the same result. The cache is cleared in the `finally` block to prevent unbounded memory growth and allow subsequent intentional identical requests.
**Hot path affected:** LLM backend API calls from `ChatPage.jsx` and `AIChatPage.jsx`. Users feel this as a smoother experience without unexpected delays or duplicate messages under jittery network or UI conditions.
**Measurable improvement:** Reduces redundant backend processing, saving network bandwidth and expensive LLM compute time on the local Node.js RAG backend.
**Next opportunity:** Investigate response caching for static configuration endpoints like `/api/voice/config`.
