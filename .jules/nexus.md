## 2024-05-18 — Urgent Deadlines Dashboard Widget

**Product understood as:** An AI-powered legal co-pilot that helps Indian citizens chat about legal issues, generate documents, and track their case milestones.

**Derivation reasoning:**
Using Pattern 1 (Data Without Insight) and Pattern 4 (Events Without Notification).
The system tracks cases and milestones (via `justice_ai_case_tracker_v2` in localStorage). Many milestones have an `expectedDate` (deadlines). However, the central Dashboard, where a user lands upon logging in, only pulls `justice_ai_history` to show past chat interactions. If a user has a critical deadline (e.g. an upcoming court hearing or limitation expiration) in 3 days, they would not see it unless they explicitly navigated to the Case Tracker page. By combining the data, we surface urgent tasks automatically.

**Feature built:**
An "URGENT DEADLINES" widget dynamically rendered on the Dashboard's Side Terminal. It extracts all active case steps from localStorage, filters for incomplete tasks with target dates, calculates `daysUntil`, sorts them by urgency, and prominently displays the top 3 deadlines (with a red pulsing alert for tasks due in <= 3 days).

**User impact:**
Users are immediately alerted to upcoming legal deadlines and court dates right from the dashboard, drastically reducing the risk of missing critical statutory or judicial milestones without having to manually check their tracker.

**Next logical feature:**
Connect the case tracking milestones to the AI chat, so if a deadline passes without completion, the AI proactively suggests drafting the required document.