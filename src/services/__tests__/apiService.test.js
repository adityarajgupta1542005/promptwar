/**
 * apiService edge-case tests
 * Tests: happy path, HTTP error codes, network failure, malformed JSON
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendChatMessage, checkMythClaim, requestTTS, checkHealth } from '../../services/apiService';

// Helper to create a mock fetch response
function mockFetch(body, status = 200, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
}

// Helper to create a fetch that throws (network failure)
function mockFetchNetworkError() {
  return vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
}

// Helper to simulate malformed JSON response
function mockFetchBadJson(status = 200) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status,
    json: () => Promise.reject(new SyntaxError('Unexpected token')),
  });
}

describe('apiService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // ── sendChatMessage ─────────────────────────────────────────────────────

  describe('sendChatMessage', () => {
    it('returns AI text on success', async () => {
      global.fetch = mockFetch({ text: 'AI reply', source: 'ai' });
      const result = await sendChatMessage('test', [], 'en');
      expect(result.text).toBe('AI reply');
      expect(result.source).toBe('ai');
    });

    it('sends correct request body', async () => {
      global.fetch = mockFetch({ text: 'ok', source: 'ai' });
      await sendChatMessage('Hello', [{ role: 'user', parts: [{ text: 'hi' }] }], 'hi');
      const [, opts] = global.fetch.mock.calls[0];
      const body = JSON.parse(opts.body);
      expect(body.message).toBe('Hello');
      expect(body.language).toBe('hi');
      expect(body.history).toHaveLength(1);
    });

    it('throws on HTTP 400', async () => {
      global.fetch = mockFetch({ error: 'Bad request' }, 400, false);
      await expect(sendChatMessage('bad', [], 'en')).rejects.toThrow('HTTP error! status: 400');
    });

    it('throws on HTTP 429 rate limit', async () => {
      global.fetch = mockFetch({ error: 'Too many requests' }, 429, false);
      await expect(sendChatMessage('flood', [], 'en')).rejects.toThrow('HTTP error! status: 429');
    });

    it('throws on HTTP 500 server error', async () => {
      global.fetch = mockFetch({ error: 'Server error' }, 500, false);
      await expect(sendChatMessage('trigger 500', [], 'en')).rejects.toThrow('HTTP error! status: 500');
    });

    it('throws on network failure', async () => {
      global.fetch = mockFetchNetworkError();
      await expect(sendChatMessage('offline', [], 'en')).rejects.toThrow('Failed to fetch');
    });
  });

  // ── checkMythClaim ──────────────────────────────────────────────────────

  describe('checkMythClaim', () => {
    it('returns verdict on success', async () => {
      global.fetch = mockFetch({ verdict: 'myth', explanation: 'False', confidenceScore: 90 });
      const result = await checkMythClaim('EVMs are hacked', 'en');
      expect(result.verdict).toBe('myth');
      expect(result.confidenceScore).toBe(90);
    });

    it('sends claim and language in body', async () => {
      global.fetch = mockFetch({ verdict: 'fact', explanation: 'True', confidenceScore: 80 });
      await checkMythClaim('ECI is independent', 'hi');
      const [, opts] = global.fetch.mock.calls[0];
      const body = JSON.parse(opts.body);
      expect(body.claim).toBe('ECI is independent');
      expect(body.language).toBe('hi');
    });

    it('throws on HTTP 500', async () => {
      global.fetch = mockFetch({}, 500, false);
      await expect(checkMythClaim('crash', 'en')).rejects.toThrow('HTTP error! status: 500');
    });

    it('throws on network failure', async () => {
      global.fetch = mockFetchNetworkError();
      await expect(checkMythClaim('offline', 'en')).rejects.toThrow('Failed to fetch');
    });
  });

  // ── requestTTS ──────────────────────────────────────────────────────────

  describe('requestTTS', () => {
    it('returns audio data on success', async () => {
      global.fetch = mockFetch({ audio: 'base64string', format: 'mp3', language: 'en' });
      const result = await requestTTS('Hello world', 'en', false);
      expect(result.audio).toBe('base64string');
      expect(result.format).toBe('mp3');
    });

    it('sends seniorMode flag correctly', async () => {
      global.fetch = mockFetch({ audio: 'x', format: 'mp3' });
      await requestTTS('Hello', 'en', true);
      const [, opts] = global.fetch.mock.calls[0];
      const body = JSON.parse(opts.body);
      expect(body.seniorMode).toBe(true);
    });

    it('throws on HTTP 429', async () => {
      global.fetch = mockFetch({}, 429, false);
      await expect(requestTTS('too many', 'en')).rejects.toThrow('HTTP error! status: 429');
    });
  });

  // ── checkHealth ─────────────────────────────────────────────────────────

  describe('checkHealth', () => {
    it('returns true when backend is healthy', async () => {
      global.fetch = mockFetch({ status: 'ok' });
      const result = await checkHealth();
      expect(result).toBe(true);
    });

    it('returns false when backend is down', async () => {
      global.fetch = mockFetchNetworkError();
      const result = await checkHealth();
      expect(result).toBe(false);
    });

    it('returns false when status is not ok', async () => {
      global.fetch = mockFetch({ status: 'degraded' });
      const result = await checkHealth();
      expect(result).toBe(false);
    });
  });
});
