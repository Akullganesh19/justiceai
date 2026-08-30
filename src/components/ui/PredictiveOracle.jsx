import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 🛸 Oracle: Predictive Nav Mesh
 *
 * What: Anticipates user navigation based on real-time behavior and global history,
 *       and prefetches the most likely next routes.
 *
 * Why: To eliminate perceived loading time by having the next page already loaded
 *      before the user even clicks.
 */

const getNavGraph = () => {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem('oracle_nav_graph');
    return data ? JSON.parse(data) : {};
  } catch (_err) {
    return {};
  }
};

const saveNavGraph = (graph) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('oracle_nav_graph', JSON.stringify(graph));
  } catch (_err) {
  }
};

const prefetchedRoutes = new Set();

const routeMap = {
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

const PredictiveOracle = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const previousPath = sessionStorage.getItem('oracle_last_path');
    const currentPath = location.pathname;

    if (previousPath && previousPath !== currentPath) {
      const graph = getNavGraph();
      if (!graph[previousPath]) {
        graph[previousPath] = {};
      }
      graph[previousPath][currentPath] = (graph[previousPath][currentPath] || 0) + 1;
      saveNavGraph(graph);
    }

    sessionStorage.setItem('oracle_last_path', currentPath);

    const predictAndPrefetch = async () => {
      const graph = getNavGraph();
      const nextRoutes = graph[currentPath];

      if (!nextRoutes) return;

      let mostLikelyRoute = null;
      let maxCount = 0;

      for (const [route, count] of Object.entries(nextRoutes)) {
        if (count > maxCount) {
          maxCount = count;
          mostLikelyRoute = route;
        }
      }

      if (mostLikelyRoute && !prefetchedRoutes.has(mostLikelyRoute)) {
        if (routeMap[mostLikelyRoute]) {
          console.log(`🛸 Oracle predicting next route: ${mostLikelyRoute}`);
          try {
            routeMap[mostLikelyRoute]().catch(() => {});
            prefetchedRoutes.add(mostLikelyRoute);
          } catch (_err) {
          }
        }
      }
    };

    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
    idleCallback(predictAndPrefetch);

    const handleMouseOver = (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          if (url.origin === window.location.origin) {
             const path = url.pathname;
              if (routeMap[path] && !prefetchedRoutes.has(path)) {
                 routeMap[path]().catch(() => {});
                 prefetchedRoutes.add(path);
              }
          }
        } catch (_err) {
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [location.pathname]);

  return null;
};

export default PredictiveOracle;
