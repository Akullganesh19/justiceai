import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Map paths to their import functions to allow programmatic prefetching
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

export default function PredictiveNavMesh() {
  const location = useLocation();
  const lastPath = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentPath = location.pathname;

    // Validate and sanitize path to prevent injection
    const isValidPath = Object.prototype.hasOwnProperty.call(routeMap, currentPath);
    const wasValidPath = lastPath.current && Object.prototype.hasOwnProperty.call(routeMap, lastPath.current);

    // 1. Record transition in navigation graph
    if (lastPath.current && lastPath.current !== currentPath && isValidPath && wasValidPath) {
      try {
        const rawGraph = localStorage.getItem('oracle_nav_graph');
        const graph = rawGraph ? JSON.parse(rawGraph) : {};

        if (!graph[lastPath.current]) {
          graph[lastPath.current] = {};
        }

        // Increment weight of this route transition
        graph[lastPath.current][currentPath] = (graph[lastPath.current][currentPath] || 0) + 1;

        localStorage.setItem('oracle_nav_graph', JSON.stringify(graph));
      } catch (_err) {
        // Gracefully handle QuotaExceededError or disabled storage
      }
    }

    lastPath.current = currentPath;

    // 2. Predict next route and prefetch
    if (isValidPath) {
      try {
        const rawGraph = localStorage.getItem('oracle_nav_graph');
        if (rawGraph) {
          const graph = JSON.parse(rawGraph);
          const transitions = graph[currentPath];

          if (transitions) {
            // Find most likely next route based on historical weights
            let bestNextRoute = null;
            let maxCount = 0;

            for (const [route, count] of Object.entries(transitions)) {
              if (count > maxCount && Object.prototype.hasOwnProperty.call(routeMap, route)) {
                bestNextRoute = route;
                maxCount = count;
              }
            }

            // Prefetch the best predicted route
            if (bestNextRoute) {
              const prefetchFn = routeMap[bestNextRoute];
              if (typeof prefetchFn === 'function') {
                // Execute import and swallow any chunk loading errors
                prefetchFn().catch(() => {});
              }
            }
          }
        }
      } catch (_err) {
        // Silently degrade if parsing/prefetching fails
      }
    }
  }, [location.pathname]);

  return null;
}
