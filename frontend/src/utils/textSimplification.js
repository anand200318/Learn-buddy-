/**
 * Text Simplification Utilities
 * 
 * Functions to simplify complex text for better readability and comprehension.
 * Includes vocabulary replacement, sentence structure simplification, and readability analysis.
 */

// Complex word to simple word mappings
const VOCABULARY_SIMPLIFICATIONS = {
  // Academic/Formal words
  'utilize': 'use',
  'commence': 'start',
  'terminate': 'end',
  'demonstrate': 'show',
  'facilitate': 'help',
  'approximately': 'about',
  'subsequently': 'then',
  'furthermore': 'also',
  'nevertheless': 'however',
  'consequently': 'so',
  'substantial': 'large',
  'significant': 'important',
  'essential': 'needed',
  'acquire': 'get',
  'establish': 'create',
  'implement': 'do',
  'maintain': 'keep',
  'participate': 'join',
  'investigate': 'study',
  'comprehend': 'understand',
  'anticipate': 'expect',
  'encounter': 'meet',
  'contribute': 'help',
  'eliminate': 'remove',
  'accumulate': 'gather',
  'sufficient': 'enough',
  'numerous': 'many',
  'enormous': 'huge',
  'magnificent': 'great',
  'extraordinary': 'amazing',
  'phenomenon': 'event',
  'atmosphere': 'air',
  'temperature': 'heat',
  'precipitation': 'rain',
  'vegetation': 'plants',
  'inhabitants': 'people',
  'transportation': 'travel',
  'communication': 'talking',
  'information': 'facts',
  'education': 'learning',
  'opportunity': 'chance',
  'responsibility': 'duty',
  'difficulty': 'problem',
  'advantage': 'benefit',
  'disadvantage': 'problem',
  'requirement': 'need',
  'explanation': 'reason',
  'description': 'details',
  'comparison': 'contrast',
  'recommendation': 'advice',
  'consideration': 'thought',
  'determination': 'decision',
  'appreciation': 'thanks',
  'congratulations': 'well done',
  'unfortunately': 'sadly',
  'particularly': 'especially',
  'immediately': 'right away',
  'completely': 'fully',
  'absolutely': 'totally',
  'definitely': 'surely',
  'probably': 'maybe',
  'generally': 'usually',
  'specifically': 'exactly',
  'eventually': 'finally',
  'currently': 'now',
  'recently': 'lately',
  'previously': 'before',
  'originally': 'first',
  'initially': 'at start'
};

// Common complex phrases to simple alternatives
const PHRASE_SIMPLIFICATIONS = {
  'in order to': 'to',
  'due to the fact that': 'because',
  'in spite of': 'despite',
  'with regard to': 'about',
  'in relation to': 'about',
  'in addition to': 'plus',
  'as a result of': 'because of',
  'for the purpose of': 'to',
  'in the event that': 'if',
  'at the present time': 'now',
  'during the time that': 'while',
  'in the near future': 'soon',
  'at this point in time': 'now',
  'in the process of': 'while',
  'make a decision': 'decide',
  'come to a conclusion': 'conclude',
  'take into consideration': 'consider',
  'give consideration to': 'consider',
  'make an attempt': 'try',
  'in the majority of cases': 'usually',
  'a large number of': 'many',
  'a great deal of': 'much',
  'on a regular basis': 'regularly',
  'in a timely manner': 'on time',
  'of great importance': 'important',
  'at the same time': 'meanwhile',
  'in the same way': 'similarly',
  'on the other hand': 'however',
  'as a matter of fact': 'actually',
  'it is important to note': 'note that',
  'it should be noted': 'note',
  'it is worth mentioning': 'also'
};

// Readability scoring based on sentence length and word complexity
export const calculateReadabilityScore = (text) => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  const avgSentenceLength = words.length / sentences.length;
  const complexWords = words.filter(word => 
    word.length > 6 && !VOCABULARY_SIMPLIFICATIONS[word.toLowerCase()]
  ).length;
  
  const complexWordRatio = complexWords / words.length;
  
  // Simple readability score (higher = more complex)
  const score = (avgSentenceLength * 0.39) + (complexWordRatio * 100);
  
  return {
    score: Math.round(score * 10) / 10,
    level: score < 30 ? 'Easy' : score < 50 ? 'Medium' : score < 70 ? 'Hard' : 'Very Hard',
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    complexWordRatio: Math.round(complexWordRatio * 1000) / 10,
    totalWords: words.length,
    totalSentences: sentences.length,
    suggestions: generateSimplificationSuggestions(text, avgSentenceLength, complexWordRatio)
  };
};

// Generate suggestions for text improvement
const generateSimplificationSuggestions = (text, avgSentenceLength, complexWordRatio) => {
  const suggestions = [];
  
  if (avgSentenceLength > 20) {
    suggestions.push({
      type: 'sentence_length',
      message: 'Consider breaking long sentences into shorter ones',
      severity: 'medium'
    });
  }
  
  if (complexWordRatio > 0.15) {
    suggestions.push({
      type: 'vocabulary',
      message: 'Replace complex words with simpler alternatives',
      severity: 'high'
    });
  }
  
  const passiveVoicePattern = /\b(was|were|is|are|been|being)\s+\w+ed\b/gi;
  const passiveMatches = text.match(passiveVoicePattern);
  if (passiveMatches && passiveMatches.length > 2) {
    suggestions.push({
      type: 'voice',
      message: 'Consider using active voice instead of passive voice',
      severity: 'low'
    });
  }
  
  return suggestions;
};

// Simplify vocabulary in text
export const simplifyVocabulary = (text) => {
  let simplifiedText = text;
  
  // Replace complex phrases first (longer matches first)
  const sortedPhrases = Object.keys(PHRASE_SIMPLIFICATIONS)
    .sort((a, b) => b.length - a.length);
    
  sortedPhrases.forEach(phrase => {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    simplifiedText = simplifiedText.replace(regex, PHRASE_SIMPLIFICATIONS[phrase]);
  });
  
  // Replace individual words
  Object.keys(VOCABULARY_SIMPLIFICATIONS).forEach(complexWord => {
    const regex = new RegExp(`\\b${complexWord}\\b`, 'gi');
    simplifiedText = simplifiedText.replace(regex, VOCABULARY_SIMPLIFICATIONS[complexWord]);
  });
  
  return simplifiedText;
};

// Break long sentences into shorter ones
export const simplifyStructure = (text) => {
  const sentences = text.split(/([.!?]+)/).filter(s => s.trim().length > 0);
  const simplifiedSentences = [];
  
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i];
    const punctuation = sentences[i + 1] || '.';
    
    if (!sentence || sentence.trim().length === 0) continue;
    
    const words = sentence.trim().split(/\s+/);
    
    if (words.length > 25) {
      // Try to split at conjunctions
      const splitPoints = [];
      const conjunctions = ['and', 'but', 'or', 'so', 'yet', 'for', 'nor', 'because', 'although', 'while', 'since', 'unless', 'until', 'when', 'where', 'after', 'before'];
      
      words.forEach((word, index) => {
        if (conjunctions.includes(word.toLowerCase()) && index > 5) {
          splitPoints.push(index);
        }
      });
      
      if (splitPoints.length > 0) {
        let lastSplit = 0;
        splitPoints.forEach(splitPoint => {
          if (splitPoint - lastSplit > 8) { // Ensure minimum sentence length
            const part = words.slice(lastSplit, splitPoint).join(' ');
            if (part.trim()) {
              simplifiedSentences.push(part.trim() + '.');
            }
            lastSplit = splitPoint;
          }
        });
        
        // Add remaining words
        const remaining = words.slice(lastSplit).join(' ');
        if (remaining.trim()) {
          simplifiedSentences.push(remaining.trim() + punctuation);
        }
      } else {
        // If no good split points, just break in the middle
        const midPoint = Math.floor(words.length / 2);
        const firstHalf = words.slice(0, midPoint).join(' ');
        const secondHalf = words.slice(midPoint).join(' ');
        
        simplifiedSentences.push(firstHalf.trim() + '.');
        simplifiedSentences.push(secondHalf.trim() + punctuation);
      }
    } else {
      simplifiedSentences.push(sentence.trim() + punctuation);
    }
  }
  
  return simplifiedSentences.join(' ');
};

// Complete text simplification
export const simplifyText = (text, options = {}) => {
  const {
    simplifyVocab = true,
    simplifyStructure: shouldSimplifyStructure = true,
    targetLevel = 'medium' // 'easy', 'medium', 'advanced'
  } = options;
  
  let processedText = text;
  
  if (simplifyVocab) {
    processedText = simplifyVocabulary(processedText);
  }
  
  if (shouldSimplifyStructure) {
    processedText = simplifyStructure(processedText);
  }
  
  // Additional processing based on target level
  if (targetLevel === 'easy') {
    // More aggressive simplification for easy level
    processedText = processedText
      .replace(/\b(however|nevertheless|furthermore|moreover)\b/gi, 'but')
      .replace(/\b(therefore|consequently|thus)\b/gi, 'so')
      .replace(/\b(although|though|even though)\b/gi, 'but');
  }
  
  const readabilityBefore = calculateReadabilityScore(text);
  const readabilityAfter = calculateReadabilityScore(processedText);
  
  return {
    originalText: text,
    simplifiedText: processedText,
    readabilityBefore,
    readabilityAfter,
    improvementScore: readabilityBefore.score - readabilityAfter.score,
    changesCount: countChanges(text, processedText)
  };
};

// Count the number of changes made
const countChanges = (original, simplified) => {
  const originalWords = original.toLowerCase().split(/\s+/);
  const simplifiedWords = simplified.toLowerCase().split(/\s+/);
  
  let changes = 0;
  const maxLength = Math.max(originalWords.length, simplifiedWords.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (originalWords[i] !== simplifiedWords[i]) {
      changes++;
    }
  }
  
  return changes;
};

// Generate vocabulary learning cards from complex words found
export const generateVocabularyCards = (text) => {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const complexWords = words.filter(word => VOCABULARY_SIMPLIFICATIONS[word]);
  
  return [...new Set(complexWords)].map(word => ({
    complex: word,
    simple: VOCABULARY_SIMPLIFICATIONS[word],
    example: `Instead of "${word}", try "${VOCABULARY_SIMPLIFICATIONS[word]}"`
  }));
};

// Text analysis for educational purposes
export const analyzeText = (text) => {
  const readability = calculateReadabilityScore(text);
  const vocabularyCards = generateVocabularyCards(text);
  const simplificationResult = simplifyText(text);
  
  return {
    readability,
    vocabularyCards,
    simplificationResult,
    recommendations: generateRecommendations(readability, vocabularyCards.length)
  };
};

// Generate recommendations based on analysis
const generateRecommendations = (readability, complexWordsCount) => {
  const recommendations = [];
  
  if (readability.score > 60) {
    recommendations.push({
      type: 'overall',
      message: 'This text is quite complex. Consider using the simplification feature.',
      action: 'simplify'
    });
  }
  
  if (readability.avgSentenceLength > 20) {
    recommendations.push({
      type: 'structure',
      message: 'Sentences are quite long. Break them into shorter sentences.',
      action: 'shorten'
    });
  }
  
  if (complexWordsCount > 5) {
    recommendations.push({
      type: 'vocabulary',
      message: `Found ${complexWordsCount} complex words that could be simplified.`,
      action: 'vocabulary'
    });
  }
  
  if (readability.level === 'Easy') {
    recommendations.push({
      type: 'positive',
      message: 'This text is at an appropriate reading level!',
      action: 'continue'
    });
  }
  
  return recommendations;
};

export default {
  simplifyText,
  simplifyVocabulary,
  simplifyStructure,
  calculateReadabilityScore,
  generateVocabularyCards,
  analyzeText,
  VOCABULARY_SIMPLIFICATIONS,
  PHRASE_SIMPLIFICATIONS
};