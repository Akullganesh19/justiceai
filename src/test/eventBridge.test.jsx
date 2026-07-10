import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initializeEventBridge } from '../lib/eventBridge';

describe('Event Bridge Pattern - Cross System Intelligence', () => {
  beforeEach(() => {
    localStorage.clear();
    // Re-initialize the bridge before each test if needed, though window event listeners stack.
    // It's safe to call it once, but let's clear listeners by just calling it once globally if possible.
    // Vitest jsdom keeps window between tests in the same file unless configured otherwise.
  });

  it('injects intelligence into Chat AI when Case Tracker milestone completes', () => {
    initializeEventBridge();

    // Simulate user completing a milestone in the Case Tracker
    const event = new window.CustomEvent('justice-ai-milestone-completed', {
      detail: {
        caseName: 'Consumer Dispute',
        stepLabel: 'Serve Statutory Notice',
        nextStepLabel: 'Draft Formal Petition',
        timestamp: '2023-10-01T12:00:00Z'
      }
    });
    window.dispatchEvent(event);

    // Verify Chat AI system has received the intelligence
    const chatData = JSON.parse(localStorage.getItem('justice_ai_simple_chat'));
    expect(chatData).toBeDefined();

    // Should have the welcome message and the bridge message
    expect(chatData.length).toBe(2);

    const bridgeMessage = chatData[1];
    expect(bridgeMessage.role).toBe('assistant');
    expect(bridgeMessage.content).toContain('I noticed you just completed the milestone "Serve Statutory Notice" for your case "Consumer Dispute"');
    expect(bridgeMessage.content).toContain('The next step is "Draft Formal Petition"');
  });
});
