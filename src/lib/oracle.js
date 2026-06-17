export const Oracle = {
  // Analyzes user history and predicts the most likely next action
  predictNextAction: () => {
    try {
      const historyStr = localStorage.getItem('justice_ai_history');
      if (!historyStr) return null;

      const history = JSON.parse(historyStr);
      if (!Array.isArray(history) || history.length === 0) return null;

      const latestCase = history[0];
      const analysis = latestCase.analysis;

      if (!analysis) return null;

      // Behavioral Rule 1: If analysis suggests a legal notice, user will likely want to generate one
      if (
        analysis.strategy?.some(s => s.toLowerCase().includes('notice') || s.toLowerCase().includes('demand')) ||
        analysis.caseType?.toLowerCase().includes('civil') ||
        analysis.caseType?.toLowerCase().includes('consumer')
      ) {
        return {
          type: 'DOCUMENT_GENERATION',
          reason: 'Strategy requires sending a formal notice',
          action: 'Generate Legal Notice',
          path: '/documents',
          context: { templateId: 'legal-notice', title: latestCase.title }
        };
      }

      // Behavioral Rule 2: If the verdict/timeline mentions filing a case, user likely needs to track it or estimate costs
      if (analysis.timeline?.some(t => t.phase?.toLowerCase().includes('file') || t.phase?.toLowerCase().includes('petition'))) {
        return {
          type: 'CASE_TRACKING',
          reason: 'Next phase involves filing a petition',
          action: 'Initialize Case Tracker',
          path: '/tracker',
          context: { title: latestCase.title, type: analysis.caseType?.toLowerCase().includes('consumer') ? 'consumer' : 'civil' }
        };
      }

      // Behavioral Rule 3: If laws are complex or involve monetary disputes, estimate costs
      if (analysis.laws?.length > 2 || latestCase.title?.toLowerCase().includes('rs') || latestCase.title?.toLowerCase().includes('rupees')) {
         return {
          type: 'COST_ESTIMATION',
          reason: 'Complex dispute identified, cost estimation recommended',
          action: 'Estimate Legal Costs',
          path: '/estimator',
          context: { type: analysis.caseType?.toLowerCase().includes('consumer') ? 'consumer' : 'civil' }
        };
      }

      return null;
    } catch (e) {
      console.warn("Oracle prediction failed:", e);
      return null;
    }
  },

  // Session warm-up: Cache the prediction
  warmUp: () => {
    const prediction = Oracle.predictNextAction();
    if (prediction) {
      // Store in memory for immediate access across the session
      sessionStorage.setItem('oracle_prediction', JSON.stringify(prediction));
    }
    return prediction;
  },

  // Consume context for intelligent defaults
  consumeContext: (type) => {
    try {
      const predStr = sessionStorage.getItem('oracle_prediction');
      if (!predStr) return null;
      const prediction = JSON.parse(predStr);
      if (prediction.type === type) {
          return prediction.context;
      }
      return null;
    } catch(e) {
      return null;
    }
  }
};
