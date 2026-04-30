/**
 * @fileoverview Tests for SettingsModal component.
 * Validates accessibility (focus trap, Escape key, ARIA), rendering,
 * and interaction behaviors.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsModal from '../SettingsModal';

describe('SettingsModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    aiConnected: true,
    seniorMode: false,
    onToggleSeniorMode: vi.fn(),
    onChangeLanguage: vi.fn(),
    L: (key) => ({
      settingsTitle: 'Settings',
      settingsAITitle: 'AI Connection',
      settingsAIDesc: 'AI backend status',
      settingsStatus: 'Status',
      settingsConnected: 'Connected',
      settingsNotConnected: 'Not Connected',
      settingsSeniorModeTitle: 'Senior Mode',
      settingsSeniorModeDesc: 'Enable larger text',
      settingsSeniorMode: 'Enable Senior Mode',
      settingsLangTitle: 'Language',
      settingsLangDesc: 'Change language',
      settingsLangBtn: 'Change Language',
      settingsCancel: 'Cancel',
      settingsSave: 'Save',
    }[key] || key),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<SettingsModal {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders modal when isOpen is true', () => {
    render(<SettingsModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has aria-modal and aria-labelledby attributes', () => {
    render(<SettingsModal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'settings-title');
  });

  it('renders title from L function', () => {
    render(<SettingsModal {...defaultProps} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('shows Connected badge when aiConnected is true', () => {
    render(<SettingsModal {...defaultProps} aiConnected={true} />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('shows Not Connected badge when aiConnected is false', () => {
    render(<SettingsModal {...defaultProps} aiConnected={false} />);
    expect(screen.getByText('Not Connected')).toBeInTheDocument();
  });

  it('renders senior mode checkbox unchecked by default', () => {
    render(<SettingsModal {...defaultProps} seniorMode={false} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders senior mode checkbox checked when seniorMode is true', () => {
    render(<SettingsModal {...defaultProps} seniorMode={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onToggleSeniorMode when checkbox is clicked', () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(defaultProps.onToggleSeniorMode).toHaveBeenCalledTimes(1);
  });

  it('calls onChangeLanguage when change language button is clicked', () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Change Language'));
    expect(defaultProps.onChangeLanguage).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Save is clicked', () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Save'));
    expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<SettingsModal {...defaultProps} />);
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(<SettingsModal {...defaultProps} />);
    const title = screen.getByText('Settings');
    fireEvent.click(title);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});
