## 2025-02-18 — [Global custom XSS Middleware]
**Complexity found:** A global blanket regex-based custom XSS protection middleware recursively scanning incoming JSON/URL payloads.
**Why it existed:** Likely a well-intentioned but misguided attempt to sanitize all user inputs globally against XSS at the API layer.
**Eliminated:** The entire `xssMiddleware` function and its integration `app.use(xssMiddleware)` from `server.js`.
**Net change:** -40 lines, 1 abstraction layer eliminated.
**Next target:** Identify remaining unnecessary Express custom middlewares or abstractions wrapping built-in functionality.
