## 🛡️ Adversarial Verification Report

**Scope attacked:** Express endpoints (`server.js`), focusing on Input Adversarial and Failure Injection across recently added/modified API routes (particularly `/api/documents/:source`, `/api/chat`, and `/api/embed`).

**🔴 Exploitable findings:**

1. **Uncaught Malformed URI Component (`DELETE /api/documents/:source`)**
   - **Reproduction:** `curl -X DELETE "http://localhost:3001/api/documents/%"`
   - **Impact:** The `decodeURIComponent` inside Express's router for the param `source` throws an unhandled `URIError`. This isn't caught gracefully before it crashes the active request stack. While Express intercepts it via the default handler, it should be cleanly intercepted.

2. **Null/Missing Message Array Validation (`POST /api/chat`)**
   - **Reproduction:** `curl -X POST -H "Content-Type: application/json" -d '{"messages":[null]}' "http://localhost:3001/api/chat"` (or `{"messages":[{"role": "user"}]}`)
   - **Impact:** The endpoint fetches `const latestUserMessage = messages[messages.length - 1].content;` and then invokes `.substring(0, 50)` on it. If a message is `null` or missing the `content` property, this throws a `TypeError: Cannot read properties of null (reading 'content')` or `TypeError: Cannot read properties of undefined (reading 'substring')`, bypassing business validation and resulting in an internal 500 error instead of a 400 Bad Request.

3. **Type Confusion in Text Field (`POST /api/embed`)**
   - **Reproduction:** `curl -X POST -H "Content-Type: application/json" -d '{"text": {"foo": "bar"}}' "http://localhost:3001/api/embed"`
   - **Impact:** The `/api/embed` endpoint checks `if (!text)` but doesn't verify type. It passes the object directly to `embeddings.embedQuery()`, which expects a string. This bubbles down and results in an unhandled rejection / 500 internal error.

**🟡 Latent findings:**
- Provider fallback exhaustion (`/api/chat`): When all fallback models fail (e.g. Ollama unreachable, Gemini suspended, DeepSeek empty balance), the request ends in a 500 Error indicating "Multi-tier failover exhausted". This is technically correct but could be handled cleaner as a 503 Service Unavailable instead of a 500.

**🟢 Theoretical findings:**
- None mapped out directly; focused on observable breaks.

**Fixed this session:**
- `URIError` crash in routing: Added an error middleware specifically for `URIError` to cleanly return a `400 Bad Request`.
  - Regression test: `test_api.js` (URI test asserting 400 on `/%`)
- Array malformation in `/api/chat`: Strengthened the `messages` validation to verify objects are truthy and contain string `role` and `content`.
  - Regression test: `test_api.js` (Chat test asserting 400 on `[null]`)
- Type confusion in `/api/embed`: Added a `typeof text !== 'string'` check to ensure we only send string parameters to the embeddings model, returning `400 Bad Request` otherwise.
  - Regression test: `test_api.js` (Embed test asserting 400 on object text)

**Requires human review:**
- None strictly required as the fixes are small, isolated type/validation additions, but the fallback exhaustion strategy (returning 500 on all AI provider failure) should be reviewed by product owners to decide if a 503 or generic "AI currently unavailable" message is better.
