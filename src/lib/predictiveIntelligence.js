export function predictUserIntent() {
  try {
    const historyData = localStorage.getItem('justice_ai_history');
    if (!historyData) return null;

    const history = JSON.parse(historyData);
    if (!history || history.length === 0) return null;

    // Focus on the most recent case
    const latestCase = history[0];
    if (!latestCase || !latestCase.messages) return null;

    const title = latestCase.title || '';
    const caseType = latestCase.analysis?.caseType || '';

    // Only look at the first few user messages to get the core issue
    const userMessages = latestCase.messages
      .filter(m => m.role === 'user')
      .slice(0, 3)
      .map(m => m.content)
      .join(' ');

    const textToAnalyze = (title + ' ' + caseType + ' ' + userMessages).toLowerCase();

    if (!textToAnalyze.trim()) return null;

    // Keyword mapping to system intents
    const intentScores = {
      consumer: (textToAnalyze.match(/consumer|product|service|deficiency|purchased|bought|refund|warranty/g) || []).length,
      criminal: (textToAnalyze.match(/criminal|police|fir|bns|ipc|arrest|bail|fraud|assault|theft/g) || []).length,
      civil: (textToAnalyze.match(/civil|contract|agreement|money|recovery|sue/g) || []).length,
      property: (textToAnalyze.match(/property|land|real estate|tenant|rent|eviction|lease|builder/g) || []).length,
      family: (textToAnalyze.match(/divorce|family|marriage|maintenance|child|custody|dowry/g) || []).length,
      labour: (textToAnalyze.match(/labour|employment|salary|termination|work|employee|employer/g) || []).length,
      rti: (textToAnalyze.match(/rti|information|public|officer|government/g) || []).length,
    };

    let bestIntent = null;
    let maxScore = 0;

    for (const [intent, score] of Object.entries(intentScores)) {
      if (score > maxScore) {
        maxScore = score;
        bestIntent = intent;
      }
    }

    if (maxScore === 0) return null;

    let estimatorCaseType = bestIntent;
    if (bestIntent === 'family') estimatorCaseType = 'divorce';
    if (bestIntent === 'property' && textToAnalyze.match(/rent|eviction|tenant/)) {
        estimatorCaseType = 'rent';
    }

    return {
      intent: bestIntent,
      estimatorCaseType: estimatorCaseType,
      lawyerSpecialization: bestIntent,
      documentTemplateId: bestIntent === 'consumer' ? 'consumer_complaint'
                        : bestIntent === 'criminal' ? 'bns_complaint'
                        : bestIntent === 'rti' ? 'rti_application'
                        : 'legal_notice'
    };
  } catch (e) {
    console.error('Prediction Engine Error:', e);
    return null;
  }
}
