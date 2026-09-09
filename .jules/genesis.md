## 2024-05-18 — External API Resiliency
**Failure point found:** External API calls (Gemini, DeepSeek, Bhashini) were unprotected and failed immediately on transient network errors or rate limits.
**Why it existed:** The native `fetch` API was used directly without any retry logic or error handling wrappers for transient failures.
**Recovery built:** Implemented `fetchWithRetry`, an auto-retry wrapper with exponential backoff (100ms, 200ms, 400ms) that targets network-level errors (e.g., `ECONNRESET`) and server-side errors (429, 5xx) while ignoring client `AbortError`.
**Blast radius before:** Any temporary API downtime or network blip caused immediate failure of chat inference or voice transcriptions, affecting all users.
**Watch for:** Ensure we don't blindly retry long-running streaming API calls (like local Ollama streams) as they require different handling.
