import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initializeSynapseBridge } from '../lib/synapseBridge';

describe('Synapse Bridge', () => {
  beforeEach(() => {
    vi.spyOn(window, 'dispatchEvent');
    // Setup initial localStorage
    const initialCases = [
      { id: 'case-123', name: 'Test Case', details: {} }
    ];
    localStorage.setItem('justice_ai_case_tracker_v2', JSON.stringify(initialCases));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('listens for justice-ai-analysis-complete and updates CaseTracker localStorage', () => {
    initializeSynapseBridge();

    const analysisData = {
      verdict: 'win',
      confidence: 85
    };

    const event = new CustomEvent('justice-ai-analysis-complete', {
      detail: {
        caseId: 'case-123',
        analysis: analysisData
      }
    });

    window.dispatchEvent(event);

    // Check localStorage enrichment
    const updatedCases = JSON.parse(localStorage.getItem('justice_ai_case_tracker_v2'));
    expect(updatedCases[0].details.synapseEnriched).toBe(true);
    expect(updatedCases[0].details.aiVerdict).toBe('win');
    expect(updatedCases[0].details.confidence).toBe(85);

    // Should also dispatch toast
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'justice-ai-toast' })
    );
  });
});
