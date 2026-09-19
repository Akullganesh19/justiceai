## 2024-05-24 — [XSS Sanitization Middleware Bypass]
**Attacked:** `xssMiddleware` in `server.js` (Express global middleware)
**Found:** The `escapeHtml` function incorrectly replaced dangerous HTML characters with the exact same characters (e.g. `replace(/</g, '<')`), making the XSS protection completely ineffective and allowing unsanitized raw inputs (HTML, JS) to bypass security checks.
**Severity:** 🔴
**Fixed or flagged:** Fixed. I updated the middleware to correctly map characters to their corresponding HTML entities (e.g., `<` to `&lt;`). I also added a regression test script to ensure proper sanitization.
**Systemic pattern:** This type of bug (broken copy-paste or misimplementation of custom sanitization) is a classic issue. We should consider replacing custom sanitization with established libraries like `xss` or `dompurify` in future updates to prevent manual errors.
