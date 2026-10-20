## 2024-05-18 — Server-side XSS Protection Migration
**Risk identified:** The backend uses a custom regex-based XSS sanitizer middleware (`xssMiddleware`) which is risky, error-prone, and doesn't handle complex vectors, making it an architectural liability for server-side security as the app scales.
**Migration target:** Replace custom regex sanitization with `xss`, an established library for robust XSS sanitization in Node.js environments.
**Migrated this session:** Replaced the custom regex in `server.js`'s `xssMiddleware` with `myxss.process()` from the `xss` library, configuring it to strip all HTML tags to replicate the safe-text intent of the previous behavior while properly preventing complex XSS payloads.
**Remaining:** Review other components for any rogue/custom regex HTML escaping.
**Next session:** Analyze frontend markdown rendering and input handling to ensure consistent `xss` usage across the stack.
