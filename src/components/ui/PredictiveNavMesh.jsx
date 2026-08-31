import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

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
  '/settings': () => import('../../pages/IntelligenceSelectionTerminal.jsx'),
};

const STORAGE_KEY = 'oracle_nav_graph';

export default function PredictiveNavMesh() {
  const location = useLocation();
  const prevPathRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;

    let graph = {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        graph = JSON.parse(stored);
      }
    } catch (_err) {
      // Ignore storage errors
    }

    // Update graph with the transition
    if (prevPath && prevPath !== currentPath) {
      if (!graph[prevPath]) {
        graph[prevPath] = {};
      }
      graph[prevPath][currentPath] = (graph[prevPath][currentPath] || 0) + 1;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
      } catch (_err) {
        // Ignore quota exceeded or storage disabled
      }
    }

    // Predict next most likely route
    const transitions = graph[currentPath] || {};
    let likelyNextPath = null;
    let maxCount = 0;

    for (const [nextPath, count] of Object.entries(transitions)) {
      if (count > maxCount) {
        maxCount = count;
        likelyNextPath = nextPath;
      }
    }

    // Prefetch the predicted route
    if (likelyNextPath && PREFETCH_MAP[likelyNextPath]) {
      PREFETCH_MAP[likelyNextPath]().catch(() => {});
    }

    prevPathRef.current = currentPath;
  }, [location.pathname]);

  return null;
}
