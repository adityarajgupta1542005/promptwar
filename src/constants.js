/**
 * @fileoverview Application-wide constants.
 * All magic numbers, string literals, and configuration values live here.
 * Import from this file instead of duplicating literals across components.
 */

// ─── API ──────────────────────────────────────────────────────────────────
/** Root path for all backend API calls (proxied via nginx in production) */
export const API_BASE = '/api';

/** Supported language codes */
export const LANGUAGE = Object.freeze({
  EN: 'en',
  HI: 'hi',
});

// ─── Input Limits ─────────────────────────────────────────────────────────
/** Maximum characters allowed in the chat input box */
export const CHAT_INPUT_MAX_LENGTH = 2000;

/** Maximum characters allowed for a myth/claim verification input */
export const MYTH_INPUT_MAX_LENGTH = 500;

/** Maximum chat messages retained in history sent to backend */
export const CHAT_HISTORY_MAX_MESSAGES = 10;

// ─── Simulator ────────────────────────────────────────────────────────────
/** Minimum passing score percentage for "Good" grade */
export const SIM_GRADE_GOOD_THRESHOLD = 60;

/** Minimum passing score percentage for "Excellent" grade */
export const SIM_GRADE_EXCELLENT_THRESHOLD = 80;

// ─── Brand Colors (Design Tokens) ─────────────────────────────────────────
/** Primary accent — warm saffron-brown */
export const COLOR_ACCENT_PRIMARY = '#8c5a2b';

/** Secondary accent — India green */
export const COLOR_ACCENT_SECONDARY = '#138808';

/** Danger / myth / red */
export const COLOR_DANGER = '#A12323';

/** Explore card colors */
export const CARD_COLOR_GREEN = '#538038';
export const CARD_COLOR_RED = '#A63C24';
export const CARD_COLOR_ORANGE = '#E48A37';

// ─── Cloud Functions ──────────────────────────────────────────────────────
/** Cloud Functions base URL (used only server-side / in functions/index.js) */
export const CLOUD_FUNCTIONS_REGION = 'asia-south1';
export const CLOUD_PROJECT_ID = 'promptwarhack2skil';

// ─── TTS ──────────────────────────────────────────────────────────────────
/** Fade-in volume step per interval tick */
export const TTS_FADE_STEP = 0.1;

/** Interval (ms) between fade-in ticks */
export const TTS_FADE_INTERVAL_MS = 50;

/** Delay before audio starts (human-feel milliseconds) */
export const TTS_START_DELAY_MS = 400;

/** Speech rate for browser TTS (0.9 = slightly slower for clarity) */
export const TTS_SPEECH_RATE = 0.9;
