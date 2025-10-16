/**
 * Reading Practice Feature Component
 * 
 * Interactive reading practice with comprehension exercises,
 * speed reading training, and progress tracking.
 * 
 * Features:
 * - Multiple reading modes (guided, speed, comprehension)
 * - Interactive exercises and quizzes
 * - Progress tracking and analytics
 * - TTS integration for audio support
 * - Difficulty level adaptation
 * 
 * @component
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ttsService, browserTTS } from "../../utils/ttsService";
import { 
  tokenizeText, 
  calculateReadingTime,
  analyzeTextComplexity 
} from "../../utils/textProcessing";
import { 
  simplifyText, 
  calculateReadabilityScore,
  generateVocabularyCards 
} from "../../utils/textSimplification";
import "../../styles/ReadingPractice.css";

// Regional language reading materials
const REGIONAL_READING_MATERIALS = {
  hi: {
    beginner: [
      {
        id: 'hi-1',
        title: "सुबह की दिनचर्या",
        text: "राम रोज सुबह 6 बजे उठता है। वह अपने दाँत साफ करता है और स्नान करता है। फिर वह नाश्ता करता है और स्कूल जाता है। उसे पढ़ना बहुत अच्छा लगता है।",
        questions: [
          {
            question: "राम कितने बजे उठता है?",
            options: ["5 बजे", "6 बजे", "7 बजे", "8 बजे"],
            correct: 1
          },
          {
            question: "राम कहाँ जाता है?",
            options: ["दुकान", "पार्क", "स्कूल", "दफ्तर"],
            correct: 2
          }
        ]
      }
    ],
    intermediate: [
      {
        id: 'hi-2',
        title: "पर्यावरण संरक्षण",
        text: "पर्यावरण संरक्षण आज के समय की सबसे बड़ी आवश्यकता है। हमें पेड़ लगाने चाहिए और प्लास्टिक का कम उपयोग करना चाहिए। सौर ऊर्जा और पवन ऊर्जा जैसे नवीकरणीय ऊर्जा स्रोतों का उपयोग करना चाहिए।",
        questions: [
          {
            question: "पर्यावरण संरक्षण क्यों जरूरी है?",
            options: ["मनोरंजन के लिए", "आज की सबसे बड़ी आवश्यकता", "पैसा कमाने के लिए", "समय बिताने के लिए"],
            correct: 1
          }
        ]
      }
    ]
  },
  kn: {
    beginner: [
      {
        id: 'kn-1',
        title: "ಬೆಳಗಿನ ದಿನಚರಿ",
        text: "ಅರುಣ್ ಪ್ರತಿದಿನ ಬೆಳಗ್ಗೆ 6 ಗಂಟೆಗೆ ಎದ್ದೇಳುತ್ತಾನೆ. ಅವನು ಹಲ್ಲು ತೊಳೆದು ಸ್ನಾನ ಮಾಡುತ್ತಾನೆ. ನಂತರ ಅವನು ತಿಂಡಿ ತಿಂದು ಶಾಲೆಗೆ ಹೋಗುತ್ತಾನೆ. ಅವನಿಗೆ ಓದುವುದು ತುಂಬಾ ಇಷ್ಟ.",
        questions: [
          {
            question: "ಅರುಣ್ ಎಷ್ಟು ಗಂಟೆಗೆ ಎದ್ದೇಳುತ್ತಾನೆ?",
            options: ["5 ಗಂಟೆ", "6 ಗಂಟೆ", "7 ಗಂಟೆ", "8 ಗಂಟೆ"],
            correct: 1
          },
          {
            question: "ಅರುಣ್ ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಾನೆ?",
            options: ["ಅಂಗಡಿ", "ಪಾರ್ಕ್", "ಶಾಲೆ", "ಕಚೇರಿ"],
            correct: 2
          }
        ]
      }
    ],
    intermediate: [
      {
        id: 'kn-2',
        title: "ಪರಿಸರ ಸಂರಕ್ಷಣೆ",
        text: "ಪರಿಸರ ಸಂರಕ್ಷಣೆ ಇಂದಿನ ಕಾಲದ ಅತ್ಯಂತ ಪ್ರಮುಖ ಅಗತ್ಯ. ನಾವು ಮರಗಳನ್ನು ನೆಡಬೇಕು ಮತ್ತು ಪ್ಲಾಸ್ಟಿಕ್ ಬಳಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಬೇಕು. ಸೂರ್ಯ ಶಕ್ತಿ ಮತ್ತು ಗಾಳಿ ಶಕ್ತಿಯಂತಹ ನವೀಕರಣೀಯ ಇಂಧನ ಮೂಲಗಳನ್ನು ಬಳಸಬೇಕು.",
        questions: [
          {
            question: "ಪರಿಸರ ಸಂರಕ್ಷಣೆ ಏಕೆ ಮುಖ್ಯ?",
            options: ["ಮನೋರಂಜನೆಗಾಗಿ", "ಇಂದಿನ ಪ್ರಮುಖ ಅಗತ್ಯ", "ಹಣ ಗಳಿಸಲು", "ಸಮಯ ಕಳೆಯಲು"],
            correct: 1
          }
        ]
      }
    ]
  },
  ta: {
    beginner: [
      {
        id: 'ta-1',
        title: "காலை வழக்கம்",
        text: "கார்த்திக் தினமும் காலை 6 மணிக்கு எழுந்திருப்பான். அவன் பல் தேய்த்து குளித்துவிட்டு காலை உணவு சாப்பிடுவான். பின்னர் அவன் பள்ளிக்கு செல்வான். அவனுக்கு படிப்பது மிகவும் பிடிக்கும்.",
        questions: [
          {
            question: "கார்த்திக் எத்தனை மணிக்கு எழுகிறான்?",
            options: ["5 மணி", "6 மணி", "7 மணி", "8 மணி"],
            correct: 1
          },
          {
            question: "கார்த்திக் எங்கே செல்கிறான்?",
            options: ["கடை", "பூங்கா", "பள்ளி", "அலுவலகம்"],
            correct: 2
          }
        ]
      }
    ]
  }
};

// Sample reading materials with different difficulty levels
const READING_MATERIALS = {
  beginner: [
    {
      id: 1,
      title: "The Morning Routine",
      text: "Every morning, Sarah wakes up at 7 AM. She brushes her teeth and has breakfast. Then she reads the news and gets ready for work. She leaves her house at 8:30 AM to catch the bus.",
      questions: [
        {
          question: "What time does Sarah wake up?",
          options: ["6 AM", "7 AM", "8 AM", "9 AM"],
          correct: 1
        },
        {
          question: "How does Sarah get to work?",
          options: ["By car", "By bus", "By train", "She walks"],
          correct: 1
        }
      ]
    },
    {
      id: 2,
      title: "Weekend Plans",
      text: "Tom loves weekends because he can relax. On Saturday morning, he goes to the park to exercise. In the afternoon, he meets friends for lunch. On Sunday, he stays home and reads books.",
      questions: [
        {
          question: "Where does Tom exercise?",
          options: ["At home", "At the gym", "In the park", "At work"],
          correct: 2
        },
        {
          question: "What does Tom do on Sunday afternoon?",
          options: ["Exercise", "Meet friends", "Read books", "Go shopping"],
          correct: 2
        }
      ]
    }
  ],
  intermediate: [
    {
      id: 3,
      title: "Climate Change Solutions",
      text: "Climate change represents one of the most significant challenges of our time. Scientists worldwide are developing innovative solutions to reduce carbon emissions. Renewable energy sources like solar and wind power are becoming more efficient and cost-effective. Additionally, electric vehicles are gaining popularity as alternatives to traditional gasoline-powered cars.",
      questions: [
        {
          question: "According to the text, what are scientists focusing on?",
          options: ["Increasing emissions", "Reducing carbon emissions", "Building more cars", "Creating new problems"],
          correct: 1
        },
        {
          question: "What examples of renewable energy are mentioned?",
          options: ["Coal and oil", "Solar and wind", "Gas and nuclear", "Wood and coal"],
          correct: 1
        }
      ]
    }
  ],
  advanced: [
    {
      id: 4,
      title: "Quantum Computing Revolution",
      text: "Quantum computing represents a paradigm shift in computational capabilities, leveraging quantum mechanical phenomena such as superposition and entanglement to process information in fundamentally different ways. Unlike classical computers that use binary bits, quantum computers utilize quantum bits or 'qubits' that can exist in multiple states simultaneously, enabling exponential increases in processing power for specific types of calculations.",
      questions: [
        {
          question: "What quantum phenomena does quantum computing leverage?",
          options: ["Gravity and magnetism", "Superposition and entanglement", "Electricity and heat", "Light and sound"],
          correct: 1
        },
        {
          question: "How do qubits differ from classical bits?",
          options: ["They're faster", "They can exist in multiple states simultaneously", "They're smaller", "They use less energy"],
          correct: 1
        }
      ]
    }
  ]
};

const READING_MODES = {
  GUIDED: 'guided',
  SPEED: 'speed', 
  COMPREHENSION: 'comprehension',
  FREE: 'free'
};

function ReadingPractice() {
  // State management
  const [currentMode, setCurrentMode] = useState(READING_MODES.GUIDED);
  const [difficultyLevel, setDifficultyLevel] = useState('beginner');
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState(null);
  const [readingEndTime, setReadingEndTime] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(200); // WPM
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState({
    totalSessions: 0,
    averageScore: 0,
    averageWPM: 0,
    completedMaterials: []
  });
  const [useSimplifiedText, setUseSimplifiedText] = useState(false);
  const [simplifiedMaterial, setSimplifiedMaterial] = useState(null);
  const [readabilityScore, setReadabilityScore] = useState(null);
  const [showTextOptions, setShowTextOptions] = useState(false);
  const [showCustomTextInput, setShowCustomTextInput] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Refs
  const timerRef = useRef(null);
  const utteranceRef = useRef(null);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('reading-practice-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Load available voices on component mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voices = await ttsService.getVoices();
        setAvailableVoices(voices);
        
        // Set default voice based on selected language
        const defaultVoice = voices.find(voice => voice.id === selectedLanguage) || voices[0];
        setSelectedVoice(defaultVoice);
      } catch (error) {
        console.error('Failed to load voices:', error);
        // Use fallback voices
        const fallbackVoices = ttsService.getFallbackVoices();
        setAvailableVoices(fallbackVoices);
        const defaultVoice = fallbackVoices.find(voice => voice.id === selectedLanguage) || fallbackVoices[0];
        setSelectedVoice(defaultVoice);
      }
    };

    loadVoices();
  }, [selectedLanguage]);

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress) => {
    localStorage.setItem('reading-practice-progress', JSON.stringify(newProgress));
    setProgress(newProgress);
  }, []);

  // Get reading materials based on selected language
  const getReadingMaterials = () => {
    if (selectedLanguage === 'en') {
      return READING_MATERIALS;
    }
    return REGIONAL_READING_MATERIALS[selectedLanguage] || { beginner: [], intermediate: [], advanced: [] };
  };

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    setCurrentMaterial(null); // Reset current material when language changes
    setShowQuestions(false);
    setUserAnswers([]);
  };

  // Handle custom text submission
  const handleCustomTextSubmit = () => {
    if (!customText.trim()) {
      alert('Please enter some text to practice reading.');
      return;
    }

    const customMaterial = {
      id: 'custom',
      title: customTitle.trim() || 'Custom Text',
      text: customText.trim(),
      questions: [
        {
          question: "What was the main topic of this text?",
          options: ["Technology", "Science", "General content", "Other"],
          correct: 2
        },
        {
          question: "Did you understand the content well?",
          options: ["Very well", "Mostly", "Partially", "Not well"],
          correct: 0
        }
      ]
    };

    setShowCustomTextInput(false);
    startReadingSession(customMaterial);
  };

  // Reset custom text form
  const resetCustomText = () => {
    setCustomText('');
    setCustomTitle('');
    setShowCustomTextInput(false);
  };

  // Start a reading session
  const startReadingSession = (material) => {
    setCurrentMaterial(material);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowQuestions(false);
    setShowResults(false);
    setReadingStartTime(Date.now());
    setReadingEndTime(null);
    setCurrentWordIndex(-1);
    setShowTextOptions(true);
    
    // Calculate readability score
    const readability = calculateReadabilityScore(material.text);
    setReadabilityScore(readability);
    
    // Generate simplified version
    const simplified = simplifyText(material.text, {
      simplifyVocab: true,
      simplifyStructure: true,
      targetLevel: difficultyLevel === 'beginner' ? 'easy' : 'medium'
    });
    
    setSimplifiedMaterial({
      ...material,
      text: simplified.simplifiedText,
      originalText: material.text,
      simplificationResult: simplified
    });
  };

  // Handle mode-specific reading
  const handleStartReading = () => {
    if (!currentMaterial) return;

    setReadingStartTime(Date.now());
    setIsReading(true);
    setShowTextOptions(false);

    switch (currentMode) {
      case READING_MODES.GUIDED:
        startGuidedReading();
        break;
      case READING_MODES.SPEED:
        startSpeedReading();
        break;
      case READING_MODES.COMPREHENSION:
        setReadingStartTime(Date.now());
        break;
      default:
        break;
    }
  };

  // Guided reading with TTS
  const startGuidedReading = useCallback(async () => {
    const textToRead = useSimplifiedText ? simplifiedMaterial?.text : currentMaterial.text;
    const words = tokenizeText(textToRead).filter(token => token.type === 'word');
    let wordIndex = 0;

    try {
      // Try using backend TTS for better language support
      if (selectedVoice && selectedLanguage !== 'en') {
        const chunkedData = await ttsService.getChunkedText({
          text: textToRead,
          voice: selectedLanguage,
          speed: 0.8,
          chunk_type: 'word'
        });
        
        // Highlight words as they would be spoken
        const highlightWords = () => {
          if (wordIndex < words.length && isReading) {
            setCurrentWordIndex(wordIndex);
            wordIndex++;
            timerRef.current = setTimeout(highlightWords, 500); // Adjust timing as needed
          } else {
            setIsReading(false);
            setReadingEndTime(Date.now());
            setTimeout(() => setShowQuestions(true), 1000);
          }
        };
        
        // Get the audio and play it
        const audioBlob = await ttsService.textToSpeech({
          text: textToRead,
          voice: selectedLanguage,
          speed: 0.8
        });
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onplay = () => highlightWords();
        audio.onended = () => {
          setIsReading(false);
          setReadingEndTime(Date.now());
          setTimeout(() => setShowQuestions(true), 1000);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.play();
        
      } else {
        // Fallback to browser TTS for English and unsupported languages
        const browserVoices = browserTTS.getVoices();
        const bestVoice = selectedLanguage !== 'en' 
          ? browserTTS.findBestVoiceForLanguage(browserVoices, selectedLanguage)
          : browserTTS.findBestEnglishVoice(browserVoices);

        const utterance = browserTTS.speak(textToRead, {
          voice: bestVoice,
          rate: 0.8,
          pitch: 1,
          volume: 1
        });

        utterance.onboundary = (event) => {
          if (event.name === 'word' && wordIndex < words.length) {
            setCurrentWordIndex(wordIndex);
            wordIndex++;
          }
        };

        utterance.onend = () => {
          setIsReading(false);
          setReadingEndTime(Date.now());
          setTimeout(() => setShowQuestions(true), 1000);
        };

        utteranceRef.current = utterance;
      }
    } catch (error) {
      console.error('TTS error:', error);
      // Fallback to browser TTS
      const utterance = browserTTS.speak(textToRead, {
        rate: 0.8,
        pitch: 1,
        volume: 1
      });

      utterance.onboundary = (event) => {
        if (event.name === 'word' && wordIndex < words.length) {
          setCurrentWordIndex(wordIndex);
          wordIndex++;
        }
      };

      utterance.onend = () => {
        setIsReading(false);
        setReadingEndTime(Date.now());
        setTimeout(() => setShowQuestions(true), 1000);
      };

      utteranceRef.current = utterance;
    }
  }, [currentMaterial, selectedLanguage, selectedVoice, useSimplifiedText, simplifiedMaterial, isReading]);

  // Speed reading trainer
  const startSpeedReading = useCallback(() => {
    const words = tokenizeText(currentMaterial.text).filter(token => token.type === 'word');
    const msPerWord = 60000 / readingSpeed; // Convert WPM to ms per word
    let wordIndex = 0;

    const showNextWord = () => {
      if (wordIndex < words.length && isReading) {
        setCurrentWordIndex(wordIndex);
        wordIndex++;
        timerRef.current = setTimeout(showNextWord, msPerWord);
      } else {
        setIsReading(false);
        setReadingEndTime(Date.now());
        setTimeout(() => setShowQuestions(true), 1000);
      }
    };

    showNextWord();
  }, [currentMaterial, readingSpeed, isReading]);

  // Handle reading completion
  const completeReading = () => {
    setReadingEndTime(Date.now());
    setIsReading(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (utteranceRef.current) browserTTS.cancel();
    setShowQuestions(true);
  };

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  // Submit answers and calculate results
  const submitAnswers = () => {
    const readingTime = readingEndTime - readingStartTime;
    const wordsRead = tokenizeText(currentMaterial.text).filter(token => token.type === 'word').length;
    const wpm = Math.round((wordsRead / (readingTime / 60000)));
    
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === currentMaterial.questions[index].correct
    ).length;
    
    const score = Math.round((correctAnswers / currentMaterial.questions.length) * 100);

    // Update progress
    const newProgress = {
      ...progress,
      totalSessions: progress.totalSessions + 1,
      averageScore: Math.round(((progress.averageScore * progress.totalSessions) + score) / (progress.totalSessions + 1)),
      averageWPM: Math.round(((progress.averageWPM * progress.totalSessions) + wpm) / (progress.totalSessions + 1)),
      completedMaterials: [...progress.completedMaterials, currentMaterial.id]
    };

    saveProgress(newProgress);
    setShowResults({ wpm, score, correctAnswers, totalQuestions: currentMaterial.questions.length });
  };

  // Reset session
  const resetSession = () => {
    setCurrentMaterial(null);
    setShowQuestions(false);
    setShowResults(false);
    setIsReading(false);
    setCurrentWordIndex(-1);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (utteranceRef.current) browserTTS.cancel();
  };

  // Render highlighted text
  const renderHighlightedText = () => {
    if (!currentMaterial) return null;

    const textToRender = useSimplifiedText ? simplifiedMaterial?.text : currentMaterial.text;
    const words = tokenizeText(textToRender);
    const wordTokensOnly = words.filter(t => t.type === 'word');

    return (
      <div className="reading-text">
        {words.map((token, index) => {
          if (token.type === 'whitespace') {
            return <span key={`ws-${index}`}>{token.text}</span>;
          }
          
          const wordIndex = wordTokensOnly.findIndex(w => w === token);
          const isHighlighted = wordIndex === currentWordIndex;

          return (
            <span
              key={`word-${index}`}
              className={`reading-word ${isHighlighted ? 'highlight-current' : ''}`}
              style={{
                fontSize: currentMode === READING_MODES.SPEED ? '1.5rem' : '1rem',
                fontWeight: isHighlighted ? 'bold' : 'normal',
                backgroundColor: isHighlighted ? '#ffeb3b' : 'transparent',
                transition: 'all 0.2s ease'
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
    <div className="reading-practice-page">
      <div className="container">
        <header className="page-header">
          <h1 className="title">📚 Reading Practice</h1>
          <p className="subtitle">
            Improve your reading skills with interactive exercises and tracking
          </p>
        </header>

        {/* Progress Dashboard */}
        <section className="progress-dashboard">
          <h2>📊 Your Progress</h2>
          <div className="progress-stats">
            <div className="stat-card">
              <span className="stat-value">{progress.totalSessions}</span>
              <span className="stat-label">Sessions Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{progress.averageScore}%</span>
              <span className="stat-label">Average Score</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{progress.averageWPM}</span>
              <span className="stat-label">Average WPM</span>
            </div>
          </div>
        </section>

        {/* Mode Selection */}
        <section className="mode-selection">
          <h2>🎯 Choose Reading Mode</h2>
          <div className="mode-buttons">
            {Object.values(READING_MODES).map(mode => (
              <button
                key={mode}
                className={`mode-btn ${currentMode === mode ? 'active' : ''}`}
                onClick={() => setCurrentMode(mode)}
              >
                {mode === READING_MODES.GUIDED && '🎤 Guided Reading'}
                {mode === READING_MODES.SPEED && '⚡ Speed Reading'}
                {mode === READING_MODES.COMPREHENSION && '🧠 Comprehension'}
                {mode === READING_MODES.FREE && '📖 Free Reading'}
              </button>
            ))}
          </div>
        </section>

        {/* Language Selection */}
        <section className="language-selection">
          <h2>🌐 Select Language</h2>
          <div className="language-options">
            <select 
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-select"
            >
              <option value="en">🇺🇸 English</option>
              <option value="hi">🇮🇳 Hindi (हिन्दी)</option>
              <option value="kn">🇮🇳 Kannada (ಕನ್ನಡ)</option>
              <option value="ta">🇮🇳 Tamil (தமிழ்)</option>
              <option value="te">🇮🇳 Telugu (తెలుగు)</option>
              <option value="ml">🇮🇳 Malayalam (മലയാളം)</option>
              <option value="bn">🇮🇳 Bengali (বাংলা)</option>
              <option value="gu">🇮🇳 Gujarati (ગુજરાતી)</option>
              <option value="mr">🇮🇳 Marathi (मराठी)</option>
              <option value="pa">🇮🇳 Punjabi (ਪੰਜਾਬੀ)</option>
              <option value="ur">🇵🇰 Urdu (اردو)</option>
              <option value="es">🇪🇸 Spanish</option>
              <option value="fr">🇫🇷 French</option>
              <option value="de">🇩🇪 German</option>
            </select>
            {selectedVoice && (
              <div className="voice-info">
                🎤 Voice: {selectedVoice.name} ({selectedVoice.language})
              </div>
            )}
          </div>
        </section>

        {/* Difficulty Selection */}
        <section className="difficulty-selection">
          <h2>📈 Difficulty Level</h2>
          <select 
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            className="difficulty-select"
          >
            <option value="beginner">🌱 Beginner</option>
            <option value="intermediate">🌿 Intermediate</option>
            <option value="advanced">🌳 Advanced</option>
          </select>
        </section>

        {/* Speed Control (for speed reading mode) */}
        {currentMode === READING_MODES.SPEED && (
          <section className="speed-control">
            <h3>⚡ Reading Speed: {readingSpeed} WPM</h3>
            <input
              type="range"
              min="100"
              max="600"
              step="50"
              value={readingSpeed}
              onChange={(e) => setReadingSpeed(parseInt(e.target.value))}
              className="speed-slider"
            />
          </section>
        )}

        {/* Material Selection */}
        <section className="material-selection">
          <h2>📝 Choose Reading Material</h2>
          <div className="material-grid">
            {getReadingMaterials()[difficultyLevel]?.length > 0 ? (
              getReadingMaterials()[difficultyLevel].map(material => (
                <div
                  key={material.id}
                  className={`material-card ${currentMaterial?.id === material.id ? 'selected' : ''}`}
                  onClick={() => startReadingSession(material)}
                >
                  <h3>{material.title}</h3>
                  <p>{material.text.substring(0, 100)}...</p>
                  <span className="material-stats">
                    {tokenizeText(material.text).filter(t => t.type === 'word').length} words
                  </span>
                </div>
              ))
            ) : (
              <div className="no-materials-message">
                <h3>📚 No materials available</h3>
                <p>
                  We're working on adding more content for {selectedLanguage === 'en' ? 'English' : availableVoices.find(v => v.id === selectedLanguage)?.name || selectedLanguage} 
                  at the {difficultyLevel} level. Please try a different difficulty or use the custom text option below.
                </p>
              </div>
            )}
            
            {/* Custom Text Option */}
            <div
              className={`material-card custom-text-card ${showCustomTextInput ? 'selected' : ''}`}
              onClick={() => setShowCustomTextInput(true)}
            >
              <h3>✍️ Add Your Own Text</h3>
              <p>Practice reading with your own custom text content in {availableVoices.find(v => v.id === selectedLanguage)?.name || 'your selected language'}...</p>
              <span className="material-stats">Custom length</span>
            </div>
          </div>
        </section>

        {/* Custom Text Input */}
        {showCustomTextInput && (
          <section className="custom-text-input">
            <h2>✍️ Enter Your Custom Text</h2>
            <div className="custom-text-form">
              <div className="input-group">
                <label htmlFor="customTitle">Title (Optional):</label>
                <input
                  type="text"
                  id="customTitle"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter a title for your text..."
                  className="title-input"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="customTextArea">Your Text:</label>
                <textarea
                  id="customTextArea"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Paste or type your text here. This can be an article, story, essay, or any content you'd like to practice reading..."
                  className="text-area"
                  rows="8"
                />
                <div className="text-stats">
                  Words: {customText.trim() ? customText.trim().split(/\s+/).length : 0} | 
                  Characters: {customText.length}
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  onClick={handleCustomTextSubmit}
                  className="submit-btn"
                  disabled={!customText.trim()}
                >
                  🚀 Start Reading Practice
                </button>
                <button 
                  onClick={resetCustomText}
                  className="cancel-btn"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Text Options */}
        {showTextOptions && currentMaterial && simplifiedMaterial && (
          <section className="text-options">
            <h2>📝 Choose Your Reading Experience</h2>
            <div className="text-choice-grid">
              {/* Original Text Option */}
              <div className={`text-option ${!useSimplifiedText ? 'selected' : ''}`}>
                <div className="option-header">
                  <h3>📄 Original Text</h3>
                  <div className="readability-badge">
                    <span className={`level-${readabilityScore?.level.toLowerCase().replace(' ', '-')}`}>
                      {readabilityScore?.level} Level
                    </span>
                    <span className="score">Score: {readabilityScore?.score}</span>
                  </div>
                </div>
                <div className="text-preview">
                  {currentMaterial.text.substring(0, 150)}...
                </div>
                <div className="text-stats">
                  <span>📊 {readabilityScore?.totalWords} words</span>
                  <span>📏 Avg: {readabilityScore?.avgSentenceLength} words/sentence</span>
                </div>
                <button 
                  onClick={() => setUseSimplifiedText(false)}
                  className={`select-btn ${!useSimplifiedText ? 'selected' : ''}`}
                >
                  Use Original Text
                </button>
              </div>

              {/* Simplified Text Option */}
              <div className={`text-option ${useSimplifiedText ? 'selected' : ''}`}>
                <div className="option-header">
                  <h3>✨ Simplified Text</h3>
                  <div className="readability-badge">
                    <span className="level-easy">
                      {calculateReadabilityScore(simplifiedMaterial.text).level} Level
                    </span>
                    <span className="score">Score: {calculateReadabilityScore(simplifiedMaterial.text).score}</span>
                  </div>
                </div>
                <div className="text-preview">
                  {simplifiedMaterial.text.substring(0, 150)}...
                </div>
                <div className="text-stats">
                  <span>📊 {calculateReadabilityScore(simplifiedMaterial.text).totalWords} words</span>
                  <span>📈 Improved by {simplifiedMaterial.simplificationResult.improvementScore.toFixed(1)} points</span>
                </div>
                <button 
                  onClick={() => setUseSimplifiedText(true)}
                  className={`select-btn ${useSimplifiedText ? 'selected' : ''}`}
                >
                  Use Simplified Text
                </button>
              </div>
            </div>
            
            <div className="text-options-actions">
              <button onClick={handleStartReading} className="start-reading-btn">
                🚀 Start Reading with {useSimplifiedText ? 'Simplified' : 'Original'} Text
              </button>
            </div>
          </section>
        )}

        {/* Reading Area */}
        {currentMaterial && !showQuestions && !showResults && !showTextOptions && (
          <section className="reading-area">
            <div className="reading-header">
              <h2>{currentMaterial.title}</h2>
              <div className="reading-controls">
                {!isReading ? (
                  <button onClick={handleStartReading} className="control-btn start-btn">
                    ▶️ Start Reading
                  </button>
                ) : (
                  <>
                    <button onClick={completeReading} className="control-btn complete-btn">
                      ⏹️ Complete
                    </button>
                    {currentMode === READING_MODES.GUIDED && (
                      <button 
                        onClick={isPaused ? () => browserTTS.resume() : () => browserTTS.pause()} 
                        className="control-btn pause-btn"
                      >
                        {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                      </button>
                    )}
                  </>
                )}
                <button onClick={resetSession} className="control-btn reset-btn">
                  🔄 Reset
                </button>
              </div>
            </div>
            {renderHighlightedText()}
          </section>
        )}

        {/* Questions Section */}
        {showQuestions && currentMaterial && (
          <section className="questions-section">
            <h2>❓ Comprehension Questions</h2>
            <div className="question-progress">
              Question {currentQuestionIndex + 1} of {currentMaterial.questions.length}
            </div>
            
            {currentMaterial.questions.map((q, qIndex) => (
              <div key={qIndex} className="question-card">
                <h3>{q.question}</h3>
                <div className="options">
                  {q.options.map((option, oIndex) => (
                    <label key={oIndex} className="option-label">
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={oIndex}
                        checked={userAnswers[qIndex] === oIndex}
                        onChange={() => handleAnswerSelect(qIndex, oIndex)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            <button 
              onClick={submitAnswers}
              disabled={userAnswers.length !== currentMaterial.questions.length}
              className="submit-btn"
            >
              📊 Submit Answers
            </button>
          </section>
        )}

        {/* Results Section */}
        {showResults && (
          <section className="results-section">
            <h2>🎉 Session Results</h2>
            <div className="results-grid">
              <div className="result-card">
                <span className="result-value">{showResults.wpm}</span>
                <span className="result-label">Words Per Minute</span>
              </div>
              <div className="result-card">
                <span className="result-value">{showResults.score}%</span>
                <span className="result-label">Comprehension Score</span>
              </div>
              <div className="result-card">
                <span className="result-value">{showResults.correctAnswers}/{showResults.totalQuestions}</span>
                <span className="result-label">Correct Answers</span>
              </div>
            </div>
            
            <div className="result-actions">
              <button onClick={resetSession} className="action-btn">
                📚 Try Another
              </button>
              <button onClick={() => startReadingSession(currentMaterial)} className="action-btn">
                🔄 Retry This
              </button>
            </div>
          </section>
        )}

        {/* Tips Section */}
        <section className="tips-section">
          <h2>💡 Reading Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h3>🎯 Guided Reading</h3>
              <p>Follow along with audio to improve pronunciation and pace</p>
            </div>
            <div className="tip-card">
              <h3>⚡ Speed Reading</h3>
              <p>Train your eyes to read faster while maintaining comprehension</p>
            </div>
            <div className="tip-card">
              <h3>🧠 Focus on Comprehension</h3>
              <p>Understanding is more important than speed</p>
            </div>
            <div className="tip-card">
              <h3>📈 Practice Regularly</h3>
              <p>Consistent practice leads to better reading skills</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ReadingPractice;