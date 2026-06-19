## 🛡️ Adversarial Verification Report

**Scope attacked:** `POST /api/upload`, `POST /api/chat`
**🔴 Exploitable findings:**
- **File Upload Disk Space Leak:** Sending unsupported file types via `POST /api/upload` results in the uploaded files being permanently left in the `uploads/` directory instead of being cleaned up, allowing an unauthenticated attacker to fill the server's disk space (DoS).
  - *Reproduction:* Upload a `.doc` file using `multer`. It bypasses the multer filter but reaches the route handler, hitting the `Unsupported file type` continue block, skipping the file deletion `fs.unlinkSync()`.
  - *Fix:* Added a `finally` block to always ensure the file is deleted.
- **Server Crash on Invalid `messages` format:** Sending `content` as an array (e.g. `["this", "is", "an", "array"]`) instead of a string to `POST /api/chat` crashes the server because `.substring()` is called on it without checking type.
  - *Reproduction:* `POST /api/chat` with body `{"messages": [{"role": "user", "content": ["this"]}]}`
  - *Fix:* Added type checking and casting to `String` for the `latestUserMessage` before calling `.substring()`.

**🟡 Latent findings:** None explicitly identified in this session.
**🟢 Theoretical findings:** None explicitly identified in this session.
**Fixed this session:**
- Fixed File Upload Disk Space Leak.
- Fixed Server Crash on Invalid `messages` format.
**Requires human review:** None.
