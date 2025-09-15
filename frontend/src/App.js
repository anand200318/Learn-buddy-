import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TextToSpeechPage from './pages/text-to-speech';
import Navbar from './pages/navbar';
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
