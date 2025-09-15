import React, { useState, useRef } from "react";
import { convertTextToSpeech } from "../services/textToSpeechService";
import "../styles/FeaturesPage.css";

function TextToSpeechPage() {
  const [text, setText] = useState(
    "This is My Learn Buddy. A friendly tool for learning with text to speech support."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playAudio = async () => {
    if (!text.trim()) return;

    setIsLoading(true);

    try {
      console.log("Sending request with text:", text);
      
      // Try different approaches to send the data
      let response;
      
      // First try: FormData
      try {
        const formData = new FormData();
        formData.append('text', text);
        
        response = await fetch("http://127.0.0.1:8000/tts", {
          method: "POST",
          body: formData,
        });
        
        if (response.ok) {
          console.log("FormData approach worked!");
        }
      } catch (formError) {
        console.log("FormData failed, trying URL-encoded...");
        
        // Second try: URL-encoded form data
        const params = new URLSearchParams();
        params.append('text', text);
        
        response = await fetch("http://127.0.0.1:8000/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        });
        
        if (!response.ok) {
          console.log("URL-encoded failed, trying JSON again with different approach...");
          
          // Third try: JSON with explicit headers
          response = await fetch("http://127.0.0.1:8000/tts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({ text: text }),
          });
        }
      }

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        // Try to get the error details from the response
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`HTTP error! status: ${response.status}. Response: ${errorText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Full error:", error);
      alert(`Failed to generate speech: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="text-to-speech-page">
      <header className="page-header">
        <h1>Text to Speech</h1>
        <p>Convert your text to natural-sounding speech</p>
      </header>

      <main className="tts-content">
        <div className="tts-container">
          <div className="text-input-section">
            <label htmlFor="text-input">Enter your text:</label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              rows={6}
              className="text-input"
            />
          </div>

          <div className="action-buttons">
            <button
              onClick={playAudio}
              disabled={isLoading || !text.trim() || isPlaying}
              className="btn btn-primary"
            >
              {isLoading ? "⏳ Converting..." : "▶️ Play Speech"}
            </button>

            <button
              onClick={stopAudio}
              disabled={!isPlaying}
              className="btn btn-secondary"
            >
              ⏹️ Stop
            </button>
          </div>

          <audio
            ref={audioRef}
            onEnded={() => {
              setIsPlaying(false);
            }}
            style={{ display: "none" }}
          />
        </div>
      </main>
    </div>
  );
}

export default TextToSpeechPage;