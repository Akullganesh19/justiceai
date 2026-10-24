System A: Chat/Analysis Panel (which has an analysis object containing a timeline/steps).
System B: Case Tracker (which allows users to track steps of cases).

Currently, they don't communicate. The AI can generate a great step-by-step timeline in the chat for the user's specific case, but the Case Tracker is stuck using hardcoded templates like `CONSUMER_PETITION`, `CRIMINAL_PROCEEDING`, etc.
If we pass the AI-generated timeline directly to the Case Tracker, users would get a customized case tracking dashboard based precisely on their chat session.

We will use the "Shared Context Pattern" (or Event Bridge / LocalStorage injection).
Actually, the best way to loosely couple this is to use `useNavigate` and React Router's `state` parameter to pass the AI generated analysis timeline directly to the Case Tracker Page, or we can use Local Storage and a specific key/event to pass the data, or we can add the newly generated case directly into the Case Tracker's `localStorage` (`justice_ai_case_tracker_v2`) without tightly coupling the components.

The best Synapse approach:
"Event Bridge Pattern / Loosely Coupled Data injection"

In `src/pages/ChatPage.jsx`, pass the `analysis` object to `ExportModal`.
In `ExportModal`, add a button "EXPORT TO CASE TRACKER".
When clicked, it will:
1. Construct a new Case object formatted for Case Tracker (`id`, `name`, `caseType: 'custom'`, `steps: [...]`, `createdAt`).
2. Read `justice_ai_case_tracker_v2` from `localStorage`, append this new case, and write it back.
3. Use `useNavigate` from `react-router-dom` to navigate the user to `/case-tracker`.
Wait, the prompt says: "In the JusticeAI frontend, use React Router's state API (`navigate(path, { state: ... })` and `useLocation().state`) as a loosely coupled 'Shared Context' to pass complex data payloads (like generated AI timelines) directly between isolated page components without introducing a global state manager."

So the connection mechanism:
1. In `src/components/ui/ExportModal.jsx`, add an "EXPORT TO CASE TRACKER" button.
2. It takes `analysis` as a prop (from `ChatPage`).
3. On click, it does `navigate('/case-tracker', { state: { newCaseTimeline: analysis.timeline, caseName: analysis.caseType || 'AI Generated Case' } })`.
4. In `src/pages/CaseTrackerPage.jsx`, inside a `useEffect`, we listen for `location.state.newCaseTimeline`. If it exists, we generate a new custom case, append it to `cases`, save it, and then clear the location state via `navigate(location.pathname, { replace: true })`.

Let's read `CaseTrackerPage.jsx` to see if it uses `useLocation` already.
