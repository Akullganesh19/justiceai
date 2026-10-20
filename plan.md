1. **Create hook `src/hooks/useSyncChatToTracker.js`**
    - Create a custom hook `useSyncChatToTracker` that listens to changes in `justice_ai_history` `localStorage` or wraps the setting of the history and updates `justice_ai_case_tracker_v2` `localStorage`.
    - It's easier and cleaner to create a cross-system sync function that can be explicitly called when an analysis is completed, rather than intercepting local storage via an interval.
    - We will implement an `exportToTracker(title, analysis)` function.

2. **Modify `src/components/analysis/AnalysisPanel.jsx`**
    - Add a new "Sync to Case Tracker" action in the `AnalysisPanel`.
    - It will appear next to the "Export Options" button.
    - It will call a prop `onSyncTracker`.

3. **Modify `src/pages/ChatPage.jsx`**
    - Define the `handleSyncTracker` function.
    - `handleSyncTracker` will extract the `timeline` from the current `analysis`, format it into the expected CaseTracker structure, and update the `justice_ai_case_tracker_v2` localStorage key.
    - Add a `useToast` to provide user feedback when it syncs successfully.

4. **Verify tests and pre-commit checks**
    - Run linter and tests.
    - Pre-commit.
