import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import heroImage from '../images/hero.jpg';
import textToSpeechIcon from '../images/text-to-speech.png';
import readingBookIcon from '../images/reading-book.png';

function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Learn Smarter with AI</h1>
          <p className="hero-subtitle">
            Transform your learning experience with text-to-speech, interactive lessons, and personalized education tools.
          </p>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="AI Learning" className="hero-img" />
        </div>
      </section>

      {/* Features Preview */}
      <section className="features-preview">
        <h2 className="section-title">What We Offer</h2>
        <div className="features-grid">
          <Link to="/text-to-speech" className="feature-card clickable-card">
            <div className="feature-icon">
              <img src={textToSpeechIcon} alt="Text to Speech Icon" className="feature-icon" />
            </div>
            <h3>Text to Speech</h3>
            <p>Convert any text to natural speech instantly</p>
            <span className="feature-link">Try Now →</span>
          </Link>
          
          <div className="feature-card">
            <div className="feature-icon">
              <img src={readingBookIcon} alt="Reading Practice Icon" className="feature-icon" />
            </div>
            <h3>Reading Practice</h3>
            <p>Interactive reading exercises and comprehension</p>
            <span className="coming-soon">Coming Soon</span>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">✍️</div>
            <h3>Writing Helper</h3>
            <p>Grammar check and writing assistance</p>
            <span className="coming-soon">Coming Soon</span>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Language Learning</h3>
            <p>Multi-language support and pronunciation</p>
            <span className="coming-soon">Coming Soon</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;