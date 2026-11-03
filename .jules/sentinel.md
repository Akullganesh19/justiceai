## 2023-10-31 — Recursive stack overflow in xssMiddleware
**Attacked:** Custom XSS protection middleware (`sanitize` function in `server.js`).
**Found:** An attacker can send a deeply nested JSON payload (e.g., `{"a": {"a": ...}}`), causing a `Maximum call stack size exceeded` error because the recursive `sanitize` function lacked a depth limit. This crashes the server (Denial of Service).
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added a `depth` parameter to `sanitize` that returns `null` if the recursion depth exceeds 50. Also added explicit checks for `Date` and `Error` objects so their prototypes aren't stripped.
**Systemic pattern:** Recursive functions processing user input without a depth limit or explicit type handling. Look for other custom object serializers or validators (e.g., in request loggers or JSON parsers).
