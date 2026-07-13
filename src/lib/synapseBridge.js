export function initializeSynapseBridge() {
  window.addEventListener('justice-ai-analysis-complete', (e) => {
    const { analysis, caseId } = e.detail;

    // Enrich local storage data (CaseTracker schema)
    try {
      const storageKey = 'justice_ai_case_tracker_v2';
      const casesRaw = localStorage.getItem(storageKey);
      let cases = casesRaw ? JSON.parse(casesRaw) : [];

      let updated = false;
      cases = cases.map(c => {
        if (c.id === caseId) {
          updated = true;
          return {
            ...c,
            details: {
              ...c.details,
              synapseEnriched: true,
              aiVerdict: analysis.verdict,
              confidence: analysis.confidence
            }
          };
        }
        return c;
      });

      if (updated) {
        localStorage.setItem(storageKey, JSON.stringify(cases));

        // Notify via Toast
        const event = new CustomEvent('justice-ai-toast', {
          detail: {
            type: 'info',
            title: 'Synapse Connection Active',
            message: 'Case Tracker enriched with latest AI analysis.'
          }
        });
        window.dispatchEvent(event);
      }
    } catch (err) {
      console.error('Synapse Bridge Error:', err);
    }
  });
}
