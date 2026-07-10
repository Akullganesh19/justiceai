export function initializeEventBridge() {
  if (typeof window === 'undefined') return;

  window.addEventListener('justice-ai-milestone-completed', (event) => {
    console.log('[Synapse Bridge] Receive: justice-ai-milestone-completed', event.detail);
    const { caseName, stepLabel, nextStepLabel } = event.detail;

    try {
      const chatKey = 'justice_ai_simple_chat';
      const existingData = localStorage.getItem(chatKey);
      let messages = [];

      if (existingData) {
        messages = JSON.parse(existingData);
      } else {
        // Fallback default message if chat was never opened
        messages = [{
          id: 'welcome',
          role: 'assistant',
          content: 'Welcome to JusticeAI. Powered by Openclaw (gemma3:4b), functioning securely on your local environment to ensure total data confidentiality.\n\nHow may I assist you with your legal matters today?',
          timestamp: new Date().toISOString(),
          isTyping: false
        }];
      }

      let content = `I noticed you just completed the milestone "${stepLabel}" for your case "${caseName}". Excellent progress.`;
      if (nextStepLabel) {
        content += ` The next step is "${nextStepLabel}". Would you like me to help you prepare for that?`;
      } else {
        content += ` You have completed all steps for this case! Is there anything else you need assistance with?`;
      }

      const intelligenceMessage = {
        id: `bridge-${Date.now()}`,
        role: 'assistant',
        content: content,
        timestamp: event.detail.timestamp || new Date().toISOString(),
        isTyping: false
      };

      messages.push(intelligenceMessage);
      localStorage.setItem(chatKey, JSON.stringify(messages));
      // Dispatch a storage event so same window updates without refresh
      window.dispatchEvent(new StorageEvent('storage', { key: chatKey, newValue: JSON.stringify(messages) }));
    } catch (e) {
      console.error('Event Bridge Error:', e);
    }
  });
}
