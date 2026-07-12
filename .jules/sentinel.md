## 2026-07-12 — Destructuring Null Crash in API
**Attacked:** \`/api/chat\` (JSON body parsing)
**Found:** Passing explicit \`null\` for \`apiKeys\` bypasses the default assignment (\`apiKeys = {}\`) and crashes the server when properties are accessed (\`apiKeys.gemini\`). Node.js 500 error terminates the request, but presents an unhandled exception vector.
**Severity:** 🟡
**Fixed or flagged:** Fixed. Replaced destructuring default with an explicitly safe fallback object.
**Systemic pattern:** This is a common JavaScript destructuring pitfall where optional objects are expected and should be checked for explicit nulls in all API boundaries.

## 2026-07-12 — File Upload Cleanup Leak
**Attacked:** \`/api/upload\`
**Found:** If a file upload throws an error before reaching the \`fs.unlinkSync(filePath)\` call (e.g. if the file type is unsupported, it skips via \`continue\` without cleaning up, leaving the file dangling in the upload directory). This allows an attacker to fill the disk space by uploading unsupported files repeatedly.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added a \`finally\` block with an explicit \`unlinkSync\` to ensure uploaded files are deleted regardless of parsing outcome.
**Systemic pattern:** Anywhere temporary files or streams are opened and handled inside a loop with conditional \`continue\` or \`break\`.
