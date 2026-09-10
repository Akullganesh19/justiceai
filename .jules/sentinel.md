## 2025-02-12 — XSS Filter Bypass and Hardcoded Network Timeouts

**Attacked:** `server.js` XSS middleware and `/api/chat` Ollama fetch requests
**Found:**
1. The custom `xssMiddleware` in `server.js` incorrectly replaced `<` and `>` with themselves instead of their HTML entities (`&lt;` and `&gt;`). This would allow XSS payloads to pass through the backend unescaped.
2. The `fetch` calls to Ollama in `/api/chat` had hardcoded `AbortSignal.timeout(10000)` and `AbortSignal.timeout(15000)`, which will prematurely terminate valid long-running generation requests for LLMs.

**Severity:** 🔴 Exploitable now (XSS), 🟡 Latent (Timeouts for long LLM generations)

**Fixed or flagged:**
1. Fixed: `xssMiddleware` was updated to properly use `&lt;`, `&gt;`, `&quot;`, and `&amp;`.
2. Fixed: Replaced hardcoded timeouts with `parseInt(process.env.OLLAMA_TIMEOUT) || 300000` (5 minutes default).

**Systemic pattern:** Custom security middleware and network timeouts should be verified to work correctly.
