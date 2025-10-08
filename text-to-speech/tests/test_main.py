import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert "Enhanced Text to Speech API is running" in response.json()["message"]

def test_text_to_speech_empty():
    response = client.post("/tts", data={"text": ""})
    assert response.status_code == 400
    assert "Text cannot be empty" in response.json()["detail"]

def test_text_to_speech_valid():
    response = client.post("/tts", data={"text": "Hello, this is a test"})
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/mpeg"
    assert "content-disposition" in response.headers
