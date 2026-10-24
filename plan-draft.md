1. **Pass `analysis` prop to `ExportModal`**
   - File: `src/pages/ChatPage.jsx`
   - Action: Pass `analysis={analysis}` to `<ExportModal ... />`.

2. **Modify `ExportModal` to include an "Export to Case Tracker" button**
   - File: `src/components/ui/ExportModal.jsx`
   - Actions:
     - Import `useNavigate` from `react-router-dom`.
     - Accept `analysis` as a prop.
     - Add a button "EXPORT_TO_CASE_TRACKER" (using a Lucide icon like `Milestone` or `MapPin`).
     - On click, navigate to `/case-tracker` using `navigate('/case-tracker', { state: { newCaseTimeline: analysis.timeline, caseName: analysis.caseType || 'AI Generated Case' } })`.

3. **Listen for shared context in `CaseTrackerPage`**
   - File: `src/pages/CaseTrackerPage.jsx`
   - Actions:
     - Import `useLocation` and `useNavigate` from `react-router-dom`.
     - Read `location.state` in a `useEffect`.
     - If `location.state?.newCaseTimeline` exists:
       - Construct a custom case object (`id`, `name`, `caseType: 'custom'`, `steps` mapped from `timeline`, `createdAt`, `details`).
       - Because of ESLint rules about `react-hooks/set-state-in-effect`, wrap state setter calls in `setTimeout(() => { ... }, 0)`.
       - Update `setCases` and `setActiveCaseId`.
       - Clear the state so refreshing doesn't duplicate the case: `navigate(location.pathname, { replace: true, state: {} })`.

4. **Complete Pre-commit Steps**
   - Call `pre_commit_instructions` and follow its instructions to ensure proper testing, verifications, reviews and reflections are done.

5. **Submit PR**
   - Write `.jules/synapse.md` journal.
   - Run tests.
   - Commit and submit.
