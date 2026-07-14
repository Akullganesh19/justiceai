import React, { useEffect } from 'react';
import { useToast } from './Toast';

export default function AuthAnalyticsBridge() {
  const { addToast } = useToast();

  useEffect(() => {
    const handleUserLogin = (event) => {
      const email = event.detail?.email || 'User';

      let activeCases = 0;
      let historyCount = 0;

      try {
        const savedCases = localStorage.getItem('justice_ai_case_tracker_v2');
        if (savedCases) {
          const parsedCases = JSON.parse(savedCases);
          if (Array.isArray(parsedCases)) {
            activeCases = parsedCases.length;
          }
        }
      } catch (e) {
        // Ignore parse error
      }

      try {
        const savedHistory = localStorage.getItem('justice_ai_history');
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          if (Array.isArray(parsedHistory)) {
            historyCount = parsedHistory.length;
          }
        }
      } catch (e) {
        // Ignore parse error
      }

      addToast('success', {
        title: `Welcome back, ${email}`,
        message: `Intelligence sync complete. You have ${activeCases} active cases and ${historyCount} stored chat histories available.`,
        duration: 8000,
      });

      console.log(`[Synapse Bridge] Synced Auth with Analytics. Active cases: ${activeCases}, Chat histories: ${historyCount}`);
    };

    window.addEventListener('justice-ai-user-login', handleUserLogin);
    return () => window.removeEventListener('justice-ai-user-login', handleUserLogin);
  }, [addToast]);

  return null;
}
