## 2026-09-18 — Unhandled malformed array items in `/api/chat`
**Attacked:** POST `/api/chat` payload validation
**Found:** Passing an array with null, undefined, strings, or objects missing the `content` property for `messages` bypasses the initial `!messages || !Array.isArray(messages)` check, resulting in `TypeError: Cannot read properties...` (e.g., reading `content` of undefined/null or calling `substring` on undefined) during subsequent processing. This bubbles up as a 500 Internal Server Error.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added strict validation to ensure every item in the `messages` array is a valid object and that the last message has a valid `content` string before attempting to access its properties.
**Systemic pattern:** Lack of deep validation for nested object arrays from user input. Always validate the structure of items inside the array, not just that the array exists.

## 2026-09-18 — Missing JSON parsing error middleware
**Attacked:** Global Express middlewares
**Found:** Sending malformed JSON triggers a `body-parser` `SyntaxError` which falls through to the generic 500 error handler instead of returning a 400 Bad Request.
**Severity:** 🟡
**Fixed or flagged:** Flagged. Express should have a middleware specifically to catch `SyntaxError` from `express.json()` and return a 400 status.
**Systemic pattern:** Trusting standard body parsers without handling their specific error types.
