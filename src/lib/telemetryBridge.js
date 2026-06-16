export function enrichErrorReport(errorEventData) {
  const userContext = localStorage.getItem('justice_auth_user');
  const user = userContext ? JSON.parse(userContext) : { id: 'anonymous', role: 'guest' };

  return {
    ...errorEventData,
    userId: user.email || user.id,
    userName: user.name || 'Anonymous',
  };
}

export function initTelemetryBridge() {
  window.addEventListener('justice.system.error', (event) => {
    const enrichedError = enrichErrorReport(event.detail);

    // In a real application, this would send to an analytics/monitoring service
    // For Synapse, we just log the enriched data to show the connection firing
    console.log('[Synapse Bridge] Enriched error event fired:', {
      direction: 'ErrorBoundary ↔ Telemetry',
      enrichedData: enrichedError
    });

    // Emitting another event for potential further downstream consumers
    window.dispatchEvent(new CustomEvent('justice.telemetry.logged', {
      detail: enrichedError
    }));
  });

  console.log('[Synapse Bridge] Telemetry bridge initialized. Listening for justice.system.error events.');
}
