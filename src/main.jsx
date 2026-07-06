import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ScrollToTop from './components/ui/ScrollToTop';
import CommandPalette from './components/ui/CommandPalette';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import FloatingVoiceButton from './components/voice/FloatingVoiceButton';
import Oracle from './components/ui/Oracle.jsx';
import './index.css';

const handleGlobalTranscription = (text) => {
  // Dispatch a custom event that any page (like ChatPage) can listen for
  const event = new CustomEvent('justice-ai-transcription', { detail: { text } });
  window.dispatchEvent(event);
};

// Lazy-loaded pages for optimal bundle splitting

export const PREFETCH_MAP = {
  '/': () => import('./pages/LandingPage.jsx'),
  '/dashboard': () => import('./pages/DashboardPage.jsx'),
  '/chat': () => import('./pages/ChatPage.jsx'),
  '/about': () => import('./pages/AboutPage.jsx'),
  '/faq': () => import('./pages/FAQPage.jsx'),
  '/samples': () => import('./pages/SamplesPage.jsx'),
  '/documents': () => import('./pages/DocumentsPage.jsx'),
  '/rights': () => import('./pages/RightsPage.jsx'),
  '/estimator': () => import('./pages/EstimatorPage.jsx'),
  '/lawyers': () => import('./pages/LawyerFinderPage.jsx'),
  '/tracker': () => import('./pages/CaseTrackerPage.jsx'),
  '/quiz': () => import('./pages/LegalQuizPage.jsx'),
  '/limitation': () => import('./pages/LimitationCalculatorPage.jsx'),
  '/legal-aid': () => import('./pages/LegalAidCheckerPage.jsx'),
  '/glossary': () => import('./pages/GlossaryPage.jsx'),
  '/lawyer-onboarding': () => import('./pages/LawyerOnboardingPage.jsx'),
  '/disclaimer': () => import('./pages/DisclaimerPage.jsx'),
  '/privacy': () => import('./pages/PrivacyPage.jsx'),
  '/auth': () => import('./pages/AuthPage.jsx'),
  '/showcase': () => import('./pages/ShowcasePage.jsx'),
  '/settings': () => import('./pages/IntelligenceSelectionTerminal.jsx'),
  '*': () => import('./pages/NotFoundPage.jsx')
};

const LandingPage = lazy(PREFETCH_MAP['/']);
const ChatPage = lazy(PREFETCH_MAP['/chat']);
const AboutPage = lazy(PREFETCH_MAP['/about']);
const FAQPage = lazy(PREFETCH_MAP['/faq']);
const SamplesPage = lazy(PREFETCH_MAP['/samples']);
const DocumentsPage = lazy(PREFETCH_MAP['/documents']);
const RightsPage = lazy(PREFETCH_MAP['/rights']);
const EstimatorPage = lazy(PREFETCH_MAP['/estimator']);
const LawyerFinderPage = lazy(PREFETCH_MAP['/lawyers']);
const CaseTrackerPage = lazy(PREFETCH_MAP['/tracker']);
const LegalQuizPage = lazy(PREFETCH_MAP['/quiz']);
const LimitationCalculatorPage = lazy(PREFETCH_MAP['/limitation']);
const LegalAidCheckerPage = lazy(PREFETCH_MAP['/legal-aid']);
const DashboardPage = lazy(PREFETCH_MAP['/dashboard']);
const GlossaryPage = lazy(PREFETCH_MAP['/glossary']);
const LawyerOnboardingPage = lazy(PREFETCH_MAP['/lawyer-onboarding']);
const DisclaimerPage = lazy(PREFETCH_MAP['/disclaimer']);
const PrivacyPage = lazy(PREFETCH_MAP['/privacy']);
const AuthPage = lazy(PREFETCH_MAP['/auth']);
const ShowcasePage = lazy(PREFETCH_MAP['/showcase']);
const IntelligenceSelectionTerminal = lazy(PREFETCH_MAP['/settings']);
const NotFoundPage = lazy(PREFETCH_MAP['*']);


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
          <Oracle />
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
