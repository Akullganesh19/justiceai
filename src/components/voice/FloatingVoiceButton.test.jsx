import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FloatingVoiceButton from './FloatingVoiceButton';

describe('FloatingVoiceButton Config Fetch Error Handling', () => {
  let originalFetch;
  let consoleSpy;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = vi.fn();
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
    consoleSpy.mockRestore();
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;
  });

  it('falls back to mock mode on fetch error when Web Speech API is not supported', async () => {
    // Ensure Web Speech API is not supported
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;

    global.fetch.mockRejectedValue(new Error('Network error'));

    render(<FloatingVoiceButton onTranscription={() => {}} />);

    // Open the popup
    const toggleBtn = screen.getByRole('button');
    fireEvent.click(toggleBtn);

    // Wait for the component to handle the error and update state
    await waitFor(() => {
      expect(screen.getByText('DEMO_BYPASS_MODE')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch voice config:', expect.any(Error));
  });

  it('falls back to webspeech mode on fetch error when Web Speech API is supported', async () => {
    // Mock Web Speech API support
    const MockSpeechRecognition = vi.fn().mockImplementation(() => ({
      stop: vi.fn(),
      start: vi.fn(),
      abort: vi.fn(),
    }));
    window.SpeechRecognition = MockSpeechRecognition;

    global.fetch.mockRejectedValue(new Error('Network error'));

    render(<FloatingVoiceButton onTranscription={() => {}} />);

    // Open the popup
    const toggleBtn = screen.getByRole('button');
    fireEvent.click(toggleBtn);

    // Wait for the component to handle the error and update state
    await waitFor(() => {
      expect(screen.getByText('SYSTEM_SPEECH_DRIVER')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch voice config:', expect.any(Error));
  });
});
