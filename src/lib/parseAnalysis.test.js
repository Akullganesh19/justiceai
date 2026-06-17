import { describe, it, expect } from 'vitest';
import { parseAIResponse } from './parseAnalysis';

describe('parseAIResponse', () => {
  it('should parse a valid response with chat and analysis block', () => {
    const rawText = `Hello, this is the chat part.
<analysis>
{
  "summary": "This is a summary",
  "keyPoints": ["Point 1", "Point 2"]
}
</analysis>
And this is some more chat part.`;

    const result = parseAIResponse(rawText);

    expect(result.chatMessage).toBe(`Hello, this is the chat part.\n\nAnd this is some more chat part.`);
    expect(result.analysis).toEqual({
      summary: "This is a summary",
      keyPoints: ["Point 1", "Point 2"]
    });
  });

  it('should return null analysis and raw text if no analysis block is present', () => {
    const rawText = `This is just a normal conversational response without any analysis block.`;

    const result = parseAIResponse(rawText);

    expect(result.chatMessage).toBe(rawText);
    expect(result.analysis).toBeNull();
  });

  it('should use a fallback chat message if chat message is empty after removing analysis', () => {
    const rawText = `<analysis>
{
  "data": "only analysis here"
}
</analysis>`;

    const result = parseAIResponse(rawText);

    expect(result.chatMessage).toBe("I've analyzed your situation and developed a strategy based on Indian law. You can see the full details in the analysis panel on the right.");
    expect(result.analysis).toEqual({ data: "only analysis here" });
  });

  it('should handle invalid JSON in analysis block and return null analysis with extracted chat message', () => {
    const rawText = `Chat before analysis.
<analysis>
{
  "invalid": "json",
  missing quotes around this key
}
</analysis>
Chat after analysis.`;

    const result = parseAIResponse(rawText);

    expect(result.chatMessage).toBe(`Chat before analysis.\n\nChat after analysis.`);
    expect(result.analysis).toBeNull();
  });

  it('should handle invalid JSON and fallback to rawText if extracted chat message is empty', () => {
      const rawText = `<analysis>
  {
    "invalid": "json",
    missing quotes around this key
  }
  </analysis>`;

      const result = parseAIResponse(rawText);

      // In the catch block:
      // const chatMessage = rawText.replace(/<analysis>[\s\S]*?<\/analysis>/, '').trim(); // ''
      // return { chatMessage: chatMessage || rawText, analysis: null }

      expect(result.chatMessage).toBe(rawText);
      expect(result.analysis).toBeNull();
    });
});
