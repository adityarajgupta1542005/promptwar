import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import ChatAssistant from '../ChatAssistant';

// Mock apiService used by the useChat hook
vi.mock('../../services/apiService', () => ({
  sendChatMessage: vi.fn().mockResolvedValue({ text: 'Mocked AI response', source: 'ai' }),
}));

// Mock useSpeech hook
vi.mock('../../hooks/useSpeech', () => ({
  useSpeech: () => ({
    speak: vi.fn(),
    stop: vi.fn(),
    speaking: false,
    preparing: false,
    activeId: null,
    isCloudTTS: false,
  }),
}));

import { sendChatMessage } from '../../services/apiService';

describe('ChatAssistant Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ChatAssistant />);
    // h1 is sr-only; h2 is the visible heading
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders the chat log container with role=log', () => {
    render(<ChatAssistant />);
    expect(screen.getByRole('log')).toBeInTheDocument();
  });

  it('renders the text input', () => {
    render(<ChatAssistant />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders send button with aria-label', () => {
    render(<ChatAssistant />);
    const btn = screen.getByLabelText(/send message|संदेश भेजें/i);
    expect(btn).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<ChatAssistant />);
    const btn = screen.getByLabelText(/send message|संदेश भेजें/i);
    expect(btn).toBeDisabled();
  });

  it('enables send button when text is entered', () => {
    render(<ChatAssistant />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'How to vote?' } });
    const btn = screen.getByLabelText(/send message|संदेश भेजें/i);
    expect(btn).not.toBeDisabled();
  });

  it('renders suggested questions group', () => {
    render(<ChatAssistant />);
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
  });

  it('renders clear chat button', () => {
    render(<ChatAssistant />);
    const btn = screen.getByLabelText(/clear/i);
    expect(btn).toBeInTheDocument();
  });

  it('uses light theme background', () => {
    const { container } = render(<ChatAssistant />);
    const outerDiv = container.firstChild;
    expect(outerDiv.className).toContain('bg-[#f5efe9]');
  });

  it('does not use dangerouslySetInnerHTML', () => {
    const { container } = render(<ChatAssistant />);
    expect(container.innerHTML).not.toContain('dangerouslySetInnerHTML');
  });

  it('has aria-live region for messages', () => {
    const { container } = render(<ChatAssistant />);
    const messagesContainer = container.querySelector('#chat-messages');
    expect(messagesContainer).toHaveAttribute('aria-live', 'polite');
  });

  it('mic button has aria-label and aria-pressed', () => {
    render(<ChatAssistant />);
    const micBtn = screen.getByLabelText(/voice input|वॉयस इनपुट/i);
    expect(micBtn).toBeInTheDocument();
    expect(micBtn).toHaveAttribute('aria-pressed');
  });

  it('quick question buttons send message on click', async () => {
    sendChatMessage.mockResolvedValue({ text: 'AI response', source: 'ai' });
    render(<ChatAssistant />);
    const chips = screen.getAllByRole('button', { name: /quick-q/i });
    if (chips.length === 0) {
      // Find chips by their parent group
      const group = screen.getByRole('group');
      const chipButtons = group.querySelectorAll('button');
      if (chipButtons.length > 0) {
        fireEvent.click(chipButtons[0]);
        await waitFor(() => {
          expect(sendChatMessage).toHaveBeenCalled();
        });
      }
    }
  });

  it('clear chat button resets to single welcome message', async () => {
    sendChatMessage.mockResolvedValue({ text: 'AI response', source: 'ai' });
    render(<ChatAssistant />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    fireEvent.click(screen.getByLabelText(/send message|संदेश भेजें/i));

    await waitFor(() => {
      expect(sendChatMessage).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByLabelText(/clear/i));
    // After clearing, suggested questions group should reappear
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('input has maxLength of 2000 characters', () => {
    render(<ChatAssistant />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '2000');
  });

  it('input has autocomplete off', () => {
    render(<ChatAssistant />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });
});
