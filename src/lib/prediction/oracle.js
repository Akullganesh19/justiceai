// Oracle: Predictive Intelligence Engine
// Intent: Track user navigation sequences and prefetch/precompute based on historical patterns
export const HISTORY_KEY = 'oracle_nav_history';
const PREDICTION_THRESHOLD = 0.6; // Need 60% confidence to prefetch

class PredictiveEngine {
  constructor() {
    this.history = this.loadHistory();
    this.currentSession = [];
    this.prefetchCache = new Map();
  }

  loadHistory() {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : {};
    } catch (_e) {
      return {};
    }
  }

  saveHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
    } catch (_e) {
      // Ignore quota errors
    }
  }

  trackNavigation(path) {
    if (!path || typeof path !== 'string') return;

    // Avoid tracking immediate re-renders or same-page navigations
    if (this.currentSession.length > 0 && this.currentSession[this.currentSession.length - 1] === path) {
      return;
    }

    // Record sequence
    if (this.currentSession.length > 0) {
      const prevPath = this.currentSession[this.currentSession.length - 1];
      if (!this.history[prevPath]) {
        this.history[prevPath] = {};
      }
      this.history[prevPath][path] = (this.history[prevPath][path] || 0) + 1;
      this.saveHistory();
    }

    this.currentSession.push(path);
    this.predictNextAndPrefetch(path);
  }

  predictNextAndPrefetch(currentPath) {
    const transitions = this.history[currentPath];
    if (!transitions) return;

    let totalTransitions = 0;
    let mostLikelyNext = null;
    let maxCount = 0;

    for (const [nextPath, count] of Object.entries(transitions)) {
      totalTransitions += count;
      if (count > maxCount) {
        maxCount = count;
        mostLikelyNext = nextPath;
      }
    }

    // Predict if we have enough data and high confidence
    if (totalTransitions >= 2 && (maxCount / totalTransitions) >= PREDICTION_THRESHOLD) {
      this.prefetchPath(mostLikelyNext);
    }
  }

  prefetchPath(path) {
    if (!this.prefetchCache.has(path)) {
      this.prefetchCache.set(path, true);
      // In a full implementation, you would trigger the actual prefetch logic here
    }

    // Always dispatch the event so the UI can update
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('oracle-prediction', { detail: { path } }));
  }
}

export const oracle = new PredictiveEngine();
