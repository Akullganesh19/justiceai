## 2026-10-17 — Migrate Custom Regex XSS to DOMPurify
**Risk identified:** The server uses a custom regex-based `escapeHtml` function in the `xssMiddleware` within `server.js` (an attempt to remove the legacy `xss-clean` middleware which is deprecated). Custom regexes for XSS sanitization are highly prone to edge cases and future bypasses as HTML/browser quirks evolve, creating a compounding security risk.
**Migration target:** The ecosystem standard for HTML sanitization is `DOMPurify` (specifically `isomorphic-dompurify` for Node.js environments), which securely parses HTML rather than relying on regex string replacements.
**Migrated this session:** Replaced the custom regex `escapeHtml` logic with `DOMPurify.sanitize()` in the `xssMiddleware` within `server.js`. Installed `isomorphic-dompurify`. Uninstalled the deprecated `xss-clean` middleware and removed it from `package.json`.
**Remaining:** Verify if any other legacy documentation (like `PRODUCTION_ENHANCEMENTS.md`) references `xss-clean`.
**Next session:** Investigate other potential legacy patterns, such as the use of deprecated or old tooling/libraries.
