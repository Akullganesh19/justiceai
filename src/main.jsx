import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import ScrollToTop from './components/ui/ScrollToTop';
import CommandPalette from './components/ui/CommandPalette';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import FloatingVoiceButton from './components/voice/FloatingVoiceButton';
import './index.css';

const handleGlobalTranscription = (text) => {
  // Dispatch a custom event that any page (like ChatPage) can listen for
  const event = new CustomEvent('justice-ai-transcription', { detail: { text } });
  window.dispatchEvent(event);
};

const routeChunks = {
  '/': () => import('./pages/LandingPage.jsx'),
  '/dashboard': () => import('./pages/DashboardPage.jsx'),
  '/chat': () => import('./pages/ChatPage.jsx'),
  '/documents': () => import('./pages/DocumentsPage.jsx'),
  '/rights': () => import('./pages/RightsPage.jsx'),
  '/estimator': () => import('./pages/EstimatorPage.jsx'),
  '/lawyers': () => import('./pages/LawyerFinderPage.jsx'),
  '/tracker': () => import('./pages/CaseTrackerPage.jsx'),
  '/quiz': () => import('./pages/LegalQuizPage.jsx'),
  '/limitation': () => import('./pages/LimitationCalculatorPage.jsx'),
  '/legal-aid': () => import('./pages/LegalAidCheckerPage.jsx'),
  '/glossary': () => import('./pages/GlossaryPage.jsx'),
  '/about': () => import('./pages/AboutPage.jsx'),
  '/faq': () => import('./pages/FAQPage.jsx'),
  '/samples': () => import('./pages/SamplesPage.jsx'),
  '/lawyer-onboarding': () => import('./pages/LawyerOnboardingPage.jsx'),
  '/disclaimer': () => import('./pages/DisclaimerPage.jsx'),
  '/privacy': () => import('./pages/PrivacyPage.jsx'),
  '/auth': () => import('./pages/AuthPage.jsx'),
  '/showcase': () => import('./pages/ShowcasePage.jsx'),
  '/settings': () => import('./pages/IntelligenceSelectionTerminal.jsx'),
  '*': () => import('./pages/NotFoundPage.jsx')
};

// Prefetching logic
const prefetchedPaths = new Set();
const prefetchRoute = (urlPathname) => {
  for (const [key, importFn] of Object.entries(routeChunks)) {
    if (urlPathname === key || (key !== '/' && key !== '*' && urlPathname.startsWith(key + '/'))) {
      if (!prefetchedPaths.has(key)) {
        prefetchedPaths.add(key);
        importFn().catch(() => {});
      }
      break;
    }
  }
};

if (typeof window !== 'undefined') {
  const handleInteraction = (e) => {
    const target = e.target.closest('a');
    if (target && target.href) {
      try {
        const url = new URL(target.href);
        if (url.origin === window.location.origin) {
          prefetchRoute(url.pathname);
        }
      } catch (_err) {
        // invalid URL, ignore
      }
    }
  };
  document.addEventListener('mouseover', handleInteraction, { passive: true });
  document.addEventListener('touchstart', handleInteraction, { passive: true });
}

// Lazy load components
const LazyLandingPage = lazy(routeChunks['/']);
const LazyDashboardPage = lazy(routeChunks['/dashboard']);
const LazyChatPage = lazy(routeChunks['/chat']);
const LazyDocumentsPage = lazy(routeChunks['/documents']);
const LazyRightsPage = lazy(routeChunks['/rights']);
const LazyEstimatorPage = lazy(routeChunks['/estimator']);
const LazyLawyerFinderPage = lazy(routeChunks['/lawyers']);
const LazyCaseTrackerPage = lazy(routeChunks['/tracker']);
const LazyLegalQuizPage = lazy(routeChunks['/quiz']);
const LazyLimitationCalculatorPage = lazy(routeChunks['/limitation']);
const LazyLegalAidCheckerPage = lazy(routeChunks['/legal-aid']);
const LazyGlossaryPage = lazy(routeChunks['/glossary']);
const LazyAboutPage = lazy(routeChunks['/about']);
const LazyFAQPage = lazy(routeChunks['/faq']);
const LazySamplesPage = lazy(routeChunks['/samples']);
const LazyLawyerOnboardingPage = lazy(routeChunks['/lawyer-onboarding']);
const LazyDisclaimerPage = lazy(routeChunks['/disclaimer']);
const LazyPrivacyPage = lazy(routeChunks['/privacy']);
const LazyAuthPage = lazy(routeChunks['/auth']);
const LazyShowcasePage = lazy(routeChunks['/showcase']);
const LazySettingsPage = lazy(routeChunks['/settings']);
const LazyNotFoundPage = lazy(routeChunks['*']);

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center space-y-6 font-mono">
      <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-sm animate-spin shadow-luxe" />
      <p className="text-[10px] text-gold font-extrabold uppercase tracking-[0.4em] animate-pulse italic">
        INITIALIZING_SYSTEM_CORE...
      </p>
    </div>
  );
}

const AppLayout = () => {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollToTop />
      <CommandPalette />
      <FloatingVoiceButton onTranscription={handleGlobalTranscription} />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <LazyLandingPage /> },
      { path: 'dashboard', element: <LazyDashboardPage /> },
      { path: 'chat', element: <LazyChatPage /> },
      { path: 'documents', element: <LazyDocumentsPage /> },
      { path: 'rights', element: <LazyRightsPage /> },
      { path: 'estimator', element: <LazyEstimatorPage /> },
      { path: 'lawyers', element: <LazyLawyerFinderPage /> },
      { path: 'tracker', element: <LazyCaseTrackerPage /> },
      { path: 'quiz', element: <LazyLegalQuizPage /> },
      { path: 'limitation', element: <LazyLimitationCalculatorPage /> },
      { path: 'legal-aid', element: <LazyLegalAidCheckerPage /> },
      { path: 'glossary', element: <LazyGlossaryPage /> },
      { path: 'about', element: <LazyAboutPage /> },
      { path: 'faq', element: <LazyFAQPage /> },
      { path: 'samples', element: <LazySamplesPage /> },
      { path: 'lawyer-onboarding', element: <LazyLawyerOnboardingPage /> },
      { path: 'disclaimer', element: <LazyDisclaimerPage /> },
      { path: 'privacy', element: <LazyPrivacyPage /> },
      { path: 'auth', element: <LazyAuthPage /> },
      { path: 'showcase', element: <LazyShowcasePage /> },
      { path: 'settings', element: <LazySettingsPage /> },
      { path: '*', element: <LazyNotFoundPage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
