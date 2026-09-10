## 🛡️ Adversarial Verification Report

**Scope attacked:** `server.js` (Backend API Security & Integrity)

**🔴 Exploitable findings:**
1. **XSS Filter bypass in xssMiddleware**: The custom `xssMiddleware` in `server.js` meant to replace HTML characters simply replaced `<` with `<` and `>` with `>`.
   **Reproduction**: Send `{"messages": [{"content": "<script>alert(1)</script>"}]}` to `/api/chat`. The payload passes through the backend unchanged.
   **Impact**: Inputs flow into the backend and possibly the DB unescaped, leading to XSS when rendered in the UI.

**🟡 Latent findings:**
1. **Premature LLM aborts**: The backend imposed hardcoded 10s and 15s timeouts on `fetch` calls to the local Ollama LLM.
   **Reproduction**: Send a query that requires significant processing time or large outputs (e.g., summarizing a 10-page document).
   **Impact**: The request is aborted before the LLM can finish generating the response, causing a fallback error or dropped connection.

**🟢 Theoretical findings:** None

**Fixed this session:**
1. Replaced the faulty `xssMiddleware` in `server.js` with correct HTML entity replacements (`&lt;`, `&gt;`, `&quot;`, `&amp;`). Regression test script `test-xss.cjs` confirms the payload is properly escaped.
2. Replaced hardcoded timeouts in `server.js` with `parseInt(process.env.OLLAMA_TIMEOUT) || 300000`.

**Requires human review:**
1. The AI model output could still contain unescaped HTML. The frontend client must be explicitly verified to sanitize or safely render markdown/HTML.
