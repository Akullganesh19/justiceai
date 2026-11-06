## 2026-04-14 — XSS Filter Replaces Characters with Themselves
**Attacked:** `xssMiddleware` in `server.js` (Lines 116-125)
**Found:** The `escapeHtml` function tries to sanitize HTML by replacing dangerous characters, but instead replaces them with themselves (e.g., `.replace(/</g, '<')`). This completely bypasses XSS protection for the entire Express app. Also missing circular reference checks leading to potential DoS via stack overflow.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Changed replacement strings to valid HTML entities (`&lt;`, `&gt;`, `&quot;`, `&amp;`) and added circular reference / max depth check.
**Systemic pattern:** Hand-rolled security functions are prone to subtle typos. Ensure proper entity encoding is used. Memory rule mentions `xss` library, but replacing characters is a small fix. Also memory says `jurisdiction` must be cast to String before calling `toLowerCase` because `xssMiddleware` preserves non-string types.
