## 2024-05-18 — XSS Protection Logic Error
**Attacked:** Custom XSS protection middleware in `server.js`
**Found:** The `escapeHtml` function replaces `/&/g` with `&`, `/</g` with `<`, and `/>/g` with `>`, completely failing to sanitize HTML tags and entity characters, leaving the application vulnerable to XSS.
**Severity:** 🔴
**Fixed or flagged:** Fixed (To be implemented)
**Systemic pattern:** The developer attempted to write a custom sanitization function instead of using an established library like `xss` or `dompurify` (or at least using standard HTML entities like `&amp;`, `&lt;`, `&gt;`). Check other sanitization/validation middleware.
