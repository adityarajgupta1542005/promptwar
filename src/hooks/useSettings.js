/**
 * useSettings — Custom hook for application settings management.
 *
 * Manages:
 *  - Settings modal visibility
 *  - Senior mode preference (persisted in localStorage)
 *  - AI connection status
 *  - Language reset
 *
 * @module useSettings
 */
import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/** localStorage key for senior mode preference */
const SENIOR_MODE_KEY = 'votesmart_senior_mode';

/** localStorage key for language preference */
const LANGUAGE_KEY = 'votesmart_language';

/**
 * @returns {object} Settings state and handlers.
 */
export function useSettings() {
  const { language, setLanguage } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);
  const [aiConnected, setAiConnected] = useState(true);
  const [seniorMode, setSeniorMode] = useState(false);

  // Load persisted preferences on mount
  useEffect(() => {
    setAiConnected(true);

    const isSenior = localStorage.getItem(SENIOR_MODE_KEY) === 'true';
    setSeniorMode(isSenior);
    if (isSenior) {
      document.body.classList.add('senior-mode');
    }
  }, []);

  /** Toggle senior mode and persist preference. */
  const toggleSeniorMode = useCallback(() => {
    setSeniorMode((prev) => {
      const next = !prev;
      localStorage.setItem(SENIOR_MODE_KEY, String(next));
      if (next) {
        document.body.classList.add('senior-mode');
      } else {
        document.body.classList.remove('senior-mode');
      }
      return next;
    });
  }, []);

  /** Close settings modal (save action). */
  const saveSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  /** Open the settings modal. */
  const openSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  /** Close the settings modal (cancel action). */
  const closeSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  /** Handle language selection from the LanguageSelector screen. */
  const handleLanguageSelect = useCallback(
    (lang) => {
      setLanguage(lang);
    },
    [setLanguage]
  );

  /** Reset language choice to re-show the selector. */
  const handleChangeLanguage = useCallback(() => {
    localStorage.removeItem(LANGUAGE_KEY);
    setLanguage(null);
    setShowSettings(false);
  }, [setLanguage]);

  return {
    language,
    showSettings,
    aiConnected,
    seniorMode,
    openSettings,
    closeSettings,
    saveSettings,
    toggleSeniorMode,
    handleLanguageSelect,
    handleChangeLanguage,
  };
}

export default useSettings;
