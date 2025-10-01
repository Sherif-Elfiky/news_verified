# News Verified

A full-stack application for verifying news articles using AI summarization.

## Quick Start

### Option 1: Run Everything at Once (Recommended)

**On macOS/Linux:**
```bash
./run_dev.sh
```

**On Windows:**
```cmd
run_dev.bat
```

### Option 2: Manual Setup

1. **Start Backend:**
   ```bash
   cd news_verified_backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Start Frontend:**
   ```bash
   cd news_verified_frontend
   npm run dev
   ```

## Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## Features

- Paste any news article URL
- AI-powered summarization using Facebook's BART model
- Clean, responsive UI
- Real-time verification status

## Troubleshooting

If you encounter issues:

1. **Backend not starting:** Make sure the virtual environment is activated and all dependencies are installed
2. **Frontend not starting:** Run `npm install` in the frontend directory
3. **CORS errors:** Ensure the backend is running on port 8000 and frontend on port 3000
4. **Model loading issues:** The first run may take time to download the BART model

## Project Structure

```
news_verified/
├── news_verified_backend/     # FastAPI backend
│   ├── main.py               # Main application file
│   └── venv/                 # Python virtual environment
├── news_verified_frontend/    # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── package.json
├── run_dev.sh               # Development script (macOS/Linux)
├── run_dev.bat             # Development script (Windows)
└── README.md
```
