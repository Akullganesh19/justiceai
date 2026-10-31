1. **Analyze `server.js`**: `xssMiddleware` preserves numbers and other primitive types when sanitizing objects.
2. **Identify crash condition**: In `/api/chat`, `jurisdiction` from `req.body` is used in a string manipulation `jurisdiction.toLowerCase()` at line 763. Sending `{ "jurisdiction": 123 }` causes a `TypeError` and crashes the endpoint.
3. **Fix the issue**: Modify line 763 in `server.js` to cast `jurisdiction` to a string before calling `.toLowerCase()`. Specifically change:
   `jurisdiction.toLowerCase()` -> `String(jurisdiction).toLowerCase()`
4. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
5. **Commit the change**: Title "🛡️ Sentinel: Fix type coercion crash in /api/chat due to non-string jurisdiction" and include a proper description.
