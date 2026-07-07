import React, { Suspense, lazy, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

// PREFETCH_MAP maps routes to their dynamic imports for predictive background loading.
// This allows us to load modules programmatically before the user even clicks.
export const PREFETCH_MAP = {
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

// Lazy-loaded pages for optimal bundle splitting
const LandingPage = lazy(PREFETCH_MAP['/']);
const DashboardPage = lazy(PREFETCH_MAP['/dashboard']);
const ChatPage = lazy(PREFETCH_MAP['/chat']);
const DocumentsPage = lazy(PREFETCH_MAP['/documents']);
const RightsPage = lazy(PREFETCH_MAP['/rights']);
const EstimatorPage = lazy(PREFETCH_MAP['/estimator']);
const LawyerFinderPage = lazy(PREFETCH_MAP['/lawyers']);
const CaseTrackerPage = lazy(PREFETCH_MAP['/tracker']);
const LegalQuizPage = lazy(PREFETCH_MAP['/quiz']);
const LimitationCalculatorPage = lazy(PREFETCH_MAP['/limitation']);
const LegalAidCheckerPage = lazy(PREFETCH_MAP['/legal-aid']);
const GlossaryPage = lazy(PREFETCH_MAP['/glossary']);
const AboutPage = lazy(PREFETCH_MAP['/about']);
const FAQPage = lazy(PREFETCH_MAP['/faq']);
const SamplesPage = lazy(PREFETCH_MAP['/samples']);
const LawyerOnboardingPage = lazy(PREFETCH_MAP['/lawyer-onboarding']);
const DisclaimerPage = lazy(PREFETCH_MAP['/disclaimer']);
const PrivacyPage = lazy(PREFETCH_MAP['/privacy']);
const AuthPage = lazy(PREFETCH_MAP['/auth']);
const ShowcasePage = lazy(PREFETCH_MAP['/showcase']);
const IntelligenceSelectionTerminal = lazy(PREFETCH_MAP['/settings']);
const NotFoundPage = lazy(PREFETCH_MAP['*']);

// Loading fallback component




/**
 * 🛸 Oracle: Predictive Route Prefetcher
 * Anticipates the user's next navigation based on historical transition patterns
 * and programmatically fetches the corresponding module in the background.
 */
function RoutePredictor() {
  const location = useLocation();

  useEffect(() => {
    try {
      const currentPath = location.pathname;
      const historyStr = localStorage.getItem('oracle_transitions');
      const transitions = historyStr ? JSON.parse(historyStr) : {};
      const lastPath = sessionStorage.getItem('oracle_last_path');

      // 1. Record the transition from the last route to the current route
      if (lastPath && lastPath !== currentPath) {
        if (!transitions[lastPath]) transitions[lastPath] = {};
        transitions[lastPath][currentPath] = (transitions[lastPath][currentPath] || 0) + 1;
        localStorage.setItem('oracle_transitions', JSON.stringify(transitions));
      }
      sessionStorage.setItem('oracle_last_path', currentPath);

      // 2. Predict the most likely *next* routes based on where users go from here
      const nextProbable = transitions[currentPath] || {};
      const likelyNextRoutes = Object.entries(nextProbable)
        .sort((a, b) => b[1] - a[1]) // Sort by highest frequency
        .slice(0, 2)                 // Take top 2 predictions
        .map(e => e[0]);

      // If no history yet, default to predicting the most common initial actions
      if (likelyNextRoutes.length === 0 && currentPath === '/') {
        likelyNextRoutes.push('/dashboard', '/chat');
      }

      // 3. Execute background prefetch for predicted routes
      likelyNextRoutes.forEach(path => {
        if (PREFETCH_MAP[path]) {
          // Slight delay ensures we don't block the current page's rendering thread
          setTimeout(() => {
            PREFETCH_MAP[path]().catch(() => { /* Degrade gracefully on fetch error */ });
          }, 800);
        }
      });
    } catch (e) {
      // Degrade gracefully if localStorage is disabled or throws quota errors
    }
  }, [location.pathname]);

  return null;
}

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
          <RoutePredictor />
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
