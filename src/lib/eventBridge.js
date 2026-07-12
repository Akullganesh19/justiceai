export function initializeEventBridge() {
  window.addEventListener('justice-ai-case-update', (event) => {
    const { timeline, caseType } = event.detail;
    if (!timeline || !Array.isArray(timeline)) return;

    try {
      const STORAGE_KEY = 'justice_ai_case_tracker_v2';
      const saved = localStorage.getItem(STORAGE_KEY);
      let cases = saved ? JSON.parse(saved) : [];

      let currentCase = cases.length > 0 ? cases[0] : null;

      // If no case exists, create a new one based on AI analysis
      if (!currentCase) {
        currentCase = {
          id: Date.now().toString(),
          name: `AI Generated: ${caseType}`,
          caseType: 'ai-generated',
          steps: [],
          createdAt: new Date().toISOString(),
          details: { caseNumber: '', courtName: '', bench: '', advocateName: '', advocatePhone: '', oppositeParty: '', nextHearing: '' }
        };
        cases.push(currentCase);
      }

      // Convert AI timeline steps into Tracker steps
      const existingSteps = currentCase.steps || [];
      const maxId = existingSteps.length > 0 ? Math.max(...existingSteps.map(s => s.id)) : 0;

      let newStepsAdded = 0;
      const updatedSteps = [...existingSteps];

      timeline.forEach((tStep) => {
        // Avoid exact duplicates by label
        if (!updatedSteps.some(s => s.label.toLowerCase() === tStep.stage.toLowerCase())) {
          updatedSteps.push({
            id: maxId + newStepsAdded + 1,
            label: tStep.stage,
            description: tStep.detail,
            completed: tStep.status === 'completed',
            expectedDate: null
          });
          newStepsAdded++;
        }
      });

      if (newStepsAdded > 0) {
        currentCase.steps = updatedSteps;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));

        // Dispatch an internal event so CaseTrackerPage can auto-refresh if it IS mounted
        window.dispatchEvent(new CustomEvent('justice-ai-case-tracker-refreshed'));
      }
    } catch (e) {
      console.error('Failed to bridge AI analysis to Case Tracker:', e);
    }
  });
}
