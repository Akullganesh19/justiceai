## 2025-05-18 — xssMiddleware Eliminated
**Complexity found:** Custom `xssMiddleware` applying blanket regex-based string replacements across all incoming Express JSON payloads and queries in `server.js`.
**Why it existed:** Likely an over-engineered attempt to protect against Cross-Site Scripting (XSS) at the API layer.
**Eliminated:** The entire 36-line `xssMiddleware` block, its recursive `sanitize` function, and its application via `app.use(xssMiddleware)`.
**Net change:** -39 lines. 1 abstraction removed.
**Next target:** Explore removing redundant or overlapping state synchronization logic across `CaseTrackerPage.jsx` and other heavy frontend components.
