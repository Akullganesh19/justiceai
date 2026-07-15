import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initCrossSystemIntelligence } from '../lib/eventBridge';

describe('Event Bridge: Cross-System Intelligence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, 'dispatchEvent');
    initCrossSystemIntelligence();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a Case Tracker entry when AI analysis is generated', () => {
    // Simulate the event from ChatPage
    const analysis = {
      caseType: 'Consumer Dispute',
      timeline: [
        { stage: 'Filing Notice', status: 'completed', detail: 'Notice filed on Jan 1' },
        { stage: 'First Hearing', status: 'pending', detail: 'Waiting for date' },
      ],
    };

    const event = new CustomEvent('justice-ai-analysis-generated', {
      detail: {
        analysis,
        caseId: 'test-case-123',
        title: 'Defective Laptop Case',
      },
    });

    window.dispatchEvent(event);

    // Verify localStorage was updated
    const savedCases = JSON.parse(localStorage.getItem('justice_ai_case_tracker_v2'));
    expect(savedCases).toBeDefined();
    expect(savedCases.length).toBe(1);

    const testCase = savedCases[0];
    expect(testCase.id).toBe('test-case-123');
    expect(testCase.name).toBe('Defective Laptop Case');
    expect(testCase.caseType).toBe('Consumer Dispute');

    // Verify steps were mapped correctly
    expect(testCase.steps.length).toBe(2);
    expect(testCase.steps[0].label).toBe('Filing Notice');
    expect(testCase.steps[0].completed).toBe(true);
    expect(testCase.steps[1].label).toBe('First Hearing');
    expect(testCase.steps[1].completed).toBe(false);

    // Verify toast notification was dispatched
    const dispatchCalls = vi.mocked(window.dispatchEvent).mock.calls;
    const toastCall = dispatchCalls.find(
      (call) => call[0].type === 'justice-ai-toast'
    );
    expect(toastCall).toBeDefined();
    expect(toastCall[0].detail.type).toBe('success');
    expect(toastCall[0].detail.title).toBe('Intelligence Synced 🧠');
  });
});
