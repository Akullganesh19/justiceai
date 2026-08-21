import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 🛸 Oracle Predictor: Predictive Navigation Mesh
 * Anticipates user navigation via Markov chains (behavioral history) and pointer events (hover/touch),
 * then proactively preloads React chunks so the next route is instantly available.
 */
export default function OraclePredictor({ chunks = {} }) {
  const location = useLocation();
  const historyGraphRef = useRef({});
  const lastPathRef = useRef(null);

  // Predictive Engine (Markov Chain)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // 1. Load historical behavior graph
      const savedGraph = localStorage.getItem('oracle_nav_graph');
      if (savedGraph) {
        historyGraphRef.current = JSON.parse(savedGraph);
      }

      const currentPath = location.pathname;
      const prevPath = lastPathRef.current;

      // 2. Update graph with this transition
      if (prevPath && prevPath !== currentPath) {
        const graph = historyGraphRef.current;
        if (!graph[prevPath]) graph[prevPath] = {};
        graph[prevPath][currentPath] = (graph[prevPath][currentPath] || 0) + 1;

        // Save back to storage
        localStorage.setItem('oracle_nav_graph', JSON.stringify(graph));
      }

      lastPathRef.current = currentPath;

      // 3. Predict & Prefetch next likely routes
      const currentTransitions = historyGraphRef.current[currentPath];
      if (currentTransitions) {
        // Find top 2 most likely next paths
        const likelyPaths = Object.entries(currentTransitions)
          .sort((a, b) => b[1] - a[1]) // sort by frequency descending
          .slice(0, 2)
          .map(([path]) => path);

        likelyPaths.forEach(path => {
          // Find matching chunk and execute import() to prefetch
          for (const [key, importFn] of Object.entries(chunks)) {
            // Very simple route matching: exact or prefix (e.g., path: /chat, key: /chat)
            if (path === key || (key !== '/' && path.startsWith(key + '/'))) {
              importFn().catch(() => {}); // gracefully swallow chunk loading errors
              break;
            }
          }
        });
      }
    } catch (_err) {
      // Oracle degrades gracefully silently
      console.warn('Oracle prediction engine failed:', _err);
    }
  }, [location, chunks]);

  // Intent Prefetching (Hover/Touch)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleIntent = (e) => {
      // Find closest anchor tag
      const anchor = e.target.closest('a');
      if (!anchor || !anchor.href) return;

      try {
        const url = new URL(anchor.href);
        // Only prefetch internal routes
        if (url.origin === window.location.origin) {
          const path = url.pathname;

          for (const [key, importFn] of Object.entries(chunks)) {
            if (path === key || (key !== '/' && path.startsWith(key + '/'))) {
              importFn().catch(() => {});
              break;
            }
          }
        }
      } catch (_err) {
        // Ignore parsing errors
      }
    };

    // Use passive listeners to not block rendering/scrolling
    window.addEventListener('mouseover', handleIntent, { passive: true });
    window.addEventListener('touchstart', handleIntent, { passive: true });

    return () => {
      window.removeEventListener('mouseover', handleIntent);
      window.removeEventListener('touchstart', handleIntent);
    };
  }, [chunks]);

  return null; // Invisible infrastructure
}
