export function initCrossSystemIntelligence() {
  if (typeof window === 'undefined') return;

  const STORAGE_KEY = 'justice_ai_case_tracker_v2';

  window.addEventListener('justice-ai-analysis-generated', (event) => {
    try {
      const { analysis, caseId, title } = event.detail;

      if (!analysis || !analysis.timeline || !Array.isArray(analysis.timeline)) return;

      // Map analysis timeline to Case Tracker steps
      const steps = analysis.timeline.map((item, index) => ({
        id: Date.now() + index,
        label: item.stage || 'Case Stage',
        description: item.detail || '',
        completed: item.status === 'completed',
        completedDate: item.status === 'completed' ? new Date().toISOString().split('T')[0] : '',
      }));

      // Retrieve existing tracker data
      let cases = [];
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          cases = JSON.parse(saved);
        }
      } catch (e) {
        // Ignored
      }

      // Check if case already exists
      const existingCaseIndex = cases.findIndex((c) => c.id === caseId);

      if (existingCaseIndex >= 0) {
        // Merge steps or update existing ones (simple approach: append new ones or just replace if we want)
        // Here we'll replace the steps with the new intelligence, preserving completion state if we can,
        // but replacing is simpler for the AI generated structure.
        cases[existingCaseIndex].steps = steps;
      } else {
        // Create new case
        const newCase = {
          id: caseId || Date.now().toString(),
          name: title || analysis.caseType || 'AI Generated Case',
          caseType: analysis.caseType || 'General',
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
        cases.unshift(newCase);
      }

      // Save back to Tracker
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));

      // Notify the user via System B (Toast)
      const toastEvent = new CustomEvent('justice-ai-toast', {
        detail: {
          type: 'success',
          title: 'Intelligence Synced 🧠',
          message: 'AI strategy automatically imported into your Case Tracker.',
        },
      });
      window.dispatchEvent(toastEvent);

    } catch (error) {
      console.error('Cross-system intelligence sync failed:', error);
    }
  });
}
