import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 🛸 Oracle: Predictive Navigation Mesh
 *
 * Tracks how users move through the app and predicts where they'll go next.
 * Prefetches the predicted routes before the user even clicks.
 */
export default function PredictiveNavigation() {
  const location = useLocation();
  const graphRef = useRef({});
  const lastPathRef = useRef(null);

  // Initialize graph from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('oracle_nav_graph');
        if (stored) {
          graphRef.current = JSON.parse(stored);
        }
      } catch (err) {
        // ignore parse error
        const _err = err;
      }
    }
  }, []);

  // Update graph on navigation
  useEffect(() => {
    // Strip dynamic parts of the path for generic prediction if needed,
    // but here we just use the raw pathname up to 2 segments to avoid bloat
    const segments = location.pathname.split('/').filter(Boolean);
    const currentPath = '/' + segments.slice(0, 2).join('/');
    const lastPath = lastPathRef.current;

    if (lastPath && lastPath !== currentPath) {
      const graph = graphRef.current;
      if (!graph[lastPath]) graph[lastPath] = {};
      graph[lastPath][currentPath] = (graph[lastPath][currentPath] || 0) + 1;

      // Prevent bloat by capping graph size
      const keys = Object.keys(graph);
      if (keys.length > 50) {
         delete graph[keys[0]];
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('oracle_nav_graph', JSON.stringify(graph));
        } catch (err) {
          // ignore quota exceeded or other storage errors
          const _err = err;
        }
      }
    }
    lastPathRef.current = currentPath;

    // Predict next likely paths from current path
    const graph = graphRef.current;
    if (graph[currentPath]) {
      const transitions = graph[currentPath];
      // Get top 2 most likely next paths
      const sortedNext = Object.entries(transitions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([path]) => path);

      sortedNext.forEach(path => {
         // Attempt to prefetch based on path
         prefetchRoute(path);
      });
    }
  }, [location.pathname]);

  // Intent-based prefetching (hover/touch)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleIntent = (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          if (url.origin === window.location.origin) {
            prefetchRoute(url.pathname);
          }
        } catch(e) {
          // ignore
          const _err = e;
        }
      }
    };

    window.addEventListener('mouseover', handleIntent, { passive: true });
    window.addEventListener('touchstart', handleIntent, { passive: true });

    return () => {
      window.removeEventListener('mouseover', handleIntent);
      window.removeEventListener('touchstart', handleIntent);
    };
  }, []);

  return null; // Invisible infrastructure
}

// Map of routes to their dynamic import functions
// In a full implementation this could be auto-generated or matched against a route manifest.
// We map the main ones based on standard Vite code-splitting pattern
function prefetchRoute(path) {
  // A simple mapping heuristic for our known lazy routes
  // This helps Vite's bundler know what chunk to fetch
  try {
    if (path === '/chat') import('../../pages/ChatPage.jsx').catch(() => {});
    else if (path === '/dashboard') import('../../pages/DashboardPage.jsx').catch(() => {});
    else if (path === '/documents') import('../../pages/DocumentsPage.jsx').catch(() => {});
    else if (path === '/estimator') import('../../pages/EstimatorPage.jsx').catch(() => {});
    else if (path === '/lawyers') import('../../pages/LawyerFinderPage.jsx').catch(() => {});
    else if (path === '/tracker') import('../../pages/CaseTrackerPage.jsx').catch(() => {});
    else if (path === '/rights') import('../../pages/RightsPage.jsx').catch(() => {});
  } catch (err) {
    const _err = err;
  }
}
