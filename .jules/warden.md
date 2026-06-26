## 2024-05-20 — Data Governance Logging Fix
**Data traced:** PII (Email, Phone, SSN, Names), API Keys, User Queries (Messages/Prompt)
**Exposure found:** Plaintext logs in server output via console.log and Winston across multiple routes (/api/chat, /api/bhashini, /api/upload) that print \`req.body\` contents directly (like latestUserMessage).
**Fix:** Implemented a structural Winston \`redactFormat\` middleware to irreversibly mask sensitive keys (password, token, secret, messages, prompt, query) and string patterns (emails, credit cards). Replaced global \`console.error\` and \`console.log\` with the secure \`logger\`. Sanitized error handlers to prevent leaking \`err.message\` or \`err.stack\` to the client via generic 'Internal Server Error' responses.
**Coverage confirmed:** Tested the server patch and ran basic validation. Replaced the \`console.log\` statements that were actively logging PII.
**Still exposed elsewhere:** Potential leaks may still exist in client-side analytics tracking or un-audited exports of data in React components, but server-side logging of PII in the main hot paths has been secured.
