import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { routeImports } from '../../main.jsx';

export default function OraclePrefetcher() {
  const location = useLocation();
  const prefetchedRoutes = useRef(new Set());

  const prefetchRoute = (path) => {
    if (!path) return;

    // Normalize path to map to route keys and strip query parameters
    const cleanPath = path.split('?')[0].split('#')[0];
    const key = cleanPath === '/' ? '/' : cleanPath;

    if (prefetchedRoutes.current.has(key) || !routeImports[key]) return;

    prefetchedRoutes.current.add(key);

    // Dynamically import the chunk, swallowing any chunk loading errors
    routeImports[key]().catch(() => {});
  };

  // Behavioral Prefetch (Session Warm-up & Next Action)
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      try {
        const hasHistory = localStorage.getItem('justice_ai_history');
        if (hasHistory) {
          prefetchRoute('/chat');
        }

        const hasTracker = localStorage.getItem('justice_ai_case_tracker_v2');
        if (hasTracker) {
          prefetchRoute('/tracker');
        }
      } catch (_e) {
        // Ignore localStorage errors
      }
    }
  }, [location.pathname]);

  // Hover / Intent Prefetch
  useEffect(() => {
    const handleIntent = (e) => {
      // Look for closest anchor or explicit prefetch intent
      const target = e.target.closest('a[href], [data-prefetch-route]');
      if (!target) return;

      const path = target.getAttribute('href') || target.getAttribute('data-prefetch-route');
      if (path && path.startsWith('/')) {
        prefetchRoute(path);
      }
    };

    document.addEventListener('mouseover', handleIntent, { passive: true });
    document.addEventListener('touchstart', handleIntent, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleIntent);
      document.removeEventListener('touchstart', handleIntent);
    };
  }, []);

  return null;
}
