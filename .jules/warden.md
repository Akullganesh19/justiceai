## 2026-07-06 — [Redact PII from Logs]
**Data traced:** PII (Email, SSN, Credit Card numbers)
**Exposure found:** `console.log` and `console.error` calls throughout the backend (Express server). PII could potentially be leaked into `logs/error.log`, `logs/combined.log`, and stdout, especially in stack traces or raw body logging (e.g. `req.body` keys).
**Fix:** Implemented a deep-redaction `winston` formatter and overridden global `console.log`, `console.warn`, and `console.error` methods to route all logging through the `logger` with redaction applied.
**Coverage confirmed:** Tested string, object, array, Error object, and Buffer handling to ensure PII is masked as `[REDACTED]` and circular references are handled safely.
**Still exposed elsewhere:** Third-party APIs (Gemini, DeepSeek, Ollama) might receive sensitive information in prompts if not explicitly sanitized before sending, though this requires product-level redaction rules that depend on the specific context of the legal document.
