## YYYY-MM-DD — Settings/Config Export/Import
**Product understood as:** A local-first, privacy-focused AI legal co-pilot that stores all user chat history, documents, and API keys strictly in browser localStorage (`justice_ai_*`).
**Derivation reasoning:** The product stores valuable user data (case history, API keys, document templates) entirely in local storage for privacy. Users switch devices or clear their browser caches. Therefore, they obviously need a way to export and import their settings and history — because currently, clearing cache or switching devices means total data loss. It doesn't exist because the initial focus was on building the core features (chat, estimator, etc.) first. I'm building it because users need portability and backup for their local-first data.
**Feature built:** Settings/Data Export & Import capability in the Intelligence Selection Terminal (Settings page).
**User impact:** Users can now download a `.json` backup of all their `justice_ai_` localStorage data and restore it on any device.
**Next logical feature:** Cross-device sync via end-to-end encrypted cloud backup.
