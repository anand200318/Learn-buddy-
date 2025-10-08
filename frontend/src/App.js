import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TextToSpeechPage from './components/features/TextToSpeech';
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
