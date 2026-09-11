## 2024-05-24 — [Auto-retry for External APIs]
**Failure point found:** External AI API calls (Gemini, DeepSeek) and Voice API calls (Bhashini) in `server.js` used native `fetch` with no retry or fallback logic for network/transient HTTP errors.
**Why it existed:** Native `fetch` doesn't handle retries natively. The initial implementation prioritized happy paths for external APIs without anticipating transient networking glitches or temporary rate limits.
**Recovery built:** A `fetchWithRetry` wrapper using exponential backoff (100ms, 200ms, 400ms base wait) applied to Gemini, DeepSeek, and Bhashini external API integrations. Retries happen upon networking errors and 5xx/429 HTTP statuses.
**Blast radius before:** Any intermittent connection drop, transient provider 500 error, or brief rate-limit caused immediate failure of user prompts or voice tasks. In worst cases, this cascaded back up to the frontend UI as a hard error.
**Watch for:** Other integrations in the frontend UI or potential unhandled `AbortError` scenarios in components making long-running HTTP calls.
