import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { useChat } from '../useChat';

// Mock the apiService layer used by useChat
vi.mock('../../services/apiService', () => ({
  sendChatMessage: vi.fn(),
}));

import { sendChatMessage } from '../../services/apiService';

function wrapper({ children }) {
  localStorage.setItem('votesmart_language', 'en');
  return (
    <BrowserRouter>
      <LanguageProvider>{children}</LanguageProvider>
    </BrowserRouter>
  );
}

describe('useChat hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('votesmart_language', 'en');
  });

  it('initializes with a welcome message', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('assistant');
  });

  it('initializes with empty input', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.input).toBe('');
  });

  it('initializes with loading false', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.loading).toBe(false);
  });

  it('initializes with isListening false', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.isListening).toBe(false);
  });

  it('updates input value', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    act(() => {
      result.current.setInput('Hello');
    });
    expect(result.current.input).toBe('Hello');
  });

  it('does not send empty messages', async () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    await act(async () => {
      await result.current.send('');
    });
    expect(sendChatMessage).not.toHaveBeenCalled();
    expect(result.current.messages).toHaveLength(1);
  });

  it('does not send whitespace-only messages', async () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    await act(async () => {
      result.current.setInput('   ');
      await result.current.send();
    });
    expect(sendChatMessage).not.toHaveBeenCalled();
  });

  it('does not send when already loading', async () => {
    sendChatMessage.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ text: 'ok', source: 'ai' }), 500))
    );
    const { result } = renderHook(() => useChat(), { wrapper });

    // Start first send (will be loading)
    act(() => { result.current.setInput('first'); });
    const firstSend = act(async () => { await result.current.send(); });

    // Attempt second send while loading (should be ignored)
    await act(async () => { await result.current.send('second'); });
    await firstSend;

    // sendChatMessage should only have been called once
    expect(sendChatMessage).toHaveBeenCalledTimes(1);
  });

  it('clears chat to welcome message only', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    act(() => {
      result.current.clearChat();
    });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('assistant');
  });

  it('provides quick questions', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.quickQuestions).toBeInstanceOf(Array);
    expect(result.current.quickQuestions.length).toBeGreaterThan(0);
  });

  it('sends message and receives response', async () => {
    sendChatMessage.mockResolvedValue({ text: 'AI response', source: 'ai' });
    const { result } = renderHook(() => useChat(), { wrapper });

    await act(async () => {
      await result.current.send('How to register?');
    });

    expect(result.current.messages.length).toBeGreaterThan(1);
    const userMsg = result.current.messages.find((m) => m.content === 'How to register?');
    expect(userMsg).toBeTruthy();
    expect(userMsg.role).toBe('user');
  });

  it('appends AI response after user message', async () => {
    sendChatMessage.mockResolvedValue({ text: 'You can register at nvsp.in', source: 'ai' });
    const { result } = renderHook(() => useChat(), { wrapper });

    await act(async () => {
      await result.current.send('How to register?');
    });

    const aiMsg = result.current.messages.find(
      (m) => m.role === 'assistant' && m.content === 'You can register at nvsp.in'
    );
    expect(aiMsg).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });

  it('handles API failure gracefully', async () => {
    sendChatMessage.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useChat(), { wrapper });

    await act(async () => {
      await result.current.send('test');
    });

    const errorMsg = result.current.messages.find((m) => m.source === 'error');
    expect(errorMsg).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });

  it('handles 429 rate-limit error gracefully', async () => {
    const err = new Error('HTTP error! status: 429');
    sendChatMessage.mockRejectedValue(err);
    const { result } = renderHook(() => useChat(), { wrapper });

    await act(async () => {
      await result.current.send('test rate limit');
    });

    const errorMsg = result.current.messages.find((m) => m.source === 'error');
    expect(errorMsg).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });

  it('handles 500 server error gracefully', async () => {
    sendChatMessage.mockRejectedValue(new Error('HTTP error! status: 500'));
    const { result } = renderHook(() => useChat(), { wrapper });

    await act(async () => {
      await result.current.send('trigger 500');
    });

    const errorMsg = result.current.messages.find((m) => m.source === 'error');
    expect(errorMsg).toBeTruthy();
  });

  it('truncates input at 2000 characters', async () => {
    sendChatMessage.mockResolvedValue({ text: 'ok', source: 'ai' });
    const { result } = renderHook(() => useChat(), { wrapper });
    const longInput = 'a'.repeat(2500);

    await act(async () => {
      await result.current.send(longInput);
    });

    const userMsg = result.current.messages.find((m) => m.role === 'user');
    expect(userMsg.content.length).toBe(2000);
  });
});
