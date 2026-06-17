import { describe, it, expect, vi } from 'vitest';
import { parseAIResponse } from './parseAnalysis';

describe('parseAIResponse', () => {
  it('should return rawText as chatMessage and null analysis if no analysis tag is present', () => {
    const rawText = "Hello! This is a simple response.";
    const result = parseAIResponse(rawText);
    expect(result).toEqual({
      chatMessage: rawText,
      analysis: null,
    });
  });

  it('should parse valid analysis JSON and return both chatMessage and analysis object', () => {
    const rawText = `Here is my response.
<analysis>
{
  "key": "value"
}
</analysis>
Hope this helps!`;
    const result = parseAIResponse(rawText);
    expect(result).toEqual({
      chatMessage: "Here is my response.\n\nHope this helps!",
      analysis: { key: "value" },
    });
  });

  it('should fallback to a default chat message if chatMessage is empty after stripping the analysis tag', () => {
    const rawText = `<analysis>
{
  "key": "value"
}
</analysis>`;
    const result = parseAIResponse(rawText);
    expect(result).toEqual({
      chatMessage: "I've analyzed your situation and developed a strategy based on Indian law. You can see the full details in the analysis panel on the right.",
      analysis: { key: "value" },
    });
  });

  it('should catch JSON parsing errors, return remaining chat message, and null analysis', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rawText = `Before text.
<analysis>
{
  "key": "value", invalid json
}
</analysis>
After text.`;
    const result = parseAIResponse(rawText);

    expect(result).toEqual({
      chatMessage: "Before text.\n\nAfter text.",
      analysis: null,
    });
    expect(consoleSpy).toHaveBeenCalledWith('AI provided an analysis block but JSON parsing failed:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('should catch JSON parsing errors, and return rawText if remaining chat message is empty', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rawText = `<analysis>
{
  "key": "value", invalid json
}
</analysis>`;
    const result = parseAIResponse(rawText);

    expect(result).toEqual({
      chatMessage: rawText,
      analysis: null,
    });
    expect(consoleSpy).toHaveBeenCalledWith('AI provided an analysis block but JSON parsing failed:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});
