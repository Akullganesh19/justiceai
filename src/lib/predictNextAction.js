import { FileWarning, ShoppingBag, FileSearch, Shield, Calculator } from 'lucide-react';

/**
 * Predictive Intelligence Engine (Oracle)
 * Analyzes recent user activity to predict their most likely next action.
 * Focuses on transitioning from 'consultation' (chat) to 'action' (documents, estimator).
 */
export function predictNextAction(historyArray) {
  if (!historyArray || historyArray.length === 0) return null;

  // Most recent context is the strongest signal
  const latestCase = historyArray[0];
  if (!latestCase || !latestCase.messages) return null;

  // Aggregate user messages from the last session to find intent
  const userText = latestCase.messages
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase())
    .join(' ');

  // 1. Consumer Dispute -> Consumer Complaint
  if (/(consumer|defect|refund|e-commerce|flipkart|amazon|warranty|guarantee)/.test(userText)) {
    return {
      id: 'predict-consumer-complaint',
      title: 'Draft Consumer Complaint',
      description: 'Ready to take action? Draft a formal consumer complaint based on your recent consultation.',
      path: '/documents',
      state: { autoSelectTemplate: 'consumer-complaint' },
      icon: ShoppingBag,
      accent: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    };
  }

  // 2. Police/Crime -> FIR Draft
  if (/(police|stolen|theft|assault|crime|harassment|fir|station)/.test(userText)) {
    return {
      id: 'predict-fir',
      title: 'Draft FIR Application',
      description: 'Your recent query involved a police matter. Prepare an FIR draft to take to the station.',
      path: '/documents',
      state: { autoSelectTemplate: 'fir-draft' },
      icon: Shield,
      accent: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    };
  }

  // 3. Government Info -> RTI Application
  if (/(government|rti|information|public authority|municipality|panchayat)/.test(userText)) {
    return {
      id: 'predict-rti',
      title: 'File an RTI',
      description: 'Need official records? Generate an RTI application to get the facts from authorities.',
      path: '/documents',
      state: { autoSelectTemplate: 'rti-application' },
      icon: FileSearch,
      accent: 'bg-purple-500/10 border-purple-500/20 text-purple-400'
    };
  }

  // 4. Financial/Cost concerns -> Estimator
  if (/(cost|fee|expensive|price|lawyer fee|court fee|afford)/.test(userText)) {
    return {
      id: 'predict-estimator',
      title: 'Calculate Legal Costs',
      description: 'Wondering about the expenses? Estimate court and lawyer fees for your situation.',
      path: '/estimator',
      state: { autoSelectCaseType: 'civil' },
      icon: Calculator,
      accent: 'bg-amber-500/10 border-amber-500/20 text-amber-400'
    };
  }

  // 5. Default generic transition -> Legal Notice
  if (/(sue|notice|court|lawsuit|legal action|damages)/.test(userText)) {
    return {
      id: 'predict-legal-notice',
      title: 'Draft Legal Notice',
      description: 'The standard first step in civil disputes. Send a formal legal notice to the other party.',
      path: '/documents',
      state: { autoSelectTemplate: 'legal-notice' },
      icon: FileWarning,
      accent: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
    };
  }

  return null;
}
