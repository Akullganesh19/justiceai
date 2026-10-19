export function syncAnalysisToTracker(caseId, title, analysis) {
  if (!analysis) return;
  try {
    const TRACKER_KEY = 'justice_ai_case_tracker_v2';
    const saved = localStorage.getItem(TRACKER_KEY);
    let trackers = saved ? JSON.parse(saved) : [];

    if (!trackers.find(t => t.id === caseId)) {
      const newTracker = {
        id: caseId,
        name: title || 'AI Strategized Case',
        caseType: 'consumer',
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
        steps: [
          {
            id: Date.now(),
            label: 'Initial AI Strategy Consultation',
            description: 'Completed AI legal strategy analysis',
            completed: true,
            completedDate: new Date().toISOString().split('T')[0],
          }
        ]
      };

      trackers.push(newTracker);
      localStorage.setItem(TRACKER_KEY, JSON.stringify(trackers));
    }
  } catch (e) {
    console.error('Failed to sync to tracker', e);
  }
}
