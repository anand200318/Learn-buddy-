import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TextToSpeechPage from './components/features/TextToSpeech';
import ReadingPractice from './components/features/ReadingPractice';
import TextSimplification from './components/features/TextSimplification';
import Navbar from './components/common/Navbar';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/text-to-speech" element={<TextToSpeechPage />} />
          <Route path="/reading-practice" element={<ReadingPractice />} />
          <Route path="/text-simplification" element={<TextSimplification />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
