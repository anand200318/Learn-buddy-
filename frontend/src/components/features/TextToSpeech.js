/**
 * TextToSpeech Feature Component
 * 
 * Advanced text-to-speech interface with real-time highlighting,
 * voice selection, speed control, and dual TTS modes (browser/server).
 * 
 * Features:
 * - Browser TTS with Web Speech API
 * - Server TTS with FastAPI backend
 * - Real-time word and sentence highlighting
 * - Voice selection and speed control
 * - Play, pause, resume, stop controls
 * - Responsive design with modern UI
 * 
 * @component
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ttsService, browserTTS } from "../../utils/ttsService";
import { 
  tokenizeText, 
  tokenizeSentences, 
  findSentenceIndex,
  calculateWordTiming,
  validateText 
} from "../../utils/textProcessing";
import { TTS_CONFIG, DEFAULT_TEXT } from "../../constants";
import "../../styles/FeaturesPage.css";

function TextToSpeech() {
  // State management
  const [text, setText] = useState(DEFAULT_TEXT);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(TTS_CONFIG.DEFAULT_RATE);
  const [useBrowserTTS, setUseBrowserTTS] = useState(true);
  const [error, setError] = useState(null);

  // Refs for managing audio and timeouts
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);
  const highlightTimeoutRef = useRef(null);

  // Load available voices on component mount
  useEffect(() => {
    loadVoices();
    
    // Listen for voices changed event (browser voices)
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, []);

  /**
   * Loads available voices from browser or backend
   */
  const loadVoices = useCallback(async () => {
    try {
      if (useBrowserTTS) {
        const browserVoices = browserTTS.getVoices();
        setVoices(browserVoices);
        
        // Auto-select best English voice
        if (browserVoices.length > 0 && !selectedVoice) {
          const defaultVoice = browserTTS.findBestEnglishVoice(browserVoices);
          setSelectedVoice(defaultVoice);
        }
      } else {
        const backendVoices = await ttsService.getVoices();
        setVoices(backendVoices);
      }
    } catch (error) {
      console.error('Error loading voices:', error);
      setError('Failed to load voices');
    }
  }, [useBrowserTTS, selectedVoice]);

  /**
   * Cleans up all audio, utterances, and timers
   */
  const cleanup = useCallback(() => {
    if (utteranceRef.current) {
      browserTTS.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }
  }, []);

  /**
   * Handles browser TTS with improved synchronization
   */
  const handleBrowserTTS = useCallback(() => {
    const validation = validateText(text);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    if (!selectedVoice) {
      setError('Please select a voice');
      return;
    }

    setError(null);
    cleanup();

    const words = tokenizeText(text).filter(token => token.type === 'word');
    const sentences = tokenizeSentences(text);
    let boundaryWordIndex = 0;
    let hasStartedFallback = false;

    const utterance = browserTTS.speak(text, {
      voice: selectedVoice,
      rate: speechRate,
      pitch: 1,
      volume: 1
    });

    utteranceRef.current = utterance;

    // Enhanced boundary event handling
    utterance.onboundary = (event) => {
      if (event.name === 'word' && boundaryWordIndex < words.length) {
        setCurrentWordIndex(boundaryWordIndex);
        
        const currentWord = words[boundaryWordIndex];
        if (currentWord) {
          const sentenceIdx = findSentenceIndex(sentences, currentWord.start);
          if (sentenceIdx !== -1) {
            setCurrentSentenceIndex(sentenceIdx);
          }
        }
        
        boundaryWordIndex++;
        hasStartedFallback = false;
      }
    };

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentWordIndex(0);
      setCurrentSentenceIndex(0);
      
      startFallbackHighlighting(words, sentences, hasStartedFallback, boundaryWordIndex);
    };

    utterance.onpause = () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };

    utterance.onresume = () => {
      startResumeHighlighting();
    };

    utterance.onend = () => {
      resetPlaybackState();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setError('Speech synthesis failed');
      resetPlaybackState();
    };
  }, [text, selectedVoice, speechRate, cleanup]);

  /**
   * Handles server TTS with enhanced features
   */
  const handleServerTTS = useCallback(async () => {
    const validation = validateText(text);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError(null);
    setIsLoading(true);
    cleanup();

    try {
      // Get chunked text data for highlighting
      const chunkData = await ttsService.getChunkedText({
        text,
        voice: 'en',
        speed: speechRate,
        chunk_type: 'word'
      });

      // Generate audio from backend
      const audioBlob = await ttsService.textToSpeech({
        text,
        voice: 'en',
        speed: speechRate
      });

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadeddata = () => {
        setIsLoading(false);
        audio.play();
        setIsPlaying(true);
        setIsPaused(false);
        
        if (chunkData.chunks && chunkData.chunks.length > 0) {
          startBackendHighlighting(audio.duration, chunkData.chunks);
        }
      };

      audio.onended = () => {
        resetPlaybackState();
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsLoading(false);
        setError('Audio playback failed');
        resetPlaybackState();
        URL.revokeObjectURL(audioUrl);
      };

    } catch (error) {
      console.error('Server TTS error:', error);
      setIsLoading(false);
      setError('Server TTS failed, trying browser TTS...');
      
      // Fallback to browser TTS
      setTimeout(() => {
        setUseBrowserTTS(true);
        handleBrowserTTS();
      }, 1000);
    }
  }, [text, speechRate, cleanup, handleBrowserTTS]);

  /**
   * Starts fallback highlighting for browser TTS
   */
  const startFallbackHighlighting = useCallback((words, sentences, hasStartedFallback, boundaryWordIndex) => {
    const startTime = Date.now();
    let fallbackWordIndex = 0;
    const msPerWord = calculateWordTiming(speechRate);
    
    const fallbackHighlighting = () => {
      const elapsed = Date.now() - startTime;
      const expectedWordIndex = Math.floor(elapsed / msPerWord);
      
      if (!hasStartedFallback && boundaryWordIndex === 0) {
        hasStartedFallback = true;
      }
      
      if (browserTTS.isSpeaking() && !browserTTS.isPaused()) {
        if (hasStartedFallback && expectedWordIndex < words.length && expectedWordIndex !== fallbackWordIndex) {
          fallbackWordIndex = expectedWordIndex;
          setCurrentWordIndex(fallbackWordIndex);
          
          const currentWord = words[fallbackWordIndex];
          if (currentWord) {
            const sentenceIdx = findSentenceIndex(sentences, currentWord.start);
            if (sentenceIdx !== -1) {
              setCurrentSentenceIndex(sentenceIdx);
            }
          }
        }
        
        highlightTimeoutRef.current = setTimeout(fallbackHighlighting, TTS_CONFIG.HIGHLIGHT_UPDATE_INTERVAL);
      }
    };
    
    setTimeout(fallbackHighlighting, TTS_CONFIG.FALLBACK_DELAY);
  }, [speechRate]);

  /**
   * Starts backend highlighting with smooth synchronization
   */
  const startBackendHighlighting = useCallback((audioDuration, chunks) => {
    const words = tokenizeText(text).filter(token => token.type === 'word');
    const sentences = tokenizeSentences(text);
    
    const smoothHighlighting = () => {
      if (!audioRef.current || audioRef.current.paused || audioRef.current.ended) {
        return;
      }
      
      const currentTime = audioRef.current.currentTime;
      const progress = currentTime / audioDuration;
      const expectedWordIndex = Math.floor(progress * words.length);
      
      if (expectedWordIndex < words.length && expectedWordIndex !== currentWordIndex) {
        setCurrentWordIndex(expectedWordIndex);
        
        const currentWord = words[expectedWordIndex];
        if (currentWord) {
          const sentenceIndex = findSentenceIndex(sentences, currentWord.start);
          if (sentenceIndex !== -1) {
            setCurrentSentenceIndex(sentenceIndex);
          }
        }
      }
      
      if (expectedWordIndex < words.length) {
        highlightTimeoutRef.current = setTimeout(smoothHighlighting, TTS_CONFIG.HIGHLIGHT_UPDATE_INTERVAL);
      }
    };
    
    smoothHighlighting();
  }, [text, currentWordIndex]);

  /**
   * Starts resume highlighting for browser TTS
   */
  const startResumeHighlighting = useCallback(() => {
    const resumeHighlighting = () => {
      if (browserTTS.isSpeaking() && !browserTTS.isPaused()) {
        highlightTimeoutRef.current = setTimeout(resumeHighlighting, TTS_CONFIG.HIGHLIGHT_UPDATE_INTERVAL);
      }
    };
    setTimeout(resumeHighlighting, 100);
  }, []);

  /**
   * Resets all playback state
   */
  const resetPlaybackState = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    
    setTimeout(() => {
      setCurrentWordIndex(-1);
      setCurrentSentenceIndex(-1);
    }, 150);
    
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }
  }, []);

  // Event handlers
  const handlePlay = () => {
    if (useBrowserTTS) {
      handleBrowserTTS();
    } else {
      handleServerTTS();
    }
  };

  const handlePauseResume = () => {
    if (useBrowserTTS) {
      if (isPlaying && !isPaused) {
        browserTTS.pause();
        setIsPaused(true);
        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }
      } else if (isPaused) {
        browserTTS.resume();
        setIsPaused(false);
        startResumeHighlighting();
      }
    } else {
      if (audioRef.current) {
        if (isPlaying && !isPaused) {
          audioRef.current.pause();
          setIsPaused(true);
          if (highlightTimeoutRef.current) {
            clearTimeout(highlightTimeoutRef.current);
          }
        } else if (isPaused) {
          audioRef.current.play();
          setIsPaused(false);
          // Resume highlighting logic would go here
        }
      }
    }
  };

  const handleStop = () => {
    cleanup();
    resetPlaybackState();
  };

  const handleModeToggle = (e) => {
    const newMode = e.target.checked;
    setUseBrowserTTS(newMode);
    setSelectedVoice(null);
    setVoices([]);
    
    // Reload voices for the new mode
    setTimeout(() => loadVoices(), 100);
  };

  /**
   * Renders highlighted text with proper tokenization
   */
  const renderHighlightedText = () => {
    const words = tokenizeText(text);
    const sentences = tokenizeSentences(text);
    const wordTokensOnly = words.filter(t => t.type === 'word');

    return (
      <div className="text-display">
        {words.map((token, index) => {
          if (token.type === 'whitespace') {
            return <span key={`ws-${index}`}>{token.text}</span>;
          }
          
          const wordIndex = wordTokensOnly.findIndex(w => w === token);
          const isWordHighlighted = token.type === 'word' && wordIndex === currentWordIndex;
          
          const sentenceForToken = findSentenceIndex(sentences, token.start);
          const isSentenceHighlighted = sentenceForToken === currentSentenceIndex && sentenceForToken !== -1;

          let className = token.type;
          if (isWordHighlighted) {
            className += ' highlight-word';
          }
          if (isSentenceHighlighted) {
            className += ' highlight-sentence';
          }

          return (
            <span
              key={`${token.type}-${index}`}
              className={className.trim()}
              data-word-index={token.type === 'word' ? wordIndex : undefined}
              data-sentence-index={sentenceForToken}
              style={{
                display: 'inline-block',
                transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                position: 'relative'
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="features-page">
      <div className="container">
        <header className="page-header">
          <h1 className="title">🎤 Text to Speech</h1>
          <p className="subtitle">
            Convert text to natural speech with advanced controls and highlighting
          </p>
        </header>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* TTS Mode Toggle */}
        <section className="tts-mode-section">
          <div className="tts-mode-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={useBrowserTTS}
                onChange={handleModeToggle}
                className="toggle-input"
              />
              <span className="toggle-text">
                {useBrowserTTS ? '🌐 Browser TTS (Enhanced)' : '🖥️ Server TTS (Backend)'}
              </span>
            </label>
          </div>
        </section>

        {/* Controls */}
        {useBrowserTTS && (
          <section className="tts-settings">
            <div className="setting-group">
              <label htmlFor="voice-select">
                <span className="label-icon">🎙️</span>
                Voice:
              </label>
              <select
                id="voice-select"
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value);
                  setSelectedVoice(voice);
                }}
                className="voice-selector"
              >
                <option value="">Select a voice...</option>
                {voices.map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="speed-control">
                <span className="label-icon">⚡</span>
                Speed: {speechRate}x
              </label>
              <input
                id="speed-control"
                type="range"
                min={TTS_CONFIG.MIN_RATE}
                max={TTS_CONFIG.MAX_RATE}
                step={TTS_CONFIG.RATE_STEP}
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="speed-slider"
              />
            </div>
          </section>
        )}

        {!useBrowserTTS && (
          <section className="tts-settings">
            <div className="setting-group">
              <label htmlFor="speed-control-backend">
                <span className="label-icon">⚡</span>
                Speed: {speechRate}x
              </label>
              <input
                id="speed-control-backend"
                type="range"
                min={TTS_CONFIG.MIN_RATE}
                max={TTS_CONFIG.MAX_RATE}
                step={TTS_CONFIG.RATE_STEP}
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="speed-slider"
              />
            </div>
          </section>
        )}

        {/* Text Input */}
        <section className="input-section">
          <label htmlFor="text-input" className="input-label">
            <span className="label-icon">📝</span>
            Enter text to convert to speech:
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here..."
            className="text-input"
            rows={5}
            disabled={isPlaying}
          />
        </section>

        {/* TTS Controls */}
        <section className="tts-controls">
          <button
            onClick={handlePlay}
            disabled={isLoading || isPlaying || (!useBrowserTTS && !text.trim()) || (useBrowserTTS && (!selectedVoice || !text.trim()))}
            className="control-btn play-btn"
            title="Play"
          >
            {isLoading ? "⏳" : "▶️"}
            {isLoading ? "Loading..." : "Play"}
          </button>

          <button
            onClick={handlePauseResume}
            disabled={!isPlaying}
            className="control-btn pause-btn"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? "▶️" : "⏸️"}
            {isPaused ? "Resume" : "Pause"}
          </button>

          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="control-btn stop-btn"
            title="Stop"
          >
            ⏹️ Stop
          </button>
        </section>

        {/* Highlighted Text Display */}
        <section className="highlighted-text-container">
          <h3>
            <span className="section-icon">📖</span>
            Text Display
          </h3>
          <div className="highlighted-text">
            {renderHighlightedText()}
          </div>
        </section>

        {/* Status Display */}
        <section className="status-section">
          <div className="status-info">
            <span className={`status-indicator ${isPlaying ? 'playing' : isPaused ? 'paused' : 'stopped'}`}>
              {isLoading ? '⏳ Loading...' : 
               isPlaying && !isPaused ? '🔊 Playing' : 
               isPaused ? '⏸️ Paused' : 
               '⏹️ Stopped'}
            </span>
            
            {useBrowserTTS && selectedVoice && (
              <>
                <span className="separator"> | </span>
                <span className="voice-info">
                  Voice: {selectedVoice.name}
                </span>
              </>
            )}
            
            {!useBrowserTTS && (
              <>
                <span className="separator"> | </span>
                <span className="voice-info">
                  Backend TTS: gTTS
                </span>
              </>
            )}
            
            <span className="separator"> | </span>
            <span className="speed-info">Speed: {speechRate}x</span>
            <span className="separator"> | </span>
            <span className="mode-info">Mode: {useBrowserTTS ? 'Browser' : 'Server'}</span>
          </div>
        </section>

        {/* Instructions */}
        <section className="instructions">
          <h3>✨ How to Use Your Enhanced TTS</h3>
          <ul>
            <li><span className="instruction-icon">📝</span> Enter or edit text in the text area</li>
            <li><span className="instruction-icon">🎛️</span> Choose between Browser TTS or Server TTS</li>
            <li><span className="instruction-icon">🎙️</span> Select your preferred voice from the dropdown</li>
            <li><span className="instruction-icon">⚡</span> Adjust playback speed using the slider</li>
            <li><span className="instruction-icon">▶️</span> Click Play to start text-to-speech</li>
            <li><span className="instruction-icon">⏸️</span> Use Pause/Resume to control playback</li>
            <li><span className="instruction-icon">⏹️</span> Click Stop to end and reset</li>
            <li><span className="instruction-icon">👀</span> Watch the highlighted text follow along</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default TextToSpeech;