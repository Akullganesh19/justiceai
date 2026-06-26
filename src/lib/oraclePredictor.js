// src/lib/oraclePredictor.js
export function predictNextAction() {
  try {
    const saved = localStorage.getItem('justice_ai_history');
    if (!saved) return null;

    const history = JSON.parse(saved);
    if (!history || history.length === 0) return null;

    const latestCase = history[0];
    const messages = latestCase.messages || [];

    // Combine all user messages from the latest session
    const userText = messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content)
      .join(' ')
      .toLowerCase();

    // Heuristics for intent prediction based on recent text

    // 1. DRAFTING / LEGAL NOTICE (Most Common Output)
    if (userText.includes('refund') || userText.includes('defective') || userText.includes('cheated') || userText.includes('notice')) {
      // Attempt to extract factual entities to pre-fill the form
      const facts = [];
      if (userText.includes('refund')) facts.push("Demanding a refund");
      if (userText.includes('defective')) facts.push("The product was defective");

      return {
        type: 'document',
        templateId: 'legal-notice', // Matches id in DOCUMENT_TEMPLATES
        confidence: 0.85,
        reason: 'You recently discussed an issue that typically requires sending a legal notice first.',
        title: 'Draft Legal Notice',
        icon: 'FileText',
        actionLabel: 'Pre-fill and Draft',
        prefill: {
          subject: 'Demand for resolution of issue discussed in recent consultation',
          facts: messages[messages.length - 1]?.content || 'As discussed...',
        }
      };
    }

    // 2. FIND LAWYER (Complex/Litigation)
    if (userText.includes('court') || userText.includes('sue') || userText.includes('lawyer') || userText.includes('police')) {
      return {
        type: 'lawyer',
        path: '/lawyers',
        confidence: 0.75,
        reason: 'Your case involves potential litigation. We recommend consulting a specialized advocate.',
        title: 'Find Specialized Advocate',
        icon: 'UserCheck',
        actionLabel: 'Search Lawyers'
      };
    }

    // 3. COST ESTIMATOR (Financial Concerns)
    if (userText.includes('cost') || userText.includes('fees') || userText.includes('expensive') || userText.includes('pay')) {
       return {
        type: 'estimator',
        path: '/estimator',
        confidence: 0.80,
        reason: 'You asked about legal costs. Calculate expected fees and expenses.',
        title: 'Estimate Legal Costs',
        icon: 'Calculator',
        actionLabel: 'Calculate Costs'
      };
    }

    return null;
  } catch (e) {
    console.error("Oracle Prediction Error:", e);
    return null;
  }
}
