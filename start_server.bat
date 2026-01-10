@echo off
cd server
if not exist node_modules (
    echo Installing server dependencies...
    call npm install
)
echo.
echo Starting Automation Server...
echo (Keep this window open to run Active Monitor checks)
echo.
node server.js
pause
