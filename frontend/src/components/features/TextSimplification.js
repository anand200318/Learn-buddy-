/**
 * Text Simplification Component
 * 
 * Interactive text simplification tool that helps users make complex text
 * easier to read and understand. Includes readability analysis, vocabulary
 * replacement suggestions, and structure improvements.
 * 
 * Features:
 * - Real-time text analysis and readability scoring
 * - Vocabulary simplification with explanations
 * - Sentence structure improvements
 * - Before/after comparison
 * - Educational vocabulary cards
 * - Custom simplification levels
 * 
 * @component
 */

import React, { useState, useEffect, useCallback } from "react";
import { 
  simplifyText, 
  analyzeText, 
  calculateReadabilityScore,
  generateVocabularyCards 
} from "../../utils/textSimplification";
import { browserTTS } from "../../utils/ttsService";
import "../../styles/TextSimplification.css";

// Sample texts for demonstration
const SAMPLE_TEXTS = {
  academic: {
    title: "Climate Change Research",
    text: "Contemporary scientific investigations demonstrate that anthropogenic climate modifications constitute one of the most substantial environmental challenges confronting humanity. Researchers utilize sophisticated methodologies to analyze atmospheric phenomena and subsequently implement comprehensive mitigation strategies to facilitate sustainable environmental preservation."
  },
  business: {
    title: "Business Communication",
    text: "In order to optimize operational efficiency, organizations must establish comprehensive communication protocols that facilitate effective collaboration among team members. Furthermore, it is essential to implement systematic approaches that enable stakeholders to participate actively in decision-making processes."
  },
  technical: {
    title: "Technology Overview", 
    text: "Artificial intelligence systems utilize machine learning algorithms to analyze vast quantities of data and subsequently generate predictions or recommendations. These sophisticated technologies demonstrate significant potential to revolutionize numerous industries through automation and enhanced decision-making capabilities."
  }
};

const SIMPLIFICATION_LEVELS = {
  light: { name: 'Light', description: 'Minimal changes, preserve original style' },
  medium: { name: 'Medium', description: 'Balanced simplification' },
  heavy: { name: 'Heavy', description: 'Maximum simplification for easier reading' }
};

function TextSimplification() {
  // State management
  const [inputText, setInputText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [simplificationLevel, setSimplificationLevel] = useState('medium');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [vocabularyCards, setVocabularyCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showVocabularyCards, setShowVocabularyCards] = useState(false);
  const [readingMode, setReadingMode] = useState('original'); // 'original' or 'simplified'
  const [isReading, setIsReading] = useState(false);

  // Analyze the input text
  const analyzeInputText = useCallback(async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate async operation for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const analysis = analyzeText(inputText);
      setAnalysisResult(analysis);
      
      // Generate vocabulary cards
      const cards = generateVocabularyCards(inputText);
      setVocabularyCards(cards);
      
      // Auto-simplify based on selected level
      handleSimplify();
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [inputText, handleSimplify]);

  // Auto-analyze text when it changes
  useEffect(() => {
    if (inputText.trim().length > 20) {
      analyzeInputText();
    } else {
      setAnalysisResult(null);
      setSimplifiedText('');
      setVocabularyCards([]);
    }
  }, [inputText, analyzeInputText]);

  // Simplify text based on selected level
  const handleSimplify = useCallback(() => {
    if (!inputText.trim()) return;
    
    const options = {
      simplifyVocab: true,
      simplifyStructure: true,
      targetLevel: simplificationLevel === 'heavy' ? 'easy' : 
                  simplificationLevel === 'medium' ? 'medium' : 'advanced'
    };
    
    const result = simplifyText(inputText, options);
    setSimplifiedText(result.simplifiedText);
    setShowComparison(true);
  }, [inputText, simplificationLevel]);

  // Load sample text
  const loadSampleText = (key) => {
    const sample = SAMPLE_TEXTS[key];
    setInputText(sample.text);
    setShowComparison(false);
  };

  // Handle text-to-speech for comparison
  const handleTextToSpeech = (textType) => {
    const textToRead = textType === 'original' ? inputText : simplifiedText;
    
    if (isReading) {
      browserTTS.cancel();
      setIsReading(false);
      return;
    }
    
    setReadingMode(textType);
    setIsReading(true);
    
    const utterance = browserTTS.speak(textToRead, {
      rate: 0.8,
      pitch: 1,
      volume: 1
    });
    
    utterance.onend = () => {
      setIsReading(false);
    };
    
    utterance.onerror = () => {
      setIsReading(false);
    };
  };

  // Copy text to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // Render readability score
  const renderReadabilityScore = (readability) => {
    if (!readability) return null;
    
    const getScoreColor = (level) => {
      switch (level) {
        case 'Easy': return '#4caf50';
        case 'Medium': return '#ff9800';
        case 'Hard': return '#f44336';
        case 'Very Hard': return '#9c27b0';
        default: return '#757575';
      }
    };
    
    return (
      <div className="readability-score">
        <div className="score-circle" style={{ borderColor: getScoreColor(readability.level) }}>
          <span className="score-value">{readability.score}</span>
          <span className="score-label">{readability.level}</span>
        </div>
        <div className="score-details">
          <div className="score-item">
            <span className="label">Words:</span>
            <span className="value">{readability.totalWords}</span>
          </div>
          <div className="score-item">
            <span className="label">Sentences:</span>
            <span className="value">{readability.totalSentences}</span>
          </div>
          <div className="score-item">
            <span className="label">Avg Length:</span>
            <span className="value">{readability.avgSentenceLength}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render vocabulary card
  const renderVocabularyCard = () => {
    if (!vocabularyCards.length) return null;
    
    const card = vocabularyCards[currentCardIndex];
    
    return (
      <div className="vocabulary-card">
        <div className="card-header">
          <h3>Vocabulary Simplification</h3>
          <span className="card-counter">
            {currentCardIndex + 1} of {vocabularyCards.length}
          </span>
        </div>
        <div className="card-content">
          <div className="word-pair">
            <div className="complex-word">
              <label>Complex:</label>
              <span className="word">{card.complex}</span>
            </div>
            <div className="arrow">→</div>
            <div className="simple-word">
              <label>Simple:</label>
              <span className="word">{card.simple}</span>
            </div>
          </div>
          <div className="example">
            <label>Example:</label>
            <p>{card.example}</p>
          </div>
        </div>
        <div className="card-navigation">
          <button 
            onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
            disabled={currentCardIndex === 0}
            className="nav-btn"
          >
            ← Previous
          </button>
          <button 
            onClick={() => setCurrentCardIndex(Math.min(vocabularyCards.length - 1, currentCardIndex + 1))}
            disabled={currentCardIndex === vocabularyCards.length - 1}
            className="nav-btn"
          >
            Next →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="text-simplification-page">
      <div className="container">
        <header className="page-header">
          <h1 className="title">📝 Text Simplification</h1>
          <p className="subtitle">
            Make complex text easier to read and understand with AI-powered simplification
          </p>
        </header>

        {/* Sample Texts */}
        <section className="sample-texts">
          <h2>📚 Try Sample Texts</h2>
          <div className="sample-buttons">
            {Object.entries(SAMPLE_TEXTS).map(([key, sample]) => (
              <button
                key={key}
                onClick={() => loadSampleText(key)}
                className="sample-btn"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </section>

        {/* Input Section */}
        <section className="input-section">
          <div className="section-header">
            <h2>✏️ Enter Your Text</h2>
            <div className="simplification-controls">
              <label htmlFor="simplification-level">Simplification Level:</label>
              <select
                id="simplification-level"
                value={simplificationLevel}
                onChange={(e) => setSimplificationLevel(e.target.value)}
                className="level-select"
              >
                {Object.entries(SIMPLIFICATION_LEVELS).map(([key, level]) => (
                  <option key={key} value={key}>
                    {level.name} - {level.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste or type your complex text here to simplify it..."
            className="text-input"
            rows={8}
          />
          
          <div className="input-actions">
            <button
              onClick={analyzeInputText}
              disabled={!inputText.trim() || isAnalyzing}
              className="analyze-btn"
            >
              {isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze & Simplify'}
            </button>
            
            <button
              onClick={() => setInputText('')}
              disabled={!inputText.trim()}
              className="clear-btn"
            >
              🗑️ Clear
            </button>
          </div>
        </section>

        {/* Analysis Results */}
        {analysisResult && (
          <section className="analysis-section">
            <h2>📊 Text Analysis</h2>
            <div className="analysis-grid">
              <div className="readability-panel">
                <h3>Original Text Readability</h3>
                {renderReadabilityScore(analysisResult.readability)}
              </div>
              
              {simplifiedText && (
                <div className="readability-panel">
                  <h3>Simplified Text Readability</h3>
                  {renderReadabilityScore(calculateReadabilityScore(simplifiedText))}
                </div>
              )}
            </div>
            
            {/* Recommendations */}
            {analysisResult.recommendations?.length > 0 && (
              <div className="recommendations">
                <h3>💡 Recommendations</h3>
                <div className="recommendation-list">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className={`recommendation ${rec.type}`}>
                      <span className="rec-icon">
                        {rec.type === 'positive' ? '✅' : 
                         rec.type === 'overall' ? '⚠️' :
                         rec.type === 'structure' ? '📏' : '📚'}
                      </span>
                      <span className="rec-message">{rec.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Comparison Section */}
        {showComparison && simplifiedText && (
          <section className="comparison-section">
            <h2>🔄 Before & After Comparison</h2>
            
            <div className="comparison-grid">
              {/* Original Text */}
              <div className="text-panel original">
                <div className="panel-header">
                  <h3>📄 Original Text</h3>
                  <div className="panel-actions">
                    <button
                      onClick={() => handleTextToSpeech('original')}
                      className={`tts-btn ${isReading && readingMode === 'original' ? 'active' : ''}`}
                    >
                      {isReading && readingMode === 'original' ? '⏹️' : '🔊'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(inputText)}
                      className="copy-btn"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <div className="text-content">
                  {inputText}
                </div>
              </div>

              {/* Simplified Text */}
              <div className="text-panel simplified">
                <div className="panel-header">
                  <h3>✨ Simplified Text</h3>
                  <div className="panel-actions">
                    <button
                      onClick={() => handleTextToSpeech('simplified')}
                      className={`tts-btn ${isReading && readingMode === 'simplified' ? 'active' : ''}`}
                    >
                      {isReading && readingMode === 'simplified' ? '⏹️' : '🔊'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(simplifiedText)}
                      className="copy-btn"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <div className="text-content">
                  {simplifiedText}
                </div>
              </div>
            </div>
            
            {/* Improvement Stats */}
            {analysisResult?.simplificationResult && (
              <div className="improvement-stats">
                <div className="stat-item">
                  <span className="stat-label">Readability Improvement:</span>
                  <span className="stat-value positive">
                    -{analysisResult.simplificationResult.improvementScore.toFixed(1)} points
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Changes Made:</span>
                  <span className="stat-value">
                    {analysisResult.simplificationResult.changesCount} words
                  </span>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Vocabulary Cards */}
        {vocabularyCards.length > 0 && (
          <section className="vocabulary-section">
            <div className="section-header">
              <h2>📚 Vocabulary Learning</h2>
              <button
                onClick={() => setShowVocabularyCards(!showVocabularyCards)}
                className="toggle-btn"
              >
                {showVocabularyCards ? 'Hide Cards' : `Show Cards (${vocabularyCards.length})`}
              </button>
            </div>
            
            {showVocabularyCards && renderVocabularyCard()}
          </section>
        )}

        {/* Tips Section */}
        <section className="tips-section">
          <h2>💡 Simplification Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h3>🎯 Use Simple Words</h3>
              <p>Replace complex vocabulary with everyday words that everyone understands.</p>
            </div>
            <div className="tip-card">
              <h3>📏 Shorter Sentences</h3>
              <p>Break long sentences into shorter ones. Each sentence should express one main idea.</p>
            </div>
            <div className="tip-card">
              <h3>🗣️ Active Voice</h3>
              <p>Use active voice instead of passive voice to make your writing more direct and clear.</p>
            </div>
            <div className="tip-card">
              <h3>📖 Read Aloud</h3>
              <p>Use the text-to-speech feature to hear how your text sounds when spoken.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <h2>⚙️ How Text Simplification Works</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Analysis</h3>
              <p>We analyze your text for readability, sentence length, and vocabulary complexity.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Vocabulary</h3>
              <p>Complex words are replaced with simpler alternatives while preserving meaning.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Structure</h3>
              <p>Long sentences are broken down into shorter, clearer statements.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Verification</h3>
              <p>The simplified text is scored to ensure improved readability.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TextSimplification;