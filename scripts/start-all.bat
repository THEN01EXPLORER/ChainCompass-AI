@echo off
echo ========================================
echo Starting ChainCompass AI Full Stack
echo ========================================
echo.

echo [1/2] Starting Backend (FastAPI)...
start "ChainCompass Backend" cmd /k "cd /d %~dp0..\backend && .venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend (Next.js)...
start "ChainCompass Frontend" cmd /k "cd /d %~dp0..\frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
