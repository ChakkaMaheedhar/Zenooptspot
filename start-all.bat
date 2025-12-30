@echo off
title ZenoOptSpot - Full Stack Development

REM Start backend in a new window (using venv python)
echo Starting backend server...
start "Backend - FastAPI (8001)" cmd /k "cd /d %CD%\public\backend && venv_310\Scripts\python.exe -m uvicorn src.main:app --host 127.0.0.1 --port 8001 || pause"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend in current window
echo Starting frontend server...
npm run dev:frontend
