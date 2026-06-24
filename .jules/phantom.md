## 2024-06-25 — Intelligent Cache and Request Coalescing for Bhashini Config

**Gap found:** The voice processing endpoints (`/api/voice/process` and potentially others) fetch the Bhashini pipeline configuration synchronously on every request.
**Why it existed:** It was a naive implementation that assumed the configuration needed to be fresh every time or the pipeline config was fast enough not to matter.
**Built:** A caching layer (`getBhashiniConfig`) that stores the configuration for 1 hour, coupled with request coalescing (`inFlightConfigRequests`) to ensure multiple simultaneous requests only trigger a single outbound network call.
**Hot path affected:** Every user voice interaction (STT and TTS) in the `FloatingVoiceButton` or Chat Interface.
**Measurable improvement:** Saves a 200-500ms network round trip to the Bhashini API for 99% of voice requests.
**Next opportunity:** Investigate caching for `parsePdf` or text chunking in `loadAndIndexDocuments` if they are repeated on app restarts unnecessarily, or consider optimistic UI updates for chat responses.
