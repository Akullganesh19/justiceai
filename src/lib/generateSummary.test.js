import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateSummary } from './generateSummary.js';

describe('generateSummary', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // 6 April 2026
    vi.setSystemTime(new Date('2026-04-06T10:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return empty string when analysis is missing', () => {
    const result = generateSummary([], null);
    expect(result).toBe('');
  });

  it('should generate a summary with fully populated fields', () => {
    const messages = [
      { role: 'user', content: 'My neighbor built a fence on my property.' },
      { role: 'assistant', content: 'I can help with that.' },
      { role: 'user', content: 'I have the property deed.' }
    ];

    const analysis = {
      caseType: 'Property Dispute',
      verdict: 'favorable',
      confidence: 85,
      strategy: [
        'Send a formal notice',
        'File a civil suit if notice is ignored'
      ],
      laws: [
        { act: 'Specific Relief Act, 1963', description: 'Recovery of specific immovable property.' }
      ],
      arguments: {
        for: ['Clear boundary demarcated in deed'],
        against: ['Neighbor claims adverse possession']
      }
    };

    const result = generateSummary(messages, analysis);

    expect(result).toContain('=== JusticeAI Case Summary ===');
    expect(result).toContain('Generated: ');
    expect(result).toContain('CASE TYPE: Property Dispute');
    expect(result).toContain('PREDICTED OUTCOME: FAVORABLE (85% confidence)');

    // Check case facts
    expect(result).toContain('1. My neighbor built a fence on my property.');
    expect(result).toContain('2. I have the property deed.');
    expect(result).not.toContain('I can help with that.'); // Exclude assistant

    // Check strategy
    expect(result).toContain('1. Send a formal notice');
    expect(result).toContain('2. File a civil suit if notice is ignored');

    // Check laws
    expect(result).toContain('• Specific Relief Act, 1963\n  Recovery of specific immovable property.');

    // Check arguments
    expect(result).toContain('✓ Clear boundary demarcated in deed');
    expect(result).toContain('✗ Neighbor claims adverse possession');

    // Disclaimer
    expect(result).toContain('Disclaimer: JusticeAI provides legal information, not legal advice.');
  });

  it('should handle missing partial fields in analysis with fallbacks', () => {
    const messages = [
      { role: 'user', content: 'I have a legal question.' }
    ];

    const analysis = {}; // Empty analysis

    const result = generateSummary(messages, analysis);

    expect(result).toContain('CASE TYPE: Legal Inquiry');
    expect(result).toContain('PREDICTED OUTCOME: N/A (0% confidence)');
    expect(result).toContain('Strategy not yet developed.');
    expect(result).toContain('Laws not yet cited.');
    expect(result).toContain('Arguments not yet listed.');
    expect(result).toContain('Counter-arguments not yet listed.');
  });

  it('should handle missing user messages with fallback', () => {
    const messages = [
      { role: 'assistant', content: 'How can I help?' }
    ];

    const analysis = {
      caseType: 'General',
    };

    const result = generateSummary(messages, analysis);

    expect(result).toContain('No case facts provided.');
  });
});
