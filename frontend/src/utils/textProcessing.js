/**
 * Text processing utilities for the TTS functionality
 */

import { TEXT_PATTERNS } from "../constants";

/**
 * Tokenizes text into words and punctuation with position information
 * @param {string} text - The text to tokenize
 * @returns {Array} Array of token objects with text, type, start, and end properties
 */
export const tokenizeText = (text) => {
  if (!text) return [];
  
  const tokens = [];
  let currentPos = 0;
  let match;
  
  // Reset regex lastIndex
  TEXT_PATTERNS.WORD.lastIndex = 0;
  
  while ((match = TEXT_PATTERNS.WORD.exec(text)) !== null) {
    // Add any whitespace before this token as a separate token
    if (match.index > currentPos) {
      const whitespace = text.slice(currentPos, match.index);
      if (whitespace.trim() === '' && whitespace.length > 0) {
        tokens.push({
          text: whitespace,
          type: 'whitespace',
          start: currentPos,
          end: match.index
        });
      }
    }
    
    // Add the matched word/punctuation
    tokens.push({
      text: match[0],
      type: /[\w']+/.test(match[0]) ? 'word' : 'punctuation',
      start: match.index,
      end: match.index + match[0].length
    });
    
    currentPos = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (currentPos < text.length) {
    const remaining = text.slice(currentPos);
    tokens.push({
      text: remaining,
      type: 'whitespace',
      start: currentPos,
      end: text.length
    });
  }
  
  return tokens;
};

/**
 * Tokenizes text into sentences with position information
 * @param {string} text - The text to tokenize into sentences
 * @returns {Array} Array of sentence objects with text, start, and end properties
 */
export const tokenizeSentences = (text) => {
  if (!text) return [];
  
  const sentences = [];
  let lastIndex = 0;
  let match;
  
  // Reset regex lastIndex
  TEXT_PATTERNS.SENTENCE.lastIndex = 0;
  
  while ((match = TEXT_PATTERNS.SENTENCE.exec(text)) !== null) {
    const sentenceEnd = match.index + match[0].length;
    const sentence = text.slice(lastIndex, sentenceEnd).trim();
    
    if (sentence.length > 0) {
      sentences.push({
        text: sentence,
        start: lastIndex,
        end: sentenceEnd
      });
    }
    
    lastIndex = sentenceEnd;
  }
  
  // Add remaining text as the last sentence if any
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex).trim();
    if (remaining.length > 0) {
      sentences.push({
        text: remaining,
        start: lastIndex,
        end: text.length
      });
    }
  }
  
  return sentences;
};

/**
 * Finds the sentence index that contains a given character position
 * @param {Array} sentences - Array of sentence objects
 * @param {number} position - Character position to find
 * @returns {number} Index of the containing sentence, or -1 if not found
 */
export const findSentenceIndex = (sentences, position) => {
  return sentences.findIndex(sentence => 
    position >= sentence.start && position < sentence.end
  );
};

/**
 * Calculates the expected word timing for fallback highlighting
 * @param {number} speechRate - The speech rate multiplier
 * @param {number} wordsCount - Number of words in the text
 * @returns {number} Milliseconds per word
 */
export const calculateWordTiming = (speechRate, wordsCount) => {
  const baseWordsPerMinute = 150 * speechRate;
  return (60 * 1000) / baseWordsPerMinute;
};

/**
 * Validates text input for TTS processing
 * @param {string} text - The text to validate
 * @returns {Object} Validation result with isValid and error properties
 */
export const validateText = (text) => {
  if (!text || !text.trim()) {
    return { isValid: false, error: "Text cannot be empty" };
  }
  
  if (text.length > 10000) {
    return { isValid: false, error: "Text too long (max 10,000 characters)" };
  }
  
  return { isValid: true, error: null };
};