import { describe, it, expect } from 'vitest';
import { generateSummary } from './generateSummary';

describe('generateSummary', () => {
  it('should return an empty string if analysis is falsy', () => {
    // Missing boundary test for generateSummary with empty analysis
    expect(generateSummary([], null)).toBe('');
    expect(generateSummary([], undefined)).toBe('');
    expect(generateSummary([], false)).toBe('');
  });

  it('should generate a summary when analysis is provided', () => {
    const messages = [{ role: 'user', content: 'Test fact' }];
    const analysis = {
      caseType: 'Civil',
      verdict: 'Favorable',
      confidence: 80,
      strategy: ['Step 1'],
      laws: [{ act: 'Test Act', description: 'Test description' }],
      arguments: {
        for: ['Arg 1'],
        against: ['Counter 1']
      }
    };

    const summary = generateSummary(messages, analysis);
    expect(summary).toContain('CASE TYPE: Civil');
    expect(summary).toContain('PREDICTED OUTCOME: FAVORABLE');
    expect(summary).toContain('1. Test fact');
  });

  it('should handle missing fields in analysis and messages gracefully', () => {
    const summary = generateSummary([], {});
    expect(summary).toContain('CASE TYPE: Legal Inquiry');
    expect(summary).toContain('PREDICTED OUTCOME: N/A');
    expect(summary).toContain('No case facts provided.');
    expect(summary).toContain('Strategy not yet developed.');
  });
});
