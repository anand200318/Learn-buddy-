# 🎤 Text-to-Speech Microservice

A professional FastAPI-based microservice that converts text to speech using Google Text-to-Speech (gTTS) with advanced features for the Learn Buddy platform.

## ✨ Features

- **High-Quality TTS**: Convert text to speech using Google's gTTS engine
- **Multiple Languages**: Support for 12+ languages including English, Spanish, French, German, etc.
- **Advanced Controls**: Speed control, voice selection, and chunked processing
- **Streaming Response**: Efficient audio streaming for better performance
- **Text Chunking**: Break down text into words/sentences for highlighting
- **Input Validation**: Comprehensive text validation and error handling
- **CORS Support**: Cross-origin requests enabled for frontend integration
- **Health Monitoring**: Built-in health check endpoints
- **Legacy Support**: Backward compatibility with older API versions

## 🏗️ Architecture

```
├── app/
│   └── main.py          # FastAPI application with all endpoints
├── tests/
│   └── test_main.py     # Comprehensive test suite
├── requirements.txt     # Python dependencies
├── README.md           # This file
└── .gitignore         # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Learn-buddy/text-to-speech
   ```

2. **Create virtual environment** (recommended)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Service

#### Development Mode
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8002
```

#### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8002
```

The API will be available at `http://localhost:8002`

## 📚 API Documentation

### Base URL
```
http://localhost:8002
```

### Endpoints

#### **GET /** - Service Status
Returns the service status and version information.

**Response:**
```json
{
  "message": "Enhanced Text to Speech API is running",
  "version": "2.0.0"
}
```

#### **GET /voices** - Available Voices
Get list of supported TTS voices and languages.

**Response:**
```json
{
  "voices": [
    {
      "id": "en",
      "name": "English",
      "language": "English"
    },
    // ... more voices
  ]
}
```

#### **POST /tts** - Convert Text to Speech
Convert text to speech and return audio stream.

**Request Body:**
```json
{
  "text": "Hello, this is a test message",
  "voice": "en",
  "speed": 1.0
}
```

**Parameters:**
- `text` (string, required): Text to convert to speech
- `voice` (string, optional): Language code (default: "en")
- `speed` (float, optional): Speech speed multiplier (default: 1.0)

**Response:** Audio stream (MP3 format)

#### **POST /tts/chunked** - Get Text Chunks
Get text broken down into chunks for highlighting synchronization.

**Request Body:**
```json
{
  "text": "Hello world. This is a test.",
  "voice": "en",
  "speed": 1.0,
  "chunk_type": "word"
}
```

**Parameters:**
- `chunk_type` (string): "word" or "sentence"

**Response:**
```json
{
  "chunks": [
    {
      "text": "Hello",
      "start": 0,
      "end": 5,
      "type": "word"
    }
  ],
  "total_chunks": 6,
  "chunk_type": "word"
}
```

#### **POST /tts/validate** - Validate Text
Validate text input for TTS processing.

**Request:** Form data with `text` field

**Response:**
```json
{
  "valid": true,
  "character_count": 25,
  "word_count": 5,
  "estimated_duration": 2.5
}
```

#### **GET /health** - Health Check
Check service health status.

**Response:**
```json
{
  "status": "healthy",
  "service": "text-to-speech"
}
```

## 🧪 Testing

### Run Tests
```bash
pytest tests/ -v
```

### Test Coverage
```bash
pytest tests/ --cov=app --cov-report=html
```

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 8002)
- `HOST`: Server host (default: 0.0.0.0)
- `CORS_ORIGINS`: Allowed CORS origins (default: *)

### Customization
You can modify the available voices by updating the `get_available_voices()` function in `app/main.py`.

## 📝 Usage Examples

### cURL Examples

**Basic TTS:**
```bash
curl -X POST "http://localhost:8002/tts" \
     -H "Content-Type: application/json" \
     -d '{"text":"Hello World","voice":"en","speed":1.0}' \
     --output speech.mp3
```

**Get Voices:**
```bash
curl -X GET "http://localhost:8002/voices"
```

**Validate Text:**
```bash
curl -X POST "http://localhost:8002/tts/validate" \
     -F "text=Hello World"
```

### JavaScript Examples

```javascript
// Convert text to speech
const response = await fetch('http://localhost:8002/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Hello World',
    voice: 'en',
    speed: 1.2
  })
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
```

## 🚀 Deployment

### Docker (Recommended)
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ ./app/
EXPOSE 8002

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002"]
```

### Systemd Service
Create `/etc/systemd/system/tts-service.service`:
```ini
[Unit]
Description=Text-to-Speech Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/text-to-speech
Environment=PATH=/path/to/venv/bin
ExecStart=/path/to/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8002
Restart=always

[Install]
WantedBy=multi-user.target
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🛠️ Troubleshooting

### Common Issues

**Issue:** `ModuleNotFoundError: No module named 'app'`
**Solution:** Make sure you're running the command from the `text-to-speech` directory.

**Issue:** `Port already in use`
**Solution:** Change the port using `--port 8003` or kill the process using the port.

**Issue:** `CORS errors in browser`
**Solution:** The API has CORS enabled for all origins. Check your frontend URL.

### Logs
Enable debug logging:
```bash
uvicorn app.main:app --reload --log-level debug
```

## 📊 Performance

- **Average Response Time**: ~200ms for short texts
- **Maximum Text Length**: 10,000 characters
- **Supported Audio Format**: MP3 (MPEG Audio Layer III)
- **Concurrent Requests**: Supports multiple simultaneous requests
