# Text to Speech Microservice

A FastAPI-based microservice that converts text to speech using Google Text-to-Speech (gTTS).

## Features

- Convert text to speech using gTTS
- Streaming audio response
- CORS enabled
- Error handling
- Simple API interface

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

To run the application:

```bash
cd text-to-speech
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`

## API Endpoints

### GET /
- Returns API status

### POST /tts
- Converts text to speech
- Parameters:
  - text (form-data): Text to convert to speech
- Returns: MP3 audio file

## Example Usage

```bash
curl -X POST "http://127.0.0.1:8000/tts" \
     -F "text=Hello, this is a test message" \
     --output speech.mp3
```
