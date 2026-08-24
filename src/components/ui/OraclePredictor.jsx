import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 🛸 Oracle Predictor: Predictive Navigation Mesh
 *
 * Predicts and prefetches the next likely routes a user will visit based on:
 * 1. Intent: Mouse hover or touchstart on links
 * 2. History: A Markov chain of past navigation transitions stored in localStorage
 */
// Maps route paths to their dynamic import functions
  // We use this to manually trigger Webpack/Vite chunk loading
  const routeMap = {
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
    '/settings': () => import('../../pages/IntelligenceSelectionTerminal.jsx')
  };

export default function OraclePredictor() {
  const location = useLocation();
  const prevPathRef = useRef(null);
  const prefetchedPaths = useRef(new Set());


  const prefetchRoute = useCallback((path) => {
    // Sanitize path to just the pathname (ignore query params/hashes for mapping)
    const cleanPath = path.split('?')[0].split('#')[0];

    if (prefetchedPaths.current.has(cleanPath) || !routeMap[cleanPath]) return;

    prefetchedPaths.current.add(cleanPath);
    // Trigger the dynamic import, catch and swallow chunk loading errors gracefully
    routeMap[cleanPath]().catch(() => {});
  }, []);

  // Intent-based prefetching (Hover/Touch)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleIntent = (e) => {
      const target = e.target.closest('a');
      if (target && target.href) {
        try {
          const url = new URL(target.href);
          // Only prefetch internal links
          if (url.origin === window.location.origin) {
            prefetchRoute(url.pathname);
          }
        } catch (_err) {
          // Ignore invalid URLs
        }
      }
    };

    // Use passive listeners to avoid blocking the main thread
    document.addEventListener('mouseover', handleIntent, { passive: true });
    document.addEventListener('touchstart', handleIntent, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleIntent);
      document.removeEventListener('touchstart', handleIntent);
    };
  }, [prefetchRoute]);

  // History-based prefetching (Markov Chain)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;

    if (prevPath && prevPath !== currentPath) {
      try {
        // Load graph from local storage
        const rawGraph = localStorage.getItem('oracle_nav_graph');
        const graph = rawGraph ? JSON.parse(rawGraph) : {};

        // Update transition frequency
        if (!graph[prevPath]) graph[prevPath] = {};
        graph[prevPath][currentPath] = (graph[prevPath][currentPath] || 0) + 1;

        // Keep graph size bounded (prevent unbounded localStorage growth)
        if (Object.keys(graph).length > 50) {
          const oldestKey = Object.keys(graph)[0];
          delete graph[oldestKey];
        }

        localStorage.setItem('oracle_nav_graph', JSON.stringify(graph));
      } catch (_err) {
        // Gracefully fail if quota exceeded or storage disabled
      }
    }

    prevPathRef.current = currentPath;

    // Predict next routes based on updated graph
    try {
      const rawGraph = localStorage.getItem('oracle_nav_graph');
      if (rawGraph) {
        const graph = JSON.parse(rawGraph);
        const nextTransitions = graph[currentPath];

        if (nextTransitions) {
          // Sort by frequency descending and pick top 2
          const likelyPaths = Object.entries(nextTransitions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([path]) => path);

          likelyPaths.forEach(prefetchRoute);
        }
      }
    } catch (_err) {
      // Gracefully fail on read errors
    }

  }, [location.pathname, prefetchRoute]);

  return null; // Invisible infrastructure component
}
