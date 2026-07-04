## 2026-07-04 — Additive Context Migration for CustomEvent Dispatch

**Risk identified:** The application relies heavily on global `window.addEventListener` logic using `CustomEvent` for handling things like voice transcription across the application. This imperative pattern is highly discouraged in React as it bypasses React’s declarative rendering tree, making component updates less predictable and prone to race conditions, memory leaks (if not properly removed), and difficult mocking in tests. As the React ecosystem moves entirely toward state-driven UI models (like Context and Providers), relying on this legacy pattern will become increasingly problematic for concurrency, Server-Side Rendering (SSR), or when switching to newer architectures like React Server Components.

**Migration target:** Replace imperative `CustomEvent` dispatches with a structured React Context model using `useContext` hook to manage the state updates dynamically. This provides explicit dependency injection and declarative data flow.

**Migrated this session:**
- Created `TranscriptionContext` to wrap transcription events.
- Updated `main.jsx` to preserve additive backwards compatibility (it triggers both the event and Context).
- Refactored `ChatInput.jsx` to natively use `TranscriptionContext` instead of manually binding `CustomEvent` listeners. Used a timestamp tracking `useRef` to prevent contextual replay bugs when mounting and unmounting.

**Remaining:**
- Review the rest of the application for any other global `window.addEventListener` or `dispatchEvent` cases.
- Remove the `CustomEvent` dispatch entirely once all components have transitioned to `TranscriptionContext`.

**Next session:**
- Migrate any remaining usages of `justice-ai-transcription` listeners to the new `TranscriptionContext`.
- Remove the legacy `CustomEvent` dispatch from `handleGlobalTranscription` inside `main.jsx`.