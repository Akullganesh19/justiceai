1. **Create auto-retry mechanism (`fetchWithRetry`)**:
   - Create `src/lib/genesis/fetchInterceptor.js` which globally patches `fetch` to add exponential backoff retry for idempotent requests (GET, HEAD, OPTIONS, PUT, DELETE).
   - This protects the frontend from transient network errors (like failing to reach the local backend or external APIs like Bhashini or LLMs).
2. **Apply global fetch interceptor to Frontend (`src/main.jsx`)**:
   - Import and invoke `setupFetchInterceptor()` in `src/main.jsx` before React renders.
3. **Apply fetch retry to Backend (`server.js`)**:
   - Create a similar node.js compatible fetch wrapper `fetchWithRetry` in `server.js` or patch global `fetch` directly in `server.js` (since Node 18+ has native fetch).
   - Alternatively, inject the `fetchInterceptor.js` at the top of `server.js`.
4. **Update `genesis.md`**:
   - Document the auto-retry addition in `.jules/genesis.md` following the required format.
5. **Pre-commit Steps**:
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
6. **Submit**:
   - Submit the PR as `🌬️ Genesis: [Auto-Retry for External API Connections]`.
