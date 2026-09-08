import React, { Suspense, lazy } from 'react';
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


const ROUTE_IMPORTS = {
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
const LandingPage = lazy(ROUTE_IMPORTS['/']);
const ChatPage = lazy(ROUTE_IMPORTS['/chat']);
const AboutPage = lazy(ROUTE_IMPORTS['/about']);
const FAQPage = lazy(ROUTE_IMPORTS['/faq']);
const SamplesPage = lazy(ROUTE_IMPORTS['/samples']);
const DocumentsPage = lazy(ROUTE_IMPORTS['/documents']);
const RightsPage = lazy(ROUTE_IMPORTS['/rights']);
const EstimatorPage = lazy(ROUTE_IMPORTS['/estimator']);
const LawyerFinderPage = lazy(ROUTE_IMPORTS['/lawyers']);
const CaseTrackerPage = lazy(ROUTE_IMPORTS['/tracker']);
const LegalQuizPage = lazy(ROUTE_IMPORTS['/quiz']);
const LimitationCalculatorPage = lazy(ROUTE_IMPORTS['/limitation']);
const LegalAidCheckerPage = lazy(ROUTE_IMPORTS['/legal-aid']);
const DashboardPage = lazy(ROUTE_IMPORTS['/dashboard']);
const GlossaryPage = lazy(ROUTE_IMPORTS['/glossary']);
const LawyerOnboardingPage = lazy(ROUTE_IMPORTS['/lawyer-onboarding']);
const DisclaimerPage = lazy(ROUTE_IMPORTS['/disclaimer']);
const PrivacyPage = lazy(ROUTE_IMPORTS['/privacy']);
const AuthPage = lazy(ROUTE_IMPORTS['/auth']);
const ShowcasePage = lazy(ROUTE_IMPORTS['/showcase']);
const IntelligenceSelectionTerminal = lazy(ROUTE_IMPORTS['/settings']);
const NotFoundPage = lazy(ROUTE_IMPORTS['*']);

// Predictive Navigation Mesh
function PredictiveNavigationMesh() {
  const location = useLocation();
  const prevPathRef = React.useRef(null);

  React.useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;

    if (prevPath && prevPath !== currentPath) {
      try {
        const stored = localStorage.getItem('oracle_nav_graph');
        const graph = stored ? JSON.parse(stored) : {};

        if (!graph[prevPath]) graph[prevPath] = {};
        graph[prevPath][currentPath] = (graph[prevPath][currentPath] || 0) + 1;

        localStorage.setItem('oracle_nav_graph', JSON.stringify(graph));
      } catch (_err) {
        // Handle quota errors silently
      }
    }

    prevPathRef.current = currentPath;

    // Predict and prefetch the most likely next route
    try {
      const stored = localStorage.getItem('oracle_nav_graph');
      if (stored) {
        const graph = JSON.parse(stored);
        const transitions = graph[currentPath];
        if (transitions) {
          let maxCount = 0;
          let mostLikelyRoute = null;

          for (const [route, count] of Object.entries(transitions)) {
            if (count > maxCount) {
              maxCount = count;
              mostLikelyRoute = route;
            }
          }

          if (mostLikelyRoute && ROUTE_IMPORTS[mostLikelyRoute]) {
            // Silently prefetch the most likely route
            ROUTE_IMPORTS[mostLikelyRoute]();
          }
        }
      }
    } catch (_err) {
      // Ignore prediction failures
    }
  }, [location.pathname]);

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
          <div className="grain-overlay" aria-hidden="true" />
          <ScrollToTop />
          <PredictiveNavigationMesh />
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
