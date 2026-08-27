import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const routeImportMap = {
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
  const previousPathRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentPath = location.pathname;
    const previousPath = previousPathRef.current;

    try {
      // 1. Update the Markov chain if we have a previous path
      const savedGraph = localStorage.getItem('oracle_nav_graph');
      const graph = savedGraph ? JSON.parse(savedGraph) : {};

      if (previousPath && previousPath !== currentPath) {
        if (!graph[previousPath]) {
          graph[previousPath] = {};
        }

        graph[previousPath][currentPath] = (graph[previousPath][currentPath] || 0) + 1;
        localStorage.setItem('oracle_nav_graph', JSON.stringify(graph));
      }

      // 2. Predict the most likely NEXT route based on current path
      const transitions = graph[currentPath];
      if (transitions) {
        let bestNextRoute = null;
        let maxCount = 0;

        for (const [nextRoute, count] of Object.entries(transitions)) {
          if (count > maxCount) {
            maxCount = count;
            bestNextRoute = nextRoute;
          }
        }

        // 3. Prefetch the predicted route
        if (bestNextRoute && routeImportMap[bestNextRoute]) {
          // Fire and forget, catching any chunk loading errors
          routeImportMap[bestNextRoute]().catch(() => {});
        }
      }
    } catch (_err) {
      // Gracefully degrade on localStorage quota exceeded or disabled
    }

    // Update ref for next transition
    previousPathRef.current = currentPath;
  }, [location.pathname]);

  return null; // Invisible component
}
