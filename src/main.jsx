import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Oracle Predictive Routing Engine: Route map for chunk prefetching
const routePrefetchMap = {
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
  '/settings': () => import('./pages/IntelligenceSelectionTerminal.jsx')
};

// Lazy-loaded pages for optimal bundle splitting
const LandingPage = lazy(routePrefetchMap['/']);
const ChatPage = lazy(routePrefetchMap['/chat']);
const AboutPage = lazy(routePrefetchMap['/about']);
const FAQPage = lazy(routePrefetchMap['/faq']);
const SamplesPage = lazy(routePrefetchMap['/samples']);
const DocumentsPage = lazy(routePrefetchMap['/documents']);
const RightsPage = lazy(routePrefetchMap['/rights']);
const EstimatorPage = lazy(routePrefetchMap['/estimator']);
const LawyerFinderPage = lazy(routePrefetchMap['/lawyers']);
const CaseTrackerPage = lazy(routePrefetchMap['/tracker']);
const LegalQuizPage = lazy(routePrefetchMap['/quiz']);
const LimitationCalculatorPage = lazy(routePrefetchMap['/limitation']);
const LegalAidCheckerPage = lazy(routePrefetchMap['/legal-aid']);
const DashboardPage = lazy(routePrefetchMap['/dashboard']);
const GlossaryPage = lazy(routePrefetchMap['/glossary']);
const LawyerOnboardingPage = lazy(routePrefetchMap['/lawyer-onboarding']);
const DisclaimerPage = lazy(routePrefetchMap['/disclaimer']);
const PrivacyPage = lazy(routePrefetchMap['/privacy']);
const AuthPage = lazy(routePrefetchMap['/auth']);
const ShowcasePage = lazy(routePrefetchMap['/showcase']);
const IntelligenceSelectionTerminal = lazy(routePrefetchMap['/settings']);
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// Oracle Predictive Intelligence: Detect user intent and prefetch route chunks before click
if (typeof window !== 'undefined') {
  const prefetched = new Set();

  const handlePredictivePrefetch = (event) => {
    const target = event.target.closest('a');
    if (!target || !target.href) return;

    try {
      const url = new URL(target.href);
      // Only predict/prefetch internal routes
      if (url.origin !== window.location.origin) return;

      // Use url.pathname directly, excludes query params and hash fragments
      const path = url.pathname;

      // Skip if already prefetched to save bandwidth
      if (prefetched.has(path)) return;

      for (const [routePath, importFn] of Object.entries(routePrefetchMap)) {
        // Exact match or directory prefix matching for parameterized routes
        if (path === routePath || (routePath !== '/' && path.startsWith(routePath + '/'))) {
          prefetched.add(path);
          // Execute background dynamic import. Swallow chunk errors to degrade gracefully.
          importFn().catch(() => {});
          break;
        }
      }
    } catch (_err) {
      // Graceful fallback for unparseable URLs
    }
  };

  // Passive listeners ensure main thread and scrolling performance aren't degraded
  window.addEventListener('mouseover', handlePredictivePrefetch, { passive: true });
  window.addEventListener('touchstart', handlePredictivePrefetch, { passive: true });
}

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <div className="grain-overlay" aria-hidden="true" />
          <ScrollToTop />
          <CommandPalette />
          <FloatingVoiceButton onTranscription={handleGlobalTranscription} />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/rights" element={<RightsPage />} />
              <Route path="/estimator" element={<EstimatorPage />} />
              <Route path="/lawyers" element={<LawyerFinderPage />} />
              <Route path="/tracker" element={<CaseTrackerPage />} />
              <Route path="/quiz" element={<LegalQuizPage />} />
              <Route path="/limitation" element={<LimitationCalculatorPage />} />
              <Route path="/legal-aid" element={<LegalAidCheckerPage />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/samples" element={<SamplesPage />} />
              <Route path="/lawyer-onboarding" element={<LawyerOnboardingPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/showcase" element={<ShowcasePage />} />
              <Route path="/settings" element={<IntelligenceSelectionTerminal />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
