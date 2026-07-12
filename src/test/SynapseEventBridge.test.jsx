import { initializeEventBridge } from '../lib/eventBridge';

describe('Synapse Event Bridge: Chat to Case Tracker', () => {
  beforeEach(() => {
    localStorage.clear();
    // Re-initialize for tests
    initializeEventBridge();
  });

  it('listens for justice-ai-case-update globally and updates localStorage', () => {
    const mockTimeline = [
      { stage: 'Initial Consultation', status: 'completed', detail: 'Discussed facts.' },
      { stage: 'Draft Petition', status: 'pending', detail: 'Drafting the PIL.' }
    ];

    const event = new CustomEvent('justice-ai-case-update', {
      detail: { timeline: mockTimeline, caseType: 'Public Interest Litigation' }
    });

    // Fire the event on the window
    window.dispatchEvent(event);

    // Check localStorage
    const saved = localStorage.getItem('justice_ai_case_tracker_v2');
    expect(saved).not.toBeNull();

    const cases = JSON.parse(saved);
    expect(cases.length).toBeGreaterThan(0);
    expect(cases[0].name).toContain('AI Generated: Public Interest Litigation');
    expect(cases[0].steps.length).toBe(2);
    expect(cases[0].steps[0].label).toBe('Initial Consultation');
    expect(cases[0].steps[1].label).toBe('Draft Petition');
  });
});
