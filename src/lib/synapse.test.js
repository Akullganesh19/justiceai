import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initSynapse } from './synapse.js';

describe('Synapse Intelligence Bridge', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should bridge chat analysis to case tracker', () => {
    initSynapse();

    const analysis = {
      timeline: [
        { stage: 'Filing', detail: 'File the case', status: 'active' },
        { stage: 'Hearing', detail: 'Attend court', status: 'pending' }
      ]
    };

    const event = new CustomEvent('justice-ai-analysis-generated', {
      detail: { caseId: '123', title: 'Test Case', analysis }
    });

    window.dispatchEvent(event);

    const stored = JSON.parse(localStorage.getItem('justice_ai_case_tracker_v2'));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('123');
    expect(stored[0].title).toBe('AI Tracked: Test Case');
    expect(stored[0].steps).toHaveLength(2);
    expect(stored[0].steps[0].label).toBe('Filing');
    expect(stored[0].steps[0].description).toBe('File the case');
  });

  it('should not overwrite existing case tracker data to preserve user state', () => {
    initSynapse();

    localStorage.setItem('justice_ai_case_tracker_v2', JSON.stringify([{
      id: '123',
      title: 'Existing Case',
      steps: []
    }]));

    const event = new CustomEvent('justice-ai-analysis-generated', {
      detail: { caseId: '123', title: 'Test Case', analysis: { timeline: [{ stage: 'X' }] } }
    });
    window.dispatchEvent(event);

    const stored = JSON.parse(localStorage.getItem('justice_ai_case_tracker_v2'));
    expect(stored[0].title).toBe('Existing Case');
    expect(stored[0].steps).toHaveLength(0);
  });
});
