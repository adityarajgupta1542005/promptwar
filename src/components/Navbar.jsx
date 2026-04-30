/**
 * Navbar — Responsive navigation bar with mobile drawer.
 *
 * Features:
 *  - Desktop horizontal nav links with active state highlighting
 *  - Mobile hamburger menu with slide-in overlay
 *  - Settings gear button
 *  - Uses shared icon library for consistency
 *
 * @module Navbar
 * @param {object} props
 * @param {Function} props.onSettingsClick - Callback when settings icon is clicked.
 */
import { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { IconHome, IconClipboard, IconShield, IconChat, IconSettings, IconMenu, IconClose } from './icons';
import './Navbar.css';

export default function Navbar({ onSettingsClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language } = useLanguage();

  /** @param {string} key */
  const L = useCallback((key) => t(language, key), [language]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);

  /** Navigation items configuration */
  const navItems = [
    { path: '/', label: L('navHome'), icon: <IconHome /> },
    { path: '/simulator', label: L('navSimulator'), icon: <IconClipboard /> },
    { path: '/guide', label: L('navGuide'), icon: <IconHome /> },
    { path: '/myths', label: L('navMyths'), icon: <IconShield /> },
    { path: '/chat', label: L('navChat'), icon: <IconChat /> },
  ];

  return (
    <nav className="navbar" id="main-navbar" aria-label={language === 'hi' ? 'मुख्य नेविगेशन' : 'Main navigation'}>
      <div className="navbar-inner container">
        <NavLink to="/" className="navbar-brand" onClick={closeMobile}>
          <span className="brand-icon" aria-hidden="true">🗳️</span>
          <span className="brand-text">
            <strong>VoteSmart</strong> <span className="brand-ai">AI</span>
          </span>
        </NavLink>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`} role="menubar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
              end={item.path === '/'}
              role="menuitem"
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          <button
            className="settings-btn"
            onClick={onSettingsClick}
            title="Settings"
            id="settings-btn"
            aria-label={language === 'hi' ? 'सेटिंग्स खोलें' : 'Open settings'}
            type="button"
          >
            <IconSettings />
          </button>
          <button
            className="mobile-toggle"
            onClick={toggleMobile}
            id="mobile-menu-btn"
            aria-label={mobileOpen ? (language === 'hi' ? 'मेनू बंद करें' : 'Close menu') : (language === 'hi' ? 'मेनू खोलें' : 'Open menu')}
            aria-expanded={mobileOpen}
            type="button"
          >
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
