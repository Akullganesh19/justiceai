## 2026-10-28 - Jurisdiction Input Type Error
**Attacked:** POST `/api/chat` jurisdiction parameter
**Found:** Passing an integer as `jurisdiction` crashes the server when it attempts to call `.toLowerCase()` on it while checking chunk sources.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added `String(jurisdiction)` before calling `.toLowerCase()`.
**Systemic pattern:** Anywhere a field from an HTTP request body is assumed to be a string without explicit type checking or coercion.
