## 2026-11-02 — Migrate to xss package

**Risk identified:** The backend Express API used a custom regex-based XSS filter for the middleware `xssMiddleware`. It only covered basic tag and quote escaping, but lacked comprehensive handling for complex payload structures and HTML entities. Furthermore, `xss-clean` is deprecated in modern ecosystems.
**Migration target:** The official `xss` library, which is well-maintained and robustly prevents Cross-Site Scripting (XSS).
**Migrated this session:** Installed the `xss` package, removed the custom regex sanitization logic in `server.js`, and fully migrated `xssMiddleware` to use `new xss.FilterXSS()`. Also implemented recursive safeguards with depth tracking to prevent DoS attacks.
**Remaining:** Migrate and verify that all other edge cases where custom parsing happens or output is generated relies on proper serialization.
**Next session:** Analyze the frontend response parsing for potential local XSS holes.
