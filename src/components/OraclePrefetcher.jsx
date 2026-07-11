import { useEffect } from 'react';

const routeImports = {
  '/': () => import('../pages/LandingPage.jsx'),
  '/dashboard': () => import('../pages/DashboardPage.jsx'),
  '/chat': () => import('../pages/ChatPage.jsx'),
  '/documents': () => import('../pages/DocumentsPage.jsx'),
  '/rights': () => import('../pages/RightsPage.jsx'),
  '/estimator': () => import('../pages/EstimatorPage.jsx'),
  '/lawyers': () => import('../pages/LawyerFinderPage.jsx'),
  '/tracker': () => import('../pages/CaseTrackerPage.jsx'),
  '/quiz': () => import('../pages/LegalQuizPage.jsx'),
  '/limitation': () => import('../pages/LimitationCalculatorPage.jsx'),
  '/legal-aid': () => import('../pages/LegalAidCheckerPage.jsx'),
  '/glossary': () => import('../pages/GlossaryPage.jsx'),
  '/about': () => import('../pages/AboutPage.jsx'),
  '/faq': () => import('../pages/FAQPage.jsx'),
  '/samples': () => import('../pages/SamplesPage.jsx'),
  '/lawyer-onboarding': () => import('../pages/LawyerOnboardingPage.jsx'),
  '/disclaimer': () => import('../pages/DisclaimerPage.jsx'),
  '/privacy': () => import('../pages/PrivacyPage.jsx'),
  '/auth': () => import('../pages/AuthPage.jsx'),
  '/showcase': () => import('../pages/ShowcasePage.jsx'),
  '/settings': () => import('../pages/IntelligenceSelectionTerminal.jsx'),
};

export default function OraclePrefetcher() {
  useEffect(() => {
    // 1. Predictive Hover: Prefetch component chunks on link hover
    const handleMouseOver = (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          // Only prefetch same-origin routes
          if (url.origin === window.location.origin) {
            const path = url.pathname;
            if (routeImports[path]) {
              routeImports[path]().catch(() => {}); // Append catch to swallow chunk errors
            }
          }
        } catch (err) {
          // Ignore invalid URLs
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    // 2. Behavioral Warmup: If user has history/data, pre-load frequently accessed heavy routes
    const hasHistory = localStorage.getItem('justice_ai_history');
    const hasCases = localStorage.getItem('justice_ai_case_tracker_v2');

    if (hasCases) {
      routeImports['/tracker']?.().catch(() => {});
    }
    if (hasHistory) {
      routeImports['/dashboard']?.().catch(() => {});
      routeImports['/chat']?.().catch(() => {});
    }

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return null;
}
