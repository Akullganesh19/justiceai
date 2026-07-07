export function initSynapseBridge() {
  if (typeof window === 'undefined') return;

  const STORAGE_KEY = 'justice_ai_case_tracker_v2';

  const handleAnalysisComplete = (event) => {
    const { activeCaseId, title, analysis } = event.detail;

    if (!analysis || !analysis.timeline || analysis.timeline.length === 0) {
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      let cases = saved ? JSON.parse(saved) : [];

      // Check if we already created a tracker for this case ID
      const existingCaseIndex = cases.findIndex((c) => c.id === activeCaseId);

      if (existingCaseIndex === -1) {
        // Map timeline to tracker steps
        const steps = analysis.timeline.map((item, index) => ({
          id: Date.now() + index, // Ensure unique IDs
          label: item.stage,
          description: item.detail || '',
          completed: item.status === 'completed',
          completedDate: item.status === 'completed' ? new Date().toISOString().split('T')[0] : '',
        }));

        const newTrackerCase = {
          id: activeCaseId,
          name: title || 'AI Generated Timeline',
          caseType: analysis.caseType || 'custom',
          steps,
          createdAt: new Date().toISOString(),
        };

        // Add to the front of the list
        cases = [newTrackerCase, ...cases];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));

        console.log(`🧠 Synapse: Auto-generated tracker for case ${activeCaseId}`);
      }
    } catch (error) {
      console.error('Synapse Bridge Error processing analysis:', error);
    }
  };

  // Add the event listener
  window.addEventListener('justice-ai-analysis-complete', handleAnalysisComplete);

  // Return cleanup function
  return () => {
    window.removeEventListener('justice-ai-analysis-complete', handleAnalysisComplete);
  };
}
