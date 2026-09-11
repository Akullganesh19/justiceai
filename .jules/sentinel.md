## 2026-09-11 — [Uncaught TypeError on Malformed Chat Payload]
**Attacked:** `/api/chat` endpoint in `server.js`
**Found:** Passing a `null` or missing `content` field for a message object inside `messages` causes `latestUserMessage` to be undefined/null, which later crashes the node process entirely when calling `.substring(0, 50)` on it. Since Express uncaught promise rejections or sync throws within an async function aren't correctly caught by the top-level error handler if they occur before an async operation like `await embeddings.embedQuery`, it breaks the application. Actually, `embedQuery` will also crash if passed a null or empty string. The issue is that the code doesn't validate if `latestUserMessage` is a valid string.
**Severity:** 🔴
**Fixed or flagged:** Fixed
**Systemic pattern:** Assuming deeply nested data is always in the expected type. Need to validate `typeof latestUserMessage === 'string'`.

## 2026-09-11 — [Uncaught TypeError on Malformed Embed Payload]
**Attacked:** `/api/embed` endpoint in `server.js`
**Found:** Passing a non-string `text` field (like `null` or a nested object) would pass the `!text` truthy check (if passing an object, though `null` is falsy. Wait, `null` actually failed with "Text is required". But passing `{}` would pass the check and crash the embedding module). The fix validates `typeof text === 'string'`.
**Severity:** 🟡
**Fixed or flagged:** Fixed
**Systemic pattern:** Same as above, assuming input validation based on truthiness rather than type checking.
## 2026-09-11 — [Uncaught TypeError on Empty Array Chat Payload]
**Attacked:** `/api/chat` endpoint in `server.js`
**Found:** Passing an empty array (`[]`) for `messages` bypasses the falsy check (`!messages`) and originally failed gracefully. However, earlier fixes missed this specific scenario where `messages[messages.length - 1]` becomes `undefined`. This triggers an unhandled `TypeError: Cannot read properties of undefined (reading 'content')`.
**Severity:** 🔴
**Fixed or flagged:** Fixed
**Systemic pattern:** Incomplete input validation. The endpoint now specifically checks `messages.length === 0` and properly validates the structure of `lastMessage`. Added regression tests to `src/test/api-crashes.test.js`.
