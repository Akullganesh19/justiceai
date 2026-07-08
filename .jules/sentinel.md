## 2026-07-08 — Missing input sanitization and default fallbacks causing server crashes

**Attacked:** POST `/api/chat` boundary tests with empty, null, undefined `content` strings in messages array, and null `apiKeys` objects.
**Found:**
1. Missing null/undefined checks on the `latestUserMessage` before calling `.substring(0, 50)` on line 824.
2. `apiKeys` is destructured with a default `{}`, but if a user explicitly passes `apiKeys: null`, then accessing `apiKeys.gemini` throws a `TypeError`.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added strict string checking and fallback coalescing to avoid crashes.
**Systemic pattern:** Assuming properties passed in a JSON body to the API are objects and strings instead of doing defensive checks.

## 2026-07-08 — /api/upload boundary tests lacking file checking
**Attacked:** POST `/api/upload` endpoint without any files.
**Found:** Handled correctly. Returns 400 'No files uploaded'.
**Severity:** 🟢
**Fixed or flagged:** Flagged. No changes needed.
