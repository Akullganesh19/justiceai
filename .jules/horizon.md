## 2026-10-28 — XSS Protection Migration
**Risk identified:** The backend codebase was relying on a simplistic custom regex-based text replacement for XSS (Cross-Site Scripting) protection inside the `xssMiddleware` in `server.js`. This is a high-risk security anti-pattern because naive regex filtering is notoriously easy to bypass with modern and evolving XSS attack vectors.
**Migration target:** The ecosystem standard for server-side HTML sanitization in Node.js to prevent XSS is the `xss` package (which provides robust parsing and filtering of HTML to remove unsafe tags/attributes).
**Migrated this session:**
- Installed the standard `xss` package (`npm install xss`).
- Removed the deprecated/missing `xss-clean` library from dependencies.
- Replaced the vulnerable custom regex string replacement in `server.js`'s `escapeHtml` function with `new FilterXSS().process(str)`.
**Remaining:**
- The current implementation only sanitizes strings directly inside requests (body and query). The `sanitize` object traversal could potentially be improved or optimized, especially for deeply nested objects.
**Next session:**
- Review the `sanitize` recursive function inside `xssMiddleware` for performance bottlenecks or potential Maximum Call Stack Exceeded errors when processing exceptionally large or circular request objects. Consider tracking seen objects via `WeakSet`.