## 2024-06-23 — Batch Document Embeddings
**Gap found:** RAG indexing and document upload naively looped over chunks, calling `embeddings.embedQuery()` sequentially for every chunk, creating massive network overhead and high latency when indexing large legal PDFs.
**Why it existed:** Quick initial implementation for simple chunking tests.
**Built:** Refactored `loadAndIndexDocuments` and `/api/upload` to use LangChain's `embeddings.embedDocuments(chunks)`, which batches the embedding requests to the underlying model.
**Hot path affected:** Server startup (RAG indexing of public documents) and runtime `/api/upload` endpoint (user document uploads).
**Measurable improvement:** Dramatically reduces the number of HTTP requests to the embedding model (Ollama) from O(N) where N is chunk count, down to O(1) per document source, drastically decreasing total embedding time.
**Next opportunity:** Investigate request coalescing or caching for redundant LLM queries or embedding searches.
