## 2024-06-19 — Auth Error Context
**Systems connected:** Auth (`src/components/ui/auth-fuse.tsx`) ↔ Errors (`src/components/ui/ErrorBoundary.jsx`)
**Intelligence emerged:** Error logs now include the context of the currently authenticated user (e.g., email/role), allowing engineering to easily identify which users experienced failures and enabling proactive support.
**Data flows:** Auth dispatches the `justice-auth-identified` CustomEvent containing user details upon sign-in/sign-up. ErrorBoundary listens for this event globally and stores the user context, attaching it to any subsequent intercepted UI errors.
**Coupling approach:** Event Bridge Pattern (`window.dispatchEvent` / `window.addEventListener`). Neither system directly imports the other, remaining completely decoupled while still sharing critical contextual state.
**Next connection:** Connect Auth ↔ Analytics (tie usage data to specific advocate accounts).
