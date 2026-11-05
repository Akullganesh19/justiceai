## 2026-11-05 — Recursive XSS Sanitizer Stack Overflow (DoS)
**Attacked:** `POST /api/chat` (and all routes) - body sanitization middleware
**Found:** An extremely deep nested array (or object) in the request body causes the custom `xssMiddleware` recursive `sanitize` function in `server.js` to crash the server with `RangeError: Maximum call stack size exceeded`.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Replaced naive recursive sanitization with depth-limited sanitization.
**Systemic pattern:** Recursive functions handling external JSON input must enforce max depth limits.

## 2026-11-05 — Type Confusion in String Properties
**Attacked:** `POST /api/chat` - `messages` content property
**Found:** Passing an object instead of a string in `messages.content` bypasses the `xssMiddleware` (which preserves objects) and reaches `messages[messages.length - 1].content` in `server.js`. When passed to `substring` inside Ollama query logging (`latestUserMessage.substring(...)`), it crashes the server with `TypeError: latestUserMessage.substring is not a function`.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added explicit `String()` casts for properties expecting strings in backend endpoints.
**Systemic pattern:** Trusting JSON types blindly in loosely typed Node.js paths.
