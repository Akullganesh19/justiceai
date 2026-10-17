## 2024-05-25 — Active PII Exposure in Logs

**Data traced:** Email, Aadhaar, PAN Card, Phone Numbers, Credit Cards
**Exposure found:** Plaintext in application logs, error logs, request logs, and debug output (e.g. `console.log`, `winston` logs in `server.js`)
**Fix:** Introduced structural redaction using `setupRedactedLogger` to override global `console` and `winstonRedactFormat` for Winston to mask PII via Regex before they are logged.
**Coverage confirmed:** Masking logic covers all standard log functions (`console.log`, `error`, etc) and the Winston transport pipeline, handling nested objects correctly via recursion and circular reference checking.
**Still exposed elsewhere:** PII might still exist in previously generated log files (`logs/combined.log`, `logs/error.log`).
