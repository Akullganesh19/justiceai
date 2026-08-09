## 2024-08-09 — Auto-Retry for External API Connections
**Failure point found:** Fragile, un-retried network fetch calls connecting to critical LLM backends (Ollama, DeepSeek, Bhashini, local node RAG server).
**Why it existed:** Assumed happy-path network connections; developers neglected transient network failure risks like timeouts and connection resets.
**Recovery built:** Created `src/lib/genesis/fetchInterceptor.js` which globally intercepts `fetch` calls and provides exponential backoff for idempotent network calls across both frontend and backend.
**Blast radius before:** Random frontend connection drops resulted in broken AI conversational flow; Backend connection drops caused failing 500 errors directly to users.
**Watch for:** Other non-idempotent endpoints that might need idempotency keys before retry logic can be safely applied.
