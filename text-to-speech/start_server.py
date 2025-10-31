#!/usr/bin/env python
"""
Startup script for the Learn Buddy Text-to-Speech API server
"""

import uvicorn
import os
from app.main import app

if __name__ == "__main__":
    # Get port from environment variable or use default
    port = int(os.environ.get("PORT", 8003))
    
    print("🚀 Starting Learn Buddy Text-to-Speech API Server...")
    print(f"📍 Server will be available at: http://localhost:{port}")
    print(f"📖 API Documentation: http://localhost:{port}/docs")
    print("💡 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=port,
        reload=True,
        log_level="info"
    )