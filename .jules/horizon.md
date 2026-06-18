## 2024-06-18 — Batch Document Embeddings
**Risk identified:** Sequential network calls for embeddings (`embedQuery` in a loop) create a significant performance bottleneck during RAG initialization and document uploads, compounding as document volume grows.
**Migration target:** Batch processing using LangChain's `embedDocuments` to process arrays of chunks in a single network request.
**Migrated this session:** Initial RAG database loading and `/api/upload` endpoint in `server.js` have been migrated from sequential `embedQuery` loops to batch `embedDocuments`.
**Remaining:** Single-text embedding endpoints like `/api/embed` and individual query embedding during `/api/chat` naturally still use `embedQuery` as they are single inputs. The core batch processing vulnerability is closed.
**Next session:** Identify and migrate other sequential network operations (e.g., if there are any loops making API calls to LLMs for summarization).
