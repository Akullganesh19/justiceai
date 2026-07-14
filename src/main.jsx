import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LoadingSpinner from './components/ui/LoadingSpinner';
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

// Oracle: Map of lazy-loaded chunks for predictive prefetching
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

// 🛸 Oracle Predictive Engine: Prefetch route chunks on hover or focus
// We track which routes have been prefetched to avoid redundant dynamic imports
const prefetchedRoutes = new Set();
const handlePredictivePrefetch = (e) => {
  const target = e.target.closest('a');
  if (!target || !target.href) return;

  try {
    const url = new URL(target.href);
    if (url.origin === window.location.origin) {
      let path = url.pathname;
      // Normalise trailing slash unless it's just '/'
      if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      const chunkLoader = routeChunks[path];
      if (chunkLoader && !prefetchedRoutes.has(path)) {
        prefetchedRoutes.add(path);
        chunkLoader().catch(() => {});
      }
    }
  } catch (_err) {
    // Ignore invalid URLs
  }
};

// Listen globally for intent to navigate
if (typeof window !== 'undefined') {
  window.addEventListener('mouseover', handlePredictivePrefetch, { passive: true });
  window.addEventListener('touchstart', handlePredictivePrefetch, { passive: true });
  window.addEventListener('focusin', handlePredictivePrefetch, { passive: true });
}

// Lazy-loaded pages for optimal bundle splitting
const LandingPage = lazy(routeChunks['/']);
const ChatPage = lazy(routeChunks['/chat']);
const AboutPage = lazy(routeChunks['/about']);
const FAQPage = lazy(routeChunks['/faq']);
const SamplesPage = lazy(routeChunks['/samples']);
const DocumentsPage = lazy(routeChunks['/documents']);
const RightsPage = lazy(routeChunks['/rights']);
const EstimatorPage = lazy(routeChunks['/estimator']);
const LawyerFinderPage = lazy(routeChunks['/lawyers']);
const CaseTrackerPage = lazy(routeChunks['/tracker']);
const LegalQuizPage = lazy(routeChunks['/quiz']);
const LimitationCalculatorPage = lazy(routeChunks['/limitation']);
const LegalAidCheckerPage = lazy(routeChunks['/legal-aid']);
const DashboardPage = lazy(routeChunks['/dashboard']);
const GlossaryPage = lazy(routeChunks['/glossary']);
const LawyerOnboardingPage = lazy(routeChunks['/lawyer-onboarding']);
const DisclaimerPage = lazy(routeChunks['/disclaimer']);
const PrivacyPage = lazy(routeChunks['/privacy']);
const AuthPage = lazy(routeChunks['/auth']);
const ShowcasePage = lazy(routeChunks['/showcase']);
const IntelligenceSelectionTerminal = lazy(routeChunks['/settings']);
const NotFoundPage = lazy(routeChunks['*']);

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

const Layout = () => (
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/chat', element: <ChatPage /> },
      { path: '/documents', element: <DocumentsPage /> },
      { path: '/rights', element: <RightsPage /> },
      { path: '/estimator', element: <EstimatorPage /> },
      { path: '/lawyers', element: <LawyerFinderPage /> },
      { path: '/tracker', element: <CaseTrackerPage /> },
      { path: '/quiz', element: <LegalQuizPage /> },
      { path: '/limitation', element: <LimitationCalculatorPage /> },
      { path: '/legal-aid', element: <LegalAidCheckerPage /> },
      { path: '/glossary', element: <GlossaryPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/faq', element: <FAQPage /> },
      { path: '/samples', element: <SamplesPage /> },
      { path: '/lawyer-onboarding', element: <LawyerOnboardingPage /> },
      { path: '/disclaimer', element: <DisclaimerPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/auth', element: <AuthPage /> },
      { path: '/showcase', element: <ShowcasePage /> },
      { path: '/settings', element: <IntelligenceSelectionTerminal /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
