const CASE_TRACKER_STORAGE_KEY = 'justice_ai_case_tracker_v2';

export function initSynapse() {
  if (typeof window === 'undefined') return;

  window.addEventListener('justice-ai-analysis-completed', handleAnalysisCompleted);
}

function handleAnalysisCompleted(event) {
  const analysis = event.detail?.analysis;
  if (!analysis) return;

  try {
    // 1. Transform the AI Analysis timeline into a Case Tracker case
    const caseId = Date.now().toString();
    const caseType = analysis.caseType || 'AI Generated Case';

    // Map timeline stages to milestones
    const milestones = (analysis.timeline || []).map((stage, index) => {
      // Convert status from "completed | active | pending" to "completed | in_progress | pending"
      let status = 'pending';
      if (stage.status === 'completed') status = 'completed';
      if (stage.status === 'active') status = 'in_progress';

      return {
        id: `${caseId}-m${index}`,
        title: stage.stage || `Stage ${index + 1}`,
        description: stage.detail || '',
        date: new Date().toISOString().split('T')[0], // Use current date as placeholder
        status: status,
      };
    });

    const newCase = {
      id: caseId,
      title: `${caseType} Strategy`,
      type: 'AI_GENERATED',
      status: 'active',
      cnrNumber: '',
      court: analysis.jurisdiction || 'Jurisdiction Pending',
      nextHearing: null,
      lastUpdated: new Date().toISOString(),
      milestones: milestones,
    };

    // 2. Persist to Case Tracker's localStorage
    const saved = localStorage.getItem(CASE_TRACKER_STORAGE_KEY);
    let cases = [];
    if (saved) {
      cases = JSON.parse(saved);
    }
    cases.unshift(newCase);
    localStorage.setItem(CASE_TRACKER_STORAGE_KEY, JSON.stringify(cases));

    // 3. Emit event to notify Case Tracker UI
    const createEvent = new CustomEvent('justice-ai-case-auto-created', {
      detail: { newCase }
    });
    window.dispatchEvent(createEvent);

    console.log('[Synapse] Intelligence emerged: Case Auto-Created from AI Analysis', newCase);
  } catch (error) {
    console.error('[Synapse] Error bridging analysis to case tracker:', error);
  }
}
