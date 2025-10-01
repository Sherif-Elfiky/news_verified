@echo off
echo 🚀 Starting News Verified Development Environment
echo ==================================================

echo 📡 Starting Backend (FastAPI)...
cd news_verified_backend
call venv\Scripts\activate
start "Backend" cmd /k "uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
cd ..

timeout /t 3 /nobreak >nul

echo 🌐 Starting Frontend (Next.js)...
cd news_verified_frontend
start "Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ✅ Both services are starting up!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
