1. **Implement listener**: According to the review, the Event Bridge pattern is incomplete because there are emitters (in `AuthUI` and `ErrorBoundary`) but no listeners connecting systems. I will create a listener in an appropriate place (e.g. `src/main.jsx`) that logs to an analytics system or local storage to complete the pattern. I will use `globalEventBus.on` to listen to `user.login`, `user.register`, and `system.error` and build a mock "AnalyticsSystem" to receive these.
2. **Apply fixes**: Update `src/main.jsx` to import `globalEventBus` and listen to the events.
3. **Verify Modifications**: Use `git diff` and visual verification.
4. **Update Journal**: Write to `.jules/synapse.md` describing the complete connection.
5. **Run Test Suite**: Run `npm test`.
6. **Pre-commit**: Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
