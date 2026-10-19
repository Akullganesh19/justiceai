## 2026-04-14 - [Missing admin authentication on destructive/upload RAG endpoints]
**Attacked:** POST /api/upload, DELETE /api/documents/:source, DELETE /api/documents
**Found:** The memory mentions 'The backend Express server protects destructive RAG vector store endpoints... using an adminAuth middleware'. However, the endpoints '/api/upload', '/api/documents/:source' and '/api/documents' in server.js currently lack any authentication and are fully public. This allows unauthenticated users to upload arbitrary data into the RAG vector store and delete all documents or chunks, exposing the application to data corruption and DoS.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Added adminAuth middleware according to memory instructions.
**Systemic pattern:** Lack of authentication on internal administration endpoints.
