import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import RootLayout from './components/layout/RootLayout';
import './index.css';

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
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
      { path: "*", element: <NotFoundPage /> }
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
