export function initSynapse() {
  console.log('[Synapse] Initializing cross-system intelligence pathways...');

  // Pathway: Chat Analysis (System A) -> Case Tracker (System B)
  // Intelligence Emerged: AI-generated timelines automatically create tracking boards
  const handleAnalysisGenerated = (e) => {
    console.log('[Synapse] Received analysis generated event, bridging to Case Tracker', e.detail);
    const { caseId, title, analysis } = e.detail;

    if (!analysis?.timeline || !Array.isArray(analysis.timeline) || analysis.timeline.length === 0) {
      return;
    }

    try {
      const STORAGE_KEY = 'justice_ai_case_tracker_v2';
      const existingData = localStorage.getItem(STORAGE_KEY);
      const cases = existingData ? JSON.parse(existingData) : [];

      const existingCaseIndex = cases.findIndex(c => c.id === caseId);

      if (existingCaseIndex === -1) {
        const newSteps = analysis.timeline.map((t, idx) => ({
          id: Date.now() + idx,
          label: t.stage || `Phase ${idx + 1}`,
          description: t.detail || '',
          completed: t.status === 'completed',
          expectedDays: 14,
          expectedDate: '',
          completedDate: t.status === 'completed' ? new Date().toISOString().split('T')[0] : ''
        }));

        const newCase = {
          id: caseId,
          type: 'ai-generated',
          title: `AI Tracked: ${title || 'Legal Analysis'}`,
          cnr: '',
          filingDate: new Date().toISOString().split('T')[0],
          steps: newSteps,
        };
        cases.push(newCase);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
        console.log('[Synapse] Successfully bridged new analysis to Case Tracker');

        // Optional: Notify other systems (e.g. Dashboard) that tracker was updated
        window.dispatchEvent(new CustomEvent('justice-ai-tracker-updated'));
      } else {
        console.log('[Synapse] Case already exists in Tracker, preserving user modifications');
      }
    } catch (err) {
      console.error('[Synapse] Neural pathway failed', err);
    }
  };

  window.addEventListener('justice-ai-analysis-generated', handleAnalysisGenerated);

  // Return cleanup function
  return () => {
    window.removeEventListener('justice-ai-analysis-generated', handleAnalysisGenerated);
  };
}
