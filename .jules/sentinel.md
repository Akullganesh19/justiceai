## 2026-07-11 — [API key parsing vulnerability fixed]
**Attacked:** POST /api/chat body parser
**Found:** Passing `apiKeys: null` bypasses the `{}` default assignment, crashing the server when `apiKeys.gemini` is read.
**Severity:** 🔴
**Fixed or flagged:** Fixed by explicitly reassigning `null` to `{}`.
**Systemic pattern:** Default parameter assignment `const { x = {} } = obj` does not protect against explicit `null` in JSON bodies.
