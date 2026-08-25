import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 🛸 Oracle: Predictive Navigation Mesh
 *
 * Anticipates user navigation via two signals:
 * 1. Historical Mesh (Markov Chain): Learns what route users visit next based on their own history.
 * 2. Intent Mesh (Hover/Touch): Prefetches when a user signals intent to click a link.
 */
export default function PredictivePrefetcher({ routeMap }) {
  const location = useLocation();
  const lastPathRef = useRef(null);

  // Update the mesh when user actually navigates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentPath = location.pathname;
    const lastPath = lastPathRef.current;

    if (lastPath && lastPath !== currentPath) {
      try {
        const meshStr = localStorage.getItem('oracle_nav_graph') || '{}';
        const mesh = JSON.parse(meshStr);

        // Initialize node if doesn't exist
        if (!mesh[lastPath]) mesh[lastPath] = {};

        // Increment weight of edge (lastPath -> currentPath)
        mesh[lastPath][currentPath] = (mesh[lastPath][currentPath] || 0) + 1;

        localStorage.setItem('oracle_nav_graph', JSON.stringify(mesh));
      } catch (_err) {
        // Silently fail on quota exceeded or corrupted data
      }
    }

    lastPathRef.current = currentPath;

    // --- Prediction Phase ---
    // Look up the most likely next routes from the current location
    try {
      const meshStr = localStorage.getItem('oracle_nav_graph');
      if (meshStr) {
        const mesh = JSON.parse(meshStr);
        const nextNodes = mesh[currentPath];

        if (nextNodes) {
          // Sort edges by weight descending
          const sortedEdges = Object.entries(nextNodes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2); // Take top 2 predictions

          for (const [predictedPath] of sortedEdges) {
             const prefetchFn = routeMap[predictedPath];
             if (prefetchFn) {
                // Execute prefetch and swallow chunk errors
                prefetchFn().catch(() => {});
             }
          }
        }
      }
    } catch (_err) {
      // Graceful degradation
    }

  }, [location.pathname, routeMap]);

  // Track immediate intent via hover/touchstart
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleIntent = (e) => {
      // Find closest anchor tag
      const anchor = e.target.closest('a');
      if (!anchor || !anchor.href) return;

      try {
        const url = new URL(anchor.href);
        // Only predict for internal links
        if (url.origin === window.location.origin) {
           const path = url.pathname;
           const prefetchFn = routeMap[path];
           if (prefetchFn) {
              prefetchFn().catch(() => {});
           }
        }
      } catch (_err) {
        // Ignore invalid URLs
      }
    };

    // Use passive listeners so main thread is not blocked
    window.addEventListener('mouseover', handleIntent, { passive: true });
    window.addEventListener('touchstart', handleIntent, { passive: true });

    return () => {
      window.removeEventListener('mouseover', handleIntent);
      window.removeEventListener('touchstart', handleIntent);
    };
  }, [routeMap]);

  return null; // Invisible infrastructure
}
