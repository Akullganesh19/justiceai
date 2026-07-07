## 2026-07-07 — Chat Endpoint and File Upload Crashes / Leaks
**Attacked:** POST `/api/upload`, POST `/api/chat`
**Found:**
1. `/api/upload` leaks file resources on disk if parsing throws an error, leaving files in `uploads/` directory permanently.
2. `/api/chat` crashes with a 500 error if `messages` array contains elements missing `content` or is malformed, due to an unhandled `.substring()` call.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Resource leak closed using `finally` blocks for reliable unlinking. Crash fixed by properly defaulting and validating input before calling `.substring()`.
**Systemic pattern:** Handlers directly assuming object shape (like `req.body.messages[...].content.substring()`) without validations. Upload processes failing to wrap temporary resources in guarantees (finally).
