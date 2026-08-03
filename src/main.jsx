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

// Lazy-loaded pages mapped for predictive prefetching
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
  '*': () => import('./pages/NotFoundPage.jsx'),
};

// 🛸 Oracle: Predictive Route Prefetching
// Anticipates user navigation by prefetching route chunks when moving toward links
if (typeof window !== 'undefined') {
  const prefetchRoute = (url) => {
    try {
      const parsedUrl = new URL(url, window.location.origin);
      if (parsedUrl.origin === window.location.origin) {
        const path = parsedUrl.pathname;
        let match = routeChunks[path];
        if (!match) {
          // Check for prefix matches for parameterized routes
          for (const key of Object.keys(routeChunks)) {
            if (key !== '/' && key !== '*' && path.startsWith(key + '/')) {
              match = routeChunks[key];
              break;
            }
          }
        }
        if (match) {
          match().catch(() => {});
        }
      }
    } catch (_err) {
      // Swallow URL parsing or chunk loading errors gracefully
    }
  };

  const handlePredictiveHover = (e) => {
    const target = e.target.closest('a');
    if (target && target.href) {
      prefetchRoute(target.href);
    }
  };

  // Passive listeners ensure we don't degrade scrolling/rendering performance
  window.addEventListener('mouseover', handlePredictiveHover, { passive: true });
  window.addEventListener('touchstart', handlePredictiveHover, { passive: true });
}

const LandingPage = lazy(routeChunks['/']);
const DashboardPage = lazy(routeChunks['/dashboard']);
const ChatPage = lazy(routeChunks['/chat']);
const DocumentsPage = lazy(routeChunks['/documents']);
const RightsPage = lazy(routeChunks['/rights']);
const EstimatorPage = lazy(routeChunks['/estimator']);
const LawyerFinderPage = lazy(routeChunks['/lawyers']);
const CaseTrackerPage = lazy(routeChunks['/tracker']);
const LegalQuizPage = lazy(routeChunks['/quiz']);
const LimitationCalculatorPage = lazy(routeChunks['/limitation']);
const LegalAidCheckerPage = lazy(routeChunks['/legal-aid']);
const GlossaryPage = lazy(routeChunks['/glossary']);
const AboutPage = lazy(routeChunks['/about']);
const FAQPage = lazy(routeChunks['/faq']);
const SamplesPage = lazy(routeChunks['/samples']);
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
