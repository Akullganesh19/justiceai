## 2026-07-11 — PII Redaction in Backend Logs
**Data traced:** email, password, apiKeys, phone, ssn, dob, address
**Exposure found:** Express app.post logging and `server.js` raw `console.log` and `console.error` logs would dump PII, passwords and API keys unredacted if printed inside objects.
**Fix:** Created structural Winston log redaction and overrode `console.*` methods.
**Coverage confirmed:** Tested that `logger.info`, `logger.error` and `console.log`/`console.error` effectively mask configured sensitive keys in JS objects.
**Still exposed elsewhere:** There might be other exposures such as client-side logging or unredacted database entries, but structural logging ensures no future code leak into `server.js` output files.
