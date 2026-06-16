/**
 * 🛸 Oracle Predictive Engine
 * Anticipates user needs by analyzing past behavior and local data.
 */

const DOMAIN_SIGNALS = {
  family: ['divorce', 'marriage', 'husband', 'wife', 'child', 'custody', 'alimony', 'maintenance', 'dowry'],
  property: ['property', 'land', 'tenant', 'landlord', 'rent', 'lease', 'eviction', 'sale deed', 'builder'],
  consumer: ['refund', 'defective', 'consumer', 'warranty', 'service', 'fraud', 'ecommerce', 'replacement'],
  criminal: ['police', 'fir', 'bail', 'arrest', 'criminal', 'assault', 'fraud', 'cheating', 'jail'],
  labour: ['employer', 'employee', 'salary', 'termination', 'workplace', 'pf', 'notice period', 'harassment'],
  cyber: ['cyber', 'online', 'hack', 'scam', 'phishing', 'data', 'privacy', 'internet'],
};

export function predictUserNeeds() {
  try {
    const historyJson = localStorage.getItem('justice_ai_history');
    if (!historyJson) return null;

    const history = JSON.parse(historyJson);
    if (!Array.isArray(history) || history.length === 0) return null;

    const combinedText = history.slice(0, 3)
      .flatMap(c => c.messages?.map(m => m.content) || [])
      .join(' ').toLowerCase();

    if (!combinedText) return null;

    const scores = {};
    let maxDomain = null, maxScore = 0;

    for (const [domain, keywords] of Object.entries(DOMAIN_SIGNALS)) {
      scores[domain] = 0;
      keywords.forEach(kw => {
        const matches = combinedText.match(new RegExp(`\\b${kw}\\b`, 'g'));
        if (matches) scores[domain] += matches.length;
      });
      if (scores[domain] > maxScore) {
        maxScore = scores[domain];
        maxDomain = domain;
      }
    }

    if (maxScore >= 2) {
      return {
        domain: maxDomain,
        confidence: Math.min(99, Math.round((maxScore / (maxScore + 2)) * 100)),
        nextRoute: '/lawyers',
        reason: `Recent chats indicate ${maxDomain} matters.`
      };
    }
  } catch (e) {
    console.error("Oracle prediction failed:", e);
  }
  return null;
}
