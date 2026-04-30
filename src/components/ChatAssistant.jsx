/**
 * ChatAssistant — AI chat interface with voice input and text-to-speech.
 *
 * Features:
 *  - Real-time messaging with AI backend via useChat hook
 *  - Voice input via Web Speech API
 *  - Text-to-speech playback via useSpeech hook
 *  - Quick suggestion chips for common questions
 *  - Accessible: ARIA live regions, keyboard navigation, screen reader labels
 *
 * @module ChatAssistant
 */
import { useState, useCallback } from 'react';
import { useChat } from '../hooks/useChat';
import { useSpeech } from '../hooks/useSpeech';
import ListenButton from './ListenButton';
import { IconSend, IconMic } from './icons';

/**
 * Safely renders markdown-like text to React elements.
 * Handles bold (**text**), bullet points (- text), and newlines.
 * Uses no dangerouslySetInnerHTML for XSS safety.
 *
 * @param {string} text - Raw message text.
 * @returns {JSX.Element[]} Array of React elements.
 */
function renderMessage(text) {
  return text.split('\n').map((line, idx, arr) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('- ')) {
        return <span key={j}>• {part.slice(2)}</span>;
      }
      return <span key={j}>{part}</span>;
    });
    return (
      <span key={idx}>
        {rendered}
        {idx < arr.length - 1 && <br />}
      </span>
    );
  });
}

/**
 * ChatAssistant page component.
 * @returns {JSX.Element}
 */
export default function ChatAssistant() {
  const {
    messages,
    input,
    setInput,
    loading,
    isListening,
    endRef,
    quickQuestions,
    send,
    clearChat,
    startVoiceInput,
    language,
    L,
  } = useChat();

  const { speak, speaking, preparing, activeId } = useSpeech();
  const [playedIds, setPlayedIds] = useState(new Set());

  const listenLabel = language === 'hi' ? 'सुनें' : 'Listen';

  /** Handle TTS playback for a specific message. */
  const handleListenClick = useCallback(
    (msgId, content) => {
      setPlayedIds((prev) => new Set(prev).add(msgId));
      speak(content, language, msgId);
    },
    [speak, language]
  );

  /** Compute status bar text based on current state. */
  const statusText = loading
    ? L('chatThinking')
    : preparing
      ? (language === 'hi' ? 'AI आवाज़ तैयार कर रहा है...' : 'AI is preparing to speak...')
      : speaking
        ? (language === 'hi' ? 'AI बोल रहा है...' : 'AI is speaking...')
        : L('chatReady');

  return (
    <div className="bg-[#f5efe9] min-h-[calc(100vh-80px)] p-4 flex justify-center items-start pt-8">
      <div className="w-full max-w-3xl">
        {/* Page-level heading for screen readers (maintains heading hierarchy) */}
        <h1 className="sr-only">{L('chatTitle')}</h1>

        <div
          className="rounded-2xl border border-gray-200 shadow-md bg-white p-6 flex flex-col h-[75vh]"
          id="chat-container"
          role="log"
          aria-label={L('chatTitle')}
        >
          {/* Visible header */}
          <header className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">🗳️</span>
              <div>
                <h2 className="text-[#8b5e34] font-semibold text-xl m-0" id="chat-heading">
                  {L('chatTitle')}
                </h2>
                <p className="text-sm text-gray-500" aria-live="polite" aria-atomic="true">
                  {statusText}
                </p>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#bfa085] transition-colors"
              onClick={clearChat}
              id="clear-chat-btn"
              type="button"
              aria-label={language === 'hi' ? 'चैट साफ़ करें' : 'Clear chat'}
            >
              {L('chatClear')}
            </button>
          </header>

          {/* Messages List */}
          <div
            className="flex-1 overflow-y-auto space-y-4 pr-2"
            id="chat-messages"
            aria-live="polite"
            aria-relevant="additions"
            aria-label={language === 'hi' ? 'संदेश सूची' : 'Message list'}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                {msg.role === 'assistant' && (
                  <span className="text-2xl mr-2 mt-1 flex-shrink-0" aria-hidden="true">🗳️</span>
                )}
                <div
                  className={`p-3 max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-[#bfa085] text-white rounded-xl rounded-tr-sm shadow-md'
                      : 'bg-[#f5efe9] border border-gray-200 text-gray-800 rounded-xl rounded-tl-sm'
                  }`}
                >
                  <div className="text-sm md:text-base leading-relaxed">
                    {renderMessage(msg.content)}
                  </div>
                  {msg.role === 'assistant' && i > 0 && (
                    <div className="mt-2">
                      <ListenButton
                        onClick={() => handleListenClick(`chat-${i}`, msg.content)}
                        isPlaying={speaking && activeId === `chat-${i}`}
                        isPreparing={preparing && activeId === `chat-${i}`}
                        hasPlayed={playedIds.has(`chat-${i}`)}
                        label={listenLabel}
                      />
                    </div>
                  )}
                  {msg.source === 'offline' && (
                    <span className="block mt-2 text-xs text-[#8b5e34] italic">
                      {L('chatOfflineNote')}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <span className="text-2xl mr-2 mt-1 flex-shrink-0" aria-hidden="true">🗳️</span>
                <div
                  className="bg-[#f5efe9] border border-gray-200 text-gray-700 p-4 rounded-xl rounded-tl-sm flex items-center gap-2"
                  role="status"
                  aria-label={L('chatThinking')}
                >
                  <span className="text-sm text-gray-500">{L('chatThinking')}</span>
                  <div className="flex gap-1" aria-hidden="true">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Quick suggestion chips */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label={language === 'hi' ? 'सुझाए गए प्रश्न' : 'Suggested questions'}>
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:text-[#8b5e34] hover:border-[#bfa085]/50 hover:bg-[#f5efe9] focus:outline-none focus:ring-2 focus:ring-[#bfa085] transition-all text-left"
                  onClick={() => send(q)}
                  id={`quick-q-${i}`}
                  type="button"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2" id="chat-input-area">
            <label htmlFor="chat-input" className="sr-only">
              {language === 'hi' ? 'संदेश टाइप करें' : 'Type your message'}
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && send()}
              placeholder={
                isListening
                  ? (language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...')
                  : L('chatPlaceholder')
              }
              disabled={loading || isListening}
              className="flex-1 bg-[#f5efe9] border border-gray-300 rounded-full text-gray-800 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#bfa085]/40 focus:border-[#bfa085] placeholder:text-gray-400 transition-all"
              id="chat-input"
              maxLength={2000}
              autoComplete="off"
            />
            <button
              className={`p-3 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#bfa085] ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-[#8b5e34]'
              }`}
              onClick={startVoiceInput}
              disabled={loading}
              id="mic-btn"
              type="button"
              aria-label={isListening ? (language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...') : (language === 'hi' ? 'वॉयस इनपुट शुरू करें' : 'Start voice input')}
              aria-pressed={isListening}
            >
              <IconMic />
            </button>
            <button
              className="bg-[#bfa085] p-3 rounded-full text-white hover:opacity-90 flex items-center justify-center transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md focus:outline-none focus:ring-2 focus:ring-[#bfa085]"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              id="send-btn"
              type="button"
              aria-label={language === 'hi' ? 'संदेश भेजें' : 'Send message'}
            >
              <IconSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
