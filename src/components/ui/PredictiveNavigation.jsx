import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

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
  '/settings': () => import('../../pages/IntelligenceSelectionTerminal.jsx'),
};

const sanitizePath = (path) => {
  if (routeMap[path]) {
    return path;
  }
  return null;
};

export default function PredictiveNavigation() {
  const location = useLocation();
  const prevPathRef = useRef(null);

  useEffect(() => {
    const currentPath = sanitizePath(location.pathname);
    if (!currentPath) return;

    try {
      let graph = {};
      const stored = localStorage.getItem('oracle_nav_graph');
      if (stored) {
        graph = JSON.parse(stored);
      }

      const prevPath = prevPathRef.current;
      if (prevPath && prevPath !== currentPath) {
        if (!graph[prevPath]) {
          graph[prevPath] = {};
        }
        if (!graph[prevPath][currentPath]) {
          graph[prevPath][currentPath] = 0;
        }
        graph[prevPath][currentPath] += 1;

        localStorage.setItem('oracle_nav_graph', JSON.stringify(graph));
      }

      const transitions = graph[currentPath] || {};
      const likelyNextRoutes = Object.entries(transitions)
        .sort((a, b) => b[1] - a[1])
        .map(([path]) => path)
        .slice(0, 2);

      likelyNextRoutes.forEach((predictedPath) => {
        const importFunc = routeMap[predictedPath];
        if (importFunc) {
          importFunc().catch(() => {});
        }
      });

      prevPathRef.current = currentPath;

    } catch (_err) {
      console.warn('Predictive navigation storage unavailable.');
    }
  }, [location.pathname]);

  return null;
}
