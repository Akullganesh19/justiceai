export function parseAIResponse(rawText) {
  // Extract analysis JSON block
  const analysisMatch = rawText.match(/<analysis>([\s\S]*?)<\/analysis>/);

  if (!analysisMatch) {
    // No analysis block — just a conversational response
    return {
      chatMessage: rawText,
      analysis: null,
    };
  }

  try {
    const analysisJson = analysisMatch[1].trim();
    const analysis = JSON.parse(analysisJson);

    // Remove the analysis block from the chat message
    let chatMessage = rawText.replace(/<analysis>[\s\S]*?<\/analysis>/, '').trim();

    // Safety check - if chat message is empty after removal, use the last few lines or a fallback
    if (!chatMessage) {
      chatMessage =
        "I've analyzed your situation and developed a strategy based on Indian law. You can see the full details in the analysis panel on the right.";
    }

    return { chatMessage, analysis };
  } catch (_err) {
    // Even if JSON fails, we still want the chat part
    const chatMessage = rawText.replace(/<analysis>[\s\S]*?<\/analysis>/, '').trim();
    return {
      chatMessage: chatMessage || rawText,
      analysis: null,
    };
  }
}
