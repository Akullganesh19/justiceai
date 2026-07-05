## 2025-07-05 — Migrate global CustomEvent to React Context
**Risk identified:** The application was using `window.dispatchEvent(new CustomEvent(...))` to pass transcription data globally from `FloatingVoiceButton` to `ChatInput`. This bypasses React's declarative state model, creates race conditions on component remount, and becomes increasingly difficult to debug and track as the app scales. Relying on DOM events for core app state in a React application is an anti-pattern.
**Migration target:** React Context Provider (`VoiceContext`) managing the state centrally and explicitly, following standard unidirectional data flow.
**Migrated this session:**
- Created `VoiceContext.jsx` to encapsulate the event listener.
- Updated `main.jsx` to wrap the app in `<VoiceProvider>`.
- Updated `ChatInput.jsx` to use `useVoiceContext` instead of manually listening to the global event.
**Remaining:**
- Other potential areas using global CustomEvents should be audited. The original `FloatingVoiceButton` still uses `window.dispatchEvent` since the change was designed to be additive on the publisher side, though a full migration might involve moving the button itself or the dispatch logic into the Context.
**Next session:** Audit remaining `window.dispatchEvent` calls in the codebase and fully migrate `FloatingVoiceButton` to use the Context dispatcher rather than DOM events.
