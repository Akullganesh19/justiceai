## YYYY-MM-DD — [Title]
**Failure point found:** [What was unprotected]
**Why it existed:** [Historical reason]
**Recovery built:** [What mechanism was added]
**Blast radius before:** [How bad failures were]
**Watch for:** [Similar fragility elsewhere]
## 2024-07-09 — Auto-Retry for AI API Endpoints
**Failure point found:** Unprotected `fetch` calls to backend RAG, Gemini, DeepSeek, and Bhashini AI endpoints.
**Why it existed:** Default browser and node `fetch` behavior doesn't retry on network failures or 5xx server errors, resulting in immediate application flow breaks on transient failures.
**Recovery built:** Implemented `fetchWithRetry` utility using exponential backoff (e.g. 100ms -> 200ms -> 400ms) for external and internal backend API fetch requests. This wraps backend model endpoints and internal `/api/chat` communication.
**Blast radius before:** Any temporary API hiccup or network drop during the chat flow immediately surfaced a raw error to the user and halted the session.
**Watch for:** Other `fetch` calls such as API integrations that lack retry policies (e.g., in other frontend components like `FloatingVoiceButton` for `/api/voice/config` that we didn't touch yet).
