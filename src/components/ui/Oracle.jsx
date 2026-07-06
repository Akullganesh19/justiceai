import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PREFETCH_MAP } from '../../main.jsx';

export default function Oracle() {
  const location = useLocation();

  useEffect(() => {
    try {
      // Get the existing history of navigation
      const historyStr = localStorage.getItem('justice_ai_nav_history');
      let navHistory = historyStr ? JSON.parse(historyStr) : [];

      // Update history with current path
      navHistory.push(location.pathname);
      // Keep only last 50 transitions
      if (navHistory.length > 50) navHistory.shift();
      localStorage.setItem('justice_ai_nav_history', JSON.stringify(navHistory));

      // Calculate transition probabilities
      const transitions = {};
      for (let i = 0; i < navHistory.length - 1; i++) {
        if (navHistory[i] === location.pathname) {
          const next = navHistory[i + 1];
          transitions[next] = (transitions[next] || 0) + 1;
        }
      }

      // Find the most likely next route
      let mostLikelyRoute = null;
      let maxCount = 0;
      for (const [route, count] of Object.entries(transitions)) {
        if (count > maxCount && route !== location.pathname) {
          maxCount = count;
          mostLikelyRoute = route;
        }
      }

      // If we don't have enough history, fallback to a smart default based on the current page
      if (!mostLikelyRoute || maxCount < 2) {
        if (location.pathname === '/') mostLikelyRoute = '/dashboard';
        else if (location.pathname === '/dashboard') mostLikelyRoute = '/chat';
        else if (location.pathname === '/documents') mostLikelyRoute = '/chat';
        else if (location.pathname === '/rights') mostLikelyRoute = '/chat';
      }

      // Prefetch the module if it exists in the map
      if (mostLikelyRoute && PREFETCH_MAP[mostLikelyRoute]) {
        console.log(`[Oracle] Predicting next route: ${mostLikelyRoute}, prefetching module.`);
        PREFETCH_MAP[mostLikelyRoute]();
      }
    } catch (e) {
      console.error('[Oracle] Prediction engine error:', e);
    }
  }, [location.pathname]);

  // Invisible, background component
  return null;
}
