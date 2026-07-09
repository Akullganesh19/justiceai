## 2024-07-09 — Remove incoming API mutation XSS middleware
**Risk identified:** The codebase relies on a custom `xssMiddleware` in `server.js` (lines 116-136) that performs blanket regex string replacement on incoming JSON payloads. Mutating incoming request data across the board for XSS prevention is an outdated anti-pattern. It corrupts legitimate inputs (e.g. replacing `&` with `&` recursively or mangling code snippets containing `<`), bypasses schema validation, and creates a false sense of security.
**Migration target:** The modern ecosystem relies on context-aware output encoding (which React handles natively in the frontend) and strict input validation via schemas (e.g., Zod, Joi) rather than blanket string mutations.
**Migrated this session:**
- Removed the custom `xssMiddleware` function and its application (`app.use`) from `server.js`.
**Remaining:** Migrate other incoming input validation to a schema-based library (like Zod) to ensure payload integrity before processing, and ensure that any raw HTML rendering (e.g., Markdown components) uses a robust output sanitizer like DOMPurify.
**Next session:** Introduce a schema validation layer for core API endpoints instead of manual checks.
