import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initSynapseBridge } from '../lib/synapseBridge';

describe('Synapse Bridge', () => {
  const STORAGE_KEY = 'justice_ai_case_tracker_v2';
  let cleanup;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    cleanup = initSynapseBridge();
  });

  afterEach(() => {
    if (cleanup) cleanup();
    vi.clearAllMocks();
  });

  it('should ignore events without timeline data', () => {
    window.dispatchEvent(new CustomEvent('justice-ai-analysis-complete', {
      detail: { activeCaseId: '123', title: 'Test', analysis: {} }
    }));

    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).toBeNull();
  });

  it('should map analysis timeline to case tracker format and save to localStorage', () => {
    const analysis = {
      caseType: 'consumer',
      timeline: [
        { stage: 'Draft Notice', status: 'completed', detail: 'Notice drafted' },
        { stage: 'File Petition', status: 'pending', detail: 'Wait for response' }
      ]
    };

    window.dispatchEvent(new CustomEvent('justice-ai-analysis-complete', {
      detail: { activeCaseId: 'case-1', title: 'Consumer Dispute', analysis }
    }));

    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).not.toBeNull();

    const cases = JSON.parse(saved);
    expect(cases.length).toBe(1);
    expect(cases[0].id).toBe('case-1');
    expect(cases[0].name).toBe('Consumer Dispute');
    expect(cases[0].caseType).toBe('consumer');
    expect(cases[0].steps.length).toBe(2);

    expect(cases[0].steps[0].label).toBe('Draft Notice');
    expect(cases[0].steps[0].completed).toBe(true);
    expect(cases[0].steps[0].description).toBe('Notice drafted');
    expect(cases[0].steps[0].completedDate).toBeDefined();

    expect(cases[0].steps[1].label).toBe('File Petition');
    expect(cases[0].steps[1].completed).toBe(false);
    expect(cases[0].steps[1].description).toBe('Wait for response');
  });

  it('should not duplicate a case if the activeCaseId already exists in localStorage', () => {
    const initialCase = [{ id: 'case-1', name: 'Existing Case', steps: [] }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCase));

    const analysis = {
      timeline: [{ stage: 'Step 1', status: 'completed' }]
    };

    window.dispatchEvent(new CustomEvent('justice-ai-analysis-complete', {
      detail: { activeCaseId: 'case-1', title: 'New Title', analysis }
    }));

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.length).toBe(1);
    expect(saved[0].name).toBe('Existing Case'); // Should not be overwritten
  });
});
