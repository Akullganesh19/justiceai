import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import FloatingVoiceButton from './FloatingVoiceButton.jsx';

describe('FloatingVoiceButton unsupported edge case', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ bhashini: { available: false } })
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('verifies the error message when Web Speech API is supported but initialization fails', async () => {
    const originalWarn = console.warn;
    console.warn = vi.fn(); // Suppress the warning we just added

    // Simulate a browser where SpeechRecognition is defined but instantiation fails
    Object.defineProperty(window, 'SpeechRecognition', {
      writable: true,
      configurable: true,
      value: class FakeSpeechRecognition {
        constructor() {
          throw new Error('Initialization failed');
        }
      }
    });

    render(<FloatingVoiceButton onTranscription={() => {}} />);

    // Trigger checkVoiceConfig
    const mainButton = screen.getByRole('button');
    fireEvent.click(mainButton);

    // Wait until it enters webspeech mode
    await waitFor(() => {
      expect(screen.getByText('SYSTEM_SPEECH_DRIVER')).toBeInTheDocument();
    });

    // Find the record button and click it
    const buttons = screen.getAllByRole('button');
    const recordButton = buttons.find(btn => btn.className.includes('w-24'));
    fireEvent.click(recordButton);

    // It should hit the exact edge case: `!recognition` evaluates to true,
    // and it sets the error message!
    await waitFor(() => {
      expect(screen.getByText('Web Speech API not available in this browser.')).toBeInTheDocument();
    });

    console.warn = originalWarn;
    delete window.SpeechRecognition;
  });
});
