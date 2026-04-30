/**
 * @fileoverview Tests for useSettings hook.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSettings } from '../useSettings';

describe('useSettings Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document.documentElement classes
    document.documentElement.className = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.isSettingsOpen).toBe(false);
    expect(result.current.seniorMode).toBe(false);
  });

  it('loads seniorMode from localStorage if present', () => {
    localStorage.setItem('seniorMode', 'true');
    const { result } = renderHook(() => useSettings());
    expect(result.current.seniorMode).toBe(true);
  });

  it('can open and close settings modal', () => {
    const { result } = renderHook(() => useSettings());
    
    act(() => {
      result.current.openSettings();
    });
    expect(result.current.isSettingsOpen).toBe(true);
    
    act(() => {
      result.current.closeSettings();
    });
    expect(result.current.isSettingsOpen).toBe(false);
  });

  it('toggles seniorMode, updates localStorage and HTML class', () => {
    const { result } = renderHook(() => useSettings());
    
    act(() => {
      result.current.toggleSeniorMode();
    });
    
    expect(result.current.seniorMode).toBe(true);
    expect(localStorage.getItem('seniorMode')).toBe('true');
    expect(document.documentElement.classList.contains('text-lg')).toBe(true);
    
    act(() => {
      result.current.toggleSeniorMode();
    });
    
    expect(result.current.seniorMode).toBe(false);
    expect(localStorage.getItem('seniorMode')).toBe('false');
    expect(document.documentElement.classList.contains('text-lg')).toBe(false);
  });
});
