## 2026-07-08 — Migrate global DOM custom events to React Context for state distribution
**Risk identified:** Using `window.dispatchEvent(new CustomEvent(...))` and `window.addEventListener` for application state (transcription streams) bypasses the React component lifecycle, introducing risks of race conditions, stale closures, difficult testability (without jsdom mocks), and invisible data flows. This architectural pattern gets significantly harder to maintain and untangle as more components need to emit or consume these unmanaged global events, eventually leading to unpredictable re-renders and UI desync.
**Migration target:** Encapsulating state distribution within React via Context Providers (`TranscriptionProvider`) and custom hooks (`useTranscription`). This enforces structured, declarative unidirectional data flow native to the React ecosystem, enabling easier mocking in tests and centralized logging.
**Migrated this session:**
- Created `src/contexts/TranscriptionContext.jsx` with `TranscriptionProvider`.
- Wrapped the app component tree in `src/main.jsx`.
- Migrated `src/components/chat/ChatInput.jsx` to consume `useTranscription` instead of `window.addEventListener`.
**Remaining:**
- Search for and migrate any other `window.addEventListener` usage tied to application state (e.g., case tracker sync, auth events).
- Evaluate components like `MotionGraphics` and `3DBackground` using `window.addEventListener('resize'/'mousemove')` to see if a central UI context for window dimensions or mouse coordinates makes sense to reduce listener bloat.
**Next session:** Migrate remaining implicit global CustomEvents (if any) or begin moving window-bound generic listeners (`resize`, `scroll`) into centralized hooks or contexts to reduce DOM listener thrashing.