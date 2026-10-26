## 2024-10-26 — Server-Side HTML Sanitization Migration

**Risk identified:** The Node.js backend (`server.js`) currently relies on a custom, handwritten regex-based XSS filter middleware (`xssMiddleware`) which is notoriously brittle, incomplete, and highly susceptible to advanced bypass payloads over time.

**Migration target:** Migrate to the industry-standard `xss` package (using `new xss.FilterXSS()`), as mandated by the project guidelines, which provides a robust, actively maintained, spec-compliant HTML sanitization engine without the severe JSDOM performance overhead on large requests.

**Migrated this session:** Replaced the custom regex-based `escapeHtml` implementation in `server.js` with `xss` to sanitize incoming request bodies and queries.

**Remaining:** Investigate if there are other areas (e.g., custom response serialization, specific endpoint logic) that might bypass this middleware and need targeted sanitization. Verify that no legitimate HTML formatting required by the frontend is inadvertently stripped by the default `xss` configuration.

**Next session:** Analyze the frontend rendering of backend responses to ensure the new `xss` sanitization does not break expected formatting, and explore adding targeted sanitization for specific fields if global middleware proves too aggressive.
