## 2024-05-24 — Missing Admin Authentication on Destructive Document Endpoints
**Attacked:** `DELETE /api/documents` and `DELETE /api/documents/:source` and `POST /api/upload`
**Found:** These destructive endpoints lack authentication checks. Any user (or attacker) can blindly upload new, unrelated documents to pollute the RAG store or clear the entire document vector database, breaking functionality across the application for all users.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added `adminAuth` middleware using `crypto.timingSafeEqual` with a `ADMIN_SECRET` environment variable and fallback mechanisms protecting these specific routes.
**Systemic pattern:** Lack of comprehensive authorization middleware across Express endpoints manipulating internal server state.
