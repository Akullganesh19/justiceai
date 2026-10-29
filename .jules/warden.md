## 2026-10-28 — Logger PII Redaction
**Data traced:** PII (Email, Phone, Aadhaar, PAN, Card Number)
**Exposure found:** `console.*` and `winston` logging functions within `server.js` globally via unredacted request payloads and debug output.
**Fix:** Created `src/lib/logger.js` containing `redactObject`, `redactFormat`, and `setupRedactedLogger`. These utilities apply a global regex-based mask on sensitive PII in unstructured text and nested objects. Integrated `setupRedactedLogger` to override `console.*` and `redactFormat` to patch the winston logger pipeline in `server.js`.
**Coverage confirmed:** The fix redacts PII strings within `console.log` strings and nested objects globally by overriding `console.*` methods. It also ensures structured winston logging redacts payload fields appropriately. Verified via standalone tests simulating string and object log payloads.
**Still exposed elsewhere:** This does not cover PII stored inside PDFs, Markdown files, or external chat models; it only shields logs. Client-side state and browser local storage also retain sensitive data unredacted.
