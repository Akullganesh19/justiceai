import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const routeToComponentMap = {
  '/': 'LandingPage',
  '/dashboard': 'DashboardPage',
  '/chat': 'ChatPage',
  '/documents': 'DocumentsPage',
  '/rights': 'RightsPage',
  '/estimator': 'EstimatorPage',
  '/lawyers': 'LawyerFinderPage',
  '/tracker': 'CaseTrackerPage',
  '/quiz': 'LegalQuizPage',
  '/limitation': 'LimitationCalculatorPage',
  '/legal-aid': 'LegalAidCheckerPage',
  '/glossary': 'GlossaryPage',
  '/about': 'AboutPage',
  '/faq': 'FAQPage',
  '/samples': 'SamplesPage',
  '/lawyer-onboarding': 'LawyerOnboardingPage',
  '/disclaimer': 'DisclaimerPage',
  '/privacy': 'PrivacyPage',
  '/auth': 'AuthPage',
  '/showcase': 'ShowcasePage',
  '/settings': 'IntelligenceSelectionTerminal',
};

// Validate if path is a known static route to prevent injection and storage overflow
const isValidRoute = (path) => Boolean(routeToComponentMap[path]);

export default function OracleNavMesh() {
  const location = useLocation();
  const prevPathRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;

    // Always update previous path to current
    prevPathRef.current = currentPath;

    // Only process known routes to prevent malicious injection or storage corruption
    if (!isValidRoute(currentPath)) return;

    try {
      // 1. Load the navigation graph
      const storedGraph = window.localStorage.getItem('oracle_nav_graph');
      const navGraph = storedGraph ? JSON.parse(storedGraph) : {};

      // 2. Record the transition if there is a valid previous path
      if (prevPath && prevPath !== currentPath && isValidRoute(prevPath)) {
        if (!navGraph[prevPath]) {
          navGraph[prevPath] = {};
        }
        navGraph[prevPath][currentPath] = (navGraph[prevPath][currentPath] || 0) + 1;
        window.localStorage.setItem('oracle_nav_graph', JSON.stringify(navGraph));
      }

      // 3. Predict and prefetch the likely next routes
      const possibleNextRoutes = navGraph[currentPath] || {};
      const sortedPredictions = Object.entries(possibleNextRoutes)
        .sort((a, b) => b[1] - a[1]) // Sort by frequency descending
        .filter(([path]) => isValidRoute(path))
        .map(([path]) => path)
        .slice(0, 2); // Take top 2

      sortedPredictions.forEach((predictedPath) => {
        const componentName = routeToComponentMap[predictedPath];
        if (componentName) {
          // Attempt to prefetch the module chunk in the background
          import(`../pages/${componentName}.jsx`).catch(() => {});
        }
      });
    } catch (_error) {
      // Gracefully handle storage disabled, quota exceeded, or JSON parse errors
    }
  }, [location.pathname]);

  return null; // Invisible infrastructure component
}
