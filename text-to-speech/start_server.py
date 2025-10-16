#!/usr/bin/env python
"""
Startup script for the Learn Buddy Text-to-Speech API server
"""

import uvicorn
from app.main import app

if __name__ == "__main__":
    print("🚀 Starting Learn Buddy Text-to-Speech API Server...")
    print("📍 Server will be available at: http://localhost:8003")
    print("📖 API Documentation: http://localhost:8003/docs")
    print("💡 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=8003,
        reload=True,
        log_level="info"
    )