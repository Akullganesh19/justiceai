import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Mapping of paths to their dynamic import functions for prefetching
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

// Validate paths to prevent injection or invalid lookups
const isValidPath = (path) => typeof path === 'string' && path.startsWith('/') && path.length <= 100;

export default function PredictiveNav() {
  const location = useLocation();
  const lastPath = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentPath = location.pathname;
    const prevPath = lastPath.current;

    // Only process valid paths
    if (!isValidPath(currentPath)) return;

    lastPath.current = currentPath;

    if (!prevPath || prevPath === currentPath || !isValidPath(prevPath)) return;

    try {
      // Load the navigation graph
      const rawGraph = localStorage.getItem('oracle_nav_graph');
      let graph = {};
      if (rawGraph) {
        try {
          graph = JSON.parse(rawGraph);
        } catch (_err) {
          graph = {};
        }
      }

      // Update the graph with the transition
      if (!graph[prevPath]) graph[prevPath] = {};
      graph[prevPath][currentPath] = (graph[prevPath][currentPath] || 0) + 1;

      // Keep storage bounded to prevent bloat (keep top 100 paths)
      const paths = Object.keys(graph);
      if (paths.length > 100) {
        delete graph[paths[0]];
      }

      localStorage.setItem('oracle_nav_graph', JSON.stringify(graph));

      // Predict next route based on current path
      const transitions = graph[currentPath];
      if (transitions) {
        // Find most likely next route
        let likelyNext = null;
        let maxCount = 0;
        for (const [nextPath, count] of Object.entries(transitions)) {
          if (count > maxCount && isValidPath(nextPath)) {
            maxCount = count;
            likelyNext = nextPath;
          }
        }

        // Prefetch if we have a match
        if (likelyNext && routeMap[likelyNext]) {
          console.log(`[Oracle] Predicting user will visit ${likelyNext} next. Prefetching...`);
          routeMap[likelyNext]().catch(() => {});
        }
      }
    } catch (_err) {
      // Gracefully degrade if localStorage is blocked or full
    }
  }, [location.pathname]);

  return null;
}
