## 2024-06-20 — Initial Genesis Run
**Failure point found:**
1. Unprotected External Calls: Third-party API calls (Gemini, DeepSeek, Bhashini) used standard `fetch` with no retry mechanism for transient network or rate-limit failures.
2. Data/Resource Leak: The `/api/upload` endpoint had an unprotected `fs.unlinkSync(filePath)` inside a `try` block. If file parsing failed (e.g., unsupported type or corrupt PDF), the file would never be cleaned up.

**Why it existed:**
1. Optimistic assumption of 100% network/API reliability during rapid prototyping.
2. Incomplete error handling around Node.js filesystem operations combined with `multer` file streams.

**Recovery built:**
1. Added `fetchWithRetry` utility with exponential backoff (100ms -> 200ms -> 400ms) and integrated it into all outbound LLM/Voice API requests.
2. Wrapped the file parsing loop in `/api/upload` with a `finally` block to strictly enforce file cleanup via `fs.unlinkSync` regardless of parsing success or failure.

**Blast radius before:**
1. Any minor network blip or API rate limit would immediately break the request or trigger an unnecessary failover chain.
2. Continuous upload of corrupted or unsupported files would silently consume disk space, eventually causing a denial of service (DoS) when the server runs out of storage.

**Watch for:**
1. Other instances of standard `fetch` without retries, especially if new third-party integrations are added.
2. Any other endpoints handling temporary files or streams that lack proper `finally` cleanup logic.
