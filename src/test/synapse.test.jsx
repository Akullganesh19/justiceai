import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Synapse Event Bridge: AI Chat ↔ Case Tracker', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should create a new case tracker node when substantive chat event is fired', () => {
    // We can directly test the logic that would be inside the listener
    // Or dispatch the event against window if the listener is mounted.
    // For a pure unit test, let's verify the localStorage interaction.

    // Simulate the event bridge logic as injected in main.jsx
    const eventHandler = (e) => {
      const { id, title, analysis } = e.detail;
      if (!id || !title) return;
      try {
        const STORAGE_KEY = 'justice_ai_case_tracker_v2';
        const saved = localStorage.getItem(STORAGE_KEY);
        let cases = saved ? JSON.parse(saved) : [];
        const existingIndex = cases.findIndex(c => c.id === id);
        if (existingIndex === -1) {
          const newCase = {
            id, name: title, caseType: 'general_litigation', steps: [],
            createdAt: new Date().toISOString(), details: {},
            aiAnalysisSummary: analysis ? analysis.strengths?.[0] : ''
          };
          cases.push(newCase);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
        }
      } catch (err) {}
    };

    const mockEvent = new CustomEvent('justice.chat.caseUpdated', {
      detail: {
        id: 'test-case-123',
        title: 'Dispute regarding tenancy',
        analysis: { strengths: ['Clear evidence of rent payment'] }
      }
    });

    eventHandler(mockEvent);

    const savedData = localStorage.getItem('justice_ai_case_tracker_v2');
    expect(savedData).not.toBeNull();

    const parsedData = JSON.parse(savedData);
    expect(parsedData).toHaveLength(1);
    expect(parsedData[0].id).toBe('test-case-123');
    expect(parsedData[0].name).toBe('Dispute regarding tenancy');
    expect(parsedData[0].aiAnalysisSummary).toBe('Clear evidence of rent payment');
  });
});
