@echo off
setlocal
cd /d "%~dp0"

if not exist ".env" (
  if exist ".env.example" copy ".env.example" ".env" >nul
  echo Created .env from .env.example.
  echo Please edit .env and set DEEPSEEK_API_KEY before using AI card generation.
  echo The review app can still start without the key.
  echo.
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found in PATH.
  echo Please install Node.js or add it to PATH, then run this file again.
  pause
  exit /b 1
)

start "Java Memory Cards Server" cmd /k "cd /d "%~dp0" && node server.js"
timeout /t 2 /nobreak >nul
start "" "http://localhost:8787/interview.html"
endlocal
