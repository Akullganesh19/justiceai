## 2024-05-18 — Local Storage Mutability
**Value type:** State, UI persistency, user data
**Drift risk found:** Not exactly a currency/balance, but saving complex state arrays (`history`, `cases`) directly to `localStorage` on every render update can lose data if two tabs update concurrently.
**Fix:** (None yet. There aren't actual financial balances in this codebase.)
**Proven by:** N/A
**Other balances to check:** None. This is a frontend/React/Express system using LLMs. No DB, no payments, no ledger.
## 2024-05-18 — RAG Document Chunks Array Mutation
**Value type:** Document Chunks (Quota/Count/Inventory)
**Drift risk found:** The global `documentChunks` array acts as an inventory count. When a document is uploaded, chunks are pushed into it. When deleted, it's reassigned via `filter()`. There are two main issues: 1. If two uploads happen concurrently, array pushes might interleave, but they are generally safe in single-threaded Node.js. 2. `upload.array` loop calls `embeddings.embedQuery(chunk)` which is async and can fail. If an upload fails midway, partial chunks are left in `documentChunks` with no rollback, creating orphaned 'value' (memory leak / drift). Additionally, temp files via `req.file.path` are deleted in a `try/catch` without a `finally` block, so if parsing/embedding throws, the file remains on disk forever, causing a storage quota leak.
**Fix:** 1. Process chunks into a temporary array and only push to the global `documentChunks` if the *entire* file is processed successfully (atomic operation). 2. Use a `finally` block to ensure `fs.unlinkSync(filePath)` happens even on error.
**Proven by:** A test that uploads an invalid/crashing file (or simulates an embedding crash) and asserts that the global chunks length hasn't changed and the temp file is gone.
**Other balances to check:** File size limits are enforced by multer, but cleanup is the primary quota risk.
