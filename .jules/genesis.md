## 2024-05-27 — [Title]
**Failure point found:** [What was unprotected]
**Why it existed:** [Historical reason]
**Recovery built:** [What mechanism was added]
**Blast radius before:** [How bad failures were]
**Watch for:** [Similar fragility elsewhere]
## 2026-07-08 — Add fetchWithRetry to AI service calls
**Failure point found:** Unprotected fetch calls to Gemini, DeepSeek, Bhashini, and Ollama
**Why it existed:** Native fetch was used directly without robust retry mechanisms.
**Recovery built:** fetchWithRetry with 3 max attempts, exponential backoff, and strict timeout cleanup.
**Blast radius before:** Any 5xx error or transient network issue would immediately crash the user request.
**Watch for:** Other external service integrations missing similar wrappers.
