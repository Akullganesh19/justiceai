## 2024-05-24 — Migrate global CustomEvent to React Context API
**Risk identified:** The application relies on `window.dispatchEvent(new CustomEvent('justice-ai-transcription'))` to pass voice recognition strings from `FloatingVoiceButton` to `ChatInput`. This transient event pattern is an anti-pattern in modern React. It creates race conditions, replay bugs upon remount, is difficult to type-check, and tightly couples components to the global window object. This would become increasingly painful as the application scales and more components need to react to voice input asynchronously.
**Migration target:** The modern React Context API (`TranscriptionContext`) to securely and reliably manage this global state and allow components to declaratively subscribe to updates using hooks (`useTranscription`).
**Migrated this session:**
- Created `TranscriptionContext` with a provider and a `useTranscription` hook.
- Wrapped the app in `TranscriptionProvider` in `src/main.jsx`.
- Intercepted the legacy global handler in `src/main.jsx` and piped it into the new context using `dispatchTranscription`.
- Refactored `ChatInput` to consume `useTranscription` and reliably handle state updates, while removing its legacy event listener to prevent double-firing race conditions.
- Preserved a legacy event dispatch within the context to support unmigrated components (additive migration strategy).
**Remaining:** Identify any other legacy components still listening to the `justice-ai-transcription` window event and refactor them to use `useTranscription`. Once all listeners are migrated, the legacy fallback dispatch in `TranscriptionContext` can be safely removed.
**Next session:** Complete the migration for any other components listening to the `justice-ai-transcription` window event and delete the legacy fallback logic in the context.
