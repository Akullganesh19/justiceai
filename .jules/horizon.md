## 2024-06-23 — Migrate CustomEvent to React Context API for Global UI State
**Risk identified:** The codebase uses `window.dispatchEvent(new CustomEvent(...))` to share UI state across tightly-coupled components (e.g., passing transcriptions from `FloatingVoiceButton` to `ChatInput`). This relies on global DOM events, which breaks React's unidirectional data flow, makes types unpredictable, prevents reliable testing, and often causes race conditions if a component unmounts. This pattern is listed in Memory as one to migrate away from.
**Migration target:** The modern React Context API, using a `TranscriptionProvider` and `useTranscription` hook, ensuring type-safe, traceable, and reliable UI state sharing without global side effects.
**Migrated this session:**
- Created `TranscriptionContext` in `src/contexts/TranscriptionContext.jsx`.
- Wrapped the app with `TranscriptionProvider` in `src/main.jsx`.
- Refactored `FloatingVoiceButton` to consume `useTranscription().addTranscription` instead of calling an `onTranscription` callback that fires global events.
- Refactored `ChatInput` to consume `useTranscription().transcriptionPayload` via `useEffect` instead of a window event listener.
**Remaining:** Identify any other DOM `CustomEvent` usages and migrate them to Context or global state managers.
**Next session:** Find other instances of `window.addEventListener` or `window.dispatchEvent` (e.g., in other components) and eliminate them.
