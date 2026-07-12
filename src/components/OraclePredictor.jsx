import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Maps routes to their dynamic import statements
const routePreloaders = {
  '/chat': () => import('../pages/ChatPage.jsx').catch(() => {}),
  '/dashboard': () => import('../pages/DashboardPage.jsx').catch(() => {}),
  '/documents': () => import('../pages/DocumentsPage.jsx').catch(() => {}),
  '/rights': () => import('../pages/RightsPage.jsx').catch(() => {}),
  '/estimator': () => import('../pages/EstimatorPage.jsx').catch(() => {}),
  '/lawyers': () => import('../pages/LawyerFinderPage.jsx').catch(() => {}),
  '/tracker': () => import('../pages/CaseTrackerPage.jsx').catch(() => {}),
  '/quiz': () => import('../pages/LegalQuizPage.jsx').catch(() => {}),
  '/limitation': () => import('../pages/LimitationCalculatorPage.jsx').catch(() => {}),
  '/legal-aid': () => import('../pages/LegalAidCheckerPage.jsx').catch(() => {}),
  '/glossary': () => import('../pages/GlossaryPage.jsx').catch(() => {}),
  '/about': () => import('../pages/AboutPage.jsx').catch(() => {}),
  '/faq': () => import('../pages/FAQPage.jsx').catch(() => {}),
  '/samples': () => import('../pages/SamplesPage.jsx').catch(() => {}),
  '/lawyer-onboarding': () => import('../pages/LawyerOnboardingPage.jsx').catch(() => {}),
  '/disclaimer': () => import('../pages/DisclaimerPage.jsx').catch(() => {}),
  '/privacy': () => import('../pages/PrivacyPage.jsx').catch(() => {}),
  '/auth': () => import('../pages/AuthPage.jsx').catch(() => {}),
  '/showcase': () => import('../pages/ShowcasePage.jsx').catch(() => {}),
  '/settings': () => import('../pages/IntelligenceSelectionTerminal.jsx').catch(() => {}),
};

// Transition matrix representing likely next routes based on current path
const routePredictions = {
  '/': ['/dashboard', '/auth'],
  '/dashboard': ['/chat', '/tracker', '/documents'],
  '/chat': ['/dashboard', '/documents', '/tracker'],
  '/documents': ['/dashboard', '/chat'],
  '/rights': ['/dashboard'],
  '/tracker': ['/dashboard', '/chat'],
  '/lawyers': ['/dashboard'],
};

/**
 * 🛸 Oracle Predictor
 * Anticipates the user's next navigation action and prefetches route chunks in the background.
 * Predicts based on transition probability and user history data.
 */
export default function OraclePredictor() {
  const location = useLocation();
  const prefetched = useRef(new Set());

  useEffect(() => {
    const currentPath = location.pathname;
    let nextLikelyPaths = routePredictions[currentPath] ? [...routePredictions[currentPath]] : [];

    // Intelligent State Prediction: Analyze past behavior to adjust next route
    try {
      const historyStr = localStorage.getItem('justice_ai_history');
      if (historyStr) {
        const history = JSON.parse(historyStr);
        // If the user has active conversation history and lands on dashboard,
        // they are highly likely to resume their chat or view tracker.
        if (Array.isArray(history) && history.length > 0 && currentPath === '/dashboard') {
          nextLikelyPaths.unshift('/chat', '/tracker');
        }
      }
    } catch (e) {
      // Gracefully degrade when prediction logic fails (e.g., malformed storage)
    }

    // Deduplicate and filter out already-prefetched routes
    const pathsToFetch = [...new Set(nextLikelyPaths)].filter(p => !prefetched.current.has(p));

    pathsToFetch.forEach(path => {
      const preloader = routePreloaders[path];
      if (preloader) {
        const prefetch = () => {
          preloader();
          prefetched.current.add(path);
        };

        // Execute during idle time to ensure no main thread blocking
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(prefetch);
        } else {
          setTimeout(prefetch, 500);
        }
      }
    });
  }, [location.pathname]);

  return null;
}
