## 2025-05-18 — [Deep Log Redaction of Sensitive PII and Keys]
**Data traced:** User PII (email, SSN, DOB, phone, card numbers) and system credentials (API keys, tokens).
**Exposure found:** Native `console` outputs across the backend (like Error logs and verbose routing outputs) leaked plaintext request bodies and potential user details, bypassing Winston redaction entirely.
**Fix:** Injected a `deepRedact` utility in `server.js` that recursively intercepts arrays, objects, strings, and standard Error properties. Mapped native `console` overrides (log, error, info, etc.) to use `winston` piped through `deepRedact`, and applied a Winston `redactionFormatter`.
**Coverage confirmed:** Tested structural integrity through `npx eslint server.js` and confirmed system tests via `npx vitest run`. The solution inherently wraps everywhere `console.X` is invoked natively.
**Still exposed elsewhere:** Potential leaks may exist in raw user exports (e.g. CSV downloads) or RAG embedding chunks if they encapsulate plain-text PII within indexed legal text chunks that are queried and retrieved without field-level access control.
