/**
 * Constants used throughout the Learn Buddy application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:8003",
  ENDPOINTS: {
    TTS: "/tts",
    TTS_CHUNKED: "/tts/chunked",
    TTS_VALIDATE: "/tts/validate",
    VOICES: "/voices",
    HEALTH: "/health"
  }
};

// TTS Configuration
export const TTS_CONFIG = {
  DEFAULT_RATE: 1.0,
  MIN_RATE: 0.5,
  MAX_RATE: 2.0,
  RATE_STEP: 0.1,
  HIGHLIGHT_UPDATE_INTERVAL: 50, // milliseconds
  FALLBACK_DELAY: 200, // milliseconds
  WORDS_PER_MINUTE_BASE: 150
};

// UI Configuration
export const UI_CONFIG = {
  NAVBAR_HEIGHT: 64,
  CONTAINER_MAX_WIDTH: 1200,
  MOBILE_BREAKPOINT: 768
};

// Text Processing
export const TEXT_PATTERNS = {
  WORD: /[\w']+|[.!?;,—–-]+/g,
  SENTENCE: /[.!?]+(?:\s+|$)/g,
  WHITESPACE: /\s+/g
};

// Feature Flags
export const FEATURES = {
  BACKEND_TTS: true,
  BROWSER_TTS: true,
  VOICE_SELECTION: true,
  SPEED_CONTROL: true,
  HIGHLIGHTING: true
};

// Default Text
export const DEFAULT_TEXT = "This is My Learn Buddy. A friendly tool for learning with text to speech support. Welcome to the enhanced text-to-speech experience!";