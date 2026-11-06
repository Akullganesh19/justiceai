## 2024-05-24 — Replace custom regex XSS filter with standard xss library
**Risk identified:** The Express backend relied on a custom regex-based `escapeHtml` function in `server.js` (`xssMiddleware`) to sanitize incoming requests against Cross-Site Scripting (XSS). Custom regex filters for HTML sanitization are notoriously brittle and prone to bypasses, making them a high security risk as new attack vectors emerge.
**Migration target:** The ecosystem standard for server-side HTML sanitization in Node.js is the robust `xss` library, which properly parses and filters HTML instead of relying on simple string replacements.
**Migrated this session:**
- Installed the `xss` dependency.
- Refactored `xssMiddleware` in `server.js` to instantiate `new xss.FilterXSS()` and use it for sanitizing `req.body` and `req.query`.
- Handled recursion depth (max 10) and built-in objects (`Date`, `Error`) in the `sanitize` function to prevent prototype stripping and stack overflows.
**Remaining:**
- The current implementation handles XSS at the middleware level for `req.body` and `req.query`. We need to verify if there are other input vectors (e.g., specific headers, file uploads) that require similar sanitization.
**Next session:**
- Audit other potential input vectors for missing XSS sanitization and apply the `xss` library where appropriate.
