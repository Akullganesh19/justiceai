import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PredictiveNavigationMesh
 *
 * An invisible Oracle component that observes navigation behavior and uses it to
 * predict and prefetch the user's NEXT likely destination before they even ask.
 *
 * Capability 1: Intent Pre-fetching (Hover/TouchStart tracking)
 * Capability 2: Behavioral Pre-fetching (Based on historical sequence graph)
 */
export default function PredictiveNavigationMesh() {
  const location = useLocation();
  const currentPath = location.pathname;
  const lastPathRef = useRef(null);

  // Define route to component mapping for dynamic import prefetching
  const routeMap = useMemo(() => ({
    '/': () => import('../../pages/LandingPage.jsx'),
    '/dashboard': () => import('../../pages/DashboardPage.jsx'),
    '/chat': () => import('../../pages/ChatPage.jsx'),
    '/documents': () => import('../../pages/DocumentsPage.jsx'),
    '/rights': () => import('../../pages/RightsPage.jsx'),
    '/estimator': () => import('../../pages/EstimatorPage.jsx'),
    '/lawyers': () => import('../../pages/LawyerFinderPage.jsx'),
    '/tracker': () => import('../../pages/CaseTrackerPage.jsx'),
    '/quiz': () => import('../../pages/LegalQuizPage.jsx'),
    '/limitation': () => import('../../pages/LimitationCalculatorPage.jsx'),
    '/legal-aid': () => import('../../pages/LegalAidCheckerPage.jsx'),
    '/glossary': () => import('../../pages/GlossaryPage.jsx'),
    '/about': () => import('../../pages/AboutPage.jsx'),
    '/faq': () => import('../../pages/FAQPage.jsx'),
    '/samples': () => import('../../pages/SamplesPage.jsx'),
    '/lawyer-onboarding': () => import('../../pages/LawyerOnboardingPage.jsx'),
    '/disclaimer': () => import('../../pages/DisclaimerPage.jsx'),
    '/privacy': () => import('../../pages/PrivacyPage.jsx'),
    '/auth': () => import('../../pages/AuthPage.jsx'),
    '/showcase': () => import('../../pages/ShowcasePage.jsx'),
    '/settings': () => import('../../pages/IntelligenceSelectionTerminal.jsx'),
  }), []);

  const prefetchRoute = useCallback((path) => {
    if (routeMap[path]) {
      console.debug(`[Oracle] Prefetching predicted route: ${path}`);
      // Start fetching the chunk, swallow errors gracefully if it fails (e.g. offline)
      routeMap[path]().catch(() => {});
    }
  }, [routeMap]);

  // 1. Behavioral Prediction Engine (Sequence Graph tracking)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const graphStr = localStorage.getItem('oracle_nav_graph') || '{}';
      const graph = JSON.parse(graphStr);

      const lastPath = lastPathRef.current;

      // Update graph if we navigated from somewhere
      if (lastPath && lastPath !== currentPath) {
        if (!graph[lastPath]) graph[lastPath] = {};
        if (!graph[lastPath][currentPath]) graph[lastPath][currentPath] = 0;

        graph[lastPath][currentPath] += 1;

        // Save updated knowledge
        localStorage.setItem('oracle_nav_graph', JSON.stringify(graph));
      }

      // Predict NEXT action based on current context
      const currentTransitions = graph[currentPath];
      if (currentTransitions) {
        // Find highest probability next step
        const nextLikely = Object.entries(currentTransitions)
          .sort((a, b) => b[1] - a[1])[0];

        if (nextLikely && nextLikely[1] >= 2) { // Need at least 2 occurrences to establish a pattern
          const predictedPath = nextLikely[0];
          // Pre-load the predicted next page
          prefetchRoute(predictedPath);
        }
      }

      lastPathRef.current = currentPath;
    } catch (_e) {
      // Degrade gracefully if localStorage is unavailable or corrupted
    }
  }, [currentPath, prefetchRoute]); // Re-run when path changes

  // 2. Intent Prediction Engine (Hover/Touch Tracking)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Watch for hovering over anchors that point to internal routes
    const handleMouseOver = (e) => {
      const anchor = e.target.closest('a');
      if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
        const url = new URL(anchor.href);
        if (url.pathname !== currentPath) {
          prefetchRoute(url.pathname);
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('touchstart', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('touchstart', handleMouseOver);
    };
  }, [currentPath, prefetchRoute]);

  // The Oracle is invisible
  return null;
}
