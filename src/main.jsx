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
  if (typeof window !== 'undefined') {
    // Dispatch a custom event that any page (like ChatPage) can listen for
    const event = new CustomEvent('justice-ai-transcription', { detail: { text } });
    window.dispatchEvent(event);
  }
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


// Root Layout combining global providers and components
function RootLayout() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="grain-overlay" aria-hidden="true" />
        <ScrollToTop />
        <CommandPalette />
        <FloatingVoiceButton onTranscription={handleGlobalTranscription} />
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </ToastProvider>
    </ErrorBoundary>
  );
}

// Modern Data API Router configuration
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/chat", element: <ChatPage /> },
      { path: "/documents", element: <DocumentsPage /> },
      { path: "/rights", element: <RightsPage /> },
      { path: "/estimator", element: <EstimatorPage /> },
      { path: "/lawyers", element: <LawyerFinderPage /> },
      { path: "/tracker", element: <CaseTrackerPage /> },
      { path: "/quiz", element: <LegalQuizPage /> },
      { path: "/limitation", element: <LimitationCalculatorPage /> },
      { path: "/legal-aid", element: <LegalAidCheckerPage /> },
      { path: "/glossary", element: <GlossaryPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/faq", element: <FAQPage /> },
      { path: "/samples", element: <SamplesPage /> },
      { path: "/lawyer-onboarding", element: <LawyerOnboardingPage /> },
      { path: "/disclaimer", element: <DisclaimerPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "/auth", element: <AuthPage /> },
      { path: "/showcase", element: <ShowcasePage /> },
      { path: "/settings", element: <IntelligenceSelectionTerminal /> },
      { path: "*", element: <NotFoundPage /> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
