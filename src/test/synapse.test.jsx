import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from '../components/ui/ErrorBoundary';

const ProblemChild = ({ shouldThrow }) => {
  if (shouldThrow) throw new Error('Test error');
  return <div>Safe</div>;
};

describe('Synapse: Auth <-> ErrorBoundary Connection', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('enriches error logs with user context via event bridge', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender, unmount } = render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    // Simulate Auth system identifying a user
    const user = { email: 'test@justiceai.law', role: 'advocate' };
    window.dispatchEvent(new CustomEvent('justice-auth-identified', { detail: user }));

    // Trigger error
    rerender(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    const logCall = consoleSpy.mock.calls.find(call =>
      typeof call[0] === 'string' && call[0] === '[ENRICHED_ERROR_LOG] Caught error for user:'
    );

    expect(logCall).toBeDefined();
    expect(logCall[1]).toContain('test@justiceai.law');

    unmount();
  });
});
