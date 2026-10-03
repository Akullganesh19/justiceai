## 2024-10-03 — Predictive Document Pre-filling
**Product understood as:** An AI-powered legal co-pilot helping users generate legal documents based on their cases.
**Derivation reasoning:** We store `justice_ai_history` which contains case facts and user inputs. Users repeatedly enter facts into the chat and then must re-type them into document generator forms. Therefore users obviously need form pre-filling — because it eliminates redundant data entry. It doesn't exist because the chat and document systems were built independently. I'm building it because it seamlessly connects intelligence across modules and saves user time.
**Feature built:** Added predictive pre-filling to `FormWizard` that parses the latest case facts from `localStorage` and automatically populates relevant form fields (like facts, narrative, amounts).
**User impact:** Users generating documents right after a chat session no longer have to re-type their entire case narrative or specific claim amounts.
**Next logical feature:** Automated deadline extraction from case histories to pre-fill the Limitation Calculator or Case Tracker.
