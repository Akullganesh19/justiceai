## 2026-07-10 — Null Payload DoS in /api/chat
**Attacked:** The `/api/chat` endpoint in `server.js`.
**Found:** Sending `"apiKeys": null` bypasses default destructuring, leading to a `TypeError` when accessing `apiKeys.gemini`, crashing the Express server.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added a fallback check (`const apiKeys = incomingApiKeys || {};`) to guarantee an object.
**Systemic pattern:** Default parameters in object destructuring (`{ prop = {} } = req.body`) do not protect against explicit `null` values in JSON payloads. Future code should explicitly check for `null` or use safe access patterns.
