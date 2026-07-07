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


// Request Coalescing Wrapper
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  const inFlightRequests = new Map();

  window.fetch = async function coalescedFetch(input, init) {
    let method = 'GET';
    if (init?.method) {
      method = init.method.toUpperCase();
    } else if (typeof Request !== 'undefined' && input instanceof Request) {
      method = input.method.toUpperCase();
    }

    if (method !== 'GET' || init?.signal || (typeof Request !== 'undefined' && input instanceof Request && input.signal)) {
      return originalFetch.call(this, input, init);
    }

    let url = '';
    if (typeof input === 'string') {
      url = input;
    } else if (typeof URL !== 'undefined' && input instanceof URL) {
      url = input.toString();
    } else if (typeof Request !== 'undefined' && input instanceof Request) {
      url = input.url;
    } else {
      url = input.toString();
    }

    let headersStr = '';
    if (init?.headers) {
      headersStr = JSON.stringify([...new Headers(init.headers).entries()].sort());
    } else if (typeof Request !== 'undefined' && input instanceof Request && input.headers) {
      headersStr = JSON.stringify([...new Headers(input.headers).entries()].sort());
    }

    const credentials = init?.credentials || (typeof Request !== 'undefined' && input instanceof Request ? input.credentials : '') || '';
    const mode = init?.mode || (typeof Request !== 'undefined' && input instanceof Request ? input.mode : '') || '';

    const cacheKey = `${url}|${headersStr}|${credentials}|${mode}`;

    if (inFlightRequests.has(cacheKey)) {
      const sharedPromise = inFlightRequests.get(cacheKey);
      const res = await sharedPromise;
      return res.clone();
    }

    const promise = originalFetch.call(this, input, init).then(res => {
      inFlightRequests.delete(cacheKey);
      return res;
    }).catch(err => {
      inFlightRequests.delete(cacheKey);
      throw err;
    });

    inFlightRequests.set(cacheKey, promise);

    const res = await promise;
    // The original caller gets a clone as well to ensure that if concurrent callers await the shared promise in the same microtask queue turn,
    // they don't crash because the original caller consumed the stream first.
    return res.clone();
  };
}






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
