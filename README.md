# My Learn Buddy - Learning Platform

This project is a modern learning application, "My Learn Buddy," built using a microservices architecture. The frontend is a React application, and the backend functionalities are split into independent, single-purpose services.

## Architecture Overview

The application is decoupled into two main parts:

1.  **Frontend Application (`/frontend`)**: A client-facing React application that provides the user interface. It is responsible for all the UI/UX and communicates with the backend microservices via API calls.

2.  **Backend Microservices (`/text-to-speech`, etc.)**: Each backend feature is its own independent service. This allows for scalability, independent development, and fault isolation. For example, the text-to-speech functionality is a self-contained Python/FastAPI service.

### How It Works

1.  The user opens the **React Frontend** in their browser.
2.  When the user interacts with a feature (e.g., enters text and clicks "Play Speech"), the frontend makes an API request to the specific microservice responsible for that feature.
3.  The **Text-to-Speech Microservice**, running independently, receives the request, processes the text using its libraries, and sends back the audio data.
4.  The frontend receives the audio data and plays it for the user.

This separation means we can update, deploy, or scale the text-to-speech service without affecting the frontend or any other future microservice.

---

## Getting Started

To run the full application locally, you need to run both the frontend and the backend microservice(s) simultaneously in separate terminals.

### 1. Run the Backend (Text-to-Speech Microservice)

This service handles converting text into speech.

```bash
# Navigate to the text-to-speech service directory
cd text-to-speech

# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --reload
```

The backend will now be running, typically at `http://127.0.0.1:8000`.

### 2. Run the Frontend (React App)

This is the user interface you will interact with.

```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm start
```

The frontend will open in your browser, typically at `http://localhost:3000`. You can now use the application.