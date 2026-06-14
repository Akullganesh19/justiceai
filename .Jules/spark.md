# Spark's Memory

## Built so far
- Case History Search — 2025-05-14 — Added a search and filtering system to the `CaseHistorySidebar` allowing users to find consultations by title, ID, or content.
- Consultation Renaming — 2025-05-14 — Implemented inline renaming for history items in the sidebar with persistence to `localStorage`.

## Deferred (good ideas, not yet)
- Interactive Timeline — Would require larger refactor of `AnalysisPanel`'s data structure.

## Human signals
- The user appreciates "premium" and "high-end" UI touches (3D interactions).
- Code review flagged missing variable definitions that were actually present in the file (false positive due to partial context).

## Recommended next
Implement a "Share Consultation" feature using the browser's native share API or a generated link, building on the newly added search capability to manage shared records.
