import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiService from '../apiService';

describe('apiService', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('checkHealth returns true on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'ok' })
    });
    
    const isHealthy = await apiService.checkHealth();
    expect(isHealthy).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('/api/health', expect.any(Object));
  });

  it('checkHealth returns false on failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    
    const isHealthy = await apiService.checkHealth();
    expect(isHealthy).toBe(false);
  });

  it('sendChatMessage formats POST request correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'AI response', source: 'Bot' })
    });

    const result = await apiService.sendChatMessage('Hello', [], 'en');
    
    expect(result).toEqual({ text: 'AI response', source: 'Bot' });
    expect(global.fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ message: 'Hello', history: [], language: 'en' })
    }));
  });

  it('checkMythClaim formats POST request correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ verdict: 'fact', explanation: 'It is true', confidenceScore: 100 })
    });

    const result = await apiService.checkMythClaim('Claim text', 'en');
    
    expect(result).toEqual({ verdict: 'fact', explanation: 'It is true', confidenceScore: 100 });
    expect(global.fetch).toHaveBeenCalledWith('/api/myth', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ claim: 'Claim text', language: 'en' })
    }));
  });

  it('requestTTS formats POST request correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ audio: 'base64audio', format: 'mp3' })
    });

    const result = await apiService.requestTTS('Speak this', 'en', true);
    
    expect(result).toEqual({ audio: 'base64audio', format: 'mp3' });
    expect(global.fetch).toHaveBeenCalledWith('/api/speak', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ text: 'Speak this', language: 'en', seniorMode: true })
    }));
  });

  it('throws error on non-ok HTTP status in POST', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(apiService.sendChatMessage('Hello')).rejects.toThrow('HTTP error! status: 500');
  });
});
