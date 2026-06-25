## 2025-02-20 — Global DOM Events to React Context Bridge

**Risk identified:** Using transient global DOM `CustomEvents` (`window.dispatchEvent('justice-ai-transcription')`) for tight-coupled UI component state sharing lacks type-safety, testability, traceability, and invites "replay bugs" on component remount.
**Migration target:** React Context API for loosely coupled, robust event bridging between deeply nested React components without relying on native DOM events.
**Migrated this session:** Replaced the global `justice-ai-transcription` CustomEvent dispatcher inside `src/main.jsx` and the `window.addEventListener` inside `src/components/chat/ChatInput.jsx`. Created `src/context/TranscriptionContext.jsx` implementing a clean `TranscriptionProvider` event bridge with unique ID tracking to prevent replay bugs on remount.
**Remaining:** Migrate any other components listening to legacy DOM CustomEvents, then audit for other loosely-coupled states holding tight-coupled responsibilities.
**Next session:** Investigate any remaining usage of `CustomEvent` or similar global DOM dispatchers across UI components and migrate to context or Redux/Zustand as appropriate.
