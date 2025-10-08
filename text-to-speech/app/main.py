from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import io
from gtts import gTTS
from gtts.tts import gTTSError
from pydantic import BaseModel
from typing import Optional, List
import re

app = FastAPI(
    title="Text to Speech API",
    description="Enhanced API for text to speech with advanced controls",
    version="2.0.0"
)

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request validation
class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "en"
    speed: Optional[float] = 1.0

class ChunkedTTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "en"
    speed: Optional[float] = 1.0
    chunk_type: Optional[str] = "sentence"  # "word" or "sentence"

def get_available_voices():
    """Get available voices for gTTS"""
    return [
        {'id': 'en', 'name': 'English', 'language': 'English'},
        {'id': 'es', 'name': 'Spanish', 'language': 'Spanish'},
        {'id': 'fr', 'name': 'French', 'language': 'French'},
        {'id': 'de', 'name': 'German', 'language': 'German'},
        {'id': 'it', 'name': 'Italian', 'language': 'Italian'},
        {'id': 'pt', 'name': 'Portuguese', 'language': 'Portuguese'},
        {'id': 'ru', 'name': 'Russian', 'language': 'Russian'},
        {'id': 'ja', 'name': 'Japanese', 'language': 'Japanese'},
        {'id': 'ko', 'name': 'Korean', 'language': 'Korean'},
        {'id': 'zh', 'name': 'Chinese (Mandarin)', 'language': 'Chinese'},
        {'id': 'ar', 'name': 'Arabic', 'language': 'Arabic'},
        {'id': 'hi', 'name': 'Hindi', 'language': 'Hindi'},
    ]

def tokenize_text(text: str, chunk_type: str = "sentence") -> List[dict]:
    """Tokenize text into words or sentences with positions"""
    if chunk_type == "word":
        # Split by word boundaries while preserving positions
        words = []
        pattern = r'\S+'
        for match in re.finditer(pattern, text):
            words.append({
                'text': match.group(),
                'start': match.start(),
                'end': match.end(),
                'type': 'word'
            })
        return words
    else:
        # Split by sentences
        sentences = []
        pattern = r'[.!?]+[\s]*'
        last_end = 0
        
        for match in re.finditer(pattern, text):
            sentence_text = text[last_end:match.end()].strip()
            if sentence_text:
                sentences.append({
                    'text': sentence_text,
                    'start': last_end,
                    'end': match.end(),
                    'type': 'sentence'
                })
            last_end = match.end()
        
        # Add remaining text if any
        if last_end < len(text):
            remaining_text = text[last_end:].strip()
            if remaining_text:
                sentences.append({
                    'text': remaining_text,
                    'start': last_end,
                    'end': len(text),
                    'type': 'sentence'
                })
        
        return sentences

@app.get("/")
def read_root():
    return {"message": "Enhanced Text to Speech API is running", "version": "2.0.0"}

@app.get("/voices")
async def get_voices():
    """Get available TTS voices"""
    try:
        voices = get_available_voices()
        return JSONResponse(content={"voices": voices})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get voices: {str(e)}")

@app.post("/tts")
async def text_to_speech(request: TTSRequest):
    """Convert text to speech and return audio stream"""
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
            
        # Convert text to speech with specified voice
        tts = gTTS(text=request.text, lang=request.voice, slow=(request.speed < 1.0))
        
        # Create a bytes buffer
        buf = io.BytesIO()
        
        # Write audio to buffer
        tts.write_to_fp(buf)
        
        # Reset buffer position
        buf.seek(0)
        
        # Return the audio stream
        return StreamingResponse(
            buf, 
            media_type="audio/mpeg",
            headers={
                'Content-Disposition': 'attachment; filename="speech.mp3"',
                'Cache-Control': 'no-cache'
            }
        )
        
    except gTTSError as e:
        raise HTTPException(status_code=500, detail=f"Text to speech conversion failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.post("/tts/chunked")
async def chunked_text_to_speech(request: ChunkedTTSRequest):
    """Get text chunks for highlighting during speech"""
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Tokenize the text
        chunks = tokenize_text(request.text, request.chunk_type)
        
        # Generate audio URL for the entire text
        audio_data = {
            'text': request.text,
            'voice': request.voice,
            'speed': request.speed
        }
        
        return JSONResponse(content={
            "chunks": chunks,
            "audio_config": audio_data,
            "total_chunks": len(chunks),
            "chunk_type": request.chunk_type
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process chunked TTS: {str(e)}")

@app.post("/tts/validate")
async def validate_text(text: str = Form(...)):
    """Validate text for TTS processing"""
    try:
        if not text.strip():
            return JSONResponse(content={"valid": False, "error": "Text cannot be empty"})
        
        if len(text) > 10000:  # Reasonable limit for TTS
            return JSONResponse(content={"valid": False, "error": "Text too long (max 10000 characters)"})
        
        return JSONResponse(content={
            "valid": True, 
            "character_count": len(text),
            "word_count": len(text.split()),
            "estimated_duration": len(text.split()) * 0.5  # Rough estimate: 0.5 seconds per word
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "text-to-speech"}

# Legacy endpoint for compatibility
@app.post("/tts/legacy")
async def legacy_text_to_speech(text: str = Form(...)):
    """Legacy endpoint for backward compatibility"""
    try:
        if not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
            
        # Convert text to speech
        tts = gTTS(text=text, lang='en')
        
        # Create a bytes buffer
        buf = io.BytesIO()
        
        # Write audio to buffer
        tts.write_to_fp(buf)
        
        # Reset buffer position
        buf.seek(0)
        
        # Return the audio stream
        return StreamingResponse(
            buf, 
            media_type="audio/mpeg",
            headers={
                'Content-Disposition': 'attachment; filename="speech.mp3"'
            }
        )
        
    except gTTSError as e:
        raise HTTPException(status_code=500, detail=f"Text to speech conversion failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
