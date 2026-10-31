## 2026-10-31 — Type coercion crash in `/api/chat` due to custom XSS middleware preserving non-strings
**Attacked:** `/api/chat` endpoint (`jurisdiction` field)
**Found:** The custom `xssMiddleware` only sanitizes strings and recursively copies objects, but it leaves numbers and other primitive types intact. Downstream in `/api/chat`, `jurisdiction` is used in a string manipulation `jurisdiction.toLowerCase()` without casting it to a String first. Sending `{"jurisdiction": 123}` bypasses the XSS filter's string assumption and crashes the endpoint with a `TypeError`.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added `String(jurisdiction)` wrapping before calling `.toLowerCase()` to ensure type safety.
**Systemic pattern:** This is a systemic issue where custom XSS middleware trusts non-string inputs from JSON payloads, but backend logic assumes strings. Look for other uses of `.toLowerCase()`, `.split()`, or `.includes()` directly on `req.body` fields.
