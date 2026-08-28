import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Map of routes to their dynamic import statements
const PREFETCH_MAP = {
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

export default function OracleNavMesh() {
  const location = useLocation();
  const prevPathRef = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname;

    // Safely load and update graph
    if (typeof window !== 'undefined' && prevPathRef.current) {
      const prevPath = prevPathRef.current;

      // Skip if we haven't actually moved
      if (prevPath !== currentPath) {
        try {
          const rawGraph = localStorage.getItem('oracle_nav_graph');
          const graph = rawGraph ? JSON.parse(rawGraph) : {};

          if (!graph[prevPath]) graph[prevPath] = {};
          graph[prevPath][currentPath] = (graph[prevPath][currentPath] || 0) + 1;

          localStorage.setItem('oracle_nav_graph', JSON.stringify(graph));

          // Now predict NEXT path based on current path
          const edges = graph[currentPath] || {};

          let mostProbableNext = null;
          let highestWeight = 0;

          for (const [nextPath, weight] of Object.entries(edges)) {
             if (weight > highestWeight) {
                 highestWeight = weight;
                 mostProbableNext = nextPath;
             }
          }

          // Prefetch if we have a prediction
          if (mostProbableNext && PREFETCH_MAP[mostProbableNext]) {
            // Predictively load the chunk. Add empty catch to swallow chunk errors
            PREFETCH_MAP[mostProbableNext]().catch(() => {});
          }
        } catch (_err) {
          // Graceful degradation on localStorage disabled or quota exceeded
        }
      }
    }

    prevPathRef.current = currentPath;
  }, [location.pathname]);

  return null; // Invisible infrastructure
}
