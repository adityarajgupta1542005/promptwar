/**
 * App — Root application component.
 *
 * Responsibilities:
 *  - Route configuration with lazy-loaded page components
 *  - Skip-to-content link for accessibility
 *  - Global navbar rendering
 *  - Settings modal orchestration (delegated to SettingsModal)
 *  - Language gate (shows LanguageSelector if no language chosen)
 *
 * @module App
 */
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { t } from './data/translations';
import { useSettings } from './hooks/useSettings';
import Navbar from './components/Navbar';
import LanguageSelector from './components/LanguageSelector';
import PageLoader from './components/PageLoader';
import SettingsModal from './components/SettingsModal';

/* ── Lazy-loaded route components ────────────────────────────────────────── */
const Hero = lazy(() => import('./components/Hero'));
const Simulator = lazy(() => import('./components/Simulator'));
const VotingGuide = lazy(() => import('./components/VotingGuide'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const MythBuster = lazy(() => import('./components/MythBuster'));
const ChatAssistant = lazy(() => import('./components/ChatAssistant'));

/**
 * Root application component.
 * @returns {JSX.Element}
 */
export default function App() {
  const {
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
  } = useSettings();

  // Show language selector if not yet chosen
  if (!language) {
    return <LanguageSelector onSelect={handleLanguageSelect} />;
  }

  /** @param {string} key - Translation key */
  const L = (key) => t(language, key);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar onSettingsClick={openSettings} />

      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/guide" element={<VotingGuide />} />
            <Route path="/myths" element={<MythBuster />} />
            <Route path="/chat" element={<ChatAssistant />} />
          </Routes>
        </Suspense>
      </main>

      <SettingsModal
        isOpen={showSettings}
        onClose={closeSettings}
        onSave={saveSettings}
        aiConnected={aiConnected}
        seniorMode={seniorMode}
        onToggleSeniorMode={toggleSeniorMode}
        onChangeLanguage={handleChangeLanguage}
        L={L}
      />
    </>
  );
}
