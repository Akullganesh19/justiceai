import React, { useEffect } from 'react';
import { useToast } from './ui/Toast';

export function IntelligenceBridge() {
  const { success } = useToast();

  useEffect(() => {
    const handleAnalysisComplete = (e) => {
      const { id, title, caseType, timeline } = e.detail;

      try {
        const STORAGE_KEY = 'justice_ai_case_tracker_v2';
        const saved = localStorage.getItem(STORAGE_KEY);
        let cases = saved ? JSON.parse(saved) : [];

        const existingIndex = cases.findIndex(c => c.id === id);

        const steps = timeline.map((t, idx) => ({
          id: idx + 1,
          label: t.stage || 'Pending Stage',
          description: t.detail || '',
          completed: t.status === 'completed',
          completedDate: t.status === 'completed' ? new Date().toISOString().split('T')[0] : ''
        }));

        if (existingIndex >= 0) {
          cases[existingIndex].steps = steps;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
        } else {
          cases.push({
            id: id,
            name: title ? title.trim() + " (AI Sync)" : "AI Auto-Tracked Case",
            caseType: caseType || 'General Legal',
            steps: steps,
            createdAt: new Date().toISOString(),
            details: {
              caseNumber: 'AI-' + id.substring(0, 6),
              courtName: 'Pending Filing',
              bench: '',
              advocateName: 'AI Co-Pilot',
              advocatePhone: '',
              oppositeParty: '',
              nextHearing: '',
            }
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));

          success({
            title: 'Synapse Connection Active',
            message: 'AI has automatically synced your case timeline to the Case Tracker.'
          });
        }
      } catch (err) {
        console.error('Synapse Bridge Error:', err);
      }
    };

    window.addEventListener('justice-ai-analysis-complete', handleAnalysisComplete);
    return () => window.removeEventListener('justice-ai-analysis-complete', handleAnalysisComplete);
  }, [success]);

  return null;
}
