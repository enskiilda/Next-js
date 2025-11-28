# Installation Guide

## Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- pip package manager

## Installation

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies and Build

```bash
npm install
npm run build
```

### 3. Start the Application

```bash
cd backend
bash start.sh
```

The application will be available at `http://localhost:8080`.

## Development Mode

To run in development mode with hot reloading:

```bash
cd backend
python -m uvicorn open_webui.main:app --host 0.0.0.0 --port 8080 --reload
```

## Using Make Commands

```bash
make install    # Install all dependencies
make start      # Start the application
make dev        # Start in development mode with reload
make update     # Update the application
```

## Environment Variables

See `.env.example` for available configuration options.

Key variables:
- `OLLAMA_BASE_URL` - URL for Ollama backend (default: http://localhost:11434)
- `OPENAI_API_KEY` - API key for OpenAI integration
- `WEBUI_SECRET_KEY` - Secret key for session management

