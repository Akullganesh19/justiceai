## 2026-07-03 — Migrate Window DispatchEvent to React Context

**Risk identified:** The codebase uses raw `window.dispatchEvent` and `CustomEvent` for global communication (e.g., passing transcriptions from `FloatingVoiceButton` to `ChatInput`). This approach is brittle, not type-safe, hard to debug, and inherently couples UI components to global transient browser events. It causes race conditions, double triggers, and makes testing components in isolation very difficult.
**Migration target:** The React Context API. It provides a structured, declarative, and type-safe mechanism to manage global application state, directly tying into React's lifecycle and rendering system.
**Migrated this session:** The `justice-ai-transcription` global event used for voice input. Created `TranscriptionContext` and refactored `main.jsx` and `ChatInput` to use it instead of `window.dispatchEvent` and `window.addEventListener`.
**Remaining:** Identify other instances of `window.dispatchEvent` or global `CustomEvent` usage for UI state sharing and migrate them systematically. Ensure legacy listeners are completely removed.
**Next session:** Check for other `CustomEvent` usages and migrate them.
