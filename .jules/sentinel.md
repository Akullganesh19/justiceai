## 2026-11-09 — Ineffective XSS Sanitization and ReDoS Vulnerability in `server.js`
**Attacked:** Express backend `xssMiddleware` (`server.js`)
**Found:** Custom `escapeHtml` was fundamentally broken (replaced characters with themselves like `<` with `<`). Furthermore, traversing deeply nested objects crashed the process (RangeError: Maximum call stack size exceeded), causing a Denial of Service. Also stripped prototypes of `Date` and `Error` objects.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Replaced with `xss` library, added a max `depth` of 100 to prevent ReDoS, and explicitly preserved `Date` and `Error` objects. `FilterXSS` instantiated outside middleware to avoid performance penalty.
**Systemic pattern:** Look for other custom regex implementations across backend filtering or frontend data parsing. Hand-rolled security logic is often flawed and untested against edge cases.
