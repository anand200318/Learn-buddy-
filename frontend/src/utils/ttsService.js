/**
 * TTS (Text-to-Speech) utility functions and API interactions
 */

import { API_CONFIG } from "../constants";

/**
 * TTS API service class for backend interactions
 */
export class TTSService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  /**
   * Fetches available voices from the backend
   * @returns {Promise<Array>} Array of available voices
   */
  async getVoices() {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.VOICES}`);
      if (response.ok) {
        const data = await response.json();
        return data.voices || [];
      }
      throw new Error('Failed to fetch voices');
    } catch (error) {
      console.error('Error fetching voices:', error);
      return this.getFallbackVoices();
    }
  }

  /**
   * Converts text to speech and returns audio blob
   * @param {Object} options - TTS options
   * @param {string} options.text - Text to convert
   * @param {string} options.voice - Voice to use
   * @param {number} options.speed - Speech speed
   * @returns {Promise<Blob>} Audio blob
   */
  async textToSpeech({ text, voice = 'en', speed = 1.0 }) {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.TTS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, speed })
    });

    if (!response.ok) {
      throw new Error(`TTS failed: ${response.status}`);
    }

    return await response.blob();
  }

  /**
   * Gets chunked text data for highlighting
   * @param {Object} options - Chunking options
   * @returns {Promise<Object>} Chunked text data
   */
  async getChunkedText({ text, voice = 'en', speed = 1.0, chunk_type = 'word' }) {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.TTS_CHUNKED}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, speed, chunk_type })
    });

    if (!response.ok) {
      throw new Error(`Chunking failed: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Validates text for TTS processing
   * @param {string} text - Text to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateText(text) {
    try {
      const formData = new FormData();
      formData.append('text', text);

      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.TTS_VALIDATE}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Validation failed');
    } catch (error) {
      console.error('Text validation error:', error);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Checks the health of the TTS service
   * @returns {Promise<boolean>} Service health status
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.HEALTH}`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Fallback voices when backend is unavailable
   * @returns {Array} Default voice options
   */
  getFallbackVoices() {
    return [
      { id: 'en', name: 'English', language: 'English' },
      { id: 'hi', name: 'Hindi', language: 'हिन्दी' },
      { id: 'kn', name: 'Kannada', language: 'ಕನ್ನಡ' },
      { id: 'ta', name: 'Tamil', language: 'தமிழ்' },
      { id: 'te', name: 'Telugu', language: 'తెలుగు' },
      { id: 'ml', name: 'Malayalam', language: 'മലയാളം' },
      { id: 'bn', name: 'Bengali', language: 'বাংলা' },
      { id: 'gu', name: 'Gujarati', language: 'ગુજરાતી' },
      { id: 'mr', name: 'Marathi', language: 'मराठी' },
      { id: 'pa', name: 'Punjabi', language: 'ਪੰਜਾਬੀ' },
      { id: 'es', name: 'Spanish', language: 'Español' },
      { id: 'fr', name: 'French', language: 'Français' },
      { id: 'de', name: 'German', language: 'Deutsch' }
    ];
  }
}

/**
 * Browser TTS utilities using Web Speech API
 */
export class BrowserTTS {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.currentUtterance = null;
  }

  /**
   * Gets available browser voices
   * @returns {Array} Available speech synthesis voices
   */
  getVoices() {
    return this.synthesis.getVoices();
  }

  /**
   * Finds the best English voice
   * @param {Array} voices - Available voices
   * @returns {Object|null} Best English voice or null
   */
  findBestEnglishVoice(voices) {
    return voices.find(voice => 
      /en|english/i.test(voice.lang) && /female|male/i.test(voice.name)
    ) || voices.find(voice => /en|english/i.test(voice.lang)) || voices[0] || null;
  }

  /**
   * Finds the best voice for a specific language
   * @param {Array} voices - Available voices
   * @param {string} languageCode - Language code (e.g., 'hi', 'kn', 'ta')
   * @returns {Object|null} Best voice for the language or null
   */
  findBestVoiceForLanguage(voices, languageCode) {
    // Language code mappings for browser voices
    const languageMappings = {
      'hi': ['hi', 'hindi'],
      'kn': ['kn', 'kannada'],
      'ta': ['ta', 'tamil'],
      'te': ['te', 'telugu'],
      'ml': ['ml', 'malayalam'],
      'bn': ['bn', 'bengali', 'bangla'],
      'gu': ['gu', 'gujarati'],
      'mr': ['mr', 'marathi'],
      'pa': ['pa', 'punjabi'],
      'or': ['or', 'odia', 'oriya'],
      'as': ['as', 'assamese'],
      'ur': ['ur', 'urdu'],
      'es': ['es', 'spanish', 'español'],
      'fr': ['fr', 'french', 'français'],
      'de': ['de', 'german', 'deutsch'],
      'it': ['it', 'italian'],
      'pt': ['pt', 'portuguese'],
      'ru': ['ru', 'russian'],
      'ja': ['ja', 'japanese'],
      'ko': ['ko', 'korean'],
      'zh': ['zh', 'chinese', 'mandarin'],
      'ar': ['ar', 'arabic']
    };

    const searchTerms = languageMappings[languageCode] || [languageCode];
    
    // Try to find a voice that matches the language
    for (const term of searchTerms) {
      const voice = voices.find(voice => 
        voice.lang.toLowerCase().includes(term) || 
        voice.name.toLowerCase().includes(term)
      );
      if (voice) return voice;
    }

    // Fallback to any available voice
    return voices[0] || null;
  }

  /**
   * Creates a speech utterance with specified options
   * @param {string} text - Text to speak
   * @param {Object} options - Speech options
   * @returns {SpeechSynthesisUtterance} Configured utterance
   */
  createUtterance(text, { voice, rate = 1, pitch = 1, volume = 1 } = {}) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    return utterance;
  }

  /**
   * Speaks the given text with options
   * @param {string} text - Text to speak
   * @param {Object} options - Speech options
   * @returns {SpeechSynthesisUtterance} The utterance being spoken
   */
  speak(text, options = {}) {
    this.cancel(); // Cancel any ongoing speech
    
    this.currentUtterance = this.createUtterance(text, options);
    this.synthesis.speak(this.currentUtterance);
    
    return this.currentUtterance;
  }

  /**
   * Pauses current speech
   */
  pause() {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  /**
   * Resumes paused speech
   */
  resume() {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  /**
   * Cancels current speech
   */
  cancel() {
    this.synthesis.cancel();
    this.currentUtterance = null;
  }

  /**
   * Checks if currently speaking
   * @returns {boolean} True if speaking
   */
  isSpeaking() {
    return this.synthesis.speaking;
  }

  /**
   * Checks if currently paused
   * @returns {boolean} True if paused
   */
  isPaused() {
    return this.synthesis.paused;
  }
}

// Export singleton instances
export const ttsService = new TTSService();
export const browserTTS = new BrowserTTS();