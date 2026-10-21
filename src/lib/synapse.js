export function initializeSynapse() {
  window.addEventListener('justice-ai-analysis-updated', (e) => {
    const { caseId, title, analysis } = e.detail;
    if (!analysis || !analysis.timeline) return;

    try {
      const STORAGE_KEY = 'justice_ai_case_tracker_v2';
      const saved = localStorage.getItem(STORAGE_KEY);
      let cases = saved ? JSON.parse(saved) : [];

      let caseIndex = cases.findIndex((c) => c.id === caseId);

      const steps = analysis.timeline.map((t, idx) => ({
        id: idx + 1,
        label: t.stage,
        description: t.detail,
        completed: t.status === 'Completed' || t.status === 'completed'
      }));

      if (caseIndex >= 0) {
        cases[caseIndex] = {
          ...cases[caseIndex],
          steps: steps
        };
      } else {
        const newCase = {
          id: caseId,
          name: title || 'AI Generated Case',
          caseType: 'consumer',
          steps: steps,
          createdAt: new Date().toISOString(),
          details: {
            caseNumber: '',
            courtName: '',
            bench: '',
            advocateName: '',
            advocatePhone: '',
            oppositeParty: '',
            nextHearing: '',
          },
        };
        cases.push(newCase);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
      window.dispatchEvent(new CustomEvent('justice-ai-tracker-synced'));
      console.log('🧠 Synapse: Case tracker updated from AI analysis.');
    } catch (err) {
      console.error('🧠 Synapse Error:', err);
    }
  });
}
