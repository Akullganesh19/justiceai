## 2023-10-27 — Missing Authorization on Vector Store Destructive/Upload Endpoints
**Attacked:** `POST /api/upload` and `DELETE /api/documents`
**Found:** These endpoints were fully exposed without any authentication, allowing anyone who can reach the backend to clear the vector index (which resets state) or inject arbitrary text/PDF data into the vector index that influences subsequent RAG generation.
**Severity:** 🔴
**Fixed or flagged:** Fixed. I implemented an `adminAuth` middleware using standard cryptographic timing-safe comparisons and applied it to these endpoints. I also implemented an `errorHandler` middleware that mitigates DoS via Multer limit errors or malformed URIs.
**Systemic pattern:** Look for administrative endpoints (e.g., config changes, user management) that might lack standard JWT or basic auth. The fix introduced relies on `ADMIN_SECRET` in production.
