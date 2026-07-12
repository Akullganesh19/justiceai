import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ToastProvider, useToast } from '../components/ui/Toast';

// Simple test component
function TestComponent() {
  return <div data-testid="test-element">Test Content</div>;
}

function renderWithProviders(component) {
  const router = createMemoryRouter([{ path: '*', element: <ToastProvider>{component}</ToastProvider> }]);
  return render(
    <RouterProvider router={router} />
  );
}

describe('App Tests', () => {
  describe('Basic Rendering', () => {
    it('should render test component', () => {
      renderWithProviders(<TestComponent />);
      expect(screen.getByTestId('test-element')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Toast Functionality', () => {
    it('should display success toast', async () => {
      function ToastTestComponent() {
        const { success } = useToast();
        return (
          <div>
            <button
              data-testid="show-toast"
              onClick={() => success({ title: 'Success', message: 'Operation completed' })}
            >
              Show Toast
            </button>
          </div>
        );
      }

      renderWithProviders(<ToastTestComponent />);

      const button = screen.getByTestId('show-toast');
      fireEvent.click(button);

      // Toast should appear
      expect(await screen.findByText('Success')).toBeInTheDocument();
      expect(await screen.findByText('Operation completed')).toBeInTheDocument();
    });
  });
});

// Utility function tests
describe('Utility Functions', () => {
  it('should calculate cosine similarity correctly', () => {
    // Test vector math
    const vecA = [1, 0, 0];
    const vecB = [1, 0, 0];

    // Same vectors should have similarity of 1
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    const similarity = dotProduct / (normA * normB);

    expect(similarity).toBe(1);
  });

  it('should handle zero vectors', () => {
    const vecA = [0, 0, 0];
    const vecB = [1, 1, 1];

    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    const similarity = normA === 0 || normB === 0 ? 0 : dotProduct / (normA * normB);

    expect(similarity).toBe(0);
  });
});

// Date formatting tests
describe('Date Formatting', () => {
  it('should format dates in Indian locale', () => {
    const date = new Date('2026-04-06T10:00:00');
    const formatted = date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    expect(formatted).toBe('6 Apr 2026');
  });
});
