import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initializeSynapse } from './synapse';

/* global process */

describe('Synapse Bridge', () => {
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = (() => {
      let store = {};
      return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
          store[key] = value.toString();
        }),
        clear: vi.fn(() => {
          store = {};
        }),
      };
    })();
    vi.stubGlobal('localStorage', localStorageMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a new case in tracker when analysis is received', () => {
    initializeSynapse();

    const analysis = {
      timeline: [
        { stage: 'Filing', detail: 'File the initial complaint', status: 'Completed' },
        { stage: 'Hearing', detail: 'Attend the first hearing', status: 'Pending' }
      ]
    };

    window.dispatchEvent(
      new CustomEvent('justice-ai-analysis-updated', {
        detail: { caseId: 'case-123', title: 'Test Case', analysis }
      })
    );

    expect(localStorageMock.setItem).toHaveBeenCalled();
    const callArgs = localStorageMock.setItem.mock.calls[0];
    expect(callArgs[0]).toBe('justice_ai_case_tracker_v2');
    const savedCases = JSON.parse(callArgs[1]);
    expect(savedCases.length).toBe(1);
    expect(savedCases[0].id).toBe('case-123');
    expect(savedCases[0].name).toBe('Test Case');
    expect(savedCases[0].steps.length).toBe(2);
    expect(savedCases[0].steps[0].label).toBe('Filing');
    expect(savedCases[0].steps[0].completed).toBe(true);
    expect(savedCases[0].steps[1].label).toBe('Hearing');
    expect(savedCases[0].steps[1].completed).toBe(false);
  });
});
