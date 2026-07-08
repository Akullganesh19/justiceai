export function initEventBridge() {
  if (typeof window === 'undefined') return;

  // Listen for AI analysis completion from the Chat system
  window.addEventListener('justice-ai-analysis-complete', (e) => {
    try {
      const { caseId, title, analysis } = e.detail;

      if (!analysis || !analysis.timeline || analysis.timeline.length === 0) {
        return; // No actionable timeline to sync
      }

      const STORAGE_KEY = 'justice_ai_case_tracker_v2';
      const existingData = localStorage.getItem(STORAGE_KEY);
      let trackerCases = [];

      if (existingData) {
        trackerCases = JSON.parse(existingData);
      }

      // Check if we already bridged this case to avoid duplicates
      if (trackerCases.some(c => c.sourceId === caseId)) {
        return;
      }

      // Map AI timeline to Tracker steps
      const newSteps = analysis.timeline.map((stage, index) => ({
        id: index + 1,
        label: stage.stage || 'Unnamed Stage',
        description: stage.detail || 'Pending AI detail',
        completed: stage.status === 'completed',
        expectedDays: 7, // Default timeline padding
      }));

      const newTrackerCase = {
        id: Date.now().toString(),
        sourceId: caseId,
        name: title || analysis.caseType || 'AI Generated Case Profile',
        type: 'custom',
        steps: newSteps,
        createdAt: new Date().toISOString()
      };

      trackerCases.push(newTrackerCase);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerCases));

      console.log(`🧠 Synapse: Bridged intelligence from Chat (${caseId}) to Tracker (${newTrackerCase.id})`);
    } catch (err) {
      console.error('Synapse Event Bridge Error:', err);
    }
  });
}
