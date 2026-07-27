## 2026-07-27 — [Winston Redaction Layer Added]
**Data traced:** User queries/messages (potential PII), API keys, emails, IP addresses.
**Exposure found:** Plaintext JSON formatting in `winston.format.json()` and multiple `console.log` statements logging sensitive API payload bodies, errors, and queries.
**Fix:** Implemented a deep object redaction filter `redactFormat` within the Winston logger pipeline that strips specific keys (`email`, `password`, `ssn`, `apiKeys`, `ip`, etc.) and PII string patterns (Emails, SSNs) before logging. Migrated `console.log` statements in sensitive routes to use this `logger`.
**Coverage confirmed:** Tested deep redaction across strings, nested objects, and custom Error properties using independent JS test cases mimicking `winston` logs, ensuring properties and nested keys matching the regexes are reliably scrubbed.
**Still exposed elsewhere:** Client-side error boundaries and console errors still log without redaction (e.g. `src/components/ui/ErrorBoundary.jsx`).
