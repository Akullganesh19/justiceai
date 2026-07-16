/**
 * 🛸 Oracle Prediction Engine
 * Anticipates user behavior and prefetches resources before they are requested.
 */

// Track what we've already prefetched to avoid duplicate work
const prefetchedPaths = new Set();

// Map common routes to their chunk names for dynamic importing
// This aligns with how Vite handles dynamic imports in our lazy loaded routes
const routeChunks = {
  '/': () => import('../pages/LandingPage.jsx'),
  '/dashboard': () => import('../pages/DashboardPage.jsx'),
  '/chat': () => import('../pages/ChatPage.jsx'),
  '/documents': () => import('../pages/DocumentsPage.jsx'),
  '/rights': () => import('../pages/RightsPage.jsx'),
  '/estimator': () => import('../pages/EstimatorPage.jsx'),
  '/lawyers': () => import('../pages/LawyerFinderPage.jsx'),
  '/tracker': () => import('../pages/CaseTrackerPage.jsx'),
  '/quiz': () => import('../pages/LegalQuizPage.jsx'),
  '/limitation': () => import('../pages/LimitationCalculatorPage.jsx'),
  '/legal-aid': () => import('../pages/LegalAidCheckerPage.jsx'),
  '/glossary': () => import('../pages/GlossaryPage.jsx'),
  '/about': () => import('../pages/AboutPage.jsx'),
  '/faq': () => import('../pages/FAQPage.jsx'),
  '/samples': () => import('../pages/SamplesPage.jsx'),
  '/lawyer-onboarding': () => import('../pages/LawyerOnboardingPage.jsx'),
  '/disclaimer': () => import('../pages/DisclaimerPage.jsx'),
  '/privacy': () => import('../pages/PrivacyPage.jsx'),
  '/auth': () => import('../pages/AuthPage.jsx'),
  '/showcase': () => import('../pages/ShowcasePage.jsx'),
  '/settings': () => import('../pages/IntelligenceSelectionTerminal.jsx'),
};

/**
 * Prefetch a specific route chunk
 */
const prefetchRoute = (path) => {
  // Normalize path (strip query params and hashes)
  const normalizedPath = path.split('?')[0].split('#')[0];

  // Skip if already prefetched or no chunk mapping exists
  if (prefetchedPaths.has(normalizedPath) || !routeChunks[normalizedPath]) {
    return;
  }

  // Mark as prefetched immediately to prevent concurrent requests
  prefetchedPaths.add(normalizedPath);

  // Execute dynamic import in background and swallow errors
  routeChunks[normalizedPath]().catch(() => {
    // If chunk fails to load, remove from set so we can try again later
    prefetchedPaths.delete(normalizedPath);
  });
};

/**
 * Behavior 1: Session Warm-up based on historical usage
 * On app initialization, we prefetch high-value routes if the user
 * has demonstrated intent to use them based on localStorage artifacts.
 */
const performSessionWarmup = () => {
  // If they have chat history, they'll probably return to chat
  if (localStorage.getItem('justice_ai_history')) {
    prefetchRoute('/chat');
  }

  // If they are tracking cases, they'll check the tracker
  if (localStorage.getItem('justice_ai_case_tracker_v2')) {
    prefetchRoute('/tracker');
  }

  // Dashboard is a common next step for returning users
  if (localStorage.getItem('justice_ai_history') || localStorage.getItem('justice_ai_case_tracker_v2')) {
    prefetchRoute('/dashboard');
  }
};

/**
 * Behavior 2: Intent-based Prefetching
 * Detect when a user is likely to click a link (hovering or touch start)
 * and prefetch the destination route chunk.
 */
const setupIntentListeners = () => {
  // Use event delegation on the document
  const handleIntent = (e) => {
    const target = e.target.closest('a[href], [data-prefetch]');
    if (!target) return;

    // Get the destination path
    let path;
    if (target.tagName.toLowerCase() === 'a') {
      const href = target.getAttribute('href');
      // Only prefetch internal routes (starting with /)
      if (href && href.startsWith('/')) {
        path = href;
      }
    } else {
      path = target.getAttribute('data-prefetch');
    }

    if (path) {
      prefetchRoute(path);
    }
  };

  // Mouse hover implies intent on desktop
  document.addEventListener('mouseover', handleIntent, { passive: true });
  // Touch start implies intent on mobile
  document.addEventListener('touchstart', handleIntent, { passive: true });
};

/**
 * Wake the Oracle prediction engine
 * Should be called once during app initialization
 */
export const wakeOracle = () => {
  // Only run in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  try {
    // Small delay to ensure we don't compete with initial render critical path
    setTimeout(() => {
      performSessionWarmup();
      setupIntentListeners();
    }, 1000);
  } catch (error) {
    // Fail gracefully, normal flow takes over
    console.warn('Oracle prediction engine failed to initialize:', error);
  }
};
