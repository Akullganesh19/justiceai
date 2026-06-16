import React, { useEffect } from 'react';
import { useToast } from './ui/Toast';

export default function IntelligenceBridge() {
  const { success } = useToast();

  useEffect(() => {
    const handleAnalysisComplete = (e) => {
      try {
        const { caseId, caseTitle, analysis } = e.detail;

        if (!caseId || !analysis || !analysis.timeline) {
          return;
        }

        // 1. Get existing cases
        const STORAGE_KEY = 'justice_ai_case_tracker_v2';
        const saved = localStorage.getItem(STORAGE_KEY);
        let existingCases = saved ? JSON.parse(saved) : [];

        // 2. Map AI Analysis to CaseTracker format
        const newCase = {
          id: caseId,
          typeId: analysis.caseType ? analysis.caseType.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'general',
          title: caseTitle || 'AI Analyzed Case',
          status: 'Active',
          lastUpdated: new Date().toISOString(),
          nextHearing: null, // AI might not know exact date yet
          cnr: '',
          progress: 10,
          steps: analysis.timeline.map((item, index) => ({
            id: index + 1,
            label: item.stage || 'Action Step',
            description: item.detail || '',
            completed: item.status === 'completed'
          }))
        };

        // 3. Update if exists, or add new
        const existingIndex = existingCases.findIndex(c => c.id === caseId);
        if (existingIndex >= 0) {
           // We only update if it has more steps, otherwise leave user edits alone
           if (newCase.steps.length > existingCases[existingIndex].steps.length) {
              existingCases[existingIndex] = { ...existingCases[existingIndex], steps: newCase.steps, lastUpdated: new Date().toISOString() };
           }
        } else {
           existingCases.unshift(newCase);
           // 4. Notify user of emergent intelligence only on creation
           success({
            title: "🧠 Intelligence Emerged",
            message: "AI analysis automatically generated a new timeline in your Case Tracker.",
            duration: 8000
          });
        }

        // 5. Save back
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingCases));

        // Dispatch event for UI updates within the tracker if it is open
        window.dispatchEvent(new Event('justice-ai-tracker-update'));

        console.log(`[SYNAPSE] IntelligenceBridge successfully processed incoming analysis for case: ${caseId}. Data written to Tracker.`);

      } catch (err) {
        console.error('IntelligenceBridge Error:', err);
      }
    };

    window.addEventListener('justice-ai-analysis-complete', handleAnalysisComplete);

    return () => {
      window.removeEventListener('justice-ai-analysis-complete', handleAnalysisComplete);
    };
  }, [success]);

  return null; // This is a headless component
}
