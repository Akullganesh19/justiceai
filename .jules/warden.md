## YYYY-MM-DD — [Active Exposure in Server Logs]
**Data traced:** PII/Sensitive data within user prompts (e.g., chat messages sent to /api/chat).
**Exposure found:** The latest user message is being logged in plaintext (up to 50 characters) in application logs on line 824 of `server.js` (`console.log(\`Routing query to Ollama: "${latestUserMessage.substring(0, 50)}..."\`);`). This logs the user's input, which may contain sensitive legal or personal information.
**Fix:** Removed or redacted the logging of `latestUserMessage` in `server.js`.
**Coverage confirmed:** Tested the chat endpoint and verified that user messages are no longer logged in plaintext.
**Still exposed elsewhere:** The `server.js` request logging middleware logs all `req.body` keys in `/api/chat`.
