from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import io
from gtts import gTTS
from gtts.tts import gTTSError

app = FastAPI(
    title="Text to Speech API",
    description="A simple API that converts text to speech",
    version="1.0.0"
)

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Text to Speech API is running. Send POST requests to /tts endpoint."}

@app.post("/tts")
async def text_to_speech(text: str = Form(...)):
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
