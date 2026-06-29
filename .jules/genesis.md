## 2024-06-29 — Unprotected Fetch Calls causing brittle failure modes
**Failure point found:** All third party fetch calls to APIs (Ollama, Gemini, DeepSeek, Bhashini) were unprotected in `server.js`.
**Why it existed:** Native fetch wrapper code did not have retry mechanisms and didn't gracefully handle transient network errors, rate limit (429) errors or server errors.
**Recovery built:** Created `fetchWithRetry` wrapper to explicitly retry 3 times with exponential backoff on transient errors while handling user aborts correctly. Wrapped 6 calls with the mechanism.
**Blast radius before:** Any intermittent network error, temporary server overload, or simple rate limit effectively ruined user experiences, breaking conversational flow for thousands of potential requests.
**Watch for:** Other `fetch` calls in other backend files or components that are not utilizing a retry mechanism, and evaluate if idempotency guard layers are also necessary.
