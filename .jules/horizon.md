## 2024-06-24 — Migrate CustomEvent to React Context API for UI State

**Risk identified:** The global `window.dispatchEvent('justice-ai-transcription')` CustomEvent bus bypasses React's declarative data flow to share state across decoupled components. As the application scales, this pattern leads to "ghost events", race conditions, difficult testing, and poor traceability, creating a high-risk legacy decision.
**Migration target:** The React Context API for structured, type-safe, and declarative state sharing within the component tree, ensuring events naturally propagate via the React render cycle and can be safely consumed and cleared.
**Migrated this session:**
- Created `TranscriptionContext` providing typed state (`transcriptionData`) with mechanisms to clear state and prevent component remount replay bugs.
- Updated `src/main.jsx` to wrap the app with `TranscriptionProvider`.
- Updated `FloatingVoiceButton` and `ChatInput` to consume the context natively instead of using `window.dispatchEvent` and `window.addEventListener`.
**Remaining:** Migrate any other remaining custom event dispatchers for transient state (e.g., local storage change listeners if not strictly needed) to context or dedicated stores.
**Next session:** Investigate the `justice_ai_*` local storage interactions to see if a unified state store (e.g. Zustand) or shared context could replace scattered direct `localStorage` access across components.
