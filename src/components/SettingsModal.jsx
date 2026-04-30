/**
 * SettingsModal — Modal dialog for application settings.
 *
 * Provides controls for:
 *  - AI connection status display
 *  - Senior mode toggle (larger text, slower TTS)
 *  - Language switching
 *
 * Implements focus trap and keyboard dismissal (Escape key) for accessibility.
 *
 * @module SettingsModal
 */
import { useEffect, useRef, useCallback } from 'react';

/**
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {Function} props.onClose - Called when the modal should close.
 * @param {Function} props.onSave - Called when user clicks Save.
 * @param {boolean} props.aiConnected - Whether the AI backend is reachable.
 * @param {boolean} props.seniorMode - Current senior mode state.
 * @param {Function} props.onToggleSeniorMode - Toggle senior mode callback.
 * @param {Function} props.onChangeLanguage - Reset language selection callback.
 * @param {Function} props.L - Translation function (key) => string.
 * @returns {JSX.Element|null}
 */
export default function SettingsModal({
  isOpen,
  onClose,
  onSave,
  aiConnected,
  seniorMode,
  onToggleSeniorMode,
  onChangeLanguage,
  L,
}) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Store the element that had focus before opening
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
    }
  }, [isOpen]);

  // Focus trap & keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    /** @param {KeyboardEvent} e */
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Auto-focus first focusable element
    const timer = requestAnimationFrame(() => {
      const first = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(timer);
      // Restore focus to previous element
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleContentClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      id="settings-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md p-6 animate-modal-fade-in"
        onClick={handleContentClick}
      >
        <h2 id="settings-title" className="text-[#8b5e34] font-bold text-2xl mb-6">
          {L('settingsTitle')}
        </h2>

        <div className="space-y-6">
          {/* AI Status */}
          <section className="space-y-2">
            <h3 className="text-gray-800 font-semibold text-lg">{L('settingsAITitle')}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{L('settingsAIDesc')}</p>
            <div className="text-sm font-medium mt-2 text-gray-500">
              <span className="text-gray-600">{L('settingsStatus')}:</span>{' '}
              {aiConnected ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                  {L('settingsConnected')}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                  {L('settingsNotConnected')}
                </span>
              )}
            </div>
          </section>

          {/* Senior Mode */}
          <section className="space-y-2">
            <h3 className="text-gray-800 font-semibold text-lg">{L('settingsSeniorModeTitle')}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{L('settingsSeniorModeDesc')}</p>
            <label className="flex items-center gap-3 cursor-pointer mt-2 text-gray-600 hover:text-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={seniorMode}
                onChange={onToggleSeniorMode}
                className="w-5 h-5 rounded border-gray-300 bg-white text-[#bfa085] focus:ring-[#bfa085] focus:ring-offset-white cursor-pointer"
              />
              <span>{L('settingsSeniorMode')}</span>
            </label>
          </section>

          {/* Language */}
          <section className="space-y-2">
            <h3 className="text-gray-800 font-semibold text-lg">{L('settingsLangTitle')}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{L('settingsLangDesc')}</p>
            <button
              className="mt-2 px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 text-sm hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-[#bfa085]"
              onClick={onChangeLanguage}
              id="change-lang-btn"
              type="button"
            >
              {L('settingsLangBtn')}
            </button>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            className="px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={onClose}
            type="button"
          >
            {L('settingsCancel')}
          </button>
          <button
            className="px-6 py-3 bg-[#bfa085] rounded-xl text-white hover:opacity-90 font-semibold transition-opacity focus:outline-none focus:ring-2 focus:ring-[#bfa085]"
            onClick={onSave}
            id="save-settings-btn"
            type="button"
          >
            {L('settingsSave')}
          </button>
        </div>
      </div>
    </div>
  );
}
