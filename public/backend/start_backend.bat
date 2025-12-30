@echo off
setlocal enabledelayedexpansion

set PYTHONPATH=C:\Users\chakk\OneDrive\Desktop\Zenooptspot\Zenooptspot\public\backend
cd /d "C:\Users\chakk\OneDrive\Desktop\Zenooptspot\Zenooptspot\public\backend"

echo Starting FastAPI Backend on port 8001...
py -3.10 -m uvicorn src.main:app --host 127.0.0.1 --port 8001

pause
