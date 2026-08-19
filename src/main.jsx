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

// Lazy-loaded pages for optimal bundle splitting
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const ChatPage = lazy(() => import('./pages/ChatPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const FAQPage = lazy(() => import('./pages/FAQPage.jsx'));
const SamplesPage = lazy(() => import('./pages/SamplesPage.jsx'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage.jsx'));
const RightsPage = lazy(() => import('./pages/RightsPage.jsx'));
const EstimatorPage = lazy(() => import('./pages/EstimatorPage.jsx'));
const LawyerFinderPage = lazy(() => import('./pages/LawyerFinderPage.jsx'));
const CaseTrackerPage = lazy(() => import('./pages/CaseTrackerPage.jsx'));
const LegalQuizPage = lazy(() => import('./pages/LegalQuizPage.jsx'));
const LimitationCalculatorPage = lazy(() => import('./pages/LimitationCalculatorPage.jsx'));
const LegalAidCheckerPage = lazy(() => import('./pages/LegalAidCheckerPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage.jsx'));
const LawyerOnboardingPage = lazy(() => import('./pages/LawyerOnboardingPage.jsx'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage.jsx'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const ShowcasePage = lazy(() => import('./pages/ShowcasePage.jsx'));
const IntelligenceSelectionTerminal = lazy(() => import('./pages/IntelligenceSelectionTerminal.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));


// 🔮 Oracle: Predictive Intent & Session Warm-up Engine
// Anticipates user actions and silently prefetches the data/chunks they'll need next.
const routeImporters = {
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

function PredictiveEngine() {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Session Warm-up: Look at past user behavior to guess their first moves
    try {
      const history = localStorage.getItem('justice_ai_history');
      if (history && history.length > 5) {
        // High likelihood they are returning to continue a case
        routeImporters['/chat']()?.catch(() => {});
        routeImporters['/documents']()?.catch(() => {});
      }

      const tracker = localStorage.getItem('justice_ai_case_tracker_v2');
      if (tracker && tracker.length > 5) {
        // High likelihood they want to see case updates
        routeImporters['/tracker']()?.catch(() => {});
      }
    } catch (_err) {
      // Degrade gracefully if localStorage fails
    }

    // 2. Intent Prefetching: Detect where the user is going before they click
    const prefetched = new Set();

    const handleIntent = (e) => {
      const link = e.target.closest('a');
      if (!link || !link.href) return;

      try {
        const url = new URL(link.href);
        // Only prefetch our own domain
        if (url.origin !== window.location.origin) return;

        const path = url.pathname;
        if (prefetched.has(path)) return;

        // Find the matching importer (exact match or prefix for parameterized routes)
        let importer = routeImporters[path];
        if (!importer) {
          const match = Object.keys(routeImporters).find(k => k !== '/' && path.startsWith(k + '/'));
          if (match) importer = routeImporters[match];
        }

        if (importer) {
          prefetched.add(path);
          importer().catch(() => {}); // Swallow chunk errors gracefully
        }
      } catch (_err) {
        // Gracefully ignore parse errors
      }
    };

    // Use passive listeners so we don't block the main thread / scrolling
    window.addEventListener('mouseover', handleIntent, { passive: true });
    window.addEventListener('touchstart', handleIntent, { passive: true });

    return () => {
      window.removeEventListener('mouseover', handleIntent);
      window.removeEventListener('touchstart', handleIntent);
    };
  }, []);

  return null;
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
          <PredictiveEngine />
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
