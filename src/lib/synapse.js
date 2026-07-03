// Synapse Connection Layer: Connecting Auth and Analytics/History via Event Bridge

/**
 * Initializes the Synapse intelligence connection.
 * Listens for authentication events and bridges them to the Analytics/History system
 * without tightly coupling either system.
 */
export function initSynapse() {
  if (typeof window === 'undefined') return;

  window.addEventListener('justice-auth-login', (event) => {
    const { email, action, name, timestamp } = event.detail;

    // 1. Establish shared context (Auth System Data)
    const userContext = {
      email,
      name: name || email.split('@')[0],
      isAuthenticated: true,
      lastLogin: timestamp,
      segment: email.endsWith('.law') ? 'legal_professional' : 'citizen'
    };
    localStorage.setItem('justice_auth_user', JSON.stringify(userContext));

    console.log(`🧠 [Synapse] Intelligence Bridge Fired: Captured auth event for ${email}`);

    // 2. Inject into Analytics/History System (without direct dependencies)
    try {
      const historyKey = 'justice_ai_history';
      const currentHistoryRaw = localStorage.getItem(historyKey);
      const history = currentHistoryRaw ? JSON.parse(currentHistoryRaw) : [];

      // Inject an audit record into the user's history
      const auditRecord = {
        id: `audit-${Date.now()}`,
        role: 'system',
        content: `System Audit: User authenticated via ${action} flow. Synapse context established.`,
        timestamp: new Date().toISOString(),
        metadata: {
          synapse_bridge: true,
          user_segment: userContext.segment,
          action
        }
      };

      history.push(auditRecord);
      localStorage.setItem(historyKey, JSON.stringify(history));

      console.log(`🧠 [Synapse] Intelligence Bridge Complete: Injected audit record into ${historyKey}`);
    } catch (e) {
      console.error('🧠 [Synapse] Failed to bridge to analytics system:', e);
    }
  });
}
