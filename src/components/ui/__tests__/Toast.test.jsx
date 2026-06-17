import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useToast, ToastProvider } from '../Toast';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useToast hook', () => {
  // Suppress console.error for expected errors during tests
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  it('should throw an error when used outside of ToastProvider', () => {
    expect(() => renderHook(() => useToast())).toThrow(
      'useToast must be used within a ToastProvider'
    );
  });

  it('should provide toast context methods when used within ToastProvider', () => {
    const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;
    const { result } = renderHook(() => useToast(), { wrapper });

    expect(result.current).toHaveProperty('toasts');
    expect(result.current).toHaveProperty('addToast');
    expect(result.current).toHaveProperty('removeToast');
    expect(result.current).toHaveProperty('success');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('warning');
    expect(result.current).toHaveProperty('info');

    // Initially toasts should be empty
    expect(result.current.toasts).toEqual([]);
  });

  it('should add and remove toasts correctly', () => {
    const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;
    const { result } = renderHook(() => useToast(), { wrapper });

    // Add a success toast
    act(() => {
      result.current.success({ title: 'Success', message: 'Test message' });
    });

    expect(result.current.toasts).toHaveLength(1);
    const addedToast = result.current.toasts[0];
    expect(addedToast.type).toBe('success');
    expect(addedToast.title).toBe('Success');
    expect(addedToast.message).toBe('Test message');

    // Remove the toast
    act(() => {
      result.current.removeToast(addedToast.id);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should add other types of toasts correctly', () => {
    const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.error({ title: 'Error', message: 'Error message' });
      result.current.warning({ title: 'Warning', message: 'Warning message' });
      result.current.info({ title: 'Info', message: 'Info message' });
    });

    expect(result.current.toasts).toHaveLength(3);

    // Check error toast
    expect(result.current.toasts[0].type).toBe('error');
    expect(result.current.toasts[0].title).toBe('Error');

    // Check warning toast
    expect(result.current.toasts[1].type).toBe('warning');
    expect(result.current.toasts[1].title).toBe('Warning');

    // Check info toast
    expect(result.current.toasts[2].type).toBe('info');
    expect(result.current.toasts[2].title).toBe('Info');
  });

  it('should use addToast directly', () => {
    const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('custom', { title: 'Custom', message: 'Custom message' });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('custom');
    expect(result.current.toasts[0].title).toBe('Custom');
  });
});
