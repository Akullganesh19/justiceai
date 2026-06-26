## 2024-06-26 — Migrate CustomEvent to React Context

**Risk identified:** Using global `window.dispatchEvent` with `CustomEvent` for state sharing between React components circumvents React's reactivity system. This leads to untrackable data flow, potential memory leaks (if listeners aren't unmounted), and "replay bugs" where old events might be missed or processed multiple times on re-renders, increasing the difficulty of maintaining the codebase as it scales.

**Migration target:** The React ecosystem relies on Context API or dedicated state management libraries (like Zustand/Redux) for cross-component state sharing. This ensures predictable rendering, type-safety, and traceability.

**Migrated this session:**
- Created `TranscriptionProvider` Context.
- Refactored `main.jsx` to wrap the app with `TranscriptionProvider` and removed the old `CustomEvent` relay.
- Updated `FloatingVoiceButton.jsx` to dispatch transcriptions via context.
- Updated `ChatInput.jsx` to listen for transcriptions via context and manage replay bugs using timestamps.

**Remaining:** Search the codebase for other usages of `CustomEvent` or `window.dispatchEvent` and migrate them to Context or local state as appropriate.

**Next session:** Look for other custom events (e.g., local storage sync events, other cross-component messaging) and convert them to robust React-native state management solutions.
