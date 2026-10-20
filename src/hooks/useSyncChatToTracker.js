export function exportToTracker(title, analysis) {
  const STORAGE_KEY = 'justice_ai_case_tracker_v2';
  let cases = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) cases = JSON.parse(saved);
  } catch (e) {
    console.error("Error parsing case tracker data", e);
  }

  const newSteps = (analysis?.timeline || []).map((t, index) => ({
    id: index + 1,
    label: t.stage,
    description: t.detail,
    completed: t.status === 'completed'
  }));

  const newCase = {
    id: Date.now().toString(),
    name: title || 'AI Consultation Case',
    type: analysis?.caseType || 'General Consultation',
    cnr: '',
    details: { court: '', judge: '', opponent: '' },
    steps: newSteps,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };

  cases.push(newCase);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}
