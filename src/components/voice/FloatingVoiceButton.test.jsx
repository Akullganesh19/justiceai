import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FloatingVoiceButton from './FloatingVoiceButton';
import { vi, expect, describe, it, beforeEach, afterEach } from 'vitest';
import '../../test/setup.js';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      button: ({ children, ...props }) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

describe('FloatingVoiceButton Error Handling', () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();

    // Suppress console.error in this test to avoid polluting test output
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock fetch for server config
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ bhashini: { available: true } }),
    });

    // Mock navigator.mediaDevices
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn(),
      },
      writable: true,
    });

    // Mock window.MediaRecorder
    window.MediaRecorder = vi.fn().mockImplementation(() => ({
        start: vi.fn(),
        stop: vi.fn(),
        ondataavailable: vi.fn(),
        onstop: vi.fn(),
        stream: {
            getTracks: () => [{ stop: vi.fn() }]
        }
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles Bhashini mic access failure correctly', async () => {
    // Setup the mic error
    const micError = new Error('Permission denied');
    micError.name = 'NotAllowedError';
    navigator.mediaDevices.getUserMedia.mockRejectedValue(micError);

    render(<FloatingVoiceButton onTranscription={() => {}} />);

    // Open the floating voice panel
    const openButton = screen.getByRole('button');
    fireEvent.click(openButton);

    // Wait for panel to open and fetch to complete
    await waitFor(() => {
      expect(screen.getByText('BHASHINI')).toBeInTheDocument();
    });

    // Verify initial text
    const startText = screen.getByText(/PRESS MIC TO START/i);
    expect(startText).toBeInTheDocument();

    // Click the actual record button
    const recordButtons = screen.getAllByRole('button');
    // First is close, second is record, third is the floating toggle
    fireEvent.click(recordButtons[1]);

    // Check if error message appears correctly
    await waitFor(() => {
      expect(screen.getByText('Microphone permission denied. Please allow access.')).toBeInTheDocument();
    });

    // Test the fallback error block too
    const unknownError = new Error('Unknown problem');
    unknownError.name = 'UnknownError';
    navigator.mediaDevices.getUserMedia.mockRejectedValue(unknownError);

    fireEvent.click(recordButtons[1]);

    await waitFor(() => {
      expect(screen.getByText('Microphone access error. Please check your settings.')).toBeInTheDocument();
    });
  });
});
