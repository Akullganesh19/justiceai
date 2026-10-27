## 2024-05-24 — PII in Application Logs
**Data traced:** PII (emails, Indian phone numbers, Aadhaar, PAN, card numbers) in application inputs (chat prompts, document text, query parameters)
**Exposure found:** Express logs the `req.body`, `req.query`, and other details which can contain PII. For instance, the chat route logs `req.body` keys, but application logs or error stack traces may leak PII values into `logs/combined.log` and `logs/error.log` using standard `console.log`, `console.error`, and `logger.log` from Winston.
**Fix:** Introduced a global object redactor `setupRedactedLogger` to override console methods and a custom `winston.format` to mask PII globally before it reaches standard output or log files.
**Coverage confirmed:** The `redactObject` logic is tested against the console overriding and Winston. It will automatically mask emails, phones, Aadhaar, PAN, and card numbers.
**Still exposed elsewhere:** There may be PII lingering in the existing logs or the user's `localStorage` containing the chat history and document memory locally, as well as any exports that don't have fine-grained filtering.
